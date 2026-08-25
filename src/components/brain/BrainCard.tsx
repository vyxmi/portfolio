"use client";

import { useMemo, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import type { BrainObject } from "@/lib/brain/types";
import { resolveVessel, resolveExpand, resolveWeight, resolveSizeVariant, cursorFor } from "@/lib/brain/resolvers";
import { hashSeed } from "@/lib/brain/hash";
import { motionField, beginCardDrag, dragCardTo, endCardDrag, setCardHover } from "@/lib/brain/motionField";
import { useCardMotion } from "./useCardMotion";
import { VESSELS } from "./vessels";
import { BrainMetaTop, BrainMetaBottom } from "./BrainMeta";

// Minimum pointer travel, in px, before a press-and-move gesture commits to
// a drag rather than a click — below this it's still just a click in
// progress, so activate() fires normally on release.
const DRAG_THRESHOLD = 5;

// The one place vessel dispatch happens: read the object's resolved
// properties, hand it to the matching vessel component, wrap it in the
// shared metadata/interaction shell. Every vessel is reached through here,
// none are special-cased by UID.
export default function BrainCard({
  o,
  onOpen,
  presentation = "wall",
  motionEnhanced = false,
}: {
  o: BrainObject;
  onOpen?: (o: BrainObject) => void;
  // "home" is the homepage constellation's card: same click/focus behavior
  // as "wall" (see `interactive` below), just without BrainMetaTop/Bottom —
  // the homepage shows objects, not their metadata.
  presentation?: "wall" | "focus" | "home";
  motionEnhanced?: boolean;
}) {
  const vessel = resolveVessel(o);
  const expand = resolveExpand(o);
  const weight = resolveWeight(o);
  const size = resolveSizeVariant(o);
  const cursor = cursorFor(o);
  const Vessel = VESSELS[vessel] ?? VESSELS.__fallback__;
  const cardRef = useRef<HTMLDivElement>(null);
  // "home" gets the exact same motionField-driven drift/drag as "wall" —
  // the homepage constellation is meant to float and drag identically to
  // the /brain wall, just anchored to authored positions instead of a
  // grid (see HomeBrainCanvas, which drives motionField.tickCards itself
  // since the homepage has no BrainScrollProvider/Lenis of its own).
  const dragEnabled = motionEnhanced && (presentation === "wall" || presentation === "home");
  useCardMotion(cardRef, o, dragEnabled);

  function onPointerEnter() {
    motionField.hoveredAny = true;
    if (dragEnabled) setCardHover(o.id, true);
  }
  function onPointerLeave() {
    motionField.hoveredAny = false;
    if (dragEnabled) setCardHover(o.id, false);
  }

  // Press-and-hold-and-move picks the vessel up; released, it springs back
  // to its grid slot (see motionField.tickCards) rather than staying where
  // it was dropped — a tactile gesture, not a reorder. Pointer capture on
  // pointerdown means move/up/cancel keep firing on this element even once
  // the cursor leaves it. Suppresses the click that would otherwise follow
  // a real drag's pointerup.
  const dragRef = useRef({ down: false, dragging: false, startX: 0, startY: 0, pointerId: -1 });
  const suppressClickRef = useRef(false);

  function onVesselPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const d = dragRef.current;
    d.down = true;
    d.dragging = false;
    d.startX = e.clientX;
    d.startY = e.clientY;
    d.pointerId = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onVesselPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d.down || d.pointerId !== e.pointerId) return;
    if (!d.dragging) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < DRAG_THRESHOLD) return;
      d.dragging = true;
      if (cardRef.current) cardRef.current.dataset.dragging = "true";
      beginCardDrag(o.id, d.startX, d.startY);
    }
    dragCardTo(o.id, e.clientX, e.clientY);
  }

  function endVesselDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d.down || d.pointerId !== e.pointerId) return;
    d.down = false;
    if (d.dragging) {
      d.dragging = false;
      suppressClickRef.current = true;
      if (cardRef.current) delete cardRef.current.dataset.dragging;
      endCardDrag(o.id);
    }
  }

  const vesselStyle = useMemo<CSSProperties | undefined>(() => {
    if (vessel === "scrap") {
      const seed = hashSeed(o.id);
      // Base tilt halved from the original ±4deg range.
      return { "--scrap-rot": `${((seed % 9) - 4) * 0.5}deg` } as CSSProperties;
    }
    if (vessel === "sticky-note") {
      const seed = hashSeed(o.id + "-sticky");
      // Base tilt halved from the original ±3deg range.
      return { "--sticky-rot": `${((seed % 7) - 3) * 0.5}deg` } as CSSProperties;
    }
    return undefined;
  }, [vessel, o.id]);

  // read-more used to be its own thing: clamp on the wall, expand in place
  // via a nested button. That nested button sat inside the same vessel the
  // idle-drift/hover motion moves and the ambient WebGL canvas can occlude
  // — both proved able to make a click miss it. Simplest fix: read-more is
  // just focus now. The wall still clamps (see VBody/Checklist's own
  // presentation check), but tapping anywhere on the card opens the full
  // object in the focus modal — the same, already-reliable path "focus"
  // and "gallery" use — instead of a second, fragile inline toggle.
  const interactive = (presentation === "wall" || presentation === "home") && expand !== "none";

  function activate() {
    if (expand === "external") {
      if (o.relatedUrl) window.open(o.relatedUrl, "_blank", "noopener,noreferrer");
      return;
    }
    onOpen?.(o);
  }

  function onVesselClick() {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    activate();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  }

  const clickable = interactive && (expand !== "external" || !!o.relatedUrl);

  return (
    <div
      ref={cardRef}
      className="brain-card"
      data-id={o.id}
      data-type={o.type}
      data-weight={weight}
      data-presentation={presentation}
      // Whether this object has an image at all — the homepage constellation
      // (see home-brain.css) uses it to hide text content on anything with
      // media, showing just the image, while leaving pure-text notes (no
      // media to fall back on) readable as-is.
      data-has-media={o.media && o.media.length > 0 ? "true" : undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {presentation !== "home" && <BrainMetaTop o={o} />}
      <div
        className="vessel"
        data-vessel={vessel}
        data-subtype={o.subtype}
        data-material={o.material}
        data-expand={expand}
        data-size={size}
        style={{ ...vesselStyle, cursor: clickable ? cursor?.css : undefined }}
        data-cursor={clickable ? cursor?.label : undefined}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={clickable ? onVesselClick : undefined}
        onKeyDown={clickable ? onKeyDown : undefined}
        onPointerDown={dragEnabled ? onVesselPointerDown : undefined}
        onPointerMove={dragEnabled ? onVesselPointerMove : undefined}
        onPointerUp={dragEnabled ? endVesselDrag : undefined}
        onPointerCancel={dragEnabled ? endVesselDrag : undefined}
      >
        <Vessel o={o} presentation={presentation} />
      </div>
      {presentation !== "home" && <BrainMetaBottom o={o} />}
    </div>
  );
}
