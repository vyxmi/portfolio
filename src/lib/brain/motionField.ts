// Single shared, mutable (non-React) state for the Brain page's motion
// system. Both the DOM card animator and the BrainField WebGL scene read
// and write this plain object directly instead of going through React
// state/context — nothing here should trigger a re-render, it's read once
// per animation-frame tick by whoever needs it.
export interface MotionFieldState {
  scrollY: number;
  scrollProgress: number; // 0..1 across the scrollable document height
  velocity: number; // signed, smoothed px/frame
  pointerX: number; // client px
  pointerY: number;
  pointerNX: number; // -1..1, origin at viewport center
  pointerNY: number;
  hoveredAny: boolean; // true while any interactive vessel is hovered/focused
  dragActive: boolean; // true while any card is mid-drag
  reducedMotion: boolean;
  paused: boolean; // tab hidden / low-power gate
  resizing: boolean; // true while the window is actively being resized
  time: number; // running seconds, advances only while !paused
}

export const motionField: MotionFieldState = {
  scrollY: 0,
  scrollProgress: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
  pointerNX: 0,
  pointerNY: 0,
  hoveredAny: false,
  dragActive: false,
  reducedMotion: false,
  paused: false,
  resizing: false,
  time: 0,
};

// CSS Grid reflows during a resize are discontinuous — column/row layout
// can jump instantly as the browser recalculates — while idle-drift and
// scroll-parallax try to smoothly chase a target derived from that layout.
// Recomputing a smooth chase target dozens of times a second against a
// layout that's itself churning is what read as cards "moving around and
// glitching" on resize, no matter how the target itself was smoothed or
// clamped. The fix is to not run that chase at all while a resize is
// actively in progress: tickCards holds cards at their plain grid position
// (see the `motionField.resizing` check there) and this debounce flips
// back to false ~180ms after the last resize event, at which point the
// idle motion eases back in through the same lag interpolation it always
// uses — not a hard cut.
// BrainScrollProvider owns the Lenis instance and registers stop/start here
// once it exists. BrainFocus calls stopBackgroundScroll/startBackgroundScroll
// while a card is expanded — `document.body.style.overflow = "hidden"` alone
// doesn't stop the wall from scrolling, since Lenis drives scroll position
// itself (intercepting wheel/touch) independent of the native overflow
// property. A no-op fallback when nothing's registered (e.g. reduced-motion,
// where BrainScrollProvider never creates a Lenis instance and native
// overflow:hidden already works on its own).
let lenisController: { stop: () => void; start: () => void } | null = null;
export function registerLenisController(controller: { stop: () => void; start: () => void } | null) {
  lenisController = controller;
}
export function stopBackgroundScroll() {
  lenisController?.stop();
}
export function startBackgroundScroll() {
  lenisController?.start();
}

let resizeSettleTimer: ReturnType<typeof setTimeout> | null = null;
export function notifyResizeActivity() {
  motionField.resizing = true;
  if (resizeSettleTimer) clearTimeout(resizeSettleTimer);
  resizeSettleTimer = setTimeout(() => {
    resizeSettleTimer = null;
    motionField.resizing = false;
  }, 180);
}

export interface CardMotionParams {
  depth: number; // 0 (near) .. 1 (far) — also sets parallax reach and lag
  parallax: number; // px of scroll-driven travel at full depth range
  lag: number; // 0..1 lerp factor per tick toward target (lower = laggier)
  scaleReveal: boolean; // whether this card scales 0.95->1 near viewport center

  // Idle multidirectional drift — the dominant motion. Two low-frequency
  // sines per axis (this object's own `duration` as the fundamental, plus
  // a non-integer-ratio second frequency derived from `direction`) are
  // blended in tickCards() so the path never closes into a short, obvious
  // loop, then the composite xy vector is rotated by `direction` so it
  // isn't every object bobbing along the same x/y axes.
  driftAmpX: number; // px, primary drift amplitude
  driftAmpY: number; // px
  rotationAmp: number; // deg — secondary motion, far smaller than drift
  duration: number; // seconds, this object's fundamental drift period
  phase: number; // radians, offsets every sine so cards never move in unison
  direction: number; // radians, orients the drift ellipse + biases rotation lean

  vesselDriftX: number; // independent inner-layer drift for glass materials
  vesselDriftY: number;
}

