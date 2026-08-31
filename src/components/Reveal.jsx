import React, { useEffect, useRef, useState } from "react";

let reducedMotionQuery = null;
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  if (!reducedMotionQuery) reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return reducedMotionQuery.matches;
}

// Fades + rises content in once, the moment it nears the viewport — used on
// card grids that otherwise teleport into view with no transition at all.
// GPU-only (opacity/transform), fires once, and skips straight to the
// visible state under reduced motion rather than animating gently in place.
export default function Reveal({ children, index = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 500ms cubic-bezier(0.23,1,0.32,1), transform 500ms cubic-bezier(0.23,1,0.32,1)",
        transitionDelay: visible ? `${Math.min(index, 6) * 50}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
