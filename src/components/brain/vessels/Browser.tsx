import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb } from "./parts";

export default function Browser({ o }: { o: BrainObject }) {
  return (
    <>
      <div className="browser-bar" aria-hidden />
      {o.media && o.media.length > 0 && <MediaThumb o={o} className="browser-shot" />}
      {o.content && <div className="browser-caption">{o.content}</div>}
    </>
  );
}
