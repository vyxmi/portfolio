import "server-only";
import type { CaseStudyContent } from "./case-study-types";
import overrides from "../../content/projects.json";
import { SELECTED_SLUGS } from "./presentation";

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
  featured?: boolean;
  order?: number;
  previewOutcome?: string;
  previewImage?: { src: string; alt: string };
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
  heroLine: "Making accidental sales recoverable by letting people review their decisions before a transaction becomes final. Designed and shipped in my first 15 hours.",
  heroImage: { src: "/case-studies/chance-live/swipe-flow.webp", alt: "Chance.live card swipe screen, Collect or Sell, with an Undo control", width: 2048, height: 1367 },
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
        "A single accidental swipe could sell a card the user wanted to keep, and selling is irreversible.",
        "This issue also generated support tickets, which created additional operational costs for an already lean team of eight people.",
      ],
      items: [
        "Open a pack",
        "Accidentally swipe a card",
        "Realize the mistake too late, selling is irreversible",
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
      caption: "the full audit board: click to zoom, it's a wide one",
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
        "Business: addressed a major retention issue identified through analytics, made accidental sales preventable for an 8 person startup, reduced unnecessary backend processing by finalizing transactions later in the workflow, created reusable foundations for future development.",
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
      heading: "Measure twice. Cut once",
      body: [
        "The original request was a tutorial. The real problem was trust. Rather than immediately executing on the proposed solution, I spent time understanding the business, the users, the product vision, and the data. That extra upfront effort allowed me to move quickly with confidence once the problem was clear.",
        "This project reinforced why I believe in house design is so valuable for startups. A designer embedded within the company develops context that external agencies often don't have, understanding product vision, technical constraints, user behavior, and long term roadmap simultaneously. The result isn't just better screens. It's better decisions.",
        "In 15 hours, I was able to identify a retention issue, align a solution with Chance's brand vision, think through implementation constraints, and create reusable foundations for future growth. That's the type of impact I want to continue bringing to Chance as the product scales.",
      ],
    },
    {
      kind: "flag",
      text: "Every image from your export is now placed somewhere in this case study, including the full ~30,000px-wide FigJam audit board, it's downscaled for the page but click-to-zoom still shows the whole thing, so very fine text on it may still be hard to read. If you want a few specific regions cropped out as their own sharper images instead, point me at the sections and I'll do it.",
    },
  ],
};

