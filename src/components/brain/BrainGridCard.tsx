"use client";
import type { BrainObject } from "@/lib/brain/types";
import { dateLabel } from "@/lib/brain/resolvers";
import { resolveMediaSrc } from "@/lib/brain/media";
import AsciiFlower from "@/components/AsciiFlower";

export function objectTitle(o: BrainObject) { return o.title || o.content?.split("\n")[0] || o.contentEntries?.[0]?.text || o.media?.[0]?.alt || o.id; }
export default function BrainGridCard({o,onOpen}: {o:BrainObject;onOpen:()=>void}) {
  const title = objectTitle(o);
  const media = o.media?.[0];
  const kind = o.vessel === "floating" ? "flower" : media ? "image" : o.vessel === "spotify-artifact" ? "playlist" : o.subtype === "review" ? "review" : "text";
  const copy = o.contentEntries?.map(e => e.text).join("\n\n") || o.content;
  return <article className="collection-card" data-id={o.id} data-kind={kind}>
    <button onClick={onOpen} data-cursor={media ? "inspect ↗" : "read ↗"} aria-label={`Open ${title}`}>
      {kind === "flower" ? <div className="collection-flower"><AsciiFlower /></div> : media ? <div className="collection-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" decoding="async" src={resolveMediaSrc(o.id,o.media,0)} alt={media.alt || title} />
        {o.media!.length > 1 && <span className="collection-image-count">{o.media!.length} images ↗</span>}
      </div> : kind === "playlist" ? <div className="playlist-mark" aria-hidden="true"><span>♪</span><i/><i/><i/><i/><i/></div> : null}
      <div className="collection-card-copy">
        {o.title && <h2>{o.title}</h2>}
        {copy && copy.trim().toLowerCase() !== o.title?.trim().toLowerCase() && <p>{copy}</p>}
        {o.rating != null && <span className="collection-rating">{o.rating} / 5</span>}
        <div className="collection-card-meta"><span>{dateLabel(o)}</span><span>{o.subtype || o.type} ↗</span></div>
      </div>
    </button>
  </article>;
}
