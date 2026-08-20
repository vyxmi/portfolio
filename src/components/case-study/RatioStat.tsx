"use client";

import ScrollReveal from "@/components/ScrollReveal";

// Before/after comparison as a real graphic instead of a sentence. Built
// from whatever number is actually in the case study text, nothing
// invented, this is a presentation of real data, not a decoration.
export default function RatioStat({
  before,
  beforeLabel,
  after,
  afterLabel,
  caption,
}: {
  before: string;
  beforeLabel: string;
  after: string;
  afterLabel: string;
  caption?: string;
}) {
  return (
    <ScrollReveal className="not-prose">
      <div className="flex items-center gap-4 sm:gap-8" style={{ border: "1px solid var(--line)", padding: "28px 24px" }}>
        <div className="flex-1 text-center">
          <div className="metric text-[30px] font-bold sm:text-[38px]" style={{ color: "var(--ink-mute)", letterSpacing: "-.02em" }}>
            {before}
          </div>
          <div className="cap mt-1">{beforeLabel}</div>
        </div>
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none" className="flex-none" aria-hidden>
          <path d="M1 7H26M26 7L20 1.5M26 7L20 12.5" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex-1 text-center">
          <div className="metric text-[30px] font-bold sm:text-[38px]" style={{ color: "var(--accent)", letterSpacing: "-.02em" }}>
            {after}
          </div>
          <div className="cap mt-1">{afterLabel}</div>
        </div>
      </div>
      {caption && <div className="cap mt-3">{caption}</div>}
    </ScrollReveal>
  );
}
