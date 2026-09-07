"use client";
import { motion, useReducedMotion } from "motion/react";
export default function DepositArtwork({revised,showCount=true}: {revised:boolean;showCount?:boolean}) {
  const reduced=useReducedMotion();
  const duration=reduced?0:.7;
  return <>
          <svg viewBox="0 0 700 450" className="deposit-map" aria-hidden="true">
            <defs><pattern id="deposit-grid" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="currentColor" opacity=".2"/></pattern></defs>
            <rect width="700" height="450" fill="url(#deposit-grid)"/>
            <motion.path initial={false} fill="none" stroke="currentColor" strokeWidth="2" animate={{d:revised?"M60 260 C120 260 120 260 190 260 C260 260 280 260 350 260 C420 260 445 260 510 260 C565 260 585 260 640 260":"M60 260 C140 260 40 65 190 105 C310 145 110 355 350 340 C525 325 305 100 510 120 C630 135 555 260 640 260"}} transition={{duration,ease:[.22,1,.36,1]}}/>
            {[0,1,2,3,4,5,6].map(i=><motion.circle initial={false} key={i} r={revised?7:5} fill="currentColor" animate={{cx:revised?[60,60,350,350,350,640,640][i]:[60,155,203,350,470,550,640][i],cy:revised?260:[260,107,200,340,140,137,260][i],opacity:revised&&[1,3,4,5].includes(i)?0:1}} transition={{duration,ease:[.22,1,.36,1]}}/>)}
          </svg>

          <motion.div className="deposit-terminal" initial={false} animate={{x:revised?0:-25,rotateY:revised?0:-10}} transition={{duration}}><svg viewBox="0 0 140 100" aria-hidden="true"><rect x="4" y="4" width="132" height="92" rx="0" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M5 32H136M20 72H55M20 82H40" stroke="currentColor" strokeWidth="5"/></svg></motion.div>
          <motion.div className="deposit-infrastructure" initial={false} animate={{y:revised?48:0,opacity:revised?.18:1,scale:revised?.85:1}} transition={{duration}}><span>USDC</span><span>redeem</span></motion.div>
          <div className="deposit-balance"><span>$</span><span>balance</span></div>
          {showCount && <div className="deposit-count">{revised?"3":"7"}<span>clicks</span></div>}
  </>;
}
