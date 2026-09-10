async function sendJson(method, url, payload) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Something went wrong. Please try again.");
  }
  return res.json();
}

function postJson(url, payload) {
  return sendJson("POST", url, payload);
}

export async function submitLead(payload) {
  return postJson("/api/leads", payload);
}

// Credit score soft-pull: OTP is mocked server-side until the ROOPYA API is
// connected (see server/creditScore.js). This client contract will not need
// to change when the real API is wired up.
export async function requestCreditScoreOtp(payload) {
  return postJson("/api/credit-score/request-otp", payload);
}

export async function resendCreditScoreOtp(requestId) {
  return postJson("/api/credit-score/resend-otp", { requestId });
}

export async function verifyCreditScoreOtp(payload) {
  return postJson("/api/credit-score/verify-otp", payload);
}

// Bank rates: powers the homepage ticker and every loan product page's bank
// selector. getRates is public; the rest require an authenticated admin
// session (see server/rates.js and the internal-leads-portal Rates tab).
export async function getRates() {
  const res = await fetch("/api/rates");
  if (!res.ok) throw new Error("Could not load bank rates");
  return res.json();
}

export function addBankRate(payload) {
  return sendJson("POST", "/api/rates", payload);
}

export function updateBankRate(id, rate) {
  return sendJson("PUT", `/api/rates/${id}`, { rate });
}

export function deleteBankRate(id) {
  return sendJson("DELETE", `/api/rates/${id}`);
}
