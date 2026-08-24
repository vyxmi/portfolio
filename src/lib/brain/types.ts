// Data model for the Brain, generated from the "Vyomi Brain CMS" workbook
// (README, Brain Objects, Media Registry, Taxonomy, Rendering Rules sheets).
// Vessel/Weight/Expand Behavior/etc. are curated per-row in the CMS and read
// verbatim here — rendering never re-derives a judgment call the CMS already
// made, it only falls back safely when a field is blank.

export type BrainObjectType = "thought" | "thing" | "memory" | "work";

// The controlled vessel vocabulary from the CMS's Rendering Rules sheet.
// A blank/unrecognized vessel on an object falls back to plain-note (no
// media) or a generic media frame (has media) — see resolveVessel.
export type BrainVessel =
  | "plain-note"
  | "sticky-note"
  | "journal"
  | "notes-app"
  | "checklist"
  | "email"
  | "polaroid"
  | "film-strip"
  | "contact-sheet"
  | "display-case"
  | "project-card"
  | "media-card"
  | "spotify-artifact"
  | "spreadsheet"
  | "browser"
  | "scan"
  | "scrap"
  | "review-card"
  | "floating";

export type ExpandBehavior = "auto" | "none" | "read-more" | "focus" | "gallery" | "external";
export type TitleDisplay = "auto" | "show" | "hide";
export type Weight = "tiny" | "normal" | "featured";
export type MediaLegibility = "auto" | "decorative" | "readable" | "essential";
export type TemporalTreatment = "current" | "recent" | "archival" | "uncertain" | "timeless";
export type DatePrecision = "exact" | "date" | "month" | "year" | "approximate" | "unknown" | "range";

// Vessel material — a density/transparency variant layered on top of the
// vessel type. Unset (undefined) means "solid", today's opaque default.
// Only meaningful on the dark (void) vessels; see brain.css.
export type VesselMaterial = "smoked" | "frosted";

export interface BrainMedia {
  id: string;
  filename: string;
  alt?: string;
}

export interface BrainObject {
  id: string; // stable CMS UID, e.g. "B-0001"
  type: BrainObjectType;
  subtype?: string;
  category?: string;
  secondaryCategory?: string;
  title?: string;
  content?: string; // "Content — EXACT WORDS", verbatim, may contain real newlines
  originalDate?: string; // ISO, present when Date Precision is exact/date
  datePrecision?: DatePrecision;
  displayDateOverride?: string; // human string the CMS already formatted, e.g. "June 2026"
  addedToCms?: string;
  source?: string;
  sourceRef?: string;
  relatedUrl?: string;
  credit?: string;
  rating?: number; // 0–5
  state?: string;
  weight?: Weight;
  vessel?: BrainVessel | string;
  material?: VesselMaterial;
  mediaLegibility?: MediaLegibility;
  titleDisplay?: TitleDisplay;
  expandBehavior?: ExpandBehavior;
  temporalTreatment?: TemporalTreatment;
  renderOverride?: string;
  homeFeature?: boolean;
  media?: BrainMedia[];
  relatedIds?: string[]; // reserved for future Connections work, unused for now
}
