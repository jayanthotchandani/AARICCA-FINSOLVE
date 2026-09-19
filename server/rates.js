import db from "./db.js";

// Seed values are researched market rates, current as of Sept 2026 (see
// src/data.js's RATE_BENCHMARK_UPDATED_AT comment for sourcing notes) —
// favoring whichever lenders currently publish the lowest starting rate per
// category, PSU and private alike, so the site's live rates come from the
// database and are editable from the internal admin tool, without needing a
// developer to change and redeploy code. The client still ships this same
// list as a fallback (src/data.js) so the site never shows an empty state on
// first paint, before the live /api/rates fetch resolves.
const SEED_RATES = {
  personal: [
    ["Axis Bank", 8.75],
    ["Bank of Maharashtra", 8.75],
    ["HDFC Bank", 9.99],
    ["ICICI Bank", 9.99],
    ["IDFC FIRST Bank", 9.99],
    ["State Bank of India", 10.0],
    ["Bank of Baroda", 10.15],
    ["Punjab National Bank", 10.25],
    ["Bank of India", 10.85],
    ["Yes Bank", 10.85],
  ],
  home: [
    ["Bank of Maharashtra", 7.0],
    ["Central Bank of India", 7.0],
    ["Bank of India", 7.1],
    ["Canara Bank", 7.15],
    ["Bank of Baroda", 7.2],
    ["State Bank of India", 7.25],
    ["Punjab National Bank", 7.4],
    ["UCO Bank", 7.5],
    ["ICICI Bank", 7.55],
    ["Kotak Mahindra Bank", 7.6],
  ],
  business: [
    ["Bank of Baroda", 8.15],
    ["Indian Bank", 8.15],
    ["Punjab National Bank", 8.25],
    ["State Bank of India", 9.1],
    ["Canara Bank", 9.25],
    ["Bank of India", 9.35],
    ["Union Bank of India", 9.4],
    ["Kotak Mahindra Bank", 9.5],
    ["Shriram Finance", 10.0],
    ["South Indian Bank", 10.65],
  ],
  lap: [
    ["Canara Bank", 8.25],
    ["State Bank of India", 8.95],
    ["HDFC Bank", 9.0],
    ["IDFC FIRST Bank", 9.0],
    ["Punjab National Bank", 9.05],
    ["Axis Bank", 9.25],
    ["Kotak Mahindra Bank", 9.25],
    ["Bank of Baroda", 9.35],
    ["Tata Capital", 10.1],
    ["ICICI Bank", 10.6],
  ],
  education: [
    ["Bank of Maharashtra", 6.85],
    ["UCO Bank", 6.9],
    ["IDBI Bank", 6.95],
    ["Bank of India", 7.0],
    ["Canara Bank", 7.25],
    ["Punjab National Bank", 7.5],
    ["Axis Bank", 8.0],
    ["Bank of Baroda", 8.15],
    ["ICICI Bank", 8.5],
    ["State Bank of India", 9.4],
  ],
  msme: [
    ["Bank of Baroda", 7.9],
    ["State Bank of India", 8.0],
    ["Punjab National Bank", 8.25],
    ["Canara Bank", 8.45],
    ["Bank of India", 8.6],
    ["Union Bank of India", 8.75],
    ["Indian Bank", 8.9],
    ["Kotak Mahindra Bank", 9.5],
    ["HDFC Bank", 10.25],
    ["ICICI Bank", 10.78],
  ],
};

db.exec(`
  CREATE TABLE IF NOT EXISTS bank_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loan_id TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    rate REAL NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(loan_id, bank_name)
  )
`);

const seedStmt = db.prepare(`
  INSERT OR IGNORE INTO bank_rates (loan_id, bank_name, rate, updated_at)
  VALUES (@loan_id, @bank_name, @rate, @updated_at)
`);

function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM bank_rates").get();
  if (count > 0) return;
  const now = new Date().toISOString();
  const seedAll = db.transaction(() => {
    for (const [loanId, banks] of Object.entries(SEED_RATES)) {
      for (const [bank_name, rate] of banks) {
        seedStmt.run({ loan_id: loanId, bank_name, rate, updated_at: now });
      }
    }
  });
  seedAll();
}
seedIfEmpty();

export function listRatesByLoan() {
  const rows = db.prepare("SELECT * FROM bank_rates ORDER BY loan_id, rate ASC").all();
  const byLoan = {};
  for (const row of rows) {
    if (!byLoan[row.loan_id]) byLoan[row.loan_id] = [];
    byLoan[row.loan_id].push(row);
  }
  return byLoan;
}

export function addRate({ loanId, bankName, rate }) {
  const info = db
    .prepare(`INSERT INTO bank_rates (loan_id, bank_name, rate, updated_at) VALUES (?, ?, ?, ?)`)
    .run(loanId, bankName, rate, new Date().toISOString());
  return db.prepare("SELECT * FROM bank_rates WHERE id = ?").get(info.lastInsertRowid);
}

export function updateRate(id, rate) {
  const info = db
    .prepare("UPDATE bank_rates SET rate = ?, updated_at = ? WHERE id = ?")
    .run(rate, new Date().toISOString(), id);
  if (info.changes === 0) return null;
  return db.prepare("SELECT * FROM bank_rates WHERE id = ?").get(id);
}

export function deleteRate(id) {
  const info = db.prepare("DELETE FROM bank_rates WHERE id = ?").run(id);
  return info.changes > 0;
}
