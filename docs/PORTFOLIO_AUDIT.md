# Portfolio V1 audit

Audit date: 2026-09-05 (session date). Review of the existing, modified working tree; no application code or content changed. Recommendations are proposals, not approved conceptual decisions.

## Scope and evidence

- Next.js 16.3.1 / React 19.2.8 / TypeScript / Tailwind 4. Read installed Next.js Playwright guidance. Used cached Playwright and Chromium against the existing development server at localhost:3000.
- Inspected all 13 concrete pages at 1440×900 and 390×900, plus invalid project routing. Captured full-page screenshots except the Brain wall. Checked Home, About, Brain and the four selected articles at 768 and 1024px. Checked float view at 390, 768, 1024px.
- 138 Brain records in this checkout, 134 publicly rendered, four marked private. Checked every public record against local media, captured each grid card and expanded state, and reviewed contact sheets. Per-object inventory: `audit/BRAIN_OBJECTS.csv`. Shared issues apply to every listed record even when no additional object-specific defect was found.
- All 13 pages returned 200; unknown project returned 404. No broken image requests in the desktop/mobile route pass. This does not mean all intended assets exist: placeholder components deliberately replace missing content.
- TypeScript check passes. `eslint src` passes without warnings. Repository-wide lint exits successfully with 444 warnings from imported source/export JavaScript; source archives need lint exclusion. No production build or production Core Web Vitals certification in this audit. No live deployment, external-link availability, Safari, actual iOS safe-area or physical-device GPU certification.
- Screenshots/raw browser observations remain in `/tmp/portfolio-audit`; selected durable evidence is in `docs/audit`. Development indicator visible in screenshots is not portfolio UI. Tall-card screenshots sometimes include an overlapping sticky filter bar; that is capture/scroll positioning, not corruption of the source image.

## Preserve

1. The hero's actual thesis and lowercase voice. It is specific; rephrasing is not the prerequisite for improving its presentation.
2. Four direct selected-work links, existing order, real outcome data, shared Home/Work card renderer.
3. The paper reading surface / dark Brain distinction, restrained blue family, Schibsted Grotesk and DM Mono as the baseline. No font or major palette replacement needed for V1.
4. Flexible typed article blocks, genuine media, comparisons tied to actual decisions, source-specific prose. The articles contain evidence of diagnosis, tradeoffs, collaboration and delivery.
5. Brain stable IDs, source metadata, media references, full original text, 19 reusable vessel kinds. Preserve useful vessel expression without treating all current sizing/interaction rules as sacred.
6. Homepage relationship edges in `src/lib/brain/homeLayout.ts`. No objects currently populate `relatedIds`; migrate the existing explicit edges rather than pretending relations already exist in the object schema.
7. Existing keyboard triggers, Escape handlers, global focus outline, server-side Brain-page filtering, WebGL capability/visibility checks. Useful foundations, but not complete accessibility/privacy guarantees.
8. About's real photos and specific experiences, especially tutoring, radio, making and collaborating. The supporting material is better than its present organization.

## Architecture inventory

| Layer | Current implementation | Implication |
|---|---|---|
| Routes | Home, About, Brain, Work; nine project slugs | Four selected projects coexist with five secondary/unlisted articles |
| Shell | Root MobileNav; SideRail and SiteFooter repeated by pages; pathname-keyed PageTransition | Desktop rail remounts instead of persisting; footer sometimes reserves rail width twice |
| Navigation | Home/Brain/About; article context derives only from sectionHeading blocks | Section semantics and navigation disagree; home selected work is absent as a contextual stop |
| Typography | Two Google fonts through next/font; tokens plus many inline/Tailwind sizes | Stable foundation, weak consistent roles; body usually 16–17px, measure 640px, article max 768px |
| Case studies | All content in 2,211-line projects.ts; discriminated block union and shared dispatcher | Preserve grammar; split content by project before introducing a new authoring format |
| Brain | objects.ts, types.ts, fuzzy domainFor(), private boolean | Data source and publication need separating; type, relation, domain and lifecycle are conflated/missing |
| Source material | Local Brain CMS XLSX, rendering-rules XLSX, intake XLSX and media manifests | Existing editing precedent is a spreadsheet, but no maintained import/editor workflow found |
| Assets | public/brain originals; case-study images mostly next/image; raw media has no dimensions in schema | Grid eagerly loads originals, galleries multiply cost, private media is also public |
| Motion | Motion, GSAP, Lenis, Three, R3F, postprocessing; CSS transitions and custom motionField | Already more than enough tooling; multiple systems drive related transforms and timing |
| Deployment | Local .vercel linkage; default Next config; generic README | Vercel is evidenced, but deployment/publish workflow and live production state remain unverified |
| Editing | No admin/API/database/auth/CMS dependency found; Home has ?edit=1 copy-layout tool | Layout authoring is not a CMS; don't build a second general layout editor |

