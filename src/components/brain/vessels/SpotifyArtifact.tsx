import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle, VBody } from "./parts";

const KIND_LABEL: Record<string, string> = {
  "spotify-library": "library",
  "spotify-library-playlists": "playlists",
  "spotify-playlist": "playlist",
  "spotify-playlist-series": "playlist series",
};

export default function SpotifyArtifact({ o }: { o: BrainObject }) {
  const kind = KIND_LABEL[o.renderOverride ?? ""] ?? "playlist";
  return (
    <div className="spotify-row">
      {o.media && o.media.length > 0 && <MediaThumb o={o} className="spotify-cover" />}
      <div className="spotify-info">
        <div className="spotify-kind">{kind}</div>
        <VTitle o={o} />
        <div className="spotify-scrub">
          <span className="spotify-fill" />
          <span className="spotify-knob" />
        </div>
        <VBody o={o} />
      </div>
    </div>
  );
}
