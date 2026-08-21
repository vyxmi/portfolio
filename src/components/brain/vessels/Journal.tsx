import type { BrainObject } from "@/lib/brain/types";
import { resolveExpand } from "@/lib/brain/resolvers";
import { VTitle, VBody } from "./parts";

export default function Journal({ o }: { o: BrainObject }) {
  return (
    <>
      <div className="journal-margin" aria-hidden />
      <div className="journal-page">
        <VTitle o={o} />
        <VBody o={o} readMore={resolveExpand(o) === "read-more"} />
      </div>
    </>
  );
}
