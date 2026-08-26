import "./home-brain.css";
import HomeField from "@/components/HomeField";
import HomeIntro from "@/components/HomeIntro";
import HomeHeroCtas from "@/components/HomeHeroCtas";
import HomeBrainCanvas from "@/components/home/HomeBrainCanvas";
import HomeSelectedWork from "@/components/home/HomeSelectedWork";

export default function Home() {
  return (
    <main>
      <section
        className="relative overflow-hidden md:pl-[var(--rail-w)]"
        style={{ height: "100dvh", background: "var(--void)", color: "var(--void-ink)" }}
      >
        <HomeField />
        <HomeBrainCanvas />
        {/* Top-left, not vertically centered — same placement as the "inside
            my brain" intro block on /brain (page top, standard side padding,
            extra clearance on mobile for the fixed MobileNav bar), so the two
            pages' headers land in a consistent spot. justify-between pins the
            intro to the top and the CTA row to the bottom of the same 100dvh
            section instead of letting the CTAs trail directly under the copy. */}
        <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-14 pt-24 pointer-events-none md:px-16 md:pb-16 md:pt-20">
          {/* Left-anchored: sits in the page's normal left column, every
              line sharing that same left edge (no per-line centering). */}
          <HomeIntro />
          <HomeHeroCtas />
        </div>
      </section>
      <HomeSelectedWork />
    </main>
  );
}
