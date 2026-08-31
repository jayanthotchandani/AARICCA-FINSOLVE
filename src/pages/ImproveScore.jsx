import React from "react";
import { X } from "lucide-react";
import { BackLink, PrimaryButton } from "../components/ui";

const QUICK_WINS = ["Pay off credit card balances (utilization under 30%)", "Check your CIBIL report for errors", "Set up payment reminders / auto-pay"];
const MEDIUM_TERM = ["Avoid applying for new credit", "Keep old accounts open", "Consolidate high-interest debt"];
const MISTAKES = ["Don't close old credit cards", "Don't apply for multiple loans at once", "Don't co-sign loans casually", "Don't max out cards", "Don't miss payments"];

const TIMELINE = [
  { label: "Week 1–2", gain: "+5 to +10 pts", width: "20%" },
  { label: "Week 3–4", gain: "+15 to +25 pts", width: "40%" },
  { label: "Month 2–3", gain: "+20 to +40 pts", width: "65%" },
  { label: "Month 3+", gain: "+50 to +100 pts total", width: "100%", gold: true },
];

export default function ImproveScore() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      <BackLink />
      <div className="text-center mb-10">
        <h1 className="font-display font-bold text-h1-sm sm:text-h1 text-teal-dark">Improve Your Credit Score</h1>
        <p className="mt-3 text-ink/70 text-sm sm:text-base">Simple, ranked actions — from this week to this quarter.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <ActionCard title="Quick Wins — 1–2 Weeks" items={QUICK_WINS} />
        <ActionCard title="Medium Term — 1–3 Months" items={MEDIUM_TERM} />
      </div>

      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-8 mb-8">
        <h2 className="font-display font-semibold text-teal-dark mb-5">Score improvement timeline</h2>
        <div className="space-y-4">
          {TIMELINE.map((t) => (
            <div key={t.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-ink">{t.label}</span>
                <span className={`font-bold ${t.gold ? "text-gold-dark" : "text-teal"}`}>{t.gain}</span>
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.gold ? "bg-gold" : "bg-teal"}`}
                  style={{ width: t.width }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-8 mb-10">
        <h2 className="font-display font-semibold text-teal-dark mb-4">Common mistakes to avoid</h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
          {MISTAKES.map((m) => (
            <div key={m} className="flex items-start gap-2 text-sm text-ink/75">
              <X className="w-4 h-4 text-warn shrink-0 mt-0.5" />
              {m}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <PrimaryButton to="/credit-score/check">Recheck My Credit Score</PrimaryButton>
      </div>
    </div>
  );
}

function ActionCard({ title, items }) {
  return (
    <div className="bg-white rounded-2xl border border-teal/12 p-6">
      <h3 className="font-display font-semibold text-ink mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink/70">
            <span className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
