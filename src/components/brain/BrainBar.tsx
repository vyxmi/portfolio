"use client";

import { BRAIN_DOMAINS, type BrainDomain } from "@/lib/brain/domains";

export type BrainView = "grid" | "float";

export default function BrainBar({
  total,
  count,
  domain,
  onDomain,
  view,
  onView,
}: {
  total: number;
  count: number;
  domain: BrainDomain;
  onDomain: (v: BrainDomain) => void;
  view: BrainView;
  onView: (v: BrainView) => void;
}) {
  return (
    <div className="brain-bar">
      <div className="brain-bar-row">
        <span className="brain-bar-count">
          {count} {count === 1 ? "object" : "objects"}
          {count !== total ? ` of ${total}` : ""}
        </span>
        <div className="brain-bar-pills" role="group" aria-label="filter by domain">
          {BRAIN_DOMAINS.map((t) => (
            <button
              key={t}
              type="button"
              className={`brain-pill${domain === t ? " active" : ""}`}
              onClick={() => onDomain(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="brain-bar-sort" role="group" aria-label="views">
          <span className="brain-bar-label">views</span>
          {(["grid", "float"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={`brain-pill${view === item ? " active" : ""}`}
              onClick={() => onView(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
