import Image from "next/image";
import type { Project } from "@/lib/projects";
import type { Block, CaseStudyContent } from "@/lib/case-study-types";
import CardStateInspector from "./CardStateInspector";
import FlowCompare from "./FlowCompare";
import RatioStat from "./RatioStat";
import ConsolidationDiagram from "./ConsolidationDiagram";
import MetricsRow from "./MetricsRow";
import FlowSteps from "./FlowSteps";
import ScrollReveal from "@/components/ScrollReveal";
import Flag from "@/components/ui/Flag";
import TextLink from "@/components/ui/TextLink";
import Zoomable from "@/components/ui/Zoomable";

function CaseImage({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <ScrollReveal className="not-prose">
      <Zoomable src={src} alt={alt}>
        <div className="relative w-full overflow-hidden" style={{ background: "var(--paper-dim)", border: "1px solid var(--line)" }}>
          <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" style={{ display: "block" }} />
        </div>
      </Zoomable>
      <div className="cap mt-2">{caption}</div>
    </ScrollReveal>
  );
}

function Block({ block }: { block: Block }) {
  switch (block.kind) {
    case "statement":
      return (
        <ScrollReveal>
          <p className="measure py-4 text-[22px] font-medium leading-snug md:text-[27px]" style={{ letterSpacing: "-.01em" }}>
            {block.heading}
          </p>
        </ScrollReveal>
      );

    case "insight":
      return (
        <ScrollReveal>
          {block.eyebrow && <div className="eyebrow mb-3">{block.eyebrow}</div>}
          {block.heading && (
            <p className="measure mb-4 text-[19px] font-semibold" style={{ letterSpacing: "-.005em" }}>
              {block.heading}
            </p>
          )}
          <div className="measure flex flex-col gap-4">
            {block.body.map((p, i) => (
              <p
                key={i}
                className="text-[17px] leading-relaxed"
                style={{ paddingLeft: 16, borderLeft: "2px solid var(--accent)", color: "var(--ink-soft)" }}
              >
                {p}
              </p>
            ))}
          </div>
        </ScrollReveal>
      );

    case "quote":
      return (
        <ScrollReveal>
          <div className="measure" style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 16 }}>
            <p className="text-[19px] font-medium italic leading-snug">&ldquo;{block.text}&rdquo;</p>
            {block.attribution && <p className="cap mt-2 not-italic">{block.attribution}</p>}
          </div>
        </ScrollReveal>
      );

    case "flag":
      return <Flag>{block.text}</Flag>;

    case "image":
      return <CaseImage src={block.src} alt={block.alt} caption={block.caption} width={block.width} height={block.height} />;

    case "imagePair":
      return (
        <ScrollReveal className="not-prose">
          <div className="grid gap-4 sm:grid-cols-2">
            {block.images.map((img, i) => (
              <div key={i}>
                <Zoomable src={img.src} alt={img.alt}>
                  <div className="relative w-full overflow-hidden" style={{ background: "var(--paper-dim)", border: "1px solid var(--line)" }}>
                    <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-auto w-full" />
                  </div>
                </Zoomable>
                <div className="cap mt-2">{img.caption}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      );

    case "ratio":
      return <RatioStat {...block} />;

    case "consolidation":
      return <ConsolidationDiagram {...block} />;

    case "cardStateInspector":
      return (
        <ScrollReveal className="not-prose">
          <CardStateInspector />
        </ScrollReveal>
      );

    case "flowCompare":
      return (
        <ScrollReveal className="not-prose">
          <FlowCompare />
        </ScrollReveal>
      );

    case "flowSteps":
      return <FlowSteps label={block.label} steps={block.steps} />;

    case "story":
    case "constraint":
    case "validation":
    default: {
      const b = block as Extract<Block, { kind: "story" | "constraint" | "validation" }>;
      return (
        <ScrollReveal>
          {b.eyebrow && <div className="eyebrow mb-3">{b.eyebrow}</div>}
          {b.heading && (
            <p className="measure mb-4 text-[19px] font-semibold leading-snug md:text-[21px]" style={{ letterSpacing: "-.005em" }}>
              {b.heading}
            </p>
          )}
          {b.body?.map((p, i) => (
            <p key={i} className="measure mb-4 text-[16px] leading-relaxed last:mb-0" style={{ color: "var(--ink-soft)" }}>
              {p}
            </p>
          ))}
          {b.items && b.items.length > 0 && (
            <ul className="measure mt-1 flex flex-col gap-2.5">
              {b.items.map((it, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  <span style={{ color: "var(--accent)" }}>&bull;</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          )}
        </ScrollReveal>
      );
    }
  }
}

export function CaseStudyHero({ project, content }: { project: Project; content: CaseStudyContent }) {
  return (
    <header className="pb-12 pt-6">
      <div className="eyebrow mb-4">
        {project.role} &middot; {project.company} &middot; {project.year}
      </div>
      <h1 className="mb-6 text-[34px] font-semibold leading-[1.05] md:text-[48px]" style={{ letterSpacing: "-.015em" }}>
        {project.title}
      </h1>
      <p className="measure mb-8 text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {content.heroLine}
      </p>
      <MetricsRow metrics={project.metrics} className="mb-8" />
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
      {content.heroImage && (
        <div className="mt-10">
          <CaseImage
            src={content.heroImage.src}
            alt={content.heroImage.alt}
            caption={project.result}
            width={content.heroImage.width}
            height={content.heroImage.height}
          />
        </div>
      )}
    </header>
  );
}

export function CaseStudyBody({ content }: { content: CaseStudyContent }) {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {content.blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

export function NextProject({ project }: { project: Project }) {
  return (
    <div className="flex items-center justify-between py-10" style={{ borderTop: "1px solid var(--line)" }}>
      <span className="cap">next</span>
      <TextLink href={`/work/${project.slug}`} kind="next" className="text-[17px]">
        {project.title}
      </TextLink>
    </div>
  );
}
