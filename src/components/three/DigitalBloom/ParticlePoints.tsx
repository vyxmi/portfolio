"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { ParticleGroupGeometry } from "./geometry";
import { vertexShader, fragmentShader } from "./shaders";
import type { ParticleRuntimeState } from "./ParticleRuntime";

// A cursor-velocity gust reads as noticeably stronger on-screen than the
// same magnitude of raw pointer displacement — this is purely a visual
// tuning constant on top of ParticleRuntime's physically-smoothed wind,
// applied here (not baked into the runtime) since it's a rendering choice,
// not a measurement.
const WIND_VISUAL_GAIN = 2.2;
// Internal engine tuning for the alive preset's hover-agitation term (see
// shaders.ts) — not exposed as a DigitalBloomProps knob in this pass.
const HOVER_NOISE_BOOST = 1.6;

// The one renderer behind every particle group. A group is entirely data
// (geometry + these props) — this component never branches on "which
// group am I," so a future text/vessel group is just another
// ParticleGroupGeometry fed in here, not new render code.
export default function ParticlePoints({
  geometry,
  morph,
  progressRef,
  depthShade = false,
  position,
  scale,
  driftStrength,
  interactionStrength,
  interactionRadius,
  baseSize,
  colorA,
  colorB,
  motionEnabled,
  runtime,
  outerRadius = 1,
  motionPreset = "legacy",
}: {
  geometry: ParticleGroupGeometry;
  /** Whether this group morphs from `base` toward its `target` shape at all. */
  morph: boolean;
  /** Only read when `morph` — current 0..1 shape-transition progress, updated every frame by the owning group (e.g. FlowerPoints' spring). */
  progressRef?: RefObject<number>;
  depthShade?: boolean;
  position: { x: number; y: number };
  scale: number;
  driftStrength: number;
  interactionStrength: number;
  interactionRadius: number;
  baseSize: number;
  colorA: string;
  colorB: string;
  motionEnabled: boolean;
  runtime: RefObject<ParticleRuntimeState>;
  outerRadius?: number;
  /** 'legacy' (default) reproduces the original shader output exactly; 'alive' opts into the new drift/hover behavior. See shaders.ts uAlive. */
  motionPreset?: "legacy" | "alive";
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBloomProgress: { value: 0 },
      uMorph: { value: morph ? 1 : 0 },
      uOuterRadius: { value: outerRadius * scale },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uWind: { value: new THREE.Vector2(0, 0) },
      uPointerActive: { value: 0 },
      uInteractionStrength: { value: interactionStrength },
      uInteractionRadius: { value: interactionRadius },
      uDriftStrength: { value: driftStrength },
      uMotionEnabled: { value: motionEnabled ? 1 : 0 },
      uAlive: { value: motionPreset === "alive" ? 1 : 0 },
      uHoverNoiseBoost: { value: HOVER_NOISE_BOOST },
      uDepthShade: { value: depthShade ? 1 : 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uBaseSize: { value: baseSize },
      uPosition: { value: new THREE.Vector2(position.x, position.y) },
      uScale: { value: scale },
      uViewportExtent: { value: new THREE.Vector2(1, 1) },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    // Seeded once at mount — later prop changes are pushed to the live
    // material via the effect below, not by rebuilding this object (that
    // would reset uTime/uBloomProgress and restart any in-flight motion).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const u = materialRef.current?.uniforms;
    if (!u) return;
    u.uOuterRadius.value = outerRadius * scale;
    u.uInteractionStrength.value = interactionStrength;
    u.uInteractionRadius.value = interactionRadius;
    u.uDriftStrength.value = driftStrength;
    u.uBaseSize.value = baseSize;
    u.uMotionEnabled.value = motionEnabled ? 1 : 0;
    u.uAlive.value = motionPreset === "alive" ? 1 : 0;
    u.uDepthShade.value = depthShade ? 1 : 0;
    (u.uPosition.value as THREE.Vector2).set(position.x, position.y);
    u.uScale.value = scale;
    (u.uColorA.value as THREE.Color).set(colorA);
    (u.uColorB.value as THREE.Color).set(colorB);
  }, [
    outerRadius,
    scale,
    interactionStrength,
    interactionRadius,
    driftStrength,
    baseSize,
    motionEnabled,
    motionPreset,
    depthShade,
    position.x,
    position.y,
    colorA,
    colorB,
  ]);

  useFrame(() => {
    const u = materialRef.current?.uniforms;
    if (!u) return;
    const rt = runtime.current;

    // eslint-disable-next-line react-hooks/immutability
    u.uTime.value = rt.time;
    (u.uViewportExtent.value as THREE.Vector2).copy(rt.viewportExtent);
    u.uBloomProgress.value = morph ? (progressRef?.current ?? 1) : 0;

    if (!motionEnabled) return;

    (u.uPointer.value as THREE.Vector2).copy(rt.pointer);
    (u.uWind.value as THREE.Vector2).copy(rt.wind).multiplyScalar(WIND_VISUAL_GAIN);
    u.uPointerActive.value = rt.pointerActive;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometry.target, 3]} />
        <bufferAttribute attach="attributes-aBase" args={[geometry.base, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[geometry.random, 4]} />
        <bufferAttribute attach="attributes-aMotion" args={[geometry.motion, 2]} />
        <bufferAttribute attach="attributes-aSize" args={[geometry.size, 1]} />
        <bufferAttribute attach="attributes-aOpacity" args={[geometry.opacity, 1]} />
        <bufferAttribute attach="attributes-aInteractionMul" args={[geometry.interactionMul, 1]} />
        <bufferAttribute attach="attributes-aParallax" args={[geometry.parallax, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={initialUniforms}
        transparent
        depthWrite={false}
        depthTest
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
