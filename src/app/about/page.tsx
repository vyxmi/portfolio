import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SideRail from "@/components/nav/SideRail";
import Zoomable from "@/components/ui/Zoomable";
import TextLink from "@/components/ui/TextLink";
import { site } from "@/lib/site";

const SECTIONS = [
  { id: "experience", label: "experience" },
  { id: "origin", label: "before design" },
  { id: "side-quests", label: "side quests" },
  { id: "contact", label: "say hello" },
];

export const metadata: Metadata = { title: "About, Vyomi Seth" };

function AboutImage({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}) {
  return (
    <div className="not-prose mx-auto w-full">
      <Zoomable src={src} alt={alt}>
        <div className="case-box relative w-full overflow-hidden" style={{ background: "var(--paper-dim)" }}>
          <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" style={{ display: "block" }} />
        </div>
      </Zoomable>
      {caption && <div className="cap mt-2">{caption}</div>}
    </div>
  );
}

type ExperienceEntry = {
  role: string;
  company: string;
  href?: string;
  external?: boolean;
};

// Sourced from the old site's hero (vyomiseth.com, "recently" / "less
// recently"). Case-study companies link to their write-up here; the rest
// have no page to point to, so they stay plain text rather than a
// fabricated link.
const EXPERIENCE: { group: string; entries: ExperienceEntry[] }[] = [
  {
    group: "recently",
    entries: [
      { role: "Founding Designer, Growth Strategy & Sound Design", company: "Chance.live", href: "/work/chance-live" },
      { role: "Creative Direction", company: "KSDT Radio + Tokens Magazine" },
      { role: "B.S. Cognitive Science + Business", company: "UC San Diego", href: "https://ucsd.edu/", external: true },
    ],
  },
  {
    group: "less recently",
    entries: [
      { role: "Campus Growth Leader", company: "Framer", href: "https://www.framer.com/", external: true },
      { role: "Product Design Intern", company: "Palo Alto Networks", href: "/work/adem-user-list" },
      { role: "Founding Designer", company: "Boba Quest" },
    ],
  },
];

function ExperienceRow({ role, company, href, external }: ExperienceEntry) {
  const companyNode = href ? (
    <TextLink href={href} kind={external ? "external" : "next"} className="text-[15px] font-medium">
      {company}
    </TextLink>
  ) : (
    <span className="text-[15px] font-medium" style={{ color: "var(--ink)" }}>
      {company}
    </span>
  );
  return (
    <li className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <span className="text-[15px]" style={{ color: "var(--ink-soft)" }}>
        {role}
      </span>
      {companyNode}
    </li>
  );
}

