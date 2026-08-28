"use client";

import { useEffect, useState } from "react";

// A vertical rail tracking scroll position through the case study, on
// the left — but starting where the light content does (--rail-w on
// desktop, where the dark nav rail is; the true left edge on mobile,
// where there's no rail to clear), never drawn over the dark nav itself.
// A permanent track (--line) plus a periwinkle fill growing from the top
// reads as one continuous scroll gauge, not a bar that only appears once
// you've started scrolling.
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setPct(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="fixed left-0 md:left-[var(--rail-w)] top-0 bottom-0 z-[70] w-[5px]" style={{ background: "var(--line)" }}>
      <div
        className="w-full"
        style={{ height: `${pct * 100}%`, background: "var(--periwinkle-deep)", transition: "height 80ms linear" }}
      />
    </div>
  );
}
