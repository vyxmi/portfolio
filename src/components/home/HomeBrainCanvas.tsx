"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { brainObjects } from "@/lib/brain/objects";
import { isPrivate } from "@/lib/brain/resolvers";
import type { BrainObject } from "@/lib/brain/types";
import { HOME_LAYOUT, HOME_CONNECTIONS, HOME_MOBILE_ORDER, HOME_DEFAULT_SCALE } from "@/lib/brain/homeLayout";
import { createRng } from "@/lib/brain/hash";
import { motionField, tickCards, registerLenisController } from "@/lib/brain/motionField";
import BrainCard from "@/components/brain/BrainCard";
import BrainFocus from "@/components/brain/BrainFocus";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface LinePath {
  key: string;
  a: string;
  b: string;
  d: string;
}

interface NodeOverride {
  x: number;
  y: number;
  scale: number;
}

const EDIT_STORAGE_KEY = "home-layout-edit-v1";
const SCALE_MIN = 0.15;
const SCALE_MAX = 1.3;

// The URL query param never changes without a full navigation (a new
// ?edit=1 link, or removing it) — either way this component remounts, so
// there's nothing to subscribe to; useSyncExternalStore still needs a
// subscribe function, this one just never fires.
function subscribeNever() {
  return () => {};
}
function getEditModeFromUrl() {
  return new URLSearchParams(window.location.search).get("edit") === "1";
}
function getEditModeServerSnapshot() {
  return false;
}

