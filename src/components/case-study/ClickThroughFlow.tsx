"use client";

import { useState } from "react";

type Step = { label: string; note?: string[] };
type Flow = { label: string; hasImages?: boolean; steps: Step[] };

// Lets the reader actually advance through a real named sequence instead
// of just reading a claim about how many steps it took. Every step chip
// is itself a button — click any of them to jump straight there, not
// just "next" one at a time — and each step can carry its own note(s),
// shown only while that step is current, so real in-the-moment
// annotations ("why is this hidden on hover?") read like margin notes
// instead of one paragraph dump above the diagram. A flow marked
// hasImages reserves a placeholder above the stepper for the real
// screenshot/gif of whichever step is current.
export default function ClickThroughFlow({ flows }: { flows: Flow[] }) {
  const [flowIdx, setFlowIdx] = useState(0);
  const [step, setStep] = useState(0);
  const flow = flows[flowIdx];
  const single = flow.steps.length <= 1;
  const done = step >= flow.steps.length - 1;
  const current = flow.steps[step];

  function selectFlow(i: number) {
    setFlowIdx(i);
    setStep(0);
  }

  return (
    <div className="case-box not-prose">
      {flows.length > 1 && (
        <div className="flex flex-wrap">
          {flows.map((f, i) => (
            <button
              key={f.label}
              onClick={() => selectFlow(i)}
              className="cap min-w-[110px] flex-1 border-b px-3 py-3 text-center transition-colors duration-150"
              style={{
                color: flowIdx === i ? "var(--accent)" : "var(--ink-mute)",
                background: flowIdx === i ? "rgba(var(--accent-rgb),.06)" : "transparent",
                borderColor: "var(--line)",
              }}
              aria-pressed={flowIdx === i}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-5 sm:p-6">
        {flows.length === 1 && flow.label && <div className="cap mb-3">{flow.label}</div>}

        <div className="flow-current-step" aria-live="polite"><span>{String(step + 1).padStart(2, "0")}</span><strong>{current.label}</strong></div>

        {/* Step chips double as jump targets: click any of them (reached
            or not) to set the current step directly, no need to walk
            through every step in between. */}
        <div className="flex flex-wrap items-center gap-y-2">
          {flow.steps.map((s, i) => {
            const reached = i <= step;
            const isCurrent = i === step;
            return (
              <span key={i} className="flex items-center">
                <button
                  onClick={() => setStep(i)}
                  className="whitespace-nowrap px-3 py-1.5 text-left text-[13.5px] transition-all duration-200"
                  style={{
                    border: "1px solid " + (isCurrent ? "var(--accent)" : reached ? "var(--line-strong)" : "var(--line)"),
                    borderRadius: "var(--r-sm)",
                    background: isCurrent ? "rgba(var(--accent-rgb),.08)" : reached ? "var(--paper-dim)" : "transparent",
                    color: reached ? "var(--ink)" : "var(--ink-mute)",
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {s.label}
                </button>
                {i < flow.steps.length - 1 && (
                  <span aria-hidden className="px-2" style={{ color: i < step ? "var(--accent)" : "var(--ink-mute)" }}>
                    &rarr;
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {current?.note && current.note.length > 0 && (
          <div className="mt-4 flex flex-col gap-1.5" style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 14 }}>
            {current.note.map((n, i) => (
              <p key={i} className="text-[13.5px] italic leading-snug" style={{ color: "var(--ink-soft)" }}>
                {n}
              </p>
            ))}
          </div>
        )}

        {/* Controls sit directly beneath the stepper, left-aligned like
            the rest of the page — not pinned to a far corner. Counter
            first, then the primary action leading the button row. */}
        {!single && (
          <div className="mt-5 flex flex-col gap-2.5">
            <span className="cap tabular-nums">
              {done ? `${flow.steps.length - 1} steps to get here` : `step ${step + 1} of ${flow.steps.length - 1}`}
            </span>
            <button
              onClick={() => setStep((s) => Math.min(s + 1, flow.steps.length - 1))}
              disabled={done}
              className="w-full px-4 py-2 text-[13px] font-medium transition-colors duration-150 sm:w-auto"
              style={{
                border: "1px solid " + (done ? "var(--line)" : "var(--accent)"),
                borderRadius: "var(--r-sm)",
                color: done ? "var(--ink-mute)" : "var(--paper)",
                background: done ? "transparent" : "var(--accent)",
                cursor: done ? "default" : "pointer",
              }}
            >
              {done ? "done" : `next: ${flow.steps[step + 1].label}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