## Prioritized findings

A bug; B system; C hierarchy/UX; D visual craft; E content; F V2; G subtract. Impact/cost/tuning: critical/high/medium/low. Page counts refer to current public route surface; Brain object counts noted separately.

| ID | Class | Finding and evidence | Impact | Cost | Tuning | Affected |
|---|---|---|---|---|---|---|
| P01 | A/B | HomeBrainCanvas is client code importing all objects. Browser-delivered JS contains all four private records, despite visual filtering. Three private media files also exist under public/brain. | Critical | M | L | Home + assets |
| P02 | A/B | chance-creators returns 200 and generateStaticParams includes it; its own note calls source private. unlisted is discovery-only. | Critical pending intent | L–M | L | 1 |
| P03 | E/G | Internal author/assistant notes rendered as flag blocks on six articles, including Chance summary. Remove from public presentation into editorial inventory. | H | L | L | 6 |
| P04 | E/A | Deposit: five standalone placeholders, plus two hasImages steppers whose schema has no image source field; leading work card has no hero image. ADEM entry-states placeholder; Chance inspector has no screenshots in any of its five states. | H | M | L–M | 3 articles + Home/Work |
| P05 | B/C | Direct email missing from both global navs; lives at footer/About. Brain sidebar receives only meta, which hasContext ignores, leaving it empty below global links. | H | M | M | 13 |
| P06 | B/C | Mobile loses all article contents, section state and project context. Dock is three links in a four-column grid and lacks safe-area inset treatment. | H | M | M | 13 |
| P07 | A/B | 768px rail+gutters leaves ~360px content, but work uses two columns. Brain float scrollWidth 967px at viewport 768px, with visible vessel collisions. | H | M | M | Home/Work/Brain; article width also compromised |
| P08 | A | ADEM long outcome chip uses whitespace-nowrap inside overflow-hidden card; text clipped at 390px. | H | L | L | Home/Work |
| P09 | A/B | Chance summary has zero sectionHeading blocks, hence no article contents; deposit has only four stops, omitting intervention/outcomes. Story/insight headings render as p, not semantic headings. | H | M | L | 9 articles |
| P10 | A/B | BrainFocus lacks dialog semantics, focus containment and trigger restoration. Keyboard closing returns focus to body. Zoomable has dialog semantics but no focus management. | H | M | L | Brain/Home; article/About images |
| P11 | A | Filters/views expose no aria-pressed; nav current state is only data-active. Brain and Work have no h1. No skip link found. | M | L | L | 13 |
| P12 | B | Grid uses raw eager img for all gallery frames; published references total 266.45 MiB on disk. No source dimensions or thumbnail variants. | H | M | L | Brain |
| P13 | A/B | 3.2-second gallery timer continues under reduced motion; browser verified changing images. Root wall rerenders regularly; images can resize until all gallery dimensions load. | H | M | L | Brain, 134 objects |
| P14 | B/C | Domain heuristic assigns one domain; all events route to community, unknown items default there, art/photography route to design; no Life domain. Filtering counts work, semantics do not match brief. | H | M | L | Brain, 134 objects |
| P15 | B | Only private boolean plus unrelated state/weight/homeFeature; no published/draft/archive/graveyard boundary, relationship or tag schema. | H | M | L | Content system |
| P16 | A/E | dateLabel invents Aug 2026 when absent (10 public objects). Exact ISO-date parsing uses timezone-sensitive Date, allowing previous-day display. | M | L | L | Brain |
| P17 | A/B | B-0148 contentEntries omitted by grid renderer (only title visible); text-only playlists B-0117/B-0118/B-0120/B-0122 render duplicate heading paths. | M | L | L | Brain, 5 objects |
| P18 | B/C | Grid throws away image captions/context and title-display intent, then opens a different vessel representation. Long notes render in full, creating extreme column heights; mobile wall ~41,666px. | H | M | M | Brain |
| P19 | E | 35 public records contain empty image alts; B-0023/B-0092/B-0136 lack title/content context. Grid accessible labels for contextless items become Open untitled. | M | M | L | Brain |
| P20 | B/C/G | Home Brain section is a large hover-discovery field, initially only three revealed nodes; on narrow screens content falls outside field, leaving mostly a note and whitespace. Useful relation data, poor preview. | H | M | M | Home |
| P21 | C/D | Work outcome chips subordinate to large hero/cropped images; first card has blank placeholder. Hero inline-block phrases create awkward narrow wrapping and punctuation at tablet sizes. | H | M | M | Home/Work |
| P22 | C/E | About repeats positioning, philosophy and personal lists, then repeats identical contact headline again in footer. ~6,390px desktop / 7,487px mobile. | M | M | M | About |
| P23 | B/D | Footer owns desktop rail padding even within already padded About/Brain/Work/article wrappers; alignment differs from Home. | M | L | L | 12 |
| P24 | B/D/G | Per-word flips/stretch, custom cursor notes, route entry, pervasive blur/reveal, gallery cycling, float physics, ambient WebGL and footer egg exceed the novelty budget. | H | M | M | Site-wide |
| P25 | A/B | PageTransition animates margin-top (layout); Home text animates letterSpacing/weight; CSS reduced-motion override does not disable JS-driven systems universally. | M | M | L | Site-wide |
| P26 | C/D | Long articles share quiet paper but accumulate large gaps, boxes, metadata and small screenshots. 77-block CarInsurance is ~23,149px desktop; image fit-to-viewport does not make dense boards readable. | H | M | M | 4 primary articles |
| P27 | E | Evidence wording needs precision: Chance $5,000 prevention vs amount at risk; ADEM prototype/planning vs shipped; deposit before/after attribution and inconsistent click counting. Detailed inventory below. | H | L after facts | L | 4 primary previews/articles |
| P28 | B/C | /work has eight projects; next/previous cycle follows entire non-unlisted roster rather than selected Home order. Selected work can lead into secondary incomplete pages. | M | L | L | Home/Work/articles |
| P29 | A/C | Unknown project shows default 404 without desktop primary nav/contact (rail is per page). | M | L | L | Error route |
| P30 | B/G | BrainConnections and provider appear unmounted; separate HOME_CONNECTIONS remain live. Confirm import reachability before deletion. Lint also scans ignored source exports. | L | L | L | Maintenance |
| P31 | B/D | Fonts only request 500/600/700; body normal and animated 800 do not have explicitly requested matching weights. Audit intended normal weight before changing fonts. | M | L | L | 13 |
| P32 | A | chance-creators mobile document width 457px at 390px in route capture; not explained by main-only overflow scan, needs ancestor/footer inspection. | M | L–M | L | 1 |
| P33 | F/G | Graph explorer, new 3D systems, sound, general layout CMS, comprehensive archive expansion do not address current blockers. | L for V1 | H | H | Proposed only |

