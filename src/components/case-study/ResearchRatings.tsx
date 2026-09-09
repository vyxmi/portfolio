import ScrollReveal from "@/components/ScrollReveal";

export default function ResearchRatings({
  label,
  items,
}: {
  label?: string;
  items: { label: string; question: string; rating: string }[];
}) {
  return (
    <ScrollReveal className="not-prose case-inline-evidence">
      {label && <div className="eyebrow mb-2 text-center">{label}</div>}
      <div className="case-ratings case-linear-grid grid overflow-hidden md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="case-linear-item flex flex-col justify-between p-6 md:min-h-[220px]"
            data-index={index}
          >
            <div>
              <div className="eyebrow mb-3">{item.label}</div>
              <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {item.question}
              </p>
            </div>
            <div className="mt-5">
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
