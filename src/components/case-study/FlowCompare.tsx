"use client";

import { useState } from "react";

// Animated before/after between the original and redesigned card
// opening process. Real screenshots are not in yet, so this compares
// the real framing text from the case study rather than faking a flow
// diagram.
export default function FlowCompare() {
  const [mode, setMode] = useState<"original" | "new">("original");

  return (
    <div className="not-prose" style={{ border: "1px solid var(--line)" }}>
      <div className="flex" style={{ borderBottom: "1px solid var(--line)" }}>
        {(["original", "new"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="cap flex-1 px-4 py-3 text-center transition-colors duration-150"
            style={{
              color: mode === m ? "var(--accent)" : "var(--ink-mute)",
              background: mode === m ? "rgba(59,87,185,.06)" : "transparent",
              borderRight: m === "original" ? "1px solid var(--line)" : "none",
            }}
            aria-pressed={mode === m}
          >
            {m} card opening process
          </button>
        ))}
      </div>
      <div className="relative aspect-[16/9] overflow-hidden" style={{ background: "var(--paper-dim)" }}>
        <div
          className="absolute inset-0 flex items-center justify-center p-8 text-center transition-transform duration-500"
          style={{ transform: mode === "original" ? "translateX(0%)" : "translateX(-100%)" }}
        >
          <p className="max-w-sm text-[14px]" style={{ color: "var(--ink-soft)" }}>
            A single accidental swipe could cost users $5000+. This irreversible action was causing them to leave.
          </p>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center p-8 text-center transition-transform duration-500"
          style={{ transform: mode === "new" ? "translateX(0%)" : "translateX(100%)" }}
        >
          <p className="max-w-sm text-[14px]" style={{ color: "var(--ink-soft)" }}>
            Instead of teaching users not to make mistakes, the workflow was redesigned to recover from mistakes.
          </p>
        </div>
      </div>
      <div className="cap p-3">[Vyomi: real flow frames pending, this animates the framing copy for now]</div>
    </div>
  );
}
