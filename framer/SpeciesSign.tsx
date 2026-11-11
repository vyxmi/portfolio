// SpeciesSign: a frosted-glass aquarium placard, the kind that sits next to a
// tank and describes the species inside. This one describes you.
//
// Paste this whole file into Framer: Assets → Code → "+" → New Code File,
// name it SpeciesSign, then drag it onto the page.
//
// A small location tag, your name as the common name, your title in italics
// like a scientific name, and "please do not tap the glass" along the bottom.
// The pane is held to the glass by four little screws, and a glint of light
// slides across it now and then. Tap it anyway and the glass ripples, the
// sign wobbles, the jellyfish scrunches its eyes and the bottom line answers
// back.

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */

interface Props {
    location: string
    name: string
    title: string
    notice: string
    replies: string[]
    showIcon: boolean
    nameFont: React.CSSProperties
    font: React.CSSProperties
    nameSize: number
    radius: number
    color: string
    tint: string
    style?: React.CSSProperties
}

// Two identical keyframes, swapped on each tap, so the wobble restarts.
const WOBBLE =
    "0% { transform: rotate(0) } 15% { transform: rotate(-2deg) translateY(1px) } 35% { transform: rotate(1.4deg) } 55% { transform: rotate(-.8deg) } 75% { transform: rotate(.4deg) } 100% { transform: rotate(0) }"

const DEFAULT_REPLIES = ["hey!", "shh, they're sleeping", "the jellies felt that", "okay, one more"]

// A see-through version of a color (works with Framer color styles too).
const tinted = (c: string, pct: number) => "color-mix(in srgb, " + c + " " + pct + "%, transparent)"

interface Ripple {
    id: number
    x: number
    y: number
}

