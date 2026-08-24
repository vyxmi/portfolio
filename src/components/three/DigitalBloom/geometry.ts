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
  /** x=tangential bulge amount (shape entrance only), y=drift speed multiplier. */
  motion: Float32Array;
  size: Float32Array;
  /** Static per-particle base alpha — never driven by entrance/transition progress. */
  opacity: Float32Array;
  /** Multiplier on cursor-driven turbulence/advection strength. */
  interactionMul: Float32Array;
  /** Multiplier on the constant (non-falloff) pointer-parallax offset. */
  parallax: Float32Array;
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
    parallax: geo.parallax ?? new Float32Array(count),
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
    geo.motion[i2] = (rng() - 0.5) * 2; // bulge
    geo.motion[i2 + 1] = 0.6 + rng() * 0.8; // drift speed

    geo.size[i] = (0.55 + rng() * 0.9) * (0.75 + 0.35 * (cell.weight / 8));
    geo.opacity[i] = 0.55 + rng() * 0.45;
    geo.interactionMul[i] = 0.85 + rng() * 0.3;
    geo.parallax[i] = 0; // the flower silhouette never shifts with the cursor — no whole-object transform
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
  /** Cursor turbulence/advection strength multiplier. */
  interaction: [number, number];
  /** Constant (non-falloff) pointer-parallax multiplier. */
  parallax: [number, number];
}

function randRange(rng: () => number, [lo, hi]: [number, number]) {
  return lo + rng() * (hi - lo);
}

// alive preset only: a handful of seeded soft cluster centers particles
// can be pulled toward, so the field reads as loose clumps of atmosphere
// rather than independently-scattered dust. Touches anchor (x/y) generation
// only — z/size/opacity/speed/interaction/parallax generation below is
// identical regardless of preset, and flower anchor/target generation
// (buildFlowerGeometry) is untouched entirely.
const ALIVE_CLUSTER_COUNT = 5;
const ALIVE_CLUSTER_FRACTION = 0.35;
const ALIVE_CLUSTER_SPREAD = 0.22;
// Radius exponent for alive's non-clustered draws. Sampling a disc via
// polar angle + pow(rng(), 0.5)*R gives uniform density per unit area (the
// "unbiased" disc baseline); an exponent above 0.5 concentrates more draws
// at small radii than that baseline, biasing overall density broadly
// toward the flower (still full-field, not a hard cluster) — legacy's own
// exclusion-disc rejection loop (the else branch below) is untouched.
const ALIVE_CENTER_BIAS_EXPONENT = 1.15;
const ALIVE_SCATTER_RADIUS = 1.3;

// A depth-plane-driven atmospheric group: no target shape (it never
// morphs — see ParticlePoints' morph flag), just a scattered rest position
// and per-particle attributes drawn from whichever plane it was assigned
// to. Every plane shares the exact same drift/interaction machinery as
// flowerParticles (see the shared vertex shader) — only the per-particle
// numbers differ, never the animation logic.
export function buildDepthPlaneGeometry(opts: {
  seed: string | number;
  particleCount: number;
  planes: DepthPlaneConfig[];
  motionPreset?: "legacy" | "alive";
}): ParticleGroupGeometry {
  const { seed, particleCount, planes, motionPreset = "legacy" } = opts;
  const rng = createRng(`${seed}:ambient`);
  const geo = fillDefaults(particleCount, {});

  const totalWeight = planes.reduce((a, p) => a + p.weight, 0);
  let cursor = 0;
  const planeBounds = planes.map((p) => {
    cursor += (p.weight / totalWeight) * particleCount;
    return { plane: p, end: cursor };
  });

  const clusterCenters: Array<{ x: number; y: number }> =
    motionPreset === "alive"
      ? Array.from({ length: ALIVE_CLUSTER_COUNT }, () => {
          const angle = rng() * Math.PI * 2;
          const radius = 0.3 + rng() * 0.6;
          return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
        })
      : [];

  for (let i = 0; i < particleCount; i++) {
    const plane = (planeBounds.find((b) => i < b.end) ?? planeBounds[planeBounds.length - 1]).plane;

    let x = 0;
    let y = 0;

    if (motionPreset === "alive") {
      if (clusterCenters.length && rng() < ALIVE_CLUSTER_FRACTION) {
        const c = clusterCenters[Math.floor(rng() * clusterCenters.length)];
        const angle = rng() * Math.PI * 2;
        const spread = rng() * ALIVE_CLUSTER_SPREAD;
        x = c.x + Math.cos(angle) * spread;
        y = c.y + Math.sin(angle) * spread;
      } else {
        for (let attempt = 0; attempt < 6; attempt++) {
          const angle = rng() * Math.PI * 2;
          const radius = Math.pow(rng(), ALIVE_CENTER_BIAS_EXPONENT) * ALIVE_SCATTER_RADIUS;
          x = Math.cos(angle) * radius;
          y = Math.sin(angle) * radius;
          if (Math.hypot(x, y) > 0.16) break;
        }
      }
    } else {
      // Reject-and-resample out of a small central disc so ambient particles
      // don't visually crowd the flower's own core — a handful of retries is
      // plenty since the exclusion zone is small relative to the full field.
      for (let attempt = 0; attempt < 6; attempt++) {
        x = (rng() - 0.5) * 2;
        y = (rng() - 0.5) * 2;
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
    geo.motion[i2] = 0; // no entrance bulge
    geo.motion[i2 + 1] = randRange(rng, plane.speed);

    geo.size[i] = randRange(rng, plane.size);
    geo.opacity[i] = randRange(rng, plane.opacity);
    geo.interactionMul[i] = randRange(rng, plane.interaction);
    geo.parallax[i] = randRange(rng, plane.parallax);
  }

  return geo;
}
