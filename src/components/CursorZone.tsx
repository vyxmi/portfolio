import type { ReactNode } from "react";

// Legacy grouping API; the root InteractionCursor owns all cursor behavior.
export default function CursorZone({children}: {children:ReactNode}) {
  return <>{children}</>;
}
