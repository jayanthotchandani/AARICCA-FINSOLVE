import db from "./db.js";

// Seed values match what was previously hardcoded in src/data.js — moving
// them here means the site's live rates now live in the database and are
// editable from the internal admin tool, without needing a developer to
// change and redeploy code. The client still ships this same list as a
// fallback (src/data.js) so the site never shows an empty state on first
// paint, before the live /api/rates fetch resolves.
const SEED_RATES = {
  personal: [
    ["IDFC FIRST Bank", 9.99],
    ["HDFC Bank", 9.99],
    ["ICICI Bank", 9.99],
    ["Axis Bank", 9.99],
    ["Bajaj Finserv", 10.0],
    ["State Bank of India", 10.0],
    ["Bank of Baroda", 10.15],
    ["Punjab National Bank", 10.25],
    ["Tata Capital", 10.99],
    ["Kotak Mahindra Bank", 10.99],
  ],
  home: [
    ["HDFC Bank", 7.2],
    ["Bank of Baroda", 7.2],
    ["State Bank of India", 7.25],
    ["Bajaj Finserv", 7.4],
    ["Kotak Mahindra Bank", 7.6],
    ["ICICI Bank", 7.65],
    ["Punjab National Bank", 8.15],
    ["Axis Bank", 8.35],
    ["Tata Capital", 8.45],
    ["IDFC FIRST Bank", 8.85],
  ],
  business: [
    ["State Bank of India", 8.5],
    ["Kotak Mahindra Bank", 10.0],
    ["ICICI Bank", 10.25],
    ["Punjab National Bank", 10.35],
    ["HDFC Bank", 10.75],
    ["Axis Bank", 11.49],
    ["Tata Capital", 8.45],
    ["Bajaj Finserv", 14.0],
  ],
  lap: [
    ["Tata Capital", 8.45],
    ["IDFC FIRST Bank", 8.75],
    ["State Bank of India", 8.95],
    ["HDFC Bank", 9.5],
    ["Axis Bank", 9.5],
    ["Kotak Mahindra Bank", 9.5],
    ["ICICI Bank", 9.75],
  ],
  education: [
    ["State Bank of India", 8.05],
    ["HDFC Bank", 9.5],
    ["ICICI Bank", 9.5],
    ["Axis Bank", 10.5],
  ],
  msme: [
    ["HDFC Bank", 10.25],
    ["ICICI Bank", 10.78],
    ["State Bank of India", 11.31],
    ["Axis Bank", 11.83],
    ["Kotak Mahindra Bank", 12.36],
    ["Bank of Baroda", 12.89],
    ["Punjab National Bank", 13.42],
    ["Tata Capital", 13.94],
    ["Bajaj Finserv", 14.47],
    ["IDFC FIRST Bank", 15.0],
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
