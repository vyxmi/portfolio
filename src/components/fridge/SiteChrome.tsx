"use client";
import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";
import SiteNavigation from "@/components/nav/SiteNavigation";
import PageTransition from "@/components/PageTransition";
import InteractionCursor from "@/components/InteractionCursor";
import { SELECTED_SLUGS } from "@/lib/presentation";
import Nav from "./Nav";
import Cursor from "./Cursor";
export default function SiteChrome({ children, email }: { children: ReactNode; email: string }) {
  const pathname = usePathname();
  const fridge = pathname === "/" || SELECTED_SLUGS.some(slug => pathname === `/work/${slug}`);
  useLayoutEffect(() => { document.documentElement.dataset.siteTheme = pathname.startsWith("/brain") ? "brain" : "light"; document.documentElement.dataset.fridge = String(fridge); }, [pathname, fridge]);
  if (!fridge) return <SiteNavigation email={email}><PageTransition>{children}</PageTransition><InteractionCursor /></SiteNavigation>;
  return <div className="fm-site"><a className="skip-link" href="#main-content">Skip to content</a><Nav /><div key={pathname} className="fm-page-enter">{children}</div><Cursor /></div>;
}
