"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BrandMark from "./BrandMark";
import Icon from "@/components/ui/Icon";

export type NavigationContext = {
  pathname?: string; eyebrow?: string; eyebrowHref?: string; title?: string; meta?: string;
  items?: { id: string; label: string; href?: string }[];
  siblings?: { previous?: { href: string; label: string }; next?: { href: string; label: string } };
};
const UpdateContext = createContext<Dispatch<SetStateAction<NavigationContext>>>(() => {});
export const useNavigationContext = () => useContext(UpdateContext);

const primary = [{ href: "/", label: "home" }, { href: "/brain", label: "brain" }, { href: "/about", label: "about" }];

export default function SiteNavigation({ children, email = "vyomi.seth@gmail.com" }: { children: ReactNode; email?: string }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [context, setContext] = useState<NavigationContext>({});
  const [activeId, setActiveId] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const current = context.pathname === pathname ? context : {};
  const items = current.items ?? [];
  const itemsKey = JSON.stringify(items);

  useEffect(() => {
    const entries: NavigationContext["items"] = JSON.parse(itemsKey);
    if (!entries?.length || entries[0].href) return;
    let queued = false;
    function update() {
      queued = false;
      const positions = entries!.map(item => ({ item, element: document.getElementById(item.id) })).filter(x => x.element);
      const passed = positions.filter(x => x.element!.getBoundingClientRect().top <= window.innerHeight * .3);
      setActiveId((passed.at(-1) ?? positions[0])?.item.id ?? "");
    }
    function scroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, [itemsKey, pathname]);

  const active = items.find(item => item.id === activeId);
  useEffect(() => {
    const container = document.querySelector<HTMLElement>(".contextual-rail .rail-context");
    const selected = container?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!container || !selected) return;
    const bounds = container.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    const delta = item.bottom > bounds.bottom - 12 ? item.bottom - bounds.bottom + 12 : item.top < bounds.top + 12 ? item.top - bounds.top - 12 : 0;
    if (delta) container.scrollBy({top:delta,behavior:reduced?"instant":"smooth"});
  }, [activeId, reduced]);
    function close() { dialog.current?.close(); }
  const contextLinks = (scope: string) => <>
    {current.eyebrowHref ? <Link href={current.eyebrowHref} className="rail-parent" onClick={close}><Icon name="back" />{current.eyebrow}</Link> : <span className="rail-parent">{current.eyebrow}</span>}
    {current.title && <p className="rail-title">{current.title}</p>}
    {current.meta && <p className="rail-meta">{current.meta}</p>}
    <nav className="rail-contents" aria-label="On this page">{items.map((item) => {
      const selected = item.href ? pathname === item.href : item.id === activeId;
      return <Link key={item.id} href={item.href || `#${item.id}`} onClick={close} aria-current={selected ? "location" : undefined}>
        {selected && <motion.span className="rail-selection" layoutId={`rail-selection-${scope}`} transition={{duration:reduced?0:.35,ease:[.22,1,.36,1]}} />}
        <span className="rail-item-label">{item.label}</span><Icon name="next" />
      </Link>;
    })}</nav>
    {current.siblings?.next && <Link className="rail-next" href={current.siblings.next.href} onClick={close}><span>next case <Icon name="next" /></span>{current.siblings.next.label}</Link>}
  </>;

  return <UpdateContext.Provider value={setContext}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <aside className="contextual-rail">
      <Link className="rail-brand" href="/" aria-label="Vyomi Seth home"><BrandMark /><span>vyomi seth</span></Link>
      <nav className="rail-primary" aria-label="Primary navigation">{primary.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}<Icon name="external" /></Link>)}</nav>
      <AnimatePresence mode="wait" initial={false}><motion.div className="rail-context" key={pathname} initial={reduced ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced?0:8 }} transition={{ duration: .25 }}>{contextLinks("desktop")}</motion.div></AnimatePresence>
      <a className="rail-email" href={`mailto:${email}`}><Icon name="email" />email me<Icon name="external" /></a>
    </aside>
    <div className="mobile-dock">
      {items.length > 0 && <button className="dock-context" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog"><span>{active?.label || current.title || current.eyebrow}</span><Icon name="up" /></button>}
      <nav aria-label="Mobile navigation"><Link href="/" aria-current={pathname === "/" ? "page" : undefined}>home</Link><Link href="/brain" aria-current={pathname === "/brain" ? "page" : undefined}>brain</Link><Link href="/about" aria-current={pathname === "/about" ? "page" : undefined}>about</Link><a href={`mailto:${email}`}>email me <Icon name="external" /></a></nav>
    </div>
    <dialog ref={dialog} className="mobile-contents" aria-label="Page contents" onClick={e => { if (e.target === e.currentTarget) close(); }}><div><button className="contents-close" onClick={close} aria-label="Close page contents"><Icon name="close" /></button>{contextLinks("mobile")}</div></dialog>
    {children}
  </UpdateContext.Provider>;
}
