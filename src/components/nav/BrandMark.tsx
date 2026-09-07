// Two fitted strokes form a V; the counter-shape opens on interaction.
export default function BrandMark() {
  return <svg className="brand-mark" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <path className="brand-left" d="M3 7h10l12 30H15Z" fill="currentColor" />
    <path className="brand-right" d="M30 7h11L29 37H18Z" fill="currentColor" />
    <path className="brand-cut" d="m20 16 6 15 4-10" stroke="var(--site-bg)" strokeWidth="2" />
  </svg>;
}
