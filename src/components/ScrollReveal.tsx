import type { ReactNode } from "react";
import EvidenceMotion from "@/components/case-study/EvidenceMotion";

// Article content remains immediately available. Motion belongs to changes
// in state and selected visual moments, not every paragraph entering view.
export default function ScrollReveal({ children, className = "", id }: { children: ReactNode; className?: string; delay?: number; id?: string }) {
  if (className.split(" ").includes("not-prose")) return <EvidenceMotion className={className} id={id}>{children}</EvidenceMotion>;
  return <div className={className} id={id}>{children}</div>;
}
