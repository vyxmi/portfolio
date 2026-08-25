import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle, RatingRow, VBody } from "./parts";

export default function ReviewCard({ o }: { o: BrainObject }) {
  return (
    <div className="review-card">
      <div className="review-top">
        {/* contain, not the default cover: every review-card object today is
            a movie poster, and cropping a poster loses real information a
            center-crop can't safely guess at. */}
        {o.media && o.media.length > 0 && <MediaThumb o={o} className="review-cover" fit="contain" />}
        <div className="review-heading">
          <VTitle o={o} />
          <RatingRow rating={o.rating} />
        </div>
      </div>
      <div className="review-text">
        <VBody o={o} />
      </div>
    </div>
  );
}
