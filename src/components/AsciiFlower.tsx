"use client";

import { useEffect, useRef } from "react";

// Braille-art flower. Grows in from the ground up on mount (bottom rows
// first, stem tip last), then sits still until the pointer comes near —
// nearby glyphs orbit their rest position and occasionally swap to a
// different braille pattern, like static gathering under a cursor.
const FLOWER_ROWS = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣤⣀⠀⠀⠀⠀⠀⣀⣀⣠⠀⠀⢀⠁⠀⠀⠀⢀⣠⡤⠤⢤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣷⡀⠀⣴⣿⣿⣿⡇⠀⠀⠸⠀⠀⣠⠞⠉⠀⠀⠀⠀⠀⠉⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣏⢻⠃⢸⠿⣻⣿⡿⠁⠀⠀⡄⠀⣼⠃⠀⠀⠀⢀⠤⣤⣄⠀⠀⠘⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⣌⣙⡢⣠⡃⠘⠛⠉⠀⠀⠀⠀⡄⢸⠃⠀⠀⠀⢰⠁⠀⠹⠿⠀⠀⠀⡹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣯⣥⡤⢊⠛⠋⣍⡛⣿⣿⣶⡄⠀⢸⣿⠀⠀⠀⠀⠸⡀⠀⠀⠀⠀⠀⣠⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⠿⠟⠋⢠⣾⢠⣧⠘⢿⣿⣿⣿⣿⡄⢸⣿⠀⠀⠀⠀⠀⠙⠢⠄⠀⠤⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣾⣿⡇⠀⠩⡉⠉⠉⠁⠈⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⡿⠁⠀⠀⠡⡀⠀⠀⠀⢻⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⠋⠀⠀⠀⠀⠀⠈⠢⡀⠀⠈⢿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣾⣿⡇⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠲⣄⠘⣿⣄⠀⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⢼⣿⣆⠀⠀⠀⣰⣿⣿⡿⣻⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⠶⠾⠛⠛⠛⠻⠷⢶⣤⣀⠀⠀⠙⢿⣦⠀⠀⣿⣿⢋⣾⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣦⡀⠈⢿⣧⠀⠸⡇⣾⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣆⠈⢿⣧⠀⠑⠉⠁⠀⠀⠀⠀⠀⢀⣤⣦⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀⠀⠠⠤⢀⠀⠀⢠⡀⠀⠀⠀⠈⢻⣆⠈⣿⣇⠀⠐⣶⣶⣤⣄⠀⣰⣿⣿⣿⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠄⠀⢻⣿⣶⣤⡀⠈⣿⡄⢸⣿⡄⠀⠻⣿⣟⠿⡆⢻⢣⡿⠋⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣇⠀⠀⠀⠀⠀⣴⣾⣿⠋⠀⠀⢸⠀⠀⢻⣿⣿⣷⡀⢹⡇⠀⣿⡇⠀⠀⠉⢛⣓⡚⣶⡇⡐⣻⣿⣿⣷⣄",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣆⠀⠀⠀⠘⠋⠉⠁⠀⠀⢀⠎⠀⠀⠈⢻⣿⣿⡇⢸⡇⠀⣿⡇⠀⣠⣾⣿⣡⡜⣨⢡⡈⠻⠿⠿⠋⠁",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⣄⡀⠀⠀⠀⠀⣀⡴⠋⠀⠀⠀⠀⠀⠙⠻⡇⢸⠇⢰⣿⠇⢠⣿⣿⡿⠟⠀⣿⣾⣿⡆⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⡟⠀⣼⡿⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⡇⠀⠀⠀⠀",
  "⢳⣦⣤⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡸⠁⣸⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀",
  "⠈⢻⣿⣿⣿⡿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⠁⣴⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠙⠿⢿⣿⣷⡝⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡇⠀⠀⠔⢀⣾⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠈⠉⣉⠁⠥⠤⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣾⣿⠇⠀⠄⣠⣾⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠄⠊⡁⠀⠀⠀⠀⢀⣠⡌⠑⠦⡀⠀⠀⠀⣼⡿⣻⣿⣿⡿⠀⢀⣾⡿⠋⣀⠐⠶⠿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⣿⣿⣦⡀⢰⣿⣿⡇⠀⠀⠈⢦⠀⠀⡟⣰⣿⣿⠟⢁⣴⡿⠋⠀⠀⠈⠻⣿⣷⣮⣝⡿⣿⣿⣿⣦⣄⣀⣀⡀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠈⠻⣏⢇⠘⡽⠋⠀⠀⠀⠀⠈⣧⠀⠁⠋⠉⢀⣴⡿⠋⠀⠀⠀⠀⠀⠀⠘⠻⣿⣿⣿⣿⣿⣿⣿⡿⠛⠉⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⢀⣴⣶⣖⡲⢹⡟⢔⣛⣿⣶⡄⠀⠀⢸⡄⠀⠀⣠⣾⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠘⠛⠛⠛⢁⣾⣿⡄⠙⠛⠛⠉⠀⠀⢸⡇⠀⣴⣿⠋⠀⠀⠀⣀⣤⣴⣶⠾⠿⠿⠿⠷⣶⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⠇⠀⠀⠀⠀⠀⠀⣾⠃⣼⡿⠁⠀⢀⣴⡿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⢷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⢰⡟⣼⡿⠁⢀⣴⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣆⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣱⣿⠃⢠⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣧⠀⠀⠀⠀⠀⠀",
  "⠀⢀⡴⠞⠋⠉⠉⠉⠙⠳⢦⣄⠀⠀⠀⣸⣇⣿⡇⢀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠠⠐⠒⠂⠀⠀⠀⠀⢀⠀⠀⠀⢻⡆⠀⠀⠀⠀⠀",
  "⢠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⡄⠀⣿⢸⣿⠀⡸⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠀⠀⠀⠀⠀⣀⣤⣶⡏⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀",
  "⡞⠀⠀⠀⠀⠠⠾⣿⡿⢆⠀⠀⠀⢻⡀⡇⣿⡟⢀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⢰⣿⣿⡿⠃⠀⠀⠀⢸⠇⠀⠀⠀⠀⠀",
  "⣇⠀⠀⠀⠀⠀⠀⠀⠀⠘⡆⠀⠀⠀⢃⠃⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⠀⠀⠀⠀⠟⠉⠀⠀⠀⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀",
  "⠸⡄⠀⠀⠀⠀⠀⠀⠀⢰⠁⠀⠀⠀⠘⠀⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡟⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠈⠲⢄⣀⣀⣀⡠⠔⠁⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀⠀⢠⣿⣷⡄⠀⢀⣀⣈⠳⣄⣀⠀⠀⠀⢀⣀⡤⠞⠋⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡇⠀⠀⠀⠀⠈⢿⡻⡏⣰⣿⣿⡟⠀⠀⠈⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣧⠀⢀⣤⣶⣦⡌⢣⣇⡫⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡄⠉⠻⠿⠿⢓⡙⡟⢏⣲⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣷⡀⠀⠀⢠⣿⣷⡷⠈⠻⠿⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣷⡀⠀⠀⠿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
];

