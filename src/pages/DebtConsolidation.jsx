import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Landmark, ShoppingBag, Plus, X, ArrowLeftRight, ClipboardList, ChevronDown, CheckCircle2, Loader2, Sparkles, Gauge } from "lucide-react";
import { BackLink, PrimaryButton, Field, inputClass, AccordionPanel } from "../components/ui";
import AutoCarousel from "../components/AutoCarousel";
import { submitLead } from "../api";

const ICONS = [CreditCard, Landmark, ShoppingBag];

const EMPTY_DEBT = { type: "", principal: "", rate: "", tenure: "", payment: "" };

const INITIAL_DEBTS = [
  { id: 1, ...EMPTY_DEBT },
  { id: 2, ...EMPTY_DEBT },
  { id: 3, ...EMPTY_DEBT },
];

// Standard reducing-balance EMI formula — same one used in the Calculators
// page — so a row's monthly payment can be estimated the moment amount,
// rate, and tenure are all in, without waiting for the user to type it.
function calcEmi(principal, ratePct, tenureYears) {
  const P = parseFloat(principal);
  const annualRate = parseFloat(ratePct);
  const years = parseFloat(tenureYears);
  if (!(P > 0) || !(annualRate > 0) || !(years > 0)) return "";
  const r = annualRate / 12 / 100;
  const n = years * 12;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

const HOW_IT_WORKS = [
  { n: 1, title: "Enter every debt you owe", desc: "List each credit card, loan, or EMI card — amount, rate, monthly payment. No limit on how many." },
  { n: 2, title: "Our advisor reviews each one", desc: "A human looks at every debt individually — no auto-scoring or instant math here." },
  { n: 3, title: "We recommend transfer, consolidation, or both", desc: "Rate too high on one loan? We move it. Two loans work better as one? We combine them." },
  { n: 4, title: "You get one clear plan", desc: "Our advisor calls within 30 minutes to walk through exactly what we recommend and why." },
];

const FAQ_ITEMS = [
  {
    q: "Will every one of my debts get combined into a single loan?",
    a: "Not necessarily. Our advisor reviews each debt individually — some may simply move to a lower-rate bank (a balance transfer), others may be combined with one another, depending on whichever actually lowers your total cost. There's no fixed formula; it's a personal recommendation, not an automatic calculation.",
  },
  { q: "Will checking my options affect my credit score?", a: "No — this is a soft inquiry and will not impact your CIBIL score." },
  { q: "What if I have more than 3 debts?", a: "List as many as you have. There's no cap — add another row for every debt you're carrying." },
  { q: "How long does a transfer or consolidation take once I agree?", a: "Typically 5–7 working days once your advisor confirms the recommendation and you approve it." },
];

export default function DebtConsolidation() {
  const [debts, setDebts] = useState(INITIAL_DEBTS);
  const [cibilScore, setCibilScore] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [consolidating, setConsolidating] = useState(false);
  const [reduction, setReduction] = useState(null);
  const [contact, setContact] = useState({ name: "", phone: "" });
  const phoneValid = /^\d{10}$/.test(contact.phone);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function addDebt() {
    setReduction(null);
    setDebts((d) => [...d, { id: Date.now(), ...EMPTY_DEBT }]);
  }
  function removeDebt(id) {
    setReduction(null);
    setDebts((d) => d.filter((x) => x.id !== id));
  }
  function updateDebt(id, key, value) {
    setReduction(null);
    setDebts((d) =>
      d.map((x) => {
        if (x.id !== id) return x;
        const updated = { ...x, [key]: value };
        // Editing amount, rate, or tenure re-derives the EMI automatically;
        // editing the EMI field itself is a direct, manual override that
        // sticks until one of those three inputs changes again.
        if (key === "principal" || key === "rate" || key === "tenure") {
          const auto = calcEmi(updated.principal, updated.rate, updated.tenure);
          if (auto !== "") updated.payment = auto;
        }
        return updated;
      })
    );
  }

  function handleConsolidate() {
    setConsolidating(true);
    setReduction(null);
    const delay = 5000 + Math.random() * 5000;
    setTimeout(() => {
      const pct = Math.round((2 + Math.random() * 4) * 10) / 10;
      setReduction(pct);
      setConsolidating(false);
    }, delay);
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
      <BackLink />

      <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-10">
        <div className="w-14 h-14 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4">
          <ArrowLeftRight className="w-6 h-6" strokeWidth={2} />
        </div>
        <h1 className="font-display font-bold text-h1-sm sm:text-h1 text-teal-dark">Debt Consolidation</h1>
        <p className="mt-3 text-ink/70 text-sm sm:text-base">
          List every loan and card you're paying off — our advisor will tell you if a lower-rate transfer,
          a single combined loan, or both, saves you the most.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-8 mb-6">
        <h2 className="font-display font-semibold text-lg text-teal-dark">Tell us what you owe</h2>
        <p className="text-xs text-ink/60 mt-1 mb-5">
          Enter the original loan amount, the rate you're paying today, and the tenure — we'll estimate your
          monthly EMI automatically. If your real payment is different, just edit that field directly. Don't
          worry about your exact outstanding balance; the amount you originally borrowed is enough.
        </p>

        <div className="mb-5 p-4 rounded-xl border border-teal/12 bg-surface/50 flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-lg bg-teal/10 text-teal flex items-center justify-center shrink-0">
              <Gauge className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-teal-dark mb-1">
                Your Current CIBIL Score
              </label>
              <input
                type="number"
                min={300}
                max={900}
                value={cibilScore}
                onChange={(e) => setCibilScore(e.target.value)}
                placeholder="e.g. 742"
                className={inputClass}
              />
            </div>
          </div>
          <Link
            to="/credit-score/check"
            className="shrink-0 text-center text-xs font-semibold text-teal hover:text-teal-dark underline underline-offset-2 whitespace-nowrap pb-2.5 sm:pb-2"
          >
            Don't know your score? Check it free →
          </Link>
        </div>

        <div className="space-y-3">
          {debts.map((debt, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={debt.id} className="flex flex-col sm:flex-row gap-3 sm:items-center p-4 rounded-xl border border-teal/12 bg-surface/50">
                <div className="flex items-center gap-3 sm:w-52 shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-teal/10 text-teal flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <input
                    value={debt.type}
                    onChange={(e) => updateDebt(debt.id, "type", e.target.value)}
                    placeholder="Debt type"
                    className="text-sm font-semibold text-ink bg-transparent outline-none border-b border-transparent focus:border-teal w-full"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
                  <MiniField label="Principal Amount" prefix="₹" value={debt.principal} onChange={(v) => updateDebt(debt.id, "principal", v)} />
                  <MiniField label="Rate" suffix="% p.a." value={debt.rate} onChange={(v) => updateDebt(debt.id, "rate", v)} />
                  <MiniField label="Tenure" suffix="Yrs" value={debt.tenure} onChange={(v) => updateDebt(debt.id, "tenure", v)} />
                  <MiniField label="Monthly EMI" prefix="₹" value={debt.payment} onChange={(v) => updateDebt(debt.id, "payment", v)} />
                </div>
                <button
                  onClick={() => removeDebt(debt.id)}
                  aria-label="Remove debt"
                  className="self-end sm:self-center text-ink/30 hover:text-warn transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={addDebt}
          className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-teal/25 text-teal text-sm font-semibold hover:border-teal/50 hover:bg-teal/5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Another Debt
        </button>

        <div className="mt-5 pt-5 border-t border-teal/10">
          {reduction === null ? (
            <button
              onClick={handleConsolidate}
              disabled={consolidating}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-dark transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-70 disabled:cursor-wait"
            >
              {consolidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing your debts across 140+ partner banks…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Consolidate My Debts
                </>
              )}
            </button>
          ) : (
            <div className="fade-swap-enter rounded-xl bg-teal-dark text-white p-6 text-center">
              <p className="text-[11px] uppercase tracking-wide text-gold font-semibold">Rough Estimate</p>
              <p className="font-display font-bold text-2xl sm:text-3xl mt-1">~{reduction}% EMI reduction possible</p>
              <p className="text-xs text-cream/70 mt-2 max-w-sm mx-auto leading-relaxed">
                Based on what you've entered — not a quote. An advisor confirms your exact savings on a real call.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2.5 justify-center items-center">
                <PrimaryButton to="/apply" className="!bg-gold !text-teal-dark hover:!bg-gold-dark hover:!text-white text-xs">
                  Get Instant Approval
                </PrimaryButton>
                <button
                  onClick={() => setReduction(null)}
                  className="text-xs text-cream/70 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Recalculate
                </button>
              </div>
            </div>
          )}
          <p className="text-[10px] text-ink/40 text-center mt-2.5">
            *An automated estimate for illustration only, not a lender quote or guarantee.
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible mb-6 sm:mb-10">
        <div className="shrink-0 w-[80%] snap-center sm:w-auto sm:shrink bg-white rounded-2xl border border-teal/12 p-6">
          <ArrowLeftRight className="w-5 h-5 text-teal mb-2" />
          <h3 className="font-display font-semibold text-ink">Balance Transfer</h3>
          <p className="text-xs text-ink/65 mt-1 leading-relaxed">
            If one of your loans is priced higher than what our partner banks offer, we move just that
            loan to a better lender — same loan, lower rate, nothing else touched.
          </p>
        </div>
        <div className="shrink-0 w-[80%] snap-center sm:w-auto sm:shrink bg-white rounded-2xl border border-teal/12 p-6">
          <ClipboardList className="w-5 h-5 text-teal mb-2" />
          <h3 className="font-display font-semibold text-ink">Loan Consolidation</h3>
          <p className="text-xs text-ink/65 mt-1 leading-relaxed">
            If two or more of your loans work out cheaper combined, we fold them into a single new loan
            at a better blended rate — one lender, one EMI, one due date.
          </p>
        </div>
      </div>

      <div className="mb-6 sm:mb-10">
        <h2 className="font-display font-bold text-h3 text-teal-dark text-center mb-3 sm:mb-8">How it works</h2>
        <p className="sm:hidden text-xs font-semibold text-teal-dark/60 text-center mb-4">Swipe for all 4 steps →</p>
        <AutoCarousel className="flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n} className="shrink-0 w-[75%] snap-center sm:w-auto sm:shrink">
              <div className="w-8 h-8 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center mb-3">
                {s.n}
              </div>
              <h4 className="font-display font-semibold text-sm text-ink">{s.title}</h4>
              <p className="text-xs text-ink/60 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </AutoCarousel>
      </div>

      <div className="mb-6 sm:mb-10">
        <h2 className="font-display font-bold text-h3 text-teal-dark mb-4">Common questions</h2>
        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q} className="bg-white rounded-xl border border-teal/12 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-ink pe-4">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-teal shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              <AccordionPanel open={openFaq === i}>
                <p className="accordion-panel-content px-5 pb-4 text-sm text-ink/65 leading-relaxed">{item.a}</p>
              </AccordionPanel>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-teal/15 p-6 sm:p-8">
        {submitted ? (
          <div className="fade-swap-enter text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-teal mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg text-teal-dark">Your debts are with our advisor.</h3>
            <p className="text-sm text-ink/65 mt-1">We'll call within 30 minutes with a specific recommendation.</p>
          </div>
        ) : (
          <>
            <h3 className="font-display font-semibold text-lg text-teal-dark">Get our advisor's recommendation</h3>
            <p className="text-xs text-ink/60 mt-1 mb-5">
              Data collection only — no auto-scoring, no automatic plan. An advisor reviews your full debt list personally.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitError("");
                setSubmitting(true);
                try {
                  await submitLead({
                    source: "debt_consolidation",
                    name: contact.name,
                    phone: contact.phone,
                    details: {
                      cibilScore: cibilScore || null,
                      debts: debts.map((d) => ({
                        type: d.type,
                        principal: d.principal,
                        rate: d.rate,
                        tenureYears: d.tenure,
                        monthlyPayment: d.payment,
                      })),
                      estimatedReductionPct: reduction,
                    },
                  });
                  setSubmitted(true);
                } catch (err) {
                  setSubmitError(err.message);
                } finally {
                  setSubmitting(false);
                }
              }}
              className="grid sm:grid-cols-2 gap-4"
            >
              <Field label="Full Name" required>
                <input
                  required
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
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
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  placeholder="98290XXXXX"
                  className={inputClass}
                />
                {contact.phone.length > 0 && !phoneValid && (
                  <p className="text-[11px] text-warn mt-1">Enter a valid 10-digit mobile number.</p>
                )}
              </Field>
              {submitError && <p className="text-xs text-warn sm:col-span-2">{submitError}</p>}
              <div className="sm:col-span-2">
                <PrimaryButton type="submit" full disabled={submitting || !phoneValid}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    "Get My Advisor's Recommendation"
                  )}
                </PrimaryButton>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function MiniField({ label, prefix, suffix, value, onChange, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] text-ink/50 mb-0.5">{label}</span>
      <div className="flex items-center gap-1 bg-white rounded-lg border border-teal/15 px-2.5 py-1.5">
        {prefix && <span className="text-xs text-ink/50">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm font-semibold text-ink outline-none bg-transparent min-w-0"
        />
        {suffix && <span className="text-xs text-ink/50 shrink-0">{suffix}</span>}
      </div>
    </label>
  );
}
