"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brainObjects } from "@/lib/brain/objects";

const items = [
  { href: "/", label: "home" },
  { href: "/brain", label: "brain" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = items.find((it) => (it.href === "/" ? pathname === "/" : pathname.startsWith(it.href))) ?? items[0];
  const isBrain = active.href === "/brain";

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50" style={{ background: "var(--void)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 font-mono text-[12px] lowercase"
        style={{ color: "var(--void-ink)", borderBottom: "1px solid var(--void-line)" }}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span style={{ color: "var(--lift)" }}>{active.label}</span>
          {isBrain && (
            <span style={{ color: "var(--void-mute)" }}>
              {brainObjects.length} {brainObjects.length === 1 ? "object" : "objects"}
            </span>
          )}
        </span>
        <span style={{ color: "var(--void-mute)" }}>{open ? "close" : "menu"}</span>
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
            className="block px-5 py-4 text-[15px] no-underline"
            style={{
              borderTop: "1px solid var(--void-line)",
              color: it.href === active.href ? "var(--void-ink)" : "var(--void-soft)",
              fontWeight: it.href === active.href ? 600 : 400,
            }}
          >
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
