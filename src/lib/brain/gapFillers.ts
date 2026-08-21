// Finds genuine leftover space at the ragged bottom of the masonry wall's
// columns and turns it into randomized filler shapes — read-only against
// layout (only ever measures offsetTop/offsetLeft/offsetWidth/offsetHeight,
// never writes a style back), so this can never widen a gap or nudge a
// card. Worst case a real gap goes undetected; it never invents one.

export interface GapRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface BlobSpec {
  id: string;
  left: number;
  top: number;
  size: number;
  tone: number; // 0..1, periwinkle <-> grey mix
  opacity: number;
  radius: string; // organic border-radius, 8 randomized percentages
  rotation: number;
  driftX: number;
  driftY: number;
  driftPhase: number;
}

const MIN_GAP_HEIGHT = 90; // px — smaller than this isn't worth filling

// Column-based ragged-bottom detection: track how far each column's
// content actually reaches, then anything between that and the tallest
// column is fair game. This is the dominant, visually obvious gap shape
// in a non-dense masonry (see BrainWall's own comment on why flow stays
// non-dense) — mid-wall holes from a skipped cell are rarer and out of
// scope here; undercounting gaps is safe, see the note above.
export function computeColumnGaps(wallEl: HTMLElement): GapRect[] {
  const cs = getComputedStyle(wallEl);
  const rowGap = parseFloat(cs.rowGap) || 0;
  const colGap = parseFloat(cs.columnGap) || 0;

  // Real per-column widths, not an assumed equal split of 1fr — a grid
  // item's default min-width:auto can force the column holding the wall's
  // widest content (a display-case object, a stretched featured card) to
  // grow past its "fair" 1fr share, so tracks routinely aren't equal in
  // practice. Reading the browser's own resolved track list is the only
  // way to place gaps at their real column edges instead of drifting off
  // by however far that column's content pushed it.
  const trackWidths = cs.gridTemplateColumns.split(" ").filter(Boolean).map((v) => parseFloat(v));
  const colCount = trackWidths.length;
  if (colCount === 0 || trackWidths.some((w) => !(w > 0))) return [];

  const colLeft: number[] = [];
  let acc = 0;
  for (let i = 0; i < colCount; i++) {
    colLeft.push(acc);
    acc += trackWidths[i] + colGap;
  }

  function placement(left: number, width: number): { start: number; span: number } {
    let start = 0;
    let best = Infinity;
    for (let i = 0; i < colCount; i++) {
      const d = Math.abs(colLeft[i] - left);
      if (d < best) {
        best = d;
        start = i;
      }
    }
    const right = left + width;
    let span = 1;
    for (let i = start + 1; i < colCount; i++) {
      if (colLeft[i] < right - 4) span = i - start + 1;
    }
    return { start, span };
  }

  const cards = Array.from(wallEl.querySelectorAll<HTMLElement>(":scope > .brain-card"));
  if (!cards.length) return [];

  const colBottom = new Array(colCount).fill(0);
  let wallBottom = 0;

  for (const card of cards) {
    const top = card.offsetTop;
    const bottom = top + card.offsetHeight;
    const { start, span } = placement(card.offsetLeft, card.offsetWidth);
    for (let c = start; c < Math.min(colCount, start + span); c++) {
      colBottom[c] = Math.max(colBottom[c], bottom);
    }
    wallBottom = Math.max(wallBottom, bottom);
  }

  const gaps: GapRect[] = [];
  for (let c = 0; c < colCount; c++) {
    const height = wallBottom - colBottom[c] - rowGap;
    if (height >= MIN_GAP_HEIGHT) {
      gaps.push({ left: colLeft[c], top: colBottom[c] + rowGap, width: trackWidths[c], height });
    }
  }
  return gaps;
}

// Deterministic PRNG (mulberry32) seeded per gap so blobs stay put across
// re-renders with the same layout instead of reshuffling every recompute.
function mulberry32(seed: number) {
  let a = seed >>> 0 || 1;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function organicRadius(rand: () => number): string {
  const v = () => `${34 + Math.round(rand() * 34)}%`;
  return `${v()} ${v()} ${v()} ${v()} / ${v()} ${v()} ${v()} ${v()}`;
}

// Loose fit, not a tight one: sizes and offsets are randomized within (and
// a little past) each column's own gap band, so blobs read as scattered
// organic objects rather than a single shape stamped into a rectangle. A
// slight overshoot past the gap's own bounds is intentional — see the
// caller's "slight overlaps are fine" brief.
export function blobsFromGaps(gaps: GapRect[]): BlobSpec[] {
  const specs: BlobSpec[] = [];
  gaps.forEach((gap, gi) => {
    const rand = mulberry32(hash(`gap-${gi}-${Math.round(gap.left)}-${Math.round(gap.top)}-${Math.round(gap.height)}`));
    const count = gap.height > 460 ? 3 : gap.height > 230 ? 2 : 1;
    const band = gap.height / count;
    for (let i = 0; i < count; i++) {
      const size = gap.width * (0.3 + rand() * 0.42);
      const bandTop = gap.top + band * i;
      const top = Math.min(bandTop + rand() * Math.max(0, band - size * 0.55), gap.top + gap.height - size * 0.6);
      const left = gap.left - size * 0.08 + rand() * Math.max(0, gap.width - size * 0.85);
      specs.push({
        id: `blob-${gi}-${i}`,
        left,
        top,
        size,
        tone: rand(),
        opacity: 0.4 + rand() * 0.4,
        radius: organicRadius(rand),
        rotation: (rand() - 0.5) * 50,
        driftX: 5 + rand() * 13,
        driftY: 5 + rand() * 13,
        driftPhase: rand() * 100,
      });
    }
  });
  return specs;
}
