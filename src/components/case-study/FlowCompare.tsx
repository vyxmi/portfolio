import Image from "next/image";

export default function FlowCompare() {
  return (
    <div className="not-prose">
      <div className="mx-auto w-full" style={{ maxWidth: 340 }}>
        <div
          className="relative w-full overflow-hidden"
          style={{ background: "var(--paper-dim)", border: "10px solid var(--ink)", borderRadius: 32 }}
        >
          <Image
            src="/case-studies/chance-live/review-decisions-after.gif"
            alt="The redesigned Chance.live flow, reviewing card decisions before completing the transaction"
            width={388}
            height={840}
            unoptimized
            className="block h-auto w-full"
          />
        </div>
      </div>
      <div className="cap mt-2 text-center">after: review your decisions before making them final</div>
    </div>
  );
}