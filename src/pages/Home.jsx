import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2, UserCheck, Scale, FileEdit, Landmark, ShieldCheck, Clock, Zap } from "lucide-react";
import { LOAN_TYPES, TESTIMONIALS, BANKS_BY_LOAN, RATE_BENCHMARK_UPDATED_AT } from "../data";
import { PrimaryButton, SecondaryButton, StatBlock, ArrowCTA, Field, inputClass } from "../components/ui";
import ScoreGauge, { tierForScore } from "../components/ScoreGauge";
import ProcessPath from "../components/ProcessPath";
import Reveal from "../components/Reveal";
import { getRates } from "../api";

const BENCHMARK_LOAN_IDS = ["personal", "home", "business", "lap", "education"];
const SPEED_BY_LOAN_ID = {
  personal: "Instant / 24 hrs",
  home: "3–5 Working Days",
  business: "48 Hours",
  lap: "5–7 Days",
  education: "3–5 Working Days",
};

function buildRateRows(banksByLoan) {
  return BENCHMARK_LOAN_IDS.map((id) => {
    const loan = LOAN_TYPES.find((l) => l.id === id);
    const banks = [...(banksByLoan[id] || [])].sort((a, b) => a.rate - b.rate);
    return { id, label: loan.title, banks, speed: SPEED_BY_LOAN_ID[id] };
  });
}

function formatUpdatedDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Cycles this row through its own bank list, on its own timer — staggered by
// `offsetMs` so the 5 rows don't all flip in unison.
function useRotatingBank(banks, offsetMs) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    // Pick a random bank each tick — never the one currently showing, so it
    // always visibly changes rather than sometimes re-picking the same one.
    function pickNext() {
      setIndex((current) => {
        if (banks.length < 2) return current;
        let next = Math.floor(Math.random() * banks.length);
        while (next === current) next = Math.floor(Math.random() * banks.length);
        return next;
      });
    }
    let interval;
    const start = setTimeout(() => {
      pickNext();
      interval = setInterval(pickNext, 5500);
    }, 5500 + offsetMs);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [banks, offsetMs]);

  return banks[index];
}

function RateRow({ row, offsetMs }) {
  const bank = useRotatingBank(row.banks, offsetMs);
  const [justUpdated, setJustUpdated] = React.useState(false);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setJustUpdated(true);
    const timeout = setTimeout(() => setJustUpdated(false), 1000);
    return () => clearTimeout(timeout);
  }, [bank.name]);

  return (
    <Link
      to={`/loans/${row.id}`}
      className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-teal/5 border border-transparent hover:border-teal/15 transition-[background-color,border-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group"
      style={justUpdated ? { backgroundColor: "#1B7F7E14", borderColor: "#1B7F7E30" } : undefined}
    >
      <div>
        <p className="text-sm font-semibold text-ink">{row.label}</p>
        <p className="text-xs text-ink/55">{row.speed}</p>
      </div>
      <span className="flex flex-col items-end">
        <span
          key={prefersReducedMotion ? "static" : bank.name}
          className="flex items-center gap-1 text-sm font-extrabold text-teal group-hover:text-teal-dark rate-pop-in"
        >
          {bank.rate.toFixed(2)}% onwards
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
        <span
          key={(prefersReducedMotion ? "static" : bank.name) + "-label"}
          className="text-[10px] text-ink/40 rate-ticker-in"
        >
          {bank.name}
        </span>
      </span>
    </Link>
  );
}

const STEPS = [
  { n: "01", icon: UserCheck, title: "Eligibility", desc: "Tell us your requirement. Two minutes to fill basic details." },
  { n: "02", icon: Scale, title: "Compare", desc: "Our engine matches 40+ premier banks and surfaces real rates." },
  { n: "03", icon: FileEdit, title: "Apply", desc: "Paperless e-KYC and digital application completed in minutes." },
  { n: "04", icon: Landmark, title: "Disbursement", desc: "Get quick sanction and funds credited directly, not weeks later." },
];

