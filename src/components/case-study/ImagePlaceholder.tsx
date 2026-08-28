// A reserved, sized box standing in for a real screenshot/recording that
// hasn't been dropped in yet — so the page's real layout and rhythm are
// visible before assets exist, instead of a gap where a Flag used to be.
// Swap the block for a real "image"/"video" kind once the file exists.
export default function ImagePlaceholder({ label, note, aspect = "16/10" }: { label: string; note: string; aspect?: string }) {
  return (
    <div className="not-prose">
      <div
        className="case-box relative flex w-full items-center justify-center p-6 text-center"
        style={{
          aspectRatio: aspect,
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--paper-dim), var(--paper-dim) 10px, var(--paper) 10px, var(--paper) 20px)",
        }}
      >
        <div className="max-w-xs">
          <div className="cap mb-2" style={{ color: "var(--accent)" }}>
            {label}
          </div>
          <div className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-mute)" }}>
            {note}
          </div>
        </div>
      </div>
    </div>
  );
}
