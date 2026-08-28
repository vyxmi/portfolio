import ScrollReveal from "@/components/ScrollReveal";

export default function SiteMetrics({
  items,
}: {
  items: { label: string; value: string; change?: string }[];
}) {
  return (
    <ScrollReveal className="not-prose">
      <div className="case-box grid overflow-hidden md:grid-cols-3" style={{ background: "var(--paper-dim)" }}>
        {items.map((item, index) => (
          <div
            key={item.label}
            className="flex min-h-[170px] flex-col justify-between p-6"
            style={{ borderLeft: index > 0 ? "1px solid var(--line)" : undefined }}
          >
            <div className="cap">{item.label}</div>
            <div className="mt-8 flex items-end gap-2">
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
