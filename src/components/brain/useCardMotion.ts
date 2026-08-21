import { useEffect, type RefObject } from "react";
import type { BrainObject } from "@/lib/brain/types";
import { deriveCardMotionParams } from "@/lib/brain/motionParams";
import { registerCard, unregisterCard, motionField } from "@/lib/brain/motionField";

// Registers a card's DOM node with the shared motion ticker (see
// motionField.tickCards) for the prototype subset only. `enhanced` is
// false for the rest of the archive, so this is a no-op there — the wall
// stays exactly as it renders today until the motion language is proven.
export function useCardMotion(ref: RefObject<HTMLDivElement | null>, o: BrainObject, enhanced: boolean) {
  useEffect(() => {
    if (!enhanced || motionField.reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    el.dataset.motion = "true";
    registerCard(o.id, el, deriveCardMotionParams(o));
    return () => {
      unregisterCard(o.id);
    };
  }, [ref, o, enhanced]);
}
