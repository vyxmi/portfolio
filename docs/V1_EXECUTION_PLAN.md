# V1 execution plan

Updated 2026-09-05 after the user's explicit instruction to complete the full redesign efficiently and plan/ask the remaining questions first.

## Authority and priorities

Full visual and interaction redesign is authorized. Preserve voice, truthful evidence and useful content; current presentation is not a specification. Strong art direction is required. No speculative metrics or fabricated product recordings. The existing audit stands; do not repeat it as a substitute for implementing.

Order requested: pending changes → case studies → homepage → contextual sidebar → footer → Brain → About. Content editing, motion, accessibility and performance remain in V1 scope. Design shared foundations and navigation contracts upfront, then implement visible batches in this order. All-at-once edits would make regressions harder to isolate; share primitives instead of multiplying page-specific systems.

## Proposed art direction, awaiting preference

An editorial portfolio built around evidence: confident typography, deliberate image scale, asymmetric compositions within a strict grid, crisp rules, annotations where they explain a decision, and objects presented with physical presence. Case studies remain quiet; Home uses larger visual contrasts; Brain holds abundance. The sidebar should reveal context through its destinations and states.

Three bounded visual explorations within that system:

1. Case-study openings that juxtapose the decisive change, delivery context and a strong artifact, with the full narrative beneath.
2. Work previews with individual compositions derived from each project's actual transformation: deposit 7→3; ADEM seven paths→one context-preserving list; CarInsurance repeated pages→reusable system; Chance swipe→review→confirm. Schematics must read as explanatory graphics, not counterfeit product interfaces.
3. A small Home collection of real Brain objects with deliberate grouping and a direct path into the collection. Preserve existing relationship edges for reuse; retire the current hover-gated field from Home.

Alternative direction for the user's choice: a more technical instrument-panel presentation, using dense indexing, controlled state readouts and diagrammatic composition. It emphasizes engineering but risks making the human material feel secondary. The editorial direction is recommended.

Existing fonts and palette remain a development baseline. Any major replacement needs a concrete proposal; the redesign is not contingent on replacing them.

The user explicitly authorizes React Motion and any graphics/shader/visual libraries needed. Use the installed `motion` package for interactions; Three/R3F, GSAP and postprocessing are already available. This permits evaluating the right tools without another dependency approval round. It does not require a shader or relax the novelty budget, stable reading, accessibility, reduced-motion or performance requirements. Major new WebGL systems still need a concrete conceptual proposal; supporting visual implementation is an engineering decision.

## Batch acceptance criteria

| Batch | Work | Done when |
|---|---|---|
| 1. Pending | Finish ADEM gate, asset access and evidence corrections; repair handoff inaccuracies; close private Brain data exposure | Fresh unauthorized browser cannot retrieve ADEM body/assets, correct password unlocks, wrong password fails, lock works, optimizer cannot bypass; private Brain records/media are excluded from public delivery; supplied factual corrections appear consistently |
| 2. Case studies | New article opening, evidence hierarchy, section semantics, reading widths, media presentation and consistent interaction; remove internal production notes from public rendering | Four primary cases support quick evaluation and comfortable full reading; all sections remain reachable; real assets are legible; missing optional media does not render a fake interface or production note |
| 3. Home | New composition, outcome-led work previews and bespoke truthful thumbnails, hero presentation, small Brain preview | Four primary cases visible, direct entry, visible professional orientation and contact; desktop/tablet/mobile feel deliberately composed |
| 4. Navigation | Persistent contextual outline and compact mobile equivalent | Home/email always available, active route/section indicated, article contents available on mobile, Brain state/context useful, no hover-only essentials |
| 5. Footer | Consolidate redundant information and implement shared contact ending | One coherent ending; supplied contact links work as destinations; no duplicate rail padding or competing CTA systems |
| 6. Brain | Publishing/schema, shared rendering contract, filter/view redesign, media optimization, modal accessibility and 134-object cleanup | Correct multi-domain filtering, publication boundaries, useful previews/full content, stable media, no known overflow/focus defects; CSV updated for every published object |
| 7. About | Current chapter, selected trajectory, specific personal context and formal contact | Distinct purpose; no second homepage/Brain or repetitive manifesto; existing voice/source material retained |
| 8. Editing and final QA | Local content editor, validation, media/status management; subtraction, motion and route QA | Brain/project/site metadata editable without page-code changes; drafts/private/archive/graveyard don't publish; all routes checked at relevant widths; reduced motion/keyboard/media/loading verified |

For each batch: scoped type/lint checks plus desktop/mobile browser inspection. Security behavior needs actual negative and positive tests. Final production build and route sweep are required. Do not call work finished solely because typechecking passed. Do not deploy or publish without appropriate authorization.

## Known state before implementation resumes

Historical baseline below. Superseded implementation status is recorded in `ART_DIRECTION_RESET.md`; the local content editor is now implemented and browser-tested, including article editing, uploads, publication controls and undo. Do not rebuild it or reopen the technology choice.

- The app already had a large dirty working tree before the audit. Preserve unrelated user changes.
- Audit complete; all 134 public Brain objects inventoried. No reason to repeat discovery.
- Password scope finalized: only ADEM, one shared reviewer password in ignored `.env.local`. Never print or commit its value.
- Gate implementation exists, but browser security verification is still pending.
- Current primary project order: deposit, ADEM, CarInsurance, Chance accidental swipe. Beyond is secondary; a previous handoff incorrectly listed it as primary and has been corrected.
- Hero thesis retained. Full visual redesign has not yet been implemented.
- Work previews, article rendering and nav still largely reflect the old implementation.
- Editorial moves/cuts remain subject to the user's voice-preservation boundary unless expressly approved in the remaining question round.
- Local editor was accepted as a recommendation, but the exact upload/publish workflow has not been implemented.
- Contact destinations: professional `https://cal.com/vyomi-seth/let-s-talk`; casual Brain `https://cal.com/vyomi-seth/brainchat`; email `vyomi.seth@gmail.com`.

## Remaining decision round

Ask only about the proposed art-direction emphasis and permission to move repeated/tangential article material into optional detail while preserving words. Do not ask again about password scope, measurements already corrected, contact URLs, primary projects, sidebar mental model, or microdesign choices.

## Deferred

New WebGL/physics/sound systems; comprehensive work archive promotion; full Brain graph; live listening APIs; general-purpose page builder; a new video for every project. Stronger thumbnails, authored diagrams, meaningful motion and carefully selected GIF/video are explicitly in scope.
