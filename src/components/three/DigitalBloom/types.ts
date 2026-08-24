import type { CSSProperties } from "react";

export interface DigitalBloomProps {
  /** Deterministic layout seed — same seed always samples the same cloud. */
  seed?: string | number;
  /** flowerParticles count before adaptive scaling (mobile/low-end reduces this). Density is preserved across screen sizes. */
  flowerParticleCount?: number;
  /** ambientParticles count before adaptive scaling — kept sparse relative to flowerParticleCount. */
  ambientParticleCount?: number;
  /** Angular ripple frequency applied to the flower head's density/depth. */
  petalCount?: number;
  /** Approximate seconds for a formed <-> dispersed transition (entrance and every later toggle). */
  bloomDuration?: number;
  /** World-space offset of the flower's formed silhouette. Ambient particles and the dispersed scatter stay viewport-relative regardless of this. */
  position?: { x: number; y: number };
  /** Uniform scale of the flower silhouette. */
  scale?: number;
  /** Multiplier on the continuous idle noise drift — shared by flowerParticles and every ambientParticles depth plane. */
  driftStrength?: number;
  /** Multiplier on the localized cursor turbulence/advection. Scaled per-particle (strongest on flowerParticles, faint on the near ambient plane, ~0 on middle/deep) — see AmbientPoints' AMBIENT_PLANES. */
  interactionStrength?: number;
  /** Soft Gaussian falloff radius for cursor turbulence — a characteristic distance, not a hard cutoff; effect never truly reaches zero, just fades toward negligible. */
  interactionRadius?: number;
  /** Base point size in CSS px at unit distance, for flowerParticles. */
  baseSize?: number;
  /** Base point size in CSS px at unit distance, for ambientParticles. */
  ambientSize?: number;
  /** Cool-white particle color (flowerParticles). */
  colorPrimary?: string;
  /** Desaturated-blue particle color (flowerParticles). */
  colorAccent?: string;
  /** ambientParticles color. */
  ambientColor?: string;
  /**
   * 'legacy' (default) reproduces the original motion exactly — the
   * original organicDrift-only wobble and cursor-wind/swirl turbulence.
   * 'alive' opts into a second seeded drift layer, cursor-proximity-only
   * hover agitation (never cursor direction/velocity), 3x desktop ambient
   * density, and loose seeded ambient clusters — see shaders.ts/geometry.ts.
   * Only HomeField.tsx sets this to 'alive' today.
   */
  motionPreset?: "legacy" | "alive";
  className?: string;
  style?: CSSProperties;
}
