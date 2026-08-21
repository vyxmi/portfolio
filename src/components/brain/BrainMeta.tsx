import type { BrainObject } from "@/lib/brain/types";
import { dateLabel } from "@/lib/brain/resolvers";

// Metadata belongs to the Brain system, not the vessel — it always renders
// outside the container, same shape whether the card is resting in the
// wall or expanded in focus.
export function BrainMetaTop({ o }: { o: BrainObject }) {
  const dropSubtype = o.subtype === "list" && o.category === "lists";
  const segs = [o.type, dropSubtype ? null : o.subtype, o.category].filter(Boolean) as string[];
  return (
    <div className="meta-row meta-top">
      {segs.map((s, i) => (
        <span key={i} className="meta-seg-wrap">
          {i > 0 && <span className="meta-dot">&middot;</span>}
          <span className="meta-seg">{s}</span>
        </span>
      ))}
      {!o.vessel && <span className="meta-auto">unresolved vessel</span>}
    </div>
  );
}

export function BrainMetaBottom({ o }: { o: BrainObject }) {
  const date = dateLabel(o);
  if (!date) return null;
  return (
    <div className="meta-row meta-bottom">
      <span className="meta-date">{date}</span>
    </div>
  );
}
