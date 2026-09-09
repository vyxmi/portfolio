import ScrollReveal from "@/components/ScrollReveal";

export default function SiteMetrics({
  label,
  items,
}: {
  label?: string;
  items: { label: string; value: string; change?: string }[];
}) {
  return (
    <ScrollReveal className="not-prose case-inline-evidence">
      {label && <div className="eyebrow mb-2 text-center">{label}</div>}
      <div className="case-site-metrics case-linear-grid grid overflow-hidden md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="case-linear-item flex flex-col justify-between p-6 md:min-h-[140px]"
            data-index={index}
          >
            <div className="cap">{item.label}</div>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-[38px] font-semibold leading-none" style={{ letterSpacing: "-.025em" }}>
                {item.value}
              </span>
              {item.change && (
                <span className="pb-0.5 text-[16px] font-medium" style={{ color: "var(--ink)" }}>
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
