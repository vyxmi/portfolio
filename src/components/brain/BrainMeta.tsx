import type { BrainObject } from "@/lib/brain/types";
import { dateLabel, resolveVessel } from "@/lib/brain/resolvers";
import { domainFor } from "@/lib/brain/domains";

// Metadata belongs to the Brain system, not the vessel — it always renders
// outside the container, same shape whether the card is resting in the
// wall or expanded in focus.
export function BrainMetaTop({ o, focus = false }: { o: BrainObject; focus?: boolean }) {
  // "object" is a catch-all subtype (every made-thing that isn't more
  // specifically a project/collection/etc.) not worth a taxonomy token of
  // its own — same reasoning as the list/lists drop below, just
  // unconditional rather than paired to a specific category.
  const dropSubtype = (o.subtype === "list" && o.category === "lists") || o.subtype === "object";
  const oldLast = o.category || (dropSubtype ? null : o.subtype);
  const year = (o.originalDate || o.displayDateOverride || o.addedToCms || "").match(/\d{4}/)?.[0];
  const segs = focus ? [domainFor(o), oldLast, year].filter(Boolean) as string[] : [domainFor(o)];
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
