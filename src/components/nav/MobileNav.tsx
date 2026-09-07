"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Work is deliberately left off — temporarily out of the nav everywhere
// (see SideRail), including here. The route and its case studies still
// work if linked to directly; they're just not advertised in either nav.
const items = [
  { href: "/", label: "Vyomi" },
  { href: "/brain", label: "Brain" },
  { href: "/about", label: "About" },
];

export default function MobileNav({ objectCount }: { objectCount: number }) {
  const pathname = usePathname();
  return (
    <nav className="site-bottom-dock site-nav md:hidden" aria-label="Primary navigation">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return <Link key={item.href} href={item.href} data-active={active || undefined}><span>{item.label}</span>{item.href === "/brain" && <small>{objectCount}</small>}</Link>;
      })}
    </nav>
  );
}
