"use client";
import { useEffect, useRef, useState } from "react";
import type { BrainObject } from "@/lib/brain/types";
import { dateLabel, entryDateLabel } from "@/lib/brain/resolvers";
import { resolveMediaSrc } from "@/lib/brain/media";
import { domainsFor, DOMAIN_LABELS } from "@/lib/brain/domains";
import { objectTitle } from "./BrainGridCard";
import AsciiFlower from "@/components/AsciiFlower";

export default function BrainFocus({o,onClose,related=[],onRelated}: {o:BrainObject|null;onClose:()=>void;related?:BrainObject[];onRelated?:(id:string)=>void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!o) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  },[o]);
  if (!o) return null;
  return <dialog ref={dialog} className="object-dialog" aria-label={objectTitle(o)} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="object-dialog-inner">
      <div className="object-dialog-bar"><span>{domainsFor(o).map(d=>DOMAIN_LABELS[d]).join(" / ")}</span><button onClick={onClose} data-cursor="×" aria-label="Close object">close ×</button></div>
      <ObjectBody key={o.id} o={o}/>
      {related.length>0 && <nav className="object-related" aria-label="Related objects"><span>connected to</span>{related.map(item=><button key={item.id} onClick={()=>onRelated?.(item.id)}>{objectTitle(item)} ↗</button>)}</nav>}
    </div>
  </dialog>;
}
function ObjectBody({o}: {o:BrainObject}) {
  const [index,setIndex]=useState(0);
  const media=o.media??[];
  const title=o.title;
  return <>
    {media.length>0 && <figure className="object-gallery">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolveMediaSrc(o.id,media,index)} alt={media[index].alt || objectTitle(o)}/>
      <figcaption><a href={`/brain/media/${encodeURIComponent(media[index].filename)}`} target="_blank" rel="noreferrer">full image ↗</a>{media.length>1 && <div><button onClick={()=>setIndex(i=>(i-1+media.length)%media.length)} aria-label="Previous image">←</button><span aria-live="polite">{index+1} / {media.length}</span><button onClick={()=>setIndex(i=>(i+1)%media.length)} aria-label="Next image">→</button></div>}</figcaption>
    </figure>}
    {o.vessel==="floating" && <div className="object-flower"><AsciiFlower/></div>}
    <div className="object-text">
      {title && <h2>{title}</h2>}
      {o.content && o.content.trim().toLowerCase()!==title?.trim().toLowerCase() && <p>{o.content}</p>}
      {o.contentEntries?.map((entry,i)=><div className="object-entry" key={i}><time dateTime={entry.date}>{entryDateLabel(entry.date)}</time><p>{entry.text}</p></div>)}
      {o.rating!=null && <p className="object-rating">{o.rating} / 5</p>}
      <div className="object-metadata"><span>{dateLabel(o)}</span><span>{[o.relationship,o.subtype||o.type].filter(Boolean).join(" · ")}</span></div>
      {o.tags?.length ? <p className="object-tags">{o.tags.map(t=>"#"+t).join(" ")}</p> : null}
      {o.credit && <p className="object-credit">{o.credit}</p>}
      {o.relatedUrl && /^(https?:\/\/|mailto:|\/)/.test(o.relatedUrl) && <a className="object-source" href={o.relatedUrl} target="_blank" rel="noreferrer">{o.vessel==="spotify-artifact"?"listen":"visit source"} ↗</a>}
    </div>
  </>;
}
