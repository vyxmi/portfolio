"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavigationContext, type NavigationContext } from "./SiteNavigation";
export type RailItem = { id: string; label: string; href?: string };
export type RailSibling = { href: string; label: string };

export default function SideRail(props: NavigationContext) {
  const setContext = useNavigationContext();
  const pathname = usePathname();
  const configuration = JSON.stringify(props);
  useEffect(() => { setContext({ ...JSON.parse(configuration), pathname }); }, [configuration, pathname, setContext]);
  return null;
}