## Case-study content review (locations are 1-based blocks in projects.ts)

No proposed cut below has been applied. Keep the full text until approved; improving semantic/visual hierarchy does not require rewriting sentences.

| Article/location | Exact problem | Proposed direction |
|---|---|---|
| Chance summary, hero/result/metrics; blocks 25–26 | $5,000 reads as observed prevented losses while body describes risk, beta hypotheses, and unquantified business benefits | Confirm what was observed; distinguish transaction value protected from measured dollars saved. Preserve planned validation as planned. |
| Chance summary, blocks 13 and 22 | Physical card-pile exploration and rejection are told twice | Propose one explanation adjacent to exploration, retain implementation constraint detail once. |
| Chance summary, blocks 18/20/26/28 | Repeated general systems-value explanation dilutes specific project evidence | Propose trimming general claims; retain actual reusable states and collaboration. |
| Chance summary, block 22 | “minimum height ... 440px, max height” is internally contradictory | Confirm intended rule from implementation/source; suggest correcting only that sentence. |
| Chance summary, blocks 15/29 | Inspector offers numbered states without actual visuals; author note leaks at end | Use available real state images, omit unavailable choices; editorial note belongs off-site. |
| Chance summary, block 27 | Future sound design interrupts completion/impact | Propose fold into an optional reflection, not a new site sound feature. |
| Deposit, blocks 1/9/28/30/32 and 7/25 | Missing hero, toast, pack, modal recording, Top Off; steppers reserve image slots but cannot accept images | Prioritize one before/after visual and shipped state; use real existing exports if available, then plain evidence where media adds nothing. Never fabricate product screenshots. |
| Deposit, blocks 7/25/26/33 | Old stepper has 10 displayed steps; 7→3 counts minimum flow while notes include further payment/redemption actions | Define comparable start/end and saved-card assumptions; label consistently. Keep nuanced explanation. |
| Deposit, blocks 29–31 | “98% immediately closed it” lacks sample/window; strongest judgment example depends on this evidence | Request denominator/timeframe or identify as directional observation. |
| Deposit, blocks 42–43 and Home chips | Before/after has a 3-day post period; full text correctly caveats it, preview omits that qualification | Retain caveat and make measurement context accessible alongside metric, without expanding every card into a report. |
| Deposit, blocks 12–19, 34–40 | Strong diagnosis/build evidence, but scarcely represented in section contents | Expose through navigation/heading roles; avoid a new process section. |
| ADEM, block 3 | Caption mixes six-week sprint, July–September, synthetic testing, 80% task time and 30+ collaborators | Confirm project-specific facts and separate broader internship evidence from this case. |
| ADEM, blocks 20–21 | Access Analyzer detour precedes main diagnosis | Propose shorter cross-reference/optional aside; don't delete cross-domain evidence blindly. |
| ADEM, block 46 | Missing inherited entry-state artifact, central to thesis | Highest-priority ADEM asset: one legible comparison demonstrating context carried over. |
| ADEM, blocks 52–55 | Final direction is presented for implementation planning; earlier prose can sound shipped | Keep prototype test (23s→5s), estimated ticket savings and delivery stage distinct. Ask if it subsequently shipped. |
| CarInsurance, blocks 23–33 and 73 | Library scale/deliverables recur; long catalog competes with calculator/constraint judgment | Propose tighter grouping or optional artifact gallery; keep actual calculator diagnosis and business constraints prominent. |
| CarInsurance, blocks 56–57 | Consecutive large section headings, one a general lesson | Lower lesson emphasis; avoid giving a maxim equal navigation weight to narrative sections. |
| CarInsurance, blocks 71/72/75 | Page assembly timing repeated three times | Retain concrete anecdote and metric; propose removing repeat only with approval. |
| CarInsurance, blocks 74–76 | Strong outcomes and attribution caveat exist, but no impact stop in rail | Fix content/section semantics; preserve source caveat and testimonial. |
| CarInsurance, imagePair blocks 10/11 | Individual captions blank; pair labels do not explain specific evidence in each dense screenshot | Identify crops/meaningful short captions from existing source. |
| Secondary articles | Beyond, Access Analyzer, AI Toolkit, Internship Wrapped contain internal flags; AI role explicitly invented placeholder; Wrapped lacks intended embed | Decide V1 visibility first; do not spend equal polishing effort on nine articles. |

