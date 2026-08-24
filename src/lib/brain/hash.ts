// Small stable hash so per-object visual variation (placeholder tone,
// scrap silhouette, sticky-note tilt) stays the same across re-renders
// instead of reshuffling on every paint.
export function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Deterministic PRNG stream (mulberry32) keyed on a stable string seed —
// e.g. an object's own CMS uid, never its vessel type or array position.
// Used wherever a single object needs *several* independent-looking random
// values (drift amplitude, duration, phase, direction, ...): pulling those
// from one hashSeed() int via bit-shifts correlates them, since they all
// derive from the same few bits. This instead advances real PRNG state
// per call, so consecutive draws for the same object don't rhyme with each
// other, while the whole sequence is still fully reproducible from the seed
// alone — same uid always plays back the same motion.
export function createRng(seed: string): () => number {
  let a = hashSeed(seed) || 1;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
