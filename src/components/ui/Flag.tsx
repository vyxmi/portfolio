// Visible marker for anything uncertain, missing, or needing a decision
// from Vyomi. Never used to silently fix or invent copy, only to point
// at it. Renders quietly on the live page, ugly enough to be noticed,
// not decorative.
export default function Flag({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="my-4 flex gap-2 px-3 py-2 text-[12.5px] leading-relaxed"
      style={{ background: "#FFF6E5", border: "1px solid #F0D9A6", color: "#7A5A17" }}
    >
      <span className="font-semibold">[FLAG]</span>
      <span>{children}</span>
    </div>
  );
}
