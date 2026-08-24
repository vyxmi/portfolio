"use client";

import { useEffect, useState } from "react";
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
  useEffect(() => {
    if (!o) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // body overflow:hidden alone doesn't stop the wall scrolling behind the
    // scrim — Lenis (see BrainScrollProvider) drives scroll itself, so it
    // needs to be told to stop too, or a wheel/touch gesture over the modal
    // keeps moving the page underneath it.
    stopBackgroundScroll();
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
      <div className="focus-stage" onClick={(e) => e.stopPropagation()}>
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

  return (
    <div className="brain-card" data-presentation="focus">
      <BrainMetaTop o={o} />
      <div className="vessel focus-gallery-vessel" data-vessel="gallery-view">
        <div className="focus-gallery-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={media[index]?.alt || o.title || ""} />
        </div>
        {o.title && <div className="v-title">{o.title}</div>}
        {o.content && (
          <div className="v-body">
            <p>{o.content}</p>
          </div>
        )}
        <div className="focus-gallery-controls">
          <button
            type="button"
            aria-label="previous"
            onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
          >
            &#8592;
          </button>
          <span className="focus-dots show">
            {media.map((m, i) => (
              <span key={m.id} className={i === index ? "on" : ""} />
            ))}
          </span>
          <button type="button" aria-label="next" onClick={() => setIndex((i) => (i + 1) % media.length)}>
            &#8594;
          </button>
        </div>
      </div>
      <BrainMetaBottom o={o} />
    </div>
  );
}
