import Link from "next/link";
import HomeField from "@/components/HomeField";

const paths = [
  { href: "/brain", label: "brain", desc: "what I'm chewing on right now" },
  { href: "/work", label: "work", desc: "product design case studies" },
  { href: "/about", label: "about", desc: "the long version" },
];

export default function Home() {
  return (
    <main
      className="relative overflow-hidden md:pl-[var(--rail-w)]"
      style={{ height: "100dvh", background: "var(--void)", color: "var(--void-ink)" }}
    >
      <HomeField />
      <div className="relative z-10 flex h-full flex-col justify-center px-6 pt-16 md:px-16 md:pt-0">
        <div className="mb-6 flex items-center gap-2 font-mono text-[11px] lowercase" style={{ color: "var(--void-mute)" }}>
          <span
            className="inline-block h-[6px] w-[6px] rounded-full"
            style={{ background: "var(--lift)", animation: "pulse 1.8s var(--e-io) infinite" }}
          />
          available for select work, bay area ca
        </div>

        <h1
          className="mb-8 font-semibold"
          style={{ fontSize: "clamp(32px, 6vw, 58px)", lineHeight: 1, letterSpacing: "-.02em" }}
        >
          design engineer
          <br />
          who thinks
        </h1>

        <nav className="flex flex-col gap-1" style={{ maxWidth: 420 }}>
          {paths.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex items-baseline justify-between gap-4 py-3 no-underline"
              style={{ borderTop: "1px solid var(--void-line)" }}
            >
              <span className="text-lg font-medium transition-transform duration-200 group-hover:translate-x-1">
                {p.label}
              </span>
              <span className="hidden text-right text-[12px] sm:block" style={{ color: "var(--void-mute)" }}>
                {p.desc}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </main>
  );
}
