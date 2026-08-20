"use client";

import { useEffect, useRef } from "react";

// Five faint, unlabeled positions. Not Brain Objects, just proof that
// something will eventually live out here. Each drifts on its own slow
// loop (8 to 30s) and answers pointer proximity at a different depth.
const nodes = [
  { top: "22%", left: "18%", size: 5, depth: 0.02, dur: 14 },
  { top: "68%", left: "14%", size: 3, depth: 0.05, dur: 22 },
  { top: "30%", left: "82%", size: 4, depth: 0.03, dur: 18 },
  { top: "74%", left: "78%", size: 6, depth: 0.015, dur: 26 },
  { top: "50%", left: "92%", size: 3, depth: 0.06, dur: 11 },
];

export default function HomeField() {
  const bloomRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    let raf = 0;
    let tx = 0,
      ty = 0,
      gx = 0,
      gy = 0;

    function onMove(e: PointerEvent) {
      const r = field!.getBoundingClientRect();
      tx = e.clientX - r.left - r.width / 2;
      ty = e.clientY - r.top - r.height / 2;
    }
    field.addEventListener("pointermove", onMove);

    function tick() {
      gx += (tx - gx) * 0.05;
      gy += (ty - gy) * 0.05;
      if (bloomRef.current) {
        bloomRef.current.style.transform = `translate(calc(-50% + ${gx * 0.25}px), calc(-50% + ${gy * 0.25}px))`;
      }
      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = nodes[i].depth;
        el.style.setProperty("--px", `${gx * d}px`);
        el.style.setProperty("--py", `${gy * d}px`);
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      field.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={fieldRef} className="absolute inset-0 overflow-hidden">
      <div className="grain" />
      <div
        ref={bloomRef}
        className="absolute left-1/2 top-1/2 h-[560px] w-[560px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(132,150,234,.16), transparent 68%)",
          transition: "transform 0.6s var(--e-out)",
        }}
      />
      {nodes.map((n, i) => (
        <div
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className="absolute rounded-full drift"
          style={{
            top: n.top,
            left: n.left,
            width: n.size,
            height: n.size,
            background: "var(--lift)",
            opacity: 0.5,
            animationDuration: `${n.dur}s`,
            transform: "translate(var(--px, 0), var(--py, 0))",
          }}
        />
      ))}
      <style>{`
        .drift { animation-name: drift; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @keyframes drift {
          0%, 100% { margin-top: 0px; margin-left: 0px; }
          50% { margin-top: -14px; margin-left: 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .drift { animation: none; }
        }
      `}</style>
    </div>
  );
}
