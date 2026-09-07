"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

export default function Zoomable({src,alt,children,transparentMedia}: {src:string;alt:string;children:ReactNode;transparentMedia?:boolean}) {
  const [open,setOpen]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    if(!open)return;
    const modal=dialog.current;
    modal?.showModal();
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return ()=>{modal?.close();document.body.style.overflow=overflow;};
  },[open]);
  return <>
    <button type="button" onClick={()=>setOpen(true)} data-cursor="focus" className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left" aria-label={`expand image: ${alt}`}>{children}</button>
    {open && createPortal(<dialog ref={dialog} className="image-dialog" aria-label={alt} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>
      <div className={`image-dialog-art ${transparentMedia?"image-dialog-paper":""}`}>
        {/* Original media retains full resolution in the expanded view. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt}/>
      </div>
      <button type="button" className="image-dialog-close" aria-label="Close image" onClick={()=>dialog.current?.close()}><Icon name="close"/></button>
    </dialog>,document.body)}
  </>;
}
