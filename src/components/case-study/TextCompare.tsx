"use client";

import { useState } from "react";

// Two labeled bodies of prose the reader toggles between — same tab
// chrome as flowCompare/prototypeCompare, for a real before/after that's
// text rather than steps or stats (e.g. "old redemption" vs "new
// redemption" screen copy).
export default function TextCompare({ tabs }: { tabs: { label: string; body: string[] }[] }) {
  const [idx, setIdx] = useState(0);
  const t = tabs[idx];

  return (
    <div className="case-box not-prose">
      <div className="flex flex-wrap">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setIdx(i)}
            className="cap min-w-[110px] flex-1 border-b px-4 py-3 text-center transition-colors duration-150"
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
        {t.body.map((p, i) => (
          <p key={i} className="mb-2 text-[15px] leading-relaxed last:mb-0" style={{ color: "var(--ink-soft)" }}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
