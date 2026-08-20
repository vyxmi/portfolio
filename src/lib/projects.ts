// Source of truth for Work index + case study routes.
// Only "chance-live" has real case study copy right now (from the PDF
// provided). The other four are real projects from the live homepage but
// their case study bodies have not been provided yet, so `content` is
// left undefined on purpose rather than invented.
//
// Flagged for Vyomi: the finalized IA calls for 6 case study routes, but
// only 5 distinct projects exist across the current homepage and footer
// (Chance.live, ADEM User List Page, CarInsurance.com, Internship
// Wrapped/Recap, Beyond). Confirm the 6th, or this stays at 5.

export type Project = {
  slug: string;
  number: string;
  title: string;
  company: string;
  role: string;
  year: string;
  result: string;
  discipline: string;
  content?: ChanceContent;
};

export type ChanceContent = {
  heroLine: string;
  facts: { label: string; value: string }[];
  sections: {
    id: string;
    kind: "statement" | "story" | "list" | "metric" | "insight" | "constraint" | "validation";
    eyebrow?: string;
    heading?: string;
    body?: string[];
    items?: string[];
    metric?: { value: string; label: string };
    figure?: string;
  }[];
};

export const projects: Project[] = [
  {
    slug: "chance-live",
    number: "01",
    title: "Summary Revamp",
    company: "Chance.live",
    role: "Systems Designer, Product Growth Strategist",
    year: "2026",
    result: "$5,000 in prevented accidental swipes",
    discipline: "product, systems",
    content: {
      heroLine:
        "Preventing $5,000 accidental swipes, fixing a critical retention issue in my first 15 hours.",
      facts: [
        { label: "company", value: "Chance.live" },
        { label: "role", value: "Systems Designer, Product Growth Strategist" },
        { label: "team", value: "Front-end developer, 8 person company at the time" },
        { label: "duration", value: "15 hours, part-time, May 2026" },
      ],
      sections: [
        {
          id: "context",
          kind: "story",
          eyebrow: "context",
          heading: "Context",
          body: [
            "Chance.live is a startup reimagining how people buy, open, collect, and trade Pokemon cards online. I joined as its first in house designer shortly after the company secured $3M+ in funding and launched its beta.",
            "A single accidental swipe could cost users $5000+. This irreversible action was causing them to leave.",
          ],
          figure: "the original card opening process",
        },
        {
          id: "opportunity",
          kind: "statement",
          heading: "How might we make card swiping resilient to human error while still feeling sleek, premium, and magical?",
        },
        {
          id: "solution",
          kind: "story",
          eyebrow: "the solution",
          heading: "Recover from mistakes, not just avoid them",
          body: [
            "Instead of teaching users not to make mistakes, I redesigned the workflow to recover from mistakes.",
          ],
          figure: "the new card opening process",
        },
        {
          id: "research",
          kind: "story",
          eyebrow: "research",
          heading: "Understanding the vision before designing anything",
          body: [
            "I met with the team and reviewed website copy, Instagram content, and existing product flows to determine our brand ethos and identify any disconnects. I also reviewed competitor websites and features, and determined our key differentiators.",
            "My overarching business goals: transform a physical experience into a magical digital experience, make collecting more collaborative, achieve a high quality, luxury, streamlined UX.",
            "My original task was to design tutorials, onboarding flows, or tooltips that would explain the card sorting experience more clearly.",
          ],
        },
        {
          id: "audit",
          kind: "list",
          eyebrow: "ux audit",
          heading: "Where are the gaps between our product, our users' goals, and our business goals?",
          body: [
            "After walking through the flow as a first time user, I identified several gaps between user goals, business goals, and the existing product experience. The highest impact opportunity wasn't onboarding. It was trust.",
          ],
          items: [
            "Selling a card carried significantly more risk than collecting one, yet both actions felt equally lightweight.",
            "Users received very little feedback after making a decision.",
            "The workflow prioritized speed over confidence.",
            "Irreversible actions occurred before users had an opportunity to review decisions.",
            "The product encouraged transactions, but didn't provide sufficient safety mechanisms when users changed their minds.",
          ],
          figure: "the full ux audit",
        },
        {
          id: "exploration",
          kind: "story",
          eyebrow: "design exploration",
          heading: "Designing feedback instead of adding friction",
          body: [
            "I wanted to experiment with spacing and various flows, while being mindful of how elements changed on desktop and mobile, and how placement changes depending on how many cards are opened.",
            "I briefly explored a layout where cards went to the side they were swiped to, and users could drag them around, similar to the physical sensation of opening a card pack. This layout would have required element changes for mobile, which we wanted to avoid to reduce lag and system complexity.",
          ],
          figure: "some wireframes, then a mid fidelity exploration",
        },
        {
          id: "prototypes",
          kind: "story",
          eyebrow: "design exploration",
          heading: "Building high fidelity prototypes to test features and validate theories",
          body: [
            "I built 4 high fidelity prototypes for desktop and mobile that looked and felt like the real product, planned for future user testing and validation.",
          ],
          figure: "the 1 to 5 card flow, desktop and mobile",
        },
        {
          id: "systems",
          kind: "story",
          eyebrow: "systems design",
          heading: "Building edge cases and systems, not one-off screens",
          body: [
            "Users can open anywhere from 1 to 5 cards at a time. Every state needed to account for different card counts, different screen sizes, and different user actions. Chance is a small team moving quickly, so I didn't want to design a solution that would need to be reinvented every time a new feature shipped.",
            "As I designed the confirmation flow, I simultaneously built reusable foundations that future work could build on: interaction patterns, consistent button behaviors, shared visual treatments, custom iconography, mobile and desktop variants, and defined states for all 1 to 5 card scenarios.",
            "Good design systems aren't just UI kits. They're shared decisions. They reduce ambiguity, speed up development, create consistency across the product, and make future features easier to build. For a startup, that leverage compounds quickly.",
          ],
        },
        {
          id: "technical",
          kind: "constraint",
          eyebrow: "technical considerations",
          heading: "Designing with desktop and mobile implementation in mind",
          body: [
            "Because I was working directly with the front end developer, implementation was part of the design process from day one. I explored a concept where cards physically moved to different piles depending on where users swiped them, mimicking the feeling of sorting real trading cards on a table.",
            "While the interaction felt playful, it introduced additional complexity across mobile layouts and multiple card count scenarios. The additional engineering effort and state management didn't justify the value it created for users. Instead, I focused on solutions that delivered the same feeling of confidence and control while remaining technically lightweight.",
            "On mobile, the minimum height of this element should be 440px, max height, so the confirm button is in the same place each time, for a consistent UX.",
          ],
        },
        {
          id: "insight",
          kind: "insight",
          body: [
            "The best design solution isn't always the most visually impressive one. It's the one that creates the most value for users and the business relative to its implementation cost.",
          ],
        },
        {
          id: "validation",
          kind: "validation",
          eyebrow: "success metrics and validation plan",
          heading: "Does making it possible to undo selling encourage users to sell more often?",
          body: [
            "Because the redesign was completed during beta, I wanted to create measurable hypotheses to validate over time.",
            "My core hypothesis: users who know they can undo a decision will actually be more willing to make decisions in the first place. Reducing risk may increase selling behavior rather than decrease it.",
            "If I had another week, I'd run a lightweight research study using existing users, testing the original flow against the redesigned flow with 5 to 10 users, plus short post session interviews to understand how trust changed throughout the experience.",
          ],
          items: [
            "Retention: percentage of users who open another pack after completing the sorting flow, 1 day and 7 day retention before vs after",
            "Transaction behavior: percentage of cards sold vs collected, average cards sold per session, completion rate of the sorting flow",
            "Error prevention: number of undo actions used, support tickets related to accidental sales, transaction reversals requested",
            "Study measures: time to complete sorting, number of accidental sales, confidence scores after completion, likelihood of opening another pack",
          ],
        },
        {
          id: "impact",
          kind: "list",
          eyebrow: "impact",
          heading: "A safer transaction flow that still feels magical",
          items: [
            "Product: preserved Chance's premium and collectible identity, avoided default e-commerce patterns that would have cheapened the experience, created a scalable interaction system rather than a one time feature.",
            "User: can now review decisions before transactions are finalized, accidental sales become preventable instead of permanent, clearer feedback while maintaining the excitement of opening a pack.",
            "Business: addressed a major retention issue identified through analytics, reduced support burden for an 8 person startup, reduced unnecessary backend processing by finalizing transactions later in the workflow, created reusable foundations for future development.",
          ],
        },
        {
          id: "future",
          kind: "story",
          eyebrow: "future exploration",
          heading: "Custom sound design to shape user behavior and provide feedback",
          body: [
            "Physical Pokemon packs feel exciting because every action provides feedback: cards slide, wrappers crinkle, rare pulls create anticipation. Digital experiences lose many of these sensory cues. Because of my background in audio production, I see an opportunity to use sound as both feedback and motivation.",
          ],
          items: [
            "A subtle sound begins when a user swipes toward sell, and resolves when the action is confirmed",
            "Different card rarities could trigger different audio treatments, epic card, epic sound",
            "Collection actions could feel distinct from selling actions",
            "Confirmation sounds could reinforce confidence in decisions",
          ],
        },
        {
          id: "takeaways",
          kind: "insight",
          eyebrow: "takeaways",
          heading: "Measure twice. Cut once.",
          body: [
            "The original request was a tutorial. The real problem was trust. Rather than immediately executing on the proposed solution, I spent time understanding the business, the users, the product vision, and the data. That extra upfront effort allowed me to move quickly with confidence once the problem was clear.",
            "This project reinforced why I believe in house design is so valuable for startups. A designer embedded within the company develops context that external agencies often don't have, understanding product vision, technical constraints, user behavior, and long term roadmap simultaneously. The result isn't just better screens. It's better decisions.",
            "In 15 hours, I was able to identify a retention issue, align a solution with Chance's brand vision, think through implementation constraints, and create reusable foundations for future growth. That's the type of impact I want to continue bringing to Chance as the product scales.",
          ],
        },
      ],
    },
  },
  {
    slug: "adem-user-list",
    number: "02",
    title: "ADEM User List Page",
    company: "Palo Alto Networks",
    role: "Product Design Intern",
    year: "2025",
    result: "Bringing clarity to complex workflows for IT admins",
    discipline: "enterprise, systems",
  },
  {
    slug: "carinsurance-com",
    number: "03",
    title: "CarInsurance.com",
    company: "Quinstreet",
    role: "Product Designer",
    year: "2024",
    result: "Rebuilt a 20 year old site, soloed its first design system",
    discipline: "product, design systems",
  },
  {
    slug: "internship-wrapped",
    number: "04",
    title: "Internship Wrapped",
    company: "Palo Alto Networks",
    role: "Product Design Intern",
    year: "2025",
    result: "Visualizing impact, growth, and design wins as an animated recap",
    discipline: "motion, storytelling",
  },
  {
    slug: "beyond",
    number: "05",
    title: "Beyond",
    company: "Catalyst Designathon",
    role: "Product Designer",
    year: "2024",
    result: "Bridging career and education inequities with empathy",
    discipline: "social impact",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
