"use client";

import { useMemo, type RefObject } from "react";
import { buildDepthPlaneGeometry, type DepthPlaneConfig } from "./geometry";
import ParticlePoints from "./ParticlePoints";
import type { ParticleRuntimeState } from "./ParticleRuntime";

// Three depth planes, sparse and irregular rather than a starfield — deep
// is the bulk of the count (tiny, dim, almost stationary), middle is an
// occasional slow current, near is a small handful sized up to match
// flowerParticles and the only plane that meaningfully answers the cursor
// (a faint sense of shared medium around the vessel, not a strong effect).
// Every number here is the *only* thing that varies between planes — the
// drift/interaction/rendering machinery is identical, shared with
// flowerParticles through ParticlePoints.
export const AMBIENT_PLANES: DepthPlaneConfig[] = [
  {
    weight: 0.62,
    z: [-3.4, -1.7],
    size: [0.14, 0.32],
    opacity: [0.04, 0.1],
    speed: [0.05, 0.16],
    interaction: [0, 0],
    parallax: [0.004, 0.016],
  },
  {
    weight: 0.28,
    z: [-1.5, -0.4],
    size: [0.32, 0.75],
    opacity: [0.1, 0.2],
    speed: [0.22, 0.5],
    interaction: [0.02, 0.06],
    parallax: [0.02, 0.045],
  },
  {
    weight: 0.1,
    z: [-0.35, 0.15],
    size: [0.9, 1.6],
    opacity: [0.2, 0.38],
    speed: [0.45, 0.85],
    interaction: [0.14, 0.32],
    parallax: [0.06, 0.11],
  },
];

// The ambientParticles group: never converges into the flower or any
// other shape (morph is off) — see AMBIENT_PLANES above for what actually
// varies between the three depths.
export default function AmbientPoints({
  seed,
  particleCount,
  driftStrength,
  interactionStrength,
  interactionRadius,
  size,
  color,
  motionEnabled,
  runtime,
}: {
  seed: string | number;
  particleCount: number;
  driftStrength: number;
  interactionStrength: number;
  interactionRadius: number;
  size: number;
  color: string;
  motionEnabled: boolean;
  runtime: RefObject<ParticleRuntimeState>;
}) {
  const geo = useMemo(
    () => buildDepthPlaneGeometry({ seed, particleCount, planes: AMBIENT_PLANES }),
    [seed, particleCount]
  );

  return (
    <ParticlePoints
      geometry={geo}
      morph={false}
      position={{ x: 0, y: 0 }}
      scale={1}
      driftStrength={driftStrength}
      interactionStrength={interactionStrength}
      interactionRadius={interactionRadius}
      baseSize={size}
      colorA={color}
      colorB={color}
      motionEnabled={motionEnabled}
      runtime={runtime}
    />
  );
}