const chanceDepositFlow: CaseStudyContent = {
  heroLine:
    "I redesigned one of the biggest drop-off points in our purchase funnel, built the frontend directly on our existing product, and worked with engineering to ship it in 2 days.",
  blocks: [
    {
      kind: "imagePlaceholder",
      label: "hero: old flow ↔ new flow",
      note: "The old-flow ↔ new-flow animation for the very top of this page, send it and I'll place it above everything else.",
    },
    { kind: "sectionHeading", eyebrow: "context", heading: "7 clicks and 7 seconds. H O R R E N D O U S" },
    {
      kind: "image",
      src: "/case-studies/chance-deposit-flow/slack-brief.png",
      alt: "Slack message asking to prioritize the deposit flow: 'I want to optimize our Deposit flow. Right now it takes 7 clicks and 7 seconds. That's H O R R E N D O U S.'",
      caption: "the Slack message that kicked this off",
      width: 1640,
      height: 238,
    },
    {
      kind: "story",
      body: [
        "That was basically the brief.",
        "People come to Chance to open Pokémon packs. If they didn't have enough money in their balance, we made them leave what they were doing, deposit USDC, wait for it, redeem it, then come back and buy the pack.",
      ],
    },
    { kind: "story", eyebrow: "research", body: ["I started by running the whole thing myself with test funds and taking notes."] },
    { kind: "sectionHeading", eyebrow: "ux audit", heading: "7 clicks was kind of generous" },
    {
      kind: "clickThrough",
      flows: [
        {
          label: "the old flow",
          hasImages: true,
          steps: [
            { label: "Hover over balance", note: ["why is this hidden on hover?"] },
            { label: "Manage Funds", note: ["why isn't this just Balance?"] },
            { label: "Deposit" },
            { label: "Buy USDC with card", note: ["98% of users deposit this way. start here."] },
            { label: "Enter amount" },
            { label: "Purchase", note: ["the next screen is Select Payment. we have not purchased anything."] },
            { label: "CoinFlow", note: ["Changing the amount here takes three more clicks.", "Why are there both Back and Change Amount buttons?"] },
            { label: "Confirm payment", note: ["Green checkmark.", "oh wait. we're not done."] },
            { label: "Wait for the USDC deposit to appear" },
            { label: "Redeem", note: ["what the hell is a coupon?"] },
          ],
        },
      ],
    },
    {
      kind: "story",
      body: [
        "A lot of users saw the green success state, assumed they were finished, and closed the modal without redeeming.",
        "The fix at the time was a toast reminding them to come back and redeem their funds.",
      ],
    },
    { kind: "imagePlaceholder", label: "redeem-reminder toast", note: "A screenshot of that redeem-reminder toast goes here." },
    { kind: "story", body: ["That was one of those moments where the product was telling us what was wrong."] },
    {
      kind: "expand",
      label: "everything else I found",
      body: [
        "The same modal also contained USDC deposit history.",
        "I didn't think transaction history belonged inside the thing you use to add money, so I started redesigning the History page to hold it instead.",
        "Different rabbit hole.",
      ],
    },
    {
      kind: "story",
      eyebrow: "technical considerations",
      heading: "Follow the money",
      body: [
        "Before changing the interface, I needed to know why it worked this way.",
        "I talked to the developers and mapped the transaction from clicking Buy to actually seeing spendable USDC in someone's Chance balance.",
      ],
    },
    { kind: "flowSteps", steps: ["Card", "CoinFlow", "payment completes", "USDC becomes redeemable", "redeem", "Chance balance updates"] },
    {
      kind: "story",
      body: [
        "I learned how CoinFlow, our balance, the crypto transaction, and redemption actually worked together.",
        "The redeem step existed for a technical reason. Users still didn't need to understand any of that.",
        "The old experience exposed the mechanics almost literally. Pay. Wait for a deposit. Find it. Understand that it exists separately from your balance. Redeem a coupon. Wait for your balance to update.",
        "Most of the people I talked to weren't crypto-native. They were trying to buy Pokémon cards.",
        "So I kept the transaction and redesigned what the user sees.",
      ],
    },
    { kind: "statement", heading: "How might we make crypto disappear without touching the backend?" },
    {
      kind: "textCompare",
      tabs: [
        {
          label: "old redemption",
          body: [
            "Confirm payment: green checkmark. But you're not done yet.",
            "Wait for the USDC deposit to appear.",
            "Redeem a coupon most users didn't understand.",
            "Many saw the checkmark, assumed they were finished, and closed the modal without redeeming.",
          ],
        },
        {
          label: "new redemption",
          body: [
            "Payment received, getting your funds ready...",
            "Loading.",
            "Your funds are ready to use. Add $50 to balance.",
            "Click.",
            "Balance updates. Modal closes. Done.",
          ],
        },
      ],
    },
    { kind: "story", body: ["The transaction details are still there in a small accordion if someone wants them."] },
    { kind: "sectionHeading", eyebrow: "constraint", heading: "Keep the backend. Fix everything around it" },
    {
      kind: "story",
      body: [
        "I wanted this live as fast as possible. CoinFlow worked, our transaction infrastructure worked. I wasn't going to turn a funnel problem into a backend rebuild.",
        "So I gave myself one big constraint: keep the backend the same. That shaped a lot of the design.",
        "CoinFlow was finicky. The widget updates when the amount changes, so some interactions that looked fine in Figma felt terrible once I actually ran them.",
        "I explored a few structures.",
      ],
    },
    {
      kind: "prototypeCompare",
      tabs: [
        { label: "two-column", body: ["More information visible at once."], verdict: "lost" },
        { label: "expanding modal", body: ["Could adapt as the user moved through the flow."], verdict: "lost" },
        {
          label: "adaptive single-column",
          body: ["Worked cleanly with the way CoinFlow already behaved."],
          verdict: "shipped",
          why: ["It was the easiest version to implement reliably.", "Dev wins again."],
        },
      ],
    },
    {
      kind: "story",
      eyebrow: "information architecture",
      heading: "One modal, a lot of ways in",
      body: ["The balance modal does a lot.", "And the experience changes depending on how you got there."],
      items: ["Balance", "Add funds", "Buy USDC with card", "Deposit USDC directly", "Withdraw"],
    },
    {
      kind: "clickThrough",
      flows: [
        { label: "buying a pack, short on funds", steps: [{ label: "Top Off" }] },
        { label: "balance, card saved", steps: [{ label: "Choose amount" }, { label: "Purchase" }] },
        { label: "balance, no card saved", steps: [{ label: "Choose amount" }, { label: "Enter card" }, { label: "Purchase" }] },
        { label: "depositing USDC directly", steps: [{ label: "Crypto-native flow" }] },
      ],
    },
    {
      kind: "story",
      body: [
        "I mapped these separately before settling on the interaction.",
        "I was optimizing the card flow first because 98% of our users deposit with a card, but I still needed the other paths to work.",
      ],
    },
    { kind: "story", eyebrow: "the redesign", heading: "The new card flow" },
    {
      kind: "clickThrough",
      flows: [
        {
          label: "the new flow",
          hasImages: true,
          steps: [
            {
              label: "Click your balance",
              note: ["No hover.", "No Manage Funds screen.", "Add Funds is already open.", "Buy with Card is already selected."],
            },
            {
              label: "Pick an amount",
              note: [
                "The quick-add buttons map to pack prices.",
                "Buying two? Click twice.",
                "Want another amount? Edit it directly.",
                "No jumping backward through the flow just to change a number.",
                "CoinFlow opens with the amount already set.",
              ],
            },
            {
              label: "Purchase",
              note: [
                "CoinFlow handles payment.",
                "Then: payment received, getting your funds ready...",
                "→ Add $XX to balance",
                "→ balance updates",
                "→ modal closes",
                "Go buy your pack.",
              ],
            },
          ],
        },
      ],
    },
    { kind: "ratio", before: "7", beforeLabel: "clicks, old flow", after: "3", afterLabel: "clicks, new flow" },
    {
      kind: "story",
      eyebrow: "design debate",
      heading: "One click I wanted to keep",
      body: ["There was another debate around what should happen when someone tried to buy a pack without enough money."],
    },
    { kind: "imagePlaceholder", label: "the pack card", note: "A screenshot of the pack card goes here." },
    {
      kind: "story",
      body: [
        "One proposal was to open the full deposit modal immediately.",
        "I thought that felt rude. Looking at a pack doesn't mean you're ready for a giant payment modal in your face. So we tested it with members of the team.",
      ],
    },
    { kind: "imagePlaceholder", label: "deposit modal slams open", note: "The deposit-modal-slams-open recording goes here." },
    {
      kind: "story",
      body: [
        "They hated having the payment modal open in their face.",
        "We kept the lightweight Top Off screen.",
      ],
    },
    { kind: "imagePlaceholder", label: "the Top Off screen", note: "A screenshot of the Top Off screen goes here." },
    { kind: "story", body: ["It tells you how much you're short and lets you change the amount before the payment flow starts. That extra click earned its place. The flow shipped at 3 clicks, counted from opening the modal to having balance added, assuming a saved card and excluding clicks inside the card-payment provider."] },
    {
      kind: "story",
      eyebrow: "process",
      heading: "I built it while I designed it",
      body: ["A lot of the questions I cared about were behavioral.", "Static screens weren't very useful for that."],
      items: [
        "What happens when the amount changes?",
        "When does CoinFlow open?",
        "What does the handoff after payment feel like?",
        "How long are you waiting for the USDC?",
        "What does the balance do while it updates?",
      ],
    },
    { kind: "story", body: ["So I vibe coded the frontend directly on our existing product using Claude."] },
    { kind: "flowSteps", steps: ["Code", "Local product", "Transaction"] },
    {
      kind: "story",
      body: [
        "I connected it to test funds and ran transactions through the flow while I was designing it.",
        "That is where I caught a lot of the annoying stuff.",
      ],
      items: [
        "Loading states.",
        "CoinFlow remounting.",
        "Amount changes.",
        "Payment finishing before redemption.",
        "Balance updates that technically worked but felt broken because there was no feedback.",
      ],
    },
    { kind: "story", body: ["Once the frontend felt right, I worked with our developer to connect it to the existing backend."] },
    { kind: "flowSteps", label: "2 days, brief to shipped", steps: ["Brief", "Designed", "Built", "Connected", "Shipped"] },
    {
      kind: "expand",
      label: "questions I needed answered",
      items: [
        "When exactly does CoinFlow tell us payment succeeded?",
        "When does the USDC become redeemable?",
        "Which parts of redemption have to stay?",
        "Can the amount change without restarting CoinFlow?",
        "What state do we get back after redemption?",
        "What can I handle entirely on the frontend?",
        "What would require backend work?",
        "What happens if the user already has part of the pack price?",
        "What changes when a card is already saved?",
      ],
    },
    {
      kind: "story",
      eyebrow: "impact",
      heading: "Then we watched the funnel",
    },
    {
      kind: "funnelCompare",
      groups: [
        {
          label: "before",
          dateRange: "Jul 15 – Aug 19",
          n: "3,293 signups",
          stages: [
            { label: "signups", pct: 100 },
            { label: "attempted deposit", pct: 7.44 },
            { label: "deposited", pct: 5.13 },
          ],
        },
        {
          label: "after",
          dateRange: "Aug 20 – Aug 22",
          n: "420 signups",
          stages: [
            { label: "signups", pct: 100 },
            { label: "attempted deposit", pct: 13.81 },
            { label: "deposited", pct: 9.29 },
          ],
        },
      ],
      caption: "+81% signup-to-deposit conversion; three-day post-launch window",
    },
    {
      kind: "story",
      body: [
        "People were also entering the funnel more often. Attempted deposits went from 7.44% to 13.81%.",
        "And in the week after launch, order volume was 1.8x higher.",
        "It's early. The post-launch conversion window is only three days, and order volume can move for plenty of reasons. I'm continuing to watch it.",
        "So far, more people are trying to deposit, more of them are finishing, and more orders are going through.",
      ],
    },
    {
      kind: "insight",
      eyebrow: "takeaways",
      heading: "Follow the money to make money",
      body: ["I learned to get close to the system before trying to simplify the interface. Once I understood how the money actually moved, it became pretty obvious what users never needed to know."],
    },
    {
      kind: "insight",
      heading: "More clicks can be good?",
      body: ["I also got more comfortable keeping a click when it earned its place. The 3-click flow gave people context before asking them to pay."],
    },
    {
      kind: "insight",
      heading: "Wow, vibe-coding is fun",
      body: ["Building it myself changed the pace. I could test the real behavior, design around CoinFlow instead of guessing how it would behave, and get the whole thing out in two days."],
    },
    { kind: "sectionHeading", eyebrow: "closing", heading: "Users came for packs. Let's not talk them out of it" },
  ],
};

