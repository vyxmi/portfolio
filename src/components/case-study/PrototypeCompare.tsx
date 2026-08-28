"use client";

import { useState } from "react";

type Tab = { label: string; body: string[]; verdict: "shipped" | "lost"; why?: string[] };

// Tab-switchable named options explored for the same problem, each
// marked as shipped or not — for a real design debate with more than
// two sides. A "lost" tab with no `why` yet shows an honest placeholder
// rather than a fabricated reason.
export default function PrototypeCompare({ tabs }: { tabs: Tab[] }) {
  const [idx, setIdx] = useState(0);
  const t = tabs[idx];

  return (
    <div className="case-box not-prose">
      <div className="flex flex-wrap">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setIdx(i)}
            className="cap min-w-[110px] flex-1 border-b px-3 py-3 text-center transition-colors duration-150"
            style={{
              color: idx === i ? "var(--accent)" : "var(--ink-mute)",
              background: idx === i ? "rgba(var(--accent-rgb),.06)" : "transparent",
              borderColor: "var(--line)",
            }}
            aria-pressed={idx === i}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="cap px-2 py-0.5"
            style={
              t.verdict === "shipped"
                ? { color: "var(--accent)", border: "1px solid var(--accent)" }
                : { color: "var(--ink-mute)", border: "1px solid var(--line)" }
            }
          >
            {t.verdict === "shipped" ? "shipped" : "didn't ship"}
          </span>
        </div>
        {t.body.map((p, i) => (
          <p key={i} className="mb-2 text-[15px] leading-relaxed last:mb-0" style={{ color: "var(--ink-soft)" }}>
            {p}
          </p>
        ))}
        {t.verdict === "lost" && (
          <div className="mt-3">
            {t.why && t.why.length > 0 ? (
              t.why.map((w, i) => (
                <p key={i} className="text-[13.5px] italic leading-relaxed" style={{ color: "var(--ink-mute)" }}>
                  {w}
                </p>
              ))
            ) : (
              <p className="text-[12.5px]" style={{ color: "#7A5A17" }}>
                [FLAG] why this one lost isn&rsquo;t written up yet, send it and I&rsquo;ll drop it in here.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
