import Intro from "@/components/fridge/Intro";
import Footer from "@/components/fridge/Footer";
import CaseStudyCard from "@/components/fridge/CaseStudyCard";
import { getSelectedProjects } from "@/lib/projects";

export default function Home() {
  return <><main id="main-content"><Intro /><section id="selected-work" className="fm-selected fm-container" aria-label="Selected work">{getSelectedProjects().map(project => <CaseStudyCard project={project} key={project.slug} />)}</section></main><Footer /></>;
}
