"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { ParticleGroupGeometry } from "./geometry";
import { vertexShader, fragmentShader } from "./shaders";
import type { ParticleRuntimeState } from "./ParticleRuntime";

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
  idleClamp = 1000,
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
  /** Morphing (shapeBound) groups only — see uIdleClamp in shaders.ts. Default is effectively unclamped for groups that don't pass one (ambient is never gated on this anyway, since it doesn't morph). */
  idleClamp?: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBloomProgress: { value: 0 },
      uMorph: { value: morph ? 1 : 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerActive: { value: 0 },
      uInteractionStrength: { value: interactionStrength },
      uInteractionRadius: { value: interactionRadius },
      uDriftStrength: { value: driftStrength },
      uMotionEnabled: { value: motionEnabled ? 1 : 0 },
      uIdleClamp: { value: idleClamp },
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
    u.uInteractionStrength.value = interactionStrength;
    u.uInteractionRadius.value = interactionRadius;
    u.uDriftStrength.value = driftStrength;
    u.uBaseSize.value = baseSize;
    u.uMotionEnabled.value = motionEnabled ? 1 : 0;
    u.uIdleClamp.value = idleClamp;
    u.uDepthShade.value = depthShade ? 1 : 0;
    (u.uPosition.value as THREE.Vector2).set(position.x, position.y);
    u.uScale.value = scale;
    (u.uColorA.value as THREE.Color).set(colorA);
    (u.uColorB.value as THREE.Color).set(colorB);
  }, [
    scale,
    interactionStrength,
    interactionRadius,
    driftStrength,
    baseSize,
    motionEnabled,
    idleClamp,
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
        <bufferAttribute attach="attributes-aDriftAmp" args={[geometry.driftAmp, 1]} />
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
