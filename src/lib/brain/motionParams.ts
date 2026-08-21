import { hashSeed } from "./hash";
import type { BrainObject } from "./types";
import type { CardMotionParams } from "./motionField";

// Applied to every object on the wall — the motion language is proven, and
// every number below is derived from a per-object hash so it's stable
// across re-renders/filters without inventing new CMS columns, and so
// objects don't all move identically (see the ranges — several params
// are gated to a subset of hash buckets rather than applying to every
// card, per "don't animate every object aggressively").
export function deriveCardMotionParams(o: BrainObject): CardMotionParams {
  const seed = hashSeed(o.id);
  const depth = 0.15 + ((seed % 100) / 100) * 0.85;

  const rotates = seed % 3 === 0;
  const floats = seed % 5 === 0 || seed % 5 === 1;
  const scaleReveal = seed % 2 === 0;
  const hasGlassDrift = o.material === "smoked" || o.material === "frosted";

  return {
    depth,
    parallax: 14 + (1 - depth) * 46,
    driftX: 4 + ((seed >> 3) % 9),
    driftY: 3 + ((seed >> 5) % 7),
    rotation: rotates ? 1.2 + ((seed >> 2) % 30) / 10 : 0,
    floatAmplitude: floats ? 2 + ((seed >> 4) % 5) : 0,
    lag: 0.045 + (1 - depth) * 0.05,
    scaleReveal,
    phase: (seed % 628) / 100,
    vesselDriftX: hasGlassDrift ? 2 + ((seed >> 6) % 5) : 0,
    vesselDriftY: hasGlassDrift ? 2 + ((seed >> 7) % 4) : 0,
  };
}
