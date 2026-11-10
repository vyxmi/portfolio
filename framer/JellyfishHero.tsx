// JellyfishHero: a full-screen underwater hero for Framer.
//
// Paste this whole file into Framer: Assets → Code → "+" → New Code File,
// name it JellyfishHero, then drag the component onto the page.
//
// - Glowing moon jellyfish drawn on a <canvas>. Each one pulses its bell,
//   gets thrust from the contraction, glides on drag, and trails tentacles
//   and oral arms that are simulated as soft chains.
// - Jellyfish drift toward the cursor (or a touch point on phones).
// - Ambient underwater sound is generated live with the Web Audio API
//   (no audio file, no licensing). It only starts after the visitor taps
//   the sound toggle, which is what browser autoplay rules require.
//   You can swap in your own royalty-free loop with the "Sound File" control.
// - Phones and touch devices get a lighter version: fewer jellyfish,
//   shorter tentacle chains, fewer particles and a lower pixel ratio.
// - Animation pauses when the hero is scrolled out of view.

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
    name: string
    title: string
    location: string
    showText: boolean
    textAlign: "left" | "center"
    font: React.CSSProperties
    nameSize: number
    textColor: string
    count: number
    mobileCount: number
    size: number
    speed: number
    cursorPull: number
    glow: number
    particles: number
    darkness: number
    bodyColor: string
    coreColor: string
    background: string
    showSoundToggle: boolean
    soundFile: string
    volume: number
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
    `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a < 0 ? 0 : a > 1 ? 1 : a})`

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
function wrapAngle(a: number) {
    while (a > Math.PI) a -= TAU
    while (a < -Math.PI) a += TAU
    return a
}

function makeGlowSprite(color: RGB) {
    const s = 128
    const cv = document.createElement("canvas")
    cv.width = cv.height = s
    const g = cv.getContext("2d")!
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
    grad.addColorStop(0, rgba(color, 0.55))
    grad.addColorStop(0.25, rgba(color, 0.22))
    grad.addColorStop(0.6, rgba(color, 0.06))
    grad.addColorStop(1, rgba(color, 0))
    g.fillStyle = grad
    g.fillRect(0, 0, s, s)
    return cv
}

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
}

const CONTRACT = 0.3 // fraction of the pulse cycle spent contracting

function bellGeometry(j: Jelly) {
    const c = j.c
    const w = j.r * (1 - 0.17 * c)
    const hBase = j.r * (0.5 + 0.24 * c)
    const h = hBase + (w * 0.95 - hBase) * j.view * 0.7
    const e = h * 0.1 + j.view * w * 0.4
    j.w = w
    j.h = h
    j.e = e
}

// Local bell coordinates: rim centre at (0,0), dome toward -y.
function anchorLocal(j: Jelly, s: Strand): [number, number] {
    if (s.kind === 0) {
        const th = s.anchor
        return [Math.cos(th) * j.w * 0.96, Math.sin(th) * j.e]
    }
    return [s.anchor * j.r, j.e * 0.35]
}

function toWorld(j: Jelly, lx: number, ly: number): [number, number] {
    const ca = Math.cos(j.a)
    const sa = Math.sin(j.a)
    return [j.x + lx * ca - ly * sa, j.y + lx * sa + ly * ca]
}

function makeJelly(W: number, H: number, base: number, lite: boolean, z?: number): Jelly {
    const depth = z ?? Math.pow(Math.random(), 0.8)
    const r = base * (0.45 + 0.8 * depth) * rand(0.8, 1.2)
    const j: Jelly = {
        x: rand(0, W),
        y: rand(0, H),
        vx: 0,
        vy: 0,
        a: rand(-0.6, 0.6),
        r,
        z: depth,
        view: Math.pow(Math.random(), 1.4),
        phase: Math.random(),
        rate: rand(0.38, 0.6) * (0.75 + 0.25 * depth),
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
    }
    bellGeometry(j)

    const tentacles = lite ? 12 : 24
    const tSeg = lite ? 5 : 7
    for (let i = 0; i < tentacles; i++) {
        const th = lerp(0.12, Math.PI - 0.12, (i + rand(-0.3, 0.3)) / (tentacles - 1))
        const len = j.r * rand(0.3, 0.6)
        j.strands.push(makeStrand(tSeg, len / tSeg, 0, th))
    }
    const arms = 4
    const aSeg = lite ? 7 : 11
    for (let i = 0; i < arms; i++) {
        const off = (i - 1.5) * 0.11
        const len = j.r * rand(1.1, 2.0)
        j.strands.push(makeStrand(aSeg, len / aSeg, 1, off))
    }
    for (const s of j.strands) placeStrand(j, s)
    return j
}

