import type { BrainObject } from "@/lib/brain/types";
import { resolveExpand } from "@/lib/brain/resolvers";
import { VTitle, VBody } from "./parts";

export default function PlainNote({ o }: { o: BrainObject }) {
  return (
    <>
      <VTitle o={o} />
      <VBody o={o} readMore={resolveExpand(o) === "read-more"} />
    </>
  );
}
