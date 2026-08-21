import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle } from "./parts";

// No real cell data lives in the CMS for these yet — a grid-motif frame
// carries the "spreadsheet" read honestly instead of fabricating rows.
export default function Spreadsheet({ o }: { o: BrainObject }) {
  return (
    <>
      {o.media && o.media.length > 0 && (
        <div className="sheet-frame">
          <MediaThumb o={o} />
        </div>
      )}
      <VTitle o={o} />
      {o.content && <div className="sheet-caption">{o.content}</div>}
    </>
  );
}
