// The one shared shader pair behind every particle group (flowerParticles,
// each ambient depth plane, and any future particle-based text/vessel/
// object). A group's identity is entirely data — attributes + a handful of
// uniforms — never a different vertex/fragment program. That's what makes
// this "one reusable particle engine" rather than one shader per feature:
// adding a new kind of group means writing a geometry builder that fills
// the same attribute contract (see geometry.ts's ParticleGroupGeometry),
// not touching GLSL.
//
// Motion model: every particle has a stable anchor (its scatterAnchor, or —
// once shapeBound and forming/formed — a mix toward its shapeTarget) plus a
// seeded, independent, slow, bounded float around that anchor. The exact
// same functions run for every group and every state (ambient, dispersed
// flower, forming flower, formed flower) — only uDriftStrength/uIdleClamp
// and each particle's own seed/speed ever vary the result. There is no
// concept of wind, pointer velocity, or a shared/group transform anywhere
// in this file: a particle's motion is a pure function of its own seed and
// time, plus (for hover) its distance from the cursor.
export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBloomProgress;
  // 0 or 1 — whether this group morphs from its scattered base position
  // toward a target shape at all (shapeBound vs free). Free/ambient groups
  // never morph (mix(base, target, eased) collapses to base regardless of
  // uBloomProgress or whatever garbage sits in the unused target buffer).
  uniform float uMorph;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uInteractionStrength;
  uniform float uInteractionRadius;
  uniform float uDriftStrength;
  uniform float uMotionEnabled;
  // Max length of the combined independentFloat displacement once a
  // shapeBound group is formed — see the clamp in main() below. Ramped out
  // entirely while dispersed/mid-formation, and always for free/ambient
  // groups (uMorph = 0), which have no spacing to protect.
  uniform float uIdleClamp;
  // 0 or 1 — the flower-specific "further back reads dimmer/cooler" depth
  // cue. Ambient groups already encode their own depth visually through
  // per-plane aOpacity/aSize, so they leave this off rather than layering a
  // second, differently-tuned depth effect on top.
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
  attribute float aDriftAmp;

  varying float vAlpha;
  varying float vColorMix;

  float easeOutQuint(float x) { return 1.0 - pow(1.0 - x, 5.0); }

  // independentFloat(seed, time), part one: continuous per-particle noise
  // wobble around the anchor — the thing that keeps a "formed"/at-rest
  // particle from ever reading as frozen. Shared, unchanged in character,
  // by every group and every state; only uDriftStrength and each
  // particle's own aMotion.y (speed) vary how strongly/quickly it shows.
  vec3 organicDrift(vec4 rnd, vec2 motion, float t, float driftStrength) {
    float freqMul = max(0.05, motion.y);
    return vec3(
      sin(t * 0.15 * freqMul + rnd.w) * 0.011,
      cos(t * 0.11 * freqMul + rnd.y * 6.28318) * 0.011,
      sin(t * 0.09 * freqMul + rnd.x * 6.28318 + 1.7) * 0.007
    ) * driftStrength;
  }

  // independentFloat(seed, time), part two: a second oscillator at
  // different frequencies/phases (its own seed offsets, not organicDrift's)
  // layered additively on top — breaks up organicDrift's single-frequency
  // repetition without changing organicDrift itself. Combined, these two
  // are a particle's entire idle motion: bounded, per-particle-seeded,
  // multidirectional, and never a shared direction or whole-field
  // translation.
  vec3 secondaryDrift(vec4 rnd, vec2 motion, float t, float driftStrength) {
    float freqMul = max(0.05, motion.y);
    return vec3(
      sin(t * 0.223 * freqMul + rnd.z * 6.28318 + 2.1) * 0.0072,
      cos(t * 0.187 * freqMul + rnd.x * 6.28318 + 0.6) * 0.0072,
      sin(t * 0.161 * freqMul + rnd.w + 4.3) * 0.0046
    ) * driftStrength;
  }

  // seededNoiseDirection(seed, time) — the hover displacement's entire
  // direction/magnitude source. Its own frequencies/phase offsets (distinct
  // from both drift oscillators above, and folded in with aMotion.x — an
  // otherwise-unused per-particle random sign — for extra variety) so a
  // hovered particle doesn't just look like its own idle wobble turned up.
  // Still a pure function of the particle's seed and time: the cursor's
  // position/velocity never appears here, only in main()'s proximity gate,
  // which decides *how much* of this shows, never *which way*.
  vec2 seededNoiseDirection(vec4 rnd, vec2 motion, float t) {
    float freqMul = max(0.05, motion.y);
    float phase = motion.x * 3.14159265;
    return vec2(
      sin(t * 0.31 * freqMul + rnd.x * 6.28318 + phase + 4.7) * 0.035,
      cos(t * 0.26 * freqMul + rnd.z * 6.28318 - phase + 1.9) * 0.035
    );
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

    // anchor = shapeBound ? mix(scatterAnchor, shapeTarget, formProgress) : scatterAnchor.
    // Free/ambient groups have uMorph = 0 so eased is always 0, collapsing
    // this to plain base regardless of bloom progress.
    vec3 anchor = mix(base, target, eased);

    // Free/ambient groups are always "at rest" — formedness is just 1, but
    // multiplying by uMorph below zeroes their idle clamp entirely, since
    // they have no silhouette spacing to protect. shapeBound groups only
    // tighten their clamp once actually settled near target — the 0.8
    // start point (tuned down from this file's original 0.82) is mostly
    // moot on its own now; what actually controls how early the tightening
    // reads as visible is the clampRadius interpolation below, which used
    // to be linear and effectively ignored this value entirely.
    float formedness = mix(1.0, smoothstep(0.8, 1.0, uBloomProgress), uMorph);

    // 6x overall float strength (2x from an earlier pass, x3 more on top of
    // that per a later request for 3x current displacement) — a flat
    // multiplier on top of the two seeded oscillators rather than scaling
    // their baked-in amplitudes individually, so their relative balance
    // (organicDrift vs secondaryDrift) and their frequencies (movement
    // speed) are both untouched. aDriftAmp is a further, per-particle
    // multiplier on the same combined vector — seeded static variation in
    // *how far* each particle wanders, independent of aMotion.y (which
    // varies how *fast*).
    vec3 drift = (organicDrift(aRandom, aMotion, uTime, uDriftStrength)
                + secondaryDrift(aRandom, aMotion, uTime, uDriftStrength)) * 6.0 * aDriftAmp * uMotionEnabled;

    // Formed flower: clamp the combined independentFloat displacement under
    // a fraction of the flower's own point spacing (uIdleClamp, estimated
    // in JS from particle count/radius — see FlowerPoints) so idle wobble
    // can't visibly loosen the silhouette. Ramped from effectively
    // unclamped (dispersed/mid-formation) down to uIdleClamp as the shape
    // settles; always unclamped for free/ambient groups via the uMorph term.
    // Geometric (log-space), not linear: uIdleClamp is tiny relative to the
    // ~1.0 "unclamped" ceiling — a LINEAR mix between them barely moves
    // below actual drift magnitude until formedness is almost exactly 1,
    // which made the formedness ramp's start point (see above) have no
    // visible effect no matter where it began. Interpolating the exponent
    // instead means the clamp radius shrinks by a consistent *fraction*
    // per unit of formedness, so it actually starts biting as formedness
    // ramps up rather than only in the final sliver.
    float clampFloor = max(uIdleClamp, 0.0001);
    float clampRadius = exp(mix(log(1.0), log(clampFloor), formedness * uMorph));
    float driftLen = length(drift.xy);
    if (driftLen > clampRadius) {
      drift.xy *= clampRadius / driftLen;
    }

    vec3 p = anchor + drift;

    // Hover: proximity = gaussian(distance(anchor, pointer)) — measured
    // from the particle's stable ANCHOR, not its current drifted position,
    // so the responsive radius doesn't wander with idle wobble. Direction
    // and magnitude both come from seededNoiseDirection (the particle's own
    // seed + time); the cursor only ever selects which particles react and
    // how strongly, never which way they move — no cursor position delta,
    // velocity, or shared direction appears anywhere in this file. There is
    // no stored per-particle offset, so as proximity/uPointerActive decay
    // (cursor moves away or leaves), this term shrinks back toward zero on
    // its own — a spring-like return to the anchor, while drift (above)
    // keeps the particle floating throughout.
    float d = length(anchor.xy - uPointer);
    float proximity = exp(-(d * d) / max(0.0001, 2.0 * uInteractionRadius * uInteractionRadius));
    vec2 hoverOffset =
      seededNoiseDirection(aRandom, aMotion, uTime) *
      proximity *
      uInteractionStrength * aInteractionMul *
      uPointerActive *
      uMotionEnabled;
    p.xy += hoverOffset;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size and the flower's depth-shade color/alpha cue both key off the
    // particle's STABLE anchor depth, never its live per-frame drifted
    // position p — anchor.z only ever changes via the slow formed/
    // dispersed blend, so neither can pulse frame-to-frame the way
    // mvPosition.z/p.z (which include drift's own z oscillation) would.
    // That was the source of a subtle twinkle: point size, and for the
    // flower brightness too, breathing in time with the idle float instead
    // of staying constant like every other static per-particle attribute.
    vec4 anchorView = modelViewMatrix * vec4(anchor, 1.0);
    float sizeAtten = 380.0 / max(-anchorView.z, 0.6);
    gl_PointSize = uBaseSize * aSize * sizeAtten * uPixelRatio * 0.01;

    float depthShift = mix(1.0, smoothstep(-0.14, 0.14, anchor.z), uDepthShade);
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
