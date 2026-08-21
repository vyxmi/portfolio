import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb } from "./parts";

export default function Scan({ o }: { o: BrainObject }) {
  return (
    <div className="scan-sheet">
      <MediaThumb o={o} paper />
      {o.content && <div className="scan-caption">{o.content}</div>}
    </div>
  );
}
