"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { SELECTED_SLUGS } from "@/lib/presentation";
import EvidenceMotion from "@/components/case-study/EvidenceMotion";

// The V1 routes share one restrained entrance; other pages keep their
// existing evidence-only motion until their own redesign.
export default function ScrollReveal({ children, className = "", id, delay = 0 }: { children: ReactNode; className?: string; delay?: number; id?: string }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  if (pathname === "/" || SELECTED_SLUGS.some(slug => pathname === `/work/${slug}`)) return <motion.div className={className} id={id} initial={reduced ? false : { opacity: 0, y: 34, scale: .992, filter: "blur(3px)" }} whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} viewport={{ once: true, amount: .12, margin: "0px 0px -6% 0px" }} transition={{ delay: reduced ? 0 : delay, duration: reduced ? 0 : .68, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
  if (className.split(" ").includes("not-prose")) return <EvidenceMotion className={className} id={id}>{children}</EvidenceMotion>;
  return <div className={className} id={id}>{children}</div>;
}
