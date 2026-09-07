import type { Block, CaseStudyContent } from "./case-study-types";

export const SELECTED_SLUGS = ["chance-deposit-flow", "adem-user-list", "carinsurance-com", "chance-live"];
export const PROJECT_LABELS: Record<string, string> = {
  "chance-deposit-flow": "Making crypto disappear",
  "adem-user-list": "One place to investigate",
  "carinsurance-com": "A system for 200 pages",
  "chance-live": "A second chance to decide",
};

export function articleSections(content: CaseStudyContent) {
  const groups: { id: string; label: string; blocks: Block[] }[] = [];
  content.blocks.forEach((block, index) => {
    if (block.kind === "flag" || block.kind === "imagePlaceholder") return;
    const eyebrow = "eyebrow" in block ? block.eyebrow : undefined;
    const chapter = block.kind === "sectionHeading" || (eyebrow && ["story", "constraint", "validation"].includes(block.kind));
    if (chapter || !groups.length) groups.push({
      id: `chapter-${index + 1}`,
      label: eyebrow || ("heading" in block ? block.heading : undefined) || "context",
      blocks: [],
    });
    groups[groups.length - 1].blocks.push(block);
  });
  return groups;
}
