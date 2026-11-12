// JellyfishHero: a full-screen underwater background for Framer.
//
// Paste this whole file into Framer: Assets → Code → "+" → New Code File,
// name it JellyfishHero, then drag the component onto the page.
// The ocean sound is a separate component (OceanSound.tsx).
//
// How it is drawn:
// - Three depth layers. Far jellyfish and particles are drawn small and then
//   scaled up, so they come out soft and out of focus; near ones stay sharp.
// - A bloom pass spreads a soft haze of light around the bright parts.
// - Each jellyfish is built from translucent layers: an outer glow, a bell
//   membrane that is clear in the middle and brighter at its curved edge,
//   an inner membrane, a wobbling scalloped rim with a fringe of fine hairs,
//   four horseshoe gonads, frilly ribbon-like oral arms and tentacles that
//   fade toward their tips. Each one has its own tint, shape and rhythm.
// - Faint light rays and drifting haze sit behind everything. Marine snow
//   drifts through every layer, and a few large blurred specks float right
//   in front of the "lens".
// - Jellyfish pulse, glide and drift toward the cursor (or a touch point).
// - Phones get a lighter version. Animation pauses when scrolled away.

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 900
 */

type RGB = [number, number, number]

interface Props {
    count: number
    mobileCount: number
    size: number
    speed: number
    cursorPull: number
    glow: number
    particles: number
    rays: number
    depthBlur: number
    darkness: number
    bodyColor: string
    coreColor: string
    background: string
    autoQuality?: boolean
    style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TAU = Math.PI * 2

function toRGB(color: string, fallback: RGB): RGB {
    if (typeof document === "undefined" || !color) return fallback
    // Framer color styles arrive as var(--token, rgb(...)): use the fallback value.
    const v = color.match(/var\([^,]+,\s*(.+)\)\s*$/)
    if (v) color = v[1]
    const c = document.createElement("canvas").getContext("2d")
    if (!c) return fallback
    c.fillStyle = "#000"
    c.fillStyle = color
    const s = String(c.fillStyle)
    if (s[0] === "#" && s.length >= 7) {
        return [
            parseInt(s.slice(1, 3), 16),
            parseInt(s.slice(3, 5), 16),
            parseInt(s.slice(5, 7), 16),
        ]
    }
    const m = s.match(/[\d.]+/g)
    return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : fallback
}

const rgba = (c: RGB, a: number) =>
    "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (a < 0 ? 0 : a > 1 ? 1 : a) + ")"

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

function wrapAngle(a: number) {
    while (a > Math.PI) a -= TAU
    while (a < -Math.PI) a += TAU
    return a
}

// Smooth, cheap pseudo-noise in about -1..1, from a few unrelated sines.
function wob(seed: number, x: number) {
    return (
        Math.sin(x + seed) * 0.5 +
        Math.sin(x * 2.13 + seed * 1.7) * 0.3 +
        Math.sin(x * 4.37 + seed * 2.9) * 0.2
    )
}

function mix(a: RGB, b: RGB, k: number): RGB {
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)]
}

// Nudge a color toward cyan (k < 0) or violet (k > 0) and scale its brightness.
function shade(c: RGB, k: number, b: number): RGB {
    return [
        clamp(c[0] * (1 + 0.24 * k) * b, 0, 255),
        clamp(c[1] * (1 - 0.07 * k) * b, 0, 255),
        clamp(c[2] * (1 + 0.04 * k) * b, 0, 255),
    ]
}

function makeCanvas(w: number, h: number) {
    const cv = document.createElement("canvas")
    cv.width = Math.max(1, Math.ceil(w))
    cv.height = Math.max(1, Math.ceil(h))
    return cv
}

function sizeCanvas(cv: HTMLCanvasElement, w: number, h: number) {
    const nw = Math.max(1, Math.ceil(w))
    const nh = Math.max(1, Math.ceil(h))
    if (cv.width !== nw) cv.width = nw
    if (cv.height !== nh) cv.height = nh
}

// Soft round sprites. Stops are [offset, alpha] pairs.
const GAUSS = [0, 1, 0.08, 0.86, 0.18, 0.6, 0.3, 0.33, 0.45, 0.13, 0.62, 0.04, 0.8, 0.01, 1, 0]
const TIGHT = [0, 1, 0.12, 0.62, 0.3, 0.17, 0.6, 0.03, 1, 0]
const BOKEH = [0, 0.3, 0.55, 0.36, 0.8, 0.5, 0.9, 0.3, 1, 0]

function makeSprite(color: RGB, size: number, stops: number[]) {
    const cv = makeCanvas(size, size)
    const g = cv.getContext("2d")!
    const m = size / 2
    const grad = g.createRadialGradient(m, m, 0, m, m, m)
    for (let i = 0; i < stops.length; i += 2) grad.addColorStop(stops[i], rgba(color, stops[i + 1]))
    g.fillStyle = grad
    g.fillRect(0, 0, size, size)
    return cv
}

// An irregular clump of marine snow: a few soft dots overlapping.
function makeFlake(color: RGB) {
    const s = 48
    const cv = makeCanvas(s, s)
    const g = cv.getContext("2d")!
    g.globalCompositeOperation = "lighter"
    const n = 3 + Math.floor(Math.random() * 5)
    for (let i = 0; i < n; i++) {
        const ang = rand(0, TAU)
        const d = rand(0, 9)
        const x = s / 2 + Math.cos(ang) * d
        const y = s / 2 + Math.sin(ang) * d * rand(0.4, 1)
        const rr = rand(2, 7)
        const grad = g.createRadialGradient(x, y, 0, x, y, rr)
        grad.addColorStop(0, rgba(color, rand(0.25, 0.7)))
        grad.addColorStop(1, rgba(color, 0))
        g.fillStyle = grad
        g.fillRect(x - rr, y - rr, rr * 2, rr * 2)
    }
    return cv
}

// Fine grain laid over the background so its gradients don't band.
function makeGrain() {
    const s = 128
    const cv = makeCanvas(s, s)
    const g = cv.getContext("2d")!
    const img = g.createImageData(s, s)
    for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 48
        img.data[i] = v * 0.8
        img.data[i + 1] = v * 0.9
        img.data[i + 2] = v
        img.data[i + 3] = 255
    }
    g.putImageData(img, 0, 0)
    return cv
}

// A soft beam of light: narrow at the top, wider and fading further down.
function makeRayTexture(color: RGB) {
    const w = 64
    const h = 256
    const cv = makeCanvas(w, h)
    const g = cv.getContext("2d")!
    for (let y = 0; y < h; y += 2) {
        const half = (w / 2) * lerp(0.35, 1, y / h)
        const gr = g.createLinearGradient(w / 2 - half, 0, w / 2 + half, 0)
        gr.addColorStop(0, rgba(color, 0))
        gr.addColorStop(0.2, rgba(color, 0.12))
        gr.addColorStop(0.36, rgba(color, 0.55))
        gr.addColorStop(0.5, rgba(color, 1))
        gr.addColorStop(0.64, rgba(color, 0.55))
        gr.addColorStop(0.8, rgba(color, 0.12))
        gr.addColorStop(1, rgba(color, 0))
        g.fillStyle = gr
        g.fillRect(w / 2 - half, y, half * 2, 2)
    }
    g.globalCompositeOperation = "destination-in"
    const v = g.createLinearGradient(0, 0, 0, h)
    v.addColorStop(0, "rgba(0,0,0,1)")
    v.addColorStop(0.35, "rgba(0,0,0,0.45)")
    v.addColorStop(1, "rgba(0,0,0,0)")
    g.fillStyle = v
    g.fillRect(0, 0, w, h)
    return cv
}

// Draw a smooth curve through points a[start .. start + n).
function smoothPath(g: CanvasRenderingContext2D, a: Float32Array, start: number, n: number, closed: boolean) {
    const s = start * 2
    if (closed) {
        const lx = a[s + (n - 1) * 2]
        const ly = a[s + (n - 1) * 2 + 1]
        g.moveTo((lx + a[s]) / 2, (ly + a[s + 1]) / 2)
        for (let i = 0; i < n; i++) {
            const i1 = i + 1 < n ? i + 1 : 0
            const x = a[s + i * 2]
            const y = a[s + i * 2 + 1]
            g.quadraticCurveTo(x, y, (x + a[s + i1 * 2]) / 2, (y + a[s + i1 * 2 + 1]) / 2)
        }
        g.closePath()
        return
    }
    g.moveTo(a[s], a[s + 1])
    for (let i = 1; i < n - 1; i++) {
        const x = a[s + i * 2]
        const y = a[s + i * 2 + 1]
        g.quadraticCurveTo(x, y, (x + a[s + i * 2 + 2]) / 2, (y + a[s + i * 2 + 3]) / 2)
    }
    g.lineTo(a[s + (n - 1) * 2], a[s + (n - 1) * 2 + 1])
}

