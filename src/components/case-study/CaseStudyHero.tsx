"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/lib/projects";
import type { CaseStudyContent } from "@/lib/case-study-types";
import { CaseImage } from "./CaseStudy";
import MetricsRow from "./MetricsRow";

const EASE = [0.16, 1, 0.3, 1] as const; // --e-out, same easing token used site-wide

// Entrance beats: eyebrow → title → summary → thumbnail → metrics, each
// picking up ~90ms after the last so the hero assembles top to bottom
// instead of arriving as one flat block. Metrics then stagger their own
// chips off this same timeline (see MetricsRow's baseDelay).
const EYEBROW_DELAY = 0;
const TITLE_DELAY = 0.09;
const SUMMARY_DELAY = 0.18;
const THUMB_DELAY = 0.28;
const METRICS_DELAY = 0.4;
const CUE_DELAY = 1.1;

export function CaseStudyHero({ project, content }: { project: Project; content: CaseStudyContent }) {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Scoped to this <header> only: progress goes 0→1 as the hero travels
  // from just entering the viewport to fully scrolled past, driving a
  // restrained parallax drift on the thumbnail — not the whole hero, so
  // text never fights the reading position.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const rawParallaxY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const parallaxY = reduceMotion ? 0 : rawParallaxY;

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <header ref={heroRef} className="pb-12 pt-6">
      <motion.div className="eyebrow mb-4" {...fadeUp(EYEBROW_DELAY)}>
        {project.role} &middot; {project.company} &middot; {project.year}
      </motion.div>
      <motion.h1
        className="mb-6 text-[34px] font-semibold leading-[1.05] md:text-[48px]"
        style={{ letterSpacing: "-.015em" }}
        {...fadeUp(TITLE_DELAY)}
      >
        {project.title}
      </motion.h1>
      <motion.p className="measure mb-10 text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }} {...fadeUp(SUMMARY_DELAY)}>
        {content.heroLine}
      </motion.p>

      {content.heroImage && (
        <motion.div
          className="mb-10"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: THUMB_DELAY, ease: EASE }}
        >
          <motion.div style={{ y: parallaxY }}>
            <CaseImage
              src={content.heroImage.src}
              alt={content.heroImage.alt}
              caption={project.result}
              hideCaption
              width={content.heroImage.width}
              height={content.heroImage.height}
              transparentMedia={content.heroImage.transparentMedia}
            />
          </motion.div>
        </motion.div>
      )}

      <MetricsRow metrics={project.metrics} className="mb-6" baseDelay={METRICS_DELAY} />

      {/* A quiet nudge toward the facts sheet below — real content, not
          just a decorative bounce: the eyebrow beneath it says what's
          there before you scroll to it. */}
      <motion.div
        className="mb-2 flex items-center gap-2"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: CUE_DELAY, ease: EASE }}
      >
        <motion.span
          aria-hidden
          className="cap"
          style={{ color: "var(--ink-mute)" }}
          animate={reduceMotion ? {} : { y: [0, 4, 0] }}
          transition={reduceMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: CUE_DELAY + 0.4 }}
        >
          &darr;
        </motion.span>
        <span className="cap" style={{ color: "var(--ink-mute)" }}>
          company, role, team, duration
        </span>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-6 sm:grid-cols-4"
        style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {content.facts.map((f, i) => (
          <motion.div
            key={f.label}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
          >
            <div className="cap mb-1">{f.label}</div>
            <div className="text-[13.5px]" style={{ color: "var(--ink)" }}>
              {f.value}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </header>
  );
}
