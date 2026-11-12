// GlassSign: a little frosted-glass aquarium sign for Framer.
//
// Paste this whole file into Framer: Assets → Code → "+" → New Code File,
// name it GlassSign, then drag it onto the page.
//
// A small pane of frosted glass held up by two suction cups, with a sleepy
// jellyfish and "please do not tap the glass". A glint of light slides
// across it now and then. Tap it anyway and the glass ripples, the sign
// wobbles, the jellyfish scrunches its eyes and the sign answers back.

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */

interface Props {
    text: string
    replies: string[]
    showIcon: boolean
    font: React.CSSProperties
    fontSize: number
    color: string
    tint: string
    style?: React.CSSProperties
}

// Two identical keyframes, swapped on each tap, so the wobble restarts.
const WOBBLE =
    "0% { transform: rotate(0) } 15% { transform: rotate(-3.5deg) translateY(1px) } 35% { transform: rotate(2.5deg) } 55% { transform: rotate(-1.5deg) } 75% { transform: rotate(.8deg) } 100% { transform: rotate(0) }"

const DEFAULT_REPLIES = ["hey!", "shh, they're sleeping", "the jellies felt that", "okay, one more"]

// A see-through version of a color (works with Framer color styles too).
const tinted = (c: string, pct: number) => "color-mix(in srgb, " + c + " " + pct + "%, transparent)"

interface Ripple {
    id: number
    x: number
    y: number
}

