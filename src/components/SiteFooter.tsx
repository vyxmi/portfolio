import TextLink from "@/components/ui/TextLink";

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
          <TextLink href="mailto:vyomi.seth@gmail.com" kind="external" className="text-[11px] lowercase">
            vyomi.seth@gmail.com
          </TextLink>
          <TextLink href="#" kind="download" className="text-[11px] lowercase">
            resume
          </TextLink>
          <TextLink href="#" kind="external" className="text-[11px] lowercase">
            linkedin
          </TextLink>
          <TextLink href="#top" kind="up" className="ml-auto text-[11px] lowercase">
            back to top
          </TextLink>
        </div>
      </div>
    </footer>
  );
}
