"use client";

import { useState } from "react";

// A collapsed-by-default aside — a tangent, a raw list of open
// questions — that would otherwise break the main narrative's pace.
// Closed by default so a scanning reader isn't forced past it.
export default function Expand({ label, body, items }: { label: string; body?: string[]; items?: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="case-box not-prose">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-150"
        style={{ background: open ? "var(--paper-dim)" : "transparent" }}
        aria-expanded={open}
      >
        <span className="text-[14px] font-medium" style={{ color: "var(--ink)" }}>
          {label}
        </span>
        <span aria-hidden className="cap" style={{ color: "var(--accent)" }}>
          {open ? "hide" : "expand"}
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300"
        style={{ maxHeight: open ? 800 : 0, opacity: open ? 1 : 0 }}
      >
        <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid var(--line)" }}>
          {body?.map((p, i) => (
            <p key={i} className="mb-2 mt-3 text-[14px] leading-relaxed last:mb-0" style={{ color: "var(--ink-soft)" }}>
              {p}
            </p>
          ))}
          {items && items.length > 0 && (
            <ul className="mt-3 flex flex-col gap-2">
              {items.map((it, i) => (
                <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  <span style={{ color: "var(--accent)" }}>&bull;</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
