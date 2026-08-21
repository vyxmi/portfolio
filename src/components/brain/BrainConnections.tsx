"use client";

import { useEffect, useRef, useState } from "react";
import { useBrainConnections } from "./BrainConnectionsContext";

interface Line {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Temporary connector lines between an active object and its related
// objects — only drawn while something is hovered or pinned, and only
// between two objects both currently on screen. Nothing permanent, no
// spaghetti: this is the whole "web" at any moment.
export default function BrainConnections() {
  const { objectsById, getNode, activeId } = useBrainConnections();
  const [lines, setLines] = useState<Line[]>([]);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    function compute() {
      if (!activeId) {
        setLines([]);
        return;
      }
      const obj = objectsById.get(activeId);
      const sourceEl = getNode(activeId);
      if (!obj?.relatedIds?.length || !sourceEl) {
        setLines([]);
        return;
      }
      const vh = window.innerHeight;
      const sourceRect = sourceEl.getBoundingClientRect();
      const sourceOnScreen = sourceRect.bottom > 0 && sourceRect.top < vh;
      if (!sourceOnScreen) {
        setLines([]);
        return;
      }
      const next: Line[] = [];
      for (const relatedId of obj.relatedIds) {
        const targetEl = getNode(relatedId);
        if (!targetEl) continue;
        const targetRect = targetEl.getBoundingClientRect();
        if (!(targetRect.bottom > 0 && targetRect.top < vh)) continue;
        next.push({
          key: relatedId,
          x1: sourceRect.left + sourceRect.width / 2,
          y1: sourceRect.top + sourceRect.height / 2,
          x2: targetRect.left + targetRect.width / 2,
          y2: targetRect.top + targetRect.height / 2,
        });
      }
      setLines(next);
    }

    compute();
    function onScrollOrResize() {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        compute();
      });
    }
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [activeId, objectsById, getNode]);

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      width="100%"
      height="100%"
      style={{ opacity: lines.length ? 1 : 0, transition: "opacity 260ms var(--e-io)" }}
    >
      {lines.map((l) => {
        const midY = (l.y1 + l.y2) / 2;
        return (
          <path
            key={l.key}
            d={`M ${l.x1} ${l.y1} C ${l.x1} ${midY}, ${l.x2} ${midY}, ${l.x2} ${l.y2}`}
            fill="none"
            stroke="var(--void-line-strong)"
            strokeWidth="1"
            strokeDasharray="2 5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
