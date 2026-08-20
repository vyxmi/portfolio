"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/projects";
import CursorZone from "@/components/CursorZone";

export default function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project>(projects[0]);

  return (
    <CursorZone>
      <div className="grid gap-10 md:grid-cols-[1fr_420px] md:gap-16">
        <div>
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-cursor={p.content ? "view case" : "coming soon"}
              onMouseEnter={() => setActive(p)}
              onFocus={() => setActive(p)}
              className="group grid grid-cols-[36px_1fr_auto] items-baseline gap-4 py-6 no-underline sm:grid-cols-[36px_1fr_140px_64px]"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <span className="cap">{p.number}</span>
              <span>
                <span
                  className="block text-lg font-semibold transition-colors duration-200 group-hover:opacity-70 md:text-xl"
                  style={{ letterSpacing: "-.005em" }}
                >
                  {p.title}
                </span>
                <span className="mt-1 block text-[13px]" style={{ color: "var(--ink-soft)" }}>
                  {p.result}
                </span>
              </span>
              <span className="hidden text-[12px] sm:block" style={{ color: "var(--ink-mute)" }}>
                {p.company}
              </span>
              <span className="cap hidden text-right sm:block">{p.year}</span>
              {/* mobile-only inline preview, no hover available */}
              <div
                className="col-span-3 mt-2 flex aspect-[16/9] items-center justify-center text-[11px] sm:hidden"
                style={{ background: "var(--paper-dim)", border: "1px solid var(--line)", color: "var(--ink-mute)" }}
              >
                {p.title}
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <div
            className="sticky top-16 flex aspect-[4/5] flex-col justify-between p-5 transition-opacity duration-300"
            style={{ background: "var(--paper-dim)", border: "1px solid var(--line)" }}
          >
            <span className="cap">{active.discipline}</span>
            <div>
              <div className="mb-2 text-sm" style={{ color: "var(--ink-mute)" }}>
                {active.content ? "preview media pending" : "case study not yet built"}
              </div>
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