// Mass-and-inertia state for a card mid-drag (or settling back from one).
// Lives alongside the idle CardMotionParams tick so a dragged card is
// idle-drift + drag-offset composited in one transform, not two competing
// writers — see the compositing at the end of tickCards.
interface CardDragState {
  active: boolean;
  grabX: number; // pointer clientX/Y at drag start
  grabY: number;
  targetX: number; // offset from grab point, px
  targetY: number;
  curX: number; // eased/lagged offset actually applied
  curY: number;
  prevX: number; // previous tick's curX/Y, for velocity-derived rotation
  prevY: number;
  curRot: number;
  curLift: number; // 0..1 eased "picked up off the surface" amount
}

// Smooth, weightless rise-and-settle while a card is hovered — distinct
// from drag's lift (which has a target and mass to chase) in that this one
// just eases toward a resting "risen" state and gently bobs there, the
// anti-gravity feel the drag/idle motion doesn't otherwise cover.
interface CardHoverState {
  active: boolean;
  cur: number; // 0..1 eased toward `active`
}

interface CardEntry {
  el: HTMLElement;
  vesselEl: HTMLElement | null;
  params: CardMotionParams;
  current: { x: number; y: number; rot: number; scale: number };
  drag: CardDragState | null;
  hover: CardHoverState | null;
  docTop: number; // el's top relative to the document, cached — see refreshCardRects
  height: number;
}

const cards = new Map<string, CardEntry>();

// el.getBoundingClientRect() is a forced-synchronous-layout read. Calling
// it per card per animation frame (tickCards used to) is expensive at any
// time and actively fights the browser's own reflow work during a window
// resize, which is what produced the visible stutter/jumping there.
// Instead each card's document-relative rect is cached here and only
// re-measured when layout actually changed — see refreshCardRects.
function measureCard(entry: CardEntry) {
  // Strip the live animated transform before measuring — the card almost
  // always has some idle-drift/parallax offset applied when this runs, and
  // getBoundingClientRect() reports the rendered (transformed) box, not the
  // layout one. Without this, docTop bakes in a snapshot of whatever drift
  // offset happened to be live at that instant.
  const prevTransform = entry.el.style.transform;
  entry.el.style.transform = "none";
  const rect = entry.el.getBoundingClientRect();
  entry.el.style.transform = prevTransform;
  entry.docTop = rect.top + motionField.scrollY;
  entry.height = rect.height;
}

// Call once layout has settled after a reflow that could have moved cards
// (masonry re-spanning rows, a breakpoint changing column count, a card's
// content reflowing). BrainWall's masonry recompute calls this right after
// it finishes writing grid-row spans.
export function refreshCardRects() {
  for (const entry of cards.values()) measureCard(entry);
}

export function registerCard(id: string, el: HTMLElement, params: CardMotionParams) {
  const entry: CardEntry = {
    el,
    vesselEl: params.vesselDriftX || params.vesselDriftY ? el.querySelector<HTMLElement>(".vessel") : null,
    params,
    current: { x: 0, y: 0, rot: 0, scale: params.scaleReveal ? 0.95 : 1 },
    drag: null,
    hover: null,
    docTop: 0,
    height: 0,
  };
  cards.set(id, entry);
  measureCard(entry);
}

// Anti-gravity hover: the card eases toward a risen, gently bobbing state
// while hovered, and back down when it isn't. Suppressed while the same
// card is being dragged (drag owns lift there) so the two never fight.
export function setCardHover(id: string, active: boolean) {
  const entry = cards.get(id);
  if (!entry) return;
  entry.hover = entry.hover ?? { active: false, cur: 0 };
  entry.hover.active = active;
}

export function unregisterCard(id: string) {
  cards.delete(id);
}

function refreshDragActive() {
  motionField.dragActive = false;
  for (const entry of cards.values()) {
    if (entry.drag?.active) {
      motionField.dragActive = true;
      return;
    }
  }
}

// Picking a card up: the offset target starts at zero (the pointer hasn't
// moved from the grab point yet) and everything eases toward it in
// tickCards, so the very first frame of a drag is never a snap.
export function beginCardDrag(id: string, clientX: number, clientY: number) {
  const entry = cards.get(id);
  if (!entry) return;
  entry.drag = entry.drag ?? {
    active: false,
    grabX: 0,
    grabY: 0,
    targetX: 0,
    targetY: 0,
    curX: 0,
    curY: 0,
    prevX: 0,
    prevY: 0,
    curRot: 0,
    curLift: 0,
  };
  entry.drag.active = true;
  entry.drag.grabX = clientX;
  entry.drag.grabY = clientY;
  entry.drag.targetX = 0;
  entry.drag.targetY = 0;
  motionField.dragActive = true;
}

export function dragCardTo(id: string, clientX: number, clientY: number) {
  const entry = cards.get(id);
  if (!entry?.drag) return;
  entry.drag.targetX = clientX - entry.drag.grabX;
  entry.drag.targetY = clientY - entry.drag.grabY;
}

