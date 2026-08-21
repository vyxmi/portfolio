import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import WorkIndex from "@/components/work/WorkIndex";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Work, Vyomi Seth" };

export default function WorkPage() {
  return (
    <div className="light flex min-h-screen flex-col md:pl-[var(--rail-w)]">
      <main className="flex-1 px-6 pb-16 pt-24 md:px-16 md:pt-28">
        <div className="mb-12">
          <div className="eyebrow mb-3">work</div>
          <h1 className="max-w-2xl text-[28px] font-semibold md:text-[34px]" style={{ letterSpacing: "-.01em" }}>
            Product design case studies, from enterprise systems to scrappy weekend builds.
          </h1>
        </div>
        <WorkIndex projects={projects.filter((p) => !p.unlisted)} />
      </main>
      <SiteFooter />
    </div>
  );
}
