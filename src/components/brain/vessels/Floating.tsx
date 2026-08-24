"use client";

import { useRef } from "react";
import type { BrainObject } from "@/lib/brain/types";
import AsciiFlower from "@/components/AsciiFlower";

// No frame — the object itself is the vessel. tabIndex/onPointerDown exist
// purely so a tap or Tab keypress lands focus here, which is what
// [data-vessel="floating"]:focus-within in brain.css hooks into to reveal
// the surrounding meta-top/meta-bottom (see BrainMeta) on touch devices
// that never fire :hover.
export default function Floating({ o }: { o: BrainObject }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className="floating-flower"
      tabIndex={0}
      role="img"
      aria-label={o.content ?? "ascii flower"}
      onPointerDown={() => wrapRef.current?.focus()}
    >
      <AsciiFlower />
    </div>
  );
}