// Release: target snaps back to zero and the existing spring in tickCards
// carries it home — same code path as a live drag, just relaxing rather
// than chasing the pointer, which is what makes the settle feel like the
// same medium rather than a separate "reset" animation.
export function endCardDrag(id: string) {
  const entry = cards.get(id);
  if (!entry?.drag) return;
  entry.drag.active = false;
  entry.drag.targetX = 0;
  entry.drag.targetY = 0;
  refreshDragActive();
}

// Two low-frequency sines per axis, blended — this object's own `duration`
// sets the fundamental angular frequency, and a non-integer-ratio second
// frequency (derived from `direction`, so it's still fully seeded per
// object rather than a shared constant) keeps the composite from ever
// closing into a short, obvious loop. The blended xy vector is then
// rotated by `direction` so objects don't all bob along the same x/y axes
// — that's what makes the field read as irregular/multidirectional rather
// than a wall of cards floating straight up and down in sync. Rotation
// reuses the same two frequencies at a fraction of the weight, so a card's
// tilt drifts in the same unhurried rhythm as its position instead of
// spinning on its own clock.
function idleDrift(params: CardMotionParams, t: number) {
  const omega1 = (Math.PI * 2) / params.duration;
  const ratio2 = 0.32 + 0.22 * (0.5 + 0.5 * Math.sin(params.direction * 3.1));
  const omega2 = omega1 * ratio2;

  const rawX =
    Math.sin(t * omega1 + params.phase) * 0.68 +
    Math.sin(t * omega2 + params.phase * 1.9 + params.direction) * 0.32;
  const rawY =
    Math.sin(t * omega1 * 0.83 + params.phase * 1.3 + params.direction) * 0.62 +
    Math.sin(t * omega2 * 1.21 + params.phase * 0.7) * 0.38;

  const cosA = Math.cos(params.direction);
  const sinA = Math.sin(params.direction);
  const x = (rawX * cosA - rawY * sinA) * params.driftAmpX;
  const y = (rawX * sinA + rawY * cosA) * params.driftAmpY;

  const rotationDir = params.direction < Math.PI ? 1 : -1;
  const rot =
    (Math.sin(t * omega1 * 0.9 + params.phase * 2.3) * 0.7 +
      Math.sin(t * omega2 * 1.4 + params.direction * 1.6) * 0.3) *
    params.rotationAmp *
    rotationDir;

  return { x, y, rot };
}

