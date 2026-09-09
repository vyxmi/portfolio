"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";

export default function Magnet({ children, draggable = false, variant, rotation = 0, position, intro = false, onActivate, activateOnHover = true, onDragStart, id, className = "" }: {
  children: ReactNode; draggable?: boolean; rotation?: number; position?: { x: number; y: number }; intro?: boolean;
  variant?: "display" | "drag" | "click"; onActivate?: () => void; activateOnHover?: boolean; onDragStart?: () => void; id?: string; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0), rotateX = useMotionValue(0), rotateY = useMotionValue(0);
  const reduced = useReducedMotion();
  const gesture = useRef({ active: false, moved: false, startX: 0, startY: 0, x: 0, y: 0 });
  const hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!position) return;
    const options = { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] as [number, number, number, number] };
    const a = animate(x, position.x, options), b = animate(y, position.y, options);
    return () => { a.stop(); b.stop(); };
  }, [position, x, y, reduced]);
  useEffect(() => {
    if (!intro || reduced) return;
    const r = ref.current?.getBoundingClientRect();
    const field = ref.current?.closest("[data-magnet-field]")?.getBoundingClientRect();
    if (!r || !field) return;
    x.set(field.left + field.width / 2 - r.left - r.width / 2 + (Math.random() - .5) * 180);
    y.set(field.top + field.height * .6 - r.top + (Math.random() - .5) * 90);
    const options = { delay: .2 + Math.random() * .18, duration: .95, ease: [.22, 1, .36, 1] as [number, number, number, number] };
    let a: ReturnType<typeof animate> | undefined, b: ReturnType<typeof animate> | undefined;
    const timer = window.setTimeout(() => { a = animate(x, 0, options); b = animate(y, 0, options); }, 120);
    return () => { clearTimeout(timer); a?.stop(); b?.stop(); };
  }, [intro, reduced, x, y]);
  useEffect(() => {
    const reset = () => {
      clearTimeout(hold.current);
      gesture.current.active = false;
      if (ref.current) ref.current.dataset.dragging = "false";
      animate(rotateX, 0, { duration: .2 }); animate(rotateY, 0, { duration: .2 });
      const destination = position ?? { x: 0, y: 0 };
      animate(x, destination.x, { duration: reduced ? 0 : .45, ease: [.22, 1, .36, 1] });
      animate(y, destination.y, { duration: reduced ? 0 : .45, ease: [.22, 1, .36, 1] });
    };
    window.addEventListener("fridge-reset-magnets", reset);
    return () => window.removeEventListener("fridge-reset-magnets", reset);
  }, [position, reduced, rotateX, rotateY, x, y]);
  useEffect(() => {
    const el = ref.current;
    const prevent = (event: TouchEvent) => { if (gesture.current.active && event.cancelable) event.preventDefault(); };
    el?.addEventListener("touchmove", prevent, { passive: false });
    return () => { el?.removeEventListener("touchmove", prevent); clearTimeout(hold.current); };
  }, []);
  function moveTo(nextX: number, nextY: number) {
    const el = ref.current;
    const field = el?.closest("[data-magnet-field]")?.getBoundingClientRect();
    const r = el?.getBoundingClientRect();
    if (!field || !r) return;
    const baseX = r.left - x.get(), baseY = r.top - y.get();
    x.set(Math.max(field.left + 6 - baseX, Math.min(field.right - r.width - 6 - baseX, nextX)));
    y.set(Math.max(field.top + 6 - baseY, Math.min(field.bottom - r.height - 6 - baseY, nextY)));
  }
  function release() {
    clearTimeout(hold.current);
    gesture.current.active = false;
    if (ref.current) ref.current.dataset.dragging = "false";
    animate(rotateX, 0, { duration: .2 }); animate(rotateY, 0, { duration: .2 });
  }
  const behavior = draggable ? "drag" : (variant ?? (onActivate ? "click" : "display"));
  return <motion.span ref={ref} className={`fm-magnet fm-magnet-${behavior} ${behavior === "display" ? "fm-magnet-fixed" : ""} ${behavior === "drag" ? "fm-magnet-draggable" : ""} ${className}`}
    data-magnet-id={id} data-draggable={draggable || undefined} data-magnet-behavior={behavior} data-cursor={behavior === "drag" ? "drag" : behavior === "click" ? "click" : undefined}
    role={draggable || onActivate ? "button" : undefined} tabIndex={draggable || onActivate ? 0 : undefined}
    aria-label={draggable ? `${typeof children === "string" ? children : "magnet"}, draggable; use arrow keys to move` : undefined}
    style={{ x, y, rotate: rotation, rotateX, rotateY, transformPerspective: 600 }}
    onPointerDown={event => {
      if (!draggable) return;
      x.stop(); y.stop();
      gesture.current = { active: event.pointerType !== "touch", moved: false, startX: event.clientX, startY: event.clientY, x: x.get(), y: y.get() };
      const el = event.currentTarget, pointerId = event.pointerId;
      const activate = () => { gesture.current.active = true; el.setPointerCapture(pointerId); el.dataset.dragging = "true"; onDragStart?.(); };
      if (event.pointerType === "touch") hold.current = setTimeout(activate, 220); else activate();
    }}
    onPointerMove={event => {
      const g = gesture.current;
      if (g.active) {
        const dx = event.clientX - g.startX, dy = event.clientY - g.startY;
        if (Math.hypot(dx, dy) > 5) g.moved = true;
        moveTo(g.x + dx, g.y + dy);
        if (!reduced) { rotateX.set(Math.max(-5, Math.min(5, -dy / 12))); rotateY.set(Math.max(-5, Math.min(5, dx / 12))); }
      } else if (event.pointerType === "touch") clearTimeout(hold.current);
      else if (draggable && !reduced) {
        const r = event.currentTarget.getBoundingClientRect();
        rotateY.set((event.clientX - r.left - r.width / 2) / 18); rotateX.set(-(event.clientY - r.top - r.height / 2) / 8);
      }
    }}
    onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
    onPointerLeave={() => { if (!gesture.current.active) { animate(rotateX, 0); animate(rotateY, 0); } }}
    onMouseEnter={activateOnHover ? onActivate : undefined}
    onClick={() => { if (!gesture.current.moved) onActivate?.(); }}
    onKeyDown={event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onActivate?.(); }
      if (draggable && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault(); const step = event.shiftKey ? 20 : 5;
        moveTo(x.get() + (event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0), y.get() + (event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0));
      }
    }}>{onActivate ? <AnimatePresence initial={false} mode="wait"><motion.span key={String(children)} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: reduced ? 0 : .12 }}>{children}</motion.span></AnimatePresence> : children}</motion.span>;
}
