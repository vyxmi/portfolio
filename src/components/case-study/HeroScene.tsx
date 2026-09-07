"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import SharedElement from "@/components/SharedElement";

export default function HeroScene({ slug, heading, visual, details }: { slug: string; heading: ReactNode; visual: ReactNode; details: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, .7], [1, 1.12]);
  const fieldY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  return <header ref={ref} className="article-opening immersive-opening" data-project={slug}>
    <motion.div className="hero-field" aria-hidden="true" style={{ y: reduced ? 0 : fieldY }}><i /><i /><i /></motion.div>
    <div className="hero-composition">
      <div className="hero-heading">{heading}</div>
      <SharedElement name={`art-${slug}`}><motion.div className="article-cover hero-art" style={{ y: reduced ? 0 : y, scale: reduced ? 1 : scale }}>{visual}</motion.div></SharedElement>
    </div>
    <div className="hero-details">{details}</div>
  </header>;
}
