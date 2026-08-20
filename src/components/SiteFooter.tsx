export default function SiteFooter() {
  return (
    <footer
      className="md:pl-[var(--rail-w)]"
      style={{ background: "var(--void)", color: "var(--void-soft)", borderTop: "1px solid var(--void-line)" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-5 md:px-16">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] lowercase" style={{ color: "var(--void-mute)" }}>
          <span>bay area, ca</span>
          <span>available for select work</span>
          <span>
            now listening to <span style={{ color: "var(--void-soft)" }}>&quot;aerial troubles&quot; by stereolab</span>
          </span>
          <span>last updated aug 2026</span>
          <a href="mailto:vyomi.seth@gmail.com" className="no-underline hover:underline" style={{ color: "var(--void-soft)" }}>
            vyomi.seth@gmail.com
          </a>
          <a href="#" className="no-underline hover:underline" style={{ color: "var(--void-soft)" }}>
            resume
          </a>
          <a href="#" className="no-underline hover:underline" style={{ color: "var(--void-soft)" }}>
            linkedin
          </a>
          <a href="#top" className="ml-auto no-underline hover:underline" style={{ color: "var(--void-soft)" }}>
            back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
