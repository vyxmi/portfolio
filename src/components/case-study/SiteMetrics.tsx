import ScrollReveal from "@/components/ScrollReveal";

export default function SiteMetrics({
  label,
  items,
}: {
  label?: string;
  items: { label: string; value: string; change?: string }[];
}) {
  return (
    <ScrollReveal className="not-prose">
      {label && <div className="eyebrow mb-2 text-center">{label}</div>}
      <div className="case-box grid overflow-hidden md:grid-cols-3" style={{ background: "var(--paper-dim)" }}>
        {items.map((item, index) => (
          <div
            key={item.label}
            className="flex flex-col justify-between p-6 md:min-h-[140px]"
            style={{ borderLeft: index > 0 ? "1px solid var(--line)" : undefined }}
          >
            <div className="cap">{item.label}</div>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-[38px] font-semibold leading-none" style={{ letterSpacing: "-.025em" }}>
                {item.value}
              </span>
              {item.change && (
                <span className="pb-0.5 text-[16px] font-medium" style={{ color: "var(--accent)" }}>
                  {item.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