function makeStrand(n: number, seg: number, kind: 0 | 1, anchor: number): Strand {
    return {
        n,
        seg,
        pts: new Float32Array(n * 2),
        prev: new Float32Array(n * 2),
        kind,
        anchor,
        phase: rand(0, TAU),
    }
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

interface Mote {
    x: number
    y: number
    z: number
    vy: number
    tw: number
}

interface Opts {
    count: number
    mobileCount: number
    size: number
    speed: number
    cursorPull: number
    glow: number
    particles: number
    darkness: number
    body: RGB
    core: RGB
    bg: RGB
}

// ---------------------------------------------------------------------------
// Ambient sound (generated; no external file needed)
// ---------------------------------------------------------------------------

interface Ocean {
    setOn(on: boolean): void
    setVolume(v: number): void
    close(): void
}

function createOcean(volume: number, url?: string): Ocean | null {
    const AC: typeof AudioContext | undefined =
        (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    let on = true
    let vol = volume
    let bubbleTimer: any = null
    let suspendTimer: any = null
    let el: HTMLAudioElement | null = null

    if (url) {
        el = new Audio()
        el.src = url
        el.loop = true
        el.crossOrigin = "anonymous"
        ctx.createMediaElementSource(el).connect(master)
        el.play().catch(() => {})
    } else {
        // Brown noise, made seamless by crossfading its tail into its head.
        const sr = ctx.sampleRate
        const len = sr * 8
        const fade = sr * 1
        const buf = ctx.createBuffer(2, len, sr)
        for (let ch = 0; ch < 2; ch++) {
            const raw = new Float32Array(len + fade)
            let last = 0
            for (let i = 0; i < raw.length; i++) {
                last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
                raw[i] = last * 3.2
            }
            const out = buf.getChannelData(ch)
            for (let i = 0; i < len; i++) {
                if (i < fade) {
                    const t = i / fade
                    out[i] = raw[i] * t + raw[len + i] * (1 - t)
                } else out[i] = raw[i]
            }
        }

        // Layer 1: slow swells, like water moving overhead.
        const swellSrc = ctx.createBufferSource()
        swellSrc.buffer = buf
        swellSrc.loop = true
        const swellLp = ctx.createBiquadFilter()
        swellLp.type = "lowpass"
        swellLp.frequency.value = 420
        swellLp.Q.value = 0.5
        const swell = ctx.createGain()
        swell.gain.value = 0.5
        const lfo = ctx.createOscillator()
        lfo.frequency.value = 0.075
        const lfoAmt = ctx.createGain()
        lfoAmt.gain.value = 0.32
        lfo.connect(lfoAmt).connect(swell.gain)
        const lfo2 = ctx.createOscillator()
        lfo2.frequency.value = 0.031
        const lfo2Amt = ctx.createGain()
        lfo2Amt.gain.value = 180
        lfo2.connect(lfo2Amt).connect(swellLp.frequency)
        swellSrc.connect(swellLp).connect(swell).connect(master)

        // Layer 2: deep, muffled rumble.
        const rumbleSrc = ctx.createBufferSource()
        rumbleSrc.buffer = buf
        rumbleSrc.loop = true
        rumbleSrc.playbackRate.value = 0.5
        const rumbleLp = ctx.createBiquadFilter()
        rumbleLp.type = "lowpass"
        rumbleLp.frequency.value = 110
        const rumble = ctx.createGain()
        rumble.gain.value = 0.85
        rumbleSrc.connect(rumbleLp).connect(rumble).connect(master)

        const t0 = ctx.currentTime
        swellSrc.start(t0)
        rumbleSrc.start(t0, 3)
        lfo.start(t0)
        lfo2.start(t0)

        // Layer 3: occasional little bubble clusters.
        const bubbleBus = ctx.createBiquadFilter()
        bubbleBus.type = "lowpass"
        bubbleBus.frequency.value = 2400
        bubbleBus.connect(master)
        const bubble = (at: number) => {
            const o = ctx.createOscillator()
            o.type = "sine"
            const f = rand(320, 1100)
            const d = rand(0.05, 0.12)
            o.frequency.setValueAtTime(f, at)
            o.frequency.exponentialRampToValueAtTime(f * rand(1.5, 2.4), at + d)
            const g = ctx.createGain()
            g.gain.setValueAtTime(0, at)
            g.gain.linearRampToValueAtTime(rand(0.012, 0.05), at + 0.008)
            g.gain.exponentialRampToValueAtTime(0.0001, at + d + 0.06)
            let node: AudioNode = g
            if ((ctx as any).createStereoPanner) {
                const p = ctx.createStereoPanner()
                p.pan.value = rand(-0.8, 0.8)
                g.connect(p)
                node = p
            }
            node.connect(bubbleBus)
            o.connect(g)
            o.start(at)
            o.stop(at + d + 0.08)
        }
        const scheduleBubbles = () => {
            if (on) {
                const n = 1 + Math.floor(Math.random() * 5)
                let at = ctx.currentTime + 0.05
                for (let i = 0; i < n; i++) {
                    bubble(at)
                    at += rand(0.04, 0.14)
                }
            }
            bubbleTimer = setTimeout(scheduleBubbles, rand(1500, 5500))
        }
        scheduleBubbles()
    }

    const apply = () => {
        const now = ctx.currentTime
        master.gain.cancelScheduledValues(now)
        master.gain.setValueAtTime(master.gain.value, now)
        master.gain.setTargetAtTime(on ? vol : 0, now, on ? 0.7 : 0.25)
    }
    ctx.resume().catch(() => {})
    apply()

    return {
        setOn(next) {
            on = next
            clearTimeout(suspendTimer)
            if (on) {
                ctx.resume().catch(() => {})
                el?.play().catch(() => {})
            } else {
                suspendTimer = setTimeout(() => {
                    el?.pause()
                    ctx.suspend().catch(() => {})
                }, 1500)
            }
            apply()
        },
        setVolume(v) {
            vol = v
            apply()
        },
        close() {
            clearTimeout(bubbleTimer)
            clearTimeout(suspendTimer)
            el?.pause()
            ctx.close().catch(() => {})
        },
    }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function JellyfishHero(props: Props) {
    const {
        name = "Vyomi Seth",
        title = "Product Designer & Engineer",
        location = "Bay Area, CA",
        showText = true,
        textAlign = "center",
        font,
        nameSize = 76,
        textColor = "#EAF2FF",
        count = 14,
        mobileCount = 6,
        size = 1,
        speed = 1,
        cursorPull = 0.7,
        glow = 1,
        particles = 1,
        darkness = 0.6,
        bodyColor = "#6FA0FF",
        coreColor = "#DCEAFF",
        background = "#010207",
        showSoundToggle = true,
        soundFile = "",
        volume = 0.5,
        style,
    } = props

    const rootRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const audioRef = useRef<Ocean | null>(null)
    const [soundOn, setSoundOn] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const optsRef = useRef<Opts>({
        count,
        mobileCount,
        size,
        speed,
        cursorPull,
        glow,
        particles,
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
        if (!root || !canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const reduceMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
        const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false

        let W = 0
        let H = 0
        let dpr = 1
        let lite = false
        let jellies: Jelly[] = []
        let motes: Mote[] = []
        let bgCanvas: HTMLCanvasElement | null = null
        let sprite = makeGlowSprite(o.body)
        let coreSprite = makeGlowSprite(o.core)
        let t = 0
        let raf = 0
        let last = performance.now()
        let visible = true
        const pointer = { x: 0, y: 0, at: -100, inside: false }

        const build = () => {
            const base = Math.min(W, H) * (lite ? 0.085 : 0.06) * o.size
            const n = Math.max(0, Math.round(lite ? o.mobileCount : o.count))
            jellies = []
            for (let i = 0; i < n; i++) {
                // Spread depths evenly so there is always some foreground and background.
                const z = Math.min(1, (i + Math.random()) / Math.max(1, n))
                jellies.push(makeJelly(W, H, base, lite, z))
            }
            jellies.sort((a, b) => a.z - b.z)
            const moteCount = Math.round(
                Math.min(lite ? 70 : 240, (W * H) / (lite ? 6000 : 7000)) * o.particles
            )
            motes = []
            for (let i = 0; i < moteCount; i++) {
                motes.push({
                    x: rand(0, W),
                    y: rand(0, H),
                    z: Math.random(),
                    vy: rand(-6, 4),
                    tw: rand(0, TAU),
                })
            }
        }

        const paintBackground = () => {
            bgCanvas = document.createElement("canvas")
            bgCanvas.width = Math.max(1, Math.round(W * dpr))
            bgCanvas.height = Math.max(1, Math.round(H * dpr))
            const g = bgCanvas.getContext("2d")!
            g.scale(dpr, dpr)
            g.fillStyle = rgba(o.bg, 1)
            g.fillRect(0, 0, W, H)
            // Faint light from the surface.
            const top = g.createRadialGradient(W * 0.5, -H * 0.2, 0, W * 0.5, -H * 0.2, H * 1.2)
            const lightK = 1 - 0.7 * o.darkness
            top.addColorStop(0, rgba(o.body, 0.1 * lightK))
            top.addColorStop(0.5, rgba(o.body, 0.03 * lightK))
            top.addColorStop(1, rgba(o.body, 0))
            g.fillStyle = top
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
            vig.addColorStop(1, `rgba(0,0,0,${0.45 + 0.5 * o.darkness})`)
            g.fillStyle = vig
            g.fillRect(0, 0, W, H)
        }

        const resize = () => {
            const rect = root.getBoundingClientRect()
            const nw = Math.max(1, Math.round(rect.width))
            const nh = Math.max(1, Math.round(rect.height))
            const nextLite = coarse || Math.min(nw, window.innerWidth) < 768
            dpr = Math.min(window.devicePixelRatio || 1, nextLite ? 1.5 : 2)
            canvas.width = Math.round(nw * dpr)
            canvas.height = Math.round(nh * dpr)
            const changed = nextLite !== lite || jellies.length === 0
            const sx = W ? nw / W : 1
            const sy = H ? nh / H : 1
            W = nw
            H = nh
            lite = nextLite
            setIsMobile(lite)
            if (changed) build()
            else {
                for (const j of jellies) shiftJelly(j, j.x * (sx - 1), j.y * (sy - 1))
                for (const m of motes) {
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
            let d = Math.hypot(dx, dy) || 1
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
                    const tt = i / s.n
                    const wave =
                        Math.sin(t * (s.kind ? 1.1 : 1.8) * spd - i * 0.7 + s.phase) * waveAmp * tt
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

        // ---- draw ----
        const strandPath = (s: Strand, offset: number) => {
            const p = s.pts
            ctx.moveTo(p[0], p[1])
            for (let i = 1; i < s.n - 1; i++) {
                let x = p[i * 2]
                let y = p[i * 2 + 1]
                let nx = p[i * 2 + 2]
                let ny = p[i * 2 + 3]
                if (offset) {
                    const tx = nx - x
                    const ty = ny - y
                    const tl = Math.hypot(tx, ty) || 1
                    const o1 = Math.sin(i * 1.9 + t * 1.3 + s.phase) * offset * (i / s.n)
                    const o2 = Math.sin((i + 1) * 1.9 + t * 1.3 + s.phase) * offset * ((i + 1) / s.n)
                    x += (-ty / tl) * o1
                    y += (tx / tl) * o1
                    nx += (-ty / tl) * o2
                    ny += (tx / tl) * o2
                }
                ctx.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2)
            }
            ctx.lineTo(p[(s.n - 1) * 2], p[(s.n - 1) * 2 + 1])
        }

        const drawJelly = (j: Jelly) => {
            const { r, w, h, e, c, view: v } = j
            const body = o.body
            const core = o.core
            // Depth fog: distant jellies fade into the dark.
            const alpha = lerp(0.3 + 0.7 * j.z, 0.06 + 0.94 * Math.pow(j.z, 2.2), o.darkness)
            const glowK = o.glow

            // Halo.
            const [gx, gy] = toWorld(j, 0, -h * 0.35)
            if (glowK > 0) {
                const gs = r * 5.2
                ctx.globalAlpha = Math.min(1, alpha * glowK * (0.55 + 0.35 * c))
                ctx.drawImage(sprite, gx - gs / 2, gy - gs / 2, gs, gs)
                const cs = r * 1.8
                ctx.globalAlpha = Math.min(1, alpha * glowK * (0.25 + 0.2 * c) * (0.4 + 0.6 * v))
                ctx.drawImage(coreSprite, gx - cs / 2, gy - cs / 2, cs, cs)
                ctx.globalAlpha = 1
            }

            // Marginal tentacles.
            ctx.lineWidth = Math.max(0.5, r * 0.012)
            ctx.strokeStyle = rgba(body, alpha * 0.32)
            ctx.beginPath()
            for (const s of j.strands) if (s.kind === 0) strandPath(s, 0)
            ctx.stroke()

            // Oral arms: a soft wide pass and a ruffled bright edge.
            ctx.lineCap = "round"
            ctx.lineWidth = r * 0.13
            ctx.strokeStyle = rgba(body, alpha * 0.13)
            ctx.beginPath()
            for (const s of j.strands) if (s.kind === 1) strandPath(s, 0)
            ctx.stroke()
            ctx.lineWidth = Math.max(0.6, r * 0.02)
            ctx.strokeStyle = rgba(core, alpha * 0.42)
            ctx.beginPath()
            for (const s of j.strands) if (s.kind === 1) strandPath(s, r * 0.08)
            ctx.stroke()

            // Bell.
            ctx.save()
            ctx.translate(j.x, j.y)
            ctx.rotate(j.a)

            ctx.beginPath()
            ctx.moveTo(-w, 0)
            ctx.bezierCurveTo(-w, -h * 0.78, -w * 0.56, -h, 0, -h)
            ctx.bezierCurveTo(w * 0.56, -h, w, -h * 0.78, w, 0)
            ctx.ellipse(0, 0, w, Math.max(0.1, e), 0, 0, Math.PI)
            ctx.closePath()
            const grad = ctx.createRadialGradient(0, -h * 0.6, 0, 0, -h * 0.25, w * 1.15)
            grad.addColorStop(0, rgba(core, alpha * 0.42))
            grad.addColorStop(0.45, rgba(body, alpha * 0.22))
            grad.addColorStop(1, rgba(body, alpha * 0.05))
            ctx.fillStyle = grad
            ctx.fill()

            // Dome edge (brighter toward the margin, like the reference photos).
            ctx.lineWidth = Math.max(0.6, r * 0.025)
            ctx.strokeStyle = rgba(core, alpha * 0.28)
            ctx.stroke()

            // Radial canals.
            if (!lite && r > 14) {
                ctx.lineWidth = Math.max(0.4, r * 0.008)
                ctx.strokeStyle = rgba(core, alpha * 0.1)
                ctx.beginPath()
                const cy0 = lerp(-h * 0.35, (-h + e) * 0.5, v)
                for (let k = 0; k < 12; k++) {
                    const u = (k + 0.5) / 12
                    const th = Math.PI * u
                    const ex = -Math.cos(th) * w * 0.92
                    const ey = lerp(0, Math.sin(th) * e, 0.7)
                    ctx.moveTo(lerp(0, ex, 0.18), lerp(cy0, ey, 0.18))
                    const wig = Math.sin(k * 3.1 + j.seed) * r * 0.05
                    ctx.quadraticCurveTo(lerp(0, ex, 0.6) + wig, lerp(cy0, ey, 0.6), ex, ey)
                }
                ctx.stroke()
            }

            // Bell margin (the brightest line on a moon jelly).
            ctx.lineWidth = Math.max(0.7, r * 0.03)
            ctx.strokeStyle = rgba(core, alpha * (0.36 + 0.15 * c))
            ctx.beginPath()
            ctx.ellipse(0, 0, w * 0.995, Math.max(0.1, e), 0, 0, TAU)
            ctx.stroke()

            // The four glowing gonad rings (the "clover").
            const sq = 0.3 + 0.7 * v
            const gcy = lerp(-h * 0.36, (-h + e) * 0.5, v)
            ctx.save()
            ctx.translate(0, gcy)
            ctx.scale(1, sq)
            ctx.lineWidth = Math.max(0.8, r * 0.05)
            ctx.strokeStyle = rgba(core, alpha * (0.22 + 0.5 * v))
            ctx.beginPath()
            for (let k = 0; k < 4; k++) {
                const ang = Math.PI / 4 + (k * Math.PI) / 2 + j.seed * 0.01
                const ox = Math.cos(ang) * r * 0.2
                const oy = Math.sin(ang) * r * 0.2
                ctx.moveTo(ox + Math.cos(ang) * r * 0.14, oy + Math.sin(ang) * r * 0.14)
                ctx.ellipse(ox, oy, r * 0.14, r * 0.095, ang, 0, TAU)
            }
            ctx.stroke()
            ctx.restore()

            ctx.restore()
        }

        const drawMotes = (dt: number) => {
            const body = o.body
            const core = o.core
            for (const m of motes) {
                m.y += m.vy * (0.3 + 0.7 * m.z) * dt * o.speed
                m.x += Math.sin(t * 0.2 + m.tw) * 3 * dt
                if (m.y < -4) m.y = H + 4
                else if (m.y > H + 4) m.y = -4
                if (m.x < -4) m.x = W + 4
                else if (m.x > W + 4) m.x = -4
                const tw = 0.5 + 0.5 * Math.sin(t * 0.8 + m.tw * 3)
                const sz = 0.5 + m.z * 1.6
                ctx.fillStyle = rgba(
                    m.z > 0.8 ? core : body,
                    (0.08 + 0.35 * m.z) * tw * (1 - 0.55 * o.darkness)
                )
                ctx.fillRect(m.x, m.y, sz, sz)
            }
        }

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            if (!visible) {
                last = now
                return
            }
            const dt = Math.min(0.05, (now - last) / 1000)
            last = now
            t += dt

            for (const j of jellies) updateJelly(j, dt)

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.globalCompositeOperation = "source-over"
            if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0, W, H)
            ctx.globalCompositeOperation = "lighter"
            drawMotes(dt)
            for (const j of jellies) drawJelly(j)
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
    }, [count, mobileCount, size, particles, darkness, colorKey])

    // Sound.
    const toggleSound = () => {
        if (!audioRef.current) {
            audioRef.current = createOcean(volume, soundFile || undefined)
            setSoundOn(!!audioRef.current)
            return
        }
        const next = !soundOn
        audioRef.current.setOn(next)
        setSoundOn(next)
    }
    useEffect(() => {
        audioRef.current?.setVolume(volume)
    }, [volume])
    useEffect(() => {
        // A new sound file means a new source: rebuild on the next tap.
        audioRef.current?.close()
        audioRef.current = null
        setSoundOn(false)
    }, [soundFile])
    useEffect(() => () => audioRef.current?.close(), [])

    const body = toRGB(bodyColor, [111, 160, 255])
    const left = textAlign === "left"

    return (
        <div
            ref={rootRef}
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                background,
            }}
        >
            <style>{`
                @keyframes jh-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none } }
                @keyframes jh-breathe { 0%,100% { opacity: .35 } 50% { opacity: 1 } }
                .jh-sound:hover { background: rgba(255,255,255,0.1) !important }
                .jh-sound:focus-visible { outline: 2px solid ${rgba(body, 0.9)}; outline-offset: 3px }
            `}</style>
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />

            {showText && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: left ? "flex-start" : "center",
                        textAlign: left ? "left" : "center",
                        padding: "0 clamp(20px, 7vw, 120px)",
                        pointerEvents: "none",
                        color: textColor,
                        ...font,
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: `clamp(${Math.round(nameSize * 0.5)}px, ${(nameSize / 14.4).toFixed(2)}vw, ${nameSize}px)`,
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                            fontWeight: (font && font.fontWeight) || 500,
                            textShadow: `0 0 28px ${rgba(body, 0.45)}, 0 0 2px ${rgba(body, 0.3)}`,
                            animation: "jh-rise 1.4s cubic-bezier(.2,.7,.2,1) both",
                        }}
                    >
                        {name}
                    </h1>
                    {title && (
                        <p
                            style={{
                                margin: "0.9em 0 0",
                                fontSize: `clamp(15px, ${(nameSize / 60).toFixed(2)}vw, ${Math.round(nameSize * 0.26)}px)`,
                                opacity: 0.85,
                                letterSpacing: "0.01em",
                                textShadow: `0 0 18px ${rgba(body, 0.4)}`,
                                animation: "jh-rise 1.4s .25s cubic-bezier(.2,.7,.2,1) both",
                            }}
                        >
                            {title}
                        </p>
                    )}
                    {location && (
                        <p
                            style={{
                                margin: "0.7em 0 0",
                                fontSize: 12,
                                textTransform: "uppercase",
                                letterSpacing: "0.22em",
                                opacity: 0.6,
                                animation: "jh-rise 1.4s .45s cubic-bezier(.2,.7,.2,1) both",
                            }}
                        >
                            {location}
                        </p>
                    )}
                </div>
            )}

            {showSoundToggle && (
                <button
                    type="button"
                    className="jh-sound"
                    onClick={toggleSound}
                    aria-pressed={soundOn}
                    aria-label={soundOn ? "Mute ocean sound" : "Play ocean sound"}
                    style={{
                        position: "absolute",
                        right: isMobile ? 16 : 28,
                        bottom: isMobile ? 16 : 28,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 14px 9px 12px",
                        borderRadius: 999,
                        border: `1px solid ${rgba(body, 0.3)}`,
                        background: "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        color: textColor,
                        fontFamily: (font && font.fontFamily) || "inherit",
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        textTransform: "lowercase",
                        cursor: "pointer",
                        transition: "background .2s",
                        zIndex: 2,
                    }}
                >
                    <SpeakerIcon on={soundOn} />
                    <span>{soundOn ? "sound on" : "sound off"}</span>
                    {!soundOn && (
                        <span
                            aria-hidden="true"
                            style={{
                                width: 5,
                                height: 5,
                                borderRadius: 5,
                                background: rgba(body, 1),
                                boxShadow: `0 0 8px ${rgba(body, 1)}`,
                                animation: "jh-breathe 2.4s ease-in-out infinite",
                            }}
                        />
                    )}
                </button>
            )}
        </div>
    )
}

