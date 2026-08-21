"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { motionField, tickCards } from "@/lib/brain/motionField";

// Owns the Brain page's one animation loop: Lenis smooths native window
// scroll (no wrapper div, no scroll-jacking — it intercepts wheel/touch and
// eases the browser's own scroll position, so keyboard/scrollbar/reduced-
// motion all keep working untouched), and a single gsap.ticker callback
// derives scroll progress + velocity from it, drives card transforms
// (tickCards, pure DOM writes), and feeds BrainField's pointer/scroll
// uniforms via the shared motionField object. Mount once per Brain page
// visit; everything is torn down on unmount.
export default function BrainScrollProvider() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motionField.reducedMotion = reduced;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let lastScroll = lenis.scroll;

    function onTick(time: number) {
      lenis.raf(time * 1000);

      const limit = Math.max(1, lenis.limit);
      motionField.scrollY = lenis.scroll;
      motionField.scrollProgress = Math.min(1, Math.max(0, lenis.scroll / limit));
      const rawVelocity = lenis.scroll - lastScroll;
      lastScroll = lenis.scroll;
      motionField.velocity += (rawVelocity - motionField.velocity) * 0.15;
      motionField.time = time;

      tickCards();
    }

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    function onPointerMove(e: PointerEvent) {
      motionField.pointerX = e.clientX;
      motionField.pointerY = e.clientY;
      motionField.pointerNX = (e.clientX / window.innerWidth) * 2 - 1;
      motionField.pointerNY = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    function onVisibility() {
      motionField.paused = document.hidden;
      if (document.hidden) lenis.stop();
      else lenis.start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
    };
  }, []);

  return null;
}
