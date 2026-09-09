"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Magnet from "./Magnet";
export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    let last = window.scrollY;
    ref.current?.removeAttribute("data-hidden");
    const scroll = () => {
      const current = window.scrollY;
      if (ref.current) ref.current.dataset.top = String(current <= 8);
      if (Math.abs(current - last) < 6 && current > 70) return;
      if (ref.current) ref.current.dataset.hidden = String(current > last && current > 100);
      last = current;
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, [pathname]);
  return <nav ref={ref} className="fm-nav" aria-label="Primary navigation"><Link href="/#hero" className="fm-brand" onClick={() => { window.dispatchEvent(new Event("fridge-reset-magnets")); if (pathname === "/") window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }}><Magnet variant="click" rotation={-4.9}>vyomi seth</Magnet></Link><Link href="/#selected-work">work</Link><Link href="#contact">contact</Link></nav>;
}
