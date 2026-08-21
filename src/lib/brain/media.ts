import type { BrainMedia } from "./types";
import { hashSeed } from "./hash";

const darkTones = ["#14141a", "#16161d", "#121218", "#18181f", "#13131a", "#171720"];

// Muted archival-toned placeholder standing in for the real photo when an
// object has no media entry to resolve (or an out-of-range index).
function placeholderSrc(label: string, seed: number, paper: boolean): string {
  const w = 900,
    h = 700;
  const bg = paper ? "#eceef4" : darkTones[seed % darkTones.length];
  const line1 = paper ? "rgba(16,17,20,0.05)" : "rgba(245,245,250,0.045)";
  const line2 = paper ? "rgba(16,17,20,0.035)" : "rgba(245,245,250,0.03)";
  const textFill = paper ? "rgba(16,17,20,0.32)" : "rgba(245,245,250,0.24)";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="100%" height="100%" fill="${bg}"/>
<path d="M0 ${h} L${w} 0" stroke="${line1}" stroke-width="1"/>
<path d="M${w * 0.3} ${h} L${w * 0.3 + h} 0" stroke="${line2}" stroke-width="1"/>
<text x="14" y="${h - 14}" font-family="ui-monospace, Menlo, monospace" font-size="11" fill="${textFill}" letter-spacing=".02em">${label}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function resolveMediaSrc(objectId: string, media: BrainMedia[] | undefined, index: number, paper = false): string {
  const m = media?.[index];
  if (m) return `/brain/${m.filename}`;
  return placeholderSrc(`${objectId}-${index + 1}`, hashSeed(objectId + index), paper);
}