export default function AboutPage() {
  return <div className="light site-page about-page">
    <SideRail eyebrow="the person behind the work" items={SECTIONS}/>
    <main id="main-content" className="about-main">
      <header className="about-opening">
        <div className="about-hello"><span className="eyebrow">bay area, california</span><h1>Hey,<br/>I’m Vyomi<span>(vee oh me)</span></h1><p>I take apart ambiguous problems, follow unlikely connections, and turn what I learn into systems, objects, experiences, and occasionally very elaborate side quests.</p><a href="#contact">{site.availability} ↗</a></div>
        <figure className="about-portrait"><Image src="/about/portrait.webp" alt="Vyomi Seth, outdoors" width={900} height={600} priority/><figcaption>usually making something. occasionally outside.</figcaption></figure>
      </header>
      <div className="about-narrative">
        <section id="origin" className="mb-16" style={{ borderTop: "1px solid var(--line)", paddingTop: 48, scrollMarginTop: 100 }}>
            <div className="eyebrow mb-3">origin</div>
            <h2 className="mb-6 text-[28px] font-semibold leading-[1.1] md:text-[36px]" style={{ letterSpacing: "-.015em" }}>Before design</h2>
            <div className="flex flex-col gap-5 text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              <p>
                I liked knowing how things work. As a kid, I took apart anything I could get my hands on (much to my
                parents&rsquo; dismay), built popsicle stick houses for bugs, got micro famous on Scratch, and drew
                logos for my friends&rsquo; bands.
              </p>
              <p>I wasn&rsquo;t trying to become a designer. I just liked making things. If I had an idea, I wanted to see it exist.</p>
              <p>
                Originally from the Bay Area, I studied Cognitive Science (HCI &amp; Design) with a minor in
                Entrepreneurship &amp; Innovation at UC San Diego. The degree is a bit of a mouthful, but the idea is
                simple: understand people, understand systems, and figure out how to make them better.
              </p>
              <p>
                Over time, I realized the part of design I loved most wasn&rsquo;t visual. It was the messy middle
                part: noticing problems people overlooked, asking better questions, and turning vague ideas into
                something real.
              </p>
              <p>
                That mindset has taken me through product design, startups, growth, education, creative direction,
                and a truly unreasonable number of side quests.
              </p>
              <AboutImage
                src="/about/museum.webp"
                alt="Vyomi Seth standing in front of a large floral pop-art painting"
                caption="an afternoon spent staring at florals bigger than the room"
                width={1000}
                height={1179}
              />
            </div>
          </section>
        <section id="experience" className="mb-16 mt-14" style={{ scrollMarginTop: 100 }}>
            <div className="eyebrow mb-3">experience</div>
            <h2 className="mb-8 text-[28px] font-semibold leading-[1.1] md:text-[36px]" style={{ letterSpacing: "-.015em" }}>Where I&rsquo;ve been</h2>
            <div className="flex flex-col gap-8">
              {EXPERIENCE.map((group) => (
                <div key={group.group}>
                  <div className="cap mb-3">{group.group}</div>
                  <ul className="flex flex-col gap-3">
                    {group.entries.map((entry) => (
                      <ExperienceRow key={`${entry.role}-${entry.company}`} {...entry} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        <section id="side-quests" className="mb-16" style={{ borderTop: "1px solid var(--line)", paddingTop: 48, scrollMarginTop: 100 }}>
            <div className="eyebrow mb-3">side quests</div>
            <h2 className="mb-6 text-[28px] font-semibold leading-[1.1] md:text-[36px]" style={{ letterSpacing: "-.015em" }}>Outside of design (still design)</h2>
            <div className="flex flex-col gap-5 text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              <p>
                I can&rsquo;t sit still. I make posters for local shows, jewelry, clothes, recipes, travel
                itineraries, color coded spreadsheets, home DIY projects, and probably too many systems for
                organizing my life.
              </p>
              <p>
                At 15, I started a tutoring business because I wanted to make education more accessible for
                neurodivergent kids in my area. In college, I started a haircutting business out of my dorm room
                called &quot;deep cuts by calypso&quot;, where I quite literally and metaphorically took weight off
                the heads of over 50 (strangely trusting) students in nine months.
              </p>
              <p>
                At UC San Diego, I became enamored with college radio (shoutout KSDT). As DJ c4lypso, I became a
                musician, audio engineer, event organizer, and creative lead, shaping how students discover and
                experience music. Some highlights included organizing a show for one of my favorite artists and
                hosting a student musician interview mini series.
              </p>
              <AboutImage
                src="/about/ksdt-radio.webp"
                alt="Vyomi Seth at the mixing board in the KSDT radio studio, in a graduation stole"
                caption="ksdt radio, deep in a mix"
                width={1200}
                height={900}
              />
              <p>
                Somewhere along the way, I recorded and released an EP with my band, performed live a handful of
                times, and lifted what was probably a combined five tons of audio equipment.
              </p>
              <p>
                I also explored creative leadership at Tokens Magazine, where I led a team, built marketing
                campaigns, covered live events, helped grow a community of over 1000 students, and made an actual
                magazine.
              </p>
              <p>
                And as their campus growth leader, I got to spread the good name of Framer, where my love for
                throwing elaborately themed events came in handy.
              </p>
            </div>
          </section>
        <details className="about-aside"><summary>A little more on how I see things ↗</summary><section id="philosophy" className="mb-16" style={{ borderTop: "1px solid var(--line)", paddingTop: 48, scrollMarginTop: 100 }}>
            <div className="eyebrow mb-3">working philosophy</div>
            <h2 className="mb-6 text-[28px] font-semibold leading-[1.1] md:text-[36px]" style={{ letterSpacing: "-.015em" }}>
              Is everything design? I think so.
            </h2>
            <div className="flex flex-col gap-5 text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              <p>To me, design is a way of seeing the world.</p>
              <p>
                It&rsquo;s noticing when something feels unnecessarily difficult. It&rsquo;s understanding why people
                behave the way they do. It&rsquo;s creating systems that make life easier, experiences that feel
                intentional, and moments that people remember.
              </p>
              <p>
                I use that mindset everywhere: planning camping trips, organizing my calendar, learning a new
                instrument, or rearranging my room with the help of a tiny scale model.
              </p>
              <p>
                I care about both the tiny details and the bigger picture: the micro interaction that makes
                something feel effortless, the idea that helps something grow, and the conversations that turn
                strangers into a community.
              </p>
              <div className="not-prose grid gap-4 sm:grid-cols-2">
                <AboutImage
                  src="/about/book-room.webp"
                  alt="Vyomi Seth standing in front of a wall stacked floor to ceiling with books and framed art"
                  caption="a wall of books stacked higher than sense"
                  width={1000}
                  height={1333}
                />
                <AboutImage
                  src="/about/camping.webp"
                  alt="A sunlit, lens-flared photo of Vyomi Seth sitting outdoors on a camping trip"
                  caption="planning camping trips, executing camping trips"
                  width={700}
                  height={640}
                />
              </div>
              <p style={{ color: "var(--ink)" }}>
                TL;DR: I love making things that add a little more joie de vivre* to the world, by design.
              </p>
              <p className="cap">*French for &quot;joy of living&quot;, but more pretentious.</p>
            </div>
          </section></details>
        <section id="contact" style={{ borderTop: "1px solid var(--line)", paddingTop: 48, scrollMarginTop: 100 }}>
            <div className="eyebrow mb-3">say hello</div>
            <h2 className="mb-5 text-[28px] font-semibold md:text-[34px]" style={{ letterSpacing: "-.01em" }}>
              Have something in mind?
            </h2>
            <p className="measure mb-8 text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              Open to roles, select design work, and collaborations. If you&rsquo;ve got an idea, a problem worth untangling,
              or just connected with something inside{" "}
              <Link href="/brain" className="underline" style={{ color: "var(--link-accent, var(--accent))" }}>
                my brain
              </Link>
              , my inbox is open.
            </p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              <TextLink href={site.professionalCalendar} kind="external" className="text-[16px]">let’s talk</TextLink>
              <TextLink href={`mailto:${site.email}`} kind="external" className="text-[16px]">
                {site.email}
              </TextLink>
              <TextLink
                href="https://drive.google.com/file/d/17mbrWJjjch7fsVCZxFVA194IxyuPhgIu/view?usp=sharing"
                kind="download"
                className="text-[16px]"
              >
                resume
              </TextLink>
              <TextLink href={site.linkedin} kind="external" className="text-[16px]">
                linkedin
              </TextLink>
            </div>
          </section>
      </div>
    </main><SiteFooter compact/>
  </div>;
}
