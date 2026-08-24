"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { buildFlowerGeometry } from "./geometry";
import ParticlePoints from "./ParticlePoints";
import type { ParticleRuntimeState } from "./ParticleRuntime";

// The flowerParticles group: owns the one thing genuinely specific to it
// (the formed/dispersed spring), builds its own geometry, and hands both
// to the shared engine. All motion/interaction logic lives in
// ParticlePoints/shaders.ts — nothing here duplicates it.
export default function FlowerPoints({
  seed,
  particleCount,
  petalCount,
  bloomDuration,
  formed,
  position,
  scale,
  driftStrength,
  interactionStrength,
  interactionRadius,
  baseSize,
  colorPrimary,
  colorAccent,
  interactive,
  runtime,
  motionPreset = "legacy",
}: {
  seed: string | number;
  particleCount: number;
  petalCount: number;
  bloomDuration: number;
  /** Target state driven by the parent's click/tap toggle — true = formed. */
  formed: boolean;
  position: { x: number; y: number };
  scale: number;
  driftStrength: number;
  interactionStrength: number;
  interactionRadius: number;
  baseSize: number;
  colorPrimary: string;
  colorAccent: string;
  interactive: boolean;
  runtime: RefObject<ParticleRuntimeState>;
  motionPreset?: "legacy" | "alive";
}) {
  const geo = useMemo(
    () => buildFlowerGeometry({ seed, particleCount, petalCount }),
    [seed, particleCount, petalCount]
  );

  // Bloom progress is a value the toggle drives toward 0 (dispersed) or 1
  // (formed) with a frame-rate-independent exponential ease — a damped
  // spring's settling curve without the overshoot risk of simulating one.
  // Starts at 0 with `formed` defaulting true, so mount plays the same
  // "converge in" motion as the initial entrance; later toggles just
  // re-target it. Every particle is already visible at its scattered
  // `base` position from frame one (see shaders.ts) — this only ever
  // animates position, never spawns or fades anything in.
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (!interactive) {
      progressRef.current = formed ? 1 : 0;
      return;
    }
    const target = formed ? 1 : 0;
    const tau = Math.max(0.05, bloomDuration / 3);
    const alpha = 1 - Math.exp(-delta / tau);
    progressRef.current += (target - progressRef.current) * alpha;
  });

  return (
    <ParticlePoints
      geometry={geo}
      morph
      progressRef={progressRef}
      depthShade
      outerRadius={geo.outerRadius}
      position={position}
      scale={scale}
      driftStrength={driftStrength}
      interactionStrength={interactionStrength}
      interactionRadius={interactionRadius}
      baseSize={baseSize}
      colorA={colorPrimary}
      colorB={colorAccent}
      motionEnabled={interactive}
      runtime={runtime}
      motionPreset={motionPreset}
    />
  );
}
