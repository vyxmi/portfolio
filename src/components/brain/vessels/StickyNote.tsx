import type { BrainObject } from "@/lib/brain/types";
import { VTitle, VBody } from "./parts";

export default function StickyNote({ o }: { o: BrainObject }) {
  return (
    <>
      <VTitle o={o} />
      <VBody o={o} />
    </>
  );
}
