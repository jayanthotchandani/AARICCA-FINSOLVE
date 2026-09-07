import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(process.env.DB_PATH || path.join(__dirname, "leads.db"));

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    source TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    loan_type TEXT,
    amount TEXT,
    details_json TEXT
  )
`);

const insertStmt = db.prepare(`
  INSERT INTO leads (created_at, source, name, phone, email, loan_type, amount, details_json)
  VALUES (@created_at, @source, @name, @phone, @email, @loan_type, @amount, @details_json)
`);

export function insertLead(lead) {
  const created_at = new Date().toISOString();
  const row = {
    created_at,
    source: lead.source,
    name: lead.name,
    phone: lead.phone,
    email: lead.email || null,
    loan_type: lead.loanType || null,
    amount: lead.amount || null,
    details_json: lead.details ? JSON.stringify(lead.details) : null,
  };
  const info = insertStmt.run(row);
  return { id: info.lastInsertRowid, ...row };
}

export function listLeads({ from, to, source } = {}) {
  let query = "SELECT * FROM leads WHERE 1=1";
  const params = {};
  if (from) {
    query += " AND created_at >= @from";
    params.from = from;
  }
  if (to) {
    query += " AND created_at <= @to";
    params.to = to;
  }
  if (source) {
    query += " AND source = @source";
    params.source = source;
  }
  query += " ORDER BY id DESC";
  return db.prepare(query).all(params);
}

export function deleteLead(id) {
  const info = db.prepare("DELETE FROM leads WHERE id = ?").run(id);
  return info.changes > 0;
}

export default db;