## Proposed system priorities

1. Publishing boundary: public-only content loader and asset manifest; keep private originals outside public; public/unlisted/private explicitly different. Remove internal production UI from the eventual public render. No authentication project unless private sharing is an actual requirement.
2. Model navigation before implementation: persistent global Home/Brain/About/email plus context that directly navigates. Home offers four work destinations and Brain preview; article offers meaningful section stops with measured/current state; Brain offers domain/view state and selected-object relationships; About offers trajectory/contact. One shared model powers desktop and compact mobile dock with an expandable contents surface. Preserve filter/view/selection on return. This is a proposal requiring conceptual approval.
3. Foundation: maintain current fonts/colors, make content width—not viewport width—determine columns; compact rail/tablet mode before desktop gutters starve content; semantic headings, quiet captions, wrapping outcomes, coherent focus states. Keep reading stable.
4. Article presentation: strongest outcomes above hero or alongside introduction; explicit 15-second layer; navigable 2-minute spine using existing writing; full article remains available. One section model drives headings, anchors and progress.
5. Brain contract: separate domains[], relationship, type, tags[], publication status, featured, dates, metadata and related IDs. Treat featured as independent editorial selection, not a substitute for published status. Unknown dates remain unknown. One content interpretation shared across grid/float/focus, with different layouts. Preserve original title-display intent where appropriate; meaningful image descriptions; excerpt long notes, full text in focus; stable gallery aspect and user-controlled media.
6. Home: keep four projects and existing order, lead previews with transformation/outcome, solve missing deposit visual. Replace large hover-gated field with a small curated group of real Brain objects after work; preserve edges for deeper Brain exploration. Navigation continuity plus contained object behavior are the proposed two motifs; flower is a candidate detail, not automatically a third major system.
7. About/contact: current chapter + selected trajectory + a few specific personal bridges; one formal contact area, casual Brain contact, always-visible email. Consolidate footer responsibilities.
8. Editing: extract project-by-project content; structured Brain/project/site metadata with validation and a generated public manifest. Keep article blocks initially; MDX is optional, not required migration. Editor choice depends on actual workflow below.

