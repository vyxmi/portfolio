import Link from "next/link";

// The hero's closing CTA row — "view work" scroll-jumps to the Selected
// Work section below (a plain in-page anchor, not a route change);
// "enter brain" is a real route link to /brain, styled with the same
// diagonal external-style arrow TextLink uses for "external" — deliberate
// even though the destination is internal, since it reads as leaving the
// hero for a different kind of space rather than the next page in a flow.
export default function HomeHeroCtas() {
  return (
    <div className="pointer-events-auto flex flex-wrap items-center gap-9">
      <a
        href="#selected-work"
        className="group inline-flex items-center gap-2 font-mono text-[13.5px] lowercase no-underline"
        style={{ color: "var(--void-mute)" }}
      >
        <span className="border-b border-transparent transition-colors duration-200 group-hover:border-current">view work</span>
        <span className="transition-transform duration-200 group-hover:translate-y-0.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M6 2.5V9.5M6 9.5L2.5 6M6 9.5L9.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
      <Link
        href="/brain"
        className="group inline-flex items-center gap-1.5 text-[15px] font-medium no-underline"
        style={{ color: "var(--lift)" }}
      >
        <span className="border-b border-transparent transition-colors duration-200 group-hover:border-current">enter brain</span>
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
