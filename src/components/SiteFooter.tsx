import Link from "next/link";
import { site } from "@/lib/site";
import Icon from "@/components/ui/Icon";
export default function SiteFooter({compact=false}: {compact?:boolean}) {
  return <footer className={`page-footer ${compact?"footer-compact":""}`}>
    {!compact ? <div className="footer-main">
      <div className="footer-contact"><a href={`mailto:${site.email}`}>{site.email}<Icon name="external" /></a><p>{site.availability}</p></div>
      <div className="footer-actions"><div className="footer-links"><a href={site.professionalCalendar}>let’s talk <Icon name="external" /></a><a href={site.linkedin}>linkedin <Icon name="external" /></a></div><Link className="footer-top" href="#top" aria-label="Back to top"><Icon name="up" /></Link></div>
    </div> : <div className="footer-bottom"><span>{site.availability}</span><a href={`mailto:${site.email}`}>{site.email}<Icon name="external" /></a><Link className="footer-top" href="#top" aria-label="Back to top"><Icon name="up" /></Link></div>}
  </footer>;
}
