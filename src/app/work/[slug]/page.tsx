import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SharedElement from "@/components/SharedElement";
import { projects, getProject, getSelectedProjects } from "@/lib/projects";
import { CaseStudyBody, NextProject } from "@/components/case-study/CaseStudy";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import ReadingProgress from "@/components/case-study/ReadingProgress";
import SideRail from "@/components/nav/SideRail";
import CursorZone from "@/components/CursorZone";
import SiteFooter from "@/components/SiteFooter";
import { hasCaseStudyAccess } from "@/lib/case-study-access";
import ReviewerAccess from "@/components/case-study/ReviewerAccess";
import { articleSections } from "@/lib/presentation";
import HeroScene from "@/components/case-study/HeroScene";
import ProjectVisual from "@/components/work/ProjectVisual";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title}, Vyomi Seth` : "Case study" };
}

export default async function CaseStudyPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ access?: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const protectedStudy = slug === "adem-user-list";
  const locked = protectedStudy && !(await hasCaseStudyAccess());
  const incorrect = locked && (await searchParams).access === "incorrect";

  // Unlisted projects don't participate in the "next" cycle — either as
  // the current page (no next link shown) or as a destination.
  const visible = getSelectedProjects();
  const idx = visible.findIndex((p) => p.slug === slug);
  const next = idx === -1 ? undefined : visible[(idx + 1) % visible.length];
  const previous = idx === -1 ? undefined : visible[(idx - 1 + visible.length) % visible.length];

  // Same ids the sectionHeading blocks themselves render (see
  // CaseStudy.tsx) — one slug function shared between the two so a stop
  // here always has a real heading to land on.
  const sections = locked || !project.content ? [] : articleSections(project.content).map(({ id, label }) => ({ id, label }));

  return (
    <div className="light site-page case-page" data-project={slug}>
      {project.content && !locked && <ReadingProgress />}
      <SideRail
        eyebrow="work"
        eyebrowHref="/work"
        title={project.title}
        meta={project.company}
        items={sections}
        siblings={{
          previous: previous && { href: `/work/${previous.slug}`, label: previous.title },
          next: next && { href: `/work/${next.slug}`, label: next.title },
        }}
      />
      <main id="main-content" className="article-main">
        <div className="article-shell">
          {locked ? (
            <>
              <HeroScene slug={slug} heading={<>
                <div className="article-kicker"><span>{project.company}</span><span>{project.year}</span><span>private case study</span></div>
                <SharedElement name={`title-${project.slug}`}><h1>{project.title}</h1></SharedElement>
                </>} visual={<ProjectVisual slug={slug} />} details={<p className="article-deck">
                  I designed a shared destination for investigating user-device issues in Palo Alto Networks’ ADEM product. Seven entry points converged on one list, carrying the context of the investigation with them. I validated the prototype and handed the direction to product and engineering.
                </p>} />
              <ReviewerAccess incorrect={incorrect} />
            </>
          ) : project.content ? (
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
          {protectedStudy && !locked && <form action="/work/adem-user-list/access" method="post" className="my-8"><button name="action" value="lock" className="min-h-11 text-sm underline underline-offset-4">Lock case study</button></form>}
          {next && <NextProject project={next} />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
