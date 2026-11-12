// OceanSound: an ambient ocean sound toggle for Framer.
//
// Paste this whole file into Framer: Assets → Code → "+" → New Code File,
// name it OceanSound, then drag it onto the page (for example into the
// bottom-right corner of the hero, with its position set to Absolute).
//
// The sound is generated live with the Web Audio API: slow filtered swells,
// a deep rumble and the odd cluster of bubbles. There is no audio file and
// nothing to license. Browsers only allow sound after a tap, so it starts
// muted and plays when a visitor taps the button. It fades out while the
// tab is hidden. You can swap in your own royalty-free loop with the
// "Sound File" control.

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */

interface Props {
    volume: number
    soundFile: string
    showLabel: boolean
    showIndicator: boolean
    labelOn: string
    labelOff: string
    font: React.CSSProperties
    color: string
    accent: string
    fill: string
    border: string
    radius: number
    style?: React.CSSProperties
}

const rand = (a: number, b: number) => a + Math.random() * (b - a)

// ---------------------------------------------------------------------------
// Sound engine
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

export default function OceanSound(props: Props) {
    const {
        volume = 0.5,
        soundFile = "",
        showLabel = false,
        showIndicator = false,
        labelOn = "sound on",
        labelOff = "sound off",
        font,
        color = "#EAF2FF",
        accent = "#6FA0FF",
        fill = "rgba(255, 255, 255, 0)",
        border = "rgba(255, 255, 255, 0.17)",
        radius = 2,
        style,
    } = props

    const audioRef = useRef<Ocean | null>(null)
    const onRef = useRef(false)
    const [on, setOn] = useState(false)

    const toggle = () => {
        if (!audioRef.current) {
            audioRef.current = createOcean(volume, soundFile || undefined)
            onRef.current = !!audioRef.current
            setOn(onRef.current)
            return
        }
        const next = !on
        audioRef.current.setOn(next)
        onRef.current = next
        setOn(next)
    }

    useEffect(() => {
        audioRef.current?.setVolume(volume)
    }, [volume])

    useEffect(() => {
        // A new sound file means a new source: rebuild on the next tap.
        audioRef.current?.close()
        audioRef.current = null
        onRef.current = false
        setOn(false)
    }, [soundFile])

    useEffect(() => {
        // Fade out while the tab is hidden, and back in when it returns.
        const onVis = () => {
            if (!audioRef.current || !onRef.current) return
            audioRef.current.setOn(!document.hidden)
        }
        document.addEventListener("visibilitychange", onVis)
        return () => {
            document.removeEventListener("visibilitychange", onVis)
            audioRef.current?.close()
            audioRef.current = null
        }
    }, [])

    return (
        <div style={{ ...style, display: "inline-flex" }}>
            <style>
                {"@keyframes os-wave { 0%,100% { transform: scaleY(.3) } 50% { transform: scaleY(1) } }" +
                    "@keyframes os-breathe { 0%,100% { opacity: .35 } 50% { opacity: 1 } }" +
                    ".os-btn:hover { border-color: rgba(255,255,255,0.24) !important }" +
                    ".os-btn:focus-visible { outline: 2px solid " +
                    accent +
                    "; outline-offset: 3px }" +
                    "@media (prefers-reduced-motion: reduce) { .os-anim { animation: none !important } }"}
            </style>
            <button
                type="button"
                className="os-btn"
                onClick={toggle}
                aria-pressed={on}
                aria-label={on ? "Mute ocean sound" : "Play ocean sound"}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    margin: 0,
                    justifyContent: "center",
                    padding: showLabel ? "9px 14px 9px 12px" : 11,
                    borderRadius: radius,
                    border: "1px solid " + border,
                    // Frosted glass, matching the species sign.
                    background:
                        "linear-gradient(" + fill + ", " + fill + "), linear-gradient(150deg, rgba(255,255,255,0.065), rgba(255,255,255,0.0175) 42%, color-mix(in srgb, " +
                        accent +
                        " 5.5%, transparent))",
                    backdropFilter: "blur(14px) saturate(140%)",
                    WebkitBackdropFilter: "blur(14px) saturate(140%)",
                    boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04), 0 14px 40px rgba(0,0,0,0.4), 0 0 36px color-mix(in srgb, " +
                        accent +
                        " 12%, transparent)",
                    color,
                    fontFamily: "inherit",
                    fontSize: 12,
                    lineHeight: 1,
                    letterSpacing: "0.08em",
                    textTransform: "lowercase",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "border-color .2s",
                    ...font,
                }}
            >
                <SpeakerIcon on={on} />
                {showLabel && <span>{on ? labelOn : labelOff}</span>}
                {!showIndicator ? null : on ? (
                    <span
                        aria-hidden="true"
                        style={{ display: "inline-flex", alignItems: "center", gap: 2, height: 12 }}
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <span
                                key={i}
                                className="os-anim"
                                style={{
                                    width: 2,
                                    height: 12,
                                    borderRadius: 2,
                                    background: accent,
                                    boxShadow: "0 0 6px " + accent,
                                    transformOrigin: "center",
                                    animation:
                                        "os-wave " +
                                        (1.1 + i * 0.23).toFixed(2) +
                                        "s ease-in-out " +
                                        (i * -0.37).toFixed(2) +
                                        "s infinite",
                                }}
                            />
                        ))}
                    </span>
                ) : (
                    <span
                        aria-hidden="true"
                        className="os-anim"
                        style={{
                            width: 5,
                            height: 5,
                            borderRadius: 5,
                            background: accent,
                            boxShadow: "0 0 8px " + accent,
                            animation: "os-breathe 2.4s ease-in-out infinite",
                        }}
                    />
                )}
            </button>
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

addPropertyControls(OceanSound, {
    volume: {
        type: ControlType.Number,
        title: "Volume",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.5,
    },
    soundFile: {
        type: ControlType.File,
        title: "Sound File",
        allowedFileTypes: ["mp3", "wav", "ogg", "m4a"],
        description: "Optional. Leave empty to use the generated ocean sound.",
    },
    showLabel: { type: ControlType.Boolean, title: "Label", defaultValue: false },
    showIndicator: { type: ControlType.Boolean, title: "Indicator", defaultValue: false },
    labelOn: {
        type: ControlType.String,
        title: "On Text",
        defaultValue: "sound on",
        hidden: (p: Props) => !p.showLabel,
    },
    labelOff: {
        type: ControlType.String,
        title: "Off Text",
        defaultValue: "sound off",
        hidden: (p: Props) => !p.showLabel,
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "basic",
        defaultFontType: "sans-serif",
        hidden: (p: Props) => !p.showLabel,
    },
    color: { type: ControlType.Color, title: "Text", defaultValue: "#EAF2FF" },
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#6FA0FF" },
    fill: { type: ControlType.Color, title: "Tint Layer", defaultValue: "rgba(255, 255, 255, 0)" },
    border: { type: ControlType.Color, title: "Border", defaultValue: "rgba(255, 255, 255, 0.17)" },
    radius: { type: ControlType.Number, title: "Radius", min: 0, max: 999, step: 1, unit: "px", defaultValue: 2 },
})
