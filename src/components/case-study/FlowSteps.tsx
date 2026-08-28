import ScrollReveal from "@/components/ScrollReveal";

// A chain like "Idea → Wireframe → Mockup → Prototype → Test" reads as a
// wall of text inline. This renders each step as its own quiet block with
// a connector between, wrapping cleanly on mobile instead of running off
// the edge of the measure. Steps assemble in one at a time on scroll
// (each its own ScrollReveal, staggered) rather than fading in as one flat
// block, so the chain reads as a sequence even before you read a word.
export default function FlowSteps({ label, steps }: { label?: string; steps: string[] }) {
  return (
    <div className="not-prose">
      {label && <div className="cap mb-3">{label}</div>}
      <div className="flex flex-wrap items-center gap-y-2">
        {steps.map((step, i) => (
          <ScrollReveal key={i} className="flex items-center" delay={i * 70}>
            <span
              className="whitespace-nowrap rounded-[var(--r-sm)] px-3 py-1.5 text-[13.5px]"
              style={{ border: "1px solid var(--line)", background: "var(--paper-dim)", color: "var(--ink)" }}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden className="px-2" style={{ color: "var(--ink-mute)" }}>
                &rarr;
              </span>
            )}
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
