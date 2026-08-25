import type { BrainObject } from "@/lib/brain/types";
import { resolveExpand } from "@/lib/brain/resolvers";
import { VTitle, VBody, VEntries } from "./parts";

export default function PlainNote({ o, presentation = "wall" }: { o: BrainObject; presentation?: "wall" | "focus" | "home" }) {
  return (
    <>
      <VTitle o={o} />
      {o.contentEntries ? (
        <VEntries entries={o.contentEntries} />
      ) : (
        <VBody o={o} readMore={presentation !== "focus" && resolveExpand(o) === "read-more"} />
      )}
    </>
  );
}
