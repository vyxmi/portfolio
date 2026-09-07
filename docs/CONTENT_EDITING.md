# Editing the portfolio

Run `npm run content`, then open **http://127.0.0.1:3111**.
Run `npm run dev` alongside it to preview at http://localhost:3000.

The editor runs only on your computer. It is a separate localhost server, not a public portfolio route or hosted service. Use 127.0.0.1, not localhost, for the editor itself.

## Brain

Choose an object or **New object**. Edit its title, content, images and alt text, domains, type, relationship, tags, related IDs and date. Additional metadata preserves the original object fields.

Visibility is separate from existence:

- **published** appears publicly
- **draft**, **private**, **archive**, and **graveyard** remain in the editor and stay off the public site
- **Feature on Home** is independent of visibility; only published objects can appear. Home shows up to three featured objects.

New objects start as drafts. Save explicitly. Uploading media does not publish the object.

Brain uploads support JPG, PNG, WebP and GIF. Small WebP previews are generated automatically; full originals remain available through the visibility-checked media route. For a Brain video, use its external source link. Case studies also support MP4 uploads.

## Case studies

**Metadata** edits the project title, company, role, year, summaries, outcomes, featured status, Home ordering, opening summary and hero image. A custom Home image can replace an interactive preview; **Use interactive default** restores the built-in scene.

**Article** shows the existing blocks in order. Select a block to edit its paragraphs, headings, captions, images or structured details. Move blocks up/down, add common block types, or upload an image/video. Complex blocks retain all fields and expose a fallback **Block data** editor.

Your prose is saved as entered. This does not regenerate or rewrite articles.

ADEM remains password protected. Its uploads go into protected storage, not public assets. A protected image cannot be selected as a public Home thumbnail.

## Site

Edit availability, email, professional calendar, Brain calendar and LinkedIn. Saving updates the shared settings.

## Save, preview and publish

Saving writes structured override files:

- `content/brain.json`
- `content/projects.json`
- `content/site.json`

The original TS content remains intact underneath. Long articles may still be edited in source when preferred, but an override for the same project takes precedence.

The running Next dev server refreshes imported content after a save. Use **Preview** to inspect the real site. Saving locally does not deploy; commit/deploy through the normal site workflow when ready.

The editor validates records against the app's TypeScript content types, writes atomically, and rejects saves when another tab has modified the content file. If there is a conflict, keep your draft text before reloading.

**Undo last save** restores the previous version of the selected record during the current editor session. Older full-file recovery snapshots remain in the history folder.

Before each save, the previous override file is copied into `content/.history/` (ignored by Git). These files provide exact recovery snapshots and may contain private content.

Uploads live in `content/brain-media/`, `content/brain-previews/`, `content/protected/adem-user-list/`, or `public/uploads/`. Removing an image from an object does not destroy its file. Public Brain image requests are checked against current visibility on every request; the shared Next image optimizer is blocked for those routes.

Image limit: 12MB. Case-study MP4 limit: 30MB. There is no account service, database, paid CMS dependency or production admin surface.
