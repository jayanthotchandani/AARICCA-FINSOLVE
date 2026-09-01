import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, Lock, ShieldCheck, BadgeCheck, Loader2 } from "lucide-react";
import { LOAN_TYPES } from "../data";
import { BackLink, PrimaryButton, SecondaryButton, Field, inputClass } from "../components/ui";
import { submitLead } from "../api";

function useCountdown(startSeconds) {
  const [seconds, setSeconds] = useState(startSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds > 0]); // eslint-disable-line react-hooks/exhaustive-deps
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ApplyForm() {
  const [params] = useSearchParams();
  const defaultLoan = LOAN_TYPES.find((l) => l.id === params.get("loan"))?.title || "Personal Loan";
  const [form, setForm] = useState({ name: "", phone: "", loanType: defaultLoan, amount: "" });
  const phoneValid = /^\d{10}$/.test(form.phone);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const refId = useRef(`ARC-${Math.floor(100000 + Math.random() * 900000)}`);
  const countdown = useCountdown(30 * 60);

  if (submitted) {
    return (
      <div className="fade-swap-enter max-w-xl mx-auto px-5 sm:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-display font-bold text-2xl text-teal-dark">Application Submitted!</h1>
        <p className="mt-2 text-sm text-ink/65">
          Thank you, {form.name || "there"}. Your application is in our queue.
        </p>
        <p className="mt-1 text-xs font-semibold text-ink/50">Ref ID: {refId.current}</p>

        <div className="mt-6 bg-teal-dark text-white rounded-2xl py-5">
          <p className="text-[11px] uppercase tracking-wide text-gold font-semibold">Advisor Callback In</p>
          <p className="font-display font-bold text-4xl mt-1 tabular-nums">{countdown}</p>
        </div>

        <ul className="mt-6 space-y-2 text-left inline-block">
          {[
            "Our team reviews your eligibility",
            "We match you with best-fit banks",
            "Call you with a pre-approved offer",
            "Complete the process online in 24 hrs",
          ].map((step) => (
            <li key={step} className="flex items-center gap-2 text-sm text-ink/70">
              <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
              {step}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <SecondaryButton to="/" className="text-sm">Track Application</SecondaryButton>
          <PrimaryButton to="/faqs" className="text-sm">
            <MessageCircle className="w-4 h-4" /> Chat / Call Us
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-5 sm:px-8 py-12">
      <BackLink />
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-teal-dark">Get My Instant Approval</h1>
        <p className="mt-2 text-sm text-ink/65">Four fields. Everything else, our advisor asks personally on the call.</p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-teal/15 p-6 sm:p-8">
        <div className="h-1.5 bg-surface rounded-full overflow-hidden mb-6">
          <div className="h-full w-1/2 bg-teal rounded-full" />
        </div>
        <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wide">Step 1 of 2</span>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setSubmitting(true);
            try {
              await submitLead({
                source: "apply",
                name: form.name,
                phone: form.phone,
                loanType: form.loanType,
                amount: form.amount,
              });
              setSubmitted(true);
            } catch (err) {
              setError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
          className="mt-3 space-y-4"
        >
          <Field label="Full Name" required>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Rajesh Sharma"
              className={inputClass}
            />
          </Field>
          <Field label="Mobile Number (+91)" required>
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              placeholder="98290XXXXX"
              className={inputClass}
            />
            {form.phone.length > 0 && !phoneValid && (
              <p className="text-[11px] text-warn mt-1">Enter a valid 10-digit mobile number.</p>
            )}
          </Field>
          <Field label="Loan Type" required>
            <select
              value={form.loanType}
              onChange={(e) => setForm({ ...form, loanType: e.target.value })}
              className={inputClass}
            >
              {LOAN_TYPES.map((l) => (
                <option key={l.id}>{l.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Required Loan Amount (₹)" required>
            <input
              required
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="15,00,000"
              className={inputClass}
            />
          </Field>
          {error && <p className="text-xs text-warn text-center">{error}</p>}
          <PrimaryButton type="submit" full disabled={submitting || !phoneValid}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Get My Instant Approval"
            )}
          </PrimaryButton>
        </form>
        <p className="mt-4 text-[11px] text-ink/45 text-center">
          Everything else — income, employment, existing debts — is asked personally by your advisor on
          the follow-up call, not on this form.
        </p>
        <div className="flex justify-center gap-4 mt-3 text-[11px] text-ink/50">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> 100% Secure</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 256-bit SSL</span>
          <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> RBI Regulated</span>
        </div>
      </div>
    </div>
  );
}
