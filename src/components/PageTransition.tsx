"use client";

import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";

// A quiet settle-in on every route change: content fades and rises 10px
// into place instead of cutting straight in. Keyed by pathname so each
// navigation remounts this wrapper and the CSS animation replays —
// no effect/state needed. React's <ViewTransition> (which would let the
// old page animate out too) isn't in this project's pinned React build
// yet, so this is the entry half only. The nav rail and mobile header
// live in the layout, outside this boundary, so they never participate
// and stay still while the content underneath moves.
//
// page-settle (globals.css) animates margin-top, not transform: a held
// transform — even an identity one like a settled translateY(0) — makes
// this div a containing block for any position: fixed descendant (e.g.
// the CursorZone cursor label, or a page's own fixed-position layers),
// misplacing them for the rest of the page's life. animationend firing
// reliably shouldn't be load-bearing for that; margin-top never creates a
// containing block regardless. The cleanup below just tidies the inline
// style once the animation's done — it's not the thing preventing the trap.
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      key={pathname}
      ref={ref}
      style={{ animation: "page-settle var(--t-page) var(--e-out) both" }}
      onAnimationEnd={(e) => {
        if (e.target === ref.current) ref.current!.style.animation = "";
      }}
    >
      {children}
    </div>
  );
}
