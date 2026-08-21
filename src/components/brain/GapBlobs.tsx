"use client";

import { useEffect, useRef } from "react";
import type { BlobSpec } from "@/lib/brain/gapFillers";

// Lives inside .wall itself (not the fixed-background BrainField) so these
// sit among the cards, filling real dead space instead of floating over
// the whole viewport. One rAF loop drives every blob's `transform` —
// idle sine drift plus a spring-back repulsion from the cursor, the same
// shape as BrainFieldScene's particle nudge — so nothing else may touch
// `transform` on these elements (a CSS animation on the same property
// would just get overridden every frame; see brain.css).
export default function GapBlobs({ blobs }: { blobs: BlobSpec[] }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || blobs.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pointer = { x: -99999, y: -99999 };
    const pos = new Map<string, { x: number; y: number; vx: number; vy: number }>();
    blobs.forEach((b) => pos.set(b.id, { x: 0, y: 0, vx: 0, vy: 0 }));

    function onMove(e: PointerEvent) {
      const rect = layer!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }

    let raf = 0;
    const start = performance.now();
    function tick() {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - start) / 1000;
      for (const b of blobs) {
        const el = elsRef.current.get(b.id);
        const p = pos.get(b.id);
        if (!el || !p) continue;

        const cx = b.left + b.size / 2 + p.x;
        const cy = b.top + b.size / 2 + p.y;
        const dx = cx - pointer.x;
        const dy = cy - pointer.y;
        const dist = Math.hypot(dx, dy);
        const radius = b.size * 1.3 + 40;
        let targetX = 0;
        let targetY = 0;
        if (dist < radius && dist > 0.01) {
          const force = (1 - dist / radius) * (b.size * 0.32);
          targetX = (dx / dist) * force;
          targetY = (dy / dist) * force;
        }

        p.vx += (targetX - p.x) * 0.03;
        p.vy += (targetY - p.y) * 0.03;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        const idleX = Math.sin(t * 0.22 + b.driftPhase) * b.driftX;
        const idleY = Math.cos(t * 0.17 + b.driftPhase * 1.3) * b.driftY;

        el.style.transform = `translate3d(${(p.x + idleX).toFixed(1)}px, ${(p.y + idleY).toFixed(1)}px, 0) rotate(${b.rotation.toFixed(1)}deg)`;
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [blobs]);

  if (blobs.length === 0) return null;

  return (
    <div ref={layerRef} className="gap-blob-layer" aria-hidden="true">
      {blobs.map((b) => (
        <div
          key={b.id}
          ref={(el) => {
            if (el) elsRef.current.set(b.id, el);
            else elsRef.current.delete(b.id);
          }}
          className="gap-blob"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            borderRadius: b.radius,
            opacity: b.opacity,
            transform: `rotate(${b.rotation}deg)`,
            background: `radial-gradient(circle at 32% 28%, rgba(var(--ambient-periwinkle), ${(0.55 - b.tone * 0.22).toFixed(2)}), rgba(var(--ambient-grey), ${(0.24 + b.tone * 0.16).toFixed(2)}) 62%, transparent 100%)`,
          }}
        />
      ))}
    </div>
  );
}
