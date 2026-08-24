"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Z_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

// The one thing every particle group reads from, computed exactly once
// per frame regardless of how many groups exist — raycasting the pointer
// plane per-group would just be redundant work repeated for flower +
// every ambient plane.
export interface ParticleRuntimeState {
  time: number;
  pointer: THREE.Vector2;
  wind: THREE.Vector2;
  pointerActive: number;
  viewportExtent: THREE.Vector2;
}

export function createParticleRuntime(): ParticleRuntimeState {
  return {
    time: 0,
    pointer: new THREE.Vector2(0, 0),
    wind: new THREE.Vector2(0, 0),
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
  const prevWorldPointer = useRef(new THREE.Vector2(0, 0));
  const hasPrevWorldPointer = useRef(false);

  useFrame((state) => {
    const rt = runtimeRef.current;
    rt.time = state.clock.getElapsedTime();
    rt.viewportExtent.set(state.viewport.width / 2, state.viewport.height / 2);

    if (!interactive) {
      rt.pointerActive = 0;
      rt.wind.set(0, 0);
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

      if (!hasPrevWorldPointer.current) {
        prevWorldPointer.current.set(hit.x, hit.y);
        hasPrevWorldPointer.current = true;
      }
      const dx = hit.x - prevWorldPointer.current.x;
      const dy = hit.y - prevWorldPointer.current.y;
      prevWorldPointer.current.set(hit.x, hit.y);

      // Clamp the raw per-frame step so a fast flick can't spike into an
      // oversized gust — speed still comes through, just capped.
      const rawSpeed = Math.hypot(dx, dy);
      const maxStep = 0.05;
      const stepScale = rawSpeed > maxStep ? maxStep / rawSpeed : 1;
      rt.wind.x += (dx * stepScale - rt.wind.x) * 0.18;
      rt.wind.y += (dy * stepScale - rt.wind.y) * 0.18;

      rt.pointerActive += (1 - rt.pointerActive) * 0.12;
    } else {
      hasPrevWorldPointer.current = false;
      rt.wind.x += (0 - rt.wind.x) * 0.06;
      rt.wind.y += (0 - rt.wind.y) * 0.06;
      rt.pointerActive += (0 - rt.pointerActive) * 0.06;
    }
  });

  return null;
}
