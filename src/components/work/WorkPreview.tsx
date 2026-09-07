"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import InteractiveSystem from "./InteractiveSystem";
import SharedElement from "@/components/SharedElement";
import Icon from "@/components/ui/Icon";
import DepositArtwork from "./DepositArtwork";

export default function WorkPreview({slug,title,company,outcome,thumbnail}: {slug:string;title:string;company:string;outcome:string;thumbnail?:{src:string;alt:string}}) {
  const container=useRef<HTMLElement>(null);
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:container,offset:["start end","end start"]});
  const y=useTransform(scrollYProgress,[0,1],[48,-48]);
  const cardScale=useTransform(scrollYProgress,[0,.35,1],[.95,1,1]);
  const cardY=useTransform(scrollYProgress,[0,.35,1],[46,0,-16]);
  const [revised,setRevised]=useState(true);
  const [playing,setPlaying]=useState(false);
  const video=useRef<HTMLVideoElement>(null);
  const href=`/work/${slug}`;
  const duration=reduced?0:.7;
  const deposit=slug==="chance-deposit-flow";
  const adem=slug==="adem-user-list";
  const insurance=slug==="carinsurance-com";
  async function toggleVideo(){
    if(!video.current)return;
    if(playing){video.current.pause();setPlaying(false);}
    else {try {await video.current.play();setPlaying(true);}catch{setPlaying(false);}}
  }
  return <motion.article ref={container} id={slug} className={`work-preview preview-${slug}`} style={{scale:reduced?1:cardScale,y:reduced?0:cardY}}>
    <div className="preview-heading"><span className="preview-company">{company}</span><Link href={href}><SharedElement name={`title-${slug}`}><h2>{title}<span><Icon name="external" /></span></h2></SharedElement></Link>{outcome && <p>{outcome}</p>}</div>
    <SharedElement name={`art-${slug}`}><div className="preview-stage">
      {thumbnail && !thumbnail.src.startsWith("/protected-media/") ? <Link href={href} className="preview-art-link" data-cursor="read case ↗"><Image src={thumbnail.src} alt={thumbnail.alt} fill sizes="(max-width:900px) 90vw, 65vw" style={{objectFit:"contain"}}/></Link> : deposit ? <>
        <Link href={href} className="preview-art-link" aria-label={title} data-cursor="read case ↗">
          <DepositArtwork revised={revised} />
        </Link>
        <div className="preview-controls"><button onClick={()=>setRevised(false)} aria-pressed={!revised}>before</button><button onClick={()=>setRevised(true)} aria-pressed={revised}>after</button></div>
      </> : adem ? <>
        <Link href={href} className="preview-art-link adem-art-link" aria-label={title} data-cursor="read case ↗">
          <motion.svg viewBox="0 0 600 460" style={{y:reduced?0:y}} aria-hidden="true">
            {Array.from({length:7},(_,i)=><g key={i}><motion.path initial={false} fill="none" stroke="currentColor" strokeWidth="1.3" animate={{d:revised?`M45 ${60+i*55} C250 ${60+i*55} 215 230 425 230`:`M45 ${60+i*55} C250 ${60+i*55} 215 ${60+i*55} 425 ${60+i*55}`}} transition={{duration,ease:[.22,1,.36,1]}}/><circle cx="45" cy={60+i*55} r="4"/><motion.rect initial={false} x="420" width="105" height="34" fill="#232b46" stroke="currentColor" animate={{y:revised?213:43+i*55,opacity:revised&&i!==3?0:1}} transition={{duration,ease:[.22,1,.36,1]}}/></g>)}
          </motion.svg>
          <span className="preview-access">Password protected</span>
        </Link>
        <div className="preview-controls"><button onClick={()=>setRevised(false)} aria-pressed={!revised}>before</button><button onClick={()=>setRevised(true)} aria-pressed={revised}>after</button></div>
      </> : insurance ? <InteractiveSystem/> : <>
        <Link href={href} className="preview-art-link chance-art-link" aria-label={title} data-cursor="read case ↗"><motion.div className="chance-product" style={{y:reduced?0:y}}><Image src="/case-studies/chance-live/swipe-flow.webp" alt="Chance card review interface" width={2048} height={1367} sizes="(max-width: 700px) 110vw, 60vw"/></motion.div></Link>
        <video ref={video} className="preview-video" controls={playing} hidden={!playing} playsInline loop preload="none" onPause={()=>setPlaying(false)} aria-label="Original accidental swipe behavior"><source src="/case-studies/chance-live/accidental-swipe-before.mp4" type="video/mp4"/></video>
        <div className="preview-controls"><button onClick={toggleVideo} aria-pressed={playing}>{playing?"close recording ×":"watch the original interaction ↗"}</button></div>
      </>}
    </div></SharedElement>
  </motion.article>;
}
