import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle } from "./parts";

// Multiple media on a display-case object means multiple related items
// shown together (e.g. a pendant + the hairclips made alongside it) — every
// one gets its own spot on the shelf, not just the first.
export default function DisplayCase({ o }: { o: BrainObject }) {
  const media = o.media ?? [];
  return (
    <>
      <div className="case-items">
        {media.map((m, i) => (
          <div className="case-stage" key={m.id}>
            <MediaThumb o={o} index={i} fit="contain" />
          </div>
        ))}
      </div>
      <VTitle o={o} className="case-title" />
      {o.content && <div className="case-caption">{o.content}</div>}
    </>
  );
}
