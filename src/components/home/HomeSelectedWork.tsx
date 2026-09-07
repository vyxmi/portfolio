import { getSelectedProjects } from "@/lib/projects";
import WorkIndex from "@/components/work/WorkIndex";

export default function HomeSelectedWork() {
  const projects = getSelectedProjects();
  return <section id="selected-work" className="selected-work-section" aria-label="Selected work"><WorkIndex projects={projects}/></section>;
}
