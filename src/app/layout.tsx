import type { Metadata } from "next";
import "./globals.css";
import { grotesk, mono } from "@/lib/fonts";
import SideRail from "@/components/nav/SideRail";
import MobileNav from "@/components/nav/MobileNav";

export const metadata: Metadata = {
  title: "Vyomi Seth",
  description: "I solve real problems with creative solutions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full" id="top">
        <SideRail />
        <MobileNav />
        {children}
      </body>
    </html>
  );
}
