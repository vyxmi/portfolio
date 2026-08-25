import type { CaseStudyContent } from "./case-study-types";

// Source of truth for Work index + case study routes. Content is built
// from the real case study pages Vyomi provided (mhtml captures of the
// live site) plus the original Chance PDF. Nothing here is invented,
// see [FLAG] blocks inline for anything that needs her input.
//
// Note: a 6th project, an ongoing Chance.live creator platform, was
// also provided but its source explicitly says "This case study is
// private and an on-going project. Please do not share beyond the
// intended audience." It is deliberately excluded from this file and
// from the public site.

export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  company: string;
  role: string;
  year: string;
  result: string;
  metrics: Metric[];
  discipline: string;
  content?: CaseStudyContent;
  // Real page, real URL, deliberately not surfaced in the Work index or
  // the case-study "next" cycle — for material the source explicitly
  // marked private/not for public sharing.
  unlisted?: boolean;
  // Editorial sizing for the Work index card grid — how much visual
  // weight the project gets, not a claim about how "good" it is.
  size?: "mini" | "md" | "lg";
};

const chanceLive: CaseStudyContent = {
  heroLine: "Preventing $5,000 accidental swipes, fixing a critical retention issue in my first 15 hours.",
  heroImage: { src: "/case-studies/chance-live/swipe-flow.webp", alt: "Chance.live card swipe screen, Collect or Sell, with an Undo control", width: 2048, height: 1367 },
  facts: [
    { label: "company", value: "Chance.live" },
    { label: "role", value: "Systems Designer, Product Growth Strategist" },
    { label: "team", value: "Front-end developer, 8 person company at the time" },
    { label: "duration", value: "15 hours, part time, May 2026" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "context",
      heading: "Context",
      body: [
        "Chance.live is a startup reimagining how people buy, open, collect, and trade Pokemon cards online. I joined as its first in house designer shortly after the company secured $3M+ in funding and launched its beta.",
      ],
    },
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "One wrong swipe, and it's gone",
      body: [
        "A single accidental swipe could cost users $5,000+, and selling is irreversible.",
        "This issue also generated support tickets, which created additional operational costs for an already lean team of eight people.",
      ],
      items: [
        "Open a pack",
        "Accidentally swipe a card",
        "Realize the mistake too late — selling is irreversible",
        "Lose trust in the platform",
        "Stop using Chance entirely",
      ],
    },
    {
      kind: "video",
      src: "/case-studies/chance-live/accidental-swipe-before.mp4",
      caption: "before: an accidental swipe on mobile, with no way back",
    },
    { kind: "statement", heading: "How might we make card swiping resilient to human error while still feeling sleek, premium, and magical?" },
    {
      kind: "story",
      eyebrow: "the solution",
      heading: "Recover from mistakes, not just avoid them",
      body: ["Instead of teaching users not to make mistakes, I redesigned the workflow to recover from mistakes."],
    },
    { kind: "flowCompare" },
    {
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
      kind: "story",
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
    },
    {
      kind: "image",
      src: "/case-studies/chance-live/ux-walkthrough.webp",
      transparentMedia: true,
      alt: "Annotated screenshot of the sell flow with real first-time-user questions and a recommendation sticky note",
      caption: "walking the flow as a first-time user, sticky notes and all",
      width: 1400,
      height: 915,
    },
    {
      kind: "image",
      src: "/case-studies/chance-live/full-ux-audit.webp",
      transparentMedia: true,
      alt: "The complete UX audit board, wider than it is tall, covering the full sell flow with annotations",
      caption: "the full audit board — click to zoom, it's a wide one",
      width: 4000,
      height: 439,
    },
    {
      kind: "story",
      eyebrow: "design exploration",
      heading: "Designing feedback instead of adding friction",
      body: [
        "I wanted to experiment with spacing and various flows, while being mindful of how elements changed on desktop and mobile, and how placement changes depending on how many cards are opened.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/chance-live/wireframes.webp",
      transparentMedia: true,
      alt: "Low-fidelity grayscale wireframes exploring card, vault, and sell layouts",
      caption: "some early wireframes, before any visual polish",
      width: 2000,
      height: 798,
    },
    {
      kind: "story",
      body: [
        "I briefly explored a layout where cards went to the side they were swiped to, and users could drag them around, similar to the physical sensation of opening a card pack. This layout would have required element changes for mobile, which we wanted to avoid to reduce lag and system complexity.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/chance-live/midfi-exploration.webp",
      transparentMedia: true,
      alt: "Mid-fidelity exploration of the vaulted and sold confirmation states",
      caption: "a mid-fidelity exploration of the confirmation states",
      width: 1800,
      height: 592,
    },
    { kind: "cardStateInspector" },
    {
      kind: "story",
      eyebrow: "systems design",
      heading: "Building edge cases and systems, not one-off screens",
      body: [
        "Users can open anywhere from 1 to 5 cards at a time. Every state needed to account for different card counts, different screen sizes, and different user actions. Chance is a small team moving quickly, so I didn't want to design a solution that would need to be reinvented every time a new feature shipped.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/chance-live/intro-variations.webp",
      transparentMedia: true,
      alt: "The intro page shown across 1, 2, 3, 4, and 5 card counts, plus the summary state",
      caption: "how the intro page changes depending on how many cards are opened",
      width: 1800,
      height: 720,
    },
    {
      kind: "story",
      body: [
        "As I designed the confirmation flow, I simultaneously built reusable foundations that future work could build on: interaction patterns, consistent button behaviors, shared visual treatments, custom iconography, mobile and desktop variants, and defined states for all 1 to 5 card scenarios.",
      ],
    },
    {
      kind: "imagePair",
      images: [
        {
          src: "/case-studies/chance-live/mobile-flow.webp",
          transparentMedia: true,
          alt: "Part of the mobile 5-card user flow, swiping between collect and sell states",
          caption: "part of the mobile 5-card user flow",
          width: 1800,
          height: 512,
        },
        {
          src: "/case-studies/chance-live/desktop-flow.webp",
          transparentMedia: true,
          alt: "Desktop 1-card user flow, from collect/sell choice to confirmation",
          caption: "the desktop 1-card user flow",
          width: 1800,
          height: 393,
        },
      ],
    },
    {
      kind: "story",
      body: [
        "Good design systems aren't just UI kits. They're shared decisions. They reduce ambiguity, speed up development, create consistency across the product, and make future features easier to build. For a startup, that leverage compounds quickly.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/chance-live/component-system.webp",
      alt: "Component sheet: Card Bank, Card, Multiple Cards, Card Actions, Price Dial, Card Index, and Background states",
      caption: "the reusable component set: cards, actions, indices, and background states",
      width: 904,
      height: 487,
    },
    {
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
      kind: "image",
      src: "/case-studies/chance-live/edge-case-states.webp",
      transparentMedia: true,
      alt: "Confirmation states across different card counts and mixed collect/sell selections",
      caption: "confirmation states across different card counts and mixed collect/sell selections",
      width: 1800,
      height: 720,
    },
    { kind: "insight", body: ["The best design solution isn't always the most visually impressive one. It's the one that creates the most value for users and the business relative to its implementation cost."] },
    {
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
      kind: "story",
      eyebrow: "impact",
      heading: "A safer transaction flow that still feels magical",
      items: [
        "Product: preserved Chance's premium and collectible identity, avoided default e-commerce patterns that would have cheapened the experience, created a scalable interaction system rather than a one time feature.",
        "User: can now review decisions before transactions are finalized, accidental sales become preventable instead of permanent, clearer feedback while maintaining the excitement of opening a pack.",
        "Business: addressed a major retention issue identified through analytics, reduced support burden for an 8 person startup, reduced unnecessary backend processing by finalizing transactions later in the workflow, created reusable foundations for future development.",
      ],
    },
    {
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
      kind: "insight",
      eyebrow: "takeaways",
      heading: "Measure twice. Cut once.",
      body: [
        "The original request was a tutorial. The real problem was trust. Rather than immediately executing on the proposed solution, I spent time understanding the business, the users, the product vision, and the data. That extra upfront effort allowed me to move quickly with confidence once the problem was clear.",
        "This project reinforced why I believe in house design is so valuable for startups. A designer embedded within the company develops context that external agencies often don't have, understanding product vision, technical constraints, user behavior, and long term roadmap simultaneously. The result isn't just better screens. It's better decisions.",
        "In 15 hours, I was able to identify a retention issue, align a solution with Chance's brand vision, think through implementation constraints, and create reusable foundations for future growth. That's the type of impact I want to continue bringing to Chance as the product scales.",
      ],
    },
    {
      kind: "flag",
      text: "Every image from your export is now placed somewhere in this case study, including the full ~30,000px-wide FigJam audit board — it's downscaled for the page but click-to-zoom still shows the whole thing, so very fine text on it may still be hard to read. If you want a few specific regions cropped out as their own sharper images instead, point me at the sections and I'll do it.",
    },
  ],
};

const chanceDepositFlow: CaseStudyContent = {
  heroLine:
    "I redesigned one of the biggest drop-off points in our purchase funnel. One week after shipping, order volume was up 1.8x.",
  facts: [
    { label: "company", value: "Chance.live" },
    { label: "role", value: "Systems Designer, Product Growth Strategist" },
  ],
  blocks: [
    { kind: "flag", text: "Waiting on the old-flow/new-flow GIFs and a funnel screenshot for this opening section — drop them in and I'll place them right here, above the metrics." },
    { kind: "statement", heading: "People aren't on Chance to deposit money." },
    {
      kind: "story",
      body: [
        "They're here to open Pokémon packs.",
        "But if someone tried to buy a pack without enough money in their account, we sent them through a completely separate deposit flow. They had to leave what they were doing, figure out how much money to add, go through CoinFlow, come back, and try buying the pack again. At minimum, it took 7 clicks.",
      ],
    },
    {
      kind: "insight",
      body: [
        "75% of users who entered CoinFlow dropped off before depositing.",
        "The problem seemed pretty straightforward: people wanted to buy something, and we were making them do a bunch of other stuff first.",
      ],
    },
    {
      kind: "story",
      eyebrow: "research",
      heading: "I started with the funnel, not the modal.",
      body: [
        "I mapped the full transaction from clicking Buy to actually getting USDC into the user's account. That meant learning how CoinFlow, our balance, cryptocurrency transactions, and redemption worked together before deciding what I could remove from the UI.",
      ],
      items: ["deposit conversion", "where people dropped off", "pack purchase behavior", "creator vs. organic traffic", "how much people usually bought", "existing vs. first-time depositors"],
    },
    { kind: "flag", text: "The FigJam funnel visual goes here — send it over and I'll drop it in above the insight below." },
    { kind: "insight", body: ["“Deposit money” usually wasn't the user's actual goal. “Buy this pack” was.", "That changed how I thought about the whole flow."] },
    {
      kind: "story",
      eyebrow: "systems thinking",
      heading: "I had to understand what was actually happening to the money.",
      body: [
        "Before changing the flow, I learned how Chance was carrying transactions through the backend using cryptocurrency.",
        "One of the weirdest parts of the old experience happened after someone had already paid. Users still had to redeem a separate coupon to access their USDC.",
        "If you already understood crypto, maybe that made sense. If you didn't, it felt like we'd introduced an entirely new concept right after asking you for money. I thought that was way too much backend complexity leaking into the product.",
        "So I redesigned redemption into a one-click action that got users to their funds faster without requiring them to understand what was happening underneath.",
      ],
    },
    { kind: "flag", text: "Old redeem flow vs. one-click redeem — send the before/after and I'll place it right after this section." },
    { kind: "statement", heading: "Users shouldn't need to understand our cryptocurrency infrastructure to buy a Pokémon pack." },
    {
      kind: "story",
      eyebrow: "the redesign",
      heading: "What if we just finished what they were already trying to do?",
      body: ["If a pack costs $50 and you have $12, Chance already knows you're $38 short. The old flow basically made you figure that out yourself."],
    },
    { kind: "flowSteps", label: "the old flow", steps: ["Buy", "Deposit", "Choose amount", "Pay", "Return", "Buy again"] },
    { kind: "flowSteps", label: "the new flow", steps: ["Buy", "Add $38", "Pay"] },
    { kind: "ratio", before: "7", beforeLabel: "clicks, minimum, old flow", after: "2", afterLabel: "clicks, new flow" },
    { kind: "story", body: ["The deposit flow stopped feeling like its own feature and became part of buying the pack."] },
    {
      kind: "story",
      eyebrow: "design debate",
      heading: "Fewer clicks wasn't automatically better.",
      body: [
        "We had a lot of disagreements during this project.",
        "One idea was to automatically open the deposit modal for users with a low balance. Technically, that removed friction. I didn't like it.",
        "Someone having $0 in their account doesn't mean they're ready to give us money. They might still be browsing. Popping up a payment flow before they've actually tried to buy something felt annoying and way too aggressive. So we didn't do it.",
        "We also debated whether users should immediately continue with the exact amount they needed or see an amount-selection step first. The shortest version was 2 clicks. The other was 3 clicks, but gave people more control over how much they deposited.",
        "There were reasonable arguments for both, so I didn't want us to pick one based on whoever argued hardest.",
      ],
    },
    { kind: "statement", heading: "We're A/B testing them instead." },
    { kind: "flag", text: "2-click vs. 3-click comparison visual goes here — send it and I'll place it above the validation block below." },
    {
      kind: "validation",
      eyebrow: "validation",
      heading: "Does giving people control over the deposit amount matter more than saving a click?",
      body: [
        "I'm looking at deposit completion first, with average deposit size and purchase completion as guardrails.",
        "The goal isn't just “fewer clicks.” It's figuring out whether that extra decision is actually useful.",
      ],
    },
    {
      kind: "story",
      eyebrow: "process",
      heading: "I also changed how I designed it.",
      body: [
        "By this point, I'd gotten comfortable enough with front-end development and AI coding tools that I didn't need every idea to become a polished Figma prototype first. For interaction-heavy decisions, I could just build them.",
      ],
    },
    { kind: "flowSteps", label: "instead of", steps: ["Idea", "Wireframes", "Prototype", "Meeting", "Revisions", "Handoff"] },
    { kind: "flowSteps", label: "the loop became", steps: ["Idea", "Working prototype", "Use it", "Argue about something real", "Iterate"] },
    { kind: "flag", text: "Prototype/code/final-product visual goes here — send it and I'll place it above the paragraph below." },
    {
      kind: "story",
      body: [
        "This was especially useful here because a lot of our disagreements were about behavior, not visuals. When does the modal appear? What gets prefilled? Where do you land after paying? What happens if you already have some balance? Those are much easier to judge when the thing actually works.",
      ],
    },
    {
      kind: "story",
      eyebrow: "impact",
      heading: "One week later",
      body: [
        "In the week after we shipped the new flow, order volume was 1.8x higher.",
        "It's still early, and there are other things that can affect order volume, so I'm not pretending the redesign alone caused a 1.8x increase. But it's a pretty encouraging first signal.",
        "I'm continuing to watch the funnel and the 2-click vs. 3-click experiment to see what actually sticks.",
      ],
    },
    {
      kind: "insight",
      eyebrow: "takeaways",
      heading: "Users shouldn't have to think about depositing.",
      body: [
        "I went into this thinking the goal was to make depositing easier. I think the better solution was making users think about depositing less in the first place.",
        "They already told us what they wanted when they clicked Buy. The product should do as much as it can from there.",
      ],
    },
    {
      kind: "flag",
      text: "This case study is text-only for now, per your note that you'll attach pics/vids later — I've dropped a flag at every spot a visual belongs (opening GIFs/funnel, FigJam funnel map, redeem flow before/after, 2-click vs. 3-click comparison, prototype/code/final product) so you can see exactly what's missing at a glance. I also don't have an exact date/duration or team size for this project — inferred year 2026 from your other Chance.live work; send the real numbers and I'll fill those in too.",
    },
  ],
};

const ademUserList: CaseStudyContent = {
  heroLine:
    "Streamlined complex ADEM workflows by consolidating scattered information, designing a new user list page empowering IT admins to quickly solve customer issues.",
  heroImage: { src: "/case-studies/adem-user-list/unified-list.webp", alt: "The new unified ADEM User Device List page", width: 1763, height: 980 },
  facts: [
    { label: "company", value: "Palo Alto Networks" },
    { label: "role", value: "Lead Designer + UXR" },
    { label: "team", value: "1 Product Manager, 2 Designers, 14 Engineers" },
    { label: "duration", value: "6 weeks" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "context",
      heading: "Autonomous Digital Experience Management (ADEM) is a visibility platform used by IT teams to understand user network experiences",
      body: [
        "ADEM used to have its own section in Strata Cloud Manager, but after an org-wide shift to platformization, data was now scattered over several pages.",
      ],
    },
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "What's going on with ADEM? Lack of user research and feature bloat caused a misalignment with customer needs",
      body: ["Metrics from Pendo, our product analytics tool, on our primary users — 1st level IT helpdesk admins:"],
      items: [
        "3–6 tabs open while troubleshooting",
        "Monthly users dropped 16% over the past two years",
        "No internal IT admins use ADEM... why?",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/adem-user-list/fragmented-dashboards.webp",
      transparentMedia: true,
      alt: "Three fragmented ADEM dashboards showing application experience, connectivity and user data",
      caption: "the same user data, scattered across three separate dashboards",
      width: 2048,
      height: 1229,
    },
    {
      kind: "image",
      src: "/case-studies/adem-user-list/consolidation-direction.webp",
      transparentMedia: true,
      alt: "The same three dashboards with arrows showing them consolidating into a single Users page",
      caption: "the direction: three dashboards, converging on one page",
      width: 1600,
      height: 960,
    },
    {
      kind: "story",
      eyebrow: "goals",
      items: [
        "Lay foundational groundwork for ADEM information architecture and workflows",
        "Enhance existing pages for clarity",
        "Reduce Mean Time to Resolution (MTTR) for IT tickets",
      ],
    },
    { kind: "statement", heading: "How might we clarify complex ADEM workflows and navigation to significantly improve our customer understanding and troubleshooting efficiency?" },
    {
      kind: "story",
      eyebrow: "user research",
      heading: "Interviewing internal IT admins under time pressure to find pain points and map workflows",
    },
    { kind: "quote", text: "Could you walk me through a recent troubleshooting case you handled? What was the problem?" },
    {
      kind: "image",
      src: "/case-studies/adem-user-list/workflow-map.webp",
      transparentMedia: true,
      alt: "Flowchart mapping an IT admin's troubleshooting workflow from ticket to resolution",
      caption: "mapping the real troubleshooting workflow, ticket to resolution",
      width: 1600,
      height: 323,
    },
    {
      kind: "insight",
      eyebrow: "user interview insight 1",
      heading: "“Way too much going on”",
      body: ["Users felt overwhelmed by the sheer amount of data on the page, a lot of which was irrelevant to their use case and their role."],
    },
    {
      kind: "image",
      src: "/case-studies/adem-user-list/ux-critique.webp",
      transparentMedia: true,
      alt: "Annotated critique of the existing Application Experience page, with sticky notes flagging buried information and unclear charts",
      caption: "auditing the existing page against real troubleshooting workflows",
      width: 849,
      height: 944,
    },
    {
      kind: "insight",
      eyebrow: "user interview insight 2",
      heading: "Using ADEM as a time machine to locate a user at a specific time currently takes 23+ seconds and 8 clicks",
      body: ["The most common use case took the longest time, due to a complex time selection process and a global search that took 7+ seconds to load."],
    },
    {
      kind: "story",
      eyebrow: "solution brainstorming",
      heading: "Redesigning current pages to contextualize data with role-based access control (RBAC)",
      body: [
        "Implement robust RBAC across the existing “Users” and “Application Experience” (and other relevant SCM) pages.",
        "Define specific roles (e.g., IT Ops, Security, Network Admin) to control visibility of new features, filters, columns, and widgets outlined in the PRD, so each role sees only relevant information.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/adem-user-list/redesign-direction.webp",
      alt: "An early redesign direction for the Application Experience page, restructured for role-based clarity",
      caption: "an early redesign direction, before consolidation became the bigger opportunity",
      width: 1100,
      height: 683,
    },
    { kind: "statement", heading: "How might we design a focused, customizable user list with intuitive filtering and relevant experience trends to provide easier access to user data?" },
    {
      kind: "story",
      eyebrow: "the solution",
      heading: "One consolidated User Device List Page",
      body: [
        "I led the end to end design of a new User Device List Page, consolidating multiple workflows into a single, simplified interface, iterating using feedback from design reviews with PM, eng, platform team, and customers.",
      ],
      items: [
        "Streamlined navigation: 7 workflows into 1 page",
        "Restructured information hierarchy for faster scanning",
        "Faster backend due to limited data shown",
        "Designed with AI integrations to reduce manual input and surface insights faster",
        "High-fidelity prototype with interactions and common workflows",
        "Linked to the new page from existing workflows, and designed for edge cases",
      ],
    },
    { kind: "image", src: "/case-studies/adem-user-list/unified-list.webp", alt: "The new unified ADEM User Device List page", caption: "the new user list page", width: 1763, height: 980 },
    {
      kind: "image",
      src: "/case-studies/adem-user-list/saved-views.webp",
      alt: "The User Device List page with a Saved Views panel open, showing pre-filtered views like \"Europe Slack Users\" and \"Poor Asia Users\"",
      caption: "saved views, so admins stop rebuilding the same filters every ticket",
      width: 1800,
      height: 1125,
    },
    { kind: "ratio", before: "7", beforeLabel: "separate workflows", after: "1", afterLabel: "consolidated page" },
    { kind: "ratio", before: "23s", beforeLabel: "to find a user at a point in time", after: "5s", afterLabel: "for the same task, an 80% reduction" },
    {
      kind: "story",
      eyebrow: "impact",
      body: ["This work directly influenced FY26 roadmap decisions."],
    },
    {
      kind: "image",
      src: "/case-studies/adem-user-list/timeline-detail.webp",
      transparentMedia: true,
      alt: "Six week sprint broken into Research & Audit, Requirements & Alignment, Wireframes/IA/User Flows, High-Fidelity Design, Testing & Iteration, and Finalization & Handoff",
      caption: "6 week sprint, july to september",
      width: 2000,
      height: 434,
    },
    {
      kind: "story",
      body: ["Due to confidentiality, not all artifacts are publicly available. Please reach out if you'd like to discuss details of the design process."],
    },
    {
      kind: "flag",
      text: "Updated this with the real numbers, role, and team from your PAN deck (23s→5s user lookup, 7→1 workflows, Lead Designer + UXR, 1 PM/2 designers/14 engineers). I dropped the earlier '8 clicks → 2 clicks, 80% fewer' stat since I couldn't find a verified post-redesign click count anywhere in the deck — if you have that number, send it and I'll add it back in.",
    },
  ],
};

const accessAnalyzer: CaseStudyContent = {
  heroLine: "I redesigned a key diagnostic tool used by IT administrators to troubleshoot user access issues and shipped 22 UX fixes.",
  heroImage: { src: "/case-studies/access-analyzer/query-results.webp", alt: "Access Analyzer query results, showing User & Endpoint, Network, Application, and Security Policy health checks", width: 1089, height: 632, transparentMedia: true },
  facts: [
    { label: "company", value: "Palo Alto Networks" },
    { label: "role", value: "Lead Designer" },
    { label: "team", value: "1 Product Manager, 8 Developers" },
    { label: "duration", value: "6 weeks" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "context",
      body: [
        "Access Analyzer helps IT admins identify why users can't connect to secure networks.",
        "It provides comprehensive results to an IT admin's query.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/access-analyzer/entry-point.webp",
      transparentMedia: true,
      alt: "The Access Analyzer landing page, with a natural-language search bar and example questions",
      caption: "the entry point: ask a question, get a diagnosis",
      width: 1032,
      height: 736,
    },
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "Ambiguous “Unknown” errors, lack of feedback, and rigid search inputs made troubleshooting slow and frustrating",
      body: ["Metrics from Pendo:"],
      items: ["90% drop rate during query creation", "2% retention rate", "73% drop in completion between Mar–Jun 2025"],
    },
    {
      kind: "story",
      eyebrow: "goals",
      items: [
        "Identify pain points in the current UI",
        "Improve customer experience",
        "Differentiate Access Analyzer and SCM CoPilot by providing unique customer value",
      ],
    },
    { kind: "statement", heading: "How might we identify usability issues in the current Access Analyzer UI and refresh the user experience to reduce customer abandonment rates?" },
    {
      kind: "story",
      eyebrow: "problem #1: solving usability issues",
      heading: "Finding 35+ pain points in a UX audit (FigJam)",
      body: [
        "Prioritized fixes with PMs and engineering.",
        "Solution: submitted 14 Jira tickets to tangibly improve 22+ UX and accessibility issues.",
      ],
    },
    {
      kind: "flag",
      text: "Your FigJam UX audit board (35+ pain points) is in the deck but far too dense to read at a legible size on the web — if you have a cleaner summary view, or want me to crop out a few individual annotated screens instead, send those over.",
    },
    {
      kind: "story",
      eyebrow: "user research",
      heading: "What is the troubleshooting workflow of a Network Security Architect at a large enterprise, and what does he think about our product?",
    },
    {
      kind: "insight",
      eyebrow: "user interview feedback 1",
      heading: "Missing data causes “Unknown” status",
      body: [
        "How might we turn ambiguous error messages into clear actionable guidance to build customer trust and accelerate troubleshooting?",
        "Solution: work with the backend engineering team for visibility into why unknown statuses show, and translate them into relevant insights for customers.",
      ],
    },
    {
      kind: "insight",
      eyebrow: "user interview feedback 2",
      heading: "Input is too strict, needs to be more conversational",
      body: [
        "Users expect our AI tools to be smarter, but their trust erodes when simple errors like typos break queries. Currently, Access Analyzer, CoPilot, and all search bars within SCM fail to return results for minor phrasing changes or typos.",
      ],
    },
    { kind: "statement", heading: "How might we make Access Analyzer, CoPilot, and any search query input more conversational and forgiving of human error (like typos), thereby building user trust in our AI and improving troubleshooting efficiency?" },
    {
      kind: "story",
      eyebrow: "research",
      heading: "Auditing NLP search product-wide",
    },
    {
      kind: "story",
      eyebrow: "the solution",
      heading: "Implementing predictive search and “did you mean” functionality for all user queries",
      items: [
        "Users get accurate results faster, reducing wasted time and MTTR (Mean Time to Repair)",
        "Meets user expectations for smart, forgiving interfaces (like Google/ChatGPT), keeping us competitive",
        "Provides immediate value and is a pragmatic step towards a “smarter” diagnostic experience without the higher complexity/risk of generative AI hallucinations",
      ],
    },
    {
      kind: "imagePair",
      images: [
        {
          src: "/case-studies/access-analyzer/current-no-help.webp",
          alt: "Current state: a user types a typo into the search field with no correction offered",
          caption: "current: a typo returns nothing",
          width: 1200,
          height: 750,
        },
        {
          src: "/case-studies/access-analyzer/predictive-search.webp",
          alt: "Future state: predictive search offers a \"did you mean\" suggestion for the same typo",
          caption: "the fix: predictive “did you mean” search",
          width: 1200,
          height: 750,
        },
      ],
    },
    { kind: "ratio", before: "30s", beforeLabel: "to troubleshoot an issue", after: "6s", afterLabel: "for the same task, an 80% reduction" },
    {
      kind: "story",
      eyebrow: "impact",
      body: ["Builds user trust in our AI."],
    },
    {
      kind: "flag",
      text: "Anonymized the user research subject's employer, per your instruction — the deck named a specific company, I generalized it to \"a large enterprise.\" Let me know if you'd rather phrase it differently.",
    },
  ],
};

const aiWorkflowToolkit: CaseStudyContent = {
  heroLine:
    "I designed and built an AI workflow toolkit to help designers test, iterate, and prototype faster. I combined research from my Cognitive Science background with prompt engineering to optimize internal design tools for creativity and speed.",
  heroImage: { src: "/case-studies/ai-workflow-toolkit/personashift.webp", alt: "PersonaShift, an AI tool analyzing a design against a named user persona", width: 550, height: 396, transparentMedia: true },
  facts: [
    { label: "company", value: "Palo Alto Networks" },
    { label: "team", value: "1 UX Director, 1 UX Researcher" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "Designers spent hours manually testing flows and cleaning research data, time that could be used for creativity",
      body: ["Survey conducted:"],
      items: ["55%: AI saves them less than 3 hours a week", "Main tools used: Gemini, NotebookLM", "75% unfamiliar with Figma Make"],
    },
    { kind: "statement", heading: "How might we empower our design team with intelligent tools to elevate their focus on innovation and reduce time spent on repetitive tasks?" },
    {
      kind: "story",
      eyebrow: "the solution",
      heading: "Vibe-coding an AI tool for synthetic user testing early in the design cycle and validating it with real user feedback",
    },
    {
      kind: "image",
      src: "/case-studies/ai-workflow-toolkit/personashift.webp",
      transparentMedia: true,
      alt: "PersonaShift, an AI tool analyzing a design against a named user persona",
      caption: "PersonaShift: AI-generated persona feedback on a design, before it reaches real users",
      width: 550,
      height: 396,
    },
    {
      kind: "story",
      eyebrow: "guidelines",
      heading: "Creating user-friendly guidelines for each tool and use case in my AI workflow toolkit",
    },
    {
      kind: "story",
      eyebrow: "impact",
      items: [
        "80% of designers on my team incorporated Figma Make and NotebookLM in their workflow",
        "36× faster synthetic user testing with my tool",
      ],
    },
    {
      kind: "flag",
      text: "Your deck doesn't list a role title or a timeline for this one (just team: 1 UX Director, 1 UX Researcher). I put a placeholder role of \"Product Designer\" in the nav/header since the page needs something there — let me know the real title and duration and I'll swap them in.",
    },
  ],
};

const carInsurance: CaseStudyContent = {
  heroLine: "Turning 200+ inconsistent pages into a scalable design foundation that improved conversions, increased organic traffic, and changed how the team shipped product.",
  heroImage: { src: "/case-studies/carinsurance-com/atomic-design-ladder.webp", alt: "Atomic Design ladder: Sub Atomic, Atoms, Molecules, Organisms, Templates, and Pages, each shown with real UI", width: 1600, height: 778, transparentMedia: true },
  facts: [
    { label: "company", value: "QuinStreet" },
    { label: "role", value: "Product Designer" },
    { label: "team", value: "1 product manager, 1 director, 6 engineers" },
    { label: "duration", value: "12 weeks, June to September 2024" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "context",
      heading: "Twenty years of growth created twenty years of design debt",
      body: [
        "When I joined QuinStreet, CarInsurance.com had over 200 pages, dozens of calculators, and no shared design system. The site had evolved over two decades through incremental updates, business requests, and content expansion. Individual pages had been improved, but the overall experience had never been systematically redesigned.",
        "The symptoms showed up everywhere: inconsistent UI patterns, poor mobile experiences, accessibility issues, declining engagement metrics, and slow design and development workflows. I was hired for the summer to redesign CarInsurance.com.",
      ],
    },
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "Every page solved the same problem differently",
      body: [
        "As I explored the product, I realized most of the issues users experienced weren't isolated. A calculator looked different from an article page. One CTA behaved differently from another. Content hierarchy changed from page to page. Trust indicators appeared inconsistently. Mobile layouts followed different rules. The product felt fragmented because it was fragmented.",
        "Designers and developers faced the same issue. Building new experiences often meant recreating patterns that already existed elsewhere on the site. The more I looked, the clearer the root cause became: CarInsurance.com didn't have a page problem. It had a systems problem.",
      ],
    },
    {
      kind: "story",
      eyebrow: "opportunity",
      heading: "Redesigning the product and the process at the same time",
      body: [
        "Initially, I thought this project would be a traditional website redesign. After a week of auditing the product, I realized that redesigning 200+ pages individually would only treat the symptoms. The bigger opportunity was creating a system that could improve every page simultaneously.",
        "That meant solving two problems in parallel: redesign the highest impact user experiences, and build the design infrastructure needed to scale future work.",
      ],
    },
    {
      kind: "story",
      eyebrow: "the solution",
      heading: "CarInsurance.com's first ever design system",
      body: [
        "I designed CarInsurance.com's first ever design system, built from the ground up using Atomic Design principles. My goal was to bring organization and scalability to the site's structure, ensuring consistency across the many pages. This design system helped developers and future designers easily maintain and build new pages through reusable components.",
      ],
    },
    {
      kind: "story",
      eyebrow: "process, ux audit",
      heading: "Finding 150+ opportunities for growth through a UX audit",
      body: [
        "Before designing anything, I conducted a comprehensive UX audit across the platform. I reviewed more than 200 pages, mapped recurring patterns, analyzed conversion flows, evaluated competitors, reviewed analytics, and spoke directly with users.",
      ],
    },
    {
      kind: "story",
      eyebrow: "competitive research",
      heading: "Why did other sites with the exact same information perform much better?",
      body: [
        "I compared the site with competitors like Insure.com, The Zebra, Marketwatch, and Allstate to figure out what users valued in the industry. I focused on key metrics such as usability, information clarity, mobile optimization, and accessibility.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/competitor-audit.webp",
      transparentMedia: true,
      alt: "A competitor UI pattern audit, annotating design choices across several insurance and finance sites",
      caption: "auditing competitor UI patterns, not just their content",
      width: 2000,
      height: 1793,
    },
    {
      kind: "story",
      eyebrow: "user research",
      heading: "Understanding where users were getting stuck",
      body: ["I complemented the audit with user interviews and usability testing. A few patterns emerged quickly."],
      items: [
        "Inconsistency in design was distracting: users said the website felt untrustworthy and unprofessional. Lack of consistency in branding reduced trust in the website, pushing users to competitor sites.",
        "Too “text heavy”: users felt the site was overwhelmed by the dense amount of information presented without a clear hierarchy. They often scrolled past large blocks of text, and preferred to scan articles.",
        "Calculators had usability issues, especially on mobile: many users mentioned they abandoned calculators midway due to long and complicated forms. Due to a lack of mobile optimization, calculators took up multiple screens.",
      ],
    },
    {
      kind: "story",
      eyebrow: "product strategy",
      heading: "Convincing the team to stop redesigning pages",
      body: [
        "After the UX audit, it became clear that redesigning individual pages wouldn't solve the underlying problem. The site had accumulated over 20 years of inconsistencies. If I redesigned pages one at a time, we'd end up with a better looking website but the same scalability issues.",
        "The challenge was that a design system wasn't part of the original ask. The expectation was to redesign high priority pages. Building a system first would require additional upfront investment, and there was understandable concern about slowing down delivery. To make the case, I mapped recurring patterns across the site and showed how the same UI elements were being rebuilt dozens of times.",
        "I proposed a different approach: instead of redesigning 200+ pages, redesign the building blocks that create those pages. After aligning with product, engineering, and leadership, we shifted from a page first redesign to a systems first approach. The result was CarInsurance.com's first design system.",
      ],
      items: [
        "Improve consistency across the entire site",
        "Accelerate future design and development work",
        "Reduce maintenance costs",
        "Create a shared language between design and engineering",
        "Scale future features without redesigning from scratch",
      ],
    },
    {
      kind: "consolidation",
      fromLabel: "Rebuilt dozens of times, page by page",
      from: ["Navigation", "Comparison tables", "Calculators", "Trust elements", "Author modules", "Content layouts"],
      to: "Design system",
      toLabel: "How I applied Atomic Design (Brad Frost): sub-atomic style guide, atoms, molecules, organisms, and templates that update automatically when the system changes.",
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/type-scale.webp",
      transparentMedia: true,
      alt: "Desktop and mobile type scale, from Heading 1 down to Subtitle Regular, with exact sizes and line heights",
      caption: "one of the atoms: a type scale that holds up from a 48px desktop H1 down to 12px mobile subtitle text",
      width: 1400,
      height: 739,
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/color-palette.webp",
      transparentMedia: true,
      alt: "The design system's color palette: Primary, Neutral, and Accent groups with hex, rgb, and hsl values",
      caption: "another atom: the primary, neutral, and accent color system",
      width: 1190,
      height: 1441,
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/component-variants.webp",
      transparentMedia: true,
      alt: "A sheet of component variants: buttons, toggles, dropdowns, tables, and star ratings at multiple sizes and states",
      caption: "component variants — every size and state, defined once",
      width: 1800,
      height: 753,
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/atomic-system.webp",
      transparentMedia: true,
      alt: "A dense sheet of CarInsurance.com UI components and page explorations",
      caption: "a slice of the 670+ component library this system grew into",
      width: 2048,
      height: 1035,
    },
    {
      kind: "flag",
      text: "Swapped the hero/thumbnail image — the old one (now shown above, mid-article) is real but too dense to read at thumbnail size. The Atomic Design ladder diagram reads clearly at any size and says what the project actually did, so it's the new hero.",
    },
    {
      kind: "story",
      eyebrow: "redesigning core experiences",
      heading: "Redesigning 10 multi step insurance calculators",
      body: [
        "The calculators were some of the highest value experiences on the site, but also some of the most frustrating. User interviews consistently surfaced abandonment, especially on mobile. One example was the Moving Calculator. The original flow relied on incomplete logic, failed to account for important variables that affect insurance rates, and forced users through a lengthy experience with little feedback.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/calculator-example.webp",
      transparentMedia: true,
      alt: "A redesigned \"will my insurance go up if I move\" calculator, with rate comparisons by ZIP code",
      caption: "one of the redesigned calculators — real numbers, clear comparisons",
      width: 760,
      height: 1172,
    },
    {
      kind: "story",
      eyebrow: "iteration",
      heading: "Designing, testing, and re-re-redesigning",
      body: [
        "Nothing shipped untouched. After building prototypes using the new system, I ran six rounds of usability testing. Some ideas performed exactly as expected. Others didn't. Several components went through multiple redesigns as I balanced user feedback, SEO requirements, monetization goals, and editorial needs. One of the biggest lessons from this project was that good design isn't protecting your first idea.",
      ],
      items: [
        "Users often scrolled past text heavy sections, so I redesigned lower performing elements, such as FAQs and Conversations with Experts, to encourage interaction and break up blocks of text.",
        "Infographics over tables: users showed a preference for summarized information over lengthy tables, so I designed a new element, Product Cards, that provide a concise summary of insurance company information.",
        "Building user trust: I created elements that emphasized qualifications and methodology.",
      ],
    },
    {
      kind: "imagePair",
      images: [
        {
          src: "/case-studies/carinsurance-com/expert-quotes-redesign.webp",
          transparentMedia: true,
          alt: "Before and after of the expert-quotes module, from a plain accordion to a selectable expert-tip card",
          caption: "before → after: expert quotes, redesigned",
          width: 1751,
          height: 958,
        },
        {
          src: "/case-studies/carinsurance-com/review-page-redesign.webp",
          transparentMedia: true,
          alt: "Before and after of a company review page, from plain text to a scored, structured review layout",
          caption: "before → after: company reviews, redesigned",
          width: 1796,
          height: 1083,
        },
      ],
    },
    {
      kind: "story",
      eyebrow: "meeting our business needs",
      heading: "Balancing editorial, SEO, and monetization goals",
      body: [
        "I often met with the Product Manager of CarInsurance.com to align the redesign with the needs of the editing team, development team, and monetization goals.",
      ],
      items: [
        "Editors deserved more credit for their work: articles often have multiple authors and collaborators, so I added the option to view multiple authors without using up too much real estate.",
        "The redesigned “Learn More” widget was overly prominent and diverted users from the page. I simplified it to align better with user experience goals while still meeting SEO requirements.",
        "To attract more visitors, I created templates for a series of eye catching, sharable infographics that could be integrated into the site and drive traffic to CarInsurance.com.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/article-team-redesign.webp",
      transparentMedia: true,
      alt: "Before and after of the article byline module, from a single author to a full, credited Article Team list",
      caption: "before → after: giving editors and contributors real credit",
      width: 1790,
      height: 845,
    },
    {
      kind: "story",
      eyebrow: "implementation",
      heading: "Making the system usable beyond the redesign",
      body: [
        "A design system only creates value if people actually use it. To support adoption, I documented components, templates, responsive behavior, and implementation guidelines so engineers and future designers could build consistently without reinventing patterns. I worked closely with developers throughout implementation to ensure the system translated cleanly into production.",
        "This was also where I partnered with product and business stakeholders to balance user experience with monetization goals. Through A/B testing and iteration, I refined high impact elements such as CTAs, comparison modules, product cards, and lead generation flows.",
      ],
    },
    {
      kind: "story",
      eyebrow: "deliverables",
      heading: "More than CarInsurance.com's first design system",
      items: [
        "670+ reusable desktop and mobile components",
        "10 page templates covering the site's most common experiences",
        "10 redesigned insurance calculators",
        "Documentation and implementation guidelines for design and engineering teams",
        "150+ UX opportunities identified through audit and research",
        "A branding guideline",
      ],
    },
    {
      kind: "story",
      eyebrow: "impact",
      heading: "Creating a foundation that could scale",
      body: ["The redesign improved the user experience immediately, but the larger impact was giving the organization a repeatable system for future growth."],
      items: [
        "13% increase in organic traffic: improved information architecture, accessibility, and page consistency made content easier for both users and search engines to navigate.",
        "18% increase in insurance quote requests: reducing friction across calculators and conversion flows led to higher engagement in key business funnels.",
        "98% faster page creation: future designers could assemble new experiences using existing components rather than designing from scratch.",
      ],
    },
    { kind: "quote", text: "In my six years here, this is the smoothest design-to-development handoff we've ever done." },
    { kind: "flag", text: "That quote has no name attached in your source, who said it, and can I attribute it (e.g. their role/title)?" },
    { kind: "story", body: ["The design system also established a shared language between design and engineering, reducing implementation ambiguity and accelerating future product work."] },
    { kind: "flag", text: "I matched one real image (the component/audit sheet) to this case study by file size, not by its original position in the page. The 'original vs. redesigned calculator' and 'competitor comparison' images referenced in your text weren't uniquely identifiable from the export, send the specific screenshots if you want them placed precisely." },
  ],
};

const internshipWrapped: CaseStudyContent = {
  heroLine: "A two-day animated data storytelling project summarizing my design journey at Palo Alto Networks.",
  heroImage: {
    src: "/case-studies/internship-wrapped/cover.webp",
    alt: "My Summer at Palo Alto Networks, By the Numbers, title slide",
    width: 2048,
    height: 1456,
    // Title block sits vertically centered in the source frame — a "top"
    // crop at thumbnail size chopped the "By the Numbers" line clean off.
    focus: "center",
  },
  facts: [
    { label: "company", value: "Palo Alto Networks" },
    { label: "role", value: "Product Design Intern" },
    { label: "expertise", value: "Visual design, storytelling" },
    { label: "duration", value: "2 days" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "As my internship wrapped up, I wanted to share my impact and learnings in a way that resonated with my team",
      body: ["Something more meaningful than a handoff doc or static slide deck."],
      items: [
        "Communicate the value and outcomes of my summer projects",
        "Entertain and celebrate our team's achievements",
        "Reflect my visual design, storytelling, and quantitative thinking",
      ],
    },
    {
      kind: "story",
      eyebrow: "the solution",
      heading: "Internship Wrapped, inspired by Spotify Wrapped",
      body: [
        "I created Internship Wrapped, an animated internal presentation showcasing metrics, visuals, and stories from my internship. It summarized my work across multiple projects (design systems, AI testing tools, enterprise dashboards) and tied them back to company goals around efficiency, adoption, and scalability.",
      ],
    },
    { kind: "flag", text: "Your source page has a “Check out the presentation!” link, the actual video or slide embed wasn't in what you sent. Send that link/file and I'll embed it here instead of the static cover image." },
    {
      kind: "story",
      eyebrow: "impact",
      heading: "Viewed by 50+ teammates across design, PM, engineering, and leadership",
      body: [
        "The presentation helped visualize how our design work directly supported company OKRs. It reinforced my reputation as a creative, data-informed storyteller who connects pixels to purpose.",
      ],
    },
    {
      kind: "insight",
      eyebrow: "takeaways",
      body: [
        "I learned that great design storytelling balances data with emotion. Metrics only matter when they tie back to shared goals. Visual communication can turn internal wins into something collective, memorable, and inspiring.",
      ],
    },
  ],
};

const beyond: CaseStudyContent = {
  heroLine: "Beyond is a career exploration platform designed for people who don't have the same access to opportunities, mentors, or professional networks as their peers. Built during Boston University's Catalyst Designathon, Beyond won an Honorable Mention out of 87 teams.",
  heroImage: {
    // The full export is an 8-screen, two-row contact sheet — cropped to a
    // wide thumbnail box it sliced clean through both rows. Row 1 alone
    // (onboarding through create-account) is a real single-row montage
    // that covers cleanly at any of the work-index aspect ratios.
    src: "/case-studies/beyond/screens-row1.webp",
    transparentMedia: true,
    alt: "Beyond app screens: onboarding, login, and create account",
    width: 2048,
    height: 800,
  },
  facts: [
    { label: "designathon", value: "Catalyst, Boston University" },
    { label: "role", value: "UX Designer" },
    { label: "team", value: "3 UX designers" },
    { label: "duration", value: "2 days, March 2024" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "background",
      heading: "Catalyst is a two-day designathon centered around accessibility and inclusive design",
      body: [
        "Our prompt was: through digital tools, how can we aim to make experiences and services more accessible to others?",
        "As someone who spent years figuring out my own career path, this question immediately resonated with me. Growing up, I often felt like everyone else had access to information I didn't. They knew what jobs existed, what opportunities to pursue, and what steps to take next. I didn't lack ambition. I lacked exposure. The more I talked to friends, classmates, and other students, the more I realized this wasn't a unique experience. My team decided to explore that gap.",
      ],
    },
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "Finding a career shouldn't depend on who you know",
      body: [
        "When people talk about career development, they usually focus on resumes, networking, internships, and job applications. Our research pointed to a much earlier problem. Many people never make it that far.",
        "They don't know what careers exist. They don't understand how different majors translate into real jobs. They don't have mentors to guide them. They feel pressure from family expectations, financial realities, and cultural norms.",
        "Most importantly, they don't have a clear path forward. For underrepresented students, access to opportunities often depends on who happens to be in their network. If nobody around you works in a particular field, it's difficult to imagine yourself there. That creates a cycle where opportunities remain hidden from the people who could benefit from them most.",
      ],
    },
    { kind: "statement", heading: "How might we help people find direction when they don't know what they don't know?" },
    {
      kind: "story",
      body: [
        "The internet isn't lacking information. If anything, there's too much of it. The challenge isn't finding resources. It's finding the right resources at the right time, presented in a way that feels approachable rather than overwhelming.",
        "We saw an opportunity to create a platform that combines career exploration, education, mentorship, community, and events into a single experience. Instead of asking users to jump between LinkedIn, Coursera, Discord communities, job boards, and university websites, what if we could bring those experiences together in one place?",
      ],
    },
    {
      kind: "story",
      eyebrow: "the solution",
      heading: "A platform to help people discover opportunities they may never have otherwise encountered",
      body: [
        "The platform connects users based on their interests, goals, and skills while surfacing personalized resources, events, certifications, and career pathways. Rather than asking users what job they want, Beyond helps them answer a more fundamental question: what's possible for me?",
        "Whether someone is a high school student exploring careers for the first time, a college student looking for direction, or a professional considering a career change, Beyond provides a supportive environment to learn, connect, and grow.",
      ],
    },
    { kind: "youtube", id: "vXNB0LHcTrA", caption: "Beyond — video demo" },
    {
      kind: "story",
      eyebrow: "survey",
      heading: "128 students helped us understand where people get stuck",
      body: [
        "To learn more about our users' specific needs, we sent out a survey with 7 demographic questions, 9 multiple choice questions, and 1 free response. We gathered 128 responses from students.",
      ],
      items: [
        "71% faced challenges in accessing career opportunities or higher education",
        "34% didn't feel like they had clear academic or career goals in life",
      ],
    },
    {
      kind: "story",
      eyebrow: "pain points",
      heading: "Users didn't know where to start",
      body: ["I used affinity mapping to sort 107 free responses surrounding purpose to identify key user pain points that prevented them from reaching their true potential."],
      items: [
        "Lack of exposure to career options and opportunities: many individuals struggle to find their purpose due to insufficient exposure to various career paths and hands-on experiences.",
        "Lack of guidance and support from family, friends, or mentors: the absence of emotional, financial, or informational support makes it challenging for individuals to explore and commit to their passions.",
        "Pressure and constraints from social expectations: tools should facilitate exploration, provide structured pathways, and offer emotional support to empower users in overcoming barriers.",
      ],
    },
    { kind: "quote", text: "I don't know what I don't know; one advantage of uni is being able to give you a syllabus to follow to explore an interest and its related fields.", attribution: "survey respondent" },
    { kind: "quote", text: "There is a huge pressure to be successful (especially in the Bay Area), which really limits your career choices and goals.", attribution: "survey respondent" },
    {
      kind: "story",
      eyebrow: "user personas",
      heading: "Designing for people at different stages of self-discovery",
      body: ["After looking at the survey demographics and insights, we decided to cater the app towards 4 main groups of users."],
    },
    { kind: "image", src: "/case-studies/beyond/personas.webp", alt: "Four user personas: Chun Ho Li, Carissa White, Maria Gonzalez, and Jessica Thompson", caption: "Four user personas built from the survey and affinity mapping", width: 1843, height: 2048, transparentMedia: true },
    {
      kind: "story",
      eyebrow: "market research",
      heading: "Most platforms solve one piece of the puzzle",
      body: [
        "We reviewed 11 products across three categories: career platforms, learning platforms, and community/event platforms. Career platforms like LinkedIn, Handshake, Indeed, and Blind help users find jobs and build professional networks. Learning platforms like Coursera, Khan Academy, Udemy, and edX help users develop skills and earn certifications. Community platforms like Reddit, Discord, Meetup, and Eventbrite help people connect with others and discover events.",
        "Each category does one thing well, but none address the full journey of someone who is still figuring out what they want to do. Many career platforms assume users already know their interests. Learning platforms assume users know what skills they want to develop. Community platforms assume users already know where to find their people. Our research suggested the opposite: many users were struggling because they didn't know what opportunities existed in the first place.",
      ],
    },
    {
      kind: "insight",
      eyebrow: "the gap",
      body: [
        "Existing platforms help people take the next step. We wanted to help people discover what the next step should be. Beyond combines career exploration, learning, mentorship, networking, and event discovery into a single experience designed for people who are still finding their direction.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/beyond/user-flow.webp",
      transparentMedia: true,
      alt: "User flow diagram mapping onboarding, industry exploration, the connect page, and the profile page",
      caption: "the user flow, mapping key features and screens before we designed them",
      width: 1400,
      height: 1976,
    },
    {
      kind: "story",
      eyebrow: "features",
      heading: "Allowing users to explore and act",
      items: [
        "Onboarding and skill assessment",
        "Explore jobs and industries, find relevant trainings and certifications",
        "A personalized profile page",
        "Connect with other users",
      ],
    },
    {
      kind: "imagePair",
      images: [
        {
          src: "/case-studies/beyond/explore-jobs-screens.webp",
          transparentMedia: true,
          alt: "Explore Industries, Technology & Software, IT Project Managers, and Find Certificates screens",
          caption: "explore jobs and industries, down to specific salary ranges and certifications",
          width: 1400,
          height: 521,
        },
        {
          src: "/case-studies/beyond/profile-connect-screens.webp",
          transparentMedia: true,
          alt: "Profile and connect screens, shown in both English and Bahasa Indonesia",
          caption: "profile and connect, localized — accessibility was part of the brief",
          width: 1400,
          height: 522,
        },
      ],
    },
    {
      kind: "flag",
      text: "I used the clearest artifacts from your export — the user flow diagram and two feature-screen montages. I skipped a duplicate re-export of the persona sheet already shown above, and a set of generic competitor-logo thumbnails from the market research slide that didn't add anything beyond the text already here.",
    },
    {
      kind: "insight",
      eyebrow: "takeaways",
      heading: "Exposure is a privilege",
      body: [
        "Many career products assume users already know what they're interested in. Our research suggested the opposite. People often struggle because they haven't been exposed to enough possibilities to make informed decisions.",
        "Accessibility extends beyond physical and technical accessibility. Access to information, mentorship, and opportunity can be just as important. In only two days, our team designed a solution that earned an Honorable Mention out of 87 participants, but more importantly, it challenged how I think about accessibility. Sometimes the most impactful thing a product can do is help someone imagine a future they didn't know existed.",
      ],
    },
  ],
};

// Unlisted: your Chance Creators source material says "This case study is
// private and an on-going project. Please do not share beyond the intended
// audience." Built at your request so you have the page, but not linked
// from the Work index, nav, or the case-study "next" cycle. See the flag
// at the end for the two images I left out of even this unlisted page.
const chanceCreators: CaseStudyContent = {
  heroLine:
    "Building a creator operating system from scratch. Turning a vague creator growth initiative into a connected ecosystem for discovery, commerce, fulfillment, and community.",
  facts: [
    { label: "company", value: "Chance.live" },
    { label: "role", value: "Systems Designer, Product Growth Strategist" },
    { label: "team", value: "Front-end Developer, 12 person company" },
    { label: "duration", value: "1 week, July 2026" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "context",
      heading: "Chance.live is building a more social future for trading card collecting",
      body: [
        "Chance.live is a Series A startup reimagining how people buy, open, collect, and trade Pokémon cards online. What excited me about Chance wasn't just building another TCG marketplace (there are already plenty). It was the opportunity to redesign the experience around the thing collectors actually love: the community, anticipation, and shared moments behind every pull. The cards were the product, but the experience around them was the opportunity.",
        "A major part of that vision was creators. Today, Chance works with dozens of trading card creators and livestreamers who introduce new collectors to the platform. These creators are the community layer of the product. They entertain, educate, build trust, and create the moments that make collecting exciting.",
      ],
    },
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "A creator ecosystem existed, but the infrastructure didn't",
      body: [
        "Chance had built strong relationships with creators, but the experience powering creator sales was held together by disconnected tools, manual workflows, and constant coordination from a small team.",
      ],
    },
    {
      kind: "flowSteps",
      label: "creator experience",
      steps: [
        "Promote Chance packs on stream",
        "Send viewers to external checkout",
        "Monitor Shopify orders",
        "Copy purchases into spreadsheet",
        "Match buyers to packs manually",
        "Track queue order manually",
        "Open packs during stream",
        "Record pulls",
        "Manually send cards to buyers",
      ],
    },
    {
      kind: "story",
      body: [
        "Creators joined Chance because they were good at building communities and entertaining collectors. However, selling packs required them to become operators. The workflow worked at a small scale, but every additional order increased operational complexity.",
      ],
    },
    {
      kind: "flowSteps",
      label: "buyer experience",
      steps: [
        "Discover creator",
        "Watch creator livestream",
        "Click creator link / Shopify store",
        "Purchase pack separately",
        "Send payment confirmation",
        "Wait",
        "Creator manually tracks order",
        "Wait",
        "Watch stream to see if your pack opens",
        "Creator manually fulfills cards",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/chance-creators/livestream-reveal.webp",
      alt: "A livestream capture of a card reveal moment, with live chat alongside",
      caption: "the moment buyers actually tune in for — disconnected from the purchase that led to it",
      width: 1394,
      height: 782,
    },
    {
      kind: "story",
      body: [
        "The excitement of Chance came from watching a creator open packs live. However, the purchasing experience was disconnected from that moment. After checkout, buyers often had no visibility into their order. The most exciting part of the product happened after the transaction, but the product experience stopped at checkout.",
      ],
    },
    {
      kind: "flowSteps",
      label: "chance team experience",
      steps: [
        "Recruit creators",
        "Create referral links manually",
        "Answer creator questions",
        "Track creator performance manually",
        "Troubleshoot missing orders",
        "Coordinate fulfillment issues",
      ],
    },
    {
      kind: "story",
      body: [
        "Internally, we faced another challenge. Creators were one of our primary growth channels, but there was very little visibility into creator performance. Many creators didn't know where to find their referral links, how many users they were bringing to the platform, or how their audiences were converting. As a result, the team spent a significant amount of time manually answering questions, tracking referrals, and helping creators understand their impact. What should have been a scalable growth engine required constant hands-on support.",
      ],
    },
    {
      kind: "story",
      eyebrow: "the opportunity",
      heading: "Reinventing the trading card experience around community, not transactions",
      body: [
        "Traditional trading card platforms are optimized around transactions: buy a product, receive a product, repeat. But the excitement of collecting has never just been the card itself. It's the anticipation of opening a pack, sharing a rare pull with friends, watching someone else experience a big moment, and being part of a community that understands the hobby.",
        "Our north star was building a more connected version of the trading card ecosystem. This changed how I approached the product. Instead of asking, \"How do we add a creator page?\" I started asking:",
      ],
      items: [
        "How do we make creators the center of the collecting experience?",
        "How do we turn a livestream into an interactive community moment?",
        "How do we create tools that help creators grow while making collecting more social for buyers?",
        "How do we build infrastructure that allows this ecosystem to scale?",
      ],
    },
    {
      kind: "story",
      eyebrow: "my role",
      heading: "Turning ambiguity into something the team could build",
      body: [
        "The more questions I asked, the more the project shifted from UI design into product design. This is usually the part of design I enjoy most: figuring out what a product should be before figuring out what it should look like.",
        "Before opening Figma, I try to understand the entire system around the feature: who is using it, what problem it solves, what technical constraints exist, and whether it should exist at all. My first steps are usually not visual. I map flows, talk to users and stakeholders, research competitors, understand the frontend and backend constraints, and identify where confusion or friction might appear before we build. I think of it as measuring twice and cutting once. Once the underlying system makes sense, the interface becomes much easier to design.",
        "On any given day I'm:",
      ],
      items: [
        "Mapping user flows, edge cases, and product architecture in FigJam",
        "Talking with creators, watching livestreams, and observing how people use the product",
        "Designing flows and systems in Figma while building reusable components as we go",
        "Vibe-coding prototypes in Figma Make to test ideas quickly",
        "Presenting prototypes to founders and engineers to align around a north star",
        "Reviewing analytics, finding bugs, and identifying opportunities to improve the product",
        "Working through our React frontend/backend constraints to make sure designs are actually buildable",
        "Experimenting with sound design in Reaper because I believe small sensory details can make digital experiences feel more alive",
      ],
    },
    {
      kind: "story",
      body: [
        "The fun (and challenging) part of startup design is the constant context switching. One hour I'm mapping information architecture with engineering, the next I'm testing a prototype, watching a creator livestream, or motion-designing to make an interaction feel more magical. I don't see design as a handoff after decisions are made. I see it as the process of helping a team make better decisions.",
      ],
    },
    {
      kind: "story",
      eyebrow: "process",
      heading: "Finding flaws before they become expensive",
      body: [
        "In several conversations with product and engineering, the fastest solution was not always the best long-term solution. My role became advocating for the user experience while understanding the constraints that made certain decisions difficult. The first version of the ecosystem had several assumptions built into it. I pressure-tested them before we committed engineering resources.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/chance-creators/initial-flow.webp",
      transparentMedia: true,
      alt: "Initial user flow, one of many flow charts, with sticky-note annotations flagging UX issues",
      caption: "initial user flow, one of many flow charts",
      width: 1600,
      height: 729,
    },
    {
      kind: "insight",
      eyebrow: "issue 1",
      heading: "One URL serving two completely different audiences",
      body: [
        "The initial direction combined buyer experiences and creator management into the same space. This created confusing states around permissions, navigation, and user intent. I pushed for separating the consumer experience from creator tooling so each side could be optimized for its actual user.",
      ],
    },
    {
      kind: "insight",
      eyebrow: "issue 2",
      heading: "Creator tools appearing where audiences could see them",
      body: [
        "Because creators stream through OBS, anything placed inside the streaming experience could accidentally become public. I challenged the assumption that creator controls belonged directly on the streamed page and proposed moving operational tools into a separate private experience.",
      ],
    },
    {
      kind: "story",
      eyebrow: "issue 3",
      heading: "Designing for real behavior, not ideal behavior",
      body: ["The original assumptions treated creators only as creators. But creators are also collectors. I raised edge cases like:"],
      items: [
        "What happens if Creator A wants to buy packs from Creator B?",
        "What happens if a creator is logged in but wants a buyer experience?",
        "How do we prevent role confusion?",
      ],
    },
    {
      kind: "insight",
      eyebrow: "issue 4",
      heading: "Potential legal ramifications",
      body: [
        "After talking to our lawyer, I realized that some of the feature ideas we had could potentially create serious legal issues (fintech is a highly regulated space). For example, we had this absolutely brilliant idea to ███████████████████████████. Not only that, we also wanted to ███████████████████████. Later on, we had this absolute stroke of genius. What if we ███████████████████████████████? At this point, we were pretty sure we had invented the future of collecting. We were already mentally spending our imaginary Series B money.",
        "Obviously, none of that should ever make it to prod.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/chance-creators/current-flow.webp",
      transparentMedia: true,
      alt: "Current user flow as of July 27th, 2026, split into buyer side and creator side",
      caption: "current user flow, as of july 27th, 2026",
      width: 1600,
      height: 1155,
    },
    {
      kind: "story",
      eyebrow: "product thinking",
      heading: "Building five products that work as one",
      body: ["Five connected experiences, each serving a different purpose."],
      items: [
        "Creator Discovery — help users discover creators, browse live streams, and decide who to watch",
        "Creator Storefront — turn viewers into customers through live shopping, pack purchases, and order tracking",
        "Creator Queue — the operational side that allows creators to manage purchases, process orders, and fulfill pulls without disrupting their stream",
        "Creator Dashboard — give creators visibility into referrals, payouts, campaigns, and business performance",
        "Community Dashboard — help creators understand and celebrate their community through collection insights, milestones, and audience engagement",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/chance-creators/creator-dashboard.webp",
      transparentMedia: true,
      alt: "Creator dashboard showing referral GMV, cash payout balance, and a live order queue, layered over a pack-opening screen",
      caption: "the dashboard, order queue, and pack-opening screen this architecture had to connect",
      width: 1800,
      height: 1165,
    },
    {
      kind: "story",
      eyebrow: "systems thinking",
      heading: "Building the foundation while shipping",
      body: [
        "One challenge of being the first designer at a startup is that there is no existing foundation. When I started introducing reusable components and design patterns, the natural concern was: \"Do we have time to build a design system right now?\" My perspective was that a design system wasn't slowing us down. It was how we moved faster.",
        "So, while defining the creator ecosystem, I was also building the foundations that would allow it to scale. As new experiences emerged, I created reusable components, interaction patterns, and design decisions that could support future creator tools without reinventing every screen.",
        "For me, a design system is a way to make better decisions faster. It creates consistency for users, reduces ambiguity for engineers, and allows a small team to move quickly without sacrificing quality.",
      ],
    },
    {
      kind: "story",
      eyebrow: "vibe-coding as a design tool",
      heading: "The fastest wireframe is a working product",
      body: [
        "One of the biggest shifts in my design process has been realizing that sometimes the best way to explore an idea is to build it. Instead of debating abstract concepts in meetings, I build lightweight prototypes that give everyone something tangible to react to.",
      ],
    },
    { kind: "flowSteps", label: "instead of", steps: ["Idea", "Wireframe", "Mockup", "Prototype", "Test"] },
    { kind: "flowSteps", label: "the feedback loop becomes", steps: ["Idea", "Prototype", "Test", "Iterate"] },
    {
      kind: "story",
      body: [
        "For startup environments where speed matters, this has been incredibly valuable. Vibe-coding has become a core part of how I think through product problems. Instead of spending hours perfecting a Figma prototype for a concept that might change, I use AI coding tools to quickly create functional prototypes, test assumptions, and communicate ideas with engineers and founders. AI helps me move faster, but it doesn't replace product judgment. The valuable part isn't generating code. It's knowing what questions to ask, what tradeoffs matter, and what should exist in the first place.",
      ],
    },
    {
      kind: "story",
      eyebrow: "prioritization",
      heading: "Deciding what not to build",
      body: [
        "The hardest part of startup design is rarely coming up with ideas. It's deciding which ideas deserve engineering time. Throughout this project, we explored many possible directions:",
      ],
      items: ["Creator analytics", "Social systems", "Loyalty mechanics", "Better queue management", "Collection sharing", "Stream interactions", "Advanced notifications"],
    },
    {
      kind: "story",
      body: [
        "The challenge is determining what creates the most value today. Every feature competes against engineering resources, timelines, and business priorities. I've spent a lot of time working with founders to identify which features unlock the most learning and move us toward product-market fit the fastest, while intentionally leaving room for future expansion.",
      ],
    },
    {
      kind: "story",
      eyebrow: "user testing",
      heading: "Learning from real behavior",
      body: [
        "The best product decisions came from observing real behavior. I watched creator livestreams, reviewed how users interacted with existing flows, talked directly with creators (user interviews), and used those insights to challenge our original assumptions.",
      ],
    },
    {
      kind: "story",
      eyebrow: "impact",
      heading: "Creating the foundation for creator-led growth",
      body: ["This project is still actively being built, but the work has already influenced how the company thinks about creators. So far I've:"],
      items: [
        "Defined the product architecture for a creator ecosystem spanning discovery, commerce, streaming, fulfillment, and analytics",
        "Identified technical and UX risks before engineering investment",
        "Established the first creator-facing workflows",
        "Established reusable design patterns for future creator tooling",
        "Created prototypes and flows that aligned founders, engineering, and product around a shared vision",
      ],
    },
    {
      kind: "insight",
      body: [
        "Most importantly, I helped transform \"we should build something for creators\" into a system the team can actually execute on.",
      ],
    },
    {
      kind: "story",
      eyebrow: "work in progress",
      body: [
        "This is an evolving product, so this case study focuses less on polished final screens and more on the thinking behind building from zero. I'll continue updating this with launches, user feedback, and measurable outcomes. For now, this is a snapshot of what founding design looks like for me at a startup: navigating ambiguity, challenging assumptions, making tradeoffs, and helping turn an idea into something real.",
      ],
    },
    {
      kind: "flag",
      text: "Added the dashboard and livestream screenshots back in, per your note that they're not real data. This page is still unlisted, not linked from the Work index or nav, matching the \"private, don't share beyond intended audience\" note on your source.",
    },
  ],
};

// Curated for the Work index, not chronological — biggest-scope systems
// work leads, then the mid-weight case studies, closing on the two
// lightest/quickest pieces.
export const projects: Project[] = [
  {
    slug: "chance-live",
    number: "01",
    title: "Summary Revamp",
    tagline: "Preventing $5,000 accidental swipes in my first 15 hours at a Pokemon card startup",
    company: "Chance.live",
    role: "Systems Designer, Product Growth Strategist",
    year: "2026",
    result: "$5,000 in prevented accidental swipes",
    metrics: [
      { value: "$5,000", label: "prevented per accidental swipe" },
      { value: "15 hrs", label: "problem identified to shipped fix" },
    ],
    discipline: "product, systems",
    content: chanceLive,
    size: "md",
  },
  {
    slug: "carinsurance-com",
    number: "05",
    title: "CarInsurance.com",
    tagline: "Rebuilding a 20-year-old site and soloing its first design system",
    company: "Quinstreet",
    role: "Product Designer",
    year: "2024",
    result: "13% more organic traffic, 98% faster page creation",
    metrics: [
      { value: "13%", label: "more organic traffic" },
      { value: "18%", label: "more quote requests" },
      { value: "98%", label: "faster page creation" },
    ],
    discipline: "product, design systems",
    content: carInsurance,
    size: "md",
  },
  {
    slug: "adem-user-list",
    // Restored from the original site: "ADEM User List Page" is the
    // internal feature name, but the live portfolio called this project
    // "Network Security" on the work index. That's the more compelling
    // read for a visitor skimming case studies, so it's back as the title
    // — case study copy still refers to ADEM throughout, unchanged.
    number: "02",
    title: "Network Security",
    tagline: "Bringing clarity to complex workflows for IT admins",
    company: "Palo Alto Networks",
    role: "Lead Designer + UXR",
    year: "2024",
    result: "80% faster user lookup (23s to 5s), 7 workflows unified into 1",
    metrics: [
      { value: "7 → 1", label: "workflows consolidated" },
      { value: "23s → 5s", label: "to find a user at a point in time" },
      { value: "80%", label: "faster on that task" },
    ],
    discipline: "enterprise, systems",
    content: ademUserList,
    size: "md",
  },
  {
    slug: "beyond",
    number: "07",
    title: "Beyond",
    tagline: "Bridging career and education inequities with empathy",
    company: "Catalyst Designathon",
    role: "UX Designer",
    year: "2024",
    result: "Honorable Mention out of 87 teams",
    metrics: [
      { value: "87", label: "teams competed against" },
      { value: "128", label: "student survey responses" },
      { value: "2 days", label: "designathon window" },
    ],
    discipline: "social impact, research",
    content: beyond,
    size: "md",
  },
  {
    slug: "access-analyzer",
    number: "03",
    title: "Access Analyzer",
    tagline: "Turning ambiguous errors into clear, actionable guidance",
    company: "Palo Alto Networks",
    role: "Lead Designer",
    year: "2025",
    result: "80% faster troubleshooting (30s to 6s), 22 UX fixes shipped",
    metrics: [
      { value: "30s → 6s", label: "to troubleshoot an issue" },
      { value: "22", label: "UX and accessibility fixes shipped" },
      { value: "35+", label: "pain points found in UX audit" },
    ],
    discipline: "enterprise, ux research",
    content: accessAnalyzer,
    size: "mini",
  },
  {
    slug: "chance-deposit-flow",
    number: "08",
    title: "Deposit Flow",
    tagline: "Cutting our deposit flow from 7 clicks to 2",
    company: "Chance.live",
    role: "Systems Designer, Product Growth Strategist",
    year: "2026",
    result: "Deposit flow cut from 7 clicks to 2, 1.8x order volume in the week after launch",
    metrics: [
      { value: "7 → 2", label: "clicks, buy to paid" },
      { value: "75%", label: "dropped off before depositing, pre-redesign" },
      { value: "1.8×", label: "order volume in the week after launch" },
    ],
    discipline: "product, growth",
    content: chanceDepositFlow,
    size: "md",
  },
  {
    slug: "ai-workflow-toolkit",
    number: "04",
    title: "AI Workflow Toolkit",
    tagline: "Helping a design team test, iterate, and prototype faster",
    company: "Palo Alto Networks",
    role: "Product Designer",
    year: "2025",
    result: "80% team adoption, 36x faster synthetic user testing",
    metrics: [
      { value: "80%", label: "of the design team adopted the toolkit" },
      { value: "36×", label: "faster synthetic user testing" },
    ],
    discipline: "ai, tooling",
    content: aiWorkflowToolkit,
    size: "mini",
  },
  {
    slug: "internship-wrapped",
    number: "06",
    title: "Internship Wrapped",
    tagline: "Visualizing impact, growth, and design wins in an animated recap",
    company: "Palo Alto Networks",
    role: "Product Design Intern",
    year: "2025",
    result: "Visualizing impact, growth, and design wins as an animated recap",
    metrics: [
      { value: "50+", label: "teammates reached" },
      { value: "2 days", label: "concept to delivery" },
    ],
    discipline: "motion, storytelling",
    content: internshipWrapped,
    size: "mini",
  },
  {
    slug: "chance-creators",
    number: "—",
    title: "Chance Creators",
    tagline: "Building a creator operating system from scratch",
    company: "Chance.live",
    role: "Systems Designer, Product Growth Strategist",
    year: "2026",
    result: "Defined the product architecture for a 5-part creator ecosystem",
    metrics: [],
    discipline: "product, 0-to-1",
    content: chanceCreators,
    unlisted: true,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
