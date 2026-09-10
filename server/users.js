import bcrypt from "bcryptjs";
import db from "./db.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff',
    is_protected INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )
`);

// The account from ADMIN_USERNAME/ADMIN_PASSWORD (.env) is the one root
// admin — re-synced on every server start so .env stays the source of truth
// for it, and marked is_protected so it can never be deleted from the UI.
// Every other account is created by that admin from the internal tool and
// lives only in this table.
//
// The lookup below is keyed on `is_protected = 1`, NOT on username — matching
// by username would let a same-named team account get silently overwritten
// and promoted to admin if ADMIN_USERNAME ever collided with (or was changed
// to match) an existing staff username. Keying on the protected row itself
// means at most one row can ever be the root admin, and only that row is
// touched; a genuine username collision is left alone and logged instead of
// clobbered.
function bootstrapRootAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;
  const protectedRow = db.prepare("SELECT id, username FROM users WHERE is_protected = 1").get();
  if (protectedRow) {
    // Skip the (cheap) hash-and-write when nothing has actually changed —
    // avoids a synchronous bcrypt hash on every single server start/restart.
    const current = db.prepare("SELECT * FROM users WHERE id = ?").get(protectedRow.id);
    if (current.username === username && bcrypt.compareSync(password, current.password_hash)) return;
    const password_hash = bcrypt.hashSync(password, 10);
    db.prepare("UPDATE users SET username = ?, password_hash = ?, role = 'admin', is_protected = 1 WHERE id = ?").run(
      username,
      password_hash,
      protectedRow.id
    );
    return;
  }
  const collision = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (collision) {
    console.error(
      `[users] ADMIN_USERNAME "${username}" collides with an existing non-root account — refusing to overwrite it. ` +
        `Rename that account or change ADMIN_USERNAME.`
    );
    return;
  }
  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare(
    `INSERT INTO users (username, password_hash, role, is_protected, created_at) VALUES (?, ?, 'admin', 1, ?)`
  ).run(username, password_hash, new Date().toISOString());
}
bootstrapRootAdmin();

const PUBLIC_COLUMNS = "id, username, role, is_protected, created_at";

export function findUserByUsername(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

export function findUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export function verifyPassword(user, password) {
  // bcrypt.compareSync throws (rather than returning false) for a
  // non-string input — a missing or wrong-typed password in the request
  // body must not reach it, or a malformed login request 500s instead of
  // cleanly 401ing.
  if (typeof password !== "string" || !password) return false;
  return bcrypt.compareSync(password, user.password_hash);
}

export function listUsers() {
  return db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY is_protected DESC, created_at ASC`).all();
}

export function addUser({ username, password, role }) {
  const password_hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare(`INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)`)
    .run(username, password_hash, role === "admin" ? "admin" : "staff", new Date().toISOString());
  return db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`).get(info.lastInsertRowid);
}

export function deleteUser(id) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!user) return { ok: false, error: "User not found" };
  if (user.is_protected) return { ok: false, error: "The root admin account can't be removed" };
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  return { ok: true };
}