// Scratch buffers shared by the drawing code (one frame draws at a time).
const TOP = new Float32Array(2 * 32)
const RIM = new Float32Array(2 * 44)
const FILL = new Float32Array(2 * 80)
const CL = new Float32Array(2 * 40)
const LE = new Float32Array(2 * 40)
const RE = new Float32Array(2 * 40)

// ---------------------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------------------

// A tentacle or oral arm: a chain of points integrated with Verlet and kept at
// a fixed segment length, so it lags behind the bell and swings with the pulse.
interface Strand {
    n: number
    seg: number
    pts: Float32Array
    prev: Float32Array
    kind: 0 | 1 // 0 = marginal tentacle, 1 = oral arm
    anchor: number // rim angle (tentacles) or arm offset (arms)
    phase: number
    back: boolean // hangs from the far side of the rim, drawn dimmer
    wf: number // width factor (oral arms)
}

interface Jelly {
    x: number
    y: number
    vx: number
    vy: number
    a: number // heading; 0 = swimming up
    r: number
    z: number // depth 0..1 (1 = closest)
    view: number // 0 = seen side-on, 1 = seen from above
    phase: number
    rate: number
    resp: number
    seed: number
    c: number // current contraction 0..1
    wx: number
    wy: number
    wanderAt: number
    strands: Strand[]
    // cached geometry for this frame
    w: number
    h: number
    e: number
    wr: number
    // look
    layer: number // 0 far, 1 middle, 2 near
    bright: number
    shape: number
    scal: number
    gonRot: number
    tint: RGB
    glowTint: RGB
    gonadTint: RGB
    halo: HTMLCanvasElement
    rimK: number[]
    hairs: Float32Array // [angle, length, phase] per hair, near side first
    hairsFront: number
    sparks: Float32Array // [angle, speed, phase] per glint
    gon: Float32Array // [size, seed, gap] per gonad
}

const CONTRACT = 0.3 // fraction of the pulse cycle spent contracting

function bellGeometry(j: Jelly) {
    const c = j.c
    const w = j.r * (1 - 0.15 * c)
    const hBase = j.r * (0.5 + 0.24 * c)
    const h = hBase + (w * 0.95 - hBase) * j.view * 0.7
    const e = h * 0.1 + j.view * w * 0.4
    j.w = w
    j.h = h
    j.e = e
    j.wr = w * (1 - 0.07 * c) // the rim pinches in a little more than the dome
}

// Local bell coordinates: rim centre at (0,0), dome toward -y.
function anchorLocal(j: Jelly, s: Strand): [number, number] {
    if (s.kind === 0) {
        const th = s.anchor
        return [Math.cos(th) * j.wr * 0.96, Math.sin(th) * j.e]
    }
    return [s.anchor * j.r, j.e * 0.35]
}

function toWorld(j: Jelly, lx: number, ly: number): [number, number] {
    const ca = Math.cos(j.a)
    const sa = Math.sin(j.a)
    return [j.x + lx * ca - ly * sa, j.y + lx * sa + ly * ca]
}

function makeStrand(n: number, seg: number, kind: 0 | 1, anchor: number, back = false, wf = 1): Strand {
    return {
        n,
        seg,
        pts: new Float32Array(n * 2),
        prev: new Float32Array(n * 2),
        kind,
        anchor,
        phase: rand(0, TAU),
        back,
        wf,
    }
}

function makeJelly(W: number, H: number, base: number, lite: boolean, z: number, body: RGB, core: RGB): Jelly {
    const r = base * (0.45 + 0.8 * z) * rand(0.8, 1.2)
    const layer = z < 0.34 ? 0 : z < 0.64 ? 1 : 2
    const hue = rand(-1, 0.7)
    const tint = shade(body, hue, rand(0.82, 1.1))
    const j: Jelly = {
        x: rand(0, W),
        y: rand(0, H),
        vx: 0,
        vy: 0,
        a: rand(-0.6, 0.6),
        r,
        z,
        view: Math.pow(Math.random(), 1.4),
        phase: Math.random(),
        rate: rand(0.38, 0.6) * (0.75 + 0.25 * z),
        resp: rand(0.35, 1),
        seed: rand(0, 1000),
        c: 0,
        wx: rand(W * 0.1, W * 0.9),
        wy: rand(H * 0.1, H * 0.9),
        wanderAt: rand(4, 12),
        strands: [],
        w: r,
        h: r * 0.5,
        e: r * 0.1,
        wr: r,
        layer,
        bright: rand(0.75, 1.15),
        shape: rand(0.9, 1.1),
        scal: rand(0, TAU),
        gonRot: rand(-0.35, 0.35),
        tint,
        glowTint: shade(core, hue * 0.5, 1),
        gonadTint: mix(core, shade(core, hue + rand(-0.6, 0.6), 1), 0.6),
        halo: makeSprite(tint, 96, GAUSS),
        rimK: [rand(0.3, 1), rand(0.3, 1), rand(0.3, 1), rand(0.3, 1)],
        hairs: new Float32Array(0),
        hairsFront: 0,
        sparks: new Float32Array(0),
        gon: new Float32Array(12),
    }
    bellGeometry(j)

    // Far jellyfish are blurred anyway, so they get fewer parts.
    const far = layer === 0
    const front = lite ? 10 : far ? 10 : 18
    const back = lite || far ? 0 : 8
    const wisps = lite || far ? 1 : 3
    const tSeg = lite ? 5 : 7
    for (let i = 0; i < front; i++) {
        const th = lerp(0.1, Math.PI - 0.1, (i + rand(-0.35, 0.35)) / (front - 1))
        const len = j.r * rand(0.25, 0.6)
        j.strands.push(makeStrand(tSeg, len / tSeg, 0, th))
    }
    for (let i = 0; i < back; i++) {
        const th = Math.PI + lerp(0.15, Math.PI - 0.15, (i + rand(-0.35, 0.35)) / (back - 1))
        const len = j.r * rand(0.2, 0.45)
        j.strands.push(makeStrand(tSeg, len / tSeg, 0, th, true))
    }
    for (let i = 0; i < wisps; i++) {
        const n = tSeg + 3
        const len = j.r * rand(0.9, 1.7)
        j.strands.push(makeStrand(n, len / n, 0, rand(0.2, Math.PI - 0.2)))
    }
    const aSeg = lite || far ? 7 : 11
    for (let i = 0; i < 4; i++) {
        const off = (i - 1.5) * 0.11 + rand(-0.03, 0.03)
        const len = j.r * rand(1.0, 2.1)
        j.strands.push(makeStrand(aSeg, len / aSeg, 1, off, false, rand(0.7, 1.25)))
    }
    for (const s of j.strands) placeStrand(j, s)

    // The fringe of fine hairs around the rim.
    const nh = far ? 0 : lite ? 22 : layer === 2 ? 64 : 34
    const nearSide: number[] = []
    const farSide: number[] = []
    for (let i = 0; i < nh; i++) {
        const phi = ((i + Math.random()) / nh) * TAU
        const list = Math.sin(phi) >= 0 ? nearSide : farSide
        list.push(phi, rand(0.08, 0.3), rand(0, TAU))
    }
    j.hairs = new Float32Array(nearSide.concat(farSide))
    j.hairsFront = nearSide.length / 3

    // Little glints of light on the rim of the nearest ones.
    if (layer === 2 && !lite) {
        const sp: number[] = []
        for (let i = 0; i < 5; i++) sp.push(rand(0.15, Math.PI - 0.15), rand(0.25, 0.8), rand(0, TAU))
        j.sparks = new Float32Array(sp)
    }
    for (let k = 0; k < 4; k++) {
        j.gon[k * 3] = rand(0.85, 1.15)
        j.gon[k * 3 + 1] = rand(0, 100)
        j.gon[k * 3 + 2] = rand(0.45, 0.8)
    }
    return j
}

