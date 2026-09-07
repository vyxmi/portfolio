"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { BrainObject } from "@/lib/brain/types";
import { isPrivate, sortDate } from "@/lib/brain/resolvers";
import { BRAIN_DOMAINS, DOMAIN_LABELS, domainsFor, type BrainDomain } from "@/lib/brain/domains";
import SideRail from "@/components/nav/SideRail";
import BrainGridCard, { objectTitle } from "./BrainGridCard";
import BrainFocus from "./BrainFocus";
export default function BrainWall({objects,intro}: {objects:BrainObject[];intro?:ReactNode}) {
  const params=useSearchParams();
  const pathname=usePathname();
  const reduced=useReducedMotion();
  const candidate=params.get("domain") as BrainDomain;
  const domain=BRAIN_DOMAINS.includes(candidate)?candidate:"all";
  const view=params.get("view")==="index"?"index":"objects";
  const query=params.get("q")||"";
  const openId=params.get("object");
  const [search,setSearch]=useState(query);
  function change(values:Record<string,string|null>,push=false) {
    const next=new URLSearchParams(window.location.search);
    Object.entries(values).forEach(([key,value])=>{if(value)next.set(key,value);else next.delete(key);});
    const url=pathname+(next.size?"?"+next.toString():"");
    window.history[push?"pushState":"replaceState"](null,"",url);
  }
  useEffect(()=>{const timer=setTimeout(()=>{if(search!==query){const p=new URLSearchParams(window.location.search);if(search)p.set("q",search);else p.delete("q");window.history.replaceState(null,"",pathname+(p.size?"?"+p.toString():""));}},200);return()=>clearTimeout(timer);},[search,query,pathname]);
  const publicObjects=useMemo(()=>objects.filter(o=>!isPrivate(o)).sort((a,b)=>sortDate(b)-sortDate(a)),[objects]);
  const visible=publicObjects.filter(o=>(domain==="all"||domainsFor(o).includes(domain))&&(!query||[o.title,o.content,o.subtype,o.relationship,...(o.tags||[]),...(o.contentEntries||[]).map(e=>e.text)].join(" ").toLowerCase().includes(query.toLowerCase())));
  const openObject=publicObjects.find(o=>o.id===openId)||null;
  const related=openObject ? publicObjects.filter(o=>openObject.relatedIds?.includes(o.id)||o.relatedIds?.includes(openObject.id)) : [];
  return <>
    <SideRail eyebrow="inside my brain" title={openObject?objectTitle(openObject):DOMAIN_LABELS[domain]} meta={`${visible.length} of ${publicObjects.length} objects · ${view}`} items={[{id:"collection",label:"browse the collection"},{id:"brain-contact",label:"a conversation?"}]}/>
    {intro}
    <section id="collection" className="collection">
      <div className="collection-tools">
        <div className="collection-tool-row"><label className="collection-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search the collection" placeholder="find something…" value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="collection-views" role="group" aria-label="Collection view"><button aria-pressed={view==="objects"} onClick={()=>change({view:null})}><span aria-hidden="true">▧</span> objects</button><button aria-pressed={view==="index"} onClick={()=>change({view:"index"})}><span aria-hidden="true">☷</span> index</button></div></div>
        <div className="collection-domains" role="group" aria-label="Filter by domain">{BRAIN_DOMAINS.map(d=><button key={d} aria-pressed={d===domain} onClick={()=>change({domain:d==="all"?null:d})}>{DOMAIN_LABELS[d]}</button>)}</div>
        <p className="collection-count" aria-live="polite">{visible.length} {visible.length===1?"object":"objects"}{domain!=="all"||query?<button onClick={()=>{setSearch("");change({domain:null,q:null});}}>clear filters ×</button>:null}</p>
      </div>
      <motion.div key={view} initial={reduced?false:{opacity:0}} animate={{opacity:1}} transition={{duration:.18}} className={`collection-items collection-${view}`}>
        {visible.map(o=>view==="objects"?<BrainGridCard key={o.id} o={o} onOpen={()=>change({object:o.id},true)}/>:<button className="collection-index-row" key={o.id} onClick={()=>change({object:o.id},true)}><span>{o.id}</span><strong>{objectTitle(o)}</strong><span>{o.subtype||o.type}</span><span>↗</span></button>)}
      </motion.div>
      {!visible.length&&<p className="collection-empty">Nothing here matches yet. <button onClick={()=>{setSearch("");change({domain:null,q:null});}}>Clear the filters ↗</button></p>}
    </section>
    <BrainFocus o={openObject} onClose={()=>change({object:null})} related={related} onRelated={id=>change({object:id})}/>
  </>;
}
