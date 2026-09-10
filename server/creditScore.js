import crypto from "node:crypto";

// TODO(ROOPYA): This module fakes the credit-bureau pull until ROOPYA's API
// credentials are live. `requestOtp` and `verifyOtp` are the only two
// functions that need to change — the route handlers in index.js and the
// entire frontend flow (form -> OTP modal -> result) already expect exactly
// this request/response shape, so swapping in the real API is a one-file change.

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const OTP_TTL_MS = 5 * 60 * 1000;

const pending = new Map(); // requestId -> { otp, expiresAt, payload }

function maskPhone(phone) {
  return phone.replace(/^(\d{2})\d{6}(\d{2})$/, "$1XXXXXX$2");
}

export function requestOtp({ name, pan, dob, phone, email }) {
  if (!name || !name.trim()) throw new Error("Full legal name is required");
  if (!PAN_RE.test((pan || "").toUpperCase())) throw new Error("Enter a valid PAN (e.g. ABCDE1234F)");
  if (!dob) throw new Error("Date of birth is required");
  if (!/^\d{10}$/.test(phone || "")) throw new Error("Enter a valid 10-digit mobile number");

  const requestId = crypto.randomUUID();
  const otp = String(crypto.randomInt(100000, 999999));

  pending.set(requestId, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    payload: { name: name.trim(), pan: pan.toUpperCase(), dob, phone, email },
  });

  // TODO(ROOPYA): replace this console.log with the real bureau-triggered
  // SMS dispatch once the API is wired up (ROOPYA sends the OTP itself).
  console.log(`[credit-score] OTP for ${maskPhone(phone)}: ${otp}`);

  return { requestId, maskedPhone: maskPhone(phone) };
}

export function resendOtp(requestId) {
  const entry = pending.get(requestId);
  if (!entry) throw new Error("This session has expired. Please start again.");
  entry.otp = String(crypto.randomInt(100000, 999999));
  entry.expiresAt = Date.now() + OTP_TTL_MS;

  console.log(`[credit-score] Resent OTP for ${maskPhone(entry.payload.phone)}: ${entry.otp}`);

  return { requestId, maskedPhone: maskPhone(entry.payload.phone) };
}

export function verifyOtp({ requestId, otp }) {
  const entry = pending.get(requestId);
  if (!entry) throw new Error("This code has expired. Please request a new one.");
  if (Date.now() > entry.expiresAt) {
    pending.delete(requestId);
    throw new Error("This code has expired. Please request a new one.");
  }
  if (entry.otp !== otp) throw new Error("Incorrect code. Please try again.");

  pending.delete(requestId);

  // TODO(ROOPYA): replace this deterministic mock with the real bureau
  // response, e.g. `const report = await roopya.fetchScore(entry.payload)`,
  // and return whatever score/tier/offer fields the real API gives back.
  const seed = entry.payload.pan.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const score = 640 + (seed % 260); // deterministic 640-900 mock, stable per PAN

  return { score, name: entry.payload.name };
}