// Lay a strand straight out behind the bell (used at spawn and after wrapping).
function placeStrand(j: Jelly, s: Strand) {
    const [lx, ly] = anchorLocal(j, s)
    for (let i = 0; i < s.n; i++) {
        const [x, y] = toWorld(j, lx, ly + i * s.seg)
        s.pts[i * 2] = s.prev[i * 2] = x
        s.pts[i * 2 + 1] = s.prev[i * 2 + 1] = y
    }
}

function shiftJelly(j: Jelly, dx: number, dy: number) {
    j.x += dx
    j.y += dy
    for (const s of j.strands) {
        for (let i = 0; i < s.n; i++) {
            s.pts[i * 2] += dx
            s.pts[i * 2 + 1] += dy
            s.prev[i * 2] += dx
            s.prev[i * 2 + 1] += dy
        }
    }
}

// The bell's outline for this frame, in local coordinates: TOP is the dome
// from the left rim over to the right rim, RIM is the full rim ellipse
// (near side first, then the far side), with a closing duplicate point.
function bellOutline(j: Jelly, t: number, nTop: number, nRim: number) {
    const { w, h, e, c, r, seed } = j
    const q = j.shape * lerp(1.05, 0.9, c)
    const pinch = j.wr / w
    const cy = -h * 0.35
    const wobK = r * 0.026 * (0.7 + 0.6 * c)
    for (let i = 0; i < nTop; i++) {
        const th = Math.PI * (1 - i / (nTop - 1))
        const cs = Math.cos(th)
        const sn = Math.max(0, Math.sin(th))
        let x = (cs < 0 ? -Math.pow(-cs, q) : Math.pow(cs, q)) * w
        x *= lerp(pinch, 1, Math.pow(sn, 0.6))
        const y = -Math.pow(sn, q) * h
        const d = wobK * wob(seed, th * 2.6 + t * 0.7)
        const ny = y - cy
        const nl = Math.hypot(x, ny) || 1
        TOP[i * 2] = x + (x / nl) * d
        TOP[i * 2 + 1] = y + (ny / nl) * d
    }
    for (let i = 0; i <= nRim; i++) {
        const ph = (i / nRim) * TAU
        // Eight shallow notches (the lappets of a moon jelly) and a slow wobble.
        const notch = Math.pow(1 - Math.abs(Math.sin(ph * 4 + j.scal)), 3)
        const k = (1 - 0.04 * notch) * (1 + 0.025 * wob(seed + 7, ph * 3 + t * 0.9))
        RIM[i * 2] = Math.cos(ph) * j.wr * k
        RIM[i * 2 + 1] = Math.sin(ph) * e * k + e * 0.08 * wob(seed + 11, ph * 2 + t * 1.1)
    }
}

