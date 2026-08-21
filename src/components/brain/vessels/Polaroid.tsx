import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb } from "./parts";

export default function Polaroid({ o }: { o: BrainObject }) {
  return (
    <>
      <div className="polaroid-photo">
        <MediaThumb o={o} />
      </div>
      {o.content && <div className="polaroid-cap">{o.content}</div>}
    </>
  );
}
