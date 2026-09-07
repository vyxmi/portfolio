import type { BrainObject } from "./types";

export const DOMAIN_LABELS = { all: "everything", design: "Design + Technology", music: "Music", writing: "Writing + Ideas", crafts: "Art + Craft", community: "People + Community", life: "Life" } as const;
export const BRAIN_DOMAINS = Object.keys(DOMAIN_LABELS) as (keyof typeof DOMAIN_LABELS)[];
export type BrainDomain = keyof typeof DOMAIN_LABELS;
export type ObjectDomain = Exclude<BrainDomain, "all">;

// Migration from source categories, never from presentation/vessel.
// Multiple domains remain possible; an event can be both Music and Community.
export function domainsFor(o: BrainObject): ObjectDomain[] {
  if (o.domains?.length) return o.domains.filter((d): d is ObjectDomain => d !== "all" && d in DOMAIN_LABELS);
  const tags = [o.category, o.secondaryCategory, o.subtype].join(" ").toLowerCase();
  const result: ObjectDomain[] = [];
  if (/design|technology|internet|code|software/.test(tags)) result.push("design");
  if (/music|radio|playlist|album|band|concert|dj/.test(tags)) result.push("music");
  if (/journal|note|writing|philosophy|poem|email|list|thought|review/.test(tags)) result.push("writing");
  if (/making|clothes|craft|sew|crochet|jewelry|art|photography/.test(tags)) result.push("crafts");
  if (/event|community|hosted|friend|family/.test(tags)) result.push("community");
  if (/personal|food|nature|travel|life|fitness/.test(tags)) result.push("life");
  return result.length ? result : ["life"];
}
export function domainFor(o: BrainObject): ObjectDomain { return domainsFor(o)[0] ?? "life"; }
