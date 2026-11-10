# Framer components

Code components for the Framer site (vyomiseth.com). They are not used by the
Next.js app in this repo; each file is pasted into Framer as-is.

## JellyfishHero.tsx

Full-screen underwater hero: glowing moon jellyfish that pulse, glide and drift
toward the cursor, generated ambient ocean sound behind a mute/unmute toggle,
and a lighter version on phones.

### Add it to Framer

1. In the Framer project, open **Assets** (left panel) → **Code** → **+** → **New Code File**.
2. Name it `JellyfishHero`, select everything in the editor, and paste the whole
   contents of `JellyfishHero.tsx`. Save (Cmd/Ctrl+S).
3. Drag **JellyfishHero** from Assets → Code onto the home page, as the first
   section.
4. Set its width to **Fill (1fr)** and its height to **100vh** (or a fixed
   height you like). Remove or hide the old hero.
5. Select it and tune the right-hand panel: name, job title, location, font,
   jellyfish count (desktop and mobile), size, speed, cursor pull, glow,
   darkness, colors, and sound.
6. Publish. Sound and cursor interaction work in Preview and on the live site.

### Sound

The ocean sound is synthesized in the browser with the Web Audio API
(filtered brown-noise swells, a deep rumble and occasional bubbles), so there
is no audio file and nothing to license. Browsers block autoplay, so it starts
only when a visitor taps **sound off → sound on**. To use your own loop
instead, upload a royalty-free mp3/wav/ogg/m4a in the **Sound File** control
(for example from Pixabay or freesound.org with a CC0 license).

On iPhone, Web Audio is silenced when the ringer switch is on silent.

### Mobile

Touch devices and screens narrower than 768px get the lighter version: fewer
jellyfish (**Mobile Count**), shorter tentacle chains, fewer particles and a
lower pixel ratio. Animation pauses whenever the hero is scrolled out of view.
