"use client";

import DigitalBloom from "@/components/three/DigitalBloom";

export default function HomeField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grain" />
      {/* No bounding box — the canvas is the full field, so ambient
          particles and the dispersed flower scatter can genuinely span the
          whole viewport instead of a fixed square patch of it. */}
      <DigitalBloom className="absolute inset-0" motionPreset="alive" />
      {/* Same flower, same spot, on mobile — just dimmed so the hero text
          (which has nowhere else to sit on a narrow screen) stays readable
          over it, instead of shrinking or moving the flower out of the way. */}
      <div className="absolute inset-0 pointer-events-none sm:hidden" style={{ background: "rgba(10, 10, 13, 0.72)" }} />
    </div>
  );
}