## CMS recommendation and alternatives

The real editing problem is metadata/media entry and publishing, not lack of a rich page builder. There is no reason yet to add a database, hosted rich-text system, custom authentication or a general block editor.

- **If editing on this computer is acceptable:** a small local form editor over structured content, preview, validation and explicit publish/export. Lowest infrastructure burden; requires local checkout/server.
- **If editing anywhere is essential:** Git-based browser editing with authenticated repository writes and deployment previews. More setup, but supports mobile/remote editing without maintaining a bespoke CMS backend. Select the actual integration only after workflow confirmation.
- **If the existing spreadsheet is preferred:** make it the maintained metadata editor with a validated import and media upload convention. Lowest authoring disruption, but less immediate visual preview and more care around sync/source of truth.
- A hosted CMS is justified only by confirmed collaborative editing, remote media needs or frequent rich-content operations that the above cannot handle. Do not choose one now.

Private/draft/archive/graveyard records must never enter client bundles, public HTML or public assets. Archive/graveyard default nonpublic; publishing is explicit. Git history visibility depends on repository privacy; deployment filtering alone does not make a public repository private.

## V2 quarantine proposal

Full relationship graph; new Three/WebGL system; sound; endless physics tuning; broad work archive promotion; custom general layout editor; every Brain object independently redesigned; live music/status API; portfolio-about-the-portfolio case study; new major fonts/colors absent evidence the existing foundation cannot work. Existing graph edges, media and experiments are retained as source data.

## Decision gates

One consolidated question round accompanies this audit. Conceptual navigation/motif, publishing intent, evidence gaps and editor workflow need answers. No microdesign approvals required. After those answers, create the constitution/decision log/quarantine source of truth with dates, reasons and explicit reopen conditions. Until then, these recommendations are not recorded as chosen decisions.

## Final verification addendum

- All 134 public objects also opened at 390px with touch/mobile emulation. B-0168 (flower) is the one expanded-stage horizontal overflow detected; include in P17. No broken expanded images detected in this pass. Desktop stage-width checks found no overflow across all 134 objects.
- Normal-motion desktop Home and Brain produced no page errors in the final check. Normal Brain load recorded 100 `/brain/` resource entries totaling 241,113,054 encoded response bytes (~241 MB decimal / 230 MiB). This is an observed development-browser media transfer measure, not production JS bundle size or a Core Web Vitals score.
- Published references total 266.45 MiB on disk, which differs from network totals because some files/references repeat. Neither number should be described as the JavaScript bundle.
- All domain filter buttons worked according to the existing single-domain rules: design 15, music 6, writing 52, crafts 34, community 18, media 9; sum 134. This verifies mechanics, not correctness of semantic assignment.
- B-0117, B-0118, B-0120 and B-0122 duplicate headings in grid were visually confirmed. B-0148 shows its title without the two content entries in grid, while full entries exist in focus.
- No Calendly URL was found in application code or project notes searched. Deposit-specific supplied asset directory contains only the Slack screenshot; asset readiness remains a content gate.
- Durable files include the 134-row CSV, route observations, interaction checks, per-object mobile render checks and selected screenshots. Application files remain unchanged by this audit.
