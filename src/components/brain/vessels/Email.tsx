import type { BrainObject } from "@/lib/brain/types";
import { dateLabel, resolveExpand } from "@/lib/brain/resolvers";
import { MediaThumb, VBody } from "./parts";

// A real header — From/To/Subject/Date rows, each rendered only when that
// field actually has data (never an empty "From:" label), body below it.
// Subject reuses `title` (already the subject line) and Date reuses
// dateLabel() (already the object's resolved date) rather than duplicate
// fields — From/To are the only inputs unique to this header. This is also
// the *only* place this object's date renders: BrainMetaBottom skips email
// vessels entirely so there's never a duplicate external date.
function EmailField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="email-field">
      <span className="email-field-label">{label}</span>
      <span className="email-field-value">{value}</span>
    </div>
  );
}

export default function Email({ o, presentation = "wall" }: { o: BrainObject; presentation?: "wall" | "focus" }) {
  const date = dateLabel(o);
  return (
    <>
      <div className="email-bar" aria-hidden />
      {(o.emailFrom || o.emailTo || o.title || date) && (
        <div className="email-head">
          <EmailField label="from" value={o.emailFrom} />
          <EmailField label="to" value={o.emailTo} />
          <EmailField label="subject" value={o.title} />
          <EmailField label="date" value={date} />
        </div>
      )}
      {o.media && o.media.length > 0 && (
        <div className="email-attachment">
          <MediaThumb o={o} fit="contain" />
        </div>
      )}
      <VBody o={o} readMore={presentation === "wall" && resolveExpand(o) === "read-more"} />
    </>
  );
}
