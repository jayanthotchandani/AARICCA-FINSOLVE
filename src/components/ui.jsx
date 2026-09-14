import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { CALL_TIME_BANDS, OFFICE_NOTE_SHORT, WORKING_HOURS_NOTE } from "../data";

// Re-reads the clock every minute so a form left open across a band
// boundary (e.g. sitting on the page from 11:58 to 12:02) re-evaluates
// which "Today" bands are still offerable, without needing a refresh.
function useLiveHour() {
  const [hour, setHour] = useState(() => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  });
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setHour(now.getHours() + now.getMinutes() / 60);
    }, 60000);
    return () => clearInterval(id);
  }, []);
  return hour;
}

export function AccordionPanel({ open, children, className = "", as: Tag = "div", ...rest }) {
  if (!open) {
    return <Tag data-open={false} className={`${className}`} {...rest} />;
  }
  return (
    <Tag data-open={true} className={`accordion-panel-content ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function PrimaryButton({ to, onClick, children, type = "button", className = "", full = false, disabled = false }) {
  const cls = `inline-flex ${full ? "w-full justify-center" : ""} items-center gap-2 px-6 py-3.5 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-dark active:scale-[0.97] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-card disabled:opacity-70 disabled:cursor-wait ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function SecondaryButton({ to, onClick, children, type = "button", className = "", full = false }) {
  const cls = `inline-flex ${full ? "w-full justify-center" : ""} items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-gold text-ink font-semibold text-sm hover:bg-gold/10 active:scale-[0.97] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function BackLink({ to = "/", children = "Back to Home" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark transition-colors mb-8"
    >
      <ArrowLeft className="w-4 h-4" />
      {children}
    </Link>
  );
}

export function PageHero({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10">
      <h1 className="font-display font-bold text-h1-sm sm:text-h1 text-teal-dark text-balance">{title}</h1>
      {subtitle && <p className="mt-4 text-ink/70 text-base sm:text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function StatBlock({ value, label }) {
  return (
    <div>
      <p className="font-display font-bold text-2xl text-teal-dark">{value}</p>
      <p className="text-xs text-ink/60 mt-0.5">{label}</p>
    </div>
  );
}

export function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-teal-dark mb-1.5">
        {label}
        {required && <span className="text-warn ms-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-ink/50 mt-1">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full px-3.5 py-2.75 rounded-lg border border-teal/20 bg-white text-sm text-ink placeholder:text-ink/35 outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-shadow";

// Shared "when should our advisor call you?" picker used on every lead
// form. Deliberately two coarse choices (day, then a broad time band)
// rather than an exact time input — the promise is a callback sometime
// within 24 hours around this window, not a booked appointment slot.
export function PreferredCallTimeField({ day, band, onDayChange, onBandChange }) {
  const nowHour = useLiveHour();
  // A band is only ever grayed out for "Today" — "Tomorrow" always offers
  // all three, regardless of what time it is right now.
  const isBandPast = (b) => day === "Today" && nowHour >= b.endHour;
  const todayFullyPassed = CALL_TIME_BANDS.every((b) => nowHour >= b.endHour);

  // Keep the selection valid as the clock ticks: if "Today" runs out of
  // bands entirely, bump to "Tomorrow"; if just the selected band goes by,
  // clear it so the user picks a still-available one.
  useEffect(() => {
    if (day === "Today" && todayFullyPassed) onDayChange("Tomorrow");
  }, [day, todayFullyPassed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const selected = CALL_TIME_BANDS.find((b) => b.key === band);
    if (selected && isBandPast(selected)) onBandChange("");
  }, [day, band, nowHour]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Field label="When should our advisor call you?" required hint="We'll call within 24 hours, around this window.">
      <div className="grid grid-cols-2 gap-2 mb-2">
        {["Today", "Tomorrow"].map((d) => {
          const disabled = d === "Today" && todayFullyPassed;
          return (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => onDayChange(d)}
              className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                disabled
                  ? "bg-surface text-ink/30 border-teal/10 cursor-not-allowed"
                  : day === d
                  ? "bg-teal text-white border-teal"
                  : "bg-white text-ink/70 border-teal/20 hover:border-teal/50"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {CALL_TIME_BANDS.map((b) => {
          const disabled = isBandPast(b);
          return (
            <button
              key={b.key}
              type="button"
              disabled={disabled}
              onClick={() => onBandChange(b.key)}
              className={`py-2 px-1 rounded-lg border text-center transition-colors ${
                disabled
                  ? "bg-surface text-ink/30 border-teal/10 cursor-not-allowed"
                  : band === b.key
                  ? "bg-teal text-white border-teal"
                  : "bg-white text-ink/70 border-teal/20 hover:border-teal/50"
              }`}
            >
              <span className="block text-[11px] font-semibold">{b.label}</span>
              <span className={`block text-[10px] ${disabled ? "text-ink/25" : band === b.key ? "text-white/75" : "text-ink/45"}`}>
                {disabled ? "Already passed today" : b.hint}
              </span>
            </button>
          );
        })}
      </div>
    </Field>
  );
}

export function formatCallbackWindow(day, bandKey) {
  const band = CALL_TIME_BANDS.find((b) => b.key === bandKey);
  if (!day || !band) return null;
  return `${day}, ${band.label} (${band.hint})`;
}

export function OfficeNote({ className = "" }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink/50">
        <MapPin className="w-3 h-3 text-teal shrink-0" /> {OFFICE_NOTE_SHORT}
      </p>
      <p className="text-[10px] text-ink/40 mt-1">{WORKING_HOURS_NOTE}</p>
    </div>
  );
}

export function ArrowCTA({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {children}
      <ArrowRight className="w-4 h-4" />
    </span>
  );
}