const ademUserList: CaseStudyContent = {
  heroLine:
    "I led the design of a new User Device List that gave seven existing entry points one place to converge, while carrying the context of each investigation with them. For one of the most common tasks I found, locating a user at a specific point in time, the prototype cut the flow from 8 clicks to 2 and 23 seconds to 5.",
  heroImage: { src: "/protected-media/adem-user-list/unified-list.webp", alt: "The new unified ADEM User Device List page", width: 1763, height: 980 },
  blocks: [
    {
      kind: "story",
      eyebrow: "context",
      body: [
        "ADEM is Palo Alto Networks' digital experience monitoring product. IT teams use it to figure out why someone's network experience is broken, which can mean tracing a single employee through devices, applications, gateways, networks, and a specific moment in time.",
      ],
    },
    { kind: "story", eyebrow: "the problem", body: ["Finding a single user could send an admin all over the product."] },
    {
      kind: "image",
      src: "/protected-media/adem-user-list/timeline-detail.webp",
      transparentMedia: true,
      alt: "Six week sprint broken into Research & Audit, Requirements & Alignment, Wireframes/IA/User Flows, High-Fidelity Design, Testing & Iteration, and Finalization & Handoff, with specific notes per phase",
      caption:
        "process: 6-week sprint, July to September, mapped 7+ workflows and 20+ friction points, ran 36× faster synthetic tests plus 3 design reviews and 3 usability rounds that cut task times 80%, then handed off to 30+ collaborators",
      width: 2000,
      height: 434,
    },
    { kind: "sectionHeading", eyebrow: "enterprise research", heading: "First, I had to understand what ADEM actually did" },
    {
      kind: "story",
      body: [
        "Palo Alto Networks is a 20,000+ person cybersecurity company. ADEM lives inside Strata Cloud Manager and helps enterprise IT teams understand what users are experiencing across their network.",
        "It is also really complicated.",
      ],
    },
    {
      kind: "story",
      body: [
        "There wasn't much foundational UX research for ADEM when I joined, and years of new capabilities had accumulated across a product already dealing with genuinely complex technical problems. Pages had been added as new needs emerged, different teams owned adjacent surfaces, and the product had recently gone through a broader shift toward platformization. None of those decisions were unreasonable on their own. Together, though, they made it surprisingly hard to answer a basic support question:",
      ],
    },
    { kind: "statement", heading: "What happened to this user?" },
    {
      kind: "story",
      body: [
        "Because I was the lead designer on ADEM, I didn't think I could start by moving components around a page. I needed to understand the system first. So I went a little overboard. I read technical documentation on ADEM, Strata Cloud Manager, network topology, user experience scoring, gateways, monitoring and the surrounding troubleshooting ecosystem until I could actually follow the conversations engineers and admins were having. There was also a lot of overlap with other designers' projects, so understanding the neighboring surfaces mattered. ADEM couldn't be redesigned like an isolated app when users were constantly entering and leaving it through the rest of the platform.",
      ],
    },
    {
      kind: "image",
      src: "/protected-media/adem-user-list/adem-ia-map.png",
      alt: "Diagram of ADEM for all users and remote networks: a user's home, on-the-go, or branch devices connecting through WiFi, router, ISP, and Prisma Access to Internet, SaaS, and Enterprise apps, with visibility checkpoints at each hop",
      caption: "IA map: how ADEM works across various applications and networks (source: Palo Alto Networks tech docs)",
      width: 639,
      height: 328,
    },
    { kind: "sectionHeading", eyebrow: "background + analytics research", heading: "The product was organized around itself. Admins were organized around tickets" },
    {
      kind: "story",
      body: [
        "ADEM used to have a more distinct home inside Strata Cloud Manager. After a broader move toward platformization, pieces of the experience appeared across different parts of the product. The same user-device data could now show up in multiple dashboards and workflows. At the same time, the product had accumulated a lot of functionality.",
        "I didn't want to assume that “complex enterprise software is just like that,” so I started by trying to establish a baseline. There wasn't much existing UX research to work from, so I used Pendo to build dashboards and funnels around ADEM usage, understand which paths people were actually taking, and find where they were dropping off.",
        "A few things stood out:",
      ],
      items: [
        "Helpdesk admins often had 3–6 tabs open while troubleshooting.",
        "Monthly ADEM users had declined 16% over two years.",
        "Our own internal IT admins weren't using the product.",
      ],
    },
    { kind: "story", body: ["That last one seemed worth investigating."] },
    {
      kind: "image",
      src: "/protected-media/adem-user-list/fragmented-dashboards.webp",
      transparentMedia: true,
      alt: "Three fragmented ADEM dashboards showing application experience, connectivity and user data",
      caption: "the same user data, scattered across different parts of the platform",
      width: 2048,
      height: 1229,
    },
    { kind: "sectionHeading", eyebrow: "user research", heading: "Our own IT admins wouldn't use it. So I went downstairs" },
    {
      kind: "story",
      body: [
        "Our internal IT help desk was literally in the building, so I went down and asked them how they actually solved tickets. I had admins walk me through recent cases from the moment a ticket came in to the moment they figured out what was wrong.",
      ],
    },
    { kind: "quote", text: "Could you walk me through a recent troubleshooting case you handled? What was the problem?" },
    {
      kind: "story",
      body: ["Instead of asking, “What should we add to ADEM?”, I wanted to know what they did without ADEM."],
      items: [
        "What did they look for first?",
        "What information did they already have when a ticket came in?",
        "When did they change tools?",
        "What did they ignore?",
        "What made them escalate the issue?",
      ],
    },
    { kind: "flowSteps", steps: ["Ticket", "Investigation", "Resolution"] },
    {
      kind: "image",
      src: "/protected-media/adem-user-list/workflow-map.webp",
      transparentMedia: true,
      alt: "Flowchart mapping an IT admin's troubleshooting workflow from ticket to resolution",
      caption: "mapping the real workflow, ticket to resolution",
      width: 1600,
      height: 323,
    },
    {
      kind: "story",
      body: [
        "At the same time, I was working on another PANW project, Access Analyzer, and interviewed a Network Security Architect at a large enterprise about how he handled more technical troubleshooting. That gave me another useful perspective. While the help desk needed to triage quickly, network and security admins were often solving the deeper problems those tickets eventually escalated into. The products overlapped.",
      ],
    },
    {
      kind: "story",
      body: [
        "In that interview, I also saw how quickly trust fell apart when diagnostic tools returned unclear “Unknown” states or required overly rigid input. Those findings belonged primarily to Access Analyzer, but they reinforced something I kept seeing across the broader platform: more technical information was not automatically more useful information.",
      ],
    },
    { kind: "sectionHeading", eyebrow: "the pattern", heading: "The most common task was also one of the most annoying" },
    { kind: "story", body: ["Two things kept coming up."] },
    { kind: "quote", text: "Way too much going on." },
    {
      kind: "story",
      body: ["Admins were being shown an enormous amount of data, and a lot of it wasn't relevant to the person handling the ticket. The issue was that admins had to dig through too much of it."],
    },
    {
      kind: "image",
      src: "/protected-media/adem-user-list/ux-critique.webp",
      transparentMedia: true,
      alt: "Annotated critique of the existing Application Experience page, with sticky notes flagging buried information and unclear charts",
      caption: "auditing an existing surface against what admins actually used while troubleshooting",
      width: 849,
      height: 944,
    },
    { kind: "sectionHeading", heading: "Admins kept using ADEM like a time machine" },
    {
      kind: "story",
      body: [
        "One use case came up again and again: find this user at this specific point in time.",
        "A ticket usually isn't “Sam's Wi-Fi is broken right now.” It's more like:",
      ],
    },
    { kind: "quote", text: "At 2:17 PM my Zoom call kept dropping. What happened?" },
    {
      kind: "story",
      body: [
        "The existing flow made that surprisingly difficult. Selecting the right point in time was cumbersome, and global search alone could take 7+ seconds to load.",
        "I timed the full task.",
      ],
    },
    { kind: "sectionHeading", eyebrow: "the cost", heading: "8 clicks. 23+ seconds" },
    { kind: "story", body: ["For one of the most common things admins needed to do."] },
    { kind: "flowSteps", steps: ["Choose time", "Global search", "Wait", "Find user", "Open user", "Reconstruct context"] },
    { kind: "sectionHeading", eyebrow: "first attempt", heading: "My first solution made the pages better, but it didn't fix the problem" },
    {
      kind: "story",
      body: [
        "Initially, my PM and I explored improving the surfaces that already existed. One direction used role-based access control to tailor pages around the person viewing them. IT Ops, Security and Network admins wouldn't all have to see the same filters, widgets and data by default. It was reasonable, but too complicated to implement on a tight deadline.",
      ],
    },
    {
      kind: "image",
      src: "/protected-media/adem-user-list/redesign-direction.webp",
      alt: "An early redesign direction for the Application Experience page, restructured for role-based clarity",
      caption: "an early direction that cleaned up an existing page around role and relevance",
      width: 1100,
      height: 683,
    },
    { kind: "story", body: ["The page was easier to understand, but the admin was still bouncing between pages."] },
    { kind: "sectionHeading", eyebrow: "the shift", heading: "Then we noticed seven paths were all trying to do the same thing" },
    {
      kind: "story",
      body: ["Across Strata Cloud Manager, there were seven different places where an admin could discover a group of affected user devices:"],
      items: [
        "User Device Experience",
        "Operational Health",
        "NetSec Health / NOC",
        "User Experience Across Network",
        "Mobile User Experience",
        "Global Distribution by source location",
        "Global Distribution by gateway location",
      ],
    },
    { kind: "story", body: ["Different charts, widgets, and starting contexts. But once someone clicked, the next question was basically always:"] },
    { kind: "statement", heading: "Which users are affected?" },
    { kind: "story", body: ["So instead of building more downstream pages, we created one shared destination."] },
    {
      kind: "consolidation",
      fromLabel: "Seven entry points",
      from: ["User Device Experience", "Operational Health", "NOC", "Network topology", "Mobile Experience", "Source distribution", "Gateway distribution"],
      to: "User Device List",
      toLabel: "Seven entry points. One place to investigate.",
    },
    { kind: "sectionHeading", eyebrow: "context, preserved", heading: "One destination, without losing where you came from" },
    {
      kind: "story",
      body: [
        "The important part wasn't just making every widget link to the same page.",
        "The context had to come with you.",
      ],
      items: [
        "If an admin clicked degraded users inside NOC, the User Device List opened with that degradation state already applied.",
        "If they clicked a segment of the network topology, those filters carried over.",
        "If they clicked poor users in one source location, the list retained the source location + experience score.",
        "If they arrived from a gateway distribution view, the gateway location stayed with them.",
      ],
    },
    {
      kind: "imagePlaceholder",
      label: "entry states",
      note: "Three example entry states, each filtering into the User Device List with its own inherited context.",
    },
    { kind: "story", body: ["That meant the admin didn't have to arrive on a generic page and reconstruct the investigation they had just started."] },
    { kind: "sectionHeading", eyebrow: "iteration", heading: "Then I kept breaking the list" },
    {
      kind: "story",
      body: [
        "One consequence of consolidating seven entry points was that this page had to work in a lot of different states. Someone might arrive with no filters, one gateway selected, only users with degraded experience, or a geographic region + experience score + historical time range. So I kept iterating on the information hierarchy, filtering, table density, time controls and entry states with feedback from my PM, engineering, the platform team and designers working on the surrounding surfaces.",
      ],
    },
    {
      kind: "image",
      src: "/protected-media/adem-user-list/design-evolution.gif",
      alt: "Looping GIF of the User Device List's UI evolving through different table densities, filter states, and column layouts",
      caption: "in progress: how the User Device List changed as I worked through different hierarchies, filters, and features.",
      width: 1440,
      height: 900,
    },
    { kind: "sectionHeading", eyebrow: "the direction", heading: "One place to pick up the investigation" },
    {
      kind: "image",
      src: "/protected-media/adem-user-list/saved-views.webp",
      alt: "The User Device List page with a Saved Views panel open, showing pre-filtered views like \"Europe Slack Users\" and \"Poor Asia Users\"",
      caption: "the final direction, presented to the PM and engineering team for implementation planning",
      width: 1800,
      height: 1125,
    },
    {
      kind: "numberedInsights",
      items: [
        { heading: "Get me to the affected users", body: "Seven product surfaces now converged on one predictable place." },
        { heading: "Don't make me rebuild what I just did", body: "Filters and context from the previous surface carried into the User Device List automatically." },
        {
          heading: "Let me use time like an actual troubleshooting tool",
          body: "I reworked the common historical lookup so an admin could find a user at a specific point in time in 2 clicks instead of 8. That removed six interactions and about 18 seconds from that lookup alone. Across the larger ticket workflow, I estimated the simplified path could save roughly 30 seconds per ticket.",
        },
        {
          heading: "Stop showing everything just because we have it",
          body: "The list prioritized the data needed to triage a user instead of loading every possible piece of ADEM information at once. That helped the interface scan faster and, according to the engineers I worked with, also reduced backend load time because the page requested a more limited dataset.",
        },
        { heading: "Stop rebuilding the same investigation", body: "Saved Views let admins keep recurring combinations of filters instead of reconstructing them ticket after ticket." },
      ],
    },
    { kind: "sectionHeading", eyebrow: "validation", heading: "8 clicks became 2" },
    {
      kind: "story",
      body: [
        "I tested the prototype against the same historical user lookup I had timed at the beginning. I then presented the final direction to the PM and engineering team for implementation planning.",
      ],
    },
    {
      kind: "insight",
      eyebrow: "takeaways",
      heading: "The org chart isn't the user journey",
      body: [
        "Platformization made sense for how the product was structured internally. Adding new pages made sense when each new capability was being built, but the admin still had one problem in front of them. The best solution made the boundaries between them matter less.",
      ],
    },
  ],
};

