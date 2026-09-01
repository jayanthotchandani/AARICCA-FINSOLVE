import jwt from "jsonwebtoken";

const COOKIE_NAME = "aaricca_admin_session";
const SESSION_DURATION = "12h";

export function checkCredentials(username, password) {
  return username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

export function issueSession(res) {
  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: SESSION_DURATION });
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

export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired" });
  }
}

export function isAuthed(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
