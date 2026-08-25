import { createRng } from "./rng";
import { buildTemplateCells, TEMPLATE_ROW_ASPECT } from "./template";

// The shared data contract every particle group produces, regardless of
// where its target shape comes from (flower silhouette, an atmospheric
// depth plane, or — later — sampled text/vessel geometry). ParticlePoints
// renders any group matching this shape through the one shared shader, so
// adding a new kind of group is "write a builder that fills this," not
// "write a new shader."
export interface ParticleGroupGeometry {
  /** Target shape position, world units (attribute "position"). Ignored when the group doesn't morph. */
  target: Float32Array;
  /** Rest/scatter position: xy normalized [-1,1] (rescaled live against the viewport), z = depth variance. */
  base: Float32Array;
  /** x=bloom stagger (0..1), y=color-mix seed, z=reserved, w=drift phase. */
  random: Float32Array;
  /** x=extra per-particle phase offset (folded into the drift/hover noise functions for variety), y=drift speed multiplier. */
  motion: Float32Array;
  size: Float32Array;
  /** Static per-particle base alpha — never driven by entrance/transition progress. */
  opacity: Float32Array;
  /** Multiplier on cursor-proximity hover displacement strength (each particle's own interaction response). */
  interactionMul: Float32Array;
  /** Per-particle multiplier on idle-drift amplitude (organicDrift + secondaryDrift) — see shaders.ts. Independent of drift *speed* (aMotion.y): this varies how far a particle wanders, not how fast. */
  driftAmp: Float32Array;
  count: number;
}

function fillDefaults(count: number, geo: Partial<ParticleGroupGeometry>): ParticleGroupGeometry {
  return {
    target: geo.target ?? new Float32Array(count * 3),
    base: geo.base ?? new Float32Array(count * 3),
    random: geo.random ?? new Float32Array(count * 4),
    motion: geo.motion ?? new Float32Array(count * 2),
    size: geo.size ?? new Float32Array(count),
    opacity: geo.opacity ?? new Float32Array(count),
    interactionMul: geo.interactionMul ?? new Float32Array(count),
    driftAmp: geo.driftAmp ?? new Float32Array(count),
    count,
  };
}

export interface FlowerParticleGroup extends ParticleGroupGeometry {
  outerRadius: number;
}

