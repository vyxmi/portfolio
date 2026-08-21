"use client";

import { useState } from "react";
import type { BrainObject } from "@/lib/brain/types";
import { parseChecklist, resolveExpand } from "@/lib/brain/resolvers";
import { VTitle } from "./parts";

// A long checklist (many sections, dozens of items — e.g. "sewing/altering")
// shouldn't dump its whole length into the wall just because the CMS marked
// it expandBehavior: read-more; this vessel never actually honored that
// until now. Collapsed shows the first few lines and a real read-more
// toggle, same as VBody's prose does, but sliced by list item since a
// checklist doesn't clamp like a paragraph.
const COLLAPSED_COUNT = 6;

export default function Checklist({ o }: { o: BrainObject }) {
  const [expanded, setExpanded] = useState(false);
  const lines = parseChecklist(o.content);
  const readMore = resolveExpand(o) === "read-more" && lines.length > COLLAPSED_COUNT;
  const visible = readMore && !expanded ? lines.slice(0, COLLAPSED_COUNT) : lines;

  return (
    <>
      <VTitle o={o} />
      {visible.length > 0 && (
        <ul className="v-checklist">
          {visible.map((line, i) =>
            line.kind === "header" ? (
              <li key={i} className="checklist-header">
                {line.text}
              </li>
            ) : (
              <li key={i} className={`checklist-item${line.done ? " done" : ""}`}>
                <span className="chk" aria-hidden />
                <span>{line.text}</span>
              </li>
            )
          )}
        </ul>
      )}
      {readMore && (
        <button
          type="button"
          className="readmore-btn"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
        >
          {expanded ? "read less" : "read more"}
        </button>
      )}
    </>
  );
}
