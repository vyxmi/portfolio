import type { BrainObject } from "@/lib/brain/types";
import { resolveExpand } from "@/lib/brain/resolvers";
import { VTitle, VBody } from "./parts";

// Render Override apple-note-tiny asks for the same note grammar at a
// more compact footprint, not a different presentation.
export default function NotesApp({ o, presentation = "wall" }: { o: BrainObject; presentation?: "wall" | "focus" | "home" }) {
  const tiny = o.renderOverride === "apple-note-tiny";
  return (
    <div className={tiny ? "notes-tiny" : undefined}>
      <div className="notes-head">
        <span className="notes-dot" aria-hidden />
        <VTitle o={o} />
      </div>
      <VBody o={o} readMore={presentation !== "focus" && resolveExpand(o) === "read-more"} />
    </div>
  );
}
