import type { ComponentType } from "react";
import type { BrainObject } from "@/lib/brain/types";
import PlainNote from "./PlainNote";
import StickyNote from "./StickyNote";
import Journal from "./Journal";
import NotesApp from "./NotesApp";
import Checklist from "./Checklist";
import Email from "./Email";
import Polaroid from "./Polaroid";
import FilmStrip from "./FilmStrip";
import ContactSheet from "./ContactSheet";
import DisplayCase from "./DisplayCase";
import ProjectCard from "./ProjectCard";
import MediaCard from "./MediaCard";
import ReviewCard from "./ReviewCard";
import SpotifyArtifact from "./SpotifyArtifact";
import Spreadsheet from "./Spreadsheet";
import Browser from "./Browser";
import Scan from "./Scan";
import Scrap from "./Scrap";
import Fallback from "./Fallback";

// The controlled vessel vocabulary, one component per physical/digital
// form. Adding a new vessel is exactly this: write the component, add one
// line here. Nothing else in the render path needs to know it exists.
export const VESSELS: Record<string, ComponentType<{ o: BrainObject }>> = {
  "plain-note": PlainNote,
  "sticky-note": StickyNote,
  journal: Journal,
  "notes-app": NotesApp,
  checklist: Checklist,
  email: Email,
  polaroid: Polaroid,
  "film-strip": FilmStrip,
  "contact-sheet": ContactSheet,
  "display-case": DisplayCase,
  "project-card": ProjectCard,
  "media-card": MediaCard,
  "review-card": ReviewCard,
  "spotify-artifact": SpotifyArtifact,
  spreadsheet: Spreadsheet,
  browser: Browser,
  scan: Scan,
  scrap: Scrap,
  __fallback__: Fallback,
};