function SpeakerIcon({ on }: { on: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            {on ? (
                <>
                    <path
                        d="M15.5 9a4.2 4.2 0 0 1 0 6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                    <path
                        d="M18 6.5a7.8 7.8 0 0 1 0 11"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </>
            ) : (
                <path
                    d="M16 9.5l5 5m0-5l-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
            )}
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Framer property controls
// ---------------------------------------------------------------------------

addPropertyControls(JellyfishHero, {
    name: { type: ControlType.String, title: "Name", defaultValue: "Vyomi Seth" },
    title: {
        type: ControlType.String,
        title: "Job Title",
        defaultValue: "Product Designer & Engineer",
    },
    location: { type: ControlType.String, title: "Location", defaultValue: "Bay Area, CA" },
    showText: { type: ControlType.Boolean, title: "Show Text", defaultValue: true },
    textAlign: {
        type: ControlType.Enum,
        title: "Text Align",
        options: ["center", "left"],
        optionTitles: ["Center", "Left"],
        defaultValue: "center",
        displaySegmentedControl: true,
        hidden: (p: Props) => !p.showText,
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "basic",
        defaultFontType: "sans-serif",
        hidden: (p: Props) => !p.showText,
    },
    nameSize: {
        type: ControlType.Number,
        title: "Name Size",
        min: 24,
        max: 180,
        step: 1,
        unit: "px",
        defaultValue: 76,
        hidden: (p: Props) => !p.showText,
    },
    textColor: { type: ControlType.Color, title: "Text Color", defaultValue: "#EAF2FF" },
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
    showSoundToggle: { type: ControlType.Boolean, title: "Sound Toggle", defaultValue: true },
    soundFile: {
        type: ControlType.File,
        title: "Sound File",
        allowedFileTypes: ["mp3", "wav", "ogg", "m4a"],
        description: "Optional. Leave empty to use the generated ocean sound.",
        hidden: (p: Props) => !p.showSoundToggle,
    },
    volume: {
        type: ControlType.Number,
        title: "Volume",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.5,
        hidden: (p: Props) => !p.showSoundToggle,
    },
})
