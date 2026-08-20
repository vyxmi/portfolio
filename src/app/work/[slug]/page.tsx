import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProject } from "@/lib/projects";
import { CaseStudyHero, CaseStudyBody, NextProject } from "@/components/case-study/CaseStudy";
import SiteFooter from "@/components/SiteFooter";

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

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <div className="light flex min-h-screen flex-col md:pl-[var(--rail-w)]">
      <main className="flex-1 px-6 pt-24 md:px-16 md:pt-28">
        <div className="mx-auto max-w-3xl">
          {project.content ? (
            <>
              <CaseStudyHero project={project} content={project.content} />
              <CaseStudyBody content={project.content} />
            </>
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
          <NextProject project={next} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
