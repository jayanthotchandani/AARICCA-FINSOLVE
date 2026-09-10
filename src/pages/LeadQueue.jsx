import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Download, Lock, PhoneCall, LogOut, Loader2, Radio, Mail, Trash2, Plus, Pencil, X, Check } from "lucide-react";
import { inputClass, Field, PrimaryButton } from "../components/ui";
import { LOAN_TYPES } from "../data";
import { getRates, addBankRate, updateBankRate, deleteBankRate } from "../api";

const SOURCE_LABELS = {
  apply: "Loan Application",
  debt_consolidation: "Debt Consolidation",
  check_score: "Credit Score Check",
};

const SOURCE_STYLES = {
  apply: "bg-teal/10 text-teal",
  debt_consolidation: "bg-gold/15 text-gold-dark",
  check_score: "bg-success/10 text-success",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export default function LeadQueue() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setAuthed(d.authenticated))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-6 h-6 text-teal animate-spin" />
      </div>
    );
  }

  return authed ? <Dashboard onLoggedOut={() => setAuthed(false)} /> : <LoginGate onLoggedIn={() => setAuthed(true)} />;
}

function LoginGate({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Login failed");
      }
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-teal/15 p-8 w-full max-w-sm shadow-raised">
        <div className="w-11 h-11 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-4">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="font-display font-bold text-lg text-teal-dark">Internal Tool</h1>
        <p className="text-xs text-ink/55 mt-1 mb-5">Call Center Lead Queue — authorized staff only.</p>

        <div className="space-y-3.5">
          <Field label="Username" required>
            <input
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Password" required>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={inputClass}
            />
          </Field>
        </div>
        {error && <p className="text-xs text-warn mt-3">{error}</p>}
        <PrimaryButton type="submit" full disabled={loading} className="mt-4">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
            </>
          ) : (
            "Enter Queue"
          )}
        </PrimaryButton>
        <Link to="/" className="block text-center text-xs text-ink/45 mt-4 hover:text-teal">
          ← Back to public site
        </Link>
      </form>
    </div>
  );
}

