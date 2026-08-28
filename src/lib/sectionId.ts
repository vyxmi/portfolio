// Shared between the section headings themselves (which need a stable id
// to scroll/observe) and the section-jump rail (which needs the same id
// to build its link list) — one function so the two never drift apart.
export function sectionId(label: string): string {
  return (
    "section-" +
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );
}
