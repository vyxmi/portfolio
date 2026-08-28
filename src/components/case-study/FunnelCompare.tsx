"use client";

import { useEffect, useRef, useState } from "react";

type Group = { label: string; dateRange?: string; n?: string; stages: { label: string; pct: number }[] };

// Two (or more) labeled funnels stacked for a direct before/after read —
// e.g. a signup cohort before and after a redesign. Bars fill in on
// scroll; a "raw numbers" toggle reveals the date range/cohort size
// behind each bar for anyone who wants the receipts. Every number here
// is real, pulled straight from the case study's own stated figures.
export default function FunnelCompare({ groups, caption }: { groups: Group[]; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [showRaw, setShowRaw] = useState(false);

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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="not-prose">
      <div className="case-box flex flex-col gap-6 p-6">
        {groups.map((g, gi) => {
          const max = Math.max(...g.stages.map((s) => s.pct));
          return (
            <div key={g.label}>
              <div className="mb-2 flex items-baseline justify-between">
                <div className="cap font-medium" style={{ color: "var(--ink)" }}>
                  {g.label}
                </div>
                {showRaw && (g.dateRange || g.n) && (
                  <div className="cap" style={{ color: "var(--ink-mute)" }}>
                    {[g.dateRange, g.n].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {g.stages.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative h-6 flex-1 overflow-hidden" style={{ background: "var(--paper-dim)" }}>
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: shown ? `${(s.pct / max) * 100}%` : "0%",
                          background: i === 0 ? "var(--line-strong)" : "var(--accent)",
                          transition: `width 900ms var(--e-out) ${(gi * g.stages.length + i) * 110}ms`,
                        }}
                      />
                    </div>
                    <div
                      className="w-16 flex-none text-right font-mono text-[14.5px] font-medium tabular-nums"
                      style={{ color: i === 0 ? "var(--ink-mute)" : "var(--accent)" }}
                    >
                      {s.pct}%
                    </div>
                    <div className="w-32 flex-none text-[12.5px]" style={{ color: "var(--ink-mute)" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <button
          onClick={() => setShowRaw((v) => !v)}
          className="cap self-start transition-opacity duration-150 hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          {showRaw ? "hide raw numbers" : "see raw numbers"}
        </button>
      </div>
      {caption && <div className="cap mt-3">{caption}</div>}
    </div>
  );
}
