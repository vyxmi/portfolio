import type { Metadata } from "next";
import "./brain.css";
import { brainObjects } from "@/lib/brain/objects";
import BrainWall from "@/components/brain/BrainWall";
import BrainField from "@/components/brain/BrainField";
import BrainScrollProvider from "@/components/brain/BrainScrollProvider";

export const metadata: Metadata = { title: "Brain, Vyomi Seth" };

export default function BrainPage() {
  return (
    <div className="flex min-h-screen flex-col md:pl-[var(--rail-w)]" style={{ background: "var(--void)", color: "var(--void-ink)" }}>
      <BrainScrollProvider />
      <BrainField />
      <main className="relative z-[1] flex-1 px-6 pb-16 pt-24 md:px-16 md:pt-28">
        <div className="mb-6">
          <div className="eyebrow mb-2">brain</div>
          <p className="max-w-md text-[13.5px] leading-relaxed" style={{ color: "var(--void-soft)" }}>
            thoughts, memories, things, and work, held by one system. metadata stays outside the container, the
            container fits the object.
          </p>
        </div>
        <BrainWall objects={brainObjects} />
      </main>
    </div>
  );
}
