import type { Project } from "@/lib/projects";
import Image from "next/image";
import { CaseStudyBody } from "@/components/case-study/CaseStudy";
import ReviewerAccess from "@/components/case-study/ReviewerAccess";
import { articleSections } from "@/lib/presentation";
import DotGrid from "./DotGrid";
import Magnet from "./Magnet";
import Contents from "./Contents";
import Footer from "./Footer";
import CaseStudyCard, { cardAssets, cardPosters } from "./CaseStudyCard";

const details: Record<string, { role: string[]; tools: string[]; team: string[]; duration: string[] }> = {
  "chance-deposit-flow": {
    role: ["Systems Designer", "Product Growth Strategist"],
    tools: ["Figma", "CoinFlow"],
    team: ["Product", "Engineering"],
    duration: ["2 days", "Brief to shipped"],
  },
  "adem-user-list": {
    role: ["Product Design Intern", "Lead Designer, ADEM"],
    tools: ["Figma", "Interactive prototype"],
    team: ["PM and engineering", "Platform team", "Surrounding product designers"],
    duration: ["2025", "Internship project"],
  },
  "carinsurance-com": {
    role: ["Product Designer"],
    tools: ["Figma", "Storybook"],
    team: ["Design and engineering", "Content and business stakeholders"],
    duration: ["2024", "Internship project"],
  },
  "chance-live": {
    role: ["Systems Designer", "Product Growth Strategist"],
    tools: ["Figma", "Functional prototypes"],
    team: ["8-person startup", "Product and engineering"],
    duration: ["15 hours", "Problem identified to shipped fix"],
  },
};
export default function FridgeCaseStudy({ project, locked, incorrect, related }: { project: Project; locked: boolean; incorrect: boolean; related: Project[] }) {
  const content = project.content;
  const heroThumbnail = project.slug === "chance-deposit-flow" ? cardAssets[project.slug] : cardPosters[project.slug];
  const sections = locked || !content ? [] : articleSections(content).map(({ id, label }) => ({ id, label }));
  const projectDetails = details[project.slug];
  const summary = locked ? "I designed a shared destination for investigating user-device issues in Palo Alto Networks’ ADEM product. Seven entry points converged on one list, carrying the context of the investigation with them. I validated the prototype and handed the direction to product and engineering." : content?.heroLine;
  return <div className="fm-case" data-project={project.slug}>
    {sections.length > 0 && <Contents sections={sections} />}
    <main id="main-content">
      <header className="fm-case-hero" id="hero"><DotGrid fade />
        <div className="fm-container">
          <div className="fm-case-kicker">{project.company}<span>{project.year}</span>{locked && <span>private case study</span>}</div>
          <h1>{project.title}</h1>
          <div className="fm-case-metrics">{project.metrics.map(metric => <Magnet key={metric.label}>{metric.value} {metric.label}</Magnet>)}</div>
          <div className="fm-case-visual fm-case-thumbnail">
            <Image src={heroThumbnail} unoptimized={heroThumbnail.endsWith(".gif")} alt={`${project.company} case study thumbnail`} fill priority sizes="(max-width: 1100px) 92vw, 1062px" />
          </div>
        </div>
      </header>
      <section className="fm-case-overview fm-container" aria-label="Case study overview">
        <p className="fm-case-deck">{summary}</p>
        <dl className="fm-case-details">
          <div><dt>role</dt><dd>{(projectDetails?.role ?? [project.role]).map(line => <span key={line}>{line}</span>)}</dd></div>
          <div><dt>toolstack</dt><dd>{(projectDetails?.tools ?? ["Not specified"]).map(line => <span key={line}>{line}</span>)}</dd></div>
          <div><dt>team</dt><dd>{(projectDetails?.team ?? ["Not specified"]).map(line => <span key={line}>{line}</span>)}</dd></div>
          <div><dt>duration</dt><dd>{(projectDetails?.duration ?? ["Not specified"]).map(line => <span key={line}>{line}</span>)}</dd></div>
        </dl>
      </section>
      {locked ? <ReviewerAccess incorrect={incorrect} /> : content && <CaseStudyBody content={content} />}
      {project.slug === "adem-user-list" && !locked && <form action="/work/adem-user-list/access" method="post" className="fm-lock"><button name="action" value="lock">Lock case study</button></form>}
      <nav className="fm-related fm-container" aria-label="Other case studies">{related.map(p => <CaseStudyCard project={p} compact key={p.slug} />)}</nav>
    </main><Footer />
  </div>;
}
