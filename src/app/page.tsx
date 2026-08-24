import HomeField from "@/components/HomeField";
import HomeIntro from "@/components/HomeIntro";

export default function Home() {
  return (
    <main
      className="relative overflow-hidden md:pl-[var(--rail-w)]"
      style={{ height: "100dvh", background: "var(--void)", color: "var(--void-ink)" }}
    >
      <HomeField />
      <div className="relative z-10 flex h-full flex-col justify-center px-6 pt-16 pointer-events-none md:px-16 md:pt-0">
        {/* Left-anchored: sits in the page's normal left column, every
            line sharing that same left edge (no per-line centering). */}
        <HomeIntro />
      </div>
    </main>
  );
}
