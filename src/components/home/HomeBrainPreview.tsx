import Link from "next/link";
import Image from "next/image";
import { brainObjects } from "@/lib/brain/objects";
import { isPrivate } from "@/lib/brain/resolvers";
import { resolveMediaSrc } from "@/lib/brain/media";

export default function HomeBrainPreview() {
  const featured=brainObjects.filter(o=>o.featured===true&&!isPrivate(o));
  const selected=featured.length?featured.slice(0,3):["B-0123","B-0013","B-0084"].map(id=>brainObjects.find(o=>o.id===id&&o.featured!==false&&!isPrivate(o))).filter(o=>!!o);
  return <section className="home-brain-preview" id="home-brain">
    <div className="brain-preview-heading"><h2><Link href="/brain">inside my brain <span aria-hidden="true">↗</span></Link></h2></div>
    <div className="brain-preview-objects">{selected.map(o=><Link href={`/brain?object=${o.id}`} key={o.id} className={`preview-object ${o.media?.length?"preview-photo":"preview-note"}`}>
      {o.media?.[0]?<Image unoptimized src={resolveMediaSrc(o.id,o.media,0)} alt={o.media[0].alt||o.title||o.content||"From Vyomi’s collection"} width={480} height={540}/>:<p>{o.content}</p>}
    </Link>)}</div>
  </section>;
}
