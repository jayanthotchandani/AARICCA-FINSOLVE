import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { insertLead, listLeads, deleteLead } from "./db.js";
import { authenticateUser, issueSession, clearSession, requireAuth, requireAdmin, getSessionUser } from "./auth.js";
import { listUsers, addUser, deleteUser } from "./users.js";
import { requestOtp, resendOtp, verifyOtp } from "./creditScore.js";
import { listRatesByLoan, addRate, updateRate, deleteRate } from "./rates.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// --- Live updates: a simple Server-Sent Events broadcast, no extra library ---
const sseClients = new Set();
function broadcastNewLead(lead) {
  const payload = `data: ${JSON.stringify(lead)}\n\n`;
  for (const client of sseClients) client.write(payload);
}

// --- Public: any visitor-facing form on the site posts here ---
app.post("/api/leads", (req, res) => {
  const { source, name, phone, email, loanType, amount, details } = req.body || {};
  const validSources = ["apply", "debt_consolidation", "check_score"];
  if (!validSources.includes(source)) {
    return res.status(400).json({ error: "Invalid source" });
  }
  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required" });
  }
  const lead = insertLead({ source, name, phone, email, loanType, amount, details });
  broadcastNewLead(lead);
  res.status(201).json({ ok: true, id: lead.id });
});

// --- Public: bank rates powering the homepage ticker and every loan
// product page's bank selector. Editable from the internal admin tool
// (see the protected /api/rates routes below) so rates can be updated
// without a code change or redeploy. ---
app.get("/api/rates", (req, res) => {
  res.json(listRatesByLoan());
});

// --- Credit score: soft-pull OTP flow (mocked until ROOPYA API is connected) ---
app.post("/api/credit-score/request-otp", (req, res) => {
  try {
    const { requestId, maskedPhone } = requestOtp(req.body || {});
    res.json({ ok: true, requestId, maskedPhone });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/credit-score/resend-otp", (req, res) => {
  try {
    const { requestId, maskedPhone } = resendOtp((req.body || {}).requestId);
    res.json({ ok: true, requestId, maskedPhone });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/credit-score/verify-otp", (req, res) => {
  try {
    const result = verifyOtp(req.body || {});
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Auth ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = authenticateUser(username, password);
  if (!user) {
    return res.status(401).json({ error: "Incorrect username or password" });
  }
  issueSession(res, user);
  res.json({ ok: true });
});

app.post("/api/auth/logout", (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  const user = getSessionUser(req);
  res.json({ authenticated: !!user, user });
});

// --- Team accounts: admin-only. The root admin (from .env) is the only
// account that starts with access; they use this to create logins for
// teammates, who get "staff" role — everything except this Team tab itself. ---
app.get("/api/users", requireAuth, requireAdmin, (req, res) => {
  res.json(listUsers());
});

app.post("/api/users", requireAuth, requireAdmin, (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: "Username and a password of at least 6 characters are required" });
  }
  try {
    const user = addUser({ username: username.trim(), password, role });
    res.status(201).json(user);
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: `"${username}" is already taken` });
    }
    res.status(500).json({ error: "Could not create the account" });
  }
});

app.delete("/api/users/:id", requireAuth, requireAdmin, (req, res) => {
  const result = deleteUser(Number(req.params.id));
  if (!result.ok) return res.status(400).json({ error: result.error });
  res.json({ ok: true });
});

// --- Protected: the internal dashboard reads from here ---
app.get("/api/leads", requireAuth, (req, res) => {
  const { from, to, source } = req.query;
  res.json(listLeads({ from, to, source }));
});

app.get("/api/leads/stream", requireAuth, (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write("retry: 3000\n\n");
  sseClients.add(res);
  req.on("close", () => sseClients.delete(res));
});

app.delete("/api/leads/:id", requireAuth, (req, res) => {
  const ok = deleteLead(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Lead not found" });
  res.json({ ok: true });
});

app.post("/api/rates", requireAuth, (req, res) => {
  const { loanId, bankName, rate } = req.body || {};
  if (!loanId || !bankName || typeof rate !== "number" || rate <= 0) {
    return res.status(400).json({ error: "loanId, bankName, and a positive rate are required" });
  }
  try {
    const row = addRate({ loanId, bankName, rate });
    res.status(201).json(row);
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: `${bankName} already has a rate for this loan type` });
    }
    res.status(500).json({ error: "Could not add bank rate" });
  }
});

app.put("/api/rates/:id", requireAuth, (req, res) => {
  const { rate } = req.body || {};
  if (typeof rate !== "number" || rate <= 0) {
    return res.status(400).json({ error: "A positive rate is required" });
  }
  const row = updateRate(Number(req.params.id), rate);
  if (!row) return res.status(404).json({ error: "Rate not found" });
  res.json(row);
});

app.delete("/api/rates/:id", requireAuth, (req, res) => {
  const ok = deleteRate(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Rate not found" });
  res.json({ ok: true });
});

app.get("/api/leads/export.csv", requireAuth, (req, res) => {
  const { from, to, source } = req.query;
  const rows = listLeads({ from, to, source });

  const header = ["ID", "Date", "Source", "Name", "Phone", "Email", "Loan Type", "Amount", "Details"];
  const csvEscape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [header.map(csvEscape).join(",")];
  for (const r of rows) {
    lines.push(
      [r.id, r.created_at, r.source, r.name, r.phone, r.email, r.loan_type, r.amount, r.details_json]
        .map(csvEscape)
        .join(",")
    );
  }
  const csv = lines.join("\r\n");

  const fromLabel = from ? from.slice(0, 10) : "all";
  const toLabel = to ? to.slice(0, 10) : "all";
  res.set({
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="aaricca-leads-${fromLabel}-to-${toLabel}.csv"`,
  });
  res.send(csv);
});

// --- Production: serve the built frontend from the same server ---
app.use(express.static(distDir));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Aaricca leads API listening on http://localhost:${PORT}`);
});
