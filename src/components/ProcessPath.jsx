import React, { useEffect, useRef, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// A step reveals once, the moment its own row nears the center of the
// viewport — this is what makes the eye track down the page in sync with
// the line, rather than everything being visible (and thus meaningless) at once.
function useRevealed(ref, reducedMotion) {
  const [revealed, setRevealed] = useState(reducedMotion);
  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: "-15% 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);
  return revealed;
}

export default function ProcessPath({ steps }) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }
    let ticking = false;
    function measure() {
      ticking = false;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // The line starts filling once its top reaches the vertical center of
      // the viewport, and finishes once its bottom reaches the same center —
      // so it's always the middle of the screen, where the eye actually is,
      // that determines how much of the journey has been "walked."
      const center = vh * 0.5;
      const total = rect.height;
      const traveled = center - rect.top;
      const pct = Math.min(1, Math.max(0, traveled / total));
      setProgress(pct);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* The spine: a single straight vertical line, unambiguous about
          order and direction — the eye reads top-to-bottom the same way
          it reads the page. Track (always visible) + fill (scroll-scrubbed). */}
      <div
        ref={trackRef}
        className="absolute start-6 sm:start-1/2 top-3 bottom-3 w-1 -translate-x-1/2 rounded-full bg-teal/12"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 w-full rounded-full bg-teal origin-top"
          style={{ transform: `scaleY(${progress})` }}
        />
      </div>

      <div className="flex flex-col gap-20 sm:gap-28">
        {steps.map((step, i) => (
          <Step
            key={step.n}
            step={step}
            index={i}
            total={steps.length}
            progress={progress}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

function Step({ step, index, total, progress, reducedMotion }) {
  const ref = useRef(null);
  const revealed = useRevealed(ref, reducedMotion);
  const lit = progress >= (index + 0.5) / total;
  const isRight = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-5 sm:gap-16 ps-16 sm:ps-0 ${
        isRight ? "sm:flex-row-reverse" : "sm:flex-row"
      }`}
    >
      <div
        className={`absolute start-6 sm:start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 border-2 bg-white shadow-card transition-[color,border-color,transform] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          lit ? "scale-105" : "scale-100"
        }`}
        style={{ borderColor: lit ? "#1B7F7E" : "#1B7F7E22", color: lit ? "#1B7F7E" : "#9E9E9E" }}
      >
        <step.icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
      </div>

      <div className="hidden sm:block sm:flex-1" />

      <div
        className={`flex-1 sm:max-w-sm transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isRight ? "sm:text-right" : "sm:text-left"
        }`}
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(14px)",
        }}
      >
        <span className="font-display font-bold text-sm text-gold-dark">{step.n}</span>
        <h3 className="font-display font-semibold text-lg sm:text-xl text-teal-dark mt-0.5">{step.title}</h3>
        <p className="mt-1.5 text-sm text-ink/60 leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}
