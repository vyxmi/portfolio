import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/SiteFooter";
import Zoomable from "@/components/ui/Zoomable";

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
    <div className="not-prose">
      <Zoomable src={src} alt={alt}>
        <div className="relative w-full overflow-hidden" style={{ background: "var(--paper-dim)", border: "1px solid var(--line)" }}>
          <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" style={{ display: "block" }} />
        </div>
      </Zoomable>
      {caption && <div className="cap mt-2">{caption}</div>}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="light flex min-h-screen flex-col md:pl-[var(--rail-w)]">
      <main className="flex-1 px-6 pb-16 pt-24 md:px-16 md:pt-28">
        <div className="mx-auto max-w-2xl">
          <div className="eyebrow mb-3">about</div>
          <h1 className="mb-1 text-[36px] font-semibold md:text-[44px]" style={{ letterSpacing: "-.015em" }}>
            Hey, I&apos;m Vyomi
          </h1>
          <p className="cap mb-8">vee oh me</p>

          <AboutImage src="/about/portrait.webp" alt="Vyomi Seth, outdoors" width={900} height={600} />

          <section className="mb-16 mt-14">
            <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--ink-mute)" }}>
              Before design
            </h2>
            <div className="flex flex-col gap-5 text-[17px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              <p>
                I liked knowing how things work. As a kid, I took apart anything I could get my hands on (much to my
                parents&rsquo; dismay), built popsicle stick houses for bugs, got micro famous on{" "}
                <span className="inline-flex items-baseline gap-1">
                  Scratch
                  <Image
                    src="/about/scratch-avatar.webp"
                    alt="A pixel-art avatar from Vyomi's Scratch days"
                    width={300}
                    height={360}
                    className="inline-block h-[1.3em] w-auto translate-y-[0.15em]"
                    style={{ imageRendering: "pixelated" }}
                  />
                </span>
                , and drew logos for my friends&rsquo; bands.
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

          <section className="mb-16" style={{ borderTop: "1px solid var(--line)", paddingTop: 48 }}>
            <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-wide" style={{ color: "var(--ink-mute)" }}>
              Outside of design (still design)
            </h2>
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

          <section className="mb-16" style={{ borderTop: "1px solid var(--line)", paddingTop: 48 }}>
            <h2 className="mb-5 text-[22px] font-semibold" style={{ letterSpacing: "-.01em" }}>
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
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
