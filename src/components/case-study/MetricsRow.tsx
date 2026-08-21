import type { Metric } from "@/lib/projects";

// The one place a case study's headline numbers live. Structure carries
// the emphasis here, not color: a bordered chip and a bold value read as
// "this is a result" without needing a saturated accent to say so.
export default function MetricsRow({ metrics, className = "" }: { metrics: Metric[]; className?: string }) {
  if (!metrics.length) return null;
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex flex-col gap-1 px-4 py-3 transition-colors duration-200 hover:bg-[var(--paper-dim)]"
          style={{ border: "1px solid var(--line)" }}
        >
          <span
            className="font-mono text-[19px] font-medium leading-none md:text-[21px]"
            style={{ letterSpacing: "-.01em", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}
          >
            {m.value}
          </span>
          <span className="cap">{m.label}</span>
        </div>
      ))}
    </div>
  );
}
