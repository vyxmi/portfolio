import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "./Icon";

type Kind = "external" | "next" | "back" | "download" | "up";

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
  const Component = href.startsWith("/") ? Link : "a";
  return (
    <Component
      href={href}
      target={kind === "external" ? "_blank" : undefined}
      rel={kind === "external" ? "noopener noreferrer" : undefined}
      className={`group inline-flex items-center gap-1.5 font-medium no-underline ${className}`}
      style={{ color: "var(--link-accent, var(--accent))" }}
    >
      {iconFirst && (
        <span className="transition-transform duration-200 group-hover:-translate-x-0.5"><Icon name={kind} /></span>
      )}
      <span className="border-b border-transparent transition-colors duration-200 group-hover:border-current">
        {children}
      </span>
      {!iconFirst && (
        <span className="transition-transform duration-200 group-hover:translate-x-0.5"><Icon name={kind} /></span>
      )}
    </Component>
  );
}
