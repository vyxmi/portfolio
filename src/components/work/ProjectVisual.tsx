import Image from "next/image";

// Editorial diagrams describe real transformations. They are deliberately
// schematic, never presented as screenshots of the shipped product.
export default function ProjectVisual({ slug }: { slug: string }) {
  if (slug === "chance-deposit-flow") return (
    <div className="project-art art-deposit" aria-label="Deposit flow simplified from seven clicks to three">
      <span className="art-note">less between wanting & doing</span>
      <div className="deposit-path old-path">{Array.from({ length: 7 }, (_, i) => <i key={i}>{i + 1}</i>)}</div>
      <div className="deposit-equation"><span>7</span><span className="equation-arrow">↘</span><strong>3</strong></div>
      <div className="deposit-path new-path"><i>open</i><i>amount</i><i>balance</i></div>
      <span className="art-footnote">a simpler path through the same infrastructure</span>
    </div>
  );
  if (slug === "adem-user-list") return (
    <div className="project-art art-adem" aria-label="Seven entry points converge on one investigation, preserving context">
      <span className="art-note">keep the context. lose the detour.</span>
      <svg viewBox="0 0 600 330" className="adem-lines" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => <g key={i}><path d={`M40 ${35 + i * 43} C260 ${35 + i * 43}, 270 165, 460 165`} /><circle cx="40" cy={35 + i * 43} r="4" /></g>)}
        <rect x="452" y="120" width="104" height="90" rx="3" /><path d="M474 144h60M474 165h38M474 186h48" />
      </svg>
      <div className="art-bottom"><span>7 entry points</span><strong>one place to investigate</strong></div>
    </div>
  );
  if (slug === "carinsurance-com") return (
    <div className="project-art art-system" aria-label="Reusable components become templates for more than 200 pages">
      <span className="art-note">make the next decision unnecessary</span>
      <div className="system-sheets" aria-hidden="true">{[0, 1, 2, 3].map(n => <div className="system-sheet" key={n}><span>carinsurance.com</span><b /><i /><i /><div className="sheet-modules"><em /><em /><em /></div><i /><i /></div>)}</div>
      <div className="art-bottom"><strong>200+ pages.<br />One shared foundation.</strong><span>parts → possibilities</span></div>
    </div>
  );
  if (slug === "chance-live") return (
    <div className="project-art art-chance" aria-label="Card decisions can be reviewed before a sale becomes final">
      <span className="art-note">a little room to change your mind</span>
      <div className="chance-artifact"><Image src="/case-studies/chance-live/swipe-flow.webp" alt="Chance card review interface" fill sizes="(max-width: 700px) 90vw, 50vw" /></div>
      <div className="art-bottom"><span>swipe → review → confirm</span><strong>certainty before selling.</strong></div>
    </div>
  );
  return <div className="project-art art-system"><span className="art-note">selected work</span><span className="fallback-art">↗</span></div>;
}
