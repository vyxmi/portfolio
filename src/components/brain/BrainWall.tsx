"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { BrainObject } from "@/lib/brain/types";
import { resolveWeight, sortDate } from "@/lib/brain/resolvers";
import { computeColumnGaps, blobsFromGaps, type BlobSpec } from "@/lib/brain/gapFillers";
import CursorZone from "@/components/CursorZone";
import BrainCard from "./BrainCard";
import BrainFocus from "./BrainFocus";
import BrainBar, { type SortMode } from "./BrainBar";
import GapBlobs from "./GapBlobs";

// .wall uses a fine-grained grid-auto-rows (see brain.css) so a card's real
// height, not its row's tallest neighbor, decides how much vertical space it
// takes — that's what closes the masonry gaps. This measures each card and
// writes the row-span; a ResizeObserver re-measures on image load and on
// responsive column/width changes (both resize the card box), so no
// separate window listener is needed.
function useMasonry(dep: unknown) {
  const wallRef = useRef<HTMLDivElement>(null);
  const [blobs, setBlobs] = useState<BlobSpec[]>([]);

  useLayoutEffect(() => {
    const wallEl = wallRef.current;
    if (!wallEl) return;

    function recompute() {
      const cs = getComputedStyle(wallEl!);
      const rowH = parseFloat(cs.gridAutoRows) || 1;
      const rowGap = parseFloat(cs.rowGap) || 0;
      wallEl!.querySelectorAll<HTMLElement>(":scope > .brain-card").forEach((card) => {
        const h = card.getBoundingClientRect().height;
        const span = Math.max(1, Math.ceil((h + rowGap) / (rowH + rowGap)));
        card.style.gridRowEnd = `span ${span}`;
      });
      // Reads final post-span layout (the writes above already forced it) —
      // purely measurement, so this can never feed back into card spacing.
      setBlobs(blobsFromGaps(computeColumnGaps(wallEl!)));
    }

    recompute();
    const ro = new ResizeObserver(recompute);
    wallEl.querySelectorAll(":scope > .brain-card").forEach((card) => ro.observe(card));
    // Some vessels (scrap, sticky-note, media-card…) cap their own width
    // and never resize across a column-count breakpoint, so the card
    // ResizeObserver above can miss it — a plain window resize listener
    // catches the gap recompute those cases would otherwise skip.
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [dep]);

  return { wallRef, blobs };
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
  const { wallRef, blobs } = useMasonry(visible);

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
        <GapBlobs blobs={blobs} />
        {visible.map((o) => (
          <BrainCard key={o.id} o={o} onOpen={(obj) => setOpenId(obj.id)} motionEnhanced />
        ))}
      </div>
      <BrainFocus o={openObject} onClose={() => setOpenId(null)} />
    </CursorZone>
  );
}
