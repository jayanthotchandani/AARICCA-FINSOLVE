import React, { useState, useMemo } from "react";
import { LOAN_TYPES } from "../data";
import { BackLink, PrimaryButton, PageHero } from "../components/ui";

function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export default function Calculators() {
  const [loanId, setLoanId] = useState("personal");
  const loan = LOAN_TYPES.find((l) => l.id === loanId);
  const [amount, setAmount] = useState(1500000);
  const [rate, setRate] = useState(11);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = years * 12;
    const m = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = m * n;
    return { monthly: m, interest: total - P, total, principalPct: (P / total) * 100 };
  }, [amount, rate, years]);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <BackLink />
      <PageHero
        title="Loan EMI & amortization calculator"
        subtitle="Pick any loan category to simulate monthly payouts and interest splits."
      />

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {LOAN_TYPES.map((l) => (
          <button
            key={l.id}
            onClick={() => setLoanId(l.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              loanId === l.id
                ? "bg-teal-dark text-white border-teal-dark"
                : "bg-white text-ink/70 border-teal/15 hover:border-teal/40"
            }`}
          >
            {l.title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border-2 border-teal/12 p-6 sm:p-8 grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Slider label="Loan Amount" value={amount} display={formatINR(amount)} min={50000} max={20000000} step={50000} onChange={setAmount} />
          <Slider label="Annual Interest Rate" value={rate} display={`${rate}%`} min={7.5} max={22} step={0.1} onChange={setRate} />
          <Slider label="Loan Tenure" value={years} display={`${years} Years`} min={1} max={30} step={1} onChange={setYears} />
        </div>
        <div className="bg-teal-dark text-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gold font-semibold">Calculated Monthly EMI</p>
            <p className="font-display font-bold text-4xl mt-1 tabular-nums">{formatINR(result.monthly)}</p>
          </div>
          <div className="mt-6 space-y-2 text-sm border-t border-white/15 pt-4">
            <div className="flex justify-between"><span className="text-cream/70">Principal</span><span className="font-semibold tabular-nums">{formatINR(amount)}</span></div>
            <div className="flex justify-between"><span className="text-cream/70">Total Interest</span><span className="font-semibold tabular-nums text-gold">{formatINR(result.interest)}</span></div>
            <div className="flex justify-between"><span className="text-cream/70">Total Payable</span><span className="font-semibold tabular-nums">{formatINR(result.total)}</span></div>
          </div>
          <div className="mt-4">
            <div className="h-2.5 rounded-full bg-gold/40 overflow-hidden flex">
              <div className="h-full bg-white" style={{ width: `${result.principalPct}%` }} />
            </div>
          </div>
          <PrimaryButton to={`/loans/${loan.id}`} className="mt-5 !bg-white !text-teal-dark hover:!bg-cream" full>
            Apply for this {loan.title}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, display, min, max, step, onChange }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs font-bold text-teal-dark">{label}</span>
        <span className="text-sm font-bold text-ink tabular-nums bg-surface px-2.5 py-0.5 rounded border border-teal/15">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full cursor-pointer" />
    </div>
  );
}
