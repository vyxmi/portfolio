"use client";

import { useEffect, useRef, useState } from "react";

// Stage-over-stage drop-off as bars that fill in on scroll, not a static
// screenshot of a chart. Every stage is a real percentage from the case
// study's own numbers — this renders data that's already stated in the
// copy, it doesn't invent any.
export default function FunnelStat({
  label,
  stages,
  caption,
}: {
  label?: string;
  stages: { label: string; pct: number }[];
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...stages.map((s) => s.pct));

  return (
    <div ref={ref} className="not-prose">
      {label && <div className="cap mb-3">{label}</div>}
      <div className="flex flex-col gap-3" style={{ border: "1px solid var(--line)", padding: "24px 24px" }}>
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1].pct : null;
          const drop = prev !== null ? prev - s.pct : null;
          return (
            <div key={i}>
              {drop !== null && drop > 0 && (
                <div className="cap mb-1.5" style={{ color: "var(--ink-mute)" }}>
                  &darr; {drop}% dropped off
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="relative h-8 flex-1 overflow-hidden" style={{ background: "var(--paper-dim)" }}>
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      width: shown ? `${(s.pct / max) * 100}%` : "0%",
                      background: i === 0 ? "var(--line-strong)" : "var(--accent)",
                      transition: `width 900ms var(--e-out) ${i * 140}ms`,
                    }}
                  />
                </div>
                <div
                  className="w-14 flex-none text-right font-mono text-[16px] font-medium tabular-nums"
                  style={{ color: i === 0 ? "var(--ink-mute)" : "var(--accent)" }}
                >
                  {s.pct}%
                </div>
              </div>
              <div className="cap mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>
      {caption && <div className="cap mt-3">{caption}</div>}
    </div>
  );
}
