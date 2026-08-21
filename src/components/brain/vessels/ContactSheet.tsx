import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle } from "./parts";

export default function ContactSheet({ o }: { o: BrainObject }) {
  const count = o.media?.length || 5;
  return (
    <>
      <div className="contact-grid">
        {Array.from({ length: count }, (_, i) => (
          <div className="cell" key={i}>
            <MediaThumb o={o} index={i} />
            <span className="frame-no">{String(i + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
      {(o.title || o.content) && (
        <div className="contact-title">
          <VTitle o={o} />
          {o.content && <div className="contact-caption">{o.content}</div>}
        </div>
      )}
    </>
  );
}
