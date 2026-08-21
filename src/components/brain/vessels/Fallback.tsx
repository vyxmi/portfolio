import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VBody } from "./parts";

// Safe landing spot for a blank/unrecognized Vessel cell — never fails to
// render, just visibly marked as unresolved so it's easy to spot in review.
export default function Fallback({ o }: { o: BrainObject }) {
  const hasMedia = o.media && o.media.length > 0;
  return (
    <>
      {hasMedia && (
        <div className="fallback-frame">
          <MediaThumb o={o} />
        </div>
      )}
      <VBody o={o} />
      <span className="fallback-tag">unresolved vessel</span>
    </>
  );
}
