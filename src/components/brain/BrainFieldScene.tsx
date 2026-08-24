"use client";

/* eslint-disable react-hooks/refs --
   This is a React Three Fiber scene: every ref below intentionally holds a
   mutable Three.js object (geometry, material, simulation vectors) that is
   read once lazily, then written to every frame inside useFrame, entirely
   outside React's render/commit cycle — that's the standard R3F pattern
   (see react-three-fiber's own docs/examples) and the reason refs are used
   here instead of useMemo/useState. The experimental React Compiler
   ref-purity rule flags this file-wide because it doesn't yet model
   canvas-imperative code; there's nothing here it would actually catch. */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motionField } from "@/lib/brain/motionField";
import { flowFieldVertexShader, flowFieldFragmentShader } from "@/lib/brain/brainFieldShaders";

// One restrained palette, dark/periwinkle throughout — no whites, no
// bright accents.
const MUTE = new THREE.Color("#565c82");
const DEEP = new THREE.Color("#0b0b10");

// -------------------------------------------------------------------------
// Flow field — a single full-bleed plane of slow fbm noise standing in for
// volumetric density/pressure, not a shape. No blob ever separates out as
// its own bright circle; it's one current the whole page sits inside. A
// short JS-fed trail of recent drag positions brightens and decays behind
// a moving card, like a wake through fluid; ordinary hover gets the same
// treatment as a single, tiny, constant point.
// -------------------------------------------------------------------------
const DRAG_TRAIL = 6;
const DRAG_TRAIL_LIFE = 0.9; // seconds for a wake sample to fully decay

interface FlowUniforms {
  [key: string]: { value: unknown };
  uTime: { value: number };
  uAspect: { value: number };
  uScrollOffset: { value: number };
  uColorA: { value: THREE.Color };
  uColorB: { value: THREE.Color };
  uOpacity: { value: number };
  uPointer: { value: THREE.Vector2 };
  uActivity: { value: number };
  uDragPoints: { value: THREE.Vector2[] };
  uDragAges: { value: number[] };
  uDragCount: { value: number };
}

function FlowField() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();

  const uniformsRef = useRef<FlowUniforms | null>(null);
  if (!uniformsRef.current) {
    uniformsRef.current = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uScrollOffset: { value: 0 },
      uColorA: { value: DEEP.clone() },
      uColorB: { value: MUTE.clone() },
      uOpacity: { value: 0.32 },
      uPointer: { value: new THREE.Vector2(10, 10) },
      uActivity: { value: 0 },
      uDragPoints: { value: Array.from({ length: DRAG_TRAIL }, () => new THREE.Vector2()) },
      uDragAges: { value: new Array(DRAG_TRAIL).fill(1) },
      uDragCount: { value: 0 },
    };
  }
  const uniforms = uniformsRef.current;

  const activityRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const lastSampleRef = useRef(0);

  useFrame(() => {
    const z = -9;
    const vp = viewport.getCurrentViewport(camera, [0, 0, z]);
    if (meshRef.current) {
      meshRef.current.position.z = z;
      meshRef.current.scale.set(vp.width, vp.height, 1);
    }
    uniforms.uAspect.value = vp.width / vp.height;

    const t = motionField.time;
    uniforms.uTime.value = t;
    // Folds the page's own scroll position into the noise sample so the
    // field keeps revealing fresh texture as you move through the wall —
    // it reads as one field spanning the whole page, not a pattern fixed
    // to the viewport.
    uniforms.uScrollOffset.value = motionField.scrollY * 0.00028;
    uniforms.uPointer.value.set(motionField.pointerNX * 0.5, -motionField.pointerNY * 0.5);

    const target = motionField.hoveredAny || motionField.dragActive ? 1 : 0;
    activityRef.current += (target - activityRef.current) * 0.05;
    uniforms.uActivity.value = activityRef.current;

    if (motionField.dragActive && t - lastSampleRef.current > 0.045) {
      lastSampleRef.current = t;
      trailRef.current.push({ x: motionField.pointerNX * 0.5, y: -motionField.pointerNY * 0.5, t });
      if (trailRef.current.length > DRAG_TRAIL) trailRef.current.shift();
    }
    trailRef.current = trailRef.current.filter((p) => t - p.t < DRAG_TRAIL_LIFE);

    const pts = uniforms.uDragPoints.value;
    const ages = uniforms.uDragAges.value;
    trailRef.current.forEach((p, i) => {
      pts[i].set(p.x, p.y);
      ages[i] = Math.min(1, (t - p.t) / DRAG_TRAIL_LIFE);
    });
    uniforms.uDragCount.value = trailRef.current.length;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={flowFieldVertexShader}
        fragmentShader={flowFieldFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function BrainFieldScene() {
  return <FlowField />;
}