// Catmull-Rom curve through a strand's points, written into CL.
function centerline(s: Strand, sub: number) {
    const p = s.pts
    const n = s.n
    let k = 0
    for (let i = 0; i < n - 1; i++) {
        const i0 = i > 0 ? i - 1 : 0
        const i2 = i + 1
        const i3 = i + 2 < n ? i + 2 : n - 1
        for (let q = 0; q < sub; q++) {
            const u = q / sub
            const u2 = u * u
            const u3 = u2 * u
            for (let d = 0; d < 2; d++) {
                const p0 = p[i0 * 2 + d]
                const p1 = p[i * 2 + d]
                const p2 = p[i2 * 2 + d]
                const p3 = p[i3 * 2 + d]
                CL[k * 2 + d] =
                    0.5 *
                    (2 * p1 +
                        (p2 - p0) * u +
                        (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
                        (3 * p1 - p0 - 3 * p2 + p3) * u3)
            }
            k++
        }
    }
    CL[k * 2] = p[(n - 1) * 2]
    CL[k * 2 + 1] = p[(n - 1) * 2 + 1]
    return k + 1
}

// The two frilly edges (LE, RE) of a ribbon that follows CL. The ribbon
// widens below the mouth, tapers to the tip, and narrows where it twists.
function ribbon(m: number, base: number, tt: number, ph: number, sway: number, wk: number, frill: number) {
    for (let k = 0; k < m; k++) {
        const u = k / (m - 1)
        const k0 = k > 0 ? k - 1 : 0
        const k1 = k < m - 1 ? k + 1 : m - 1
        const tx = CL[k1 * 2] - CL[k0 * 2]
        const ty = CL[k1 * 2 + 1] - CL[k0 * 2 + 1]
        const tl = Math.hypot(tx, ty) || 1
        const nx = -ty / tl
        const ny = tx / tl
        const prof = Math.sin(Math.PI * (0.15 + 0.85 * Math.pow(u, 0.75)))
        const twist = 0.35 + 0.65 * Math.abs(Math.sin(u * 4.2 - tt * 0.8 + ph))
        const ww = base * prof * twist * wk
        const fr = frill * Math.min(1, u * 3)
        const f1 = 1 + fr * Math.sin(u * 27 + tt * 2.1 + ph)
        const f2 = 1 + fr * Math.sin(u * 23 - tt * 1.7 + ph * 1.3)
        const sh = sway * base * prof * Math.sin(u * 7 - tt * 1.3 + ph)
        const cx = CL[k * 2] + nx * sh
        const cy = CL[k * 2 + 1] + ny * sh
        LE[k * 2] = cx + nx * ww * f1
        LE[k * 2 + 1] = cy + ny * ww * f1
        RE[k * 2] = cx - nx * ww * f2
        RE[k * 2 + 1] = cy - ny * ww * f2
    }
}

function ribbonPath(g: CanvasRenderingContext2D, m: number) {
    g.moveTo(LE[0], LE[1])
    for (let k = 1; k < m; k++) g.lineTo(LE[k * 2], LE[k * 2 + 1])
    for (let k = m - 1; k >= 0; k--) g.lineTo(RE[k * 2], RE[k * 2 + 1])
    g.closePath()
}

function polyline(g: CanvasRenderingContext2D, a: Float32Array, m: number) {
    g.moveTo(a[0], a[1])
    for (let k = 1; k < m; k++) g.lineTo(a[k * 2], a[k * 2 + 1])
}

// One piece of a strand's smooth curve (pieces 1 .. n-1).
function strandPiece(g: CanvasRenderingContext2D, p: Float32Array, n: number, k: number) {
    const x = p[k * 2]
    const y = p[k * 2 + 1]
    if (k === 1) g.moveTo(p[0], p[1])
    else g.moveTo((p[k * 2 - 2] + x) / 2, (p[k * 2 - 1] + y) / 2)
    if (k === n - 1) g.lineTo(x, y)
    else g.quadraticCurveTo(x, y, (x + p[k * 2 + 2]) / 2, (y + p[k * 2 + 3]) / 2)
}

interface Mote {
    x: number
    y: number
    z: number
    vx: number
    vy: number
    tw: number
    s: number // drawn size
    k: number // 0 speck, 1 flake, 2 bokeh
    f: number // flake sprite
    a: number
}

interface Ray {
    x: number
    w: number
    ang: number
    len: number
    ph: number
    fs: number
    k: number
}

interface Haze {
    x: number
    y: number
    r: number
    vx: number
    vy: number
    a: number
}

interface Opts {
    count: number
    mobileCount: number
    size: number
    speed: number
    cursorPull: number
    glow: number
    particles: number
    rays: number
    depthBlur: number
    darkness: number
    body: RGB
    core: RGB
    bg: RGB
}

const TENT_ALPHA = [1, 0.55, 0.22]
const TENT_WIDTH = [1, 0.75, 0.5]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function JellyfishHero(props: Props) {
    const {
        count = 14,
        mobileCount = 6,
        size = 1,
        speed = 1,
        cursorPull = 0.7,
        glow = 1,
        particles = 1,
        rays = 0.4,
        depthBlur = 0.8,
        darkness = 0.6,
        bodyColor = "#6FA0FF",
        coreColor = "#DCEAFF",
        background = "#010207",
        autoQuality = true,
        style,
    } = props

    const rootRef = useRef<HTMLDivElement>(null)
    const bgRef = useRef<HTMLCanvasElement>(null)
    const raysRef = useRef<HTMLCanvasElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const optsRef = useRef<Opts>({
        count,
        mobileCount,
        size,
        speed,
        cursorPull,
        glow,
        particles,
        rays,
        depthBlur,
        darkness,
        body: [111, 160, 255],
        core: [220, 234, 255],
        bg: [1, 2, 7],
    })
    const o = optsRef.current
    o.count = count
    o.mobileCount = mobileCount
    o.size = size
    o.speed = speed
    o.cursorPull = cursorPull
    o.glow = glow
    o.particles = particles
    o.rays = rays
    o.depthBlur = depthBlur
    o.darkness = darkness

    const [colorKey, setColorKey] = useState(0)
    useEffect(() => {
        o.body = toRGB(bodyColor, [111, 160, 255])
        o.core = toRGB(coreColor, [220, 234, 255])
        o.bg = toRGB(background, [1, 2, 7])
        setColorKey((k) => k + 1)
    }, [bodyColor, coreColor, background])

    // Main animation loop. Rebuilds the scene when the count, size or colors change.
    useEffect(() => {
        const root = rootRef.current
        const canvas = canvasRef.current
        const bgCanvas = bgRef.current
        const raysCanvas = raysRef.current
        if (!root || !canvas || !bgCanvas || !raysCanvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const reduceMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
        const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false

        // Offscreen layers: far and middle depth (drawn small and scaled up,
        // so they come out soft) and three small canvases for the bloom.
        const deep = makeCanvas(1, 1)
        const mid = makeCanvas(1, 1)
        const b1 = makeCanvas(1, 1)
        const b2 = makeCanvas(1, 1)
        const b3 = makeCanvas(1, 1)
        const dctx = deep.getContext("2d")!
        const mctx = mid.getContext("2d")!
        const b1ctx = b1.getContext("2d")!
        const b2ctx = b2.getContext("2d")!
        const b3ctx = b3.getContext("2d")!

        const speckColor = mix(o.body, o.core, 0.5)
        const coreSprite = makeSprite(o.core, 64, GAUSS)
        const sparkSprite = makeSprite(o.core, 32, TIGHT)
        const speckSprite = makeSprite(speckColor, 16, TIGHT)
        const bokehSprite = makeSprite(mix(o.body, o.core, 0.3), 128, BOKEH)
        const flakes: HTMLCanvasElement[] = []
        for (let i = 0; i < 6; i++) flakes.push(makeFlake(mix(o.body, o.core, 0.35)))
        const grain = makeGrain()
        const rayTex = makeRayTexture(o.body)

        let W = 0
        let H = 0
        let dpr = 1
        let lite = false
        let sDeep = 0.3
        let sMid = 0.6
        // Quality steps down if the device can't keep up:
        // 0 = full, 1 = no bloom and 1x pixels, 2 = also simpler jellyfish.
        let quality = 0
        let slowTime = 0
        let jellies: Jelly[] = []
        let motes: Mote[] = []
        let motesFar: Mote[] = []
        let motesMid: Mote[] = []
        let motesNear: Mote[] = []
        let bokeh: Mote[] = []
        let rayList: Ray[] = []
        let hazes: Haze[] = []
        let t = 0 // real time, drives the swimming
        let tt = 0 // time scaled by Speed, drives the shimmer and wobble
        let raf = 0
        let last = performance.now()
        let visible = true
        let parX = 0
        let parY = 0
        const pointer = { x: 0, y: 0, at: -100, inside: false }

        const build = () => {
            const base = Math.min(W, H) * (lite ? 0.085 : 0.06) * o.size
            const n = Math.max(0, Math.round(lite ? o.mobileCount : o.count))
            jellies = []
            for (let i = 0; i < n; i++) {
                // Spread depths evenly so there is always some foreground and background.
                const z = Math.min(1, (i + Math.random()) / Math.max(1, n))
                jellies.push(makeJelly(W, H, base, lite, z, o.body, o.core))
            }
            jellies.sort((a, b) => a.z - b.z)

            const moteCount = Math.round(
                Math.min(lite ? 80 : 260, (W * H) / (lite ? 5000 : 6000)) * o.particles
            )
            motes = []
            for (let i = 0; i < moteCount; i++) {
                const z = Math.random()
                const flake = Math.random() < 0.28
                motes.push({
                    x: rand(0, W),
                    y: rand(0, H),
                    z,
                    vx: rand(-1.5, 1.5),
                    vy: rand(-6, 4),
                    tw: rand(0, TAU),
                    s: flake ? rand(5, 11) * (0.5 + z) : rand(1.6, 3.2) * (0.6 + 0.8 * z),
                    k: flake ? 1 : 0,
                    f: Math.floor(Math.random() * flakes.length),
                    a: flake ? rand(0.1, 0.28) : rand(0.25, 0.7),
                })
            }
            motesFar = motes.filter((m) => m.z < 0.34)
            motesMid = motes.filter((m) => m.z >= 0.34 && m.z < 0.66)
            motesNear = motes.filter((m) => m.z >= 0.66)
            bokeh = []
            const nb = Math.round((lite ? 4 : 9) * o.particles)
            for (let i = 0; i < nb; i++) {
                bokeh.push({
                    x: rand(0, W),
                    y: rand(0, H),
                    z: 1.3,
                    vx: rand(-2, 2),
                    vy: rand(-3, 3),
                    tw: rand(0, TAU),
                    s: rand(24, 80) * (lite ? 0.7 : 1),
                    k: 2,
                    f: 0,
                    a: rand(0.025, 0.06),
                })
            }

            rayList = []
            const nr = lite ? 3 : 5
            const slant = rand(-0.22, 0.22)
            for (let i = 0; i < nr; i++) {
                rayList.push({
                    x: lerp(0.12, 0.88, (i + rand(0.1, 0.9)) / nr),
                    w: rand(0.025, 0.08),
                    ang: slant + rand(-0.06, 0.06),
                    len: rand(0.7, 1.25),
                    ph: rand(0, TAU),
                    fs: rand(0.15, 0.4),
                    k: rand(0.5, 1),
                })
            }
            hazes = []
            for (let i = 0; i < (lite ? 3 : 5); i++) {
                hazes.push({
                    x: rand(0, W),
                    y: rand(0, H),
                    r: rand(0.25, 0.55) * Math.max(W, H),
                    vx: rand(-6, 6),
                    vy: rand(-3, 3),
                    a: rand(0.01, 0.024),
                })
            }
        }

        // The background is static, so it lives on its own canvas underneath.
        const paintBackground = () => {
            sizeCanvas(bgCanvas, W, H)
            const g = bgCanvas.getContext("2d")!
            g.setTransform(1, 0, 0, 1, 0, 0)
            g.fillStyle = rgba(o.bg, 1)
            g.fillRect(0, 0, W, H)
            const lightK = 1 - 0.7 * o.darkness
            // Faint light from the surface.
            const top = g.createRadialGradient(W * 0.5, -H * 0.25, 0, W * 0.5, -H * 0.25, H * 1.25)
            top.addColorStop(0, rgba(o.body, 0.11 * lightK))
            top.addColorStop(0.45, rgba(o.body, 0.035 * lightK))
            top.addColorStop(1, rgba(o.body, 0))
            g.fillStyle = top
            g.fillRect(0, 0, W, H)
            // The water gets darker further down.
            const down = g.createLinearGradient(0, H * 0.35, 0, H)
            down.addColorStop(0, "rgba(0,0,0,0)")
            down.addColorStop(1, "rgba(0,0,0," + (0.25 + 0.35 * o.darkness) + ")")
            g.fillStyle = down
            g.fillRect(0, 0, W, H)
            // Vignette.
            const vig = g.createRadialGradient(
                W / 2,
                H / 2,
                Math.min(W, H) * 0.3,
                W / 2,
                H / 2,
                Math.max(W, H) * 0.75
            )
            vig.addColorStop(0, "rgba(0,0,0,0)")
            vig.addColorStop(1, "rgba(0,0,0," + (0.45 + 0.5 * o.darkness) + ")")
            g.fillStyle = vig
            g.fillRect(0, 0, W, H)
            const pat = g.createPattern(grain, "repeat")
            if (pat) {
                g.globalAlpha = 0.05
                g.fillStyle = pat
                g.fillRect(0, 0, W, H)
                g.globalAlpha = 1
            }

            // Light rays and haze go on a slightly wider canvas of their own,
            // which a slow CSS animation sways and dims (cheap, and smooth).
            sizeCanvas(raysCanvas, W * 1.06, H)
            const rg = raysCanvas.getContext("2d")!
            rg.setTransform(1, 0, 0, 1, 0, 0)
            rg.globalCompositeOperation = "source-over"
            rg.clearRect(0, 0, raysCanvas.width, raysCanvas.height)
            rg.globalCompositeOperation = "lighter"
            rg.translate(W * 0.03, 0)
            const rayK = o.rays * (1 - 0.8 * o.darkness)
            if (rayK > 0.001) {
                for (const ry of rayList) {
                    const wide = ry.w * W * 2.4
                    rg.save()
                    rg.translate(ry.x * W, -20)
                    rg.rotate(-ry.ang)
                    rg.globalAlpha = Math.min(1, 0.11 * rayK * ry.k)
                    rg.drawImage(rayTex, -wide / 2, 0, wide, H * ry.len)
                    rg.restore()
                }
                rg.globalAlpha = 1
            }
            const hazeK = 1 - 0.6 * o.darkness
            for (const f of hazes) {
                const gr = rg.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r)
                gr.addColorStop(0, rgba(o.body, f.a * hazeK))
                gr.addColorStop(1, rgba(o.body, 0))
                rg.fillStyle = gr
                rg.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2)
            }
        }

        const resize = () => {
            const rect = root.getBoundingClientRect()
            const nw = Math.max(1, Math.round(rect.width))
            const nh = Math.max(1, Math.round(rect.height))
            const nextLite = coarse || Math.min(nw, window.innerWidth) < 768
            dpr = Math.min(window.devicePixelRatio || 1, quality > 0 ? 1 : nextLite ? 1.5 : 2)
            canvas.width = Math.round(nw * dpr)
            canvas.height = Math.round(nh * dpr)
            const changed = nextLite !== lite || jellies.length === 0
            const sx = W ? nw / W : 1
            const sy = H ? nh / H : 1
            W = nw
            H = nh
            lite = nextLite
            const blur = clamp(o.depthBlur, 0, 1)
            sDeep = lerp(0.7, 0.26, blur)
            sMid = lerp(1, 0.55, blur)
            sizeCanvas(deep, W * sDeep, H * sDeep)
            sizeCanvas(mid, W * sMid, H * sMid)
            sizeCanvas(b1, canvas.width / 4, canvas.height / 4)
            sizeCanvas(b2, canvas.width / 12, canvas.height / 12)
            sizeCanvas(b3, canvas.width / 4, canvas.height / 4)
            if (changed) build()
            else {
                for (const j of jellies) shiftJelly(j, j.x * (sx - 1), j.y * (sy - 1))
                for (const m of motes) {
                    m.x *= sx
                    m.y *= sy
                }
                for (const m of bokeh) {
                    m.x *= sx
                    m.y *= sy
                }
            }
            paintBackground()
        }

        // ---- update ----
        const updateJelly = (j: Jelly, dt: number) => {
            const spd = o.speed * (reduceMotion ? 0.4 : 1)
            j.phase += dt * j.rate * spd
            if (j.phase >= 1) j.phase -= 1
            const p = j.phase
            j.c =
                p < CONTRACT
                    ? Math.sin((p / CONTRACT) * (Math.PI / 2))
                    : 0.5 * (1 + Math.cos((Math.PI * (p - CONTRACT)) / (1 - CONTRACT)))

            // Wander target.
            if (t > j.wanderAt || Math.hypot(j.wx - j.x, j.wy - j.y) < j.r * 2) {
                j.wx = rand(W * 0.08, W * 0.92)
                j.wy = rand(H * 0.08, H * 0.92)
                j.wanderAt = t + rand(6, 14)
            }
            let dx = j.wx - j.x
            let dy = j.wy - j.y
            const d = Math.hypot(dx, dy) || 1
            dx /= d
            dy /= d

            // Cursor attraction.
            let pull = 0
            let cd = Infinity
            const cursorLive = pointer.inside && t - pointer.at < (coarse ? 6 : 4)
            if (cursorLive && o.cursorPull > 0) {
                const cx = pointer.x - j.x
                const cy = pointer.y - j.y
                cd = Math.hypot(cx, cy) || 1
                pull = o.cursorPull * j.resp * (0.35 + 0.65 * j.z)
                const near = j.r * 2.4
                if (cd < near) pull *= cd / near
                dx = lerp(dx, cx / cd, pull)
                dy = lerp(dy, cy / cd, pull)
            }

            // Keep a little personal space.
            for (const q of jellies) {
                if (q === j) continue
                const sx = j.x - q.x
                const sy = j.y - q.y
                const sd = Math.hypot(sx, sy)
                const min = (j.r + q.r) * 1.25
                if (sd > 0 && sd < min && Math.abs(q.z - j.z) < 0.35) {
                    const k = (1 - sd / min) * 1.4
                    dx += (sx / sd) * k
                    dy += (sy / sd) * k
                }
            }

            // Moon jellies mostly swim upward; only a strong cursor pull tips them over.
            const maxTilt = lerp(1.0, 2.6, Math.min(1, pull * 1.4))
            let desired = Math.atan2(dx, -dy)
            desired = Math.max(-maxTilt, Math.min(maxTilt, desired))
            desired += Math.sin(t * 0.35 + j.seed) * 0.22
            const diff = wrapAngle(desired - j.a)
            const turn = (0.45 + 0.9 * pull) * (0.35 + 0.65 * (1 - j.c))
            j.a += diff * Math.min(1, turn * dt * spd)

            // Thrust from the contraction stroke.
            if (p < CONTRACT) {
                const period = 1 / (j.rate * spd)
                const impulse = j.r * 1.35 * spd
                let a0 = (2 * impulse) / (CONTRACT * period)
                if (cd < j.r * 3) a0 *= 0.35
                const a = a0 * (1 - p / CONTRACT)
                j.vx += Math.sin(j.a) * a * dt
                j.vy += -Math.cos(j.a) * a * dt
            }
            // Water drag, a slow sink and a faint current.
            const drag = Math.exp(-1.5 * dt)
            j.vx *= drag
            j.vy *= drag
            j.vy += 5 * (1 - j.c) * j.z * dt * spd
            j.vx += Math.sin(t * 0.05 + j.seed) * 2 * dt * spd
            j.x += j.vx * dt
            j.y += j.vy * dt

            // Wrap around the edges.
            const m = j.r * 3.2
            if (j.x < -m) shiftJelly(j, W + 2 * m, 0)
            else if (j.x > W + m) shiftJelly(j, -(W + 2 * m), 0)
            if (j.y < -m) shiftJelly(j, 0, H + 2 * m)
            else if (j.y > H + m) shiftJelly(j, 0, -(H + 2 * m))

            bellGeometry(j)

            // Tentacles and arms.
            const ca = Math.cos(j.a)
            const sa = Math.sin(j.a)
            const bx = -sa // "behind the bell" in world space
            const by = ca
            const px = ca // sideways
            const py = sa
            const damp = Math.pow(0.9, dt * 60)
            const dt2 = dt * dt
            for (const s of j.strands) {
                const [lx, ly] = anchorLocal(j, s)
                const ax = j.x + lx * ca - ly * sa
                const ay = j.y + lx * sa + ly * ca
                s.pts[0] = s.prev[0] = ax
                s.pts[1] = s.prev[1] = ay
                const hang = j.r * (s.kind ? 9 : 14)
                const waveAmp = j.r * (s.kind ? 7 : 10)
                // Arms flare outward a touch, like they do in the references.
                const flare = s.kind ? s.anchor * j.r * 8 : Math.cos(s.anchor) * j.r * 6 * j.c
                for (let i = 1; i < s.n; i++) {
                    const ix = i * 2
                    const iy = ix + 1
                    const x = s.pts[ix]
                    const y = s.pts[iy]
                    const vx = (x - s.prev[ix]) * damp
                    const vy = (y - s.prev[iy]) * damp
                    s.prev[ix] = x
                    s.prev[iy] = y
                    const tt2 = i / s.n
                    const wave =
                        Math.sin(t * (s.kind ? 1.1 : 1.8) * spd - i * 0.7 + s.phase) * waveAmp * tt2
                    const fx = bx * hang + px * (wave + flare)
                    const fy = by * hang + py * (wave + flare)
                    s.pts[ix] = x + vx + fx * dt2
                    s.pts[iy] = y + vy + fy * dt2
                }
                for (let i = 1; i < s.n; i++) {
                    const ix = i * 2
                    const qx = s.pts[ix] - s.pts[ix - 2]
                    const qy = s.pts[ix + 1] - s.pts[ix - 1]
                    const ql = Math.hypot(qx, qy) || 1
                    s.pts[ix] = s.pts[ix - 2] + (qx / ql) * s.seg
                    s.pts[ix + 1] = s.pts[ix - 1] + (qy / ql) * s.seg
                }
            }
        }

        const updateMotes = (dt: number, spd: number) => {
            const step = (m: Mote) => {
                const k = (0.3 + 0.7 * Math.min(1, m.z)) * spd * dt
                m.x += (Math.sin(m.y * 0.005 + t * 0.12 + m.tw) * 4 + m.vx) * k
                m.y += m.vy * k
                const pad = m.s
                if (m.y < -pad) m.y = H + pad
                else if (m.y > H + pad) m.y = -pad
                if (m.x < -pad) m.x = W + pad
                else if (m.x > W + pad) m.x = -pad
            }
            for (const m of motes) step(m)
            for (const m of bokeh) step(m)
        }

        // ---- draw ----
        const drawMotes = (g: CanvasRenderingContext2D, list: Mote[]) => {
            const fade = 1 - 0.5 * o.darkness
            const sx = parX * 14
            const sy = parY * 10
            for (const m of list) {
                const pz = m.z - 0.45
                const x = m.x + sx * pz
                const y = m.y + sy * pz
                const tw = 0.6 + 0.4 * Math.sin(tt * 0.7 + m.tw * 3)
                g.globalAlpha = Math.min(1, m.a * tw * fade)
                const spr = m.k === 2 ? bokehSprite : m.k === 1 ? flakes[m.f] : speckSprite
                g.drawImage(spr, x - m.s / 2, y - m.s / 2, m.s, m.s)
            }
            g.globalAlpha = 1
        }

        const drawTentacles = (g: CanvasRenderingContext2D, j: Jelly, a: number) => {
            const baseW = Math.max(0.45, j.r * 0.011)
            if (j.layer === 2 && !lite && quality < 2) {
                // A faint wide pass so the tentacles glow softly.
                g.beginPath()
                for (const s of j.strands) {
                    if (s.kind !== 0) continue
                    for (let k = 1; k < s.n; k++) strandPiece(g, s.pts, s.n, k)
                }
                g.lineWidth = baseW * 4
                g.strokeStyle = rgba(j.tint, a * 0.035)
                g.stroke()
            }
            // Fine strands that fade toward their tips; far-side ones dimmer.
            for (let grp = 0; grp < 2; grp++) {
                const ga = grp ? 0.45 : 1
                for (let b = 0; b < 3; b++) {
                    g.beginPath()
                    let any = false
                    for (const s of j.strands) {
                        if (s.kind !== 0 || (s.back ? 1 : 0) !== grp) continue
                        for (let k = 1; k < s.n; k++) {
                            const bucket = (((k - 1) * 3) / (s.n - 1)) | 0
                            if (bucket !== b) continue
                            strandPiece(g, s.pts, s.n, k)
                            any = true
                        }
                    }
                    if (!any) continue
                    g.lineWidth = baseW * TENT_WIDTH[b]
                    g.strokeStyle = rgba(j.tint, a * 0.34 * TENT_ALPHA[b] * ga)
                    g.stroke()
                }
            }
        }

        const drawArms = (g: CanvasRenderingContext2D, j: Jelly, a: number) => {
            const detail = !lite && j.layer > 0 && quality < 2
            const sub = detail ? 3 : 2
            for (const s of j.strands) {
                if (s.kind !== 1) continue
                const m = centerline(s, sub)
                const base = j.r * 0.075 * s.wf
                const x0 = CL[0]
                const y0 = CL[1]
                const x1 = CL[(m - 1) * 2]
                const y1 = CL[(m - 1) * 2 + 1]
                const fillG = g.createLinearGradient(x0, y0, x1, y1)
                fillG.addColorStop(0, rgba(j.tint, a * 0.11))
                fillG.addColorStop(0.5, rgba(j.tint, a * 0.055))
                fillG.addColorStop(1, rgba(j.tint, 0))
                ribbon(m, base, tt, s.phase, 0.45, 1, 0.6)
                g.beginPath()
                ribbonPath(g, m)
                g.fillStyle = fillG
                g.fill()
                // Bright frilly edges.
                const edgeG = g.createLinearGradient(x0, y0, x1, y1)
                edgeG.addColorStop(0, rgba(j.glowTint, a * 0.18))
                edgeG.addColorStop(0.6, rgba(j.glowTint, a * 0.08))
                edgeG.addColorStop(1, rgba(j.glowTint, 0))
                g.beginPath()
                polyline(g, LE, m)
                polyline(g, RE, m)
                g.strokeStyle = edgeG
                g.lineWidth = Math.max(0.4, j.r * 0.008)
                g.stroke()
                if (detail) {
                    // A second, narrower fold of membrane drifting inside the first.
                    ribbon(m, base, tt * 1.1, s.phase + 2, 0.7, 0.4, 0.3)
                    g.beginPath()
                    ribbonPath(g, m)
                    g.globalAlpha = 0.8
                    g.fill()
                    g.globalAlpha = 1
                }
            }
        }

        const drawJelly = (g: CanvasRenderingContext2D, j: Jelly) => {
            const { r, w, h, e, c, view: v, layer } = j
            const detail = !lite && layer > 0 && quality < 2
            const gk = o.glow
            const tint = j.tint
            const gl = j.glowTint
            // Depth fog: distant jellies fade into the dark; deeper water is darker.
            const yK = 0.85 + 0.3 * (1 - clamp(j.y / H, 0, 1))
            const a =
                lerp(0.3 + 0.7 * j.z, 0.06 + 0.94 * Math.pow(j.z, 2.2), o.darkness) * j.bright * yK
            const ca = Math.cos(j.a)
            const sa = Math.sin(j.a)

            // Glow around the bell, and a whiter light inside it.
            if (gk > 0) {
                const hx = j.x + h * 0.4 * sa
                const hy = j.y - h * 0.4 * ca
                const hs = r * (5.2 + 0.6 * c)
                g.globalAlpha = Math.min(1, a * gk * (0.28 + 0.18 * c))
                g.drawImage(j.halo, hx - hs / 2, hy - hs / 2, hs, hs)
                const cs = r * 1.7
                g.globalAlpha = Math.min(1, a * gk * (0.14 + 0.12 * c) * (0.4 + 0.6 * v))
                g.drawImage(coreSprite, hx - cs / 2, hy - cs / 2, cs, cs)
                g.globalAlpha = 1
            }

            drawTentacles(g, j, a)
            drawArms(g, j, a)

            // ---- bell, in local coordinates ----
            g.save()
            g.translate(j.x, j.y)
            g.rotate(j.a)
            const nTop = detail ? 28 : 18
            const nRim = detail ? 40 : 24
            bellOutline(j, tt, nTop, nRim)
            let nf = 0
            for (let i = 0; i < nTop; i++, nf++) {
                FILL[nf * 2] = TOP[i * 2]
                FILL[nf * 2 + 1] = TOP[i * 2 + 1]
            }
            for (let i = 1; i < nRim / 2; i++, nf++) {
                FILL[nf * 2] = RIM[i * 2]
                FILL[nf * 2 + 1] = RIM[i * 2 + 1]
            }

            // Outer membrane: nearly clear in the middle, brighter toward the
            // edge where you look through more of the curved bell.
            const cyM = (e - h) / 2
            const ry = Math.max(1, (h + e) / 2)
            g.beginPath()
            smoothPath(g, FILL, 0, nf, true)
            g.save()
            g.translate(0, cyM)
            g.scale(1, ry / w)
            const fg = g.createRadialGradient(0, 0, 0, 0, 0, w * 1.02)
            fg.addColorStop(0, rgba(gl, a * 0.05))
            fg.addColorStop(0.45, rgba(tint, a * 0.05))
            fg.addColorStop(0.75, rgba(tint, a * 0.09))
            fg.addColorStop(0.92, rgba(tint, a * 0.16))
            fg.addColorStop(1, rgba(gl, a * 0.2))
            g.fillStyle = fg
            g.fill()
            g.restore()

            // Inner membrane, a smaller layer seen through the outer one.
            g.save()
            g.translate(0, e * 0.35 + h * 0.04)
            g.scale(0.8, 0.74)
            g.beginPath()
            smoothPath(g, FILL, 0, nf, true)
            g.fillStyle = rgba(tint, a * 0.045)
            g.fill()
            if (detail) {
                g.beginPath()
                smoothPath(g, TOP, 0, nTop, false)
                g.strokeStyle = rgba(gl, a * 0.07)
                g.lineWidth = r * 0.05
                g.stroke()
            }
            g.restore()

            // Soft sheen where light from above catches the dome.
            if (gk > 0) {
                g.globalAlpha = Math.min(1, a * 0.16 * gk)
                g.drawImage(coreSprite, -w * 0.78, -h * 1.05, w * 1.2, h * 0.8)
                g.globalAlpha = 1
            }

            // Faint, wandering radial canals.
            if (detail && r > 12) {
                const apY = lerp(-h * 0.62, (-h + e) * 0.45, v)
                g.beginPath()
                const K = 16
                for (let k = 0; k < K; k++) {
                    const ph = ((k + 0.5) / K) * TAU + j.scal * 0.1
                    const ex = Math.cos(ph) * j.wr * 0.93
                    const ey = Math.sin(ph) * e * 0.93
                    const wig = wob(j.seed + k * 3.1, tt * 0.4) * r * 0.05
                    const mx = lerp(ex * 0.85, ex * 0.5, v) + wig
                    const my = lerp(lerp(apY, ey, 0.15), lerp(apY, ey, 0.5), v)
                    g.moveTo(ex * 0.12, lerp(apY, ey, 0.12))
                    g.quadraticCurveTo(mx, my, ex, ey)
                }
                g.strokeStyle = rgba(gl, a * 0.05)
                g.lineWidth = Math.max(0.35, r * 0.007)
                g.stroke()
            }

            // The four glowing horseshoe gonads, seen in perspective.
            const sq = 0.28 + 0.72 * v
            const gcy = lerp(-h * 0.36, (-h + e) * 0.48, v)
            const ga = a * (0.35 + 0.65 * v)
            if (gk > 0) {
                g.globalAlpha = Math.min(1, ga * 0.08 * gk)
                g.drawImage(coreSprite, -r * 0.55, gcy - r * 0.55 * sq, r * 1.1, r * 1.1 * sq)
                g.globalAlpha = 1
            }
            g.save()
            g.translate(0, gcy)
            g.scale(1, sq)
            g.beginPath()
            const gp = detail ? 12 : 8
            for (let k = 0; k < 4; k++) {
                const ang = Math.PI / 4 + (k * Math.PI) / 2 + j.gonRot
                const ox = Math.cos(ang) * r * 0.21
                const oy = Math.sin(ang) * r * 0.21
                const rg = r * 0.125 * j.gon[k * 3]
                const gap = j.gon[k * 3 + 2]
                const a0 = ang + Math.PI + gap
                const a1 = ang + Math.PI + TAU - gap
                for (let q = 0; q <= gp; q++) {
                    const th = lerp(a0, a1, q / gp)
                    const rr = rg * (1 + 0.18 * wob(j.gon[k * 3 + 1], th * 2 + tt * 0.6))
                    const x = ox + Math.cos(th) * rr
                    const y = oy + Math.sin(th) * rr * (0.7 + 0.25 * j.gon[k * 3 + 2])
                    if (q === 0) g.moveTo(x, y)
                    else g.lineTo(x, y)
                }
            }
            // Soft bands rather than hard lines.
            g.strokeStyle = rgba(j.gonadTint, ga * 0.025)
            g.lineWidth = r * 0.11
            g.stroke()
            g.strokeStyle = rgba(j.gonadTint, ga * 0.05)
            g.lineWidth = r * 0.055
            g.stroke()
            g.strokeStyle = rgba(j.gonadTint, ga * 0.085)
            g.lineWidth = Math.max(0.6, r * 0.026)
            g.stroke()
            g.restore()

            // Edge of the dome, uneven in brightness, built from soft passes.
            g.beginPath()
            smoothPath(g, TOP, 0, nTop, false)
            const eg = g.createLinearGradient(-w, -h, w, e)
            eg.addColorStop(0, rgba(gl, a * j.rimK[0]))
            eg.addColorStop(0.35, rgba(gl, a * j.rimK[1]))
            eg.addColorStop(0.7, rgba(gl, a * j.rimK[2]))
            eg.addColorStop(1, rgba(gl, a * j.rimK[3]))
            g.strokeStyle = eg
            g.globalAlpha = 0.05
            g.lineWidth = r * 0.16
            g.stroke()
            g.globalAlpha = 0.1
            g.lineWidth = r * 0.06
            g.stroke()
            g.globalAlpha = 0.18
            g.lineWidth = Math.max(0.5, r * 0.016)
            g.stroke()
            g.globalAlpha = 1

            // The rim: the far side is seen through the bell, so it's dimmer.
            const ma = a * (0.85 + 0.3 * c)
            for (let side = 0; side < 2; side++) {
                const sk = side ? 1 : 0.42
                g.beginPath()
                smoothPath(g, RIM, side ? 0 : nRim / 2, nRim / 2 + 1, false)
                g.strokeStyle = rgba(tint, ma * sk * 0.045)
                g.lineWidth = r * 0.11
                g.stroke()
                g.strokeStyle = rgba(gl, ma * sk * 0.12)
                g.lineWidth = r * 0.04
                g.stroke()
                g.strokeStyle = rgba(gl, ma * sk * 0.22)
                g.lineWidth = Math.max(0.5, r * 0.012)
                g.stroke()
            }

            // Fringe of fine hairs, trailing with the swim and swaying.
            const hs = j.hairs
            if (hs.length && quality < 2) {
                const lvx = j.vx * ca + j.vy * sa
                const lvy = -j.vx * sa + j.vy * ca
                const fl = 0.25 + 0.55 * c
                const nH = hs.length / 3
                g.lineWidth = Math.max(0.35, r * 0.0055)
                for (let pass = 0; pass < 2; pass++) {
                    const from = pass ? 0 : j.hairsFront
                    const to = pass ? j.hairsFront : nH
                    if (to <= from) continue
                    g.beginPath()
                    for (let i = from; i < to; i++) {
                        const phi = hs[i * 3]
                        const len = r * hs[i * 3 + 1] * (1 + 0.2 * c)
                        const ph = hs[i * 3 + 2]
                        const bx = Math.cos(phi) * j.wr
                        const by = Math.sin(phi) * e
                        let dx = Math.cos(phi) * fl + Math.sin(tt * 1.7 + ph) * 0.22 - lvx * 0.012
                        let dy = Math.max(0.25, 1 - lvy * 0.012)
                        const dl = Math.hypot(dx, dy)
                        dx /= dl
                        dy /= dl
                        const bend = Math.sin(tt * 2.3 + ph * 1.3) * len * 0.22
                        g.moveTo(bx, by)
                        g.quadraticCurveTo(
                            bx + dx * len * 0.5 - dy * bend,
                            by + dy * len * 0.5 + dx * bend,
                            bx + dx * len,
                            by + dy * len
                        )
                    }
                    g.strokeStyle = rgba(tint, a * (pass ? 0.17 : 0.07))
                    g.stroke()
                }
            }

            // Rare glints of light along the rim.
            const sp = j.sparks
            if (sp.length && gk > 0) {
                for (let i = 0; i < sp.length; i += 3) {
                    const tw = Math.pow(Math.max(0, Math.sin(tt * sp[i + 1] + sp[i + 2])), 12)
                    if (tw < 0.02) continue
                    const x = Math.cos(sp[i]) * j.wr
                    const y = Math.sin(sp[i]) * e
                    const ss = r * 0.3
                    g.globalAlpha = Math.min(1, a * tw * 0.6 * gk)
                    g.drawImage(sparkSprite, x - ss / 2, y - ss / 2, ss, ss)
                }
                g.globalAlpha = 1
            }
            g.restore()
        }

        const prepLayer = (g: CanvasRenderingContext2D, cv: HTMLCanvasElement, s: number) => {
            g.setTransform(1, 0, 0, 1, 0, 0)
            g.globalCompositeOperation = "source-over"
            g.globalAlpha = 1
            g.clearRect(0, 0, cv.width, cv.height)
            g.setTransform(s, 0, 0, s, 0, 0)
            g.globalCompositeOperation = "lighter"
            g.lineCap = "round"
            g.lineJoin = "round"
        }

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            if (!visible) {
                last = now
                return
            }
            const real = (now - last) / 1000
            const dt = Math.min(0.05, real)
            last = now
            t += dt
            const spd = o.speed * (reduceMotion ? 0.4 : 1)
            tt += dt * spd

            // If the device can't keep up, step down to a cheaper version.
            if (autoQuality && quality < 2 && t > 1.5) {
                if (real > 0.034 && real < 0.25) slowTime += real
                else slowTime = Math.max(0, slowTime - real * 0.5)
                if (slowTime > 2.5) {
                    quality++
                    slowTime = 0
                    resize()
                }
            }

            // Gentle parallax: near things shift a little more with the cursor.
            const live = pointer.inside && t - pointer.at < 4
            const tx = live ? (pointer.x / W - 0.5) * 2 : 0
            const ty = live ? (pointer.y / H - 0.5) * 2 : 0
            const ease = Math.min(1, dt * 1.2)
            parX += (tx - parX) * ease
            parY += (ty - parY) * ease

            for (const j of jellies) updateJelly(j, dt)
            updateMotes(dt, spd)

            // Far layer, drawn small so it comes out soft.
            prepLayer(dctx, deep, sDeep)
            drawMotes(dctx, motesFar)
            for (const j of jellies) if (j.layer === 0) drawJelly(dctx, j)

            // Middle layer, on top of the far one.
            prepLayer(mctx, mid, sMid)
            mctx.setTransform(1, 0, 0, 1, 0, 0)
            mctx.imageSmoothingEnabled = true
            mctx.imageSmoothingQuality = "high"
            mctx.drawImage(deep, 0, 0, mid.width, mid.height)
            mctx.setTransform(sMid, 0, 0, sMid, 0, 0)
            drawMotes(mctx, motesMid)
            for (const j of jellies) if (j.layer === 1) drawJelly(mctx, j)

            // Near layer, full resolution, on a transparent canvas over the background.
            const cw = canvas.width
            const ch = canvas.height
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.globalAlpha = 1
            ctx.globalCompositeOperation = "source-over"
            ctx.clearRect(0, 0, cw, ch)
            ctx.globalCompositeOperation = "lighter"
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"
            ctx.drawImage(mid, 0, 0, cw, ch)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            drawMotes(ctx, motesNear)
            for (const j of jellies) if (j.layer === 2) drawJelly(ctx, j)

            // Bloom: soft, blurred copies of the scene added back on top.
            if (o.glow > 0 && quality === 0) {
                b1ctx.setTransform(1, 0, 0, 1, 0, 0)
                b1ctx.globalCompositeOperation = "source-over"
                b1ctx.clearRect(0, 0, b1.width, b1.height)
                b1ctx.imageSmoothingEnabled = true
                b1ctx.imageSmoothingQuality = "high"
                b1ctx.drawImage(canvas, 0, 0, b1.width, b1.height)
                b2ctx.setTransform(1, 0, 0, 1, 0, 0)
                b2ctx.globalCompositeOperation = "source-over"
                b2ctx.clearRect(0, 0, b2.width, b2.height)
                b2ctx.globalCompositeOperation = "lighter"
                b2ctx.imageSmoothingEnabled = true
                b2ctx.imageSmoothingQuality = "high"
                b2ctx.globalAlpha = 0.25
                b2ctx.drawImage(b1, -0.75, -0.75, b2.width, b2.height)
                b2ctx.drawImage(b1, 0.75, -0.75, b2.width, b2.height)
                b2ctx.drawImage(b1, -0.75, 0.75, b2.width, b2.height)
                b2ctx.drawImage(b1, 0.75, 0.75, b2.width, b2.height)
                b2ctx.globalAlpha = 1
                b3ctx.setTransform(1, 0, 0, 1, 0, 0)
                b3ctx.globalCompositeOperation = "source-over"
                b3ctx.clearRect(0, 0, b3.width, b3.height)
                b3ctx.globalCompositeOperation = "lighter"
                b3ctx.imageSmoothingEnabled = true
                b3ctx.imageSmoothingQuality = "high"
                b3ctx.globalAlpha = Math.min(1, 0.4 * o.glow)
                b3ctx.drawImage(b1, 0, 0)
                b3ctx.globalAlpha = Math.min(1, 0.6 * o.glow)
                b3ctx.drawImage(b2, 0, 0, b3.width, b3.height)
                b3ctx.globalAlpha = 1
                ctx.setTransform(1, 0, 0, 1, 0, 0)
                ctx.drawImage(b3, 0, 0, cw, ch)
            }

            // Out-of-focus specks right in front of the lens.
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            drawMotes(ctx, bokeh)
            ctx.globalCompositeOperation = "source-over"
        }

        const onMove = (ev: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = ev.clientX - rect.left
            const y = ev.clientY - rect.top
            pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
            if (pointer.inside) {
                pointer.x = x
                pointer.y = y
                pointer.at = t
            }
        }
        const onLeave = () => (pointer.inside = false)

        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(root)
        const io = new IntersectionObserver(
            (entries) => {
                visible = entries[0]?.isIntersecting ?? true
            },
            { threshold: 0 }
        )
        io.observe(root)
        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("pointerdown", onMove, { passive: true })
        document.addEventListener("pointerleave", onLeave)
        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            io.disconnect()
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerdown", onMove)
            document.removeEventListener("pointerleave", onLeave)
        }
    }, [count, mobileCount, size, particles, rays, darkness, depthBlur, autoQuality, colorKey])

    return (
        <div
            ref={rootRef}
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                isolation: "isolate",
                background,
            }}
        >
            <canvas
                ref={bgRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
            <style>
                {"@keyframes jh-drift { 0% { transform: translate3d(-1.6%,0,0) skewX(1.4deg); opacity: .65 } 100% { transform: translate3d(1.6%,0,0) skewX(-1.4deg); opacity: 1 } }" +
                    "@media (prefers-reduced-motion: reduce) { .jh-rays { animation: none !important } }"}
            </style>
            <canvas
                ref={raysRef}
                aria-hidden="true"
                className="jh-rays"
                style={{
                    position: "absolute",
                    top: 0,
                    left: "-3%",
                    width: "106%",
                    height: "100%",
                    display: "block",
                    animation: "jh-drift 28s ease-in-out infinite alternate",
                    willChange: "transform, opacity",
                    mixBlendMode: "plus-lighter",
                }}
            />
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                    // Light adds onto the water instead of being laid over it.
                    mixBlendMode: "plus-lighter",
                }}
            />
        </div>
    )
}

