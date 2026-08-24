// The one shared shader pair behind every particle group (flowerParticles,
// each ambient depth plane, and any future particle-based text/vessel/
// object). A group's identity is entirely data — attributes + a handful of
// uniforms — never a different vertex/fragment program. That's what makes
// this "one reusable particle engine" rather than one shader per feature:
// adding a new kind of group means writing a geometry builder that fills
// the same attribute contract (see geometry.ts's ParticleGroupGeometry),
// not touching GLSL.
export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBloomProgress;
  // 0 or 1 — whether this group morphs from its scattered base position
  // toward a target shape at all. Ambient/atmospheric groups never morph
  // (mix(base, target, eased * uMorph) collapses to base regardless of
  // uBloomProgress or whatever garbage sits in the unused target buffer).
  uniform float uMorph;
  uniform float uOuterRadius;
  uniform vec2 uPointer;
  uniform vec2 uWind;
  uniform float uPointerActive;
  uniform float uInteractionStrength;
  uniform float uInteractionRadius;
  uniform float uDriftStrength;
  uniform float uMotionEnabled;
  // 0 or 1 — the flower-specific "further back reads dimmer/cooler"
  // depth cue. Ambient groups already encode their own depth visually
  // through per-plane aOpacity/aSize, so they leave this off rather than
  // layering a second, differently-tuned depth effect on top.
  uniform float uDepthShade;
  uniform float uPixelRatio;
  uniform float uBaseSize;
  uniform vec2 uPosition;
  uniform float uScale;
  uniform vec2 uViewportExtent;

  attribute vec3 aBase;
  attribute vec4 aRandom;
  attribute vec2 aMotion;
  attribute float aSize;
  attribute float aOpacity;
  attribute float aInteractionMul;
  attribute float aParallax;

  varying float vAlpha;
  varying float vColorMix;

  float easeOutQuint(float x) { return 1.0 - pow(1.0 - x, 5.0); }

  // Continuous per-particle noise wobble — the thing that keeps a
  // "formed"/at-rest particle from ever reading as frozen. Shared,
  // unchanged in character, by every group; only uDriftStrength and each
  // particle's own aMotion.y (speed) vary how strongly/quickly it shows.
  vec3 organicDrift(vec4 rnd, vec2 motion, float t, float driftStrength) {
    float freqMul = max(0.05, motion.y);
    return vec3(
      sin(t * 0.15 * freqMul + rnd.w) * 0.011,
      cos(t * 0.11 * freqMul + rnd.y * 6.28318) * 0.011,
      sin(t * 0.09 * freqMul + rnd.x * 6.28318 + 1.7) * 0.007
    ) * driftStrength;
  }

  // Localized turbulence/advection: nearby particles get carried a little
  // in whatever direction the cursor is *currently moving* (wind), plus a
  // small perpendicular swirl so it reads as loosening rather than a clean
  // directional gust — never a push directly away from a fixed point, so
  // there's no hole/ring to form. The falloff is a Gaussian (no radius
  // uniform ever hard-zeroes it, just fades toward negligible) and the
  // whole thing is naturally springy: wind itself decays to zero over time
  // once the cursor stops moving or leaves (see ParticleRuntime), so
  // there's nothing here to explicitly "return" — it just stops being fed.
  vec2 cursorForce(vec2 p, vec2 pointer, vec2 wind, float sigma, float strength, float seed, float t) {
    vec2 toP = p - pointer;
    float d = length(toP);
    float falloff = exp(-(d * d) / max(0.0001, 2.0 * sigma * sigma));
    vec2 dirN = d > 1e-5 ? toP / d : vec2(0.0);
    vec2 perp = vec2(-dirN.y, dirN.x);
    // Swirl magnitude rides on actual cursor speed (windMag), not just
    // presence — a cursor that stops moving but stays near the flower
    // must produce zero force here, or it reads as a static ring/hole
    // instead of "loosens while moving."
    float windMag = length(wind);
    float swirl = sin(t * 1.4 + seed * 6.28318) * windMag * 1.6;
    return (wind * falloff * strength) + (perp * swirl * falloff * strength * 0.35);
  }

  void main() {
    vec3 base = vec3(aBase.xy * uViewportExtent, aBase.z);
    vec3 target = position * uScale;
    target.xy += uPosition;

    float stagger = aRandom.x;
    float startWindow = 0.85;
    float denom = max(0.0001, 1.0 - stagger * startWindow);
    float local = clamp((uBloomProgress - stagger * startWindow) / denom, 0.0, 1.0);
    // Stagger only ever delays *when* a particle starts moving toward its
    // target — it is never read for alpha or size, so nothing here fades
    // in or spawns. Every particle sits fully visible at its base position
    // the instant it mounts, and only its position animates from there.
    float eased = easeOutQuint(local) * uMorph;

    vec2 radialDir = normalize(target.xy - uPosition + vec2(1e-5));
    vec2 tangentDir = vec2(-radialDir.y, radialDir.x);
    float bulge = sin(eased * 3.14159265) * aMotion.x * 0.20 * uScale;

    vec3 p = mix(base, target, eased);
    p.xy += tangentDir * bulge * (1.0 - eased * 0.5);

    float rNorm = clamp(length(target.xy - uPosition) / max(0.0001, uOuterRadius), 0.0, 1.0);
    // Non-morphing groups (ambient) are always "at rest" — formedness is
    // just 1. Morphing groups only pick up the extra radial "breathing"
    // once they've actually settled near their target.
    float formedness = mix(1.0, smoothstep(0.82, 1.0, uBloomProgress), uMorph);

    float breathe =
      sin(uTime * 0.35 + aRandom.w) * (0.009 + rNorm * 0.012) * formedness * uDriftStrength * uMorph * uMotionEnabled;
    p.xy += radialDir * breathe;

    p += organicDrift(aRandom, aMotion, uTime, uDriftStrength) * uMotionEnabled;

    vec2 force =
      cursorForce(p.xy, uPointer, uWind, uInteractionRadius, uInteractionStrength * aInteractionMul, aRandom.w, uTime) *
      uPointerActive *
      uMotionEnabled;
    p.xy += force;

    // Constant, non-falloff pointer parallax — depth-plane dressing, not a
    // localized interaction. Zero for the flower (aParallax is baked 0),
    // so the silhouette itself never shifts as a whole.
    p.xy += uPointer * aParallax * uMotionEnabled;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizeAtten = 380.0 / max(-mvPosition.z, 0.6);
    gl_PointSize = uBaseSize * aSize * sizeAtten * uPixelRatio * 0.01;

    float depthShift = mix(1.0, smoothstep(-0.14, 0.14, p.z), uDepthShade);
    vAlpha = aOpacity * mix(0.72, 1.0, depthShift);
    vColorMix = clamp(aRandom.y * 0.55 + (1.0 - depthShift) * 0.45 * uDepthShade, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;
    float core = 1.0 - smoothstep(0.0, 1.0, d);
    float alpha = pow(core, 1.6) * vAlpha;

    vec3 color = mix(uColorA, uColorB, vColorMix);
    gl_FragColor = vec4(color, alpha);
  }
`;
