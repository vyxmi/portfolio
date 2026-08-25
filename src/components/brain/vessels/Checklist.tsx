import type { BrainObject } from "@/lib/brain/types";
import { parseChecklist, resolveExpand } from "@/lib/brain/resolvers";
import { VTitle } from "./parts";

// A long checklist (many sections, dozens of items — e.g. "sewing/altering")
// shouldn't dump its whole length into the wall just because the CMS marked
// it expandBehavior: read-more. Collapsed shows the first few lines and a
// "read more" label on the wall; clicking the card opens the full checklist
// in focus (see BrainCard's `interactive` — read-more is just focus with a
// clamped wall preview), where every line renders regardless of count.
const COLLAPSED_COUNT = 6;

export default function Checklist({ o, presentation = "wall" }: { o: BrainObject; presentation?: "wall" | "focus" | "home" }) {
  const lines = parseChecklist(o.content);
  const readMore = presentation !== "focus" && resolveExpand(o) === "read-more" && lines.length > COLLAPSED_COUNT;
  const visible = readMore ? lines.slice(0, COLLAPSED_COUNT) : lines;

  return (
    <>
      <VTitle o={o} />
      {visible.length > 0 && (
        <ul className="v-checklist">
          {visible.map((line, i) =>
            line.kind === "header" ? (
              <li key={i} className="checklist-header">
                {line.text}
              </li>
            ) : (
              <li key={i} className={`checklist-item${line.done ? " done" : ""}`}>
                <span className="chk" aria-hidden />
                <span>{line.text}</span>
              </li>
            )
          )}
        </ul>
      )}
      {readMore && <span className="readmore-btn">read more</span>}
    </>
  );
}
