import { getProject, type Project } from "@/lib/projects";
import WorkIndex from "@/components/work/WorkIndex";

// Curated four for the homepage, not the full /work index — order is
// deliberate (deposit flow, network security, carinsurance.com, summary
// revamp), not filed alongside the rest of the roster. Reuses WorkIndex's
// real card component so this stays pixel-identical to /work instead of a
// second card implementation to keep in sync.
const HOME_SLUGS = ["chance-deposit-flow", "adem-user-list", "carinsurance-com", "chance-live"];

export default function HomeSelectedWork() {
  const projects = HOME_SLUGS.map((slug) => getProject(slug)).filter((p): p is Project => p !== undefined);

  return (
    <section id="selected-work" className="light md:pl-[var(--rail-w)]">
      <div className="px-6 py-16 md:px-16 md:py-24">
        <div className="eyebrow mb-6">selected work</div>
        <WorkIndex projects={projects} />
      </div>
    </section>
  );
}
