"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function StaticSystem(){return <div className="system-static"><Image src="/case-studies/carinsurance-com/desktop-before-after.png" alt="Original and redesigned CarInsurance.com interfaces" width={1005} height={329} sizes="(max-width:900px) 90vw, 65vw"/></div>;}
const Scene=dynamic(()=>import("./SystemScene"),{ssr:false,loading:StaticSystem});
function subscribe(callback:()=>void){const media=window.matchMedia("(prefers-reduced-motion: reduce)");media.addEventListener("change",callback);return()=>media.removeEventListener("change",callback);}
export default function InteractiveSystem(){
  const reduced=useSyncExternalStore(subscribe,()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,()=>true);
  const [near,setNear]=useState(false);
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setNear(true);observer.disconnect();}},{rootMargin:"250px"});
    if(ref.current)observer.observe(ref.current);
    return()=>observer.disconnect();
  },[]);
  return <div ref={ref} style={{height:"100%"}}>{reduced||!near?<StaticSystem/>:<Scene/>}</div>;
}
