"use client";

import { useEffect, useRef, useState } from "react";
import type { BrainObject } from "@/lib/brain/types";
import { resolveExpand } from "@/lib/brain/resolvers";
import { resolveMediaSrc } from "@/lib/brain/media";
import { stopBackgroundScroll, startBackgroundScroll } from "@/lib/brain/motionField";
import BrainCard from "./BrainCard";
import { BrainMetaTop, BrainMetaBottom } from "./BrainMeta";

// Expansion reads as attention: the scrim dims/blurs the wall behind it,
// the object comes forward centered and larger. Multi-image galleries get
// a dedicated single-image viewer instead of trying to enlarge a strip;
// everything else reuses BrainCard itself so the vessel logic never forks.
export default function BrainFocus({ o, onClose }: { o: BrainObject | null; onClose: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!o) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // body overflow:hidden alone doesn't stop the wall scrolling behind the
    // scrim — Lenis (see BrainScrollProvider) drives scroll itself, so it
    // needs to be told to stop too, or a wheel/touch gesture over the modal
    // keeps moving the page underneath it.
    stopBackgroundScroll();
    // Focusing the stage (it's the scrollable element — see the
    // data-lenis-prevent + overflow-y:auto below) means arrow/space/page
    // keys scroll it immediately, the same way clicking into any native
    // scroll container would, without adding a visible extra tab stop in
    // normal page flow.
    stageRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      startBackgroundScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [o, onClose]);

  if (!o) return null;
  const expand = resolveExpand(o);
  const isGallery = expand === "gallery" && (o.media?.length ?? 0) > 1;

  return (
    <div className="scrim show" onClick={onClose}>
      {/* data-lenis-prevent excludes this element's own wheel/touch
          gestures from Lenis's global interception (see BrainScrollProvider)
          — Lenis.stop() otherwise calls preventDefault() on every wheel
          event page-wide, which would silently swallow scrolling here too,
          not just on the dimmed wall behind it. */}
      <div
        ref={stageRef}
        className="focus-stage"
        data-id={o.id}
        data-lenis-prevent
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {isGallery ? <FocusGallery o={o} /> : <BrainCard o={o} presentation="focus" />}
      </div>
      <button type="button" className="focus-close show" onClick={onClose}>
        close, esc
      </button>
    </div>
  );
}

function FocusGallery({ o }: { o: BrainObject }) {
  const [index, setIndex] = useState(0);
  const media = o.media ?? [];
  const src = resolveMediaSrc(o.id, o.media, index);
  const hasMultiple = media.length > 1;

  return (
    <div className="focus-gallery-panel">
      <BrainMetaTop o={o} />
      <div className="focus-gallery-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={media[index]?.alt || o.title || ""} />
        {hasMultiple && (
          <>
            <button
              type="button"
              className="focus-gallery-arrow left"
              aria-label="previous"
              onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
            >
              &#8592;
            </button>
            <button
              type="button"
              className="focus-gallery-arrow right"
              aria-label="next"
              onClick={() => setIndex((i) => (i + 1) % media.length)}
            >
              &#8594;
            </button>
            <span className="focus-dots show">
              {media.map((m, i) => (
                <span key={m.id} className={i === index ? "on" : ""} />
              ))}
            </span>
          </>
        )}
      </div>
      <div className="focus-gallery-body">
        {o.title && <div className="v-title">{o.title}</div>}
        {o.content && (
          <div className="v-body">
            <p>{o.content}</p>
          </div>
        )}
        <BrainMetaBottom o={o} />
      </div>
    </div>
  );
}
