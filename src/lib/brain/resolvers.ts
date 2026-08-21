import type { BrainObject, ExpandBehavior, Weight } from "./types";

const VESSEL_DEFAULT_EXPAND: Record<string, ExpandBehavior> = {
  "plain-note": "none",
  "sticky-note": "none",
  journal: "read-more",
  "notes-app": "read-more",
  checklist: "read-more",
  email: "read-more",
  polaroid: "focus",
  "film-strip": "gallery",
  "contact-sheet": "gallery",
  "display-case": "focus",
  "project-card": "external",
  "media-card": "focus",
  "spotify-artifact": "external",
  spreadsheet: "focus",
  browser: "external",
  scan: "focus",
  scrap: "focus",
  "review-card": "focus",
  __fallback__: "focus",
};

// Fallback only fires when the CMS left Vessel blank — everything else is
// a curated, deliberate choice already made in the spreadsheet.
export function resolveVessel(o: BrainObject): string {
  if (o.vessel) return o.vessel;
  return o.media && o.media.length > 0 ? "__fallback__" : "plain-note";
}

export function deriveContentLength(o: BrainObject): "micro" | "short" | "medium" | "long" {
  const len = (o.content ?? "").length;
  if (len < 60) return "micro";
  if (len < 220) return "short";
  if (len < 600) return "medium";
  return "long";
}

// Never generate a filler title — a blank Title cell means the object has
// none, regardless of Title Display.
export function resolveTitleDisplay(o: BrainObject): boolean {
  if (o.titleDisplay === "hide") return false;
  return !!o.title;
}

export function resolveExpand(o: BrainObject): ExpandBehavior {
  const vessel = resolveVessel(o);
  const set = o.expandBehavior && o.expandBehavior !== "auto" ? o.expandBehavior : VESSEL_DEFAULT_EXPAND[vessel] ?? "none";
  if (set === "read-more") {
    const cls = deriveContentLength(o);
    if (cls !== "long" && cls !== "medium") return "none";
  }
  return set;
}

export function resolveWeight(o: BrainObject): Weight {
  return o.weight ?? "normal";
}

export function cursorFor(o: BrainObject): { css: "text" | "zoom-in" | "pointer"; label: string } | null {
  switch (resolveExpand(o)) {
    case "read-more":
      return { css: "text", label: "read more" };
    case "focus":
      return { css: "zoom-in", label: "focus" };
    case "gallery":
      return { css: "zoom-in", label: o.media ? `view ${o.media.length}` : "gallery" };
    case "external":
      return { css: "pointer", label: "open" };
    default:
      return null;
  }
}

// Splits on every newline and drops blank lines. This handles true
// paragraph breaks (blank-line separated, e.g. the email/journal entries)
// and intentional single-line-break formatting (price lists, playlist
// notes) the same way the source already used them — no separate "is this
// a paragraph break" heuristic needed.
export function splitParagraphs(content?: string): string[] {
  if (!content) return [];
  return content
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface ChecklistLine {
  kind: "header" | "item";
  text: string;
  done?: boolean;
}

const MD_CHECKBOX = /^-?\s*\[([ xX])\]\s*(.*)$/;
const GLYPH_CHECKBOX = /^([☐☑])\s*(.*)$/;

// Real content uses two checkbox notations in the wild: markdown
// "- [ ]" / "- [x]" and unicode "☐" / "☑". A bare line matching neither is
// a section header, which reproduces the source's own grouping (e.g.
// B-0115's "t shirts to cinch" / "things to crop" sections) without
// inventing new structure.
export function parseChecklist(content?: string): ChecklistLine[] {
  if (!content) return [];
  const lines = content
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return lines.map((line) => {
    const md = line.match(MD_CHECKBOX);
    if (md) return { kind: "item" as const, text: md[2], done: md[1].toLowerCase() === "x" };
    const glyph = line.match(GLYPH_CHECKBOX);
    if (glyph) return { kind: "item" as const, text: glyph[2], done: glyph[1] === "☑" };
    return { kind: "header" as const, text: line };
  });
}

function parseApproxDate(str: string): Date | null {
  const monthMatch = str.match(/[A-Za-z]+\s+\d{4}/);
  if (monthMatch) {
    const d = new Date(monthMatch[0]);
    if (!isNaN(d.getTime())) return d;
  }
  const yearMatch = str.match(/\d{4}/);
  if (yearMatch) return new Date(parseInt(yearMatch[0], 10), 0, 1);
  return null;
}

// Quiet, lowercase, lives outside the vessel. The CMS already resolved
// precision into either a real ISO date or a hand-formatted override
// string ("June 2026", "2025–present") — this only chooses which to show,
// never reformats the override.
export function dateLabel(o: BrainObject): string {
  if (o.displayDateOverride) return o.displayDateOverride.toLowerCase();
  if (!o.originalDate) return "";

  if (o.datePrecision === "exact" || o.datePrecision === "date") {
    const d = new Date(o.originalDate);
    if (!isNaN(d.getTime())) {
      const now = new Date();
      const sameYear = d.getFullYear() === now.getFullYear();
      return d
        .toLocaleDateString("en-US", { month: "short", day: "numeric", year: sameYear ? undefined : "numeric" })
        .toLowerCase();
    }
  }
  // month precision without an override still carries a real "YYYY-MM"
  // Original Date on later-batch rows — format it the same way rather
  // than dropping the date entirely.
  if (o.datePrecision === "month") {
    const m = o.originalDate.match(/^(\d{4})-(\d{2})/);
    if (m) {
      const d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, 1);
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toLowerCase();
    }
  }
  if (o.datePrecision === "year") {
    const y = o.originalDate.match(/^\d{4}/);
    if (y) return y[0];
  }
  return "";
}

// Best-effort timestamp for sorting only — never shown. Falls through
// Original Date → Display Date Override → Added to CMS so every object
// sorts somewhere sensible even at "unknown" precision.
export function sortDate(o: BrainObject): number {
  if (o.originalDate) {
    const m = o.originalDate.match(/^(\d{4})(-(\d{2}))?/);
    if (m) return new Date(parseInt(m[1], 10), m[3] ? parseInt(m[3], 10) - 1 : 0, 1).getTime();
  }
  if (o.displayDateOverride) {
    const d = parseApproxDate(o.displayDateOverride);
    if (d) return d.getTime();
  }
  if (o.addedToCms) {
    const d = new Date(o.addedToCms);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return 0;
}
