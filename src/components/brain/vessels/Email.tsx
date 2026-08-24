import type { BrainObject } from "@/lib/brain/types";
import { resolveExpand } from "@/lib/brain/resolvers";
import { MediaThumb, VBody } from "./parts";

export default function Email({ o, presentation = "wall" }: { o: BrainObject; presentation?: "wall" | "focus" }) {
  return (
    <>
      <div className="email-bar" aria-hidden />
      {o.title && (
        <div className="email-head">
          <div className="v-title">{o.title}</div>
        </div>
      )}
      {o.media && o.media.length > 0 && (
        <div className="email-attachment">
          <MediaThumb o={o} fit="contain" />
        </div>
      )}
      <VBody o={o} readMore={presentation === "wall" && resolveExpand(o) === "read-more"} />
    </>
  );
}
