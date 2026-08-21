"use client";

import { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import AmbientBackground from "./AmbientBackground";
import BrainFieldScene from "./BrainFieldScene";

// Reduced motion, and low-power/small-touch devices, get the existing
// AmbientBackground (cheap CSS/SVG) instead of the WebGL field — same
// visual slot, same z-index, no WebGL cost where it isn't warranted.
// This is exactly what useSyncExternalStore is for: a value that can only
// be known on the client (matchMedia/navigator), read without triggering
// a setState-in-effect render cascade, and reconciled safely against the
// server snapshot during hydration.
function subscribeCapability(callback: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");
  reduced.addEventListener("change", callback);
  coarse.addEventListener("change", callback);
  window.addEventListener("resize", callback);
  return () => {
    reduced.removeEventListener("change", callback);
    coarse.removeEventListener("change", callback);
    window.removeEventListener("resize", callback);
  };
}

function getCapabilitySnapshot() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const smallTouch = window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 820;
  if (smallTouch) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;
  return true;
}

function getServerCapabilitySnapshot() {
  return false;
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function getVisibilitySnapshot() {
  return document.hidden;
}

function getServerVisibilitySnapshot() {
  return false;
}

export default function BrainField() {
  const webglEnabled = useSyncExternalStore(subscribeCapability, getCapabilitySnapshot, getServerCapabilitySnapshot);
  const hidden = useSyncExternalStore(subscribeVisibility, getVisibilitySnapshot, getServerVisibilitySnapshot);

  if (!webglEnabled) return <AmbientBackground />;

  return (
    <div className="brain-ambient" aria-hidden="true">
      <Canvas
        frameloop={hidden ? "never" : "always"}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 20 }}
        onCreated={({ gl }) => gl.setClearColor("#0a0a0d", 1)}
      >
        <BrainFieldScene />
      </Canvas>
    </div>
  );
}
