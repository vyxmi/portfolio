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
      {/* justify-end reads as the footer living in the page's bottom-right
          corner. flex-wrap (not nowrap+overflow-x-auto) is deliberate: this
          row comfortably fits on one line on a normal desktop viewport, but
          forcing nowrap+scroll on a narrower one meant the overflowing
          *start* of the row (justify-end anchors the end flush right)
          scrolled outside the visible strip with no obvious affordance —
          it just silently disappeared. Wrapping to a second line when it
          doesn't fit is still readable; a silently clipped line isn't. */}
      <div
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-x-8 gap-y-2 px-6 py-5 font-mono text-[12px] lowercase md:px-16"
        style={{ color: "var(--void-mute)" }}
      >
        <span className="whitespace-nowrap">bay area, ca</span>
        <span className="whitespace-nowrap">open to select work</span>
        <span className="whitespace-nowrap">
          now listening to{" "}
          <span style={{ color: "var(--void-soft)" }}>&quot;lily of the valley&quot; by 22&deg; halo</span>
        </span>
        <span className="whitespace-nowrap">last updated aug 2026</span>
        <TextLink href="mailto:vyomi.seth@gmail.com" kind="external" className="whitespace-nowrap text-[11px] lowercase">
          vyomi.seth@gmail.com
        </TextLink>
        <TextLink href="https://www.linkedin.com/in/vyomi-seth/" kind="external" className="whitespace-nowrap text-[11px] lowercase">
          linkedin
        </TextLink>
      </div>
    </footer>
  );
}
