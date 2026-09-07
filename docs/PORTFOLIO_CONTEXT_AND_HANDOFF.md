# Portfolio context and handoff

Updated: 2026-09-05

This file is the durable handoff for the portfolio work. It combines the user's product/design constitution, the repository audit, explicit decisions, implementation status, and the work previously planned by the agent in this session.

## Important provenance note

The source for the prior assistant's recommendations is this conversation, supplemented by repository evidence. The user referred to the prior assistant as “Astro.” A separate repository transcript is not required to preserve those recommendations. Planned work must remain distinguished from implemented and verified work.

## User's mandate

Treat the current portfolio as raw material, not a specification. Preserve strong content, truthful evidence, Vyomi's voice, useful interaction ideas, and components that genuinely work. Challenge all visual presentation. The goal is a full redesign with a rigorous shared system and a few ambitious art-direction swings inside it.

The finished site should feel cerebral, alive, authored, specific, technically competent, experimental and playful in controlled ways. It must not feel like a generic designer template, confusing art website, beige recruiter portfolio, AI startup, scrapbook, gimmick, or collection of unrelated effects.

The hierarchy is:

> intrigue → credibility → personality → delight

Utility is fixed: work must be easy to find, value must be understandable quickly, location must be obvious, contact must be easy, and case studies must be comfortable to read.

## Professional identity

Vyomi's internal identity ranking:

1. problem solver
2. product designer
3. systems thinker
4. maker
5. creative person
6. engineer
7. startup operator

The site should demonstrate curiosity, creativity, intelligence, resourcefulness, technical competence, discernment, questioning assumptions, shipping, learning quickly, and seeing relationships others miss. Do not claim these with empty branding or generic phrases. Show them through evidence and the product itself.

The working hero thesis remains valid as source material:

> i use design as a medium to take messy problems apart, understand the system underneath, and fit the pieces together so they work better

Do not rewrite this into corporate copy without explicit approval.

The operating method underneath the work is: question the premise, gather evidence, understand the system, decompose, synthesize, make it real, observe, iterate and document. Case studies should reveal this method rather than create a standalone process manifesto.

## Product structure and V1 scope

The homepage is the complete selected-work portfolio. All four primary case studies must be visible from Home, and the first case study must be reachable in one click. Work previews lead with outcomes before visual craft. A small Brain preview follows the work. Home has a clear contact path and contextual navigation.

The four primary projects are:

- Chance.live — accidental swipe / card selling flow
- CarInsurance.com — design system and calculator redesign
- ADEM User Device List — Palo Alto Networks enterprise investigation flow
- Chance.live deposit flow — Making crypto disappear

Secondary work can remain in source material, but should not expand the primary V1 journey. The homepage redesign is explicitly prioritized **after the case studies**, ahead of Brain, About, CMS and broad polish. The user is running low on credits, so each batch should stay focused.

V1 now includes ambitious art direction: stronger thumbnails, work cards, evidence visuals, selective effects, GIFs and videos where they genuinely clarify the work. Missing recordings must not block the portfolio or lead to fabricated product footage. Use available artifacts, truthful diagrams and static comparisons when necessary.

## Brain

Brain is a playground, collection, and way to understand Vyomi's influences and personality. It may remain abundant, but public visibility must be intentional. The desired semantic dimensions are separate:

- domains: Design + Technology, Music, Writing + Ideas, Art + Craft, People + Community, Life
- relationship: made, thought, experienced, collected, loved, learned, etc.
- type: note, memory, photo, event, album, object, project, review, email, experiment, letter, etc.
- tags: cross-cutting themes
- status: featured, published, draft, private, archive, graveyard
- related objects: explicit relationship data

The current code has 138 objects, 134 public and 4 marked private, but only a private boolean and fuzzy single-domain resolver. Existing relationship data lives in homepage layout edges; object `relatedIds` are unused. Do not confuse these dimensions during redesign.

The public Brain should have better filters, more prominent view controls, coherent browsing, useful metadata, robust shared rendering, eventual relational exploration, and a casual contact element. The casual contact link supplied by the user is:

https://cal.com/vyomi-seth/brainchat

Full graph exploration, new 3D systems, sound, endless physics tuning, and independent redesign of every object are deferred unless they solve a real V1 blocker.

## Navigation

The user accepted the recommendation for contextual navigation behaving primarily as a navigable outline of the visitor's current place. It should improve navigation first, then context, personality and utility. Home, email/contact and current location must remain obvious. Desktop and mobile need one information model; mobile cannot simply hide the desktop rail.

The user accepted contained object behavior as the supporting expression. This is an art-direction recommendation, not permission to add unrelated novelty. The contextual outline and contained object behavior are the working two-motif system.

## About and contact

About should provide context and narrative without becoming a second homepage, résumé, Brain, or manifesto. Keep specific personal material that connects the person to the work. The professional contact/scheduling link supplied by the user is:

https://cal.com/vyomi-seth/let-s-talk

Email should remain one action away globally. Avoid generic “let's make something beautiful” copy; the current implementation was changed toward “Have something in mind?” but the final redesign remains open.

## Evidence corrections supplied by the user

