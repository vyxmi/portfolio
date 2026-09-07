"use client";
import { useState } from "react";
import DepositArtwork from "@/components/work/DepositArtwork";

export default function DepositHero() {
  const [revised,setRevised]=useState(true);
  return <div className="preview-stage deposit-hero" role="group" aria-label="Deposit flow comparison">
    <DepositArtwork revised={revised} showCount={false}/>
    <div className="preview-controls"><button onClick={()=>setRevised(false)} aria-pressed={!revised}>before</button><button onClick={()=>setRevised(true)} aria-pressed={revised}>after</button></div>
  </div>;
}
