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

export type Project = {
  slug: string;
  number: string;
  title: string;
  company: string;
  role: string;
  year: string;
  result: string;
  discipline: string;
  content?: CaseStudyContent;
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
        "A single accidental swipe could cost users $5000+. This irreversible action was causing them to leave.",
      ],
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
      kind: "story",
      eyebrow: "design exploration",
      heading: "Designing feedback instead of adding friction",
      body: [
        "I wanted to experiment with spacing and various flows, while being mindful of how elements changed on desktop and mobile, and how placement changes depending on how many cards are opened.",
        "I briefly explored a layout where cards went to the side they were swiped to, and users could drag them around, similar to the physical sensation of opening a card pack. This layout would have required element changes for mobile, which we wanted to avoid to reduce lag and system complexity.",
      ],
    },
    { kind: "cardStateInspector" },
    {
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
      kind: "constraint",
      eyebrow: "technical considerations",
      heading: "Designing with desktop and mobile implementation in mind",
      body: [
        "Because I was working directly with the front end developer, implementation was part of the design process from day one. I explored a concept where cards physically moved to different piles depending on where users swiped them, mimicking the feeling of sorting real trading cards on a table.",
        "While the interaction felt playful, it introduced additional complexity across mobile layouts and multiple card count scenarios. The additional engineering effort and state management didn't justify the value it created for users. Instead, I focused on solutions that delivered the same feeling of confidence and control while remaining technically lightweight.",
        "On mobile, the minimum height of this element should be 440px, max height, so the confirm button is in the same place each time, for a consistent UX.",
      ],
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
  ],
};

const ademUserList: CaseStudyContent = {
  heroLine: "I designed a new ADEM User List Page, consolidating 7 fragmented workflows into one intuitive interface. This redesign improved IT admin efficiency, cutting task completion times by 80% and saving 30 seconds per ticket across enterprise scale deployments.",
  heroImage: { src: "/case-studies/adem-user-list/fragmented-dashboards.webp", alt: "Three fragmented ADEM dashboards showing application experience, connectivity and user data", width: 2048, height: 1229 },
  facts: [
    { label: "company", value: "Palo Alto Networks" },
    { label: "role", value: "Lead Product Designer" },
    { label: "team", value: "1 product manager, 12 developers, IT admin subject matter experts" },
    { label: "duration", value: "6 weeks, July to September 2024" },
  ],
  blocks: [
    {
      kind: "story",
      eyebrow: "context, background",
      heading: "Palo Alto Networks is a global leader in cybersecurity with 20,000+ employees",
      body: [
        "Its Autonomous Digital Experience Management (ADEM) features within the platform Strata Cloud Manager help Fortune 500 IT admins troubleshoot user connectivity.",
        "Unlike consumer apps, enterprise security software is dense, technical, and high stakes. Admins need clarity, speed, and trust to resolve problems that can affect thousands of employees at once. My challenge was to design a new page within ADEM that addressed one of the longstanding pain points for cybersecurity IT admins.",
      ],
    },
    {
      kind: "story",
      eyebrow: "the problem",
      heading: "Disjointed workflows slowed ticket resolution, cognitive overload. High friction risked enterprise adoption and contract renewals.",
      body: [
        "The existing pathway to access user device data was fragmented across 7 separate workflows. IT admins reported that finding basic data often required 40+ seconds and multiple tabs, increasing Mean Time to Ticket Resolution (MTTR).",
      ],
    },
    { kind: "statement", heading: "How might we clarify complex ADEM workflows and navigation to significantly improve our customer understanding and troubleshooting efficiency?" },
    {
      kind: "story",
      eyebrow: "the solution",
      heading: "One consolidated User Device List Page",
      body: ["I led the end to end design of a new User Device List Page, consolidating multiple workflows into a single, simplified interface."],
      items: [
        "Streamlined navigation: 7 workflows into 1 page",
        "Restructured information hierarchy for faster scanning",
        "Common task, finding a user device at a specific point in time: 80% fewer clicks (8 to 2)",
        "Faster backend due to limited data shown",
        "Designed with AI integrations to reduce manual input and surface insights faster",
      ],
    },
    { kind: "image", src: "/case-studies/adem-user-list/unified-list.webp", alt: "The new unified ADEM User Device List page", caption: "The new user list page", width: 1763, height: 980 },
    { kind: "ratio", before: "7", beforeLabel: "separate workflows", after: "1", afterLabel: "consolidated page" },
    { kind: "ratio", before: "8", beforeLabel: "clicks to find a device at a point in time", after: "2", afterLabel: "clicks for the same task, an 80% reduction" },
    { kind: "image", src: "/case-studies/adem-user-list/timeline.webp", alt: "Six week project timeline", caption: "6 week sprint, July to September", width: 2048, height: 444 },
    {
      kind: "story",
      body: ["Due to confidentiality, not all artifacts are publicly available. Please reach out if you'd like to discuss details of the design process."],
    },
    { kind: "flag", text: "This is your shortest real case study source, mostly summary bullets rather than full narrative. If you have more of the process (research, iterations, testing) worth adding, send it over." },
  ],
};

const carInsurance: CaseStudyContent = {
  heroLine: "Turning 200+ inconsistent pages into a scalable design foundation that improved conversions, increased organic traffic, and changed how the team shipped product.",
  heroImage: { src: "/case-studies/carinsurance-com/atomic-system.webp", alt: "A dense sheet of CarInsurance.com UI components and page explorations", width: 2048, height: 1035 },
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
      kind: "story",
      eyebrow: "redesigning core experiences",
      heading: "Redesigning 10 multi step insurance calculators",
      body: [
        "The calculators were some of the highest value experiences on the site, but also some of the most frustrating. User interviews consistently surfaced abandonment, especially on mobile. One example was the Moving Calculator. The original flow relied on incomplete logic, failed to account for important variables that affect insurance rates, and forced users through a lengthy experience with little feedback.",
      ],
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
  heroImage: { src: "/case-studies/internship-wrapped/cover.webp", alt: "My Summer at Palo Alto Networks, By the Numbers, title slide", width: 2048, height: 1456 },
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
  heroImage: { src: "/case-studies/beyond/screens.webp", alt: "Beyond app screens: onboarding, login, and skills assessment", width: 2048, height: 1571 },
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
    { kind: "flag", text: "Your source mentions a “Video demo”, if you have the actual demo file/link, send it and I'll embed it here." },
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
    { kind: "image", src: "/case-studies/beyond/personas.webp", alt: "Four user personas: Chun Ho Li, Carissa White, Maria Gonzalez, and Jessica Thompson", caption: "Four user personas built from the survey and affinity mapping", width: 1843, height: 2048 },
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
    content: chanceLive,
  },
  {
    slug: "adem-user-list",
    number: "02",
    title: "ADEM User List Page",
    company: "Palo Alto Networks",
    role: "Lead Product Designer",
    year: "2024",
    result: "80% fewer clicks, 30 seconds saved per ticket",
    discipline: "enterprise, systems",
    content: ademUserList,
  },
  {
    slug: "carinsurance-com",
    number: "03",
    title: "CarInsurance.com",
    company: "Quinstreet",
    role: "Product Designer",
    year: "2024",
    result: "13% more organic traffic, 98% faster page creation",
    discipline: "product, design systems",
    content: carInsurance,
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
    content: internshipWrapped,
  },
  {
    slug: "beyond",
    number: "05",
    title: "Beyond",
    company: "Catalyst Designathon",
    role: "UX Designer",
    year: "2024",
    result: "Honorable Mention out of 87 teams",
    discipline: "social impact, research",
    content: beyond,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
