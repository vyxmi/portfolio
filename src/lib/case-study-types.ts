// Shared block grammar for every case study. Each project composes
// these in whatever order and density its real content calls for,
// nothing forces the same sequence twice.
export type Block =
  | { kind: "story"; eyebrow?: string; heading?: string; body?: string[]; items?: string[] }
  | { kind: "statement"; heading: string }
  | { kind: "insight"; eyebrow?: string; heading?: string; body: string[] }
  | { kind: "constraint"; eyebrow?: string; heading?: string; body: string[]; items?: string[] }
  | { kind: "validation"; eyebrow?: string; heading?: string; body?: string[]; items?: string[] }
  | { kind: "image"; src: string; alt: string; caption: string; width: number; height: number; transparentMedia?: boolean }
  | {
      kind: "imagePair";
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
  | { kind: "flowCompare" };

export type CaseStudyContent = {
  heroLine: string;
  facts: { label: string; value: string }[];
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
