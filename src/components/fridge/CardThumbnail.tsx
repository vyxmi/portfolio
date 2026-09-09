"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function CardThumbnail({ src, poster, alt, className = "" }: { src: string; poster?: string; alt: string; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playback, setPlayback] = useState(0);
  const animated = src.endsWith(".gif");

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      timer = setTimeout(() => setReady(true), reduced ? 0 : 520);
    }, { threshold: .08 });
    observer.observe(element);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (!animated) return;
    const link = frame.current?.closest("a");
    if (!link) return;
    const play = () => { setPlayback(value => value + 1); setPlaying(true); };
    const reset = () => setPlaying(false);
    link.addEventListener("pointerenter", play);
    link.addEventListener("pointerleave", reset);
    link.addEventListener("focus", play);
    link.addEventListener("blur", reset);
    return () => {
      link.removeEventListener("pointerenter", play);
      link.removeEventListener("pointerleave", reset);
      link.removeEventListener("focus", play);
      link.removeEventListener("blur", reset);
    };
  }, [animated]);

  const displayedSrc = animated && !playing ? (poster ?? src) : `${src}${animated ? `?play=${playback}` : ""}`;

  return <div ref={frame} className="fm-card-media">
    {ready && <Image key={displayedSrc} className={`fm-card-art fm-card-art-loaded ${className}`} src={displayedSrc} alt={alt} fill sizes="(max-width: 620px) 220px, 264px" unoptimized={animated} />}
  </div>;
}
