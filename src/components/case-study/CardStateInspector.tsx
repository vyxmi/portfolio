"use client";

import { useState } from "react";

const states: Record<number, { device: string; note: string; real: boolean }> = {
  1: { device: "desktop", note: "the desktop 1 card user flow", real: true },
  2: { device: "desktop or mobile", note: "[Vyomi: provide screenshot, 2 cards]", real: false },
  3: { device: "desktop or mobile", note: "[Vyomi: provide screenshot, 3 cards]", real: false },
  4: { device: "desktop or mobile", note: "[Vyomi: provide screenshot, 4 cards]", real: false },
  5: { device: "mobile", note: "part of the mobile 5 cards user flow", real: true },
};

// Replaces the five tiny static screenshots. Every state shares the same
// component library, so this is an actual system to poke at, not a
// gallery. Only 1 and 5 have real captions from the case study source;
// 2 through 4 are marked, not invented.
export default function CardStateInspector() {
  const [count, setCount] = useState(1);
  const s = states[count];

  return (
    <div className="case-box not-prose">
      <div className="flex items-center gap-1 p-4" style={{ borderBottom: "1px solid var(--line)" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setCount(n)}
            className="cap flex h-8 w-8 items-center justify-center transition-colors duration-150"
            style={{
              border: "1px solid " + (n === count ? "var(--accent)" : "var(--line)"),
              color: n === count ? "var(--accent)" : "var(--ink-mute)",
              background: n === count ? "rgba(59,87,185,.08)" : "transparent",
            }}
            aria-pressed={n === count}
          >
            {n}
          </button>
        ))}
        <span className="cap ml-3">cards open, {s.device}</span>
      </div>
      <div className="flex aspect-[16/9] items-center justify-center p-6 text-center" style={{ background: "var(--paper-dim)" }}>
        <div>
          <div className="text-[13px]" style={{ color: s.real ? "var(--ink-soft)" : "var(--ink-mute)" }}>
            {s.note}
          </div>
          {s.real && (
            <div className="cap mt-3">
              shared rule: min height 440px on mobile, so the confirm button holds its position across states
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
