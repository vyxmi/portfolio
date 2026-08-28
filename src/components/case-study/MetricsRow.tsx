"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Metric } from "@/lib/projects";

const EASE = [0.16, 1, 0.3, 1] as const; // --e-out

// The one place a case study's headline numbers live. Structure carries
// the emphasis here, not color: a bordered chip and a bold value read as
// "this is a result" without needing a saturated accent to say so. Chips
// pop in with a per-item stagger off a shared `baseDelay` so this row
// reads as the next beat in the hero's entrance sequence, not a
// separately-timed animation.
export default function MetricsRow({
  metrics,
  className = "",
  baseDelay = 0,
}: {
  metrics: Metric[];
  className?: string;
  baseDelay?: number;
}) {
  const reduceMotion = useReducedMotion();
  if (!metrics.length) return null;
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          className="flex flex-col gap-1 rounded-[var(--r-sm)] px-4 py-3 transition-colors duration-200 hover:bg-[var(--paper-dim)]"
          style={{ border: "1px solid var(--line)" }}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: baseDelay + i * 0.06, ease: EASE }}
        >
          <span
            className="font-mono text-[20px] font-medium leading-none md:text-[22px]"
            style={{ letterSpacing: "-.01em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}
          >
            {m.value}
          </span>
          <span className="cap">{m.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