const accessAnalyzer: CaseStudyContent = {
  heroLine: "I redesigned a key diagnostic tool used by IT administrators to troubleshoot user access issues and shipped 22 UX fixes.",
  heroImage: { src: "/case-studies/access-analyzer/query-results.webp", alt: "Access Analyzer query results, showing User & Endpoint, Network, Application, and Security Policy health checks", width: 1089, height: 632, transparentMedia: true },
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
      text: "Your FigJam UX audit board (35+ pain points) is in the deck but far too dense to read at a legible size on the web, if you have a cleaner summary view, or want me to crop out a few individual annotated screens instead, send those over.",
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
      text: "Anonymized the user research subject's employer, per your instruction: the deck named a specific company, I generalized it to \"a large enterprise.\" Let me know if you'd rather phrase it differently.",
    },
  ],
};

const aiWorkflowToolkit: CaseStudyContent = {
  heroLine:
    "I designed and built an AI workflow toolkit to help designers test, iterate, and prototype faster. I combined research from my Cognitive Science background with prompt engineering to optimize internal design tools for creativity and speed.",
  heroImage: { src: "/case-studies/ai-workflow-toolkit/personashift.webp", alt: "PersonaShift, an AI tool analyzing a design against a named user persona", width: 550, height: 396, transparentMedia: true },
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
      text: "Your deck doesn't list a role title or a timeline for this one (just team: 1 UX Director, 1 UX Researcher). I put a placeholder role of \"Product Designer\" in the nav/header since the page needs something there, let me know the real title and duration and I'll swap them in.",
    },
  ],
};

