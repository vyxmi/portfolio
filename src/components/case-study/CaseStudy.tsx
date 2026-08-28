import { Fragment } from "react";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import type { Block, CaseStudyContent } from "@/lib/case-study-types";
import { sectionId } from "@/lib/sectionId";
import CardStateInspector from "./CardStateInspector";
import FlowCompare from "./FlowCompare";
import RatioStat from "./RatioStat";
import ConsolidationDiagram from "./ConsolidationDiagram";
import FlowSteps from "./FlowSteps";
import FunnelStat from "./FunnelStat";
import ClickThroughFlow from "./ClickThroughFlow";
import FunnelCompare from "./FunnelCompare";
import PrototypeCompare from "./PrototypeCompare";
import TextCompare from "./TextCompare";
import Expand from "./Expand";
import ImagePlaceholder from "./ImagePlaceholder";
import NumberedInsights from "./NumberedInsights";
import ResearchRatings from "./ResearchRatings";
import SiteMetrics from "./SiteMetrics";
import ScrollReveal from "@/components/ScrollReveal";
import Flag from "@/components/ui/Flag";
import TextLink from "@/components/ui/TextLink";
import Zoomable from "@/components/ui/Zoomable";

export function CaseImage({
  padded,
  src,
  alt,
  caption,
  width,
  height,
  transparentMedia,
  hideCaption,
}: {
  padded?: boolean;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  transparentMedia?: boolean;
  // The hero's own thumbnail carries no caption line (the hero already
  // has a title + summary doing that job) — every other use of this
  // component keeps its caption.
  hideCaption?: boolean;
}) {
  const img = (
    <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" style={{ display: "block" }} />
  );
  return (
    <ScrollReveal className="not-prose">
      {/* padded images already show a paper-dim mat on the page (that's
          what padding reveals) — zoomed, they deserve the same
          background, not just true alpha-transparent ones. */}
      <Zoomable src={src} alt={alt} transparentMedia={transparentMedia || padded}>
        <div
          className={transparentMedia ? "relative w-full overflow-hidden" : "case-box relative w-full"}
          style={transparentMedia ? undefined : { background: "var(--paper-dim)" }}
        >
          {padded && !transparentMedia ? <div style={{ padding: 14 }}>{img}</div> : img}
        </div>
      </Zoomable>
      {!hideCaption && <div className="cap mt-2">{caption}</div>}
    </ScrollReveal>
  );
}

function CaseVideo({
  src,
  caption,
  aspect = "9/16",
  maxWidth = 340,
}: {
  src: string;
  caption?: string;
  aspect?: string;
  maxWidth?: number;
}) {
  return (
    <ScrollReveal className="not-prose">
      <div className="mx-auto w-full" style={{ maxWidth }}>
        {/* A dark bezel (thick border + large radius) rather than a plain
            rectangle — this is a portrait phone screen recording, and
            framing it like one is the point. overflow:hidden + border-
            radius on this same element clips the video to match the
            rounded inner edge automatically, no extra radius needed on
            the <video> itself. object-cover (not contain) crops to fill
            that frame edge-to-edge, like a real device screen — no
            letterbox bars breaking the illusion. */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: aspect, background: "var(--paper-dim)", border: "10px solid var(--ink)", borderRadius: 32 }}
        >
          <video src={src} controls playsInline muted className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
      {caption && <div className="cap mt-2 text-center">{caption}</div>}
    </ScrollReveal>
  );
}

