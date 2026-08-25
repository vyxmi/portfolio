"use client";

const TYPES = ["all", "thought", "memory", "thing"] as const;
const SORTS = [
  { value: "newest", label: "newest" },
  { value: "oldest", label: "oldest" },
  { value: "featured", label: "featured" },
] as const;

export type SortMode = (typeof SORTS)[number]["value"];

export default function BrainBar({
  total,
  count,
  filterType,
  onFilterType,
  sortMode,
  onSortMode,
}: {
  total: number;
  count: number;
  filterType: string;
  onFilterType: (v: string) => void;
  sortMode: SortMode;
  onSortMode: (v: SortMode) => void;
}) {
  return (
    <div className="brain-bar">
      <div className="brain-bar-row">
        <span className="brain-bar-count">
          {count} {count === 1 ? "object" : "objects"}
          {count !== total ? ` of ${total}` : ""}
        </span>
        <div className="brain-bar-pills" role="group" aria-label="filter by type">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`brain-pill${filterType === t ? " active" : ""}`}
              onClick={() => onFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="brain-bar-sort" role="group" aria-label="sort by">
          {SORTS.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`brain-pill${sortMode === s.value ? " active" : ""}`}
              onClick={() => onSortMode(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
