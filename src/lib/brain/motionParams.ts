import { createRng } from "./hash";
import type { BrainObject } from "./types";
import type { CardMotionParams } from "./motionField";

function lerp(rng: () => number, lo: number, hi: number) {
  return lo + rng() * (hi - lo);
}

// Every number here is pulled from one PRNG stream seeded on the object's
// own CMS uid (o.id) alone — never its vessel type or its position in the
// filtered/sorted array — so two objects rendered through the same vessel
// still drift differently, and a given object's motion survives re-sorts,
// re-filters, and re-renders untouched (same uid always replays the same
// stream, regardless of when/where deriveCardMotionParams is called). See
// tickCards() in motionField.ts for how duration/phase/direction actually
// get blended into a multi-frequency, non-looping path; this function only
// derives the per-object numbers that feed it.
export function deriveCardMotionParams(o: BrainObject): CardMotionParams {
  const rng = createRng(o.id);

  const depth = lerp(rng, 0.15, 1.0);
  const scaleReveal = rng() < 0.5;
  const hasGlassDrift = o.material === "smoked" || o.material === "frosted";

  // Position dominates: 6-24px of idle travel. Rotation is secondary and
  // barely perceptible per frame (0.15-0.6deg) — a hint of unsteadiness on
  // top of the drift, not a competing motion.
  const driftAmpX = lerp(rng, 6, 18);
  const driftAmpY = lerp(rng, 8, 24);
  const rotationAmp = lerp(rng, 0.15, 0.6);
  const duration = lerp(rng, 12, 24);
  const phase = rng() * Math.PI * 2;
  // A single seeded angle: orients the xy drift ellipse (so paths aren't
  // all axis-aligned the same way across objects) and, via which half of
  // the circle it falls in, biases which way this object's rotation leans
  // — see tickCards() for both uses.
  const direction = rng() * Math.PI * 2;

  return {
    depth,
    parallax: 14 + (1 - depth) * 46,
    lag: 0.045 + (1 - depth) * 0.05,
    scaleReveal,
    driftAmpX,
    driftAmpY,
    rotationAmp,
    duration,
    phase,
    direction,
    vesselDriftX: hasGlassDrift ? lerp(rng, 2, 7) : 0,
    vesselDriftY: hasGlassDrift ? lerp(rng, 2, 6) : 0,
  };
}
