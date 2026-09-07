import { Schibsted_Grotesk, DM_Mono } from "next/font/google";

// Primary sans, tokenized so a more distinctive grotesk can swap in later
// without touching layouts. See --font-grotesk in globals.css.
export const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

// Secondary accent voice: metadata, dates, project numbers, figure labels,
// states, footer/status text, nav indexing. Kept lowercase by convention
// wherever it's used, never for paragraphs.
export const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-sys",
  display: "swap",
});
