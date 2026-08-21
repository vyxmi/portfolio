import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle, VBody } from "./parts";

export default function FilmStrip({ o }: { o: BrainObject }) {
  const count = o.media?.length || 3;
  return (
    <>
      <div className="sprockets" aria-hidden />
      <div className="filmstrip-frames">
        {Array.from({ length: count }, (_, i) => (
          <div className="frame" key={i}>
            <MediaThumb o={o} index={i} />
          </div>
        ))}
      </div>
      <div className="sprockets" aria-hidden />
      {(o.title || o.content) && (
        <div className="filmstrip-title">
          <VTitle o={o} />
          <VBody o={o} className="filmstrip-caption" />
        </div>
      )}
    </>
  );
}
