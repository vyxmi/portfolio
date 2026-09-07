import HomeIntro from "@/components/HomeIntro";
import HomeSelectedWork from "@/components/home/HomeSelectedWork";
import HomeBrainPreview from "@/components/home/HomeBrainPreview";
import SideRail from "@/components/nav/SideRail";
import SiteFooter from "@/components/SiteFooter";
import { PROJECT_LABELS } from "@/lib/presentation";
import { getSelectedProjects } from "@/lib/projects";

export default function Home() {
  return <div className="light site-page home-page">
    <SideRail eyebrow="work" items={[...getSelectedProjects().map(p => ({ id:p.slug, label: PROJECT_LABELS[p.slug] || p.title })), { id: "home-brain", label: "brain" }]} />
    <main id="main-content" className="home-content"><HomeIntro /><HomeSelectedWork /><HomeBrainPreview /></main>
    <SiteFooter />
  </div>;
}
