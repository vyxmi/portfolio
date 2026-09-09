"use client";
import { useEffect, useRef } from "react";
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current!;
    document.documentElement.classList.add("fm-cursor-enabled");
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      el.style.left = `${event.clientX}px`; el.style.top = `${event.clientY}px`; el.style.opacity = "1";
      const target = event.target instanceof Element ? event.target : null;
      el.dataset.mode = target?.closest('[data-cursor="focus"]') ? "focus" : target?.closest('[data-draggable="true"]') ? "drag" : target?.closest('a,button,input,summary,[role="button"]') ? "click" : "default";
    }
    const down = () => { el.dataset.pressed = "true"; };
    const up = () => { el.dataset.pressed = "false"; };
    const leave = () => { el.style.opacity = "0"; };
    document.addEventListener("pointermove", move); document.addEventListener("pointerdown", down); document.addEventListener("pointerup", up); document.addEventListener("pointercancel", up); document.documentElement.addEventListener("pointerleave", leave); window.addEventListener("blur", leave);
    return () => { document.documentElement.classList.remove("fm-cursor-enabled"); document.removeEventListener("pointermove", move); document.removeEventListener("pointerdown", down); document.removeEventListener("pointerup", up); document.removeEventListener("pointercancel", up); document.documentElement.removeEventListener("pointerleave", leave); window.removeEventListener("blur", leave); };
  }, []);
  return <div ref={ref} className="fm-cursor" aria-hidden="true"><i /><b /></div>;
}