// Called once per gsap.ticker tick by BrainScrollProvider. Pure DOM writes,
// no React involved — this is the "one animation loop" for card motion.
export function tickCards() {
  if (motionField.reducedMotion || motionField.paused) return;
  const { velocity, time } = motionField;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;

  for (const entry of cards.values()) {
    const { el, vesselEl, params, current, drag, hover } = entry;

    const idle = idleDrift(params, time);

    // Parallax keyed to the card's own position in the viewport (how far
    // its center is from mid-screen, -1..1), not absolute page scrollY.
    // scrollY grows without bound over a long wall — using it directly
    // meant a card far down the page inherited a huge fixed offset the
    // moment it came into view. Viewport-relative is what real scroll
    // parallax means anyway: the offset rides along as the card transits
    // the screen, then settles once it's passed through.
    // center/height come from the cached docTop (see measureCard) rather
    // than a live getBoundingClientRect() — this runs every frame for
    // every card, and a forced-layout read at that frequency is expensive.
    const center = entry.docTop - motionField.scrollY + entry.height / 2;
    // Clamped to -1..1 as documented above — unclamped, a card sitting far
    // outside the viewport accumulates a huge parallax target (invisible
    // while off-screen). If a resize/reflow then relocates that card into
    // view — e.g. a masonry column-count change — it visibly sprints to
    // catch up to that stale target instead of drifting in gently.
    const viewportProgress = vh > 0 ? Math.max(-1, Math.min(1, (center - vh / 2) / (vh / 2))) : 0;
    const parallaxY = -viewportProgress * params.parallax;

    // While the window is actively resizing, the grid layout itself is
    // churning (see notifyResizeActivity above) — idle drift and parallax
    // would be chasing a target that's being recomputed against a moving
    // floor. Target the neutral rest pose instead so the card just sits at
    // its plain grid position; current.* still eases toward it through the
    // normal lag below, so this is a smooth settle, not a snap, and the
    // drift/parallax motion eases back in the same way once resizing ends.
    const hovered = !!hover?.active;
    const targetX = motionField.resizing ? 0 : hovered ? current.x : idle.x;
    // Hover freezes drift too, but at wherever the card *currently* is, not
    // the neutral rest pose — continuous idle drift means a vessel's own
    // controls (read-more, gallery, external-link) can slide under a
    // cursor that's holding still to click. Snapping the target to the
    // neutral pose (like resizing does) would ease the card *back toward
    // rest* over the next several frames — moving the exact thing the
    // cursor is aimed at. Targeting current.x/y/rot instead means the
    // (target - current) delta each tick is already ~0: the card simply
    // stops advancing, in place, with no settle-motion at all.
    const targetY = motionField.resizing ? 0 : hovered ? current.y : idle.y + parallaxY;
    const targetRot = motionField.resizing ? 0 : hovered ? current.rot : idle.rot;

    let targetScale = 1;
    if (params.scaleReveal && !motionField.resizing) {
      const dist = Math.abs(center - vh / 2) / (vh / 2 + entry.height);
      targetScale = 1 - Math.min(dist, 1) * 0.05;
    }

    current.x += (targetX - current.x) * params.lag;
    current.y += (targetY - current.y) * params.lag;
    current.rot += (targetRot - current.rot) * params.lag;
    current.scale += (targetScale - current.scale) * params.lag;

    // A hint of velocity-driven stretch keeps fast scroll feeling fluid
    // rather than mapping 1:1 — clamped so it never reads as a glitch.
    const stretch = Math.max(-0.06, Math.min(0.06, velocity * -0.0015 * (1 - params.depth)));

    // Drag/settle: mass-and-inertia offset composited on top of the idle
    // transform above, not a separate transform — a dragged card still
    // drifts and parallaxes underneath the hand moving it. Heavier lag
    // while actively chasing the pointer than while settling reads as
    // "this object has weight," not "this object is elastic."
    let dragX = 0;
    let dragY = 0;
    let dragRot = 0;
    let liftScale = 1;
    if (drag) {
      const lag = drag.active ? 0.22 : 0.15;
      drag.curX += (drag.targetX - drag.curX) * lag;
      drag.curY += (drag.targetY - drag.curY) * lag;
      const liftTarget = drag.active ? 1 : 0;
      drag.curLift += (liftTarget - drag.curLift) * 0.12;

      const velX = drag.curX - drag.prevX;
      drag.prevX = drag.curX;
      drag.prevY = drag.curY;
      const targetRotDrag = Math.max(-1.5, Math.min(1.5, velX * 0.55));
      drag.curRot += (targetRotDrag - drag.curRot) * 0.16;

      dragX = drag.curX;
      dragY = drag.curY - drag.curLift * 10;
      dragRot = drag.curRot;
      liftScale = 1 + drag.curLift * 0.025;

      if (!drag.active && Math.abs(drag.curX) < 0.05 && Math.abs(drag.curY) < 0.05 && drag.curLift < 0.01) {
        entry.drag = null;
      }
    }

    // Anti-gravity hover: a slow, weightless rise that holds once risen —
    // no continuous bob layered on top, unlike the old version of this
    // effect. A hovered card is exactly where a user is about to click
    // (read-more, gallery, external-link…) and a never-ending sine wobble
    // here meant that target kept sliding under the cursor for as long as
    // the card stayed hovered, not just during the idle drift this same
    // hover state already freezes above. Suppressed while this same card
    // is mid-drag so it hands off to drag's own lift instead of fighting
    // it.
    let hoverY = 0;
    let hoverScale = 1;
    if (hover) {
      const target = hover.active && !drag?.active ? 1 : 0;
      hover.cur += (target - hover.cur) * 0.05;
      if (hover.cur > 0.001) {
        hoverY = -hover.cur * 9;
        hoverScale = 1 + hover.cur * 0.018;
      }
    }

    const finalX = current.x + dragX;
    const finalY = current.y + dragY + hoverY;
    const finalRot = current.rot + dragRot;
    const scaleX = (current.scale + stretch) * liftScale * hoverScale;
    const scaleY = (current.scale - stretch) * liftScale * hoverScale;

    el.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) rotate(${finalRot.toFixed(2)}deg) scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`;

    if (vesselEl) {
      const vx = params.vesselDriftX ? Math.sin(time * 0.11 + params.phase * 2.1) * params.vesselDriftX : 0;
      const vy = params.vesselDriftY ? Math.sin(time * 0.15 + params.phase * 1.7) * params.vesselDriftY : 0;
      vesselEl.style.transform = `translate3d(${vx.toFixed(2)}px, ${vy.toFixed(2)}px, 0)`;
    }
  }
}
