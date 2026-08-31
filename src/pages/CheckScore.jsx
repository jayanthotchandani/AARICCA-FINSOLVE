import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { SCORE_TIERS } from "../data";
import { BackLink, PrimaryButton, SecondaryButton, Field, inputClass } from "../components/ui";
import ScoreGauge, { tierForScore } from "../components/ScoreGauge";

const TIER_STYLES = {
  excellent: { bg: "#EAF6F5", border: "#1B7F7E33", text: "#155F5E" },
  good: { bg: "#EEF7F6", border: "#2E9C9A33", text: "#1B7F7E" },
  fair: { bg: "#FBF2E8", border: "#D4A57444", text: "#B8865A" },
  poor: { bg: "#FDECEA", border: "#F4433633", text: "#C0392B" },
};

export default function CheckScore() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", income: "80000", employment: "salaried" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const inc = parseInt(form.income, 10) || 50000;
      const score = inc > 100000 ? 795 : inc > 60000 ? 742 : 668;
      setResult(score);
      setLoading(false);
    }, 700);
  }

  const tier = result ? tierForScore(result) : null;

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <BackLink />
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-display font-bold text-h1-sm sm:text-h1 text-teal-dark">Free Credit Score Check &amp; Advisory</h1>
        <p className="mt-3 text-ink/70 text-sm sm:text-base">
          Discover your bureau health score and unlock pre-approved rates — zero impact to your credit file.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-8 mb-8">
        <h2 className="font-display font-semibold text-teal-dark mb-1">Understanding the score bands (300–900)</h2>
        <p className="text-xs text-ink/60 mb-5">Banks evaluate repayment discipline across four bureau tiers:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCORE_TIERS.map((t) => {
            const s = TIER_STYLES[t.tone];
            return (
              <div key={t.label} className="p-4 rounded-xl border" style={{ backgroundColor: s.bg, borderColor: s.border }}>
                <p className="text-xs font-extrabold uppercase" style={{ color: s.text }}>
                  {t.range} — {t.label}
                </p>
                <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: s.text }}>
                  {t.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-teal/15 p-6 sm:p-8">
        {!result ? (
          <>
            <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wide">Step 1 of 2</span>
            <h2 className="font-display font-bold text-xl text-teal-dark mt-0.5 mb-1">Enter details to view your bureau score</h2>
            <p className="text-xs text-ink/60 mb-5">Bank-grade encryption. This is a soft pull and will not impact your score.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Legal Name" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className={inputClass}
                  />
                </Field>
                <Field label="Mobile Number" required>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="98290XXXXX"
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Email ID" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@domain.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Employment Type">
                  <select
                    value={form.employment}
                    onChange={(e) => setForm({ ...form, employment: e.target.value })}
                    className={inputClass}
                  >
                    <option value="salaried">Salaried Professional</option>
                    <option value="business">Business / Self-Employed</option>
                    <option value="professional">Doctor / CA / Lawyer</option>
                  </select>
                </Field>
                <Field label="Monthly In-Hand Salary (₹)" required>
                  <input
                    required
                    type="number"
                    value={form.income}
                    onChange={(e) => setForm({ ...form, income: e.target.value })}
                    placeholder="80000"
                    className={inputClass}
                  />
                </Field>
              </div>
              <PrimaryButton type="submit" full>
                {loading ? "Generating your report…" : "Unlock My Free Credit Report & Bank Pre-Approvals"}
              </PrimaryButton>
              <p className="flex items-center gap-1.5 text-[11px] text-ink/50 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-teal" /> 256-bit secure · soft inquiry only
              </p>
            </form>
          </>
        ) : (
          <div className="fade-swap-enter grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center text-center">
              <ScoreGauge score={result} />
              <div className="mt-3 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: tier.bg, color: tier.color }}>
                {tier.label} — {tier.note}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink mb-3">Matched pre-approved offers for {form.name || "you"}:</p>
              <div className="space-y-2">
                {[
                  ["Personal Loan", "Up to ₹25 Lakhs @ 10.99%"],
                  ["Home Loan", "Up to ₹1.5 Crores @ 8.40%"],
                ].map(([title, sub]) => (
                  <div key={title} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-teal/10">
                    <div>
                      <p className="text-sm font-bold text-teal-dark">{title}</p>
                      <p className="text-xs text-ink/60">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <PrimaryButton to="/apply" className="text-xs">Apply Now</PrimaryButton>
                <SecondaryButton to="/credit-score/improve" className="text-xs">Improve My Score</SecondaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
