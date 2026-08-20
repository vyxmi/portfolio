"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/projects";
import CursorZone from "@/components/CursorZone";

export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project>(projects[0]);

  return (
    <CursorZone>
      <div className="grid gap-12 md:grid-cols-[1fr_420px] md:gap-16">
        <div>
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-cursor={p.content ? "view case" : "coming soon"}
              onMouseEnter={() => setActive(p)}
              onFocus={() => setActive(p)}
              className="group flex flex-col gap-4 py-6 no-underline sm:flex-row sm:items-center sm:gap-6"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <span className="cap flex-none sm:w-9">{p.number}</span>

              {/* real thumbnail, visible on every breakpoint, not just desktop hover */}
              <div
                className="relative aspect-[16/10] flex-none overflow-hidden sm:w-40"
                style={{ background: "var(--paper-dim)", border: "1px solid var(--line)" }}
              >
                {p.content?.heroImage ? (
                  <Image src={p.content.heroImage.src} alt="" fill className="object-cover object-top" sizes="160px" />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-[10.5px]" style={{ color: "var(--ink-mute)" }}>
                    {p.title}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span
                    className="text-lg font-semibold transition-colors duration-200 group-hover:opacity-70 md:text-xl"
                    style={{ letterSpacing: "-.005em" }}
                  >
                    {p.title}
                  </span>
                  <span className="cap">
                    {p.company} &middot; {p.year}
                  </span>
                </div>
                <span className="mt-1 block text-[13px]" style={{ color: "var(--ink-soft)" }}>
                  {p.result}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <div
            className="sticky top-16 flex aspect-[4/5] flex-col justify-between overflow-hidden p-5 transition-opacity duration-300"
            style={{ background: "var(--paper-dim)", border: "1px solid var(--line)" }}
          >
            {active.content?.heroImage && (
              <Image
                src={active.content.heroImage.src}
                alt=""
                fill
                className="object-cover object-top opacity-90"
                sizes="420px"
              />
            )}
            <span className="cap relative">{active.discipline}</span>
            <div className="relative" style={{ background: active.content?.heroImage ? "rgba(251,252,255,.92)" : "transparent", margin: -8, padding: 8 }}>
              <div className="text-2xl font-semibold" style={{ letterSpacing: "-.01em" }}>
                {active.title}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: "var(--ink-soft)" }}>
                {active.company}, {active.year}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CursorZone>
  );
}
