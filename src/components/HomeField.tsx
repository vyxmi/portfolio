"use client";

import DigitalBloom from "@/components/three/DigitalBloom";

export default function HomeField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grain" />
      {/* No bounding box — the canvas is the full field, so ambient
          particles and the dispersed flower scatter can genuinely span the
          whole viewport instead of a fixed square patch of it. */}
      {/* Colors darkened 30% off DigitalBloom's own defaults (#f3f3f6 /
          #8496ea) — this is the only place DigitalBloom is used, so the
          override lives here rather than changing its defaults. */}
      <DigitalBloom
        className="absolute inset-0"
        position={{ x: 0.73, y: 0 }}
        colorPrimary="#aaaaac"
        colorAccent="#5c69a4"
        ambientColor="#8b91ad"
        backgroundColor="#fbfcff"
      />
      {/* Same flower, same spot, on mobile — just dimmed so the hero text
          (which has nowhere else to sit on a narrow screen) stays readable
          over it, instead of shrinking or moving the flower out of the way. */}
      <div className="absolute inset-0 pointer-events-none sm:hidden" style={{ background: "rgba(251, 252, 255, 0.66)" }} />
    </div>
  );
}
