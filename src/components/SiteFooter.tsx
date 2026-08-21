import type { CSSProperties } from "react";
import TextLink from "@/components/ui/TextLink";

export default function SiteFooter() {
  return (
    <footer
      className="md:pl-[var(--rail-w)]"
      style={{
        background: "var(--void)",
        color: "var(--void-soft)",
        borderTop: "1px solid var(--void-line)",
        // Footer always sits on the void surface, even inside pages that
        // wrap everything else in .light — force the dark-surface link
        // color here so it never inherits blue from that ancestor.
        "--link-accent": "var(--lift)",
      } as CSSProperties}
    >
      <div className="mx-auto max-w-6xl px-6 py-5 md:px-16">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] lowercase" style={{ color: "var(--void-mute)" }}>
          <span>bay area, ca</span>
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block h-[6px] w-[6px] rounded-full"
              style={{ background: "var(--lift)", animation: "footerPulse 1.8s var(--e-io) infinite" }}
            />
            available for select work
          </span>
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
      <style>{`@keyframes footerPulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </footer>
  );
}
