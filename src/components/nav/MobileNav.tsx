"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const items = [
  { href: "/", label: "home", index: "00" },
  { href: "/brain", label: "brain", index: "01" },
  { href: "/work", label: "work", index: "02" },
  { href: "/about", label: "about", index: "03" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = items.find((it) => (it.href === "/" ? pathname === "/" : pathname.startsWith(it.href))) ?? items[0];

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50" style={{ background: "var(--void)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 font-mono text-[12px] lowercase"
        style={{ color: "var(--void-ink)", borderBottom: "1px solid var(--void-line)" }}
        aria-expanded={open}
      >
        <span>
          <span style={{ color: "var(--lift)" }}>{active.index}</span> / {active.label}
        </span>
        <span style={{ color: "var(--void-mute)" }}>{open ? "close" : "index"}</span>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-400"
        style={{ maxHeight: open ? "260px" : "0px" }}
      >
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-5 py-4 text-[15px] no-underline"
            style={{
              borderTop: "1px solid var(--void-line)",
              color: it.href === active.href ? "var(--void-ink)" : "var(--void-soft)",
            }}
          >
            <span>{it.label}</span>
            <span className="font-mono text-[10px] lowercase" style={{ color: "var(--void-mute)" }}>
              {it.index}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
