import ScrollReveal from "@/components/ScrollReveal";
import Icon from "@/components/ui/Icon";

// Ordered steps wrap as a sequence on desktop and stack on narrow screens.
export default function FlowSteps({ label, steps }: { label?: string; steps: string[] }) {
  return <ScrollReveal className="not-prose">
    {label && <div className="cap mb-3">{label}</div>}
    <ol className="case-flow">{steps.map((step,i)=><li key={i}>
      <span>{step}</span>{i<steps.length-1 && <Icon name="next"/>}
    </li>)}</ol>
  </ScrollReveal>;
}
