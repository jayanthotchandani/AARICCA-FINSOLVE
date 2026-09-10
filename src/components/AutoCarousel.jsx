import React, { useEffect, useRef } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// A horizontal scroll-snap track that gently auto-advances one card at a
// time, pausing long enough to read before moving on. The instant the user
// touches or drags it themselves, auto-play backs off and only resumes once
// their own scrolling (including touch-scroll momentum) has fully settled.
// Becomes a no-op automatically once the track has no horizontal overflow —
// e.g. past whatever breakpoint turns it into a static grid — so callers
// don't need to tell it which breakpoint that happens at.
export default function AutoCarousel({ children, className = "", intervalMs = 3200, resumeDelayMs = 5000 }) {
  const trackRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const track = trackRef.current;
    if (!track) return;

    let paused = false;
    let resumeTimer = null;

    function currentIndex() {
      const items = track.children;
      if (!items.length) return 0;
      const base = items[0].offsetLeft;
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < items.length; i++) {
        const dist = Math.abs(items[i].offsetLeft - base - track.scrollLeft);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      return closest;
    }

    const interval = setInterval(() => {
      if (paused) return;
      if (track.scrollWidth <= track.clientWidth + 1) return; // not actually scrollable right now
      const items = track.children;
      if (!items.length) return;
      const next = (currentIndex() + 1) % items.length;
      track.scrollTo({ left: items[next].offsetLeft - items[0].offsetLeft, behavior: "smooth" });
    }, intervalMs);

    function pause() {
      paused = true;
      clearTimeout(resumeTimer);
    }
    function scheduleResume() {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
      }, resumeDelayMs);
    }

    // "scrollend" (fires once, after scroll momentum and any snap-settle
    // animation fully finish) is the best signal for a drag that actually
    // moved the track — a plain "scroll" listener fires dozens of times per
    // drag and keeps pushing the resume timer out for as long as momentum
    // lasts. But a touch/click that DOESN'T end up scrolling anything (a
    // tap, or a drag too short to move the track) never fires "scrollend"
    // at all, so pointerup/touchend are kept as a second, independent path —
    // bound on window since a drag can end outside the track's own bounds.
    track.addEventListener("pointerdown", pause, { passive: true });
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("scrollend", scheduleResume, { passive: true });
    window.addEventListener("pointerup", scheduleResume, { passive: true });
    window.addEventListener("touchend", scheduleResume, { passive: true });

    return () => {
      clearInterval(interval);
      clearTimeout(resumeTimer);
      track.removeEventListener("pointerdown", pause);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("scrollend", scheduleResume);
      window.removeEventListener("pointerup", scheduleResume);
      window.removeEventListener("touchend", scheduleResume);
    };
  }, [intervalMs, resumeDelayMs]);

  return (
    <div ref={trackRef} className={className}>
      {children}
    </div>
  );
}
