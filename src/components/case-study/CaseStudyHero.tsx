import type { Project } from "@/lib/projects";
import type { CaseStudyContent } from "@/lib/case-study-types";
import { CaseImage } from "./CaseStudy";
import ProjectVisual from "@/components/work/ProjectVisual";
import SharedElement from "@/components/SharedElement";
import HeroScene from "./HeroScene";
import DepositHero from "./DepositHero";

export function CaseStudyHero({ project, content }: { project: Project; content: CaseStudyContent }) {
  const heroImage = content.heroImage ?? (project.slug !== "chance-deposit-flow" ? content.blocks.find(block => block.kind === "image") : undefined);
  const normalize = (text: string) => text.toLowerCase().replace(/\bhrs?\b/g,"hours").replace(/[^\p{L}\p{N}]/gu,"");
  const summary = normalize(`${project.title} ${content.heroLine}`);
  const outcomes = project.metrics.filter(metric => { const value = normalize(metric.value); return value.length < 3 || !summary.includes(value); });
  return (
    <HeroScene slug={project.slug} heading={<>
      <div className="article-kicker"><span>{project.company}</span><span>{project.year}</span></div>
      <SharedElement name={`title-${project.slug}`}><h1>{project.title}</h1></SharedElement>
      </>} details={<>
      <p className="article-deck">{content.heroLine}</p>
      <dl className="article-facts"><div><dt>my role</dt><dd>{project.role}</dd></div></dl>
      {outcomes.length > 0 && <div className="article-outcomes">{outcomes.map(m => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}</div>}
      </>} visual={<>
        {heroImage ? <CaseImage {...heroImage} caption={project.result} hideCaption reveal={false} eager /> : project.slug === "chance-deposit-flow" ? <DepositHero /> : <ProjectVisual slug={project.slug} />}
      </>} />
  );
}