export default function GlassSign(props: Props) {
    const {
        text = "please do not tap the glass",
        replies = DEFAULT_REPLIES,
        showIcon = true,
        font,
        fontSize = 13,
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
        setTimeout(() => setRipples((r) => r.filter((q) => q.id !== id)), 900)
        setWobble((w) => w + 1)
        setReply(taps.current % list.length)
        taps.current++
        clearTimeout(replyTimer.current)
        replyTimer.current = setTimeout(() => setReply(-1), 2200)
    }

    const startled = reply >= 0

    return (
        <div style={{ ...style, display: "inline-flex" }}>
            <style>
                {"@keyframes gs-wobble-a { " +
                    WOBBLE +
                    " } @keyframes gs-wobble-b { " +
                    WOBBLE +
                    " }" +
                    "@keyframes gs-ripple { from { transform: translate(-50%,-50%) scale(0); opacity: .55 } to { transform: translate(-50%,-50%) scale(1); opacity: 0 } }" +
                    "@keyframes gs-glare { 0%, 62% { transform: translateX(-180%) skewX(-20deg) } 82%, 100% { transform: translateX(420%) skewX(-20deg) } }" +
                    "@keyframes gs-bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-1.5px) } }" +
                    ".gs-sign:hover { border-color: rgba(255,255,255,0.26) !important }" +
                    ".gs-sign:focus-visible { outline: 2px solid " +
                    tint +
                    "; outline-offset: 3px }" +
                    "@media (prefers-reduced-motion: reduce) { .gs-anim { animation: none !important } }"}
            </style>
            <button
                type="button"
                className="gs-sign"
                onClick={onTap}
                aria-label={text}
                style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    margin: 0,
                    padding: "15px 22px 13px 18px",
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background:
                        "linear-gradient(140deg, rgba(255,255,255,0.17), rgba(255,255,255,0.05) 45%, " +
                        tinted(tint, 14) +
                        ")",
                    backdropFilter: "blur(12px) saturate(140%)",
                    WebkitBackdropFilter: "blur(12px) saturate(140%)",
                    boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.35), 0 0 28px " +
                        tinted(tint, 14),
                    color,
                    fontFamily: "inherit",
                    fontSize,
                    lineHeight: 1.2,
                    letterSpacing: "0.02em",
                    textTransform: "lowercase",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    overflow: "hidden",
                    transformOrigin: "50% 0%",
                    animation: wobble
                        ? (wobble % 2 ? "gs-wobble-a" : "gs-wobble-b") + " .6s cubic-bezier(.36,.07,.19,.97)"
                        : "none",
                    transition: "border-color .2s",
                    WebkitTapHighlightColor: "transparent",
                    ...font,
                }}
            >
                {/* Suction cups holding the sign to the glass. */}
                <SuctionCup side="left" />
                <SuctionCup side="right" />

                {/* The top of the pane catches a little more light. */}
                <span
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: 1,
                        right: 1,
                        top: 1,
                        height: "48%",
                        borderRadius: "1px 1px 0 0",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
                        pointerEvents: "none",
                    }}
                />

                {/* A glint of light that slides across now and then. */}
                <span
                    aria-hidden="true"
                    className="gs-anim"
                    style={{
                        position: "absolute",
                        top: "-50%",
                        left: 0,
                        width: "28%",
                        height: "200%",
                        background:
                            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.16), rgba(255,255,255,0))",
                        pointerEvents: "none",
                        animation: "gs-glare 7s ease-in-out 1.5s infinite",
                        transform: "translateX(-180%) skewX(-20deg)",
                    }}
                />

                {ripples.map((r) => (
                    <span
                        key={r.id}
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            left: r.x,
                            top: r.y,
                            width: 220,
                            height: 220,
                            borderRadius: "50%",
                            border: "1.5px solid rgba(255,255,255,0.75)",
                            boxShadow: "0 0 16px " + tinted(tint, 50) + ", inset 0 0 12px " + tinted(tint, 40),
                            pointerEvents: "none",
                            animation: "gs-ripple .85s cubic-bezier(.2,.7,.3,1) forwards",
                        }}
                    />
                ))}

                {showIcon && <Jelly tint={tint} startled={startled} size={Math.round(fontSize * 2)} />}

                {/* All lines share one grid cell, so the sign never changes size. */}
                <span style={{ display: "grid", position: "relative" }}>
                    <span
                        style={{
                            gridArea: "1 / 1",
                            opacity: startled ? 0 : 1,
                            transform: startled ? "translateY(-4px)" : "none",
                            transition: "opacity .25s, transform .25s",
                            textShadow: "0 0 12px " + tinted(tint, 45),
                        }}
                    >
                        {text}
                    </span>
                    {list.map((line, i) => (
                        <span
                            key={i}
                            aria-hidden={reply !== i}
                            style={{
                                gridArea: "1 / 1",
                                opacity: reply === i ? 1 : 0,
                                transform: reply === i ? "none" : "translateY(4px)",
                                transition: "opacity .25s, transform .25s",
                                textShadow: "0 0 12px " + tinted(tint, 45),
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

function SuctionCup({ side }: { side: "left" | "right" }) {
    return (
        <span
            aria-hidden="true"
            style={{
                position: "absolute",
                top: 6,
                [side]: 7,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background:
                    "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(255,255,255,0.12) 60%, rgba(255,255,255,0.04))",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.14)",
            }}
        />
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
            className="gs-anim"
            style={{ flex: "none", animation: "gs-bob 3.2s ease-in-out infinite", overflow: "visible" }}
        >
            <path
                d="M4.5 12.2a7.5 7.5 0 0 1 15 0c0 .55-.45 1-1 1h-13c-.55 0-1-.45-1-1z"
                fill={tinted(tint, 28)}
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
            />
            <path d="M7.4 7.6a5.4 5.4 0 0 1 3.2-2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.1" strokeLinecap="round" />
            {startled ? (
                <>
                    <path d="M8.4 8.9l1.6.9-1.6.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.6 8.9l-1.6.9 1.6.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </>
            ) : (
                <>
                    <path d="M8.3 9.9q.9.8 1.8 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M13.9 9.9q.9.8 1.8 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </>
            )}
            <ellipse cx="7.6" cy="11.3" rx="1" ry=".55" fill="rgba(255,160,200,0.45)" />
            <ellipse cx="16.4" cy="11.3" rx="1" ry=".55" fill="rgba(255,160,200,0.45)" />
            <path
                d="M8.5 13.6c0 1.4-1 1.9-1 3.3s1 1.9 1 3.1M12 13.6c0 1.5-.9 2.1-.9 3.6s.9 2.1.9 3.6M15.5 13.6c0 1.4 1 1.9 1 3.3s-1 1.9-1 3.1"
                stroke="currentColor"
                strokeOpacity="0.75"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Framer property controls
// ---------------------------------------------------------------------------

addPropertyControls(GlassSign, {
    text: { type: ControlType.String, title: "Text", defaultValue: "please do not tap the glass" },
    replies: {
        type: ControlType.Array,
        title: "Tap Replies",
        control: { type: ControlType.String },
        defaultValue: DEFAULT_REPLIES,
        description: "What the sign says back, in turn, each time someone taps it.",
    },
    showIcon: { type: ControlType.Boolean, title: "Jellyfish", defaultValue: true },
    font: { type: ControlType.Font, title: "Font", controls: "basic", defaultFontType: "sans-serif" },
    fontSize: {
        type: ControlType.Number,
        title: "Font Size",
        min: 10,
        max: 32,
        step: 1,
        unit: "px",
        defaultValue: 13,
    },
    color: { type: ControlType.Color, title: "Text", defaultValue: "#EAF2FF" },
    tint: { type: ControlType.Color, title: "Tint", defaultValue: "#6FA0FF" },
})
