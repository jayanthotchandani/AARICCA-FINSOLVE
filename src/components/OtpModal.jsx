import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { PrimaryButton } from "./ui";

const RESEND_SECONDS = 30;

export default function OtpModal({ phone, onVerify, onResend, onClose, error, loading }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleChange(i, value) {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputsRef.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array(6).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  }

  const code = digits.join("");
  const complete = code.length === 6;

  function handleResend() {
    setDigits(Array(6).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    onResend?.();
    inputsRef.current[0]?.focus();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-teal-dark/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl shadow-raised border border-white/60 p-6 sm:p-8 fade-swap-enter">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-ink/40 hover:text-ink/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-teal" />
        </div>

        <h2 className="font-display font-bold text-lg text-teal-dark mb-1">Verify Your Mobile Number</h2>
        <p className="text-xs text-ink/60 mb-6">
          Enter the 6-digit code sent to <span className="font-semibold text-ink">{phone}</span>
        </p>

        <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-teal/25 bg-white text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-shadow"
            />
          ))}
        </div>

        {error && <p className="text-xs text-warn text-center mb-4">{error}</p>}

        <PrimaryButton full disabled={!complete || loading} onClick={() => onVerify(code)}>
          {loading ? "Verifying…" : "Verify & Continue"}
        </PrimaryButton>

        <p className="text-center text-xs text-ink/50 mt-4">
          {secondsLeft > 0 ? (
            <>Resend code in 0:{String(secondsLeft).padStart(2, "0")}</>
          ) : (
            <button type="button" onClick={handleResend} className="font-semibold text-teal hover:text-teal-dark">
              Resend Code
            </button>
          )}
        </p>

        <p className="flex items-center gap-1.5 text-[11px] text-ink/40 justify-center mt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-teal/70" /> Bank-grade encryption · soft inquiry only
        </p>
      </div>
    </div>
  );
}
