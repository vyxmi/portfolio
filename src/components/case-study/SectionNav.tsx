"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const; // --e-out

// A quiet jump-to-section rail for the light reading column — real
// wayfinding for a long case study, not a decoration. Only the sections
// that exist here (sectionHeading blocks) get a stop; nothing is
// invented to fill it out. The active dot uses a shared layoutId so it
// glides between stops instead of jumping, the one place this rail
// spends its "interesting motion" budget.
export default function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (sections.length === 0) return;
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Among headings currently crossing the trigger band, the
        // topmost one (smallest boundingClientRect.top) is "current" —
        // matches how a reader would describe which section they're in.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Jump to section"
      className="fixed z-[60] hidden 2xl:block"
      style={{ left: "calc(var(--rail-w) + 40px)", top: "50%", transform: "translateY(-50%)" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onFocusCapture={() => setIsExpanded(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsExpanded(false);
      }}
    >
      <motion.ul
        className="flex flex-col gap-3"
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
      >
        {sections.map((s) => {
          const isActive = active === s.id;
          const hasIndicator = (hovered ?? active) === s.id;
          return (
            <motion.li
              key={s.id}
              variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative"
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(s.id)}
              onBlur={() => setHovered(null)}
            >
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
                  history.replaceState(null, "", `#${s.id}`);
                }}
                className="-my-1.5 flex items-center gap-2.5 py-2 no-underline"
              >
                <span className="relative flex h-[7px] w-[7px] flex-none items-center justify-center">
                  {hasIndicator && (
                    <motion.span
                      layoutId="section-nav-dot"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--periwinkle-deep)" }}
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  {!hasIndicator && <span className="absolute inset-0 rounded-full" style={{ background: "var(--line-strong)" }} />}
                </span>
                <AnimatePresence>
                  {(isActive || isExpanded) && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="cap whitespace-nowrap"
                      style={{ color: isActive ? "var(--ink)" : "var(--ink-mute)", fontWeight: 400 }}
                    >
                      {s.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </a>
            </motion.li>
          );
        })}
      </motion.ul>
    </nav>
  );
}
