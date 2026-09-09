"use client";
import { useEffect, useRef, useState } from "react";
export default function Contents({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const [footerVisible, setFooterVisible] = useState(false);
  const fill = useRef<HTMLDivElement>(null), mobile = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const nodes = sections.map(s => document.getElementById(s.id)).filter((n): n is HTMLElement => !!n);
      setActive((nodes.filter(n => n.getBoundingClientRect().top <= innerHeight * .3).at(-1) ?? nodes[0])?.id);
      const body = document.querySelector(".fm-case .article-body");
      if (body && fill.current) { const r = body.getBoundingClientRect(); fill.current.style.transform = `scaleY(${Math.max(0, Math.min(1, (innerHeight * .3 - r.top) / Math.max(1, r.height - innerHeight * .7)))})`; }
    }
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const footer = document.querySelector(".fm-case .fm-footer");
    const footerObserver = new IntersectionObserver(entries => setFooterVisible(entries[0].isIntersecting), { threshold: .02 });
    if (footer) footerObserver.observe(footer);
    update(); window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", scroll);
    return () => { footerObserver.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); };
  }, [sections]);
  const links = sections.map(s => <a href={`#${s.id}`} key={s.id} aria-current={active === s.id ? "location" : undefined} onClick={() => { if (mobile.current) mobile.current.open = false; }}>{s.label}</a>);
  return <><div className="fm-progress" data-footer-visible={footerVisible} aria-hidden="true"><div ref={fill} /></div><nav className="fm-contents" data-footer-visible={footerVisible} aria-label="Case study contents">{links}</nav><details ref={mobile} data-footer-visible={footerVisible} className="fm-mobile-contents"><summary>contents</summary><nav aria-label="Case study contents">{links}</nav></details></>;
}
