import type { Metadata } from "next";
// brain.css is imported once, globally, in the root layout — the homepage
// constellation reuses the same vessel/card/focus styles.
import { brainObjects } from "@/lib/brain/objects";
import { isPrivate } from "@/lib/brain/resolvers";
import BrainWall from "@/components/brain/BrainWall";
import BrainField from "@/components/brain/BrainField";
import BrainScrollProvider from "@/components/brain/BrainScrollProvider";

export const metadata: Metadata = { title: "Brain, Vyomi Seth" };

// Filtered here, server-side, before `objects` ever crosses into the client
// component — BrainWall's own isPrivate filter only controls what it
// renders, but a prop handed to a client component still gets serialized
// into the page's RSC payload wholesale. Without this, a private object's
// full record (content, media filenames) would sit in plain HTML/view-source
// even though no card for it appears on screen.
const publicBrainObjects = brainObjects.filter((o) => !isPrivate(o));

export default function BrainPage() {
  return (
    <div className="flex min-h-screen flex-col md:pl-[var(--rail-w)]" style={{ background: "var(--void)", color: "var(--void-ink)" }}>
      <BrainScrollProvider />
      <BrainField />
      <main className="relative z-[1] flex-1 px-6 pb-16 pt-14 md:px-16 md:pt-0">
        <BrainWall
          objects={publicBrainObjects}
          intro={
            <div className="mb-6 pt-6 md:pt-8">
              <div className="eyebrow mb-2">inside my brain</div>
              <p className="max-w-md text-[13.5px] leading-relaxed" style={{ color: "var(--void-soft)" }}>
                journal snippets, miscellaneous creations, notes app lists, memories, half-finished projects,
                attempts at graphic design from when i was ten
              </p>
            </div>
          }
        />
      </main>
    </div>
  );
}