export default function SpeciesSign(props: Props) {
    const {
        location = "Bay Area, CA",
        name = "Vyomi Seth",
        title = "Product Design Engineer, Growth",
        notice = "please do not tap the glass",
        replies = DEFAULT_REPLIES,
        showIcon = true,
        nameFont,
        font,
        nameSize = 26,
        radius = 2,
        color = "#EAF2FF",
        tint = "#6FA0FF",
        style,
    } = props

    const list = replies && replies.length ? replies : DEFAULT_REPLIES
    const [reply, setReply] = useState(-1)
    const [wobble, setWobble] = useState(0)
    const [ripples, setRipples] = useState<Ripple[]>([])
    const taps = useRef(0)
    const nextId = useRef(0)
    const replyTimer = useRef<any>(null)

    useEffect(() => () => clearTimeout(replyTimer.current), [])

    const onTap = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        // Keyboard presses have no pointer position: ripple from the middle.
        const fromKeys = e.detail === 0
        const id = ++nextId.current
        const x = fromKeys ? rect.width / 2 : e.clientX - rect.left
        const y = fromKeys ? rect.height / 2 : e.clientY - rect.top
        setRipples((r) => r.slice(-3).concat({ id, x, y }))
        setTimeout(() => setRipples((r) => r.filter((q) => q.id !== id)), 1000)
        setWobble((w) => w + 1)
        setReply(taps.current % list.length)
        taps.current++
        clearTimeout(replyTimer.current)
        replyTimer.current = setTimeout(() => setReply(-1), 2200)
    }

    const startled = reply >= 0
    const small = Math.max(9, Math.round(nameSize * 0.42))
    const sub = Math.max(11, Math.round(nameSize * 0.54))
    const glow = "0 0 14px " + tinted(tint, 40)
    const r = Math.max(0, radius)
    // Only the family is taken from the font controls, so the sign keeps its
    // own weights, sizes and the italic title.
    const family = font && font.fontFamily ? { fontFamily: font.fontFamily } : {}
    const nameFamily = nameFont && nameFont.fontFamily ? { fontFamily: nameFont.fontFamily } : family

    return (
        <div style={{ ...style, display: "inline-flex" }}>
            <style>
                {"@keyframes ss-wobble-a { " +
                    WOBBLE +
                    " } @keyframes ss-wobble-b { " +
                    WOBBLE +
                    " }" +
                    "@keyframes ss-ripple { from { transform: translate(-50%,-50%) scale(0); opacity: .5 } to { transform: translate(-50%,-50%) scale(1); opacity: 0 } }" +
                    "@keyframes ss-glare { 0%, 60% { transform: translateX(-160%) skewX(-18deg) } 84%, 100% { transform: translateX(560%) skewX(-18deg) } }" +
                    "@keyframes ss-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }" +
                    ".ss-sign:hover { border-color: rgba(255,255,255,0.24) !important }" +
                    ".ss-sign:focus-visible { outline: 2px solid " +
                    tint +
                    "; outline-offset: 3px }" +
                    "@media (prefers-reduced-motion: reduce) { .ss-anim { animation: none !important } }"}
            </style>
            <button
                type="button"
                className="ss-sign"
                onClick={onTap}
                aria-label={name + ", " + title + ", " + location + ". " + notice}
                style={{
                    position: "relative",
                    flex: "1 1 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    margin: 0,
                    padding: Math.round(nameSize * 0.8) + "px " + Math.round(nameSize * 0.9) + "px",
                    borderRadius: r,
                    border: "1px solid rgba(255, 255, 255, 0.17)",
                    background:
                        "linear-gradient(150deg, rgba(255,255,255,0.13), rgba(255,255,255,0.035) 42%, " +
                        tinted(tint, 11) +
                        ")",
                    backdropFilter: "blur(14px) saturate(140%)",
                    WebkitBackdropFilter: "blur(14px) saturate(140%)",
                    boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04), 0 14px 40px rgba(0,0,0,0.4), 0 0 36px " +
                        tinted(tint, 12),
                    color,
                    fontFamily: "inherit",
                    textAlign: "left",
                    cursor: "pointer",
                    overflow: "hidden",
                    transformOrigin: "50% 0%",
                    animation: wobble
                        ? (wobble % 2 ? "ss-wobble-a" : "ss-wobble-b") + " .6s cubic-bezier(.36,.07,.19,.97)"
                        : "none",
                    transition: "border-color .2s",
                    WebkitTapHighlightColor: "transparent",
                }}
            >
                {/* Four little screws holding the placard to the glass. */}
                <Screw x="left" y="top" />
                <Screw x="right" y="top" />
                <Screw x="left" y="bottom" />
                <Screw x="right" y="bottom" />

                {/* The top of the pane catches a little more light. */}
                <span
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: 1,
                        right: 1,
                        top: 1,
                        height: "42%",
                        borderRadius: Math.max(0, r - 1) + "px " + Math.max(0, r - 1) + "px 0 0",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0))",
                        pointerEvents: "none",
                    }}
                />

                {/* A glint of light that slides across now and then. */}
                <span
                    aria-hidden="true"
                    className="ss-anim"
                    style={{
                        position: "absolute",
                        top: "-40%",
                        left: 0,
                        width: "20%",
                        height: "180%",
                        background:
                            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.12), rgba(255,255,255,0))",
                        pointerEvents: "none",
                        animation: "ss-glare 8s ease-in-out 2s infinite",
                        transform: "translateX(-160%) skewX(-18deg)",
                    }}
                />

                {ripples.map((q) => (
                    <span
                        key={q.id}
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            left: q.x,
                            top: q.y,
                            width: 360,
                            height: 360,
                            borderRadius: "50%",
                            border: "1.5px solid rgba(255,255,255,0.7)",
                            boxShadow: "0 0 18px " + tinted(tint, 50) + ", inset 0 0 14px " + tinted(tint, 40),
                            pointerEvents: "none",
                            animation: "ss-ripple .95s cubic-bezier(.2,.7,.3,1) forwards",
                        }}
                    />
                ))}

                {/* Location tag and the little jellyfish "specimen" drawing. */}
                <span
                    aria-hidden="true"
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 16,
                        ...family,
                    }}
                >
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "3px 7px 3px 6px",
                            borderRadius: Math.min(r, 2),
                            border: "1px solid " + tinted(tint, 45),
                            background: tinted(tint, 12),
                            fontSize: small,
                            lineHeight: 1.1,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            fontWeight: 500,
                        }}
                    >
                        <Pin size={small + 1} />
                        {location}
                    </span>
                    {showIcon && <Jelly tint={tint} startled={startled} size={Math.round(nameSize * 1.35)} />}
                </span>

                {/* Common name, then the title in italics like a scientific name. */}
                <span
                    aria-hidden="true"
                    style={{
                        display: "block",
                        marginTop: showIcon ? -Math.round(nameSize * 0.2) : Math.round(nameSize * 0.45),
                        fontSize: nameSize,
                        lineHeight: 1.08,
                        letterSpacing: "-0.01em",
                        fontWeight: 600,
                        textShadow: glow,
                        ...nameFamily,
                    }}
                >
                    {name}
                </span>
                <span
                    aria-hidden="true"
                    style={{
                        display: "block",
                        marginTop: Math.round(nameSize * 0.18),
                        fontSize: sub,
                        lineHeight: 1.3,
                        fontStyle: "italic",
                        opacity: 0.68,
                        ...family,
                    }}
                >
                    {title}
                </span>

                {/* A fine rule, like the line under a species description. */}
                <span
                    aria-hidden="true"
                    style={{
                        display: "block",
                        height: 1,
                        margin: Math.round(nameSize * 0.55) + "px 0 " + Math.round(nameSize * 0.42) + "px",
                        background:
                            "linear-gradient(90deg, rgba(255,255,255,0.28), rgba(255,255,255,0.12) 70%, rgba(255,255,255,0))",
                    }}
                />

                {/* All lines share one grid cell, so the sign never changes size. */}
                <span
                    aria-hidden="true"
                    style={{
                        display: "grid",
                        position: "relative",
                        fontSize: small,
                        lineHeight: 1.2,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        ...family,
                    }}
                >
                    <span
                        style={{
                            gridArea: "1 / 1",
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            opacity: startled ? 0 : 0.78,
                            transform: startled ? "translateY(-4px)" : "none",
                            transition: "opacity .25s, transform .25s",
                        }}
                    >
                        <NoTap size={small + 3} />
                        {notice}
                    </span>
                    {list.map((line, i) => (
                        <span
                            key={i}
                            style={{
                                gridArea: "1 / 1",
                                opacity: reply === i ? 1 : 0,
                                transform: reply === i ? "none" : "translateY(4px)",
                                transition: "opacity .25s, transform .25s",
                                textShadow: glow,
                            }}
                        >
                            {line}
                        </span>
                    ))}
                </span>
                <span
                    aria-live="polite"
                    style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        overflow: "hidden",
                        clip: "rect(0 0 0 0)",
                    }}
                >
                    {startled ? list[reply] : ""}
                </span>
            </button>
        </div>
    )
}