const BLANK = "⠀";
const GLYPH_POOL = "⠁⠂⠄⡀⢀⠈⠐⠠⠨⠘⠰⠋⠛⠟⠿⣿⣾⣷⣶⣤⣄⣀⡆⡇⣇⣆".split("");
const FONT_STACK = 'ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace';

function hash(n: number) {
  const s = Math.sin(n) * 43758.5453123;
  return s - Math.floor(s);
}

function ease(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Cell = {
  col: number;
  row: number;
  char: string;
  glyph: string;
  seed: number;
  phase: number;
  glitchUntil: number;
};

export default function AsciiFlower({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rows = FLOWER_ROWS.length;
    const cols = FLOWER_ROWS.reduce((m, line) => Math.max(m, [...line].length), 0);

    const cells: Cell[] = [];
    FLOWER_ROWS.forEach((line, row) => {
      [...line].forEach((char, col) => {
        if (char === BLANK) return;
        const seed = row * 97 + col * 13 + 1;
        cells.push({ col, row, char, glyph: char, seed, phase: hash(seed) * Math.PI * 2, glitchUntil: 0 });
      });
    });
    const n = cells.length;
    const offX = new Float32Array(n);
    const offY = new Float32Array(n);
    const alpha = new Float32Array(n);
    const grow = new Float32Array(n);

    let cellW = 0;
    let cellH = 0;
    let fontPx = 0;
    let dpr = 1;

    function measure() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const containerW = wrap!.clientWidth;
      if (containerW <= 0) return;
      fontPx = 16;
      ctx!.font = `${fontPx}px ${FONT_STACK}`;
      const probe = ctx!.measureText("⣿").width || fontPx * 0.62;
      fontPx = fontPx * ((containerW / cols) / probe);
      ctx!.font = `${fontPx}px ${FONT_STACK}`;
      cellW = ctx!.measureText("⣿").width;
      cellH = fontPx * 1.08;
      const cssW = cellW * cols;
      const cssH = cellH * rows;
      canvas!.width = Math.ceil(cssW * dpr);
      canvas!.height = Math.ceil(cssH * dpr);
      canvas!.style.width = `${cssW}px`;
      canvas!.style.height = `${cssH}px`;
    }

    measure();

    let pointer: { x: number; y: number } | null = null;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = canvas!.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
      kick();
    }
    function onLeave() {
      pointer = null;
      kick();
    }

    if (!reduceMotion) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    const start = performance.now();
    const GROW_MS = 1500;
    let raf = 0;

    function kick() {
      if (!raf) raf = requestAnimationFrame(draw);
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.save();
      ctx!.scale(dpr, dpr);
      ctx!.font = `${fontPx}px ${FONT_STACK}`;
      ctx!.textBaseline = "top";

      const elapsed = now - start;
      const growGlobal = reduceMotion ? 1 : Math.min(1, elapsed / GROW_MS);
      const span = 0.55;
      const disp = Math.max(cellW, cellH) * 1.6;
      const radiusPx = Math.max(cellW, cellH) * 4.2;

      let moving = false;

      for (let i = 0; i < n; i++) {
        const c = cells[i];

        const rowFrac = rows <= 1 ? 0 : (rows - 1 - c.row) / (rows - 1);
        const targetGrow = reduceMotion
          ? 1
          : ease(Math.max(0, Math.min(1, (growGlobal - rowFrac * (1 - span)) / span)));
        grow[i] += (targetGrow - grow[i]) * 0.3;

        let tx = 0;
        let ty = 0;
        let influence = 0;

        if (pointer) {
          const px = c.col * cellW + cellW / 2;
          const py = c.row * cellH + cellH / 2;
          const dist = Math.hypot(pointer.x - px, pointer.y - py);
          influence = Math.max(0, 1 - dist / radiusPx);
          influence *= influence;
          if (influence > 0.001) {
            const angle = c.phase + now * 0.0012;
            tx = Math.cos(angle) * influence * disp;
            ty = Math.sin(angle) * influence * disp;
            if (influence > 0.45 && now > c.glitchUntil) {
              const roll = hash(c.seed * 12.9898 + Math.floor(now / 80));
              if (roll < 0.35) {
                const pick = hash(c.seed * 78.233 + Math.floor(now / 80));
                c.glyph = GLYPH_POOL[Math.floor(pick * GLYPH_POOL.length) % GLYPH_POOL.length];
                c.glitchUntil = now + 60 + roll * 120;
              }
            }
          }
        }
        if (influence < 0.2 && c.glyph !== c.char && now > c.glitchUntil) {
          c.glyph = c.char;
        }

        offX[i] += (tx - offX[i]) * 0.18;
        offY[i] += (ty - offY[i]) * 0.18;
        const targetAlpha = 0.34 + influence * 0.66;
        alpha[i] += (targetAlpha - alpha[i]) * 0.15;

        if (
          pointer ||
          Math.abs(targetGrow - grow[i]) > 0.002 ||
          Math.abs(offX[i] - tx) > 0.05 ||
          Math.abs(offY[i] - ty) > 0.05 ||
          Math.abs(alpha[i] - targetAlpha) > 0.01
        ) {
          moving = true;
        }

        if (grow[i] <= 0.001) continue;

        const baseX = c.col * cellW;
        const baseY = c.row * cellH + (1 - grow[i]) * cellH * 0.9;
        const a = alpha[i] * grow[i];

        const mixT = Math.min(1, influence * 1.6);
        const r = Math.round(243 + (132 - 243) * mixT);
        const g = Math.round(243 + (150 - 243) * mixT);
        const b = Math.round(246 + (234 - 246) * mixT);
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx!.fillText(c.glyph, baseX + offX[i], baseY + offY[i]);
      }

      ctx!.restore();

      if (moving || growGlobal < 1) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
      }
    }

    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      measure();
      kick();
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} style={{ width: "100%", ...style }}>
      <canvas ref={canvasRef} aria-hidden style={{ display: "block", pointerEvents: "auto" }} />
    </div>
  );
}
