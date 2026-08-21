// Shared block grammar for every case study. Each project composes
// these in whatever order and density its real content calls for,
// nothing forces the same sequence twice.
export type Block =
  | { kind: "story"; eyebrow?: string; heading?: string; body?: string[]; items?: string[] }
  | { kind: "statement"; heading: string }
  | { kind: "insight"; eyebrow?: string; heading?: string; body: string[] }
  | { kind: "constraint"; eyebrow?: string; heading?: string; body: string[]; items?: string[] }
  | { kind: "validation"; eyebrow?: string; heading?: string; body?: string[]; items?: string[] }
  | { kind: "image"; src: string; alt: string; caption: string; width: number; height: number }
  | { kind: "imagePair"; images: { src: string; alt: string; caption: string; width: number; height: number }[] }
  | { kind: "ratio"; before: string; beforeLabel: string; after: string; afterLabel: string; caption?: string }
  | {
      kind: "consolidation";
      from: string[];
      to: string;
      fromLabel?: string;
      toLabel?: string;
    }
  | { kind: "quote"; text: string; attribution?: string }
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
  heroImage?: { src: string; alt: string; width: number; height: number; focus?: string };
  blocks: Block[];
};