// A hosted demo video (YouTube), not a local file — 16:9, full prose width,
// same paper/border/caption treatment as CaseImage so it reads as the same
// kind of media block, not a foreign embed dropped in.
function CaseYouTube({ id, caption }: { id: string; caption?: string }) {
  return (
    <ScrollReveal className="not-prose">
      <div className="case-box relative w-full" style={{ aspectRatio: "16/9", background: "var(--paper-dim)" }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={caption ?? "Video demo"}
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {caption && <div className="cap mt-2">{caption}</div>}
    </ScrollReveal>
  );
}

// Marks the start of a new "big" section (every sectionHeading), so a
// long case study reads as a handful of real sections instead of one
// undifferentiated scroll. A dashed rule reads as a break without the
// weight of a full-width solid divider, and stopping at 80% keeps it
// from looking like it's spanning the whole page edge to edge.
function SectionDivider() {
  return (
    <hr
      aria-hidden
      className="mx-auto w-[80%] border-0"
      style={{ borderTop: "1px dashed var(--line-strong)" }}
    />
  );
}

function Block({ block }: { block: Block }) {
  switch (block.kind) {
    case "statement":
      // The one card-styled title on a case study page — reserved for a
      // real question the work was answering (almost always "how might
      // we…"), never a punchy declarative; those use "sectionHeading"
      // instead, plain and uncarded. The brain wall's paper-toned vessels
      // (scrap, journal, scan…) sit on that page's dark void, so their
      // card chrome alone reads as "a white note." Case study pages are
      // already on --paper (white), so the same chrome would be invisible
      // here — --paper-dim (a shade off pure white) plus that same shadow
      // is what actually reads as a distinct card against this page's own
      // white.
      return (
        <ScrollReveal>
          <p
            className="text-[24px] font-medium leading-snug md:text-[30px]"
            style={{
              letterSpacing: "-.01em",
              background: "var(--paper-dim)",
              boxShadow: "var(--shadow-paper)",
              borderRadius: "var(--r-md)",
              padding: "16px 20px",
            }}
          >
            {block.heading}
          </p>
        </ScrollReveal>
      );

    case "sectionHeading":
      // The non-question counterpart to "statement" — same emphasis
      // moment, no card. Size alone carries it, matching the case study
      // H1's scale rather than the smaller in-flow section headings. The
      // id (and scroll-margin, so a jump doesn't land flush against the
      // viewport edge) is what the section-jump rail scrolls/observes.
      return (
        <ScrollReveal id={sectionId(block.eyebrow ?? block.heading)}>
          <div style={{ scrollMarginTop: 100 }}>
            {block.eyebrow && <div className="eyebrow mb-3">{block.eyebrow}</div>}
            <h2 className="text-[28px] font-semibold leading-[1.1] md:text-[36px]" style={{ letterSpacing: "-.015em" }}>
              {block.heading}
            </h2>
          </div>
        </ScrollReveal>
      );

    case "imagePlaceholder":
      return <ImagePlaceholder label={block.label} note={block.note} aspect={block.aspect} />;

    case "insight":
      return (
        <ScrollReveal>
          {block.eyebrow && <div className="eyebrow mb-3">{block.eyebrow}</div>}
          {block.heading && (
            <p className="mb-4 text-[22px] font-semibold leading-snug md:text-[25px]" style={{ letterSpacing: "-.008em" }}>
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
          <div className="measure" style={{ borderLeft: "5px solid rgba(var(--accent-rgb),.35)", paddingLeft: 20 }}>
            <p className="text-[19px] font-medium italic leading-snug">&ldquo;{block.text}&rdquo;</p>
            {block.attribution && <p className="cap mt-2 not-italic">{block.attribution}</p>}
          </div>
        </ScrollReveal>
      );

    case "flag":
      return <Flag>{block.text}</Flag>;

    case "image":
      return (
        <CaseImage
          padded={block.padded}
          src={block.src}
          alt={block.alt}
          caption={block.caption}
          width={block.width}
          height={block.height}
          transparentMedia={block.transparentMedia}
        />
      );

    case "imagePair":
      return (
        <ScrollReveal className="not-prose">
          {block.label && <div className="eyebrow mb-2 text-center">{block.label}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            {block.images.map((img, i) => (
              <div key={i}>
                <Zoomable src={img.src} alt={img.alt} transparentMedia={img.transparentMedia || block.padded}>
                  <div
                    className={img.transparentMedia ? "relative w-full overflow-hidden" : "case-box relative w-full"}
                    style={img.transparentMedia ? undefined : { background: "var(--paper-dim)" }}
                  >
                    {block.padded && !img.transparentMedia ? (
                      <div style={{ padding: 14 }}>
                        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-auto w-full" />
                      </div>
                    ) : (
                      <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-auto w-full" />
                    )}
                  </div>
                </Zoomable>
                {img.caption && <div className="cap mt-2">{img.caption}</div>}
              </div>
            ))}
          </div>
        </ScrollReveal>
      );

    case "video":
      return <CaseVideo src={block.src} caption={block.caption} aspect={block.aspect} maxWidth={block.maxWidth} />;

    case "youtube":
      return <CaseYouTube id={block.id} caption={block.caption} />;

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

    case "funnel":
      return (
        <ScrollReveal className="not-prose">
          <FunnelStat label={block.label} stages={block.stages} caption={block.caption} />
        </ScrollReveal>
      );

    case "clickThrough":
      return (
        <ScrollReveal className="not-prose">
          <ClickThroughFlow flows={block.flows} />
        </ScrollReveal>
      );

    case "funnelCompare":
      return (
        <ScrollReveal className="not-prose">
          <FunnelCompare groups={block.groups} caption={block.caption} />
        </ScrollReveal>
      );

    case "prototypeCompare":
      return (
        <ScrollReveal className="not-prose">
          <PrototypeCompare tabs={block.tabs} />
        </ScrollReveal>
      );

    case "textCompare":
      return (
        <ScrollReveal className="not-prose">
          <TextCompare tabs={block.tabs} />
        </ScrollReveal>
      );

    case "expand":
      return (
        <ScrollReveal className="not-prose">
          <Expand label={block.label} body={block.body} items={block.items} />
        </ScrollReveal>
      );

    case "numberedInsights":
      return <NumberedInsights eyebrow={block.eyebrow} heading={block.heading} items={block.items} />;

    case "researchRatings":
      return <ResearchRatings items={block.items} />;

    case "siteMetrics":
      return <SiteMetrics items={block.items} />;

    case "story":
    case "constraint":
    case "validation":
    default: {
      const b = block as Extract<Block, { kind: "story" | "constraint" | "validation" }>;
      return (
        <ScrollReveal>
          {b.eyebrow && <div className="eyebrow mb-3">{b.eyebrow}</div>}
          {b.heading && (
            <p className="mb-4 text-[22px] font-semibold leading-snug md:text-[25px]" style={{ letterSpacing: "-.008em" }}>
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

export function CaseStudyBody({ content }: { content: CaseStudyContent }) {
  const sections = content.blocks.reduce<Block[][]>((groups, block) => {
    if (block.kind === "sectionHeading" || groups.length === 0) groups.push([]);
    groups.at(-1)?.push(block);
    return groups;
  }, []);

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {sections.map((blocks, sectionIndex) => (
        <Fragment key={sectionIndex}>
          {sectionIndex > 0 && <SectionDivider />}
          <section className="flex flex-col gap-10 md:gap-12">
            {blocks.map((block, blockIndex) => (
              <Block key={blockIndex} block={block} />
            ))}
          </section>
        </Fragment>
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
