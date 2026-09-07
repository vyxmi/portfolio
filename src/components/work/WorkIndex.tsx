import type { Project } from "@/lib/projects";
import WorkPreview from "./WorkPreview";

const outcomes: Record<string,string> = {
  "chance-deposit-flow": "+81% signup-to-deposit conversion",
  "adem-user-list": "",
  "carinsurance-com": "",
  "chance-live": "Review decisions before an irreversible sale",
};
export default function WorkIndex({projects}: {projects:Project[]}) {
  return <div className="selected-grid">{projects.map(p=><WorkPreview key={p.slug} slug={p.slug} title={p.title} company={p.company} outcome={p.previewOutcome??outcomes[p.slug]??p.tagline} thumbnail={p.previewImage}/>)}</div>;
}
