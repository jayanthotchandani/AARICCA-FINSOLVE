import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { insertLead, listLeads } from "./db.js";
import { checkCredentials, issueSession, clearSession, requireAuth, isAuthed } from "./auth.js";

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

// --- Auth ---
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!checkCredentials(username, password)) {
    return res.status(401).json({ error: "Incorrect username or password" });
  }
  issueSession(res);
  res.json({ ok: true });
});

app.post("/api/auth/logout", (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  res.json({ authenticated: isAuthed(req) });
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

app.listen(PORT, () => {
  console.log(`Aaricca leads API listening on http://localhost:${PORT}`);
});
