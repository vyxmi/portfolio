// GLSL for the two BrainField layers where a shader materially earns its
// keep: the volumetric flow field (a slow fbm-noise pressure field —
// impossible to fake cheaply with mesh primitives) and the particle
// sprites (soft circular falloff per point). The filaments are plain
// geometry driven from JS, which is simpler and just as restrained.

export const flowFieldVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// A slow-drifting fbm field standing in for volumetric density — fine,
// even grain rather than a couple of dominant lumps (the base octave is
// high-frequency enough to put several cells across the viewport, so no
// single region ever reads as a nameable "blob"). uScrollOffset folds the
// page's own scroll position into the sample coordinate, so the texture
// keeps changing as you move through the wall instead of looking like a
// fixed pattern pasted behind the viewport — it reads as spanning the
// whole page, evenly, rather than one static patch. uDragPoints/uDragAges
// are a short, JS-fed trail (see BrainFieldScene's FlowField) that
// brightens and fades behind a dragged card, like a wake through fluid;
// uPointer gives the same but tiny and constant for ordinary hover.
export const flowFieldFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform float uScrollOffset;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  uniform vec2 uPointer;
  uniform float uActivity;
  uniform vec2 uDragPoints[6];
  uniform float uDragAges[6];
  uniform int uDragCount;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * vnoise(p);
      p *= 2.08;
      amp *= 0.58;
    }
    return v;
  }

  float distA(vec2 a, vec2 b) {
    vec2 d = (a - b) * vec2(uAspect, 1.0);
    return length(d);
  }

  void main() {
    vec2 p = vUv - 0.5;
    p.y += uScrollOffset;
    vec2 flow = vec2(uTime * 0.014, uTime * -0.01 - uScrollOffset * 0.4);
    float n1 = fbm(p * 3.4 + flow);
    float n2 = fbm(p * 6.4 - flow * 1.3 + 6.3);
    float density = mix(n1, n2, 0.4);

    float wake = 0.0;
    for (int i = 0; i < 6; i++) {
      if (i >= uDragCount) break;
      float d = distA(p, uDragPoints[i]);
      wake += smoothstep(0.5, 0.0, d) * (1.0 - uDragAges[i]) * 0.55;
    }

    float pointerGlow = smoothstep(0.46, 0.0, distA(p, uPointer)) * uActivity * 0.2;

    float alpha = (density * 0.42 + wake + pointerGlow) * uOpacity;
    vec3 color = mix(uColorA, uColorB, clamp(density * 0.7 + wake, 0.0, 1.0));
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

export const particleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  varying float vBrightness;
  void main() {
    vBrightness = aBrightness;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (280.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vBrightness;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float dist = length(d);
    float alpha = smoothstep(0.5, 0.08, dist) * vBrightness;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
