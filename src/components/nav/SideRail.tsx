"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const items = [
  { href: "/", label: "home" },
  { href: "/brain", label: "brain" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
];

export default function SideRail() {
  const pathname = usePathname();
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [progress, setProgress] = useState(0);

  const isCaseStudy = /^\/work\/[^/]+$/.test(pathname);

  const activeHref =
    items.find((it) => (it.href === "/" ? pathname === "/" : pathname.startsWith(it.href))) ?? items[0];

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

  // scroll progress, only meaningful on a case study route
  useEffect(() => {
    if (!isCaseStudy) return;
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isCaseStudy]);

  return (
    <div
      ref={railRef}
      className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col"
      style={{ width: "var(--rail-w)", borderRight: "1px solid var(--void-line)", background: "var(--void)" }}
    >
      <Link
        href="/"
        className="block px-6 pt-6 font-mono text-[10px] leading-tight tracking-wide lowercase"
        style={{ color: "var(--void-mute)" }}
      >
        vyomi
        <br />
        seth
      </Link>

      <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-6">
        {items.map((it, i) => {
          const active = it.href === activeHref.href;
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

      {isCaseStudy && (
        <div aria-hidden className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: "var(--void-line)" }}>
          <div
            className="w-full"
            style={{ height: `${progress * 100}%`, background: "var(--lift)", transition: "height 80ms linear" }}
          />
        </div>
      )}
    </div>
  );
}
