import Link from "next/link";
import type { Project } from "@/lib/projects";
import Magnet from "./Magnet";
import ScrollReveal from "@/components/ScrollReveal";
import DotGrid from "./DotGrid";
import CardThumbnail from "./CardThumbnail";
export const cardAssets: Record<string, string> = { "chance-deposit-flow": "/fridge/deposit-thumbnail.gif", "adem-user-list": "/fridge/adem.png", "carinsurance-com": "/fridge/cic-thumbnail.gif", "chance-live": "/fridge/chance-live-thumbnail.webp" };
export const cardPosters: Record<string, string> = { "chance-deposit-flow": "/fridge/deposit-thumbnail-poster.png", "adem-user-list": "/fridge/adem.png", "carinsurance-com": "/fridge/cic-thumbnail-poster.png", "chance-live": "/fridge/chance-live-thumbnail.webp" };
const roles: Record<string, string> = { "chance-deposit-flow": "design engineer", "adem-user-list": "product designer", "carinsurance-com": "systems designer", "chance-live": "founding designer" };
export default function CaseStudyCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return <ScrollReveal className={`fm-card-reveal ${compact ? "fm-card-compact" : ""}`}><article className="fm-card" id={compact ? undefined : project.slug}><Link href={`/work/${project.slug}`} className="fm-card-link"><DotGrid /><span className="fm-card-role"><Magnet rotation={-4}>{roles[project.slug]}</Magnet></span><div className="fm-card-copy"><p className="fm-card-company">{project.company}</p><h2>{project.title}</h2><div className="fm-card-metrics">{project.metrics.slice(0, compact ? 1 : 2).map(metric => <Magnet key={metric.label}>{metric.value} {metric.label}</Magnet>)}</div></div>
    <CardThumbnail className={`fm-card-art-${project.slug}`} src={cardAssets[project.slug]} poster={cardPosters[project.slug]} alt={`${project.company} case study preview`} /></Link></article></ScrollReveal>;
}
