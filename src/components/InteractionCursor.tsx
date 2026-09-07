"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// A single supplementary layer; native cursors retain precision and selection.
export default function InteractionCursor() {
  const ref=useRef<HTMLDivElement>(null);
  const pathname=usePathname();
  useEffect(()=>{
    const node=ref.current;
    if(!node)return;
    const fine=window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    let target:HTMLElement|null=null;
    let frame=0, x=0, y=0, visible=false;
    function hide(){node!.dataset.visible="false";visible=false;target=null;if(node!.matches(":popover-open"))node!.hidePopover();}
    function resolve(element:Element|null){
      const next=element?.closest<HTMLElement>("a[href],button,summary,[role=button],input,textarea,select,[data-cursor]")||null;
      if(!next || next.closest("[inert]") || next.matches(":disabled,[aria-disabled=true],input,textarea,select") || window.getSelection()?.type==="Range"){hide();return;}
      if(next===target)return;
      target=next;
      let label=next.dataset.cursor||"";
      let kind="action";
      if(label==="none"){hide();return;}
      if(next.matches("[data-cursor=focus],.cursor-zoom-in")){label="+";kind="zoom";}
      else if(/^close\b/i.test(next.getAttribute("aria-label")||"")){label="×";kind="action";}
      else if(next.closest(".preview-controls")){label=next.getAttribute("aria-pressed")==="true"?"✓":next.closest(".preview-chance-live")?"▶":"↔";kind="compare";}
      else if(next.matches("summary")){label=next.parentElement?.hasAttribute("open")?"−":"+";kind="disclosure";}
      else if(!label && next.matches("a")){
        const href=next.getAttribute("href")||"";
        label=href.startsWith("mailto:")?"@":href==="#top"?"↑":href.startsWith("#")?"↓":href.startsWith("http")?"↗":"→";
        kind="link";
      } else if(!label) {label=next.getAttribute("aria-pressed")==="true"?"✓":"↗";}
      node!.textContent=label;
      node!.dataset.kind=kind;
      node!.dataset.visible="true";
      // Follow native dialogs into the top layer without intercepting clicks.
      if(typeof node!.showPopover==="function"){if(node!.matches(":popover-open"))node!.hidePopover();node!.showPopover();}
      visible=true;
    }
    function position(){
      frame=0;
      const width=node!.offsetWidth||40, height=node!.offsetHeight||36;
      node!.style.transform=`translate3d(${Math.max(4,Math.min(x+18,innerWidth-width-8))}px,${Math.max(4,Math.min(y+18,innerHeight-height-8))}px,0)`;
    }
    function move(event:PointerEvent){
      if(event.pointerType!=="mouse"||!fine.matches){hide();return;}
      x=event.clientX;y=event.clientY;
      resolve(event.target instanceof Element?event.target:null);
      if(!frame)frame=requestAnimationFrame(position);
    }
    function refresh(){if(visible){target=null;resolve(document.elementFromPoint(x,y));}}
    function down(){node!.dataset.pressed="true";}
    function up(){node!.dataset.pressed="false";requestAnimationFrame(refresh);}
    function leave(event:PointerEvent){if(!event.relatedTarget)hide();}
    document.addEventListener("pointermove",move,{passive:true});
    document.addEventListener("pointerout",leave);
    document.addEventListener("pointerdown",down);
    document.addEventListener("pointerup",up);
    document.addEventListener("keydown",hide);
    window.addEventListener("blur",hide);
    window.addEventListener("scroll",hide,{passive:true});
    return()=>{hide();cancelAnimationFrame(frame);document.removeEventListener("pointermove",move);document.removeEventListener("pointerout",leave);document.removeEventListener("pointerdown",down);document.removeEventListener("pointerup",up);document.removeEventListener("keydown",hide);window.removeEventListener("blur",hide);window.removeEventListener("scroll",hide);};
  },[pathname]);
  return <div ref={ref} popover="manual" className="interaction-cursor" aria-hidden="true"/>;
}
