import Image from "next/image";
import Zoomable from "@/components/ui/Zoomable";
export default function CardStateInspector() {
  return <figure className="case-evidence"><Zoomable src="/case-studies/chance-live/edge-case-states.webp" alt="Confirmation states across different card counts and mixed collect/sell selections"><Image src="/case-studies/chance-live/edge-case-states.webp" alt="Confirmation states across different card counts and mixed collect/sell selections" width={1800} height={720} sizes="(max-width: 900px) 90vw, 850px" /></Zoomable><figcaption className="cap">one to five cards, with a chance to review every decision</figcaption></figure>;
}
