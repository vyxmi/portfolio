"use client";

import { useRef, useState, type ReactNode } from "react";

// Contextual cursor label, desktop only. Wrap a group of interactive
// items and give each one data-cursor="label". Regular reading, links
// outside a zone, and touch devices are untouched, on touch the browser
// simply never fires pointerenter here.
export default function CursorZone({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const zoneRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    setPos({ x: e.clientX + 16, y: e.clientY + 16 });
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
    setLabel(target ? target.dataset.cursor ?? null : null);
  }

  function onLeave() {
    setLabel(null);
  }

  return (
    <div ref={zoneRef} onPointerMove={onMove} onPointerLeave={onLeave} className="relative">
      {children}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] hidden md:block rounded-full font-mono text-[11px] lowercase tracking-wide"
        style={{
          background: "var(--lift)",
          color: "var(--void)",
          padding: "6px 12px",
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${label ? 1 : 0.6})`,
          opacity: label ? 1 : 0,
          transition: "transform 200ms cubic-bezier(.34,1.5,.6,1), opacity 200ms",
        }}
      >
        {label}
      </div>
    </div>
  );
}
