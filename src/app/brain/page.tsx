import type { Metadata } from "next";
import { Suspense } from "react";
import { brainObjects } from "@/lib/brain/objects";
import { isPrivate } from "@/lib/brain/resolvers";
import { site } from "@/lib/site";
import BrainWall from "@/components/brain/BrainWall";
import SiteFooter from "@/components/SiteFooter";
export const metadata: Metadata={title:"Brain, Vyomi Seth"};
export default function BrainPage(){
  return <div className="site-page brain-page"><main id="main-content" className="brain-main">
    <Suspense fallback={<p>Opening the collection…</p>}><BrainWall objects={brainObjects.filter(o=>!isPrivate(o))} intro={<header className="brain-opening"><div><span className="eyebrow">vyomi, in pieces</span><h1>inside my brain<span aria-hidden="true">✳</span></h1></div><p>journal snippets, miscellaneous creations, notes app lists, memories, half-finished projects, attempts at graphic design from when i was ten</p></header>}/></Suspense>
    <section id="brain-contact" className="brain-contact"><span aria-hidden="true">↳</span><a href={site.brainCalendar}>Something here made you want to talk?<br/><strong>Follow that thought ↗</strong></a></section>
  </main><SiteFooter compact/></div>;
}
