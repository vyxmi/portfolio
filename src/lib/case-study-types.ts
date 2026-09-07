// Shared block grammar for every case study. Each project composes
// these in whatever order and density its real content calls for,
// nothing forces the same sequence twice.
export type Block =
  | { kind: "story"; eyebrow?: string; heading?: string; body?: string[]; items?: string[] }
  // The one card-styled title treatment on a case study page — reserved
  // for a real question the work was answering (almost always a "how
  // might we…"), never a punchy declarative. A non-question big line
  // belongs in "sectionHeading" instead.
  | { kind: "statement"; heading: string }
  | { kind: "insight"; eyebrow?: string; heading?: string; body: string[] }
  // A real numbered list from the source copy (she wrote "1. ... 2. ...
  // 3. ..." or "01. ... 02. ..."), each a full finding/insight rather
  // than a short bullet fragment — rendered with real numerals, not a
  // bullet dot. Only for lists that were actually numbered in her own
  // writing; a bullet fragment list stays "story"/items. An item can be
  // plain body text, or its own {heading, body} when the source gives
  // each point its own short bolded headline before the explanation.
  | { kind: "numberedInsights"; eyebrow?: string; heading?: string; items: (string | { heading: string; body: string })[] }
  | {
      kind: "researchRatings";
      label?: string;
      items: { label: string; question: string; rating: string }[];
    }
  | {
      kind: "siteMetrics";
      label?: string;
      items: { label: string; value: string; change?: string }[];
    }
  | { kind: "constraint"; eyebrow?: string; heading?: string; body: string[]; items?: string[] }
  | { kind: "validation"; eyebrow?: string; heading?: string; body?: string[]; items?: string[] }
  // A big declarative title, H2-scale — the non-question counterpart to
  // "statement". No card chrome; size alone carries the emphasis. Same
  // optional eyebrow every other section-level block gets, naming where
  // this sits in the process (e.g. "constraint", "context").
  | { kind: "sectionHeading"; eyebrow?: string; heading: string }
  // A single image only ever gets one caption, below it — fold any
  // "what kind of visual is this" context straight into `caption` rather
  // than a separate tag above (that's reserved for imagePair, where it
  // labels the pair as a set). `padded`: reveals the box's paper-dim
  // background as a mat around the image instead of running it
  // edge-to-edge — for a screenshot whose own text/content already runs
  // to its edges, so it doesn't look like it's touching the box border.
  | { kind: "image"; padded?: boolean; src: string; alt: string; caption: string; width: number; height: number; transparentMedia?: boolean }
  // `label`: a small eyebrow-style tag centered above the pair (e.g.
  // "before → after") — context for the set as a whole, since a pair
  // doesn't have one caption to fold it into the way a single image does.
  | {
      kind: "imagePair";
      label?: string;
      padded?: boolean;
      images: { src: string; alt: string; caption: string; width: number; height: number; transparentMedia?: boolean }[];
    }
  | { kind: "ratio"; before: string; beforeLabel: string; after: string; afterLabel: string; caption?: string }
  | {
      kind: "consolidation";
      from: string[];
      to: string;
      fromLabel?: string;
      toLabel?: string;
    }
  | { kind: "quote"; text: string; attribution?: string }
  | {
      kind: "video";
      src: string;
      caption?: string;
      // CSS aspect-ratio syntax for the reserved box before metadata loads
      // (e.g. "9/16" for a portrait phone screen recording) — the <video>
      // itself is responsive/intrinsic, this only avoids layout shift.
      aspect?: string;
      // Caps the rendered width so a portrait capture reads as a phone
      // clip rather than stretching to the full prose measure.
      maxWidth?: number;
    }
  | { kind: "youtube"; id: string; caption?: string }
  | { kind: "flowSteps"; label?: string; steps: string[] }
  | { kind: "flag"; text: string }
  | { kind: "cardStateInspector" }
  | { kind: "flowCompare" }
  // A funnel that narrows stage over stage (e.g. 100% entered → 25%
  // completed). Renders as scroll-animated bars, not a claim on its own —
  // every number here has to be real, pulled from the case study's copy.
  | { kind: "funnel"; label?: string; stages: { label: string; pct: number }[]; caption?: string }
  // One (or several, tabbed) named step sequence the reader advances one
  // step at a time — for when "it took 7 clicks" is more convincing felt
  // than read. Each step can carry its own annotation(s), shown only
  // while that step is current, for real in-the-moment notes ("why is
  // this hidden on hover?") rather than one paragraph dump. A flow marked
  // `hasImages` reserves a placeholder above the stepper for a real
  // screenshot/gif of the current step, swapped as the reader advances —
  // for flows whose steps are real UI states, not just named waypoints.
  | {
      kind: "clickThrough";
      flows: { label: string; hasImages?: boolean; steps: { label: string; note?: string[] }[] }[];
    }
  // Two labeled funnels (e.g. before/after a redesign) shown stacked,
  // each stage a real percentage of that group's own top stage. A
  // built-in toggle reveals the raw counts/date range behind the bars.
  | {
      kind: "funnelCompare";
      groups: { label: string; dateRange?: string; n?: string; stages: { label: string; pct: number }[] }[];
      caption?: string;
    }
  // Named options explored for the same problem, tab-switchable, each
  // marked as shipped or not — for a real design debate with more than
  // two sides, not just a before/after.
  | {
      kind: "prototypeCompare";
      tabs: { label: string; body: string[]; verdict: "shipped" | "lost"; why?: string[] }[];
    }
  // Two labeled bodies of text the reader toggles between, same chrome
  // as flowCompare/prototypeCompare — for a real before/after that's
  // prose, not steps or stats.
  | { kind: "textCompare"; tabs: { label: string; body: string[] }[] }
  // A collapsed-by-default aside — a tangent, a raw list of open
  // questions — that would otherwise break the main narrative's pace.
  | { kind: "expand"; label: string; body?: string[]; items?: string[] }
  // A sized, reserved placeholder for a real screenshot/recording that
  // hasn't been dropped in yet — renders the actual layout at roughly
  // the size the real desktop capture will be, instead of a text-only
  // flag, so the author can see the page's real shape before sending
  // assets. Swap for an "image"/"video" block once the real file exists.
  | { kind: "imagePlaceholder"; label: string; note: string; aspect?: string };

export type CaseStudyContent = {
  heroLine: string;
  // focus: CSS object-position for the cropped work-index thumbnail only —
  // the case study's own hero render is never cropped, so this has no
  // effect there. Defaults to "top" (right for most UI screenshots);
  // override for anything whose key content sits elsewhere, e.g. a title
  // card with vertically centered text.
  // Set explicitly by the CMS/content author for images whose source file
  // actually has a transparent background (checked against real pixel
  // alpha, not guessed at runtime) — the image container then renders
  // without its usual paper fill/border so the transparency reads as
  // intentional instead of showing a boxed-in card.
  heroImage?: { src: string; alt: string; width: number; height: number; focus?: string; transparentMedia?: boolean };
  blocks: Block[];
};
