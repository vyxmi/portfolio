import type { SVGProps } from "react";

export type IconName = "external" | "next" | "back" | "up" | "down" | "close" | "email" | "download" | "expand";
const paths: Record<IconName, string> = {
  external: "M5 19 19 5M6 5h13v13",
  next: "M4 12h16m-7-7 7 7-7 7",
  back: "M20 12H4m7-7-7 7 7 7",
  up: "M12 20V4m-7 7 7-7 7 7",
  down: "M12 4v16m-7-7 7 7 7-7",
  close: "m6 6 12 12M6 18 18 6",
  email: "M3 5h18v14H3ZM3 6l9 7 9-7",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  expand: "M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6",
};

export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter" aria-hidden="true" focusable="false" {...props}><path d={paths[name]} /></svg>;
}
