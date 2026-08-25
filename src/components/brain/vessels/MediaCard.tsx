import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle, RatingRow, VBody } from "./parts";

// Reference/inspiration media (someone else's work, kept for its own sake
// rather than as "my note") reads as a gallery print, not a catalog row:
// the image carries the card, and its wall label — title, artist/credit —
// surfaces only on hover/focus instead of sitting on the card at rest. See
// brain.css's [data-subtype="inspiration"] rules for the reveal itself.
function InspirationMedia({ o }: { o: BrainObject }) {
  return (
    <div className="inspo-frame">
      {o.media && o.media.length > 0 && <MediaThumb o={o} className="inspo-image" fit="contain" />}
      <div className="inspo-label">
        {o.title && <div className="inspo-title">{o.title}</div>}
        {o.content && <div className="inspo-credit">{o.content}</div>}
      </div>
    </div>
  );
}

export default function MediaCard({ o }: { o: BrainObject }) {
  if (o.subtype === "inspiration") return <InspirationMedia o={o} />;
  return (
    <div className="media-card">
      <div className="media-top">
        {o.media && o.media.length > 0 && <MediaThumb o={o} className="media-cover" />}
        <div className="media-heading">
          <VTitle o={o} />
          <RatingRow rating={o.rating} />
        </div>
      </div>
      {o.content && (
        <div className="media-text">
          <div className="media-note-label">my note</div>
          <VBody o={o} />
        </div>
      )}
    </div>
  );
}