// Samples `particleCount` points off the braille flower template (weighted
// by each glyph's dot density, so fuller strokes draw more particles than
// thin outline ones), centers the cloud on the flower head rather than the
// raw grid center (the stem trails off-center otherwise), and derives a
// bloom-order stagger directly from each point's source row — replicating
// the ground-up growth of the 2D AsciiFlower companion piece so the two
// read as the same flower, not two different animations. The stagger only
// ever delays *when* a particle starts moving toward its target, never its
// visibility — every particle is opaque and at full size from frame one,
// already sitting at its `base` (scattered-across-the-viewport) position.
export function buildFlowerGeometry(opts: {
  seed: string | number;
  particleCount: number;
  petalCount: number;
}): FlowerParticleGroup {
  const { seed, particleCount, petalCount } = opts;
  const rng = createRng(seed);
  const { cells, cols, rows } = buildTemplateCells();

  const colsCenter = (cols - 1) / 2;
  const rowsCenter = (rows - 1) / 2;
  const cellSize = 2.6 / Math.max(cols, rows * TEMPLATE_ROW_ASPECT);

  const headRowCutoff = rows * 0.72;
  let headColSum = 0;
  let headRowSum = 0;
  let headCount = 0;
  for (const c of cells) {
    if (c.row <= headRowCutoff) {
      headColSum += c.col;
      headRowSum += c.row;
      headCount++;
    }
  }
  const headCol = headCount ? headColSum / headCount : colsCenter;
  const headRow = headCount ? headRowSum / headCount : rowsCenter;
  const headX = (headCol - colsCenter) * cellSize;
  const headY = (rowsCenter - headRow) * TEMPLATE_ROW_ASPECT * cellSize;

  let headRadius = 0.001;
  for (const c of cells) {
    if (c.row > headRowCutoff) continue;
    const x = (c.col - colsCenter) * cellSize - headX;
    const y = (rowsCenter - c.row) * TEMPLATE_ROW_ASPECT * cellSize - headY;
    const d = Math.hypot(x, y);
    if (d > headRadius) headRadius = d;
  }

  // weighted CDF over template cells (braille dot-density)
  const weights = cells.map((c) => c.weight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const cdf = new Float32Array(cells.length);
  let acc = 0;
  for (let i = 0; i < cells.length; i++) {
    acc += weights[i] / totalWeight;
    cdf[i] = acc;
  }
  function sampleCellIndex(): number {
    const r = rng();
    let lo = 0;
    let hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  const ripplePhase = rng() * Math.PI * 2;
  const geo = fillDefaults(particleCount, {});

  for (let i = 0; i < particleCount; i++) {
    const cell = cells[sampleCellIndex()];
    const isHead = cell.row <= headRowCutoff;

    const jx = (rng() - 0.5) * 0.92;
    const jy = (rng() - 0.5) * 0.92;
    const x = (cell.col + jx - colsCenter) * cellSize - headX;
    const y = (rowsCenter - (cell.row + jy)) * TEMPLATE_ROW_ASPECT * cellSize - headY;

    let z = (rng() - 0.5) * 0.02;
    if (isHead) {
      const distFromHead = Math.hypot(x, y);
      const dome = 0.16 * Math.exp(-Math.pow(distFromHead / (headRadius * 0.85), 2) * 1.4);
      const angle = Math.atan2(y, x);
      const ripple =
        0.045 * Math.cos(angle * petalCount + ripplePhase) * Math.exp(-Math.pow(distFromHead / headRadius, 2));
      z += dome + ripple;
    } else {
      z -= 0.05; // stem recedes slightly behind the bloom
    }

    const i3 = i * 3;
    geo.target[i3] = x;
    geo.target[i3 + 1] = y;
    geo.target[i3 + 2] = z;

    // Uniform scatter across [-1,1]^2 — rescaled by the live viewport
    // half-extent at draw time, so "dispersed" always means "across the
    // whole visible canvas," not a fixed world-space patch.
    geo.base[i3] = (rng() - 0.5) * 2;
    geo.base[i3 + 1] = (rng() - 0.5) * 2;
    geo.base[i3 + 2] = (rng() - 0.5) * 0.7;

    // ground-up bloom order, matching AsciiFlower: bottom rows (stem end)
    // start moving first, top rows (petals) last — plus a little jitter so
    // the wavefront isn't a perfectly straight, mechanical line. Reused
    // symmetrically for the reverse (formed -> dispersed) transition.
    const rowStagger = (rows - 1 - (cell.row + jy)) / (rows - 1);
    const stagger = Math.min(1, Math.max(0, rowStagger * 0.82 + rng() * 0.18));

    const i4 = i * 4;
    geo.random[i4] = stagger;
    geo.random[i4 + 1] = rng();
    geo.random[i4 + 2] = rng();
    geo.random[i4 + 3] = rng() * Math.PI * 2;

    const i2 = i * 2;
    geo.motion[i2] = (rng() - 0.5) * 2; // extra phase offset
    geo.motion[i2 + 1] = 0.6 + rng() * 0.8; // drift speed

    geo.size[i] = (0.55 + rng() * 0.9) * (0.75 + 0.35 * (cell.weight / 8));
    geo.opacity[i] = 0.55 + rng() * 0.45;
    geo.interactionMul[i] = 0.85 + rng() * 0.3;
    geo.driftAmp[i] = 0.7 + rng() * 0.6;
  }

  return { ...geo, outerRadius: headRadius };
}

export interface DepthPlaneConfig {
  /** Relative share of the group's total particle count. */
  weight: number;
  z: [number, number];
  size: [number, number];
  opacity: [number, number];
  /** Drift speed multiplier — how fast this plane's noise phase evolves. */
  speed: [number, number];
  /** Cursor-proximity hover displacement strength multiplier. */
  interaction: [number, number];
}

function randRange(rng: () => number, [lo, hi]: [number, number]) {
  return lo + rng() * (hi - lo);
}

// Seeded soft cluster centers particles can be pulled toward, so the field
// reads as small, irregular clumps of atmosphere mixed among independently
// scattered particles rather than either a uniform dust or a few oversized
// blobs. Clusters only ever bias where a particle's anchor is placed at
// build time — every particle still moves entirely independently at
// runtime (see shaders.ts), so members of the same cluster share a
// neighborhood, never a movement transform.
const CLUSTER_FRACTION = 0.35;
const CLUSTER_MIN_SIZE = 4;
const CLUSTER_MAX_SIZE = 12;
const CLUSTER_SPREAD = 0.22;
// Radius exponent for non-clustered draws. Sampling a disc via polar angle
// + pow(rng(), 0.5)*R gives uniform density per unit area (the "unbiased"
// disc baseline); an exponent above 0.5 concentrates more draws at small
// radii than that baseline, biasing overall density broadly toward the
// flower (still full-field, not a hard cluster, and never a halo/ring).
const CENTER_BIAS_EXPONENT = 1.15;
const SCATTER_RADIUS = 1.3;

// A depth-plane-driven atmospheric (free) group: no target shape (it never
// morphs — see ParticlePoints' morph flag), just a scattered anchor and
// per-particle attributes drawn from whichever plane it was assigned to.
// Every plane shares the exact same drift/hover machinery as
// flowerParticles (see the shared vertex shader) — only the per-particle
// numbers (and how densely anchors cluster) differ, never the motion logic.
export function buildDepthPlaneGeometry(opts: {
  seed: string | number;
  particleCount: number;
  planes: DepthPlaneConfig[];
}): ParticleGroupGeometry {
  const { seed, particleCount, planes } = opts;
  const rng = createRng(`${seed}:ambient`);
  const geo = fillDefaults(particleCount, {});

  const totalWeight = planes.reduce((a, p) => a + p.weight, 0);
  let cursor = 0;
  const planeBounds = planes.map((p) => {
    cursor += (p.weight / totalWeight) * particleCount;
    return { plane: p, end: cursor };
  });

  // A running queue of small cluster slots, opened on demand as clustered
  // particles consume capacity — each cluster gets its own random 4-12
  // member count and its own center (sampled with the same center-biased
  // distribution as the independent scatter below, so clusters lean broadly
  // toward the flower too, never forming a separate halo/ring of their own).
  let activeCluster: { x: number; y: number; capacity: number; filled: number } | null = null;
  function nextClusterAnchor() {
    if (!activeCluster || activeCluster.filled >= activeCluster.capacity) {
      const angle = rng() * Math.PI * 2;
      const radius = Math.pow(rng(), CENTER_BIAS_EXPONENT) * SCATTER_RADIUS;
      activeCluster = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        capacity: CLUSTER_MIN_SIZE + Math.floor(rng() * (CLUSTER_MAX_SIZE - CLUSTER_MIN_SIZE + 1)),
        filled: 0,
      };
    }
    activeCluster.filled++;
    const angle = rng() * Math.PI * 2;
    const spread = rng() * CLUSTER_SPREAD;
    return { x: activeCluster.x + Math.cos(angle) * spread, y: activeCluster.y + Math.sin(angle) * spread };
  }

  for (let i = 0; i < particleCount; i++) {
    const plane = (planeBounds.find((b) => i < b.end) ?? planeBounds[planeBounds.length - 1]).plane;

    let x = 0;
    let y = 0;

    if (rng() < CLUSTER_FRACTION) {
      const anchor = nextClusterAnchor();
      x = anchor.x;
      y = anchor.y;
    } else {
      for (let attempt = 0; attempt < 6; attempt++) {
        const angle = rng() * Math.PI * 2;
        const radius = Math.pow(rng(), CENTER_BIAS_EXPONENT) * SCATTER_RADIUS;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        if (Math.hypot(x, y) > 0.16) break;
      }
    }

    const i3 = i * 3;
    geo.base[i3] = x;
    geo.base[i3 + 1] = y;
    geo.base[i3 + 2] = randRange(rng, plane.z);
    // target left at (0,0,0) — never read: this group's morph is off, so
    // ParticlePoints' mix(base, target, 0) always collapses to base.

    const i4 = i * 4;
    geo.random[i4] = 0; // no stagger — nothing to sequence, it never moves toward a shape
    geo.random[i4 + 1] = rng();
    geo.random[i4 + 2] = rng();
    geo.random[i4 + 3] = rng() * Math.PI * 2;

    const i2 = i * 2;
    geo.motion[i2] = (rng() - 0.5) * 2; // extra phase offset
    geo.motion[i2 + 1] = randRange(rng, plane.speed);

    geo.size[i] = randRange(rng, plane.size);
    geo.opacity[i] = randRange(rng, plane.opacity);
    geo.interactionMul[i] = randRange(rng, plane.interaction);
    geo.driftAmp[i] = 0.65 + rng() * 0.7;
  }

  return geo;
}
