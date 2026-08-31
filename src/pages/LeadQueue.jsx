import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Lock, Trophy, PhoneCall } from "lucide-react";
import { inputClass, Field, PrimaryButton } from "../components/ui";

const LEADS = [
  { name: "Rajesh Sharma", phone: "98290 12345", loan: "Home Loan", amount: "₹45L", cibil: 782, income: "₹1.2L/mo", waiting: "4 min", status: "URGENT" },
  { name: "Priya Nair", phone: "99887 65432", loan: "Personal Loan", amount: "₹8L", cibil: 705, income: "₹62K/mo", waiting: "1 min", status: "NEW" },
  { name: "Amit Verma", phone: "97123 45678", loan: "Business Loan", amount: "₹25L", cibil: 740, income: "₹95K/mo", waiting: "12 min", status: "QUALIFIED" },
  { name: "Sunita Rao", phone: "96543 21098", loan: "Education Loan", amount: "₹18L", cibil: 690, income: "₹58K/mo", waiting: "22 min", status: "ASSIGNED" },
  { name: "Vikram Singh", phone: "95012 34567", loan: "MSME Loan", amount: "₹30L", cibil: 715, income: "₹1.4L/mo", waiting: "6 min", status: "QUALIFIED" },
  { name: "Meera Iyer", phone: "94321 09876", loan: "Loan Against Property", amount: "₹60L", cibil: 760, income: "₹2L/mo", waiting: "2 min", status: "URGENT" },
];

const TOP_LEADS = [
  { rank: 1, name: "Meera Iyer", detail: "LAP · ₹60L · CIBIL 760", tag: "Highest Ticket Value" },
  { rank: 2, name: "Rajesh Sharma", detail: "Home Loan · ₹45L · CIBIL 782", tag: "Best CIBIL + Urgent" },
  { rank: 3, name: "Vikram Singh", detail: "MSME Loan · ₹30L · CIBIL 715", tag: "Qualified, High Income" },
];

const STATUS_STYLES = {
  URGENT: "bg-warn/10 text-warn",
  NEW: "bg-success/10 text-success",
  QUALIFIED: "bg-gold/15 text-gold-dark",
  ASSIGNED: "bg-teal/10 text-teal",
};

const ROUTING_RULES = [
  ["CIBIL 750+", "Fast Track (24h)"],
  ["CIBIL 700–749", "Standard (48h)"],
  ["Home Loan > ₹50L", "Senior Agent"],
  ["No response in 30 min", "WhatsApp reminder"],
];

export default function LeadQueue() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === "aaricca2026") {
              setAuthed(true);
            } else {
              setError(true);
            }
          }}
          className="bg-white rounded-2xl border border-teal/15 p-8 w-full max-w-sm shadow-raised"
        >
          <div className="w-11 h-11 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-display font-bold text-lg text-teal-dark">Internal Tool</h1>
          <p className="text-xs text-ink/55 mt-1 mb-5">Call Center Lead Queue — authorized staff only.</p>
          <Field label="Access Password" required>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Demo password: aaricca2026"
              className={inputClass}
            />
          </Field>
          {error && <p className="text-xs text-warn mt-2">Incorrect password.</p>}
          <PrimaryButton type="submit" full className="mt-4">
            Enter Queue
          </PrimaryButton>
          <Link to="/" className="block text-center text-xs text-ink/45 mt-4 hover:text-teal">
            ← Back to public site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold text-ink/45 uppercase tracking-wide">Internal Tool · /admin/queue</p>
            <h1 className="font-display font-bold text-2xl text-teal-dark">Call Center Lead Queue</h1>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-ink/5 text-ink/60">
            <Lock className="w-3 h-3" /> Password Protected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[["47", "Leads Today"], ["12", "In Queue"], ["₹3.8Cr", "Potential Value"], ["24%", "Conversion Rate"]].map(([v, l]) => (
            <div key={l} className="bg-white rounded-xl border border-teal/12 p-4 text-center">
              <p className="font-display font-bold text-2xl text-teal-dark">{v}</p>
              <p className="text-[11px] text-ink/50 mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        <ExportBar />

        <div className="mb-8">
          <h2 className="flex items-center gap-2 font-display font-semibold text-ink mb-3">
            <Trophy className="w-4 h-4 text-gold-dark" /> Today's Top Leads — Best Contenders
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {TOP_LEADS.map((lead) => (
              <div key={lead.rank} className="bg-white rounded-xl border-2 border-gold/40 p-4">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold text-white text-xs font-bold mb-2">
                  {lead.rank}
                </span>
                <p className="font-semibold text-sm text-ink">{lead.name}</p>
                <p className="text-xs text-ink/55">{lead.detail}</p>
                <p className="text-[11px] font-semibold text-gold-dark mt-1">{lead.tag}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-ink/45 mt-2">
            Auto-ranked by ticket value, CIBIL, and urgency — a "call these first" shortlist, separate from the full queue below.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <h2 className="font-display font-semibold text-ink mb-3">Active Queue — All Leads</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {LEADS.map((lead) => (
                <div key={lead.phone} className="bg-white rounded-xl border border-teal/12 p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold text-sm text-ink">{lead.name}</p>
                      <p className="text-xs text-ink/50">{lead.phone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink/70 mt-2">
                    {lead.loan} · {lead.amount} <span className="text-ink/40">·</span> CIBIL {lead.cibil}
                  </p>
                  <p className="text-xs text-ink/50">Income: {lead.income} · Waiting: {lead.waiting}</p>
                  <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-colors">
                    <PhoneCall className="w-3.5 h-3.5" /> Call Now
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display font-semibold text-ink mb-3">Smart Routing Rules</h2>
            <div className="bg-white rounded-xl border border-teal/12 p-4 space-y-2.5">
              {ROUTING_RULES.map(([cond, action]) => (
                <div key={cond} className="text-xs">
                  <span className="text-ink/55">{cond}</span>
                  <span className="text-ink/30 mx-1">→</span>
                  <span className="font-semibold text-teal-dark">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function toCsv() {
  const header = ["Name", "Phone", "Loan Type", "Amount", "CIBIL", "Income", "Waiting", "Status"];
  const rows = LEADS.map((l) => [l.name, l.phone, l.loan, l.amount, l.cibil, l.income, l.waiting, l.status]);
  return [header, ...rows].map((r) => r.join(",")).join("\n");
}

function ExportBar() {
  const [from, setFrom] = useState("2026-08-01");
  const [to, setTo] = useState("2026-08-29");

  function download() {
    const blob = new Blob([toCsv()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aaricca-leads-${from}-to-${to}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white rounded-xl border border-teal/12 p-4 mb-8">
      <span className="text-xs font-semibold text-ink/60">Export Leads:</span>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-ink/45">From</span>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-2 py-1.5 rounded-lg border border-teal/20 text-xs" />
        <span className="text-ink/45">To</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-2 py-1.5 rounded-lg border border-teal/20 text-xs" />
      </div>
      <button
        onClick={download}
        className="ms-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> Download CSV
      </button>
    </div>
  );
}
