import ScrollReveal from "@/components/ScrollReveal";

export default function ResearchRatings({
  items,
}: {
  items: { label: string; question: string; rating: string }[];
}) {
  return (
    <ScrollReveal className="not-prose">
      <div className="case-box grid overflow-hidden md:grid-cols-3" style={{ background: "var(--paper-dim)" }}>
        {items.map((item, index) => (
          <div
            key={item.label}
            className="flex min-h-[220px] flex-col justify-between p-6"
            style={{ borderLeft: index > 0 ? "1px solid var(--line)" : undefined }}
          >
            <div>
              <div className="eyebrow mb-4">{item.label}</div>
              <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {item.question}
              </p>
            </div>
            <div className="mt-8">
              <span className="text-[38px] font-semibold leading-none" style={{ letterSpacing: "-.025em" }}>
                {item.rating}
              </span>
              <span className="cap ml-2">avg rating</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
