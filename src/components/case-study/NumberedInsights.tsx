import ScrollReveal from "@/components/ScrollReveal";

type Item = string | { heading: string; body: string };

// A real numbered list from the source copy — she wrote "1. ... 2. ...
// 3. ..." or "01. ... 02. ...", each a full finding, not a short bullet
// fragment. Real numerals instead of a bullet dot carry that: these are
// discrete, ordered points worth counting, not an unordered scan list.
// An item can be plain body text, or carry its own short headline when
// the source gives each point a bolded lead-in before the explanation.
export default function NumberedInsights({ eyebrow, heading, items }: { eyebrow?: string; heading?: string; items: Item[] }) {
  return (
    <ScrollReveal className="not-prose">
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      {heading && (
        <p className="mb-4 text-[22px] font-semibold leading-snug md:text-[25px]" style={{ letterSpacing: "-.008em" }}>
          {heading}
        </p>
      )}
      <div className="measure flex flex-col gap-5">
        {items.map((item, i) => {
          const isRich = typeof item !== "string";
          return (
            <div key={i} className="flex gap-4">
              <span
                className="flex-none font-mono text-[13px] font-medium tabular-nums"
                style={{ color: "var(--accent)", paddingTop: 2 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                {isRich && (
                  <p className="mb-1 text-[15.5px] font-semibold leading-snug" style={{ color: "var(--ink)" }}>
                    {item.heading}
                  </p>
                )}
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {isRich ? item.body : item}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollReveal>
  );
}
