"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FlowerPoints from "./FlowerPoints";
import AmbientPoints from "./AmbientPoints";
import ParticleRuntime, { createParticleRuntime } from "./ParticleRuntime";
import type { DigitalBloomProps } from "./types";

const VOID_BG = "#0a0a0d";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// Scales particle counts / DPR / postprocessing down for touch or
// low-concurrency devices. Read directly at render time (cheap
// matchMedia/property reads, no listeners needed) rather than through
// state+effect, since there's nothing async to synchronize — just an
// SSR-safe environment read.
function useAdaptive(baseFlowerCount: number, baseAmbientCount: number) {
  if (typeof window === "undefined") {
    return { flowerCount: baseFlowerCount, ambientCount: baseAmbientCount, dpr: 2, skipPostFX: false };
  }
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const lowConcurrency = (navigator.hardwareConcurrency ?? 8) <= 4;
  let scale = 1;
  if (coarse || small) scale *= 0.55;
  if (lowConcurrency) scale *= 0.75;
  // The flower is the subject — its density is never cut below a floor
  // that would thin the silhouette. Ambient is atmosphere, cut harder.
  const flowerCount = Math.max(1800, Math.round(baseFlowerCount * scale));
  const ambientCount = Math.max(150, Math.round(baseAmbientCount * scale * (coarse || small ? 0.6 : 1)));
  const dpr = Math.min(window.devicePixelRatio || 1, coarse || small ? 1.5 : 2);
  return { flowerCount, ambientCount, dpr, skipPostFX: coarse && small };
}

/**
 * One particle engine (see ParticlePoints/shaders.ts), driving two groups:
 *  - flowerParticles sample the same braille-flower silhouette as
 *    AsciiFlower. Every particle mounts immediately, fully visible, at a
 *    random scattered position across the viewport, then animates toward
 *    its assigned spot in the flower shape — never a spawn/fade-in.
 *    Click/tap toggles the whole group between that scattered state and
 *    formed; only flowerParticles ever move this way.
 *  - ambientParticles are a separate, sparser group across three depth
 *    planes (deep/middle/near) that never converges into any shape — it
 *    just floats, in every state, using the exact same drift/hover
 *    machinery as the flower.
 * Every particle — ambient, dispersed flower, forming flower, or formed
 * flower — is a miniature independent body: a stable anchor (its scatter
 * position, or once shapeBound, a mix toward its shape target) plus a
 * seeded, bounded, slow float unique to that particle. There is no wind,
 * no pointer velocity, and no shared/group transform anywhere in this
 * engine — cursor proximity only ever selects which particles react and
 * how strongly; the direction they move always comes from their own seed.
 * The formed flower clamps that idle float tighter (relative to its own
 * point spacing) to keep the silhouette crisp; every other state floats
 * freely. Self-contained: drop it anywhere, it owns its own full-bleed
 * Canvas.
 */
export default function DigitalBloom({
  seed = "digital-bloom",
  flowerParticleCount = 7000,
  ambientParticleCount = 1100,
  petalCount = 6,
  bloomDuration = 2.6,
  position = { x: 0, y: 0 },
  scale = 0.62,
  driftStrength = 1,
  interactionStrength = 1,
  interactionRadius = 0.6,
  baseSize = 3.4,
  ambientSize = 2.2,
  colorPrimary = "#f3f3f6",
  colorAccent = "#8496ea",
  ambientColor = "#aab4e8",
  className,
  style,
}: DigitalBloomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const reducedMotion = usePrefersReducedMotion();
  // 3x the base ambient density — useAdaptive itself is untouched — the
  // existing device-scaling formula still runs on top of this, unmodified,
  // so mobile/low-power still scales down automatically the same way it
  // always has.
  const ambientBaseCount = ambientParticleCount * 3;
  const { flowerCount, ambientCount, dpr, skipPostFX } = useAdaptive(flowerParticleCount, ambientBaseCount);
  const [formed, setFormed] = useState(true);
  // See the doc comment on ParticleRuntime's pointerEngagedRef prop: r3f's
  // state.pointer defaults to NDC (0,0) before any real pointer event, and
  // that default must never be mistaken for an actual cursor position.
  const pointerEngaged = useRef(false);
  const runtime = useRef(createParticleRuntime());

  const camera = useMemo(() => ({ position: [0, 0, 4.2] as [number, number, number], fov: 40, near: 0.1, far: 20 }), []);
  // Flower-only: cursor-proximity hover radius cut to a third of the shared
  // interactionRadius prop. Ambient keeps the full radius unchanged — this
  // narrows only how close the cursor needs to be to nudge flower particles.
  const flowerInteractionRadius = interactionRadius / 3;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={className}
      onClick={() => setFormed((f) => !f)}
      onPointerMove={() => {
        pointerEngaged.current = true;
      }}
      onPointerLeave={() => {
        pointerEngaged.current = false;
      }}
      style={{ width: "100%", height: "100%", cursor: "pointer", ...style }}
    >
      <Canvas
        frameloop={reducedMotion ? "demand" : inView ? "always" : "never"}
        dpr={dpr}
        camera={camera}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(VOID_BG, 1)}
      >
        <ParticleRuntime runtimeRef={runtime} pointerEngagedRef={pointerEngaged} interactive={!reducedMotion} />
        <AmbientPoints
          seed={seed}
          particleCount={ambientCount}
          driftStrength={driftStrength}
          interactionStrength={interactionStrength}
          interactionRadius={interactionRadius}
          size={ambientSize}
          color={ambientColor}
          motionEnabled={!reducedMotion}
          runtime={runtime}
        />
        <FlowerPoints
          seed={seed}
          particleCount={flowerCount}
          petalCount={petalCount}
          bloomDuration={bloomDuration}
          formed={formed}
          position={position}
          scale={scale}
          driftStrength={driftStrength}
          interactionStrength={interactionStrength}
          interactionRadius={flowerInteractionRadius}
          baseSize={baseSize}
          colorPrimary={colorPrimary}
          colorAccent={colorAccent}
          interactive={!reducedMotion}
          runtime={runtime}
        />
        {!skipPostFX && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.55} luminanceThreshold={0.18} luminanceSmoothing={0.55} mipmapBlur radius={0.7} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
