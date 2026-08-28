import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import CursorZone from "@/components/CursorZone";

// Card weight follows project.size: lg spans the full row, md and mini
// share a row two-up, mini trims image height and type scale down further.
// This is an editorial rhythm, not a packed masonry grid — order stays
// exactly as given (a curated read, not chronological), sizing just varies
// within it. Every card is a real bordered container now — image on top,
// capped short so it reads as a preview rather than the main event, with
// the metric chips doing the work of showing what actually changed.
const spanClass: Record<NonNullable<Project["size"]>, string> = {
  lg: "sm:col-span-2",
  md: "",
  mini: "",
};

const aspect: Record<NonNullable<Project["size"]>, string> = {
  lg: "16/6",
  md: "16/7",
  mini: "16/8",
};

export default function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <CursorZone>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((p) => {
          const size = p.size ?? "md";
          return (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-cursor={p.content ? "view case" : "coming soon"}
              className={`group flex flex-col overflow-hidden no-underline transition-colors duration-200 hover:border-[var(--line-strong)] ${spanClass[size]}`}
              style={{ border: "1px solid var(--line)", background: "var(--paper)" }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: aspect[size],
                  ...(p.content?.heroImage?.transparentMedia
                    ? {}
                    : { background: "var(--paper-dim)", borderBottom: "1px solid var(--line)" }),
                }}
              >
                {p.content?.heroImage ? (
                  <Image
                    src={p.content.heroImage.src}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    style={{ objectPosition: p.content.heroImage.focus ?? "top" }}
                    sizes={size === "lg" ? "(min-width: 640px) 100vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-[11px]" style={{ color: "var(--ink-mute)" }}>
                    {p.title}
                  </div>
                )}
                {size === "mini" && (
                  <span
                    className="absolute right-2 top-2 font-mono text-[11px] lowercase"
                    style={{ background: "rgba(251,252,255,.9)", border: "1px solid var(--line)", padding: "2px 7px", color: "var(--ink-mute)" }}
                  >
                    mini
                  </span>
                )}
              </div>

              <div className={`flex flex-1 flex-col ${size === "mini" ? "p-4" : "p-5"}`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span
                    className={`font-semibold transition-colors duration-200 group-hover:opacity-70 ${
                      size === "lg" ? "text-[22px] md:text-[26px]" : size === "mini" ? "text-[15px]" : "text-lg md:text-xl"
                    }`}
                    style={{ letterSpacing: "-.005em" }}
                  >
                    {p.title}
                  </span>
                  <span className="cap">
                    {p.company} &middot; {p.year}
                  </span>
                </div>
                <span
                  className={`mt-1 block ${size === "mini" ? "text-[12.5px]" : "text-[13px]"} ${size === "lg" ? "max-w-xl" : ""}`}
                  style={{ color: "var(--ink-soft)" }}
                >
                  {p.tagline}
                </span>

                {p.metrics.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.metrics.map((m) => (
                      <span
                        key={m.label}
                        className="inline-flex items-baseline gap-1.5 whitespace-nowrap rounded-full font-mono text-[12px] lowercase"
                        style={{ border: "1px solid var(--line)", padding: "3px 10px 3px 9px", color: "var(--ink-mute)" }}
                      >
                        <span style={{ color: "var(--ink)", fontWeight: 600 }}>{m.value}</span>
                        {m.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </CursorZone>
  );
}
