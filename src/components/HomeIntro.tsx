"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";

// Same tokens as the rest of the site's dark surface — font-mono-sys for
// the mono tier (.eyebrow's own 13px/.04em/void-mute, sized up 1.5x here
// for the two greeting lines), the default sans for the role line, and the
// headline's own weight/tracking for both display lines. No new fonts, no
// new colors.
const MONO: CSSProperties = {
  fontFamily: "var(--font-mono-sys), ui-monospace, monospace",
  fontSize: 19.5,
  letterSpacing: ".04em",
  color: "var(--void-mute)",
  textTransform: "lowercase",
  lineHeight: 1.3,
};
const DISPLAY: CSSProperties = {
  fontWeight: 600,
  fontSize: "clamp(32px, 6vw, 58px)",
  lineHeight: 1.1,
  letterSpacing: "-.02em",
  color: "var(--void-ink)",
};
// The one-line positioning statement — sans (not mono), sized between the
// name and the byline so it reads as the headline's second beat rather
// than a caption.
const STATEMENT: CSSProperties = {
  fontWeight: 500,
  fontSize: "clamp(16px, 2vw, 20px)",
  lineHeight: 1.45,
  letterSpacing: "-.005em",
  color: "var(--void-ink)",
  maxWidth: 420,
};
// The byline — white mono instead of the muted sans used elsewhere for
// secondary text: it reads as a byline/credit line (same register as the
// mono greeting lines) rather than another headline. No forced lowercase
// here (unlike MONO/the old tagline) since it carries real proper nouns —
// Chance.live, Palo Alto Networks, QuinStreet — that must stay cased.
const BYLINE: CSSProperties = {
  fontFamily: "var(--font-mono-sys), ui-monospace, monospace",
  fontWeight: 400,
  fontSize: "clamp(13.5px, 1.6vw, 15px)",
  letterSpacing: ".03em",
  lineHeight: 1.4,
  color: "var(--void-ink)",
};

interface IntroLine {
  text: string;
  style: CSSProperties;
  /** Halftone grid cell size for this tier's dissolve mask, in px — scaled to the text size so the "grain" reads proportionate. */
  dotSize: number;
  marginBottom: number;
}

const LINES: IntroLine[] = [
  { text: "nice to meet you, i'm", style: MONO, dotSize: 6, marginBottom: 6 },
  { text: "vyomi seth", style: DISPLAY, dotSize: 10, marginBottom: 20 },
  { text: "i figure out what should exist, then design and build it.", style: STATEMENT, dotSize: 8, marginBottom: 18 },
  { text: "founding product designer at Chance.live · previously Palo Alto Networks + QuinStreet · bay area", style: BYLINE, dotSize: 6, marginBottom: 0 },
];

// Starts while the flower is still mid-converge (its bloomDuration settles
// around 2.6s) rather than waiting for it to fully finish. A 600ms stagger
// against a 1.6s per-line duration means each line is still finishing its
// dissolve when the next one starts (overlap, not a strict relay).
const START_MS = 1500;
const STAGGER_MS = 600;
const DURATION_S = 1.6;
const EASE = [0.16, 1, 0.3, 1] as const; // --e-out, same easing token used site-wide

function DissolveLine({
  line,
  delayMs,
  reduceMotion,
}: {
  line: IntroLine;
  delayMs: number;
  reduceMotion: boolean;
}) {
  // Staggering by delaying *when the animate target changes* (plain
  // setTimeout) rather than via Motion's own transition.delay: a delayed
  // Motion transition on a CSS custom property left --dot-r unresolved
  // during the wait, which invalidated the mask-image and rendered the
  // line fully solid (un-dissolved) for its entire pre-animation window.
  // Flipping `started` only once the wait is already over means Motion's
  // animation always starts immediately when invoked, so there's no
  // window where its state is ambiguous.
  const [started, setStarted] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setTimeout(() => setStarted(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs, reduceMotion]);

  const dotEnd = +(line.dotSize * 0.8).toFixed(2);
  const dotR = started ? `${dotEnd}px` : "0px";

  return (
    <motion.div
      style={
        {
          ...line.style,
          // Overscan: padding gives the mask room beyond the tight glyph
          // bounds (ascenders/descenders never clip at any frame), the
          // matching negative margin cancels it back out so it doesn't
          // shift this line's position or the marginBottom rhythm between
          // lines.
          padding: "0.15em 0.08em",
          margin: "-0.15em -0.08em",
          WebkitMaskImage: "radial-gradient(circle, #000 var(--dot-r), transparent var(--dot-r))",
          maskImage: "radial-gradient(circle, #000 var(--dot-r), transparent var(--dot-r))",
          WebkitMaskRepeat: "repeat",
          maskRepeat: "repeat",
          WebkitMaskSize: `${line.dotSize}px ${line.dotSize}px`,
          maskSize: `${line.dotSize}px ${line.dotSize}px`,
          "--dot-r": "0px",
          // Forces this element onto its own compositing layer, a standard
          // hint for anything with an animated mask sitting near other
          // GPU-heavy content (here, the homepage's always-rendering WebGL
          // flower canvas).
          transform: "translateZ(0)",
          willChange: "mask-image",
        } as CSSProperties
      }
      animate={{ "--dot-r": dotR }}
      transition={{ duration: reduceMotion ? 0 : DURATION_S, ease: EASE }}
    >
      {line.text}
    </motion.div>
  );
}

/**
 * The homepage hero intro: four lines, one shared left edge, each
 * materializing via a halftone-dot dissolve (a growing grid of circles
 * that merges into full coverage) rather than any directional wipe or
 * slide. The dot radius is driven by Motion directly onto a CSS custom
 * property consumed by a `mask-image`.
 */
export default function HomeIntro() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div style={{ maxWidth: 460 }}>
      {/* Registers --dot-r as a proper <length> custom property so an
          element that hasn't started dissolving in yet always has a valid
          value to fall back to (0px = fully masked/invisible), instead of
          var(--dot-r) going invalid and the whole mask-image with it. */}
      <style>{`
        @property --dot-r {
          syntax: '<length>';
          inherits: false;
          initial-value: 0px;
        }
      `}</style>
      {LINES.map((line, i) => (
        <div key={line.text} style={{ marginBottom: line.marginBottom }}>
          <DissolveLine line={line} delayMs={START_MS + i * STAGGER_MS} reduceMotion={reduceMotion} />
        </div>
      ))}
    </div>
  );
}
