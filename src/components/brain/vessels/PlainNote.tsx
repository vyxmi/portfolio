import type { BrainObject } from "@/lib/brain/types";
import { resolveExpand } from "@/lib/brain/resolvers";
import { VTitle, VBody, VEntries } from "./parts";

export default function PlainNote({ o, presentation = "wall" }: { o: BrainObject; presentation?: "wall" | "focus" }) {
  return (
    <>
      <VTitle o={o} />
      {o.contentEntries ? (
        <VEntries entries={o.contentEntries} />
      ) : (
        <VBody o={o} readMore={presentation === "wall" && resolveExpand(o) === "read-more"} />
      )}
    </>
  );
}
