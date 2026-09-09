"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import Magnet from "./Magnet";
import DotGrid from "./DotGrid";

const phrases = ["original human thought is the most valuable currency in world", "joie de vivre", "one must imagine vyomi happy", "discernment", "hello world", "how do we build better systems ?", "everything is design", "creating not consuming", "real artists ship steve jobs"];
const origin = { x: 0, y: 0 };
export default function Footer() {
  const field = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [shuffled, setShuffled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [englishPinned, setEnglishPinned] = useState(false);
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const departed = useRef(false);
  const activity = useCallback(() => { setIdle(false); clearTimeout(timer.current); timer.current = setTimeout(() => setIdle(true), 2000); }, []);
  const reset = useCallback(() => { activity(); setPositions(Object.fromEntries(Array.from(field.current?.querySelectorAll<HTMLElement>("[data-magnet-id]") ?? []).map(el => [el.dataset.magnetId!, { x: 0, y: 0 }]))); setShuffled(false); setHovered(false); setEnglishPinned(false); }, [activity]);
  useEffect(() => {
    const element = field.current;
    const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) activity(); else { clearTimeout(timer.current); setIdle(false); } });
    if (element) observer.observe(element);
    const resize = () => setPositions(Object.fromEntries(Array.from(element?.querySelectorAll<HTMLElement>("[data-magnet-id]") ?? []).map(el => [el.dataset.magnetId!, { x: 0, y: 0 }])));
    const resetAll = () => reset();
    const outside = (event: PointerEvent) => { if (!element?.contains(event.target as Node)) departed.current = true; };
    window.addEventListener("resize", resize); window.addEventListener("fridge-reset-magnets", resetAll); document.addEventListener("pointerdown", outside);
    return () => { observer.disconnect(); clearTimeout(timer.current); window.removeEventListener("resize", resize); window.removeEventListener("fridge-reset-magnets", resetAll); document.removeEventListener("pointerdown", outside); };
  }, [activity, reset]);
  function shuffle() {
    activity();
    const el = field.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const tiles = Array.from(el.querySelectorAll<HTMLElement>("[data-magnet-id]"));
    for (let i = tiles.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [tiles[i], tiles[j]] = [tiles[j], tiles[i]]; }
    let x = 24, y = 92, row = 0;
    const next: typeof positions = {};
    for (const tile of tiles) {
      const box = tile.getBoundingClientRect();
      if (x + box.width > bounds.width - 24) { x = 24; y += row + 12; row = 0; }
      // offsetLeft follows normal layout and is independent of the dragged transform.
      let baseX = tile.offsetLeft, baseY = tile.offsetTop;
      let parent = tile.offsetParent as HTMLElement | null;
      while (parent && parent !== el) { baseX += parent.offsetLeft; baseY += parent.offsetTop; parent = parent.offsetParent as HTMLElement | null; }
      next[tile.dataset.magnetId!] = { x: x - baseX, y: y - baseY };
      x += box.width + 10; row = Math.max(row, box.height);
    }
    setShuffled(true);
    setHovered(false);
    setEnglishPinned(false);
    setPositions(next);
  }
  function enter() { departed.current = false; }
  const english = shuffled || hovered || englishPinned;
  return <footer id="contact" className="fm-footer">
    <DotGrid />
    <div ref={field} className="fm-magnet-field" data-magnet-field onPointerMove={activity} onPointerDown={() => { enter(); activity(); }} onPointerEnter={enter} onPointerLeave={() => { departed.current = true; }}>
      <div className="fm-field-controls"><span>drag some pieces together</span><button type="button" title="Shuffle footer magnets" onClick={shuffle} className={idle ? "fm-shuffle-idle" : ""}>&lt;shuffle&gt;</button><button type="button" title="Reset footer magnets" onClick={reset}>&lt;reset&gt;</button></div>
      {phrases.map((phrase, i) => <div className={`fm-phrase fm-phrase-${i}`} key={phrase}
        onPointerEnter={event => { if (i === 1 && event.pointerType === "mouse" && !shuffled) setHovered(true); }}
        onPointerLeave={event => { if (i === 1 && event.pointerType === "mouse" && !shuffled) setHovered(false); }}>{phrase.split(" ").map((word, j) => {
        const id = `${i}-${j}`;
        const translate = i === 1 && english;
        return <Magnet id={id} key={id} draggable rotation={[-1.5, 2.1, -2.8, 1.4][(i + j) % 4]} position={positions[id] ?? origin}
          onActivate={i === 1 && !shuffled ? () => { if (matchMedia("(hover: none)").matches) setEnglishPinned(current => !current); } : undefined}
          activateOnHover={false}
          onDragStart={i === 1 ? () => setEnglishPinned(true) : undefined}>{translate ? ["joy", "of", "life"][j] : word}</Magnet>;
      })}</div>)}
    </div>
    <nav className="fm-footer-links" aria-label="Contact links"><Link href="/#selected-work">work</Link><a href={`mailto:${site.email}`}>email</a><a href={site.linkedin} target="_blank" rel="noreferrer">linkedin</a><a href="https://drive.google.com/file/d/17mbrWJjjch7fsVCZxFVA194IxyuPhgIu/view?usp=sharing" target="_blank" rel="noreferrer">resume</a><a href={site.professionalCalendar} target="_blank" rel="noreferrer">talk</a></nav>
  </footer>;
}