const carInsurance: CaseStudyContent = {
  heroLine:
    "Over 12 weeks, I designed CarInsurance.com's first design system, used it to redesign its highest-impact experiences, and worked with engineering as the system was implemented component-by-component in React Storybook.",
  heroImage: { src: "/case-studies/carinsurance-com/atomic-design-ladder.webp", alt: "Atomic Design ladder: Sub Atomic, Atoms, Molecules, Organisms, Templates, and Pages, each shown with real UI", width: 1600, height: 778, transparentMedia: true },
  blocks: [
    { kind: "sectionHeading", eyebrow: "context", heading: "Twenty years of growth left twenty years of design decisions" },
    { kind: "quote", text: "Just make it look more modern", attribution: "my design brief. fair enough" },
    {
      kind: "story",
      body: [
        "CarInsurance.com had been around for more than two decades. During that time, the site had accumulated more than 200 pages, calculators, articles, comparison tools, author modules, lead-generation surfaces, and one-off business requests. Individual pieces had been updated over the years, but there was no shared design system or documentation holding them together. The same thing could look completely different depending on where you found it.",
        "A CTA behaved one way on one page and another way somewhere else. Tables changed structure. Content hierarchy shifted. Trust elements came and went. Mobile layouts followed different rules. The site felt like every page had been designed by a different person.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/competitor-audit.webp",
      transparentMedia: true,
      alt: "A montage of visibly inconsistent CarInsurance.com UI: buttons, tables, calculators, content modules, and typography, each solving the same problem a different way",
      caption: "the old site, different ui patterns",
      width: 2000,
      height: 1793,
    },
    { kind: "sectionHeading", eyebrow: "initial design explorations", heading: "Redesigning the pages to \"look more modern\"" },
    {
      kind: "story",
      body: [
        "My first direction was to start with the highest-priority pages and make them better. So I did. This helped align with management on a visual direction and build faith in my design decisions. I wanted the prototypes to actually work when I put them in front of users, not just look good in screenshots. If I kept redesigning 200 pages individually, I could make the website prettier. I'd also create another generation of one-off pages.",
      ],
    },
    {
      kind: "imagePair",
      images: [
        {
          src: "/case-studies/carinsurance-com/mobile-before-after.png",
          alt: "Annotated mobile before-and-after comparison: the old page has small hitboxes and an un-intuitive layout, while the redesign keeps the call to action visible throughout the page, makes answers easier to find, and collapses the table of contents",
          caption: "mobile before + after",
          width: 739,
          height: 447,
        },
        {
          src: "/case-studies/carinsurance-com/mobile-ui-variations.png",
          alt: "Four mobile UI variations of the same California car insurance page, exploring where the Compare Car Insurance Rates module and author credit sit relative to the article content",
          caption: "mobile UI variations",
          width: 605,
          height: 317,
        },
        {
          src: "/case-studies/carinsurance-com/desktop-before-after.png",
          alt: "Side-by-side comparison of the old CarInsurance.com California page's dense navigation and dated styling against the redesigned page's blue hero panel, simplified navigation, and prominent Compare Car Insurance Rates module",
          caption: "desktop before + after",
          width: 1005,
          height: 330,
        },
        {
          src: "/case-studies/carinsurance-com/desktop-annotated-prototype.png",
          alt: "Annotated desktop prototype of a California car insurance article page, with callouts for a CTA that expands after scrolling, simplified navigation, a phone number visible on hover, and a link aligned with text",
          caption: "desktop annotated prototype",
          width: 612,
          height: 269,
        },
      ],
    },
    { kind: "sectionHeading", eyebrow: "research", heading: "Finding 150+ problems by auditing, analyzing, and talking to people" },
    {
      kind: "story",
      body: [
        "Before committing to the system, I went much deeper into the existing product. I audited 200+ pages, mapped recurring UI patterns, reviewed analytics and conversion flows, compared competitors, and ran 5 user interviews. I found more than 150 opportunities for improvement.",
      ],
    },
    {
      kind: "imagePair",
      label: "ux audit findings + presentation",
      padded: true,
      images: [
        {
          src: "/case-studies/carinsurance-com/audit-accessibility.png",
          alt: "Audit slide: lack of accessibility and consistency in branding and color selection: a text contrast ratio of 2.4:1 fails Web Content Accessibility Guidelines of at least 4.5:1",
          caption: "",
          width: 872,
          height: 523,
        },
        {
          src: "/case-studies/carinsurance-com/audit-calculators.png",
          alt: "Audit slide: lengthy forms, tables, and complicated CTAs may confuse users and discourage completion, shown against the original California car insurance rate calculator",
          caption: "",
          width: 872,
          height: 523,
        },
      ],
    },
    {
      kind: "imagePair",
      label: "competitive analysis of CarInsurance.com vs. insurance.com, another site owned by QuinStreet that was performing miles better (traffic, retention, conversions)",
      padded: true,
      images: [
        {
          src: "/case-studies/carinsurance-com/audit-hierarchy.png",
          alt: "Competitor audit slide comparing CarInsurance.com to insurance.com on visual and information hierarchy: CarInsurance.com's dense text blocks versus insurance.com's use of color, imagery, and iconography",
          caption: "",
          width: 972,
          height: 533,
        },
        {
          src: "/case-studies/carinsurance-com/audit-mobile.png",
          alt: "Competitor audit slide comparing mobile optimization: CarInsurance.com's rate table spread across six pages of navigation versus insurance.com's single-page horizontal scroll",
          caption: "",
          width: 974,
          height: 533,
        },
      ],
    },
    {
      kind: "researchRatings",
      label: "asking 5 people to rate the site across 3 aspects",
      items: [
        { label: "Trust", question: "Does this feel credible enough to make an insurance decision with?", rating: "1.7" },
        { label: "Clarity", question: "Can you quickly understand what matters?", rating: "2.1" },
        { label: "Usability", question: "Can you easily find and do what you came here to do?", rating: "2.4" },
      ],
    },
    { kind: "quote", text: "I’d probably Google this somewhere else just to make sure it's right", attribution: "first-time visitor of carinsurance.com" },
    {
      kind: "siteMetrics",
      label: "site metrics i gathered (over the last year)",
      items: [
        { label: "unique visitors", value: "↓ 33%" },
        { label: "average visit duration", value: "↓ 53%" },
        { label: "bounce rate", value: "89%" },
      ],
    },
    {
      kind: "numberedInsights",
      eyebrow: "common insights",
      items: [
        { heading: "Inconsistent UI hurt trust", body: "Changing branding and interaction patterns made the site feel less professional and trustworthy." },
        { heading: "Dense content was hard to scan", body: "Weak hierarchy made useful information easy to miss." },
        { heading: "Calculators struggled on mobile", body: "High-value tools had usability, logic, and small-screen layout problems." },
        { heading: "Patterns kept getting rebuilt", body: "Navigation, tables, calculators, author modules, trust elements, and layouts all had competing versions." },
      ],
    },
    { kind: "sectionHeading", eyebrow: "the pitch", heading: "Please let me make a design system 🙏" },
    {
      kind: "story",
      body: [
        "At first, the styles and components were just infrastructure I was making for myself. They made it much easier to build interactive prototypes, keep pages consistent, and test ideas without recreating the same UI every time.",
        "Then I started thinking: wait. What if I redesign while building a design system?",
        "I proposed spending more time upfront turning the pieces I had already started into a real system. The Director of Finance overseeing the site's analytics was impressed by the approach, and I got the space to keep going.",
      ],
    },
    { kind: "sectionHeading", eyebrow: "prioritization", heading: "With 400+ components, what parts were the most important?" },
    {
      kind: "story",
      body: ["Once I put together a live list of all of the components that existed on the site (largely by screenshot and spreadsheet), I needed to know what to tackle first."],
    },
    {
      kind: "quote",
      text: "I've literally never seen some of these elements. I think that calculator is from 2014. How did you find that?",
      attribution: "Product Manager, CarInsurance.com",
    },
    {
      kind: "story",
      body: [
        "As the only designer, I owned the redesign end to end. I wasn't designing in a vacuum, though. Once a week, I presented my work to the Director overseeing the site's analytics, pitched branding and redesign decisions, got feedback, and aligned on what I'd tackle next. The Product Manager also gave me access to site analytics so I could prioritize based on what people were actually using: the highest-traffic pages, calculators with the highest drop-off, and other high-impact parts of the product. That gave me four ways to prioritize:",
      ],
    },
    {
      kind: "numberedInsights",
      items: [
        { heading: "Usage", body: "Where are people actually going?" },
        { heading: "Friction", body: "Where are they struggling or leaving?" },
        { heading: "Visibility", body: "What parts of the website does the management team see the most value in?" },
        { heading: "Leverage", body: "Which repeated problem could I solve once and improve everywhere?" },
      ],
    },
    { kind: "sectionHeading", eyebrow: "the system", heading: "Breaking 200 pages into parts" },
    {
      kind: "story",
      body: [
        "I used Brad Frost's Atomic Design framework to break the site down from foundational rules into reusable page structures. Not just because I wanted to show off my Figma skills. I wanted a change at the bottom of the system to have consequences everywhere above it. A type decision shouldn't need to be manually updated across dozens of pages, a button shouldn't have to be redesigned every time it appeared, and a calculator shouldn't invent a completely new input pattern because someone happened to build it six months later.",
        "The system moved from:",
      ],
    },
    { kind: "flowSteps", steps: ["Foundations", "Atoms", "Molecules", "Organisms", "Templates", "Pages"] },
    {
      kind: "story",
      body: [
        "Foundations defined things like typography, color, spacing, grids, and responsive behavior. Atoms defined the smallest reusable UI. Those atoms combined into components and larger modules. Modules combined into templates. And templates gave us a shared structure for the hundreds of pages built on top.",
        "One example was the type system. It had to hold up from a 48px desktop H1 all the way down to 12px supporting text on mobile without every page inventing its own hierarchy.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/type-scale.webp",
      transparentMedia: true,
      alt: "Desktop and mobile type scale, from Heading 1 down to Subtitle Regular, with exact sizes and line heights",
      caption: "the type scale artifact: 48px desktop H1 down to 12px mobile subtitle text",
      width: 1400,
      height: 739,
    },
    { kind: "story", body: ["By the end, the library contained 670+ reusable components, variants, states, and design assets, along with 10 common page templates, documentation, responsive rules, and implementation guidance."] },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/color-palette-rationale.png",
      alt: "Old color palette with multiple muddy tones of the same blue and no clear accent, next to a proposed palette that is more cohesive and concise",
      caption: "before → after: consolidating scattered color tones into one intentional palette",
      width: 907,
      height: 396,
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/color-palette.webp",
      transparentMedia: true,
      alt: "The design system's color palette: Primary, Neutral, and Accent groups with hex, rgb, and hsl values",
      caption: "the primary, neutral, and accent color system",
      width: 1190,
      height: 1441,
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/component-variants.webp",
      transparentMedia: true,
      alt: "A sheet of component variants: buttons, toggles, dropdowns, tables, and star ratings at multiple sizes and states",
      caption: "component variants: every size and state, defined once",
      width: 1800,
      height: 753,
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/atomic-system.webp",
      transparentMedia: true,
      alt: "A dense sheet of CarInsurance.com UI components and page explorations",
      caption: "zoomed out: a slice of the 670+ component library this system grew into",
      width: 2048,
      height: 1035,
    },
    { kind: "story", body: ["The scale is fun to look at. The more important part is that we stopped starting from zero."] },
    { kind: "sectionHeading", eyebrow: "redesigning core experiences", heading: "I didn't want to standardize bad experiences" },
    {
      kind: "story",
      body: [
        "A consistent bad calculator is still a bad calculator. So while I built the system, I also redesigned the actual experiences sitting on top of it. I redesigned 10 insurance calculators, including the Moving Calculator.",
        "The old version was extremely simple. It asked for:",
      ],
    },
    { kind: "flowSteps", steps: ["Current ZIP code", "New ZIP code", "Current annual premium", "Find Out"] },
    { kind: "story", body: ["That was basically it."] },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/calculator-old-input.png",
      alt: "The original Moving Calculator: a short form asking for current ZIP code, new ZIP code, and current annual premium, then a Find Out button",
      caption: "old calculator: the old Moving Calculator, three inputs, one button",
      width: 250,
      height: 618,
    },
    {
      kind: "story",
      body: [
        "The problem wasn't just that it looked dated. The underlying experience didn't account for important variables that affect insurance rates, and it gave users very little visibility into what the result actually meant. Making the inputs prettier wouldn't fix that. So I rebuilt the calculator around the question the user was actually asking:",
      ],
    },
    { kind: "quote", text: "Will my insurance go up if I move?" },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/calculator-example.webp",
      transparentMedia: true,
      alt: "A redesigned \"will my insurance go up if I move\" calculator, with rate comparisons by ZIP code",
      caption: "new calculator, annotated: real numbers, clear comparisons",
      width: 760,
      height: 1172,
    },
    {
      kind: "story",
      heading: "Give the calculation better inputs",
      body: ["The redesign added relevant context like age and coverage level and let users compare by ZIP code, city, or state. Instead of treating every move like the same scenario, the calculator could account for more of the things that actually affect the result."],
    },
    {
      kind: "story",
      heading: "Answer the question first",
      body: ["The result leads with the thing the user actually came for:"],
    },
    { kind: "quote", text: "Your rates could go up by X% for an increase of $X/year." },
    { kind: "story", body: ["No digging through a table to figure out what happened."] },
    {
      kind: "story",
      heading: "Show the alternatives",
      body: ["Right underneath the headline result, users can compare what happens under state minimum, liability-only, and full-coverage scenarios. The calculator helps you understand your options."],
    },
    {
      kind: "story",
      heading: "Let people go deeper",
      body: ["For someone who wants more than the headline answer, the calculator then breaks rates down company-by-company across both locations, including the direction and dollar difference.", "The hierarchy became:"],
    },
    { kind: "flowSteps", steps: ["Context", "Inputs", "Answer", "Alternatives", "Evidence", "Quote"] },
    { kind: "story", body: ["The quick answer stays quick. The detail is there when you want it."] },
    {
      kind: "imagePair",
      label: "before → after",
      images: [
        {
          src: "/case-studies/carinsurance-com/calculator-before.png",
          alt: "The original Moving Calculator result: rates could go up 50% for an increase of $504, with no further breakdown",
          caption: "3 inputs → mystery result",
          width: 252,
          height: 558,
        },
        {
          src: "/case-studies/carinsurance-com/calculator-example.webp",
          transparentMedia: true,
          alt: "The redesigned calculator: rate comparisons by ZIP code, company, and coverage level",
          caption: "context → answer → alternatives → evidence",
          width: 760,
          height: 1172,
        },
      ],
    },
    { kind: "sectionHeading", eyebrow: "iteration", heading: "Designing, testing, and re-re-redesigning" },
    {
      kind: "story",
      body: ["Nothing shipped untouched. I ran six rounds of usability testing as I built the redesigned pages and system. Some ideas worked exactly the way I expected. Some absolutely did not. That was useful."],
    },
    {
      kind: "numberedInsights",
      items: [
        "Users routinely scrolled past dense walls of text, so I reworked lower-performing sections like FAQs and expert content into formats that were easier to scan and interact with.",
        "Long comparison tables weren't always the clearest way to communicate information, so I explored more summarized product-card formats when users responded better to them.",
        "Trust also kept coming up. Insurance is a high-stakes category, and users cared about where information came from, who wrote it, and how calculations were made. I designed stronger author, qualification, and methodology patterns into the system instead of treating credibility as an afterthought.",
      ],
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/trust-module.png",
      alt: "A 'Why Trust CarInsurance.com' module with author, editor, and fact-checker bylines alongside stats: 130 providers reviewed, 1.2 million quotes analyzed, 800 research hours, 12,500 customers surveyed, and 29 years of industry expertise",
      caption: "building trust: verified bylines and the research behind every rate",
      width: 2680,
      height: 588,
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
      kind: "sectionHeading",
      eyebrow: "lesson",
      heading: "Good design isn't protecting your first idea. If testing tells you the thing you made is worse, make another thing",
    },
    { kind: "sectionHeading", eyebrow: "balancing needs", heading: "Users were not the only constraint" },
    {
      kind: "story",
      body: ["CarInsurance.com is also a content business, an SEO engine, a lead-generation product, and an editorial platform. I worked closely with the Product Manager to balance what users needed with what editorial, engineering, SEO, and monetization needed from the same components."],
    },
    {
      kind: "numberedInsights",
      items: [
        "One example was the Learn More module. Its original redesign was too visually prominent and pulled attention away from the surrounding content. But simply removing it wasn't an option because it served an SEO and business purpose. So I reduced its visual dominance while preserving the function it needed to serve.",
        "Authorship had a different constraint. Articles could involve multiple writers and contributors, but the existing UI didn't give that work much visibility. I redesigned the author module so multiple contributors could receive credit without letting metadata take over the page.",
        "I also created templates for more visual, shareable infographics that editors could reuse inside articles.",
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
      kind: "imagePair",
      label: "before → after",
      images: [
        {
          src: "/case-studies/carinsurance-com/learn-more-before.png",
          alt: "The old Learn More widget: a prominent list of long text links under 'Learn more about car insurance rates'",
          caption: "the old widget: prominent, pulling users off the page",
          width: 751,
          height: 189,
        },
        {
          src: "/case-studies/carinsurance-com/learn-more-after.png",
          alt: "The redesigned Learn More widget: the same links as quieter, rounded cards",
          caption: "simplified into quieter, rounded cards",
          width: 751,
          height: 250,
        },
      ],
    },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/infographics-templates.png",
      alt: "A sheet of shareable infographic templates: Top 5 Cheapest Cars to Insure shown as a bar list, bar chart, and area chart, and a satisfaction donut chart for USAA customers",
      caption: "the deliverable: shareable infographic templates, built to drive traffic back to the site",
      width: 1500,
      height: 924,
    },
    { kind: "story", body: ["Now that a design system was established, I had the breathing room to get creative with new elements and features."] },
    { kind: "sectionHeading", eyebrow: "implementation", heading: "Figma had to survive contact with engineering" },
    {
      kind: "story",
      body: [
        "A giant component library is useless if it only makes sense to the person who built it. So I documented component behavior, variants, responsive rules, templates, and implementation guidance as I went.",
        "Engineering implemented essentially the whole system component-by-component in React Storybook.",
        "That made the relationship between design and production much more direct:",
      ],
    },
    { kind: "flowSteps", steps: ["Figma component", "Documented behavior", "Storybook component", "Live page"] },
    { kind: "story", body: ["I worked closely with the engineers during implementation to make sure the production components behaved the way the designs intended instead of slowly drifting apart."] },
    {
      kind: "image",
      src: "/case-studies/carinsurance-com/design-system-doc-cover.png",
      alt: "Cover slide of the CarInsurance.com design system Figma file, 'A Guide to this File,' explaining the sidebar of components, local styles, and usage guidelines",
      caption: "documentation: the design system's own guide, so it outlives the redesign",
      width: 6544,
      height: 2663,
    },
    { kind: "story", body: ["This ended up being one of the less visible but most important parts of the project since it helped the team actually build faster."] },
    { kind: "sectionHeading", eyebrow: "proof", heading: "The best test of the system happened by accident" },
    {
      kind: "story",
      body: [
        "At one point, the team suggested another page we should add. Before the system, designing a new page like that would usually take me around 2–3 hours. This time, most of the decisions had already been made. I grabbed the right template, dragged in the existing components, configured the content, and had the page designed in about 10 minutes.",
      ],
    },
    { kind: "ratio", before: "2–3 hrs", beforeLabel: "to design a new page, before", after: "~10 min", afterLabel: "to design a new page, after" },
    {
      kind: "story",
      eyebrow: "deliverables",
      heading: "More than CarInsurance.com's first design system",
      items: [
        "670+ reusable components, variants, states, and design assets",
        "10 reusable page templates",
        "10 redesigned insurance calculators",
        "responsive and implementation documentation",
        "150+ UX opportunities identified through research and audit",
        "updated branding guidelines",
        "a system implemented component-by-component in React Storybook",
      ],
    },
    {
      kind: "story",
      eyebrow: "impact",
      body: ["But the numbers I care about more are what happened after the redesign went live.", "In the month after launch compared with the month before:"],
      items: ["13% more organic traffic", "18% more insurance quote requests"],
    },
    {
      kind: "story",
      body: [
        "And internally, a common new page that had taken roughly 2–3 hours to design could now be assembled in around 10 minutes.",
        "The traffic and quote-request numbers are before/after measurements rather than a controlled experiment, so I don't treat the redesign as the only possible cause. But alongside the usability improvements and internal workflow changes, they were a strong signal that the new foundation was moving things in the right direction.",
      ],
    },
    {
      kind: "quote",
      text: "In my six years here, this is the smoothest design-to-development handoff we've ever done.",
      attribution: "Product Manager, CarInsurance.com",
    },
    {
      kind: "insight",
      eyebrow: "takeaways",
      heading: "I hate doing the same thing over and over. I love making systems so I don't have to",
      body: [
        "This project was probably the first time I realized how much of my design instinct comes from that. If I'm making the same decision repeatedly, I want to understand the rule underneath it and make the next decision unnecessary.",
        "Sure, making the design system was tedious at first. But it quickly snowballed and created so much leverage to build faster and smoother. I also learned that a good design system shouldn't feel bureaucratic or strict. It gets the boring decisions out of the way so I can spend more time solving the interesting problems.",
      ],
    },
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
    { kind: "youtube", id: "vXNB0LHcTrA", caption: "Beyond: video demo" },
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
          caption: "profile and connect, localized: accessibility was part of the brief",
          width: 1400,
          height: 522,
        },
      ],
    },
    {
      kind: "flag",
      text: "I used the clearest artifacts from your export: the user flow diagram and two feature-screen montages. I skipped a duplicate re-export of the persona sheet already shown above, and a set of generic competitor-logo thumbnails from the market research slide that didn't add anything beyond the text already here.",
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
      caption: "the moment buyers actually tune in for: disconnected from the purchase that led to it",
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
        "Creator Discovery: help users discover creators, browse live streams, and decide who to watch",
        "Creator Storefront: turn viewers into customers through live shopping, pack purchases, and order tracking",
        "Creator Queue: the operational side that allows creators to manage purchases, process orders, and fulfill pulls without disrupting their stream",
        "Creator Dashboard: give creators visibility into referrals, payouts, campaigns, and business performance",
        "Community Dashboard: help creators understand and celebrate their community through collection insights, milestones, and audience engagement",
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
export const baseProjects: Project[] = [
  {
    slug: "chance-live",
    number: "01",
    title: "Designing a second chance for an accidental swipe",
    tagline: "Fixing a critical retention problem in my first 15 hours at a Pokemon card startup",
    company: "Chance.live",
    role: "Systems Designer, Product Growth Strategist",
    year: "2026",
    result: "Review decisions before an irreversible sale",
    metrics: [
      { value: "1–5 cards", label: "review states designed" },
      { value: "15 hrs", label: "problem identified to shipped fix" },
    ],
    discipline: "product, systems",
    content: chanceLive,
    size: "md",
  },
  {
    slug: "carinsurance-com",
    number: "05",
    title: "I rebuilt how 200 pages were made for a 20 year old site",
    tagline: "Rebuilding CarInsurance.com without sacrificing growth, SEO, or accessibility",
    company: "QuinStreet",
    role: "Product Designer",
    year: "2024",
    result: "13% more organic traffic, 18% more quote requests, new pages down from 2–3 hours to about 10 minutes",
    metrics: [
      { value: "13%", label: "more organic traffic" },
      { value: "18%", label: "more quote requests" },
      { value: "2–3 hrs → 10 min", label: "to design a new page" },
    ],
    discipline: "product, design systems",
    content: carInsurance,
    size: "md",
  },
  {
    slug: "adem-user-list",
    number: "02",
    title: "Seven ways in, one place to investigate",
    tagline: "Consolidating a fragmented enterprise experience in network security",
    company: "Palo Alto Networks",
    role: "Product Design Intern · Lead Designer, ADEM",
    year: "2025",
    result: "Cut a common lookup from 8 clicks and 23 seconds to 2 clicks and 5, consolidating 7 entry points into 1",
    metrics: [
      { value: "8 → 2", label: "clicks for a common lookup" },
      { value: "23s → 5s", label: "prototype task time" },
      { value: "~30 sec", label: "estimated savings across the ticket workflow" },
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
    title: "Making crypto disappear",
    tagline: "Cutting the deposit flow from seven clicks to three, shipped in two days",
    company: "Chance.live",
    role: "Systems Designer, Product Growth Strategist",
    year: "2026",
    result: "Deposit flow cut from 7 clicks to 3, signup-to-deposit conversion up 81%, shipped in 2 days",
    metrics: [
      { value: "7 → 3", label: "clicks, saved-card flow" },
      { value: "+81%", label: "signup-to-deposit conversion" },
      { value: "1.8×", label: "order volume, first week" },
      { value: "2 days", label: "brief to shipped" },
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
    number: "-",
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

const projectEdits = overrides as Record<string, Partial<Project>>;
export const projects: Project[] = baseProjects.map(p => ({ ...p, ...projectEdits[p.slug] }));

export function getSelectedProjects() {
  const rank = (p: Project) => p.order ?? (SELECTED_SLUGS.includes(p.slug) ? SELECTED_SLUGS.indexOf(p.slug) : 99);
  return projects.filter(p => !p.unlisted && (p.featured ?? SELECTED_SLUGS.includes(p.slug))).sort((a,b) => rank(a)-rank(b));
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
