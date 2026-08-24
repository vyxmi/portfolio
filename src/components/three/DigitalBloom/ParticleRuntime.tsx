"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Z_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

// The one thing every particle group reads from, computed exactly once
// per frame regardless of how many groups exist — raycasting the pointer
// plane per-group would just be redundant work repeated for flower +
// every ambient plane. Deliberately has no notion of cursor velocity/wind:
// hover is purely proximity-gated (see shaders.ts), so the only thing
// downstream code ever needs is where the cursor currently is and whether
// it's meaningfully present.
export interface ParticleRuntimeState {
  time: number;
  pointer: THREE.Vector2;
  pointerActive: number;
  viewportExtent: THREE.Vector2;
}

export function createParticleRuntime(): ParticleRuntimeState {
  return {
    time: 0,
    pointer: new THREE.Vector2(0, 0),
    pointerActive: 0,
    viewportExtent: new THREE.Vector2(1, 1),
  };
}

// Renders nothing — just the shared useFrame driver. Split out from
// DigitalBloom's own tree so it can sit first and guarantee the runtime is
// current before any group reads it later in the same frame (r3f runs
// useFrame callbacks in mount order).
export default function ParticleRuntime({
  runtimeRef,
  pointerEngagedRef,
  interactive,
}: {
  runtimeRef: RefObject<ParticleRuntimeState>;
  /**
   * r3f seeds state.pointer at NDC (0,0) — dead center — before any real
   * pointer event has ever fired, which would otherwise read as a
   * legitimate hit sitting right on the flower's own center. Gates the
   * raycast on having seen a real pointermove/leave DOM event (see
   * DigitalBloom.tsx), not just r3f's default.
   */
  pointerEngagedRef: RefObject<boolean>;
  interactive: boolean;
}) {
  const raycastTarget = useRef(new THREE.Vector3());

  useFrame((state) => {
    const rt = runtimeRef.current;
    rt.time = state.clock.getElapsedTime();
    rt.viewportExtent.set(state.viewport.width / 2, state.viewport.height / 2);

    if (!interactive) {
      rt.pointerActive = 0;
      return;
    }

    let hit: THREE.Vector3 | null = null;
    if (pointerEngagedRef.current) {
      state.raycaster.setFromCamera(state.pointer, state.camera);
      hit = state.raycaster.ray.intersectPlane(Z_PLANE, raycastTarget.current);
    }

    if (hit) {
      rt.pointer.x += (hit.x - rt.pointer.x) * 0.14;
      rt.pointer.y += (hit.y - rt.pointer.y) * 0.14;
      rt.pointerActive += (1 - rt.pointerActive) * 0.12;
    } else {
      rt.pointerActive += (0 - rt.pointerActive) * 0.06;
    }
  });

  return null;
}
