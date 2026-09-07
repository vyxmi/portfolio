"use client";
import { usePathname } from "next/navigation";
import { useLayoutEffect, ViewTransition, type ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useLayoutEffect(() => { document.documentElement.dataset.siteTheme = pathname.startsWith("/brain") ? "brain" : "light"; }, [pathname]);
  return <ViewTransition key={pathname} enter="page-arrive" exit="page-depart" default="none"><div className="page-content">{children}</div></ViewTransition>;
}