function Dashboard({ onLoggedOut }) {
  const [tab, setTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [justArrivedId, setJustArrivedId] = useState(null);
  const eventSourceRef = useRef(null);

  const loadLeads = useCallback(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then(setLeads)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadLeads();
    // Live updates: a new submission from anywhere on the public site
    // appears here immediately, without a refresh.
    const es = new EventSource("/api/leads/stream");
    eventSourceRef.current = es;
    es.onmessage = (e) => {
      const lead = JSON.parse(e.data);
      setLeads((prev) => [lead, ...prev]);
      setJustArrivedId(lead.id);
      setTimeout(() => setJustArrivedId((id) => (id === lead.id ? null : id)), 2000);
    };
    return () => es.close();
  }, [loadLeads]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onLoggedOut();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this lead? This can't be undone.")) return;
    const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
    if (res.ok) setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  const today = todayISO();
  const leadsToday = leads.filter((l) => l.created_at.slice(0, 10) === today).length;
  const bySource = leads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex items-start sm:items-center justify-between mb-6 gap-4 flex-col sm:flex-row">
          <div>
            <p className="text-[11px] font-semibold text-ink/45 uppercase tracking-wide">Internal Tool · /internal-leads-portal</p>
            <h1 className="font-display font-bold text-2xl text-teal-dark">
              {tab === "leads" ? "Call Center Lead Queue" : "Bank Rates"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {tab === "leads" && (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-success/10 text-success">
                <Radio className="w-3 h-3" /> Live
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-ink/5 text-ink/60 hover:bg-ink/10 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-teal/12">
          {[
            ["leads", "Lead Queue"],
            ["rates", "Bank Rates"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === key ? "border-teal text-teal-dark" : "border-transparent text-ink/50 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "leads" ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                [leads.length, "Total Leads"],
                [leadsToday, "Leads Today"],
                [bySource.apply || 0, "Loan Applications"],
                [(bySource.debt_consolidation || 0) + (bySource.check_score || 0), "Score Checks + Debt"],
              ].map(([v, l]) => (
                <div key={l} className="bg-white rounded-xl border border-teal/12 p-4 text-center">
                  <p className="font-display font-bold text-2xl text-teal-dark">{v}</p>
                  <p className="text-[11px] text-ink/50 mt-0.5">{l}</p>
                </div>
              ))}
            </div>

            <ExportBar />

            <h2 className="font-display font-semibold text-ink mb-3">Live Feed — All Leads</h2>
            {loading ? (
              <div className="flex items-center justify-center py-16 text-ink/40">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : leads.length === 0 ? (
              <div className="bg-white rounded-xl border border-teal/12 p-10 text-center text-sm text-ink/50">
                No leads yet. Submissions from the site's forms will appear here the moment they come in.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {leads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} justArrived={lead.id === justArrivedId} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        ) : (
          <RatesTab />
        )}
      </div>
    </div>
  );
}

function RatesTab() {
  const [ratesByLoan, setRatesByLoan] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    getRates()
      .then(setRatesByLoan)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return <p className="text-sm text-warn">{error}</p>;
  }
  if (!ratesByLoan) {
    return (
      <div className="flex items-center justify-center py-16 text-ink/40">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-ink/55 mb-5 max-w-2xl">
        Rates entered here go live on the homepage rate ticker and every loan product page immediately —
        no developer or redeploy needed.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {LOAN_TYPES.map((loan) => (
          <LoanRatesCard
            key={loan.id}
            loan={loan}
            rows={ratesByLoan[loan.id] || []}
            onChange={(rows) => setRatesByLoan((prev) => ({ ...prev, [loan.id]: rows }))}
          />
        ))}
      </div>
    </div>
  );
}

function LoanRatesCard({ loan, rows, onChange }) {
  const [adding, setAdding] = useState(false);
  const [newBank, setNewBank] = useState("");
  const [newRate, setNewRate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sorted = [...rows].sort((a, b) => a.rate - b.rate);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    const rate = parseFloat(newRate);
    if (!newBank.trim() || !(rate > 0)) {
      setError("Enter a bank name and a positive rate.");
      return;
    }
    setSubmitting(true);
    try {
      const row = await addBankRate({ loanId: loan.id, bankName: newBank.trim(), rate });
      onChange([...rows, row]);
      setNewBank("");
      setNewRate("");
      setAdding(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id, rate) {
    const row = await updateBankRate(id, rate);
    onChange(rows.map((r) => (r.id === id ? row : r)));
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this bank from the list?")) return;
    await deleteBankRate(id);
    onChange(rows.filter((r) => r.id !== id));
  }

  return (
    <div className="bg-white rounded-xl border border-teal/12 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm text-teal-dark">{loan.title}</h3>
        <span className="text-[10px] text-ink/45">{rows.length} banks</span>
      </div>
      <div className="space-y-1.5">
        {sorted.map((row) => (
          <RateRowEditable key={row.id} row={row} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
        {rows.length === 0 && <p className="text-xs text-ink/45 py-2">No banks listed yet.</p>}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="mt-3 pt-3 border-t border-teal/10 flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-[10px] text-ink/50 mb-1">Bank name</label>
            <input
              autoFocus
              value={newBank}
              onChange={(e) => setNewBank(e.target.value)}
              placeholder="e.g. Federal Bank"
              className="w-full px-2.5 py-1.5 rounded-lg border border-teal/20 text-xs outline-none focus:border-teal"
            />
          </div>
          <div className="w-20">
            <label className="block text-[10px] text-ink/50 mb-1">Rate %</label>
            <input
              type="number"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="9.99"
              className="w-full px-2.5 py-1.5 rounded-lg border border-teal/20 text-xs outline-none focus:border-teal"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            aria-label="Add bank"
            className="p-2 rounded-lg bg-teal text-white hover:bg-teal-dark transition-colors disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setError("");
            }}
            aria-label="Cancel"
            className="p-2 rounded-lg bg-ink/5 text-ink/50 hover:bg-ink/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 pt-3 border-t border-teal/10 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-dark transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Bank
        </button>
      )}
      {error && <p className="text-[11px] text-warn mt-2">{error}</p>}
    </div>
  );
}

function RateRowEditable({ row, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(row.rate));
  const [saving, setSaving] = useState(false);

  async function save() {
    const rate = parseFloat(value);
    if (!(rate > 0)) {
      setValue(String(row.rate));
      setEditing(false);
      return;
    }
    if (rate === row.rate) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onUpdate(row.id, rate);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  return (
    <div className="group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface/70 transition-colors">
      <span className="text-xs text-ink/80 truncate">{row.bank_name}</span>
      {editing ? (
        <div className="flex items-center gap-1 shrink-0">
          <input
            autoFocus
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setValue(String(row.rate));
                setEditing(false);
              }
            }}
            className="w-16 px-1.5 py-0.5 rounded border border-teal/30 text-xs text-end outline-none focus:border-teal"
          />
          <button onClick={save} disabled={saving} aria-label="Save rate" className="p-1 text-teal hover:text-teal-dark">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs font-bold text-teal tabular-nums">{row.rate}%</span>
          <button
            onClick={() => setEditing(true)}
            aria-label="Edit rate"
            className="p-1 text-ink/30 opacity-0 group-hover:opacity-100 hover:text-teal transition-[opacity,color]"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            aria-label="Remove bank"
            className="p-1 text-ink/30 opacity-0 group-hover:opacity-100 hover:text-warn transition-[opacity,color]"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, justArrived, onDelete }) {
  const details = lead.details_json ? JSON.parse(lead.details_json) : null;
  const time = new Date(lead.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="group relative bg-white rounded-xl border border-teal/12 p-4 transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
      style={justArrived ? { borderColor: "#1B7F7E", boxShadow: "0 0 0 3px #1B7F7E22" } : undefined}
    >
      <button
        onClick={() => onDelete(lead.id)}
        aria-label="Delete lead"
        className="absolute top-2.5 end-2.5 w-6 h-6 rounded-md flex items-center justify-center text-ink/30 opacity-0 group-hover:opacity-100 hover:bg-warn/10 hover:text-warn transition-[opacity,background-color,color] duration-150"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start justify-between mb-1.5 pe-6">
        <div>
          <p className="font-semibold text-sm text-ink">{lead.name}</p>
          <p className="text-xs text-ink/50">{lead.phone}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${SOURCE_STYLES[lead.source]}`}>
          {SOURCE_LABELS[lead.source] || lead.source}
        </span>
      </div>

      {lead.loan_type && (
        <p className="text-xs text-ink/70 mt-2">
          {lead.loan_type} {lead.amount && <>· {lead.amount}</>}
        </p>
      )}
      {lead.email && (
        <p className="text-xs text-ink/50 flex items-center gap-1 mt-1">
          <Mail className="w-3 h-3" /> {lead.email}
        </p>
      )}
      {details && (
        <ul className="mt-1.5 space-y-0.5">
          {Object.entries(details)
            .filter(([, v]) => v !== null && v !== undefined && v !== "")
            .slice(0, 3)
            .map(([k, v]) => (
              <li key={k} className="text-[11px] text-ink/50">
                <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span>: {typeof v === "object" ? JSON.stringify(v) : String(v)}
              </li>
            ))}
        </ul>
      )}

      <p className="text-[11px] text-ink/40 mt-2">{time}</p>

      <a
        href={`tel:+91${String(lead.phone).replace(/\D/g, "")}`}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal-dark transition-colors"
      >
        <PhoneCall className="w-3.5 h-3.5" /> Call Now
      </a>
    </div>
  );
}

function ExportBar() {
  const [from, setFrom] = useState(daysAgoISO(30));
  const [to, setTo] = useState(todayISO());

  function download() {
    const params = new URLSearchParams();
    if (from) params.set("from", `${from}T00:00:00.000Z`);
    if (to) params.set("to", `${to}T23:59:59.999Z`);
    window.location.href = `/api/leads/export.csv?${params.toString()}`;
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
