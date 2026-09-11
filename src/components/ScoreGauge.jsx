import React, { useEffect, useRef, useState } from "react";

const MIN = 300;
const MAX = 900;
const BANDS = [
  { from: 300, to: 649, color: "#F44336" },
  { from: 650, to: 699, color: "#D4A574" },
  { from: 700, to: 749, color: "#269E95" },
  { from: 750, to: 900, color: "#14544F" },
];
const NEEDLE_DURATION = 200;

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

// Matches the needle's CSS cubic-bezier(0.23,1,0.32,1) closely enough for a synced count-up.
function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}

function useDisplayedScore(score, animate) {
  const [displayed, setDisplayed] = useState(score);
  const fromRef = useRef(score);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!animate) {
      setDisplayed(score);
      fromRef.current = score;
      return;
    }
    const from = fromRef.current;
    const to = score;
    if (from === to) return;
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);

    function tick(now) {
      const t = Math.min(1, (now - start) / NEEDLE_DURATION);
      const eased = easeOutQuint(t);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, animate]);

  return displayed;
}

export default function ScoreGauge({ score = 742, animateNeedle = false }) {
  const cx = 150;
  const cy = 150;
  const r = 118;
  const trackWidth = 28;
  const needleLength = r - 34;
  const rotationDeg = -angleFor(score);
  const displayedScore = useDisplayedScore(score, animateNeedle);

  return (
    <svg
      viewBox="-8 -8 316 183"
      className="w-full max-w-xs mx-auto overflow-visible"
      role="img"
      aria-label={`Credit score ${score} out of 900`}
    >
      <defs>
        <filter id="gaugeShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#14544F" floodOpacity="0.18" />
        </filter>
        <filter id="needleShadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#20302F" floodOpacity="0.35" />
        </filter>
        <linearGradient id="needleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0B2F2C" />
          <stop offset="100%" stopColor="#14544F" />
        </linearGradient>
      </defs>

      <g filter="url(#gaugeShadow)">
        {BANDS.map((band) => (
          <path
            key={band.from}
            d={arcPath(cx, cy, r, angleFor(band.from), angleFor(band.to))}
            stroke={band.color}
            strokeWidth={trackWidth}
            strokeLinecap="butt"
            fill="none"
          />
        ))}
      </g>

      {/* Needle rotates as a single transform (GPU-friendly) rather than
          recomputing line endpoints, so live score changes animate smoothly.
          Its tail sits fully underneath the hub (drawn after it, and shorter
          than the hub's radius) so the needle reads as pivoting from behind
          the hub rather than poking out past it. */}
      <g
        filter="url(#needleShadow)"
        style={{
          transform: `translate(${cx}px, ${cy}px) rotate(${rotationDeg}deg)`,
          transformOrigin: "0 0",
          transition: animateNeedle ? `transform ${NEEDLE_DURATION}ms cubic-bezier(0.23,1,0.32,1)` : "none",
        }}
      >
        <path d={`M -8 0 L 0 -4.5 L ${needleLength} 0 L 0 4.5 Z`} fill="url(#needleGrad)" />
      </g>
      <circle cx={cx} cy={cy} r="11" fill="#FFFFFF" filter="url(#needleShadow)" />
      <circle cx={cx} cy={cy} r="7" fill="#0B2F2C" />

      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontWeight="700"
        fontSize="40"
        fill="#0B2F2C"
        letterSpacing="-0.5"
      >
        {displayedScore}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
        fontSize="12"
        letterSpacing="1.5"
        fill="#9E9E9E"
      >
        OUT OF 900
      </text>

      <text x={cx - r} y={cy + 30} textAnchor="middle" fontSize="11" fontWeight="600" fill="#9E9E9E" fontFamily="Inter, sans-serif">
        {MIN}
      </text>
      <text x={cx + r} y={cy + 30} textAnchor="middle" fontSize="11" fontWeight="600" fill="#9E9E9E" fontFamily="Inter, sans-serif">
        {MAX}
      </text>
    </svg>
  );
}

export function tierForScore(score) {
  if (score >= 750) return { label: "Excellent", note: "Quick Approval Tier", color: "#14544F", bg: "#EAF6F5", feel: "Prime — lenders compete for you" };
  if (score >= 700) return { label: "Good", note: "High Approval Probability", color: "#0B2F2C", bg: "#EEF7F6", feel: "Strong — most banks approve fast" };
  if (score >= 650) return { label: "Fair", note: "Standard Processing", color: "#B8865A", bg: "#FBF2E8", feel: "Okay — approvals possible, rates less sharp" };
  return { label: "Needs Work", note: "Assisted Credit Rebuilding", color: "#C0392B", bg: "#FDECEA", feel: "Risky — approvals get harder from here" };
}
