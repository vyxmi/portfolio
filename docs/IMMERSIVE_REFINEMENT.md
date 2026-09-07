# Immersive refinement — September 6, 2026

## Direction

The user likes the interactive case-study cards. Preserve their composition and controls; strengthen their scroll motion and expansion into case studies. Widen the sidebar and make its context more visually present. Preserve existing fonts, palette, sharp geometry, original prose and evidence. This is a refinement of the current product, not permission to replace the cards or add a new visual language.

## Implemented

- Full-width case-study openings with larger titles, actual project artifacts, layered backgrounds and bounded scroll-linked depth. Transparent diagrams retain a light backing. Articles without an explicit hero image can use their first existing image.
- Home cards scale into the viewport and move through a bounded scroll range. Their existing comparison, video and Three.js controls remain. Card stages and case-study artifacts share named view transitions; route content also has an arrival/departure transition, with navigation remaining fixed.
- Deposit's hero reuses the card artwork and before/after controls. The same diagram component renders both surfaces.
- Case-study media expands into its reading position. Body text remains stationary. Article body type is 20px desktop / 18px mobile; section labels are 16px / 15px. Exact duplicate section labels and metrics already stated in the opening are suppressed at render time; source writing is retained.
- Desktop sidebar is 296px wide; laptop sidebar is 256px. Section destinations are 16px with 44px minimum targets, a shared moving selection treatment, and automatic scrolling to keep the current destination visible. The mobile dock retains page contents and navigation.
- Custom fitted V mark, shared 20px SVG icon system, consistent direction/close/email actions. Sidebar contact text is **email me**.
- Footer groups email with availability and places calendar, LinkedIn and back-to-top together.
- Image expansion uses a native modal dialog with keyboard focus containment, Escape and return focus. Cursor feedback follows the dialog into the top layer.
- No dependencies added. Motion uses the existing `motion` package, native view transitions and CSS. Reduced motion disables spatial/transition animations. ADEM's server-side access boundary is unchanged.

## Verification

Desktop and mobile screenshots are in `/tmp/portfolio-audit/immersive-*`. Initial four-primary-case renders had no horizontal overflow or runtime errors. Visual inspection caught transparent-image contrast and sidebar tracking issues, which were fixed before final QA.

Interaction checks passed for card scroll transforms, comparison controls, route transitions, hero controls, modal focus/Escape/return focus, sidebar visibility, mobile contents, reduced motion, and locked/unlocked ADEM.

The full sweep covered 13 routes at 320, 390, 768, 1024 and 1440px. It found two narrow-screen failures on Chance Creators: nonwrapping flow labels and an unbroken string in a paragraph. Flow steps now wrap/stack and article text can break otherwise overflowing strings. The two affected flow-heavy routes were retested at all five widths: no overflow, broken hero images or runtime errors. The same interaction suite passed again. Production build, TypeScript and source ESLint passed. No deployment was performed.
