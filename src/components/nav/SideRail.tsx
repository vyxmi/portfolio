"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const items = [
  { href: "/brain", label: "brain" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
];

export default function SideRail() {
  const pathname = usePathname();
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const isHome = pathname === "/";
  // No fallback to items[0]: home has no entry of its own here (see the
  // logo/icon link instead), so on "/" none of these three should read as
  // active — falling back to "brain" would be a lie about where you are.
  const activeHref = items.find((it) => pathname.startsWith(it.href));

  // cursor proximity: nearby items lift slightly, others recede
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    function onMove(e: PointerEvent) {
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(e.clientY - (r.top + r.height / 2));
        const prox = Math.max(0, 1 - d / 160);
        el.style.setProperty("--prox", String(prox));
      });
    }
    function onLeave() {
      itemRefs.current.forEach((el) => el?.style.setProperty("--prox", "0"));
    }
    rail.addEventListener("pointermove", onMove);
    rail.addEventListener("pointerleave", onLeave);
    return () => {
      rail.removeEventListener("pointermove", onMove);
      rail.removeEventListener("pointerleave", onLeave);
    };
  }, []);


  return (
    <div
      ref={railRef}
      className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col"
      style={{ width: "var(--rail-w)", borderRight: "1px solid var(--void-line)", background: "var(--void)" }}
    >
      {/* group: lets the image react to hovering the link itself, since the
          image is pointer-events-none. Hover only steps opacity up when not
          already home — being on the page it links to is the stronger
          state and shouldn't dim on hover. */}
      <Link href="/" className="group relative block overflow-hidden" style={{ height: 96 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/nav/logo-bloom.png"
          alt=""
          aria-hidden
          className={`pointer-events-none absolute object-contain transition-opacity duration-300 ${
            isHome ? "opacity-70" : "opacity-30 group-hover:opacity-50"
          }`}
          /* The source PNG is opaque black behind the flower dots, not
             transparent — screen blending drops that black background out
             against the rail's own near-black void, leaving just the dots.
             Insets are asymmetric (not 18 on both sides) to nudge the whole
             flower left a touch while staying the same size and fully
             inside this overflow-hidden box, so nothing gets clipped. */
          style={{ top: 18, left: 10, right: 26, bottom: 18, mixBlendMode: "screen" }}
        />
        <span
          className="relative flex h-full w-full items-center justify-center font-mono text-[20px] tracking-wide lowercase"
          style={{ color: "var(--void-ink)" }}
        >
          vs
        </span>
      </Link>

      {/* Top-left, directly under the icon — not vertically centered in
          the rail — now that the icon itself is the home link. */}
      <nav className="flex flex-col items-start gap-8 px-6 pt-10 lg:gap-10">
        {items.map((it, i) => {
          const active = it.href === activeHref?.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative text-[13px] no-underline transition-[transform,color] duration-200"
              style={{
                color: active ? "var(--void-ink)" : "var(--void-mute)",
                fontWeight: active ? 600 : 400,
                transform: "translateX(calc(var(--prox, 0) * 3px))",
              }}
            >
              {it.label}
              <span
                className="pointer-events-none absolute -left-6 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full transition-opacity duration-300"
                style={{ background: "var(--lift)", opacity: active ? 1 : 0 }}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
