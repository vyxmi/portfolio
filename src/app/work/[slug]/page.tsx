import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProject } from "@/lib/projects";
import { CaseStudyBody, NextProject } from "@/components/case-study/CaseStudy";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import ReadingProgress from "@/components/case-study/ReadingProgress";
import SectionNav from "@/components/case-study/SectionNav";
import CursorZone from "@/components/CursorZone";
import SiteFooter from "@/components/SiteFooter";
import { sectionId } from "@/lib/sectionId";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title}, Vyomi Seth` : "Case study" };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // Unlisted projects don't participate in the "next" cycle — either as
  // the current page (no next link shown) or as a destination.
  const visible = projects.filter((p) => !p.unlisted);
  const idx = visible.findIndex((p) => p.slug === slug);
  const next = idx === -1 ? undefined : visible[(idx + 1) % visible.length];

  // Same ids the sectionHeading blocks themselves render (see
  // CaseStudy.tsx) — one slug function shared between the two so a stop
  // here always has a real heading to land on.
  const sections =
    project.content?.blocks
      .filter((b) => b.kind === "sectionHeading")
      .map((b) => ({ id: sectionId(b.eyebrow ?? b.heading), label: b.eyebrow ?? b.heading })) ?? [];

  return (
    <div className="light flex min-h-screen flex-col md:pl-[var(--rail-w)]">
      {project.content && <ReadingProgress />}
      {project.content && <SectionNav sections={sections} />}
      <main className="flex-1 px-6 pt-24 md:px-16 md:pt-28">
        <div className="mx-auto max-w-3xl">
          {project.content ? (
            <CursorZone>
              <CaseStudyHero project={project} content={project.content} />
              <CaseStudyBody content={project.content} />
            </CursorZone>
          ) : (
            <>
              <header className="pb-14 pt-6">
                <div className="eyebrow mb-4">
                  {project.role} &middot; {project.company} &middot; {project.year}
                </div>
                <h1 className="mb-6 text-[34px] font-semibold leading-[1.05] md:text-[48px]" style={{ letterSpacing: "-.015em" }}>
                  {project.title}
                </h1>
                <p className="measure text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {project.result}.
                </p>
              </header>
              <div className="py-14 text-[14px]" style={{ borderTop: "1px solid var(--line)", color: "var(--ink-mute)" }}>
                Case study copy has not been provided yet. This route and the shared system are ready. Send the
                source material and this page fills in with the same primitives used on Chance.live.
              </div>
            </>
          )}
          {next && <NextProject project={next} />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
