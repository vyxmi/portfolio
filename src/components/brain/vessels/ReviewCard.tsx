import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle, RatingRow, VBody } from "./parts";

export default function ReviewCard({ o }: { o: BrainObject }) {
  return (
    <div className="review-row">
      {o.media && o.media.length > 0 && <MediaThumb o={o} className="review-cover" />}
      <div className="review-info">
        <VTitle o={o} />
        <RatingRow rating={o.rating} />
        <div className="review-text">
          <VBody o={o} />
        </div>
      </div>
    </div>
  );
}