export default function Home() {
  const [score, setScore] = React.useState(742);
  const tier = tierForScore(score);

  // Static data.js is the instant-paint fallback (no flash of empty
  // content); the live fetch then swaps in whatever the internal admin
  // tool's Bank Rates tab currently has, without a page reload.
  const [banksByLoan, setBanksByLoan] = React.useState(BANKS_BY_LOAN);
  const [updatedAt, setUpdatedAt] = React.useState(RATE_BENCHMARK_UPDATED_AT);

  React.useEffect(() => {
    getRates()
      .then((byLoan) => {
        const normalized = {};
        let latest = null;
        for (const [loanId, rows] of Object.entries(byLoan)) {
          normalized[loanId] = rows.map((r) => ({ name: r.bank_name, rate: r.rate }));
          for (const r of rows) {
            if (!latest || r.updated_at > latest) latest = r.updated_at;
          }
        }
        setBanksByLoan(normalized);
        if (latest) setUpdatedAt(latest);
      })
      .catch(() => {
        // Static fallback already rendering — a failed live fetch just
        // means the ticker stays on last-known rates instead of erroring.
      });
  }, []);

  const rateRows = React.useMemo(() => buildRateRows(banksByLoan), [banksByLoan]);

  return (
    <div>
      {/* Hero */}
      <section className="pt-8 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 rise-in">
            <h1 className="font-display font-bold text-h1-sm sm:text-h1 text-ink leading-[1.08] text-balance">
              Smart financial solutions for <span className="text-teal">every dream.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-ink/75 leading-relaxed max-w-xl">
              We put 40+ lenders in competition for your loan — real bank rates, one application,
              zero jargon, and a human advisor who calls back in 30 minutes, not a form that goes silent.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
              <PrimaryButton to="/apply">
                <ArrowCTA>Get Instant Approval</ArrowCTA>
              </PrimaryButton>
              <SecondaryButton to="/credit-score/check">Check Free Credit Score</SecondaryButton>
            </div>
            <div className="mt-10 pt-6 border-t border-teal/15 grid grid-cols-3 gap-6 max-w-md">
              <StatBlock value="₹500Cr+" label="Disbursed Capital" />
              <StatBlock value="40+" label="Lending Partners" />
              <StatBlock value="24 Hrs" label="Express Sanctions" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-teal/12 p-6 shadow-raised">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-semibold text-teal-dark">Live Bank Rate Benchmark</h2>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gold/15 text-gold-dark">
                  Zero Upfront Fees
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                </span>
                <p className="text-[11px] text-ink/50">
                  Benchmarked against up to 10 lenders per product · Updated {formatUpdatedDate(updatedAt)}
                </p>
              </div>
              <div className="space-y-2.5">
                {rateRows.map((row, i) => (
                  <RateRow key={row.id} row={row} offsetMs={i * 650} />
                ))}
              </div>
              <Link
                to="/calculators"
                className="mt-5 flex items-center justify-center gap-1.5 w-full py-3 rounded-lg bg-teal-dark text-white text-xs font-semibold hover:bg-teal transition-colors"
              >
                Simulate All EMIs in Calculator Hub
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Credit score gauge */}
      <section className="py-8 sm:py-16 bg-white border-y border-teal/10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-3 md:gap-10 items-center">
            <div>
              <h2 className="font-display font-bold text-lg sm:text-h3 text-teal-dark">Where does your credit score stand?</h2>
              <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-ink/70 leading-relaxed">
                Drag the slider to your rough score and see, live, what tier that lands you in — before
                you check your real score. No sign-up, no impact to your bureau file.
              </p>

              <div className="mt-2.5 sm:mt-5">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs font-bold text-teal-dark">Your approximate score</span>
                  <span className="text-sm font-bold text-ink tabular-nums bg-surface px-2.5 py-0.5 rounded border border-teal/15">
                    {score}
                  </span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={1}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  aria-label="Approximate credit score"
                />
                <div className="flex justify-between text-[10px] text-ink/45 mt-1">
                  <span>300 · Needs Work</span>
                  <span>900 · Excellent</span>
                </div>
              </div>

              <div
                className="mt-2.5 sm:mt-5 p-2.5 sm:p-4 rounded-xl border transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ backgroundColor: tier.bg, borderColor: tier.color + "33" }}
              >
                <p className="text-xs sm:text-sm font-bold transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ color: tier.color }}>
                  {tier.label.toUpperCase()} — {tier.note}
                </p>
                <p className="hidden sm:block text-xs text-ink/60 mt-1">{tier.feel}.</p>
              </div>

              <div className="mt-2.5 sm:mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
                <PrimaryButton to="/credit-score/check" className="text-[11px] px-2 py-2.5 sm:text-xs sm:px-5 sm:py-3 whitespace-nowrap">
                  Get My Exact Score
                </PrimaryButton>
                <SecondaryButton to="/credit-score/improve" className="text-[11px] px-2 py-2.5 sm:text-xs sm:px-5 sm:py-3 whitespace-nowrap">
                  Improve My Score
                </SecondaryButton>
              </div>
            </div>
            <div className="max-w-[190px] mx-auto md:max-w-xs">
              <ScoreGauge score={score} animateNeedle />
            </div>
          </div>
        </div>
      </section>

      {/* Loan products */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-3 sm:mb-10">
            <h2 className="font-display font-bold text-h2 text-teal-dark">Our lending portfolio</h2>
            <p className="mt-2 text-ink/70 text-sm sm:text-base">
              Compare ceilings and benchmark rates, then move straight to a live bank-by-bank calculator.
            </p>
          </div>
          <p className="sm:hidden text-xs font-semibold text-teal-dark/60 mb-4">Swipe to see all 6 products →</p>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible">
            {LOAN_TYPES.map((loan, i) => {
              const Icon = loan.icon;
              return (
                <Reveal key={loan.id} index={i} className="shrink-0 w-[80%] snap-center sm:w-auto sm:shrink">
                <div
                  className="h-full flex flex-col bg-white rounded-2xl border border-teal/12 p-6 hover:border-gold/60 hover:shadow-card transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-teal/8 flex items-center justify-center text-teal">
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-semibold text-teal-dark bg-teal/8 px-2.5 py-1 rounded-full">
                      {loan.approvalTime}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-teal-dark">{loan.title}</h3>
                  <p className="mt-1.5 text-xs text-ink/65 leading-relaxed flex-1">{loan.tagline}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-surface rounded-lg p-3">
                    <div>
                      <p className="text-ink/50 text-[10px] mb-0.5">Ceiling</p>
                      <p className="font-bold text-ink">{loan.amount}</p>
                    </div>
                    <div>
                      <p className="text-ink/50 text-[10px] mb-0.5">Interest Slabs</p>
                      <p className="font-bold text-teal">
                        {loan.rateFloor}%–{loan.rateCeil}% p.a.
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {loan.benefits.map((b) => (
                      <li key={b} className="flex gap-2 text-xs text-ink/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 grid grid-cols-2 gap-2 pt-4 border-t border-teal/10">
                    <Link
                      to={`/loans/${loan.id}`}
                      className="text-center text-xs font-semibold py-2.5 rounded-lg bg-teal/8 text-teal-dark hover:bg-teal/15 transition-colors"
                    >
                      Calculate EMI
                    </Link>
                    <Link
                      to={`/loans/${loan.id}`}
                      className="text-center text-xs font-semibold py-2.5 rounded-lg bg-teal text-white hover:bg-teal-dark transition-colors"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-20 bg-white border-y border-teal/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display font-bold text-h2 text-teal-dark">
              Easy. Convenient. <span className="text-gold-dark">Quick.</span>
            </h2>
            <p className="mt-2 text-ink/70 text-sm sm:text-base">The simple, four-step route to your loan.</p>
          </div>
          <ProcessPath steps={STEPS} />
          <div className="text-center mt-10 sm:mt-6">
            <PrimaryButton to="/loan-process">
              <ArrowCTA>See the Full Roadmap</ArrowCTA>
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Testimonials strip */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-display font-bold text-h3 text-teal-dark text-center mb-3 md:mb-10">What our borrowers say</h2>
          <p className="md:hidden text-xs font-semibold text-teal-dark/60 text-center mb-4">Swipe for more →</p>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} index={i} className="shrink-0 w-[80%] snap-center md:w-auto md:shrink">
                <figure className="h-full bg-white rounded-2xl border border-teal/12 p-6">
                  <blockquote className="text-sm text-ink/75 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-4 pt-4 border-t border-teal/10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.name}</p>
                      <p className="text-xs text-ink/55">{t.role}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-teal bg-teal/8 px-2 py-1 rounded-full">
                      {t.loan}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Callback */}
      <section className="py-16 sm:py-20 bg-teal-dark text-cream">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <h2 className="font-display font-bold text-h2 text-white leading-tight">
              Get your financial helper in 30 minutes
            </h2>
            <p className="mt-4 text-cream/75 text-sm sm:text-base leading-relaxed">
              Skip the queues. Leave your number and our senior credit advisor in Jaipur will call to
              structure your best loan package — no algorithm decides, a person does.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold" /> RBI Regulated
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold" /> 30-Min Callback
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-gold" /> Zero Fee
              </span>
            </div>
          </div>
          <div className="lg:col-span-6">
            <CallbackForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function CallbackForm() {
  const [submitted, setSubmitted] = React.useState(false);
  if (submitted) {
    return (
      <div className="fade-swap-enter bg-white text-ink rounded-2xl p-8 text-center shadow-raised">
        <CheckCircle2 className="w-10 h-10 text-teal mx-auto mb-3" />
        <p className="font-display font-semibold text-teal-dark">Request received.</p>
        <p className="text-sm text-ink/65 mt-1">Your advisor will call within 30 minutes.</p>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="bg-white text-ink rounded-2xl p-6 shadow-raised space-y-4"
    >
      <h3 className="font-display font-semibold text-teal-dark">Schedule a free consultation</h3>
      <Field label="Full Name" required>
        <input required type="text" placeholder="Your full name" className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Mobile Number" required>
          <input required type="tel" placeholder="+91 98290 XXXXX" className={inputClass} />
        </Field>
        <Field label="Loan Type">
          <select className={inputClass} defaultValue="Personal Loan">
            {LOAN_TYPES.map((l) => (
              <option key={l.id}>{l.title}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Required Loan Amount (₹)" required>
        <input required type="number" placeholder="15,00,000" className={inputClass} />
      </Field>
      <PrimaryButton type="submit" full>
        Request My Financial Helper Call
      </PrimaryButton>
    </form>
  );
}
