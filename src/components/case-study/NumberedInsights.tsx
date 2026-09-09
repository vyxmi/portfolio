import ScrollReveal from "@/components/ScrollReveal";
import Magnet from "@/components/fridge/Magnet";

type Item = string | { heading: string; body: string };

// A real numbered list from the source copy — she wrote "1. ... 2. ...
// 3. ..." or "01. ... 02. ...", each a full finding, not a short bullet
// fragment. Real numerals instead of a bullet dot carry that: these are
// discrete, ordered points worth counting, not an unordered scan list.
// An item can be plain body text, or carry its own short headline when
// the source gives each point a bolded lead-in before the explanation.
export default function NumberedInsights({ eyebrow, heading, startAt = 1, items }: { eyebrow?: string; heading?: string; startAt?: number; items: Item[] }) {
  return (
    <ScrollReveal className="not-prose numbered-insights">
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      {heading && (
        <p className="mb-4 text-[22px] font-semibold leading-snug md:text-[25px]" style={{ letterSpacing: "-.008em" }}>
          {heading}
        </p>
      )}
      <div className="numbered-insights-list measure flex flex-col gap-5">
        {items.map((item, i) => {
          const isRich = typeof item !== "string";
          return (
            <div key={i} className="numbered-insight-row">
              <Magnet
                className="fm-inline-magnet flex-none font-mono text-[13px] font-medium tabular-nums"
                rotation={[-1.5, 1, -.5][(startAt + i - 1) % 3]}
              >
                {startAt + i}
              </Magnet>
              <div>
                {isRich && (
                  <p className="numbered-insight-title mb-1 font-semibold">
                    {item.heading}
                  </p>
                )}
                <p className="numbered-insight-body">
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
