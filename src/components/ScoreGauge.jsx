import React from "react";

const MIN = 300;
const MAX = 900;
const BANDS = [
  { from: 300, to: 649, color: "#F44336" },
  { from: 650, to: 699, color: "#D4A574" },
  { from: 700, to: 749, color: "#2E9C9A" },
  { from: 750, to: 900, color: "#1B7F7E" },
];

function angleFor(score) {
  const t = Math.min(1, Math.max(0, (score - MIN) / (MAX - MIN)));
  return 180 - t * 180;
}

function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArc = startAngle - endAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function ScoreGauge({ score = 742, animateNeedle = false }) {
  const cx = 150;
  const cy = 150;
  const r = 120;
  const needleLength = r - 24;
  const rotationDeg = -angleFor(score);

  return (
    <svg viewBox="0 0 300 175" className="w-full max-w-xs mx-auto" role="img" aria-label={`Credit score ${score} out of 900`}>
      {BANDS.map((band) => {
        const a1 = angleFor(band.from);
        const a2 = angleFor(band.to);
        return (
          <path
            key={band.from}
            d={arcPath(cx, cy, r, a1, a2)}
            stroke={band.color}
            strokeWidth="22"
            strokeLinecap="butt"
            fill="none"
          />
        );
      })}
      {/* Needle rotates as a single transform (GPU-friendly) rather than
          recomputing line endpoints, so live score changes animate smoothly. */}
      <g
        style={{
          transform: `translate(${cx}px, ${cy}px) rotate(${rotationDeg}deg)`,
          transformOrigin: "0 0",
          transition: animateNeedle ? "transform 200ms cubic-bezier(0.23,1,0.32,1)" : "none",
        }}
      >
        <line x1="0" y1="0" x2={needleLength} y2="0" stroke="#424242" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r="7" fill="#424242" />
      <text x={cx} y={cy - 14} textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="34" fill="#1B7F7E">
        {score}
      </text>
      <text x={cx - r} y={cy + 16} textAnchor="start" fontSize="10" fill="#9E9E9E" fontFamily="Inter, sans-serif">
        {MIN}
      </text>
      <text x={cx + r} y={cy + 16} textAnchor="end" fontSize="10" fill="#9E9E9E" fontFamily="Inter, sans-serif">
        {MAX}
      </text>
    </svg>
  );
}

export function tierForScore(score) {
  if (score >= 750) return { label: "Excellent", note: "Quick Approval Tier", color: "#1B7F7E", bg: "#EAF6F5", feel: "Prime — lenders compete for you" };
  if (score >= 700) return { label: "Good", note: "High Approval Probability", color: "#155F5E", bg: "#EEF7F6", feel: "Strong — most banks approve fast" };
  if (score >= 650) return { label: "Fair", note: "Standard Processing", color: "#B8865A", bg: "#FBF2E8", feel: "Okay — approvals possible, rates less sharp" };
  return { label: "Needs Work", note: "Assisted Credit Rebuilding", color: "#C0392B", bg: "#FDECEA", feel: "Risky — approvals get harder from here" };
}
