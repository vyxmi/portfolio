import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle, VBody } from "./parts";

export default function Scrap({ o }: { o: BrainObject }) {
  return (
    <>
      {o.media && o.media.length > 0 && (
        <div className="scrap-photo">
          <MediaThumb o={o} />
        </div>
      )}
      <VTitle o={o} />
      <VBody o={o} />
    </>
  );
}
