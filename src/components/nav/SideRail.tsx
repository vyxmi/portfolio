"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const items = [
  { href: "/", label: "home", index: "00" },
  { href: "/brain", label: "brain", index: "01" },
  { href: "/work", label: "work", index: "02" },
  { href: "/about", label: "about", index: "03" },
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
      className="group fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col justify-center gap-7"
      style={{ width: "var(--rail-w)", borderRight: "1px solid var(--void-line)", background: "var(--void)" }}
    >
      <Link
        href="/"
        className="absolute left-[22px] top-6 font-mono text-[10px] tracking-wide lowercase"
        style={{ color: "var(--void-mute)" }}
      >
        vyomi seth
      </Link>

      <nav className="flex flex-col gap-7 pl-[22px]">
        {items.map((it, i) => {
          const active = it.href === activeHref.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="group relative flex items-baseline gap-2 text-[11px] no-underline transition-transform duration-200"
              style={{
                color: active ? "var(--void-ink)" : "var(--void-mute)",
                transform: "translateX(calc(var(--prox, 0) * 3px))",
              }}
            >
              <span
                className="font-mono text-[10px]"
                style={{ color: active ? "var(--lift)" : "var(--void-mute)" }}
              >
                {it.index}
              </span>
              <span
                className={`min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ${
                  active ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0 group-hover:max-w-[80px] group-hover:opacity-70"
                }`}
              >
                {it.label}
              </span>
              <span
                className="pointer-events-none absolute -left-[22px] top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full transition-opacity duration-300"
                style={{
                  background: "var(--lift)",
                  opacity: active ? 1 : 0,
                }}
              />
            </Link>
          );
        })}
      </nav>

      {isCaseStudy && (
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: "var(--void-line)" }}
        >
          <div
            className="w-full"
            style={{ height: `${progress * 100}%`, background: "var(--lift)", transition: "height 80ms linear" }}
          />
        </div>
      )}
    </div>
  );
}
