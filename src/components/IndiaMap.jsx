import React, { useState } from "react";

// Simplified, stylized outline (not survey-accurate) — sized for a clean node network, not cartographic use.
const INDIA_PATH =
  "M150 8 L172 14 L188 32 L206 30 L220 46 L214 66 L228 78 L224 100 L238 118 L232 140 L244 160 L236 182 L246 206 L232 226 L236 250 L214 268 L206 292 L184 300 L176 322 L156 330 L150 352 L138 330 L120 322 L110 300 L96 288 L92 262 L74 244 L78 220 L64 200 L74 178 L66 154 L80 134 L74 110 L92 94 L88 70 L106 54 L102 32 L124 20 Z";

const CITIES = [
  { id: "delhi", name: "New Delhi", state: "National Capital", x: 148, y: 90, fact: "Fastest-growing NBFC lending corridor — 48hr average sanction." },
  { id: "jaipur", name: "Jaipur (HQ)", state: "Rajasthan", x: 118, y: 118, fact: "Headquarters — senior advisory team & doorstep documentation origin." },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", x: 96, y: 210, fact: "Highest Home Loan disbursal volume — 8.40% onwards on prime profiles." },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", x: 138, y: 276, fact: "Tech-sector Personal Loan approvals average 24 hours flat." },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", x: 172, y: 282, fact: "MSME & machinery loan corridor for southern manufacturing belt." },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", x: 206, y: 154, fact: "Eastern-region doorstep advisory coverage, launched 2025." },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", x: 158, y: 232, fact: "Education loan corridor for domestic & international study." },
];

export default function IndiaMap() {
  const [active, setActive] = useState("jaipur");
  const activeCity = CITIES.find((c) => c.id === active);

  return (
    <div className="bg-teal-dark rounded-2xl p-6 sm:p-8">
      <div className="grid md:grid-cols-5 gap-6 items-center">
        <div className="md:col-span-3 flex justify-center">
          <svg viewBox="0 0 300 360" className="w-full max-w-xs" role="img" aria-label="Map of India with Aaricca coverage cities">
            <path d={INDIA_PATH} fill="#ffffff0d" stroke="#ffffff2e" strokeWidth="1.5" />
            {CITIES.map((c) => (
              <g key={c.id} onClick={() => setActive(c.id)} className="cursor-pointer" role="button" tabIndex={0} aria-label={c.name}>
                <circle cx={c.x} cy={c.y} r={active === c.id ? 8 : 5} fill={active === c.id ? "#D4A574" : "#2E9C9A"} stroke="#0B3B3A" strokeWidth="2" />
                {active === c.id && <circle cx={c.x} cy={c.y} r="13" fill="none" stroke="#D4A574" strokeWidth="1.5" opacity="0.6" />}
              </g>
            ))}
          </svg>
        </div>
        <div className="md:col-span-2 text-white">
          <p className="text-xs uppercase tracking-wide text-gold font-semibold mb-1">Live Node Network</p>
          <h3 className="font-display font-bold text-xl">{activeCity.name}</h3>
          <p className="text-xs text-cream/60 mb-3">{activeCity.state}</p>
          <p className="text-sm text-cream/80 leading-relaxed">{activeCity.fact}</p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  active === c.id ? "bg-gold text-teal-dark" : "bg-white/10 text-cream/70 hover:bg-white/20"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
