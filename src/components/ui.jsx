import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";

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

export function PrimaryButton({ to, onClick, children, type = "button", className = "", full = false }) {
  const cls = `inline-flex ${full ? "w-full justify-center" : ""} items-center gap-2 px-6 py-3.5 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal-dark active:scale-[0.97] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-card ${className}`;
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

export function ArrowCTA({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {children}
      <ArrowRight className="w-4 h-4" />
    </span>
  );
}