function Screw({ x, y }: { x: "left" | "right"; y: "top" | "bottom" }) {
    return (
        <span
            aria-hidden="true"
            style={{
                position: "absolute",
                [y]: 6,
                [x]: 6,
                width: 5,
                height: 5,
                borderRadius: "50%",
                background:
                    "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), rgba(255,255,255,0.12) 60%, rgba(255,255,255,0.04))",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
            }}
        />
    )
}

function Pin({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flex: "none" }}>
            <path
                d="M8 14.5s4.5-4.2 4.5-7.7A4.5 4.5 0 0 0 3.5 6.8c0 3.5 4.5 7.7 4.5 7.7z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
            />
            <circle cx="8" cy="6.8" r="1.6" fill="currentColor" />
        </svg>
    )
}

// A small "no tapping" mark: a fingertip in a crossed-out circle.
function NoTap({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flex: "none" }}>
            <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.2" />
            <path
                d="M7 11.2V5.4a.9.9 0 0 1 1.8 0v3l1.6.4c.5.1.8.6.7 1.1l-.4 1.3"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M3.4 3.4l9.2 9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    )
}

// A sleepy little moon jelly. It scrunches its eyes when the glass is tapped.
function Jelly({ tint, startled, size }: { tint: string; startled: boolean; size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="ss-anim"
            style={{ flex: "none", animation: "ss-bob 3.4s ease-in-out infinite", overflow: "visible", opacity: 0.9 }}
        >
            <path
                d="M4.5 12.2a7.5 7.5 0 0 1 15 0c0 .55-.45 1-1 1h-13c-.55 0-1-.45-1-1z"
                fill={tinted(tint, 26)}
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
            />
            <path d="M7.4 7.6a5.4 5.4 0 0 1 3.2-2" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeLinecap="round" />
            {startled ? (
                <>
                    <path d="M8.4 8.9l1.6.9-1.6.9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.6 8.9l-1.6.9 1.6.9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </>
            ) : (
                <>
                    <path d="M8.3 9.9q.9.8 1.8 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                    <path d="M13.9 9.9q.9.8 1.8 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </>
            )}
            <ellipse cx="7.6" cy="11.3" rx="1" ry=".55" fill="rgba(255,160,200,0.4)" />
            <ellipse cx="16.4" cy="11.3" rx="1" ry=".55" fill="rgba(255,160,200,0.4)" />
            <path
                d="M8.5 13.6c0 1.4-1 1.9-1 3.3s1 1.9 1 3.1M12 13.6c0 1.5-.9 2.1-.9 3.6s.9 2.1.9 3.6M15.5 13.6c0 1.4 1 1.9 1 3.3s-1 1.9-1 3.1"
                stroke="currentColor"
                strokeOpacity="0.7"
                strokeWidth="1.1"
                strokeLinecap="round"
            />
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Framer property controls
// ---------------------------------------------------------------------------

addPropertyControls(SpeciesSign, {
    location: { type: ControlType.String, title: "Location", defaultValue: "Bay Area, CA" },
    name: { type: ControlType.String, title: "Name", defaultValue: "Vyomi Seth" },
    title: { type: ControlType.String, title: "Title", defaultValue: "Product Design Engineer, Growth" },
    notice: { type: ControlType.String, title: "Notice", defaultValue: "please do not tap the glass" },
    replies: {
        type: ControlType.Array,
        title: "Tap Replies",
        control: { type: ControlType.String },
        defaultValue: DEFAULT_REPLIES,
        description: "What the bottom line says back, in turn, each time someone taps it.",
    },
    showIcon: { type: ControlType.Boolean, title: "Jellyfish", defaultValue: true },
    nameFont: { type: ControlType.Font, title: "Name Font", controls: "basic", defaultFontType: "sans-serif" },
    font: { type: ControlType.Font, title: "Font", controls: "basic", defaultFontType: "sans-serif" },
    nameSize: {
        type: ControlType.Number,
        title: "Name Size",
        min: 14,
        max: 64,
        step: 1,
        unit: "px",
        defaultValue: 26,
        description: "Everything else scales with it.",
    },
    radius: { type: ControlType.Number, title: "Radius", min: 0, max: 24, step: 1, unit: "px", defaultValue: 2 },
    color: { type: ControlType.Color, title: "Text", defaultValue: "#EAF2FF" },
    tint: { type: ControlType.Color, title: "Tint", defaultValue: "#6FA0FF" },
})
