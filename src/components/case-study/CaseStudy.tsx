import type { Project, ChanceContent } from "@/lib/projects";
import CardStateInspector from "./CardStateInspector";
import FlowCompare from "./FlowCompare";

function FigureNote({ label }: { label: string }) {
  return (
    <div
      className="not-prose flex aspect-[16/9] items-center justify-center text-center text-[12px]"
      style={{ background: "var(--paper-dim)", border: "1px solid var(--line)", color: "var(--ink-mute)" }}
    >
      [fig. {label}, pending real media]
    </div>
  );
}

function Section({ section }: { section: ChanceContent["sections"][number] }) {
  const { kind, eyebrow, heading, body, items, id } = section;

  if (kind === "statement") {
    return (
      <div className="grid gap-4 py-14 md:grid-cols-[160px_1fr] md:gap-10 md:py-20" style={{ borderTop: "1px solid var(--line)" }}>
        <div />
        <p className="measure text-[24px] font-medium leading-snug md:text-[30px]" style={{ letterSpacing: "-.01em" }}>
          {heading}
        </p>
      </div>
    );
  }

  if (kind === "insight") {
    return (
      <div className="grid gap-4 py-14 md:grid-cols-[160px_1fr] md:gap-10" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="eyebrow sticky top-8 self-start">{eyebrow ?? "insight"}</div>
        <div className="measure">
          {heading && (
            <p className="mb-4 text-[20px] font-semibold" style={{ letterSpacing: "-.01em" }}>
              {heading}
            </p>
          )}
          {body?.map((p, i) => (
            <p
              key={i}
              className="mb-4 text-[17px] leading-relaxed last:mb-0"
              style={{
                paddingLeft: 16,
                borderLeft: "2px solid var(--accent)",
                color: "var(--ink-soft)",
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // story, list, constraint, validation share one layout: sticky eyebrow + measure column
  return (
    <div className="grid gap-4 py-14 md:grid-cols-[160px_1fr] md:gap-10" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="eyebrow sticky top-8 self-start">{eyebrow}</div>
      <div className="measure">
        {heading && (
          <p className="mb-5 text-[20px] font-semibold leading-snug md:text-[22px]" style={{ letterSpacing: "-.005em" }}>
            {heading}
          </p>
        )}
        {body?.map((p, i) => (
          <p key={i} className="mb-4 text-[16px] leading-relaxed last:mb-0" style={{ color: "var(--ink-soft)" }}>
            {p}
          </p>
        ))}
        {items && items.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2.5">
            {items.map((it, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                <span style={{ color: "var(--accent)" }}>&bull;</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        )}

        {id === "prototypes" ? (
          <div className="mt-6">
            <CardStateInspector />
          </div>
        ) : (
          section.figure && (
            <div className="mt-6">
              <FigureNote label={section.figure} />
            </div>
          )
        )}

        {id === "solution" && (
          <div className="mt-6">
            <FlowCompare />
          </div>
        )}
      </div>
    </div>
  );
}

export function CaseStudyHero({ project, content }: { project: Project; content: ChanceContent }) {
  return (
    <header className="pb-14 pt-6">
      <div className="eyebrow mb-4">
        {project.role} &middot; {project.company} &middot; {project.year}
      </div>
      <h1 className="mb-6 text-[34px] font-semibold leading-[1.05] md:text-[48px]" style={{ letterSpacing: "-.015em" }}>
        {project.title}
      </h1>
      <p className="measure mb-10 text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {content.heroLine}
      </p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4" style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
        {content.facts.map((f) => (
          <div key={f.label}>
            <div className="cap mb-1">{f.label}</div>
            <div className="text-[13.5px]" style={{ color: "var(--ink)" }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}

export function CaseStudyBody({ content }: { content: ChanceContent }) {
  return (
    <div>
      {content.sections.map((s) => (
        <Section key={s.id} section={s} />
      ))}
    </div>
  );
}

export function NextProject({ project }: { project: Project }) {
  return (
    <div className="flex items-center justify-between py-10" style={{ borderTop: "1px solid var(--line)" }}>
      <span className="cap">next</span>
      <a href={`/work/${project.slug}`} className="text-[17px] font-semibold no-underline" style={{ letterSpacing: "-.005em" }}>
        {project.title} &rarr;
      </a>
    </div>
  );
}
