"use client";

import type { ReactNode } from "react";
import type { BrainObject } from "@/lib/brain/types";
import { entryDateLabel, resolveTitleDisplay, splitParagraphs } from "@/lib/brain/resolvers";
import { resolveMediaSrc } from "@/lib/brain/media";

// Title only renders when a real title exists — resolveTitleDisplay never
// invents one, so this is a pure lookup, not a fallback decision.
export function VTitle({ o, className }: { o: BrainObject; className?: string }) {
  if (!resolveTitleDisplay(o)) return null;
  return <div className={className ? `v-title ${className}` : "v-title"}>{o.title}</div>;
}

const REDACTION = /█+/g;

// Redaction blocks (██████) are literal characters already in the exact
// content — this only wraps runs of them for styling/a11y, it never
// touches the surrounding words.
function renderLine(text: string, key: number) {
  if (!REDACTION.test(text)) return <p key={key}>{text}</p>;
  REDACTION.lastIndex = 0;
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = REDACTION.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    nodes.push(
      <span key={`r${i++}`} className="v-redaction" aria-label="redacted">
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <p key={key}>{nodes}</p>;
}

// Long content clamps to a short preview; short content just shows in
// full. `readMore` is true only on the wall, for objects long enough to
// clamp (see the vessel's own presentation check) — clicking anywhere on
// the card opens the full object in focus (see BrainCard's `interactive`),
// so this renders a plain label, not its own button: a nested clickable
// here previously fought the card's idle-drift/hover motion and the
// ambient WebGL canvas for the pointer and could silently eat the click.
export function VBody({ o, readMore = false, className }: { o: BrainObject; readMore?: boolean; className?: string }) {
  const paragraphs = splitParagraphs(o.content);
  if (!paragraphs.length) return null;
  return (
    <>
      <div className={className ? `v-body ${className}${readMore ? " clamped" : ""}` : `v-body${readMore ? " clamped" : ""}`}>
        {paragraphs.map((p, i) => renderLine(p, i))}
      </div>
      {readMore && <span className="readmore-btn">read more</span>}
    </>
  );
}

// For objects whose "content" is really a list of separately-dated lines
// (see BrainContentEntry in types.ts) rather than one continuous block —
// each entry's date renders on its own, formatted via entryDateLabel, next
// to its text rather than living inside the text itself.
export function VEntries({ entries, className }: { entries: BrainObject["contentEntries"]; className?: string }) {
  if (!entries || !entries.length) return null;
  return (
    <div className={className ? `v-entries ${className}` : "v-entries"}>
      {entries.map((entry, i) => (
        <div className="v-entry" key={i}>
          <span className="v-entry-date">{entryDateLabel(entry.date)}</span>
          <p className="v-entry-text">{entry.text}</p>
        </div>
      ))}
    </div>
  );
}

export function MediaThumb({
  o,
  index = 0,
  paper = false,
  fit = "cover",
  className = "",
}: {
  o: BrainObject;
  index?: number;
  paper?: boolean;
  fit?: "cover" | "contain";
  className?: string;
}) {
  const src = resolveMediaSrc(o.id, o.media, index, paper);
  const alt = o.media?.[index]?.alt || o.title || "";
  return (
    <span className={`thumb thumb-${fit} ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </span>
  );
}

export function RatingRow({ rating }: { rating?: number }) {
  if (rating == null) return null;
  const n = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="rating-row">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`rating-dot${i < n ? " on" : ""}`} />
      ))}
      <span className="rating-num">{n}/5</span>
    </div>
  );
}
