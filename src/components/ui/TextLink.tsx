import type { ReactNode } from "react";

type Kind = "external" | "next" | "back" | "download" | "up";

const icons: Record<Kind, ReactNode> = {
  external: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  next: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  back: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M9.5 6H2.5M2.5 6L6 2.5M2.5 6L6 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  download: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 1.5V8M6 8L3.5 5.5M6 8L8.5 5.5M2 9.5V10.5H10V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  up: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// The one link style for the whole site: accent-colored text with a
// small directional icon. `kind` picks the icon and its side, not the
// color, there's only one accent link.
export default function TextLink({
  href,
  kind = "external",
  children,
  className = "",
}: {
  href: string;
  kind?: Kind;
  children: ReactNode;
  className?: string;
}) {
  const iconFirst = kind === "back";
  return (
    <a
      href={href}
      target={kind === "external" ? "_blank" : undefined}
      rel={kind === "external" ? "noopener noreferrer" : undefined}
      className={`group inline-flex items-center gap-1.5 font-medium no-underline ${className}`}
      style={{ color: "var(--link-accent, var(--accent))" }}
    >
      {iconFirst && (
        <span className="transition-transform duration-200 group-hover:-translate-x-0.5">{icons[kind]}</span>
      )}
      <span className="border-b border-transparent transition-colors duration-200 group-hover:border-current">
        {children}
      </span>
      {!iconFirst && (
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icons[kind]}</span>
      )}
    </a>
  );
}
