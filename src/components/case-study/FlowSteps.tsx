import ScrollReveal from "@/components/ScrollReveal";
import Icon from "@/components/ui/Icon";
import Magnet from "@/components/fridge/Magnet";

// Ordered steps wrap as a sequence on desktop and stack on narrow screens.
export default function FlowSteps({ label, steps }: { label?: string; steps: string[] }) {
  return <ScrollReveal className="not-prose case-inline-evidence case-arrow-flow">
    {label && <div className="cap mb-3">{label}</div>}
    <ol className="case-flow">{steps.map((step,i)=><li key={i}>
      <Magnet className="fm-flow-magnet">{step}</Magnet>{i<steps.length-1 && <Icon name="next"/>}
    </li>)}</ol>
  </ScrollReveal>;
}
