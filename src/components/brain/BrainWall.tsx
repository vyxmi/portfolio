"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { BrainObject } from "@/lib/brain/types";
import { resolveWeight, sortDate } from "@/lib/brain/resolvers";
import { refreshCardRects, notifyResizeActivity } from "@/lib/brain/motionField";
import CursorZone from "@/components/CursorZone";
import BrainCard from "./BrainCard";
import BrainFocus from "./BrainFocus";
import BrainBar, { type SortMode } from "./BrainBar";

// .wall uses a fine-grained grid-auto-rows (see brain.css) so a card's real
// height, not its row's tallest neighbor, decides how much vertical space it
// takes — that's what closes the masonry gaps. This measures each card and
// writes the row-span; a ResizeObserver re-measures on image load and on
// responsive column/width changes (both resize the card box), so no
// separate window listener is needed.
function useMasonry(dep: unknown) {
  const wallRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wallEl = wallRef.current;
    if (!wallEl) return;

    // High-water mark per card, keyed by id — see the comment on
    // onResizeObserved below for why this exists: for some vessels our own
    // grid-row-end write measurably feeds back into that same card's next
    // measured height, so a single read can't be trusted as "the" height.
    // Never reserving less than the tallest height ever seen for a card
    // makes overlap structurally impossible regardless of which way that
    // feedback happens to be swinging on a given pass — worst case it
    // wastes some vertical space, which is a vastly better failure mode
    // than a card overlapping its neighbor. onWindowResize clears this so
    // a genuine viewport change still gets clean, non-inflated numbers.
    const maxHeights = new Map<string, number>();

    function recompute() {
      const cs = getComputedStyle(wallEl!);
      const rowH = parseFloat(cs.gridAutoRows) || 1;
      const rowGap = parseFloat(cs.rowGap) || 0;
      const cards = wallEl!.querySelectorAll<HTMLElement>(":scope > .brain-card");
      // Read every card's height first, then write all the spans in a
      // second pass — interleaving read/write per card forces a
      // synchronous layout reflow between each one, which is what turns a
      // window drag-resize (many rapid triggers) into visible jank.
      const heights = Array.from(cards, (card) => card.getBoundingClientRect().height);
      cards.forEach((card, i) => {
        const id = card.dataset.id ?? "";
        const effective = Math.max(heights[i], maxHeights.get(id) ?? 0);
        maxHeights.set(id, effective);
        const span = Math.max(1, Math.ceil((effective + rowGap) / (rowH + rowGap)));
        card.style.gridRowEnd = `span ${span}`;
      });
      // Grid spans changing just reflowed every card below — the motion
      // system's cached rects (see motionField.refreshCardRects) are now
      // stale and need re-measuring, once, here, rather than every card
      // re-reading its own layout on every animation frame.
      refreshCardRects();
    }

    // recompute() must run synchronously off a window resize, in the same
    // task as the resize — NOT deferred to requestAnimationFrame. The
    // browser's own column-width reflow is immediate and native; if our
    // row-span rewrite lands a frame late, the very next paint shows a
    // card's grid area still sized for the *old* width while its content
    // has already rewrapped to the new one, so taller content spills out
    // of its too-short reserved area and visibly overlaps whatever's in
    // the row below. Each call is O(1) forced reflows (batched
    // read-then-write above), so running it on every trigger is cheap.
    function onWindowResize() {
      notifyResizeActivity();
      maxHeights.clear();
      recompute();
    }

    // The ResizeObserver path, by contrast, MUST be debounced — for at
    // least one vessel (the inspiration media-card: justify-self:start
    // grid item + an intrinsically-sized, aspect-ratio-driven <img>) our
    // own grid-row-end write measurably changes that same card's own
    // rendered size on the next layout pass. That re-fires this observer,
    // which recomputes and writes again, forever: a self-sustaining
    // feedback loop, confirmed by instrumenting it — the span and
    // measured height for that card kept alternating between two values
    // indefinitely, many times a second, never settling. That's the
    // "everything is glitching" — it's not tied to resizing at all, it's
    // running continuously regardless of window size. A trailing debounce
    // can't tell a genuine settle from one loop iteration, but a
    // continuously-retriggering loop never gets the necessary quiet
    // window to fire again, so it freezes after its first write instead
    // of oscillating forever — while a real, one-off content change
    // (image finishing load, fonts settling) still gets picked up after a
    // short quiet moment.
    let roTimer: ReturnType<typeof setTimeout> | null = null;
    function onResizeObserved() {
      notifyResizeActivity();
      if (roTimer) clearTimeout(roTimer);
      roTimer = setTimeout(() => {
        roTimer = null;
        recompute();
      }, 120);
    }

    recompute();
    const ro = new ResizeObserver(onResizeObserved);
    wallEl.querySelectorAll(":scope > .brain-card").forEach((card) => ro.observe(card));
    // Some vessels (scrap, sticky-note, media-card…) cap their own width
    // and never resize across a column-count breakpoint, so the card
    // ResizeObserver above can miss it — a plain window resize listener
    // catches the gap recompute those cases would otherwise skip.
    window.addEventListener("resize", onWindowResize);
    // Vessel <img>s (see MediaThumb) have no width/height attributes, so
    // their box is near-zero until the image finishes loading over the
    // network — well after the initial recompute() above ran. `load`
    // doesn't bubble, so this listens in the capture phase instead.
    wallEl.addEventListener("load", recompute, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWindowResize);
      wallEl.removeEventListener("load", recompute, true);
      if (roTimer) clearTimeout(roTimer);
    };
  }, [dep]);

  return { wallRef };
}

export default function BrainWall({ objects }: { objects: BrainObject[] }) {
  const [filterType, setFilterType] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(() => {
    let list = objects;
    if (filterType !== "all") list = list.filter((o) => o.type === filterType);
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sortMode === "oldest") return sortDate(a) - sortDate(b);
      if (sortMode === "featured") return (resolveWeight(b) === "featured" ? 1 : 0) - (resolveWeight(a) === "featured" ? 1 : 0);
      return sortDate(b) - sortDate(a);
    });
    return sorted;
  }, [objects, filterType, sortMode]);

  const openObject = openId ? (objects.find((o) => o.id === openId) ?? null) : null;
  const { wallRef } = useMasonry(visible);

  return (
    <CursorZone>
      <BrainBar
        total={objects.length}
        count={visible.length}
        filterType={filterType}
        onFilterType={setFilterType}
        sortMode={sortMode}
        onSortMode={setSortMode}
      />
      <div ref={wallRef} className="wall" data-focus-active={openObject ? "true" : undefined}>
        {visible.map((o) => (
          <BrainCard key={o.id} o={o} onOpen={(obj) => setOpenId(obj.id)} motionEnhanced />
        ))}
      </div>
      <BrainFocus o={openObject} onClose={() => setOpenId(null)} />
    </CursorZone>
  );
}
