import { site } from "@/lib/site";

export default function ReviewerAccess({ incorrect }: { incorrect: boolean }) {
  return (
    <section id="reviewer-access" className="my-12 border-t py-8" style={{ borderColor: "var(--line)" }}>
      <h2 className="mb-3 text-xl font-semibold">A closer look</h2>
      <p className="measure mb-6 text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        The research, product screens, and full case study are shared privately.
      </p>
      <form action="/work/adem-user-list/access" method="post" className="max-w-md">
        <label htmlFor="reviewer-password" className="mb-2 block text-sm font-medium">Case study password</label>
        <div className="flex flex-wrap gap-3">
          <input id="reviewer-password" name="password" type="password" autoComplete="current-password" required maxLength={1024}
            aria-invalid={incorrect || undefined} aria-describedby={incorrect ? "access-error" : undefined}
            className="min-h-12 min-w-0 flex-[1_1_180px] rounded-sm border px-3" style={{ borderColor: "var(--line-strong)", background: "var(--paper)" }} />
          <button type="submit" className="min-h-12 rounded-sm px-5 text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Read case study →</button>
        </div>
        {incorrect && <p id="access-error" role="alert" className="mt-3 text-sm">That password didn’t match. Try again or request access below.</p>}
      </form>
      <a href={`mailto:${site.email}?subject=ADEM%20case%20study%20access`} className="mt-5 inline-block text-sm underline underline-offset-4" style={{ color: "var(--accent)" }}>Ask me for access</a>
    </section>
  );
}
