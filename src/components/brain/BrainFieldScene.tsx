"use client";

/* eslint-disable react-hooks/refs --
   This is a React Three Fiber scene: every ref below intentionally holds a
   mutable Three.js object (geometry, material, simulation vectors) that is
   read once lazily, then written to every frame inside useFrame, entirely
   outside React's render/commit cycle — that's the standard R3F pattern
   (see react-three-fiber's own docs/examples) and the reason refs are used
   here instead of useMemo/useState. The experimental React Compiler
   ref-purity rule flags this file-wide because it doesn't yet model
   canvas-imperative code; there's nothing here it would actually catch. */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motionField } from "@/lib/brain/motionField";
import {
  flowFieldVertexShader,
  flowFieldFragmentShader,
  particleVertexShader,
  particleFragmentShader,
} from "@/lib/brain/brainFieldShaders";

// One restrained palette, dark/periwinkle-gray throughout — no whites, no
// bright accents. PERIWINKLE is literally --lift, so the field and the
// site's own accent color are the same hue at very low intensity.
const PERIWINKLE = new THREE.Color("#8496ea");
const MUTE = new THREE.Color("#565c82");
const GREY = new THREE.Color("#7d8296");
const DEEP = new THREE.Color("#0b0b10");

// Deterministic stand-in for Math.random(): every "random" spawn value in
// this file is derived from a stable index/seed through this instead, so
// initial state is a pure function of its inputs (no impure calls during
// render) and stays identical across re-renders.
function prand(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// A linear (triangle-wave) response to scroll position, not a sine. Sine's
// slope flattens to zero right at its peaks, so anything driven by
// Math.sin(scrollY * freq) reads as "moving, then stalling, then moving" —
// exactly the "doesn't feel like it's tracking scroll" complaint. A
// triangle wave has constant slope everywhere but its corners, so the
// field visibly rides along with scroll throughout a normal scroll
// gesture, while still being bounded (folds back rather than running off)
// over an arbitrarily long wall.
function triWave(x: number, period: number): number {
  const t = ((x % period) + period) % period;
  return 4 * Math.abs(t / period - 0.5) - 1;
}

// -------------------------------------------------------------------------
// Flow field — a single full-bleed plane of slow fbm noise standing in for
// volumetric density/pressure, not a shape. No blob ever separates out as
// its own bright circle; it's one current the whole page sits inside. A
// short JS-fed trail of recent drag positions brightens and decays behind
// a moving card, like a wake through fluid; ordinary hover gets the same
// treatment as a single, tiny, constant point.
// -------------------------------------------------------------------------
const DRAG_TRAIL = 6;
const DRAG_TRAIL_LIFE = 0.9; // seconds for a wake sample to fully decay

interface FlowUniforms {
  [key: string]: { value: unknown };
  uTime: { value: number };
  uAspect: { value: number };
  uScrollOffset: { value: number };
  uColorA: { value: THREE.Color };
  uColorB: { value: THREE.Color };
  uOpacity: { value: number };
  uPointer: { value: THREE.Vector2 };
  uActivity: { value: number };
  uDragPoints: { value: THREE.Vector2[] };
  uDragAges: { value: number[] };
  uDragCount: { value: number };
}

function FlowField() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();

  const uniformsRef = useRef<FlowUniforms | null>(null);
  if (!uniformsRef.current) {
    uniformsRef.current = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uScrollOffset: { value: 0 },
      uColorA: { value: DEEP.clone() },
      uColorB: { value: MUTE.clone() },
      uOpacity: { value: 0.32 },
      uPointer: { value: new THREE.Vector2(10, 10) },
      uActivity: { value: 0 },
      uDragPoints: { value: Array.from({ length: DRAG_TRAIL }, () => new THREE.Vector2()) },
      uDragAges: { value: new Array(DRAG_TRAIL).fill(1) },
      uDragCount: { value: 0 },
    };
  }
  const uniforms = uniformsRef.current;

  const activityRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const lastSampleRef = useRef(0);

  useFrame(() => {
    const z = -9;
    const vp = viewport.getCurrentViewport(camera, [0, 0, z]);
    if (meshRef.current) {
      meshRef.current.position.z = z;
      meshRef.current.scale.set(vp.width, vp.height, 1);
    }
    uniforms.uAspect.value = vp.width / vp.height;

    const t = motionField.time;
    uniforms.uTime.value = t;
    // Folds the page's own scroll position into the noise sample so the
    // field keeps revealing fresh texture as you move through the wall —
    // it reads as one field spanning the whole page, not a pattern fixed
    // to the viewport.
    uniforms.uScrollOffset.value = motionField.scrollY * 0.00028;
    uniforms.uPointer.value.set(motionField.pointerNX * 0.5, -motionField.pointerNY * 0.5);

    const target = motionField.hoveredAny || motionField.dragActive ? 1 : 0;
    activityRef.current += (target - activityRef.current) * 0.05;
    uniforms.uActivity.value = activityRef.current;

    if (motionField.dragActive && t - lastSampleRef.current > 0.045) {
      lastSampleRef.current = t;
      trailRef.current.push({ x: motionField.pointerNX * 0.5, y: -motionField.pointerNY * 0.5, t });
      if (trailRef.current.length > DRAG_TRAIL) trailRef.current.shift();
    }
    trailRef.current = trailRef.current.filter((p) => t - p.t < DRAG_TRAIL_LIFE);

    const pts = uniforms.uDragPoints.value;
    const ages = uniforms.uDragAges.value;
    trailRef.current.forEach((p, i) => {
      pts[i].set(p.x, p.y);
      ages[i] = Math.min(1, (t - p.t) / DRAG_TRAIL_LIFE);
    });
    uniforms.uDragCount.value = trailRef.current.length;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={flowFieldVertexShader}
        fragmentShader={flowFieldFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// -------------------------------------------------------------------------
// Filaments — thin, near-invisible organic tendrils. Idle, they read as
// almost nothing; any hover or drag anywhere on the wall wakes them
// slightly (brighter, a soft bend), which is what "connective" means here —
// a shared medium reacting, not a drawn line between two specific objects.
// -------------------------------------------------------------------------
interface FilamentDef {
  points: THREE.Vector3[];
  perp: THREE.Vector3;
}

const FILAMENT_DEFS: FilamentDef[] = [
  {
    points: [
      new THREE.Vector3(-3.4, 1.7, -2.2),
      new THREE.Vector3(-1.1, 0.5, -2.5),
      new THREE.Vector3(0.9, 1.3, -2.2),
      new THREE.Vector3(2.8, -0.5, -2.6),
    ],
    perp: new THREE.Vector3(0, 1, 0.15),
  },
  {
    points: [
      new THREE.Vector3(-2.8, -1.9, -3.4),
      new THREE.Vector3(-0.4, -0.7, -3.7),
      new THREE.Vector3(1.7, -1.5, -3.3),
      new THREE.Vector3(3.4, 0.3, -3.8),
    ],
    perp: new THREE.Vector3(0.1, 1, -0.1),
  },
  {
    points: [
      new THREE.Vector3(-1.6, 2.3, -4.2),
      new THREE.Vector3(0.6, 1.4, -4.5),
      new THREE.Vector3(2.2, 2.2, -4.1),
    ],
    perp: new THREE.Vector3(-0.1, 1, 0.08),
  },
];

function buildFilamentGeometry(def: FilamentDef, bend: number) {
  const bent = def.points.map((p, idx) => {
    if (idx === 0 || idx === def.points.length - 1) return p.clone();
    const u = idx / (def.points.length - 1);
    const lateral = Math.sin(u * Math.PI) * bend * 0.7;
    return p.clone().addScaledVector(def.perp, lateral);
  });
  const curve = new THREE.CatmullRomCurve3(bent);
  return new THREE.TubeGeometry(curve, 28, 0.009, 5, false);
}

function Filament({ def, index }: { def: FilamentDef; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const bendRef = useRef(0);
  const builtBendRef = useRef(-1);
  const phaseRef = useRef<number | null>(null);
  if (phaseRef.current === null) phaseRef.current = prand(index * 91.7 + 3.1) * Math.PI * 2;
  const phase = phaseRef.current;

  const initialGeometryRef = useRef<THREE.TubeGeometry | null>(null);
  if (!initialGeometryRef.current) initialGeometryRef.current = buildFilamentGeometry(def, 0);

  useFrame(() => {
    const target = motionField.hoveredAny || motionField.dragActive ? 1 : 0;
    bendRef.current += (target - bendRef.current) * 0.035;

    const mesh = meshRef.current;
    if (!mesh) return;

    if (Math.abs(bendRef.current - builtBendRef.current) > 0.004) {
      mesh.geometry.dispose();
      mesh.geometry = buildFilamentGeometry(def, bendRef.current);
      builtBendRef.current = bendRef.current;
    }

    if (materialRef.current) {
      materialRef.current.opacity = 0.035 + bendRef.current * 0.05;
    }

    const t = motionField.time;
    const depthFactor = 1 / (1 + Math.abs(def.points[0].z) * 0.15);
    const scrollSway = triWave(motionField.scrollY + phase * 500, 3400) * 0.55 * depthFactor;
    mesh.position.y = Math.sin(t * 0.04 + phase) * 0.12 + scrollSway;
    mesh.position.x = Math.cos(t * 0.03 + phase) * 0.08;
  });

  return (
    <mesh ref={meshRef} geometry={initialGeometryRef.current}>
      <meshBasicMaterial ref={materialRef} color={GREY} transparent opacity={0.035} depthWrite={false} />
    </mesh>
  );
}

function Filaments() {
  return (
    <>
      {FILAMENT_DEFS.map((def, i) => (
        <Filament key={i} def={def} index={i} />
      ))}
    </>
  );
}

// -------------------------------------------------------------------------
// Particulate field — sparse, small, low-contrast dark/periwinkle-gray
// specks drifting at different depths. Each particle springs gently back
// to a home position, is nudged (not dragged) away from the cursor within
// a small radius, and parts more decisively around an actively dragged
// card — CPU-simulated since the count is tiny.
// -------------------------------------------------------------------------
const PARTICLE_COUNT = 42;

interface ParticleSim {
  home: THREE.Vector3[];
  pos: THREE.Vector3[];
  vel: THREE.Vector3[];
  phase: number[];
}

function buildParticleSim(): ParticleSim {
  const home: THREE.Vector3[] = [];
  const pos: THREE.Vector3[] = [];
  const vel: THREE.Vector3[] = [];
  const phase: number[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = (prand(i * 12.9898 + 1) * 2 - 1) * 4.4;
    const y = (prand(i * 78.233 + 2) * 2 - 1) * 2.8;
    const z = -1.2 - prand(i * 39.425 + 3) * 3.4;
    home.push(new THREE.Vector3(x, y, z));
    pos.push(new THREE.Vector3(x, y, z));
    vel.push(new THREE.Vector3());
    phase.push(prand(i * 45.164 + 4) * Math.PI * 2);
  }
  return { home, pos, vel, phase };
}

function buildParticleGeometry() {
  const g = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const brightness = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    sizes[i] = 2 + prand(i * 8.71 + 6) * 1.6;
    brightness[i] = 0.1 + prand(i * 17.31 + 5) * 0.08;
  }
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  g.setAttribute("aBrightness", new THREE.BufferAttribute(brightness, 1));
  return g;
}

function buildParticleMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: { uColor: { value: GREY.clone().lerp(PERIWINKLE, 0.4) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
}

function Particles() {
  const { viewport, camera } = useThree();

  const simRef = useRef<ParticleSim | null>(null);
  if (!simRef.current) simRef.current = buildParticleSim();
  const sim = simRef.current;

  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  if (!geometryRef.current) geometryRef.current = buildParticleGeometry();
  const geometry = geometryRef.current;

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  if (!materialRef.current) materialRef.current = buildParticleMaterial();
  const material = materialRef.current;

  const dragBoostRef = useRef(0);

  useFrame(() => {
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = motionField.time;

    dragBoostRef.current += ((motionField.dragActive ? 1 : 0) - dragBoostRef.current) * 0.08;
    const dragBoost = dragBoostRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = sim.pos[i];
      const v = sim.vel[i];
      const home = sim.home[i];

      const vp = viewport.getCurrentViewport(camera, [0, 0, p.z]);
      const pointerWorldX = motionField.pointerNX * (vp.width / 2);
      const pointerWorldY = -motionField.pointerNY * (vp.height / 2);

      const toHomeX = home.x - p.x;
      const toHomeY = home.y - p.y;
      v.x += toHomeX * 0.012;
      v.y += toHomeY * 0.012;

      const dx = p.x - pointerWorldX;
      const dy = p.y - pointerWorldY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Ordinary cursor presence only nudges within a small radius; an
      // active drag widens the radius and roughly doubles the push, so
      // nearby particles visibly part around a moving card rather than
      // just leaning away from an idle pointer.
      const radius = 1.1 + dragBoost * 0.9;
      if (dist < radius && dist > 0.001) {
        const force = (1 - dist / radius) * (0.02 + dragBoost * 0.05);
        v.x += (dx / dist) * force;
        v.y += (dy / dist) * force;
      }

      v.x *= 0.94;
      v.y *= 0.94;
      p.x += v.x;
      p.y += v.y;

      const idle = Math.sin(t * 0.15 + sim.phase[i]) * 0.002;
      const stretch = motionField.velocity * -0.0008;
      // Triangle-wave scroll parallax, nearer particles ride it more — same
      // reasoning as the flow field: constant slope so it's visibly linked
      // to scroll rather than stalling, folded back rather than carrying
      // particles off-screen for good on a long wall.
      const depthT = Math.max(0, Math.min(1, 1 - (Math.abs(p.z) - 1.2) / 3.4));
      const period = 2200 - depthT * 900;
      const scrollSway = triWave(motionField.scrollY + sim.phase[i] * 500, period) * (0.4 + depthT * 0.8);

      posAttr.setXYZ(i, p.x + idle, p.y + stretch + scrollSway, p.z);
    }
    posAttr.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} />;
}

export default function BrainFieldScene() {
  return (
    <>
      <FlowField />
      <Filaments />
      <Particles />
    </>
  );
}
