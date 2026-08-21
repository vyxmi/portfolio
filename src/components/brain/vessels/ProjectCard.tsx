import type { BrainObject } from "@/lib/brain/types";
import { resolveExpand } from "@/lib/brain/resolvers";
import { MediaThumb, VTitle, VBody } from "./parts";

export default function ProjectCard({ o }: { o: BrainObject }) {
  return (
    <>
      <div className="proj-eyebrow">{o.subtype || o.category || "project"}</div>
      <VTitle o={o} />
      <VBody o={o} readMore={resolveExpand(o) === "read-more"} />
      {o.media && o.media.length > 0 && (
        <div className="proj-media">
          {o.media.map((m, i) => (
            <MediaThumb key={m.id} o={o} index={i} />
          ))}
        </div>
      )}
      {o.relatedUrl && (
        <div className="proj-cta">
          view more <span className="arrow">&#8594;</span>
        </div>
      )}
    </>
  );
}
