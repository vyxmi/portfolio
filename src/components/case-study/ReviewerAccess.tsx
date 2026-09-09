import { site } from "@/lib/site";
import Magnet from "@/components/fridge/Magnet";
import MagnetButton from "@/components/fridge/MagnetButton";

export default function ReviewerAccess({ incorrect }: { incorrect: boolean }) {
  return (
    <section id="reviewer-access" className="fm-password-gate my-12 border-t py-8" style={{ borderColor: "var(--line)" }}>
      <span className="fm-gate-label"><Magnet rotation={-2}>private</Magnet></span>
      <h2 className="mb-3 text-xl font-semibold">A closer look</h2>
      <p className="measure mb-6 text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        email me for access.
      </p>
      <form action="/work/adem-user-list/access" method="post" className="max-w-md">
        <label htmlFor="reviewer-password" className="mb-2 block text-sm font-medium">Case study password</label>
        <div className="flex flex-wrap gap-3">
          <input id="reviewer-password" name="password" type="password" autoComplete="current-password" required maxLength={1024}
            aria-invalid={incorrect || undefined} aria-describedby={incorrect ? "access-error" : undefined}
            className="min-h-12 min-w-0 flex-[1_1_180px] rounded-sm border px-3" style={{ borderColor: "var(--line-strong)", background: "var(--paper)" }} />
          <MagnetButton type="submit" className="fm-gate-submit min-h-12 px-5 text-sm font-medium">Read case study</MagnetButton>
        </div>
        {incorrect && <p id="access-error" role="alert" className="mt-3 text-sm">That password didn’t match. Try again or request access below.</p>}
      </form>
      <a href={`mailto:${site.email}?subject=ADEM%20case%20study%20access`} className="mt-5 inline-block text-sm underline underline-offset-4" style={{ color: "var(--accent)" }}>email me for access</a>
    </section>
  );
}
