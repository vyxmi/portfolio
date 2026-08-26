import type { BrainObject } from "@/lib/brain/types";
import { MediaThumb, VTitle, VBody } from "./parts";

const KIND_LABEL: Record<string, string> = {
  "spotify-library": "library",
  "spotify-library-playlists": "playlists",
  "spotify-playlist": "playlist",
  "spotify-playlist-series": "playlist series",
};

interface SeriesEntry {
  title: string;
  quarter: string | null;
  text: string;
}

// A "playlist series" object's content is an intro paragraph followed by
// one blank-line-separated block per playlist ("title - Q1 25\ndescription
// text"). VBody's own splitParagraphs breaks on every single "\n" — losing
// the blank-line grouping — and renders every resulting line as an
// identically-styled <p>, so an entry's "title - quarter" line reads no
// differently from its description. This groups by blank line instead and
// pulls the quarter out of the title so the two can be styled distinctly.
// Falls back to null (plain VBody rendering) for content that isn't
// shaped this way, e.g. B-0122's single-line-per-entry setlists.
function parseSeries(content?: string): { intro: string; entries: SeriesEntry[] } | null {
  if (!content) return null;
  const blocks = content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (blocks.length < 2) return null;

  const [intro, ...rest] = blocks;
  const entries = rest.map((block): SeriesEntry => {
    const [firstLine, ...restLines] = block.split("\n");
    const match = firstLine.match(/^(.*?)\s-\s(Q\d.*)$/i);
    return {
      title: (match ? match[1] : firstLine).trim(),
      quarter: match ? match[2].trim() : null,
      text: restLines.join(" ").trim(),
    };
  });
  return { intro, entries };
}

export default function SpotifyArtifact({ o }: { o: BrainObject }) {
  const kind = KIND_LABEL[o.renderOverride ?? ""] ?? "playlist";
  const series = o.renderOverride === "spotify-playlist-series" ? parseSeries(o.content) : null;

  return (
    <div className="spotify-card">
      {/* Cover + kind/title form one heading row (image and text vertically
          centered against each other) — the scrub bar and body text read
          full-width underneath, not squeezed into a narrow column beside a
          52px cover. */}
      <div className="spotify-top">
        {o.media && o.media.length > 0 && <MediaThumb o={o} className="spotify-cover" />}
        <div className="spotify-heading">
          <div className="spotify-kind">{kind}</div>
          <VTitle o={o} />
        </div>
      </div>
      <div className="spotify-body">
        <div className="spotify-scrub">
          <span className="spotify-fill" />
          <span className="spotify-knob" />
        </div>
        {series ? (
          <>
            <div className="v-body">
              <p>{series.intro}</p>
            </div>
            <div className="playlist-series-entries">
              {series.entries.map((entry) => (
                <div className="playlist-series-entry" key={entry.title}>
                  <div className="playlist-series-label">
                    <span className="playlist-series-title">{entry.title}</span>
                    {entry.quarter && <span className="playlist-series-quarter">{entry.quarter}</span>}
                  </div>
                  {entry.text && <p className="playlist-series-text">{entry.text}</p>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <VBody o={o} />
        )}
      </div>
    </div>
  );
}