function loadOverrides(): Record<string, NodeOverride> {
  try {
    const raw = localStorage.getItem(EDIT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, NodeOverride>) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, NodeOverride>) {
  try {
    localStorage.setItem(EDIT_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // storage unavailable (private mode, quota) — edits still work for this
    // session, they just won't survive a refresh.
  }
}

// Where a ray from (cx,cy) toward (tx,ty) exits an ellipse of semi-axes
// (rx,ry) centered at (cx,cy) — i.e. "the point on this card's edge, in
// the direction of that other card." Used for both ends of every
// connection line, so a line touches each card's actual boundary instead
// of floating between two centers — this is what "anchor the connections
// to the specific spot" (per a hub like the shelf, with several lines
// fanning out toward different targets) comes from: no per-line hardcoded
// offsets, just real geometry against each card's own measured size.
function edgePoint(cx: number, cy: number, rx: number, ry: number, tx: number, ty: number) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const t = 1 / Math.sqrt((dx / rx) ** 2 + (dy / ry) ** 2);
  return { x: cx + dx * t, y: cy + dy * t };
}

export default function HomeBrainCanvas() {
  const objectsById = useMemo(() => {
    const homeIds = new Set(HOME_LAYOUT.map((n) => n.id));
    const map = new Map<string, BrainObject>();
    for (const o of brainObjects) {
      if (homeIds.has(o.id) && !isPrivate(o)) map.set(o.id, o);
    }
    return map;
  }, []);

  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const [a, b] of HOME_CONNECTIONS) {
      if (!map.has(a)) map.set(a, new Set());
      if (!map.has(b)) map.set(b, new Set());
      map.get(a)!.add(b);
      map.get(b)!.add(a);
    }
    return map;
  }, []);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [rects, setRects] = useState<Map<string, Rect>>(new Map());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  // Edit mode: visit /?edit=1 to drag/resize objects directly, then use
  // the panel's "copy layout" button to get the resulting HOME_LAYOUT
  // entries and paste them back in. Off (and this whole branch inert) for
  // every normal visitor. useSyncExternalStore, not a mount effect +
  // setState — same pattern HomeField already uses for reading browser-only
  // state: it's the value React expects during SSR/first hydration
  // (false), then swaps to the real client value right after, with no
  // synchronous setState-in-effect and no hydration-mismatch warning.
  const editMode = useSyncExternalStore(subscribeNever, getEditModeFromUrl, getEditModeServerSnapshot);
  // overrides' initial value only ever matters once editMode is true (see
  // `nodes` below, which reads it unconditionally but is empty here
  // whenever editMode is false) — safe to read localStorage directly in
  // this lazy initializer rather than an effect, since editMode itself is
  // guaranteed false during SSR/first hydration regardless of what this
  // resolves to.
  const [overrides, setOverrides] = useState<Record<string, NodeOverride>>(() =>
    typeof window !== "undefined" && getEditModeFromUrl() ? loadOverrides() : {}
  );
  const [copyText, setCopyText] = useState<string | null>(null);

  const nodes = useMemo(
    () =>
      HOME_LAYOUT.map((n) => {
        const o = overrides[n.id];
        return {
          id: n.id,
          x: o?.x ?? n.x,
          y: o?.y ?? n.y,
          scale: o?.scale ?? n.scale ?? HOME_DEFAULT_SCALE,
        };
      }),
    [overrides]
  );

  const measure = useCallback(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvasRect = canvasEl.getBoundingClientRect();
    const next = new Map<string, Rect>();
    nodeRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      next.set(id, {
        x: r.left - canvasRect.left + r.width / 2,
        y: r.top - canvasRect.top + r.height / 2,
        w: r.width,
        h: r.height,
      });
    });
    setRects(next);
  }, []);

  useLayoutEffect(() => {
    // One tick so motionField.tickCards (below) has already written each
    // card's rest transform before this first measurement — otherwise the
    // very first paint's line endpoints are measured against pre-drift
    // positions and visibly snap once drift kicks in.
    const raf = requestAnimationFrame(measure);
    let frame = 0;
    function onResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }
    window.addEventListener("resize", onResize);
    const canvasEl = canvasRef.current;
    // Vessel <img>s have no width/height attributes, so their box is
    // near-zero until the image finishes loading — `load` doesn't bubble,
    // so this listens in the capture phase (same pattern as BrainWall's
    // useMasonry).
    canvasEl?.addEventListener("load", onResize, true);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      canvasEl?.removeEventListener("load", onResize, true);
    };
  }, [measure]);

  // Re-measure (for connection lines) whenever a drag/resize commits in
  // edit mode — positions/sizes just changed and lines should follow.
  useEffect(() => {
    if (!editMode) return;
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [editMode, overrides, measure]);

  // Drives the exact same motion engine the /brain wall uses
  // (motionField.tickCards) — each BrainCard below registers itself with
  // it via motionEnhanced (see useCardMotion), the same as a wall card
  // does. The only thing missing outside /brain is something calling
  // tickCards() every frame; on /brain that's BrainScrollProvider's
  // gsap.ticker (tied to its Lenis instance). The homepage doesn't scroll
  // and has no Lenis, so this runs its own minimal rAF loop instead —
  // same tick function, no Lenis/gsap dependency. Skipped entirely in
  // edit mode: drift/drag-spring fighting a manual drag would make
  // precise placement impossible.
  useEffect(() => {
    if (editMode) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motionField.reducedMotion = reduced;
    // Defensive: motionField is a module-level singleton, so a Lenis
    // controller registered by a previous /brain visit (client-side nav,
    // not a full reload) would otherwise still be sitting here — BrainFocus
    // below calls stopBackgroundScroll/startBackgroundScroll, which would
    // reach into a Lenis instance whose DOM already unmounted. The
    // homepage never scrolls, so there's nothing to control here anyway.
    registerLenisController(null);
    if (reduced) return;

    function onVisibility() {
      motionField.paused = document.hidden;
    }
    document.addEventListener("visibilitychange", onVisibility);

    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      motionField.time = (now - start) / 1000;
      tickCards();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [editMode]);

  // Mobile: scroll so B-0085 ("original human thought," HOME_MOBILE_ORDER's
  // first entry) sits at the left edge on load, rather than opening on the
  // canvas's raw x:0 — same layout/positions as desktop, just wrapped in a
  // horizontally-scrollable, wider-than-viewport container (see
  // home-brain.css) instead of a viewport-fit one.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const rect = rects.get(HOME_MOBILE_ORDER[0]);
    if (!rect) return;
    wrap.scrollLeft = Math.max(0, rect.x - 90);
  }, [rects]);

  const updateOverride = useCallback((id: string, patch: Partial<NodeOverride>, base: NodeOverride) => {
    setOverrides((prev) => {
      const next = { ...prev, [id]: { ...(prev[id] ?? base), ...patch } };
      saveOverrides(next);
      return next;
    });
  }, []);

  function onNodeDragStart(e: ReactPointerEvent<HTMLDivElement>, id: string, base: NodeOverride) {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvasRect = canvasEl.getBoundingClientRect();
    function onMove(ev: PointerEvent) {
      const x = Math.min(1, Math.max(0, (ev.clientX - canvasRect.left) / canvasRect.width));
      const y = Math.min(1, Math.max(0, (ev.clientY - canvasRect.top) / canvasRect.height));
      updateOverride(id, { x, y }, base);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function onResizeStart(e: ReactPointerEvent<HTMLDivElement>, id: string, base: NodeOverride) {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startScale = base.scale;
    function onMove(ev: PointerEvent) {
      const delta = ev.clientX - startX;
      const scale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, startScale + delta * 0.003));
      updateOverride(id, { scale }, base);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function copyLayout() {
    const text = nodes
      .map((n) => {
        const scalePart = Math.abs(n.scale - HOME_DEFAULT_SCALE) > 0.005 ? `, scale: ${n.scale.toFixed(2)}` : "";
        return `  { id: "${n.id}", x: ${n.x.toFixed(3)}, y: ${n.y.toFixed(3)}${scalePart} },`;
      })
      .join("\n");
    setCopyText(text);
    navigator.clipboard?.writeText(text).catch(() => {
      // clipboard permission denied or unavailable — the textarea this
      // renders (see the edit panel below) is the fallback: select all,
      // copy manually.
    });
  }

  function resetLayout() {
    setOverrides({});
    setCopyText(null);
    try {
      localStorage.removeItem(EDIT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const lines = useMemo<LinePath[]>(() => {
    const out: LinePath[] = [];
    for (const [a, b] of HOME_CONNECTIONS) {
      const ra = rects.get(a);
      const rb = rects.get(b);
      if (!ra || !rb) continue;
      const start = edgePoint(ra.x, ra.y, ra.w / 2 + 5, ra.h / 2 + 5, rb.x, rb.y);
      const end = edgePoint(rb.x, rb.y, rb.w / 2 + 5, rb.h / 2 + 5, ra.x, ra.y);
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.hypot(dx, dy) || 1;
      // Perpendicular unit vector, offset by a seeded fraction of the
      // line's own length — organic/slightly-random per pair, but stable
      // across re-renders and resizes (same seed every time), not
      // re-rolled randomly each measurement pass.
      const px = -dy / len;
      const py = dx / len;
      const rng = createRng(`${a}:${b}:home-line`);
      const jitter = (rng() - 0.5) * len * 0.18;
      const cx = midX + px * jitter;
      const cy = midY + py * jitter;
      out.push({
        key: `${a}-${b}`,
        a,
        b,
        d: `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
      });
    }
    return out;
  }, [rects]);

  const openObject = openId ? (objectsById.get(openId) ?? null) : null;

  return (
    <>
      <div ref={wrapRef} className="home-canvas-wrap">
        <div ref={canvasRef} className="home-canvas">
          <svg className="home-connections" aria-hidden="true">
            {lines.map((l) => (
              <path key={l.key} d={l.d} data-active={hoveredId === l.a || hoveredId === l.b ? "true" : undefined} />
            ))}
          </svg>
          {nodes.map((n) => {
            const o = objectsById.get(n.id);
            if (!o) return null;
            const isActive = hoveredId === n.id;
            const isConnected = !isActive && !!hoveredId && adjacency.get(hoveredId)?.has(n.id);
            const state: "active" | "connected" | "dim" = isActive ? "active" : isConnected ? "connected" : "dim";
            return (
              <div key={n.id} className="home-node-anchor" style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }}>
                <div
                  className="home-node-float"
                  data-hover-state={state}
                  data-edit={editMode || undefined}
                  style={{ transform: `translate(-50%, -50%) scale(${n.scale})` }}
                  ref={(el) => {
                    if (el) nodeRefs.current.set(n.id, el);
                    else nodeRefs.current.delete(n.id);
                  }}
                  onPointerEnter={() => setHoveredId(n.id)}
                  onPointerLeave={() => setHoveredId((cur) => (cur === n.id ? null : cur))}
                  onFocusCapture={() => setHoveredId(n.id)}
                  onBlurCapture={() => setHoveredId((cur) => (cur === n.id ? null : cur))}
                  onPointerDown={(e) => onNodeDragStart(e, n.id, n)}
                >
                  <BrainCard
                    o={o}
                    presentation="home"
                    motionEnhanced={!editMode}
                    onOpen={editMode ? undefined : (obj) => setOpenId(obj.id)}
                  />
                  {editMode && (
                    <div
                      className="home-resize-handle"
                      onPointerDown={(e) => onResizeStart(e, n.id, n)}
                      title="drag to resize"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {editMode && (
        <div className="home-edit-panel">
          <div>edit mode — drag an object to move it, drag its dot to resize</div>
          <div className="home-edit-panel-row">
            <button type="button" onClick={copyLayout}>
              copy layout
            </button>
            <button type="button" onClick={resetLayout}>
              reset
            </button>
          </div>
          {copyText && (
            <textarea readOnly value={copyText} onFocus={(e) => e.currentTarget.select()} spellCheck={false} />
          )}
        </div>
      )}
      {/* Rendered as a sibling of .home-canvas-wrap, not inside it — that
          div's own z-index makes it a stacking context, and BrainFocus's
          .scrim (z-index:50, position:fixed) would otherwise only out-rank
          things *within* that context, not sibling page elements like
          HomeIntro (z-10) above it. As a direct sibling here, its z-index
          is compared at the same level as everything else in <main>, so it
          reliably renders on top the way a modal should. */}
      <BrainFocus o={openObject} onClose={() => setOpenId(null)} />
    </>
  );
}
