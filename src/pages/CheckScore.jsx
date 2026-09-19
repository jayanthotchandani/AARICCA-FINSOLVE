import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SCORE_TIERS, OFFICE_NOTE_FULL } from "../data";
import { BackLink, PrimaryButton, Field, inputClass, PreferredCallTimeField, formatCallbackWindow, OfficeNote } from "../components/ui";
import { submitLead } from "../api";
import Seo from "../components/Seo";

const TIER_STYLES = {
  excellent: { bg: "#EAF6F5", border: "#14544F33", text: "#0B2F2C" },
  good: { bg: "#EEF7F6", border: "#269E9533", text: "#14544F" },
  fair: { bg: "#FBF2E8", border: "#D4A57444", text: "#B8865A" },
  poor: { bg: "#FDECEA", border: "#F4433633", text: "#C0392B" },
};

export default function CheckScore() {
  // The real bureau API integration is still under negotiation, so there is
  // no instant pull yet — this is a self-reported score (if the user happens
  // to know it) plus an advisor callback, not an automated lookup.
  const [quickForm, setQuickForm] = useState({ name: "", phone: "", score: "" });
  const quickPhoneValid = /^\d{10}$/.test(quickForm.phone);
  const quickScoreValid = !quickForm.score || (Number(quickForm.score) >= 300 && Number(quickForm.score) <= 900);
  const [quickCallDay, setQuickCallDay] = useState("Today");
  const [quickCallBand, setQuickCallBand] = useState("");
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickError, setQuickError] = useState("");
  const [quickSubmitted, setQuickSubmitted] = useState(false);

  async function handleQuickSubmit(e) {
    e.preventDefault();
    setQuickError("");
    setQuickSubmitting(true);
    try {
      await submitLead({
        source: "check_score",
        name: quickForm.name,
        phone: quickForm.phone,
        details: {
          preferredCallTime: formatCallbackWindow(quickCallDay, quickCallBand),
          selfReportedCibilScore: quickForm.score || null,
        },
      });
      setQuickSubmitted(true);
    } catch (err) {
      setQuickError(err.message);
    } finally {
      setQuickSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <Seo
        title="Check Your Credit Score Free"
        description="Check your CIBIL credit score for free in minutes with Aaricca. See your score, understand your loan eligibility, and get personalised offers."
        path="/credit-score/check"
      />
      <BackLink />
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-display font-bold text-h1-sm sm:text-h1 text-teal-dark">Free Credit Score Check &amp; Advisory</h1>
        <p className="mt-3 text-ink/70 text-sm sm:text-base">
          Know your score? Tell us, and a real advisor calls you back with every option it unlocks.
        </p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-teal/15 p-6 sm:p-8 mb-8">
        {quickSubmitted ? (
          <div className="fade-swap-enter text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-teal mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg text-teal-dark">Got it — your advisor is on it.</h3>
            <p className="text-sm text-ink/65 mt-1">We'll call within 24 hours with every option available to you.</p>
            <p className="text-xs text-ink/50 mt-3 max-w-sm mx-auto leading-relaxed">{OFFICE_NOTE_FULL}</p>
          </div>
        ) : (
          <>
            <h2 className="font-display font-bold text-xl text-teal-dark mb-1">Know your score? Tell us.</h2>
            <p className="text-xs text-ink/60 mb-5">
              Enter your CIBIL score if you know it, and your number — your advisor calls with every loan
              option it qualifies you for. No bureau pull, no waiting on an API.
            </p>
            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Full Name" required>
                  <input
                    required
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className={inputClass}
                  />
                </Field>
                <Field label="Mobile Number" required>
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="98290XXXXX"
                    className={inputClass}
                  />
                  {quickForm.phone.length > 0 && !quickPhoneValid && (
                    <p className="text-[11px] text-warn mt-1">Enter a valid 10-digit mobile number.</p>
                  )}
                </Field>
                <Field label="Your CIBIL Score" hint="If known — optional">
                  <input
                    type="number"
                    min={300}
                    max={900}
                    value={quickForm.score}
                    onChange={(e) => setQuickForm({ ...quickForm, score: e.target.value })}
                    placeholder="e.g. 742"
                    className={inputClass}
                  />
                  {quickForm.score && !quickScoreValid && (
                    <p className="text-[11px] text-warn mt-1">Score should be between 300 and 900.</p>
                  )}
                </Field>
              </div>
              <PreferredCallTimeField day={quickCallDay} band={quickCallBand} onDayChange={setQuickCallDay} onBandChange={setQuickCallBand} />
              {quickError && <p className="text-xs text-warn text-center">{quickError}</p>}
              <PrimaryButton
                type="submit"
                full
                disabled={quickSubmitting || !quickPhoneValid || !quickForm.name || !quickCallBand || !quickScoreValid}
              >
                {quickSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  "Get My Advisor's Options"
                )}
              </PrimaryButton>
              <OfficeNote />
            </form>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-teal/12 p-6 sm:p-8">
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
    </div>
  );
}
