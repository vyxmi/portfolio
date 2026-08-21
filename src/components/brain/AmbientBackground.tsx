"use client";

import { useEffect, useRef } from "react";

// The cheap CSS/SVG stand-in for BrainFieldScene, used on reduced-motion
// and low-power/small-touch devices (see BrainField). Same three systems,
// same restraint, just static geometry instead of a shader: a soft
// low-contrast flow layer (one CSS element, no shader), a sparse handful
// of small dark/periwinkle-gray particles, and a couple of faint organic
// filament paths. No bright shapes, no rings, no stars — atmosphere, not
// content, sitting behind the wall (z-index 0, pointer-events none).
type Tone = "periwinkle" | "grey";

interface Particle {
  top: string;
  left: string;
  size: number;
  tone: Tone;
  opacity: number;
  duration: number;
  delay: number;
  depth: number; // 0..1, how far this particle drifts under cursor parallax
  drift: 0 | 1 | 2 | 3; // which of the 4 drift paths, for non-uniform motion
}

const PARTICLES: Particle[] = [
  { top: "8%", left: "12%", size: 4, tone: "grey", opacity: 0.16, duration: 46, delay: 0, depth: 0.5, drift: 0 },
  { top: "18%", left: "82%", size: 3, tone: "periwinkle", opacity: 0.14, duration: 38, delay: 4, depth: 0.85, drift: 1 },
  { top: "30%", left: "6%", size: 5, tone: "grey", opacity: 0.12, duration: 58, delay: 10, depth: 0.4, drift: 3 },
  { top: "42%", left: "92%", size: 3, tone: "periwinkle", opacity: 0.15, duration: 50, delay: 6, depth: 0.35, drift: 1 },
  { top: "56%", left: "22%", size: 4, tone: "grey", opacity: 0.13, duration: 62, delay: 14, depth: 0.6, drift: 0 },
  { top: "64%", left: "68%", size: 3, tone: "periwinkle", opacity: 0.11, duration: 44, delay: 8, depth: 0.4, drift: 2 },
  { top: "24%", left: "44%", size: 3, tone: "grey", opacity: 0.14, duration: 40, delay: 18, depth: 0.9, drift: 1 },
  { top: "76%", left: "38%", size: 4, tone: "periwinkle", opacity: 0.12, duration: 54, delay: 22, depth: 0.5, drift: 3 },
  { top: "88%", left: "80%", size: 3, tone: "grey", opacity: 0.1, duration: 48, delay: 12, depth: 0.3, drift: 2 },
  { top: "10%", left: "58%", size: 3, tone: "periwinkle", opacity: 0.13, duration: 56, delay: 26, depth: 0.75, drift: 0 },
];

const TONE_RGB: Record<Tone, string> = {
  periwinkle: "var(--ambient-periwinkle)",
  grey: "var(--ambient-grey)",
};

export default function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    function apply() {
      raf = 0;
      root!.style.setProperty("--mx", `${x}px`);
      root!.style.setProperty("--my", `${y}px`);
    }

    function onMove(e: PointerEvent) {
      // Small, capped range — a light spatial reaction, not a mouse-follower.
      x = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 16;
      y = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 16;
      if (!raf) raf = requestAnimationFrame(apply);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="brain-ambient" aria-hidden="true">
      <div className="ambient-flow" />
      <svg className="ambient-filaments" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <path d="M -40 220 C 180 160, 260 340, 460 300 C 660 260, 720 120, 980 190" />
        <path d="M -40 760 C 200 830, 300 620, 540 690 C 760 750, 840 900, 1040 820" />
      </svg>
      {PARTICLES.map((p, i) => (
        <div key={i} className="ambient-parallax" style={{ top: p.top, left: p.left, ["--depth" as string]: p.depth }}>
          <span
            className={`ambient-drift ambient-drift-${p.drift} ambient-dot`}
            style={{
              width: p.size,
              height: p.size,
              background: `rgba(${TONE_RGB[p.tone]}, ${p.opacity})`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
