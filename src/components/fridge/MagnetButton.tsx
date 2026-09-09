import type { ButtonHTMLAttributes, ReactNode } from "react";

export default function MagnetButton({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button {...props} className={`fm-magnet-button ${className}`}>{children}</button>;
}
