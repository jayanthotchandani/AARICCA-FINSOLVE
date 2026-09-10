import jwt from "jsonwebtoken";
import { findUserByUsername, findUserById, verifyPassword } from "./users.js";

const COOKIE_NAME = "aaricca_admin_session";
const SESSION_DURATION = "12h";

export function authenticateUser(username, password) {
  const user = findUserByUsername(username);
  if (!user) return null;
  if (!verifyPassword(user, password)) return null;
  return { id: user.id, username: user.username, role: user.role };
}

export function issueSession(res, user) {
  // The JWT only needs to carry `id` — everything else (username, role) is
  // re-read from the users table on every request (see getFreshUser below),
  // so a revoked or role-changed account takes effect immediately instead
  // of staying valid until this token's 12h expiry.
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: SESSION_DURATION });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 12 * 60 * 60 * 1000,
  });
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME);
}

// Re-derives the session from the users table on every call rather than
// trusting the JWT's own claims — the token is just a signed pointer to a
// row. This is what makes deleting or demoting a teammate (server/users.js)
// take effect on their very next request instead of silently staying valid
// for up to 12h. It also means a stale pre-deploy token (old shape, no
// `id`) safely resolves to "not authenticated" rather than a crash.
function getFreshUser(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
  if (!payload?.id) return null;
  const user = findUserById(payload.id);
  return user ? { id: user.id, username: user.username, role: user.role } : null;
}

export function requireAuth(req, res, next) {
  const user = getFreshUser(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  req.user = user;
  next();
}

// Only the root admin and anyone they've promoted to "admin" can manage
// other user accounts (see server/users.js — the internal tool's Team tab
// hides itself entirely for a "staff" session, this is the actual gate).
export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export function getSessionUser(req) {
  const user = getFreshUser(req);
  return user ? { username: user.username, role: user.role } : null;
}
