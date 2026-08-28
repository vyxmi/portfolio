"use client";

import ScrollReveal from "@/components/ScrollReveal";

// Before/after comparison as a real graphic instead of a sentence. Built
// from whatever number is actually in the case study text, nothing
// invented, this is a presentation of real data, not a decoration. The
// "after" value sits in its own accent-tinted chip so the eye lands on
// the improved number first, not just a bigger font.
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
      <div className="case-box flex items-center gap-3 p-5 sm:gap-6 sm:p-8">
        <div className="min-w-0 flex-1 rounded-[var(--r-md)] py-4 text-center" style={{ background: "var(--paper-dim)" }}>
          <div className="font-mono text-[34px] font-bold leading-none sm:text-[44px]" style={{ color: "var(--ink-mute)", letterSpacing: "-.02em" }}>
            {before}
          </div>
          <div className="cap mt-2 px-2">{beforeLabel}</div>
        </div>
        <svg width="30" height="16" viewBox="0 0 28 14" fill="none" className="flex-none" aria-hidden>
          <path d="M1 7H26M26 7L20 1.5M26 7L20 12.5" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="min-w-0 flex-1 rounded-[var(--r-md)] py-4 text-center" style={{ background: "rgba(var(--accent-rgb),.08)" }}>
          <div className="font-mono text-[34px] font-bold leading-none sm:text-[44px]" style={{ color: "var(--accent)", letterSpacing: "-.02em" }}>
            {after}
          </div>
          <div className="cap mt-2 px-2">{afterLabel}</div>
        </div>
      </div>
      {caption && <div className="cap mt-3">{caption}</div>}
    </ScrollReveal>
  );
}
