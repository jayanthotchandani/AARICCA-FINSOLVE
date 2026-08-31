import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { ChevronDown, Check, CheckCircle2 } from "lucide-react";
import { LOAN_TYPES, BANKS_BY_LOAN } from "../data";
import { BackLink, PrimaryButton, Field, inputClass } from "../components/ui";

function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export default function LoanProductPage() {
  const { loanId } = useParams();
  const loan = LOAN_TYPES.find((l) => l.id === loanId);
  if (!loan) return <Navigate to="/" replace />;

  const banks = BANKS_BY_LOAN[loan.id];
  const [bankIdx, setBankIdx] = useState(0);
  const bank = banks[bankIdx];

  const midAmount = loan.id === "home" || loan.id === "lap" ? 5000000 : 1500000;
  const [amount, setAmount] = useState(midAmount);
  const [rate, setRate] = useState(bank.rate);
  const [tenureYears, setTenureYears] = useState(5);

  useEffect(() => {
    setRate(bank.rate);
  }, [bankIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const emi = useMemo(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = tenureYears * 12;
    if (P <= 0 || r <= 0 || n <= 0) return { monthly: 0, interest: 0, total: 0 };
    const m = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = m * n;
    return { monthly: m, interest: total - P, total };
  }, [amount, rate, tenureYears]);

  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <BackLink />

      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4">
          <loan.icon className="w-6 h-6" strokeWidth={2} />
        </div>
        <h1 className="font-display font-bold text-h1-sm sm:text-h1 text-teal-dark">{loan.title}</h1>
        <p className="mt-3 text-ink/70 text-sm sm:text-base">{loan.tagline}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <StatTile label="Amount" value={loan.amount} />
        <StatTile label="Interest Rate" value={`${loan.rateFloor}% onwards`} />
        <StatTile label="Tenure" value={loan.tenure} />
        <StatTile label="Approval Time" value={loan.approvalTime} />
      </div>

      {/* Bank selector + calculator */}
      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-8 shadow-card mb-8">
        <h2 className="font-display font-semibold text-lg text-teal-dark">Pick a bank — rate adjusts instantly</h2>
        <p className="text-xs text-ink/60 mt-1 mb-5">
          All {banks.length} partner banks in one compact control. Choose one and every number below updates to its real rate.
        </p>

        <BankSelect banks={banks} activeIdx={bankIdx} onChange={setBankIdx} />

        <div className="mt-6 grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SliderField
              label="Loan Amount"
              value={amount}
              display={formatINR(amount)}
              min={loan.id === "home" || loan.id === "lap" ? 500000 : 50000}
              max={loan.id === "home" ? 50000000 : loan.id === "lap" ? 100000000 : 4000000}
              step={loan.id === "home" || loan.id === "lap" ? 100000 : 25000}
              onChange={setAmount}
            />
            <SliderField
              label="Interest Rate"
              hint={`Range for ${bank.name}: ${loan.rateFloor}%–${(loan.rateFloor + (loan.rateCeil - loan.rateFloor) * 1.3).toFixed(2)}% (bank rate to +5%)`}
              value={rate}
              display={`${rate.toFixed(2)}%`}
              min={loan.rateFloor}
              max={loan.rateFloor + 5}
              step={0.05}
              onChange={setRate}
            />
            <SliderField
              label="Loan Tenure"
              value={tenureYears}
              display={`${tenureYears} Years`}
              min={1}
              max={loan.id === "home" ? 30 : loan.id === "lap" || loan.id === "education" ? 15 : loan.id === "business" ? 7 : 5}
              step={1}
              onChange={setTenureYears}
            />
          </div>

          <div className="bg-teal-dark text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gold font-semibold">Calculated Monthly EMI</p>
              <p className="font-display font-bold text-4xl mt-1 tabular-nums">{formatINR(emi.monthly)}</p>
            </div>
            <div className="mt-6 space-y-2 text-sm border-t border-white/15 pt-4">
              <div className="flex justify-between">
                <span className="text-cream/70">Principal Loan</span>
                <span className="font-semibold tabular-nums">{formatINR(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream/70">Total Interest</span>
                <span className="font-semibold tabular-nums text-gold">{formatINR(emi.interest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cream/70">Total Payable</span>
                <span className="font-semibold tabular-nums">{formatINR(emi.total)}</span>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-cream/60">
              {bank.name} rate: {bank.rate}% p.a. — lock this rate for 48 hours by applying below.
            </p>
          </div>
        </div>
      </div>

      {/* Eligibility form */}
      <div className="bg-white rounded-2xl border-2 border-teal/15 p-6 sm:p-8">
        {submitted ? (
          <div className="fade-swap-enter text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-teal mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg text-teal-dark">You're on the list.</h3>
            <p className="text-sm text-ink/65 mt-1">An advisor reviews your profile personally and calls within 30 minutes.</p>
          </div>
        ) : (
          <>
            <h3 className="font-display font-semibold text-lg text-teal-dark">Eligibility &amp; quick quote</h3>
            <p className="text-xs text-ink/60 mt-1 mb-5">
              Data collection only — this does not auto-score or auto-reject you. An advisor reviews your full profile personally.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" required>
                  <input required type="text" placeholder="e.g. Rajesh Sharma" className={inputClass} />
                </Field>
                <Field label="Mobile Number (+91)" required>
                  <input required type="tel" placeholder="98290XXXXX" className={inputClass} />
                </Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Monthly Income (₹)" required>
                  <input required type="number" placeholder="75,000" className={inputClass} />
                </Field>
                <Field label="Employment Type">
                  <select className={inputClass} defaultValue="Salaried">
                    <option>Salaried</option>
                    <option>Business / Self-Employed</option>
                    <option>Doctor / CA / Lawyer</option>
                  </select>
                </Field>
                <Field label="Existing Debts (₹)" hint="Optional">
                  <input type="number" placeholder="Optional" className={inputClass} />
                </Field>
              </div>
              <PrimaryButton type="submit" full>
                Get Best Options from Our Advisor
              </PrimaryButton>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-ink/55 pt-1">
                <li className="flex items-center gap-1"><Check className="w-3 h-3 text-teal" /> Soft inquiry — no impact to your score</li>
                <li className="flex items-center gap-1"><Check className="w-3 h-3 text-teal" /> Advisor calls within 30 minutes</li>
                <li className="flex items-center gap-1"><Check className="w-3 h-3 text-teal" /> Compare all bank options at once</li>
              </ul>
            </form>
          </>
        )}
      </div>

      <p className="text-center text-xs text-ink/45 mt-8">
        Looking for something else? <Link to="/calculators" className="text-teal hover:underline">Try the general calculator</Link> or{" "}
        <Link to="/debt-consolidation" className="text-teal hover:underline">consolidate existing debt</Link>.
      </p>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-teal/12 px-4 py-3.5 text-center">
      <p className="font-display font-bold text-sm sm:text-base text-teal-dark">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-ink/50 mt-0.5">{label}</p>
    </div>
  );
}

function BankSelect({ banks, activeIdx, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = banks[activeIdx];

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-teal/25 bg-white hover:border-teal/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="w-5 h-5 rounded-full bg-teal/10 text-teal flex items-center justify-center">
            <Check className="w-3 h-3" strokeWidth={3} />
          </span>
          {active.name}
          <span className="text-teal font-bold">{active.rate}%</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-ink/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        data-open={open}
        style={{ "--menu-origin": "top" }}
        className="menu-pop absolute z-20 mt-1.5 w-full bg-white rounded-lg border border-teal/15 shadow-raised overflow-hidden"
      >
        <div className="max-h-64 overflow-y-auto">
          {banks.map((b, i) => (
            <button
              key={b.name}
              onClick={() => {
                onChange(i);
                setOpen(false);
              }}
              tabIndex={open ? 0 : -1}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-teal/5 transition-colors ${
                i === activeIdx ? "bg-teal/5" : ""
              }`}
            >
              <span className="flex items-center gap-2 text-ink">
                {i === activeIdx && (
                  <span className="w-4 h-4 rounded-full bg-teal text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                )}
                {i !== activeIdx && <span className="w-4 h-4" />}
                {b.name}
              </span>
              <span className="font-semibold text-ink/70">{b.rate}%</span>
            </button>
          ))}
        </div>
        {/* Scroll-affordance: hints there are more banks below, independent
            of whether the list height happens to leave a partial row visible. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
}

function SliderField({ label, hint, value, display, min, max, step, onChange }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs font-bold text-teal-dark">{label}</span>
        <span className="text-sm font-bold text-ink tabular-nums bg-surface px-2.5 py-0.5 rounded border border-teal/15">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
      {hint && <p className="text-[10px] text-ink/45 mt-1">{hint}</p>}
    </div>
  );
}