- The guessed `$5,000 prevented accidental swipes` metric is withdrawn. Do not replace it with an invented “20% fewer support tickets” claim. A defensible framing is that the design made accidental sales reviewable/recoverable before an irreversible transaction.
- Deposit click-count definition: from opening the modal to having balance added, excluding card-provider clicks and assuming saved card information.
- Remove the “98% closed the modal” claim. The forced modal was tested with team members; they disliked having a payment modal open in their face. This is a team reaction, not a user-study percentage.
- Missing product recordings/images are a real constraint. Use a mixture of available artifacts and clearly identified diagrams/placeholders until better captures exist.
- ADEM is the only case study to protect. Use one shared password.

## ADEM protection decision and implementation status

The intended behavior is a short public ADEM overview, with the full article and original assets behind one shared password. Other case-study access remains unchanged.

The current working tree contains an implementation attempt:

- `src/lib/case-study-access.ts` signs an eight-hour HttpOnly cookie using `ADEM_CASE_STUDY_PASSWORD`.
- `src/app/work/adem-user-list/access/route.ts` accepts the password and supports locking the session.
- `src/app/protected-media/adem-user-list/[filename]/route.ts` serves protected media only after access validation.
- `src/components/case-study/ReviewerAccess.tsx` renders the short overview/password form.
- `src/app/work/[slug]/page.tsx` gates ADEM and renders the overview when locked.
- ADEM media was moved from `public/case-studies/adem-user-list` to `content/protected/adem-user-list`.
- `next.config.ts` includes protected media for deployment tracing.
- `src/proxy.ts` attempts to block protected paths through the image optimizer.
- `docs/REVIEWER_ACCESS.md` documents configuration and limitations.

The generated password is in ignored `.env.local`; never put it in a public document, URL, client variable, or git commit. Production must define the same `ADEM_CASE_STUDY_PASSWORD` environment variable. Verify the gate in a fresh browser, verify unauthorized protected media returns 401/404, verify authorized article media loads, and verify the production build before treating this implementation as shipped. Previously deployed/public copies cannot be recalled from browsers or old CDN deployments.

## Existing repository and audit findings

Stack: Next.js 16.3.1, React 19.2.8, TypeScript, Tailwind 4, Motion, GSAP, Lenis, Three/R3F and postprocessing. Content is primarily hardcoded TypeScript (`src/lib/projects.ts`, `src/lib/brain/objects.ts`) with local spreadsheets/manifests in `portfolio-file-exchange`. No hosted CMS, database, auth library or editor was found.

The audit checked all concrete routes at desktop/mobile sizes, tablet layouts, filters, reduced motion, keyboard behavior and all 134 public Brain objects. The durable audit is [PORTFOLIO_AUDIT.md](./PORTFOLIO_AUDIT.md); evidence is in [audit/](./audit/).

Highest-impact known issues:

- Private Brain records/media were included in Home-delivered client data before the redesign work.
- The current desktop/mobile navigation lacks direct global email and mobile context.
- 768px layouts let the rail and gutters starve content; Brain float overflows at that width.
- ADEM outcome chips clip on mobile.
- Brain eagerly loads approximately 241 MB of media responses in one observed desktop visit.
- Reduced-motion mode still changes gallery images on a timer.
- Brain grid/focus disagree on content, titles, captions and density; long objects become extreme mobile pages.
- Several articles contain internal production notes and visible asset placeholders.
- Case-study section navigation is incomplete because only `sectionHeading` blocks become stops.
- About is long and repeats positioning/contact ideas.

## Planned order of work

1. Finish and verify ADEM password/media protection and factual corrections.
2. Redesign case-study presentation as a shared system: strong 15-second layer, clear 2-minute narrative spine, comfortable full article, meaningful evidence hierarchy, and selective ambitious art direction.
3. Redesign the homepage next, explicitly before Brain/About/CMS. Keep all four projects visible, lead with outcomes, add stronger authored thumbnails/cards, replace the unresolved Brain preview with a contained and useful preview, and preserve contact/navigation utility.
4. Redesign Brain rendering/filter/view system and publication model.
5. Resolve About/contact as a distinct narrative.
6. Add a lightweight structured editing workflow only after the public content model is stable.
7. Perform subtraction, motion, responsive, accessibility and performance QA across every route.

Do not spend this batch on a full graph, new WebGL system, sound, broad archive promotion, heavyweight CMS, or custom video for every project.

## Current design decisions

The canonical decision log is [V1_DECISIONS.md](./V1_DECISIONS.md). The short version:

- Full redesign authority granted; existing presentation is not binding.
- Preserve voice, truthful evidence and useful content.
- Contextual outline navigation is the recommended model.
- Contained object behavior is the recommended expression.
- Four selected projects define the primary journey.
- ADEM alone is password protected with one shared password.
- Casual Brain contact uses `brainchat`; professional contact uses `let-s-talk`.
- Local lightweight editing is the current CMS recommendation.
- Homepage redesign follows case-study work.

## Astro handoff status

The prior assistant's audit and recommendations are captured in this conversation and the linked documents. The full visual redesign remains pending. ADEM protection and evidence corrections have code in the working tree, but browser verification of that implementation was not completed before the planning/documentation turns. The current execution order and remaining decision round are in `V1_EXECUTION_PLAN.md`.
