"use client";

import { useEffect, useRef } from "react";

export default function DotGrid({ fade = false }: { fade?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current, parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0, height = 0, frame = 0, visible = true;
    const pointer = { x: -1000, y: -1000 };
    let dots: { x: number; y: number; radius: number }[] = [];
    function draw() {
      frame = 0;
      if (!visible) return;
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = "#9299aa";
      let unsettled = false;
      for (const dot of dots) {
        const distance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
        const target = .96 + (reduced ? 0 : Math.max(0, 1 - distance / 110) ** 1.6 * 3.12);
        dot.radius += (target - dot.radius) * .19;
        if (Math.abs(target - dot.radius) > .015) unsettled = true;
        ctx!.beginPath(); ctx!.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2); ctx!.fill();
      }
      if (unsettled) frame = requestAnimationFrame(draw);
    }
    function request() { if (!frame) frame = requestAnimationFrame(draw); }
    function resize() {
      const r = parent!.getBoundingClientRect(); width = r.width; height = r.height;
      const ratio = Math.min(devicePixelRatio, 2);
      canvas!.width = width * ratio; canvas!.height = height * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const inset = Math.max(24, (width - 1062) / 2);
      const start = ((inset % 24) + 24) % 24;
      dots = [];
      for (let y = 12; y < height; y += 24) for (let x = start; x < width; x += 24) dots.push({ x, y, radius: .8 });
      request();
    }
    function move(event: PointerEvent) { if (event.pointerType === "touch") return; const r = canvas!.getBoundingClientRect(); pointer.x = event.clientX - r.left; pointer.y = event.clientY - r.top; request(); }
    function leave() { pointer.x = pointer.y = -1000; request(); }
    const observer = new ResizeObserver(resize); observer.observe(parent);
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) request(); }); intersection.observe(parent);
    parent.addEventListener("pointermove", move); parent.addEventListener("pointerleave", leave); resize();
    return () => { observer.disconnect(); intersection.disconnect(); cancelAnimationFrame(frame); parent.removeEventListener("pointermove", move); parent.removeEventListener("pointerleave", leave); };
  }, []);
  return <canvas ref={ref} className={`fm-dot-grid ${fade ? "fm-dot-grid-fade" : ""}`} aria-hidden="true" />;
}
