import type { BrainObject } from "@/lib/brain/types";
import { dateLabel, resolveVessel } from "@/lib/brain/resolvers";

// Metadata belongs to the Brain system, not the vessel — it always renders
// outside the container, same shape whether the card is resting in the
// wall or expanded in focus.
export function BrainMetaTop({ o }: { o: BrainObject }) {
  // "object" is a catch-all subtype (every made-thing that isn't more
  // specifically a project/collection/etc.) not worth a taxonomy token of
  // its own — same reasoning as the list/lists drop below, just
  // unconditional rather than paired to a specific category.
  const dropSubtype = (o.subtype === "list" && o.category === "lists") || o.subtype === "object";
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
  // Email dates render inside the email header instead (see Email.tsx) —
  // showing them here too would be a duplicate, not a second data point.
  if (resolveVessel(o) === "email") return null;
  const date = dateLabel(o);
  if (!date) return null;
  return (
    <div className="meta-row meta-bottom">
      <span className="meta-date">{date}</span>
    </div>
  );
}
