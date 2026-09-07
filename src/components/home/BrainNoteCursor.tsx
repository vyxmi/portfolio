"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type PlacedNote = { id: string; text: string; x: number; y: number; rotate: number };

// CursorZone's cousin for the homepage headline: instead of a label that
// just follows the cursor and vanishes, this one looks like an actual
// brain note (reuses the wall's own sticky-note paper — see
// .vessel[data-vessel="sticky-note"] in brain.css, restyled here rather
// than fighting that class's own [role="button"] hover rules) and clicking
// a word leaves a real one behind, at that spot, draggable afterward.
// Positions are relative to this zone, not the viewport, so a placed note
// scrolls with the page like a physically-stuck note would.
export default function BrainNoteCursor({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [placed, setPlaced] = useState<PlacedNote[]>([]);
  const zoneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  function onMove(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    setPos({ x: e.clientX + 18, y: e.clientY + 18 });
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
    setLabel(target ? (target.dataset.cursor ?? null) : null);
  }

  function onLeave() {
    setLabel(null);
  }

  // Tap works the same as click, so this places notes on touch too — the
  // floating preview above stays mouse-only (a cursor label makes no
  // sense mid-tap), but leaving an actual note behind doesn't need one.
  function onClick(e: React.MouseEvent) {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
    const zoneRect = zoneRef.current?.getBoundingClientRect();
    if (!target || !zoneRect) return;
    const text = target.dataset.cursor ?? "";
    setPlaced((notes) => [
      ...notes,
      { id: `${text}-${Date.now()}`, text, x: e.clientX - zoneRect.left, y: e.clientY - zoneRect.top, rotate: Math.random() * 10 - 5 },
    ]);
  }

  return (
    <div ref={zoneRef} onPointerMove={onMove} onPointerLeave={onLeave} onClick={onClick} className="relative">
      {children}

      {/* the "about to place" preview, trailing the cursor */}
      <div
        aria-hidden
        className="brain-note brain-note-cursor pointer-events-none fixed top-0 left-0 z-[70] hidden md:block"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${label ? 1 : 0.6}) rotate(-3deg)`,
          opacity: label ? 1 : 0,
          transition: "transform 200ms cubic-bezier(.34,1.5,.6,1), opacity 200ms",
        }}
      >
        {label}
      </div>

      {/* real, placed, draggable notes — double-click one to pull it back off */}
      {placed.map((note) => (
        <motion.div
          key={note.id}
          className="brain-note brain-note-placed"
          style={{ position: "absolute", left: note.x, top: note.y, rotate: note.rotate, zIndex: 40 }}
          drag
          dragMomentum={false}
          dragElastic={0.12}
          whileDrag={{ scale: 1.06, zIndex: 80 }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: note.rotate - 16 }}
          animate={{ opacity: 1, scale: 1, rotate: note.rotate }}
          transition={{ type: "spring", stiffness: 480, damping: 20 }}
          onDoubleClick={() => setPlaced((notes) => notes.filter((n) => n.id !== note.id))}
        >
          {note.text}
        </motion.div>
      ))}
    </div>
  );
}
