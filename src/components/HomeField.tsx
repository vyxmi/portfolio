"use client";

import DigitalBloom from "@/components/three/DigitalBloom";

export default function HomeField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grain" />
      {/* No bounding box — the canvas is the full field, so ambient
          particles and the dispersed flower scatter can genuinely span the
          whole viewport instead of a fixed square patch of it. Rotated as
          one unit (ambient included, not just the flower silhouette —
          DigitalBloom has no separate per-shape rotation) and pushed
          toward the bottom-left corner, clear of both the header text and
          the object constellation. Estimated by eye against the reference
          layout, not measured — nudge position/rotation once it's visible. */}
      <div className="absolute inset-0" style={{ transform: "rotate(-9deg)", transformOrigin: "30% 85%" }}>
        <DigitalBloom className="absolute inset-0" position={{ x: -1.15, y: -1.05 }} />
      </div>
      {/* Same flower, same spot, on mobile — just dimmed so the hero text
          (which has nowhere else to sit on a narrow screen) stays readable
          over it, instead of shrinking or moving the flower out of the way.
          Outside the rotated wrapper — this is a flat full-screen tint, it
          shouldn't rotate with the flower. */}
      <div className="absolute inset-0 pointer-events-none sm:hidden" style={{ background: "rgba(10, 10, 13, 0.72)" }} />
    </div>
  );
}
