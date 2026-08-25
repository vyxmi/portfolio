import type { Metadata } from "next";
import "./globals.css";
// Shared here, not just imported by /brain, because the homepage
// constellation (see HomeBrainCanvas) reuses BrainCard/BrainFocus and the
// vessel components directly — same objects, same rendering, so they need
// the same stylesheet. Vessel/focus/wall selectors are all scoped by class
// name and don't leak into unrelated markup elsewhere in the site.
import "./brain/brain.css";
import { grotesk, mono } from "@/lib/fonts";
import { brainObjects } from "@/lib/brain/objects";
import { isPrivate } from "@/lib/brain/resolvers";
import SideRail from "@/components/nav/SideRail";
import MobileNav from "@/components/nav/MobileNav";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Vyomi Seth",
  description: "I solve real problems with creative solutions.",
};

// Computed here, server-side, and handed down as a plain number — MobileNav
// is a client component, so importing the raw brainObjects array into it
// directly would ship every object's full content (private ones included)
// in the browser JS bundle on every single page, not just /brain.
const publicObjectCount = brainObjects.filter((o) => !isPrivate(o)).length;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full" id="top">
        <SideRail />
        <MobileNav objectCount={publicObjectCount} />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
