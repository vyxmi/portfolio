"use client";

import { useEffect, useRef } from "react";

// A vertical rail tracking scroll position through the case study, on
// the left — but starting where the light content does (--rail-w on
// desktop, where the dark nav rail is; the true left edge on mobile,
// where there's no rail to clear), never drawn over the dark nav itself.
// A permanent track (--line) plus a periwinkle fill growing from the top
// reads as one continuous scroll gauge, not a bar that only appears once
// you've started scrolling.
//
// Writes height straight to the DOM (no React state) so scroll doesn't
// drive a re-render on every tick — a CSS transition fighting that many
// updates a second was the source of visible stutter at the top of the
// page, where scrolling starts.
export default function ReadingProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    function update() {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (fillRef.current) fillRef.current.style.height = `${pct * 100}%`;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="fixed left-0 top-0 bottom-0 z-[70] w-[5px]" style={{ background: "var(--line)" }}>
      <div ref={fillRef} className="w-full" style={{ height: 0, background: "var(--periwinkle-deep)" }} />
    </div>
  );
}
