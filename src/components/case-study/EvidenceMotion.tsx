"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Expand the artifact as it enters the reading area; never move body text.
export default function EvidenceMotion({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [36, 0]);
  return <div ref={ref} id={id} className={`evidence-stage ${className}`}><motion.div style={{ scale: reduced ? 1 : scale, y: reduced ? 0 : y }}>{children}</motion.div></div>;
}