// ---------------------------------------------------------------------------
// Framer property controls
// ---------------------------------------------------------------------------

addPropertyControls(JellyfishHero, {
    count: {
        type: ControlType.Number,
        title: "Jellyfish",
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 14,
        displayStepper: true,
    },
    mobileCount: {
        type: ControlType.Number,
        title: "Mobile Count",
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 6,
        displayStepper: true,
    },
    size: { type: ControlType.Number, title: "Size", min: 0.4, max: 2.5, step: 0.05, defaultValue: 1 },
    speed: { type: ControlType.Number, title: "Speed", min: 0.2, max: 3, step: 0.05, defaultValue: 1 },
    cursorPull: {
        type: ControlType.Number,
        title: "Cursor Pull",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.7,
    },
    glow: { type: ControlType.Number, title: "Glow", min: 0, max: 2, step: 0.05, defaultValue: 1 },
    particles: {
        type: ControlType.Number,
        title: "Particles",
        min: 0,
        max: 2,
        step: 0.1,
        defaultValue: 1,
    },
    rays: {
        type: ControlType.Number,
        title: "Light Rays",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.4,
        description: "Faint beams of light from the surface.",
    },
    depthBlur: {
        type: ControlType.Number,
        title: "Depth Blur",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.8,
        description: "How out of focus the distant jellyfish are.",
    },
    darkness: {
        type: ControlType.Number,
        title: "Darkness",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.6,
        description: "How deep and dark the water feels. Distant jellyfish fade into black.",
    },
    bodyColor: { type: ControlType.Color, title: "Jelly Color", defaultValue: "#6FA0FF" },
    coreColor: { type: ControlType.Color, title: "Glow Color", defaultValue: "#DCEAFF" },
    background: { type: ControlType.Color, title: "Background", defaultValue: "#010207" },
})
