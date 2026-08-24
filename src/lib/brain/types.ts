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

// The vessel-sizing system's controlled step vocabulary. "medium" is always
// the vessel preset's own default — an object with no sizeVariant renders
// identically to one explicitly marked "medium". "small"/"large" are the
// two adjacent steps a "bigger"/"smaller" edit moves through; "narrow" is a
// width-only variant (height/font untouched) for objects that need to read
// as skinnier without shrinking altogether — see brain.css's per-vessel
// [data-size] rules for what each step actually resolves to.
export type VesselSize = "small" | "medium" | "large" | "narrow";

// A single dated line within an object whose content is a list of discrete,
// individually-dated entries (e.g. a running log of old tweets) rather than
// one continuous block — each entry's date renders separately from its
// text instead of living inside the body string. See parts.tsx's VEntries.
export interface BrainContentEntry {
  date: string; // ISO (YYYY-MM-DD) — formatted for display the same way dateLabel formats originalDate
  text: string;
}

export interface BrainObject {
  id: string; // stable CMS UID, e.g. "B-0001"
  type: BrainObjectType;
  subtype?: string;
  category?: string;
  secondaryCategory?: string;
  title?: string;
  content?: string; // "Content — EXACT WORDS", verbatim, may contain real newlines
  // Discrete dated entries, when the object's "content" is really a list of
  // separately-dated lines rather than one block — see BrainContentEntry.
  // When present, vessels that support it (PlainNote) render this instead
  // of `content`.
  contentEntries?: BrainContentEntry[];
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
  // The vessel-sizing system's per-object override — see VesselSize. Unset
  // (undefined) means "medium," the vessel preset's own default.
  sizeVariant?: VesselSize;
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
  // Email-vessel-only header fields — conditionally rendered, never
  // fabricated for objects that don't have them. "Subject" reuses `title`
  // (already the email's subject line) and "Date" reuses
  // originalDate/displayDateOverride via dateLabel() rather than a
  // duplicate field, so From/To are the only genuinely new inputs.
  emailFrom?: string;
  emailTo?: string;
  // Marks an object private: excluded from BrainWall's object list (and so
  // from filtering, sorting, search, and the visible count) entirely, but
  // never deleted from the data. See resolvers.ts's isPrivate.
  private?: boolean;
}
