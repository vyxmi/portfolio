// The homepage constellation's spatial data: which brain objects appear,
// where, and how they connect. Everything here reads live from
// `brainObjects` (via HOME_LAYOUT[i].id) — this file never duplicates an
// object's content, only where it sits and what it's wired to.
//
// Positions are fractions (0..1) of the canvas's own width/height, not
// pixels — the canvas measures itself (ResizeObserver) and converts at
// render time, so the whole layout scales with the container instead of
// being pinned to one reference viewport. Authored by eye against the
// reference mock, not computed — see HomeBrainCanvas for how they're
// consumed. "Intentional but flexible" per spec: nudge freely.
export interface HomeNode {
  id: string;
  x: number;
  y: number;
  /** Per-node override on top of HomeBrainCanvas's DEFAULT_SCALE — omit to use the default. Set by hand via /?edit=1's "copy layout" output, not authored by eye. */
  scale?: number;
}

// Base scale for every node that doesn't set its own — see HomeNode.scale
// and HomeBrainCanvas's edit mode (visit /?edit=1 to drag/resize objects
// directly and copy the resulting values back into HOME_LAYOUT below).
export const HOME_DEFAULT_SCALE = 0.45;

// Positions/scales below are the /?edit=1 tool's own output (dragged and
// resized by hand against the real render), not eyeballed against a
// reference image — this is the source of truth going forward. Nudge
// further the same way: /?edit=1 → drag/resize → copy layout → paste here.
export const HOME_LAYOUT: HomeNode[] = [
  { id: "B-0085", x: 0.412, y: 0.196, scale: 0.98 },
  { id: "B-0068", x: 0.693, y: 0.075, scale: 0.93 },
  { id: "B-0059", x: 0.904, y: 0.285, scale: 0.7 },
  { id: "B-0092", x: 0.595, y: 0.212, scale: 0.2 },
  { id: "B-0136", x: 0.908, y: 0.112, scale: 0.85 },
  { id: "B-0008", x: 0.559, y: 0.669, scale: 0.19 },
  { id: "B-0172", x: 0.832, y: 0.178 },
  { id: "B-0026", x: 0.588, y: 0.43, scale: 0.28 },
  // Dogseesgod EP film strip — dragged in at 1.30 (the resize handle's max)
  // during the edit pass, then flagged as too big on review, capped down to
  // 0.55. Bumped back up to that same 1.30 max on request; a smaller
  // footprint means a smaller container, since the container is exactly
  // this scale applied to the vessel's own size — see
  // HomeBrainCanvas/home-brain.css, there's no separate "container size" to
  // tune apart from this number.
  { id: "B-0011", x: 0.899, y: 0.44, scale: 1.3 },
  { id: "B-0123", x: 0.744, y: 0.337, scale: 0.7 },
  { id: "B-0014", x: 0.622, y: 0.859 },
  { id: "B-0119", x: 0.818, y: 0.573, scale: 1.35 },
  { id: "B-0171", x: 0.879, y: 0.709, scale: 0.75 },
];

// [from, to] pairs. Directionless visually (a line, not an arrow) — order
// only matters for readability here and for which node "owns" the pair
// when computing nearest-edge anchors (see HomeBrainCanvas).
export const HOME_CONNECTIONS: [string, string][] = [
  ["B-0123", "B-0068"],
  ["B-0123", "B-0026"],
  ["B-0123", "B-0011"],
  ["B-0123", "B-0008"],
  ["B-0123", "B-0171"],
  ["B-0123", "B-0119"],
  ["B-0123", "B-0059"],
  ["B-0171", "B-0119"],
  ["B-0171", "B-0014"],
  ["B-0068", "B-0092"],
  ["B-0172", "B-0136"],
  ["B-0172", "B-0011"],
  ["B-0172", "B-0123"],
];

// The only nodes visible before any hover: the shelf (hub of the graph),
// the original-thought note, and the "real artists ship" rule. Everything
// else starts hidden (not deleted — see HomeBrainCanvas) and is revealed by
// hovering along a connection from one of these, or from whatever that
// reveals in turn.
export const HOME_DEFAULT_VISIBLE: string[] = ["B-0123", "B-0085", "B-0068"];

// Mobile reading order — left-to-right scroll order, not a z-index/DOM
// stacking concern. B-0085 first per spec; the rest follow roughly the
// same connection-cluster grouping as desktop so a left-to-right scroll
// still reads as "through" the graph rather than a random shuffle.
export const HOME_MOBILE_ORDER: string[] = [
  "B-0085",
  "B-0068",
  "B-0092",
  "B-0059",
  "B-0008",
  "B-0026",
  "B-0123",
  "B-0172",
  "B-0136",
  "B-0011",
  "B-0014",
  "B-0171",
  "B-0119",
];
