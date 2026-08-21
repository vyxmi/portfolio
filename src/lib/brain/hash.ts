// Small stable hash so per-object visual variation (placeholder tone,
// scrap silhouette, sticky-note tilt) stays the same across re-renders
// instead of reshuffling on every paint.
export function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
