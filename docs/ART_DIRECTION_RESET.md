# Art direction reset — September 5, 2026

Latest refinement: see `IMMERSIVE_REFINEMENT.md` (September 6). The user explicitly likes the interactive case-study cards and requests preserving them while strengthening scroll motion, expanding transitions, immersive case-study openings and a wider, more visually present sidebar.

The user explicitly rejected the first visual direction. It is NOT an approved foundation to extend.

## User's correction

“Apple-level product coherence with Vyomi-level visual personality.”

Apple is a reference for product behavior and finish only: intuitive navigation, contextual intelligence, continuity, progressive disclosure, excellent defaults, responsiveness. Do not imitate its visual language.

Keep Vyomi's colors, fonts, sharp corners and cerebral/digital character. Increase visual ambition, interaction, motion and experimentation. No Liquid Glass, pills, generic rounded cards or sterile minimalism.

Remove unnecessary numbers, copy, repeated metrics, tiny metadata, redundant labels, borders and explanatory UI. Fix spacing, hierarchy, readability and composition before adding effects. Do not write copy to compensate for weak design. Preserve the hero's wording and article voice.

Prefer actual project/personal material, rich imagery, scale, rhythm, depth, parallax, morphing and shared spatial states. Motion must connect states; generic paragraph fade-ins and bouncing do not satisfy the brief.

Render, visually inspect and iterate before presenting. Do not outsource basic visual QA to Vyomi.

Latest addition: cursor states throughout, each useful or delightful. Preserve text selection, precision, touch and keyboard equivalents. No misleading grab cursor on objects that cannot be dragged.

## Current bounded proof

The homepage is the next alignment surface. Its implementation is provisional, not approval to propagate a direction across every page.

- Hero wording retained, with separate primary and supporting type scales.
- Work previews omit numerical indexing, invented slogans and repeated metric arrays.
- Actual CarInsurance UI, Chance interface/recording and Brain objects replace schematic stand-ins where assets exist.
- Before/after controls morph deposit and ADEM diagrams and change the actual CarInsurance artifact.
- Desktop parallax is bounded and disabled with reduced motion.
- Email is the footer's main action; invented CTA removed.
- Global navigation and article chapter numbering removed; repeated article result summary removed.
- One global cursor layer replaces per-zone cursor engines. Native affordances stay usable; action-specific hints appear on pointer input only.

One optional question is pending: image-led work with interactive layers (recommended default), or a theatrical opening scene that assembles into work. No answer has been received as of this update; the proof uses the stated default.

## Limits and next alignment

This is not an approved full redesign. Brain and About have received structural implementation, but their final art direction and remaining article editorial cleanup still need review. The local content editor is complete; see the completion record below.

ADEM public art must not expose protected media. Deposit screenshots are still missing; its available source artifact is the Slack brief. New diagrams are explanatory illustrations, not fabricated product screenshots.

Homepage browser checks cover 320, 390, 768, 1024 and 1440px, before/after controls, direct case links, broken images and mobile contents. Cursor checks are recorded separately. Screenshots and machine results live in /tmp/portfolio-audit.

Cursor browser assertions passed for case previews, comparison/selected states, normal text, Brain objects, native modal close, image zoom, and touch fallback; no runtime errors. Source lint passed. These verify behavior, not user acceptance of the art direction.

## Second correction and explicit Three.js request

The user repeated the course correction and explicitly requested Three.js. The homepage now uses four full-width project compositions instead of staggered square cards. Its source text, fonts and palette remain.

CarInsurance's real redesigned interface is partitioned into spatial regions in a Three.js scene. A range input and endpoint buttons assemble/separate them; horizontal dragging rotates the scene. This is a visual interpretation of the interface structure, not a representation of backend architecture or a replacement product demo.

The scene is dynamically imported near the viewport; demand rendering stops after transitions settle, DPR is capped at 1.5, and reduced-motion/unsupported-WebGL paths show actual static imagery. The server and first client render agree on the static fallback. A browser test found and prompted correction of an initial hydration mismatch.

React ViewTransition pairs project preview titles with article headings, using this installed Next version's documented API. The persistent navigation remains stable; reduced-motion disables the transition.

Desktop and mobile WebGL tests passed with software GPU rendering, layer endpoint controls, drag inspection, zero horizontal overflow and no runtime errors, including case navigation and back navigation. These checks do not imply visual approval.

## Content editor completion — September 5, 2026

The local editor at `http://127.0.0.1:3111` now edits Brain objects, case-study metadata and article blocks, media, publication state and shared contact settings. Start it with `npm run content`. It has explicit saving, revision conflict protection, validation, undo and local recovery snapshots. No hosted CMS or production admin route was added.

Browser tests passed for draft creation, image upload, publishing and returning an object to private, article edits appearing in the portfolio, settings save/undo, and mobile overflow. Negative tests passed for unauthorized API access, cross-origin saves, stale revisions and invalid content. Public media returned 404 for draft/private objects and 200 only while published. Temporary test content was removed. TypeScript and source ESLint passed. Desktop and mobile editor screenshots were captured in `/tmp/portfolio-audit`.

See `CONTENT_EDITING.md` for the editing and deployment workflow. This closes the CMS request; it does not imply approval of the portfolio's visual direction or completion of every earlier editorial item.

Final production verification: `npm run build` passed, including compilation, TypeScript and all 17 generated pages. The initial sandboxed build stalled; the approved unrestricted retry completed successfully.
