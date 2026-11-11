# Framer components

Code components for the Framer site (vyomiseth.com). They are not used by the
Next.js app in this repo; each file is pasted into Framer as-is.

| File | What it is |
| --- | --- |
| `JellyfishHero.tsx` | Full-screen underwater background with glowing moon jellyfish |
| `OceanSound.tsx` | Sound on/off pill that plays generated ocean ambience |
| `GlassSign.tsx` | A little frosted-glass "please do not tap the glass" sign |

## Add them to Framer

1. In the Framer project, open **Assets** (left panel) → **Code** → **+** → **New Code File**.
2. Name it after the file (for example `JellyfishHero`), select everything in
   the editor, and paste the whole contents of the file. Save (Cmd/Ctrl+S).
3. Drag the component from Assets → Code onto the page.
4. Publish. Sound and cursor interaction work in Preview and on the live site.

Suggested layout for the hero section:

- **JellyfishHero** as the section's background: width **Fill (1fr)**, height
  **100vh** (or a fixed height).
- **OceanSound** with position **Absolute**, pinned bottom-right (28px on
  desktop, 16px on phones).
- **GlassSign** with position **Absolute**, pinned bottom-left, like a
  placard on an aquarium.

## JellyfishHero.tsx

Glowing moon jellyfish that pulse, glide and drift toward the cursor (or a
touch). There is no text in it; put any text on top as normal Framer layers.

How it gets its soft, layered look:

- Three depth layers. Far jellyfish and particles are drawn small and scaled
  up, so they come out out of focus (**Depth Blur**); near ones stay sharp.
- A bloom pass adds a soft haze of light around the bright parts (**Glow**).
- Each jellyfish is built from translucent layers: outer glow, a bell that is
  clear in the middle and brighter at its curved edge, an inner membrane, a
  wobbling scalloped rim with a fringe of fine hairs, four horseshoe gonads,
  frilly ribbon-like oral arms and tentacles that fade toward their tips.
  Each one gets its own tint, shape, brightness and rhythm.
- Faint light rays and haze from the surface (**Light Rays**) sway slowly
  behind everything, marine snow drifts through all the layers, and a few big
  blurred specks float in front of the "lens".

Controls: jellyfish count (desktop and mobile), size, speed, cursor pull,
glow, particles, light rays, depth blur, darkness and colors.

Phones and touch devices get a lighter version (fewer jellyfish and parts,
fewer particles, lower pixel ratio). Animation pauses when the hero is
scrolled out of view, and if a device can't keep up it steps down on its own
(first the bloom, then the finest details).

## OceanSound.tsx

The ocean sound is synthesized in the browser with the Web Audio API
(filtered brown-noise swells, a deep rumble and occasional bubbles), so there
is no audio file and nothing to license. Browsers block autoplay, so it starts
only when a visitor taps **sound off → sound on**. It fades out while the tab
is hidden. To use your own loop instead, upload a royalty-free mp3/wav/ogg/m4a
in the **Sound File** control (for example from Pixabay or freesound.org with
a CC0 license).

Controls: volume, sound file, label on/off and its text, font, and colors.

On iPhone, Web Audio is silenced when the ringer switch is on silent.

## GlassSign.tsx

A small pane of frosted glass held up by two suction cups, with a sleepy
jellyfish and "please do not tap the glass". A glint of light slides across
it now and then. Tapping it anyway makes the glass ripple, the sign wobble and
the jellyfish scrunch its eyes, and the sign answers back with the next line
from **Tap Replies** ("hey!", "shh, they're sleeping", ...).

Controls: text, tap replies, jellyfish icon, font, font size, text color and
tint.
