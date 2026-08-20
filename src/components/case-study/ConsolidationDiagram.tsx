"use client";

import ScrollReveal from "@/components/ScrollReveal";

// N fragmented things converging into one. Built for "7 workflows into
// 1 page" and "200+ pages into a design system", real structural facts
// from the case studies, not a generic diagram template.
export default function ConsolidationDiagram({
  from,
  to,
  fromLabel,
  toLabel,
}: {
  from: string[];
  to: string;
  fromLabel?: string;
  toLabel?: string;
}) {
  const n = from.length;
  return (
    <ScrollReveal className="not-prose">
      <div style={{ border: "1px solid var(--line)", padding: "28px 24px" }}>
        {fromLabel && <div className="cap mb-4">{fromLabel}</div>}
        <div className="relative flex" style={{ height: n * 34 }}>
          <svg
            className="absolute inset-0"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {from.map((_, i) => {
              const y = ((i + 0.5) / n) * 100;
              return (
                <path
                  key={i}
                  d={`M 34 ${y} L 66 50`}
                  stroke="var(--line-strong)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  fill="none"
                />
              );
            })}
          </svg>
          <div className="relative z-10 flex flex-1 flex-col justify-between">
            {from.map((f, i) => (
              <span key={i} className="cap" style={{ maxWidth: "40%" }}>
                {f}
              </span>
            ))}
          </div>
          <div className="relative z-10 flex flex-1 items-center justify-end">
            <span
              className="text-[13px] font-semibold"
              style={{ color: "var(--accent)", border: "1px solid var(--accent)", padding: "8px 14px" }}
            >
              {to}
            </span>
          </div>
        </div>
        {toLabel && <div className="cap mt-4">{toLabel}</div>}
      </div>
    </ScrollReveal>
  );
}
