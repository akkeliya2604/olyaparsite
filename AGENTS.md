# Agent instructions

Astro 7 static site deployed to Cloudflare Workers. Built from a Figma design.
Read this before changing anything.

---

## Who you are working with

**The owner is a designer, not a developer.** She owns the Cloudflare account
and the GitHub repository and makes all the decisions about the site, but she
does not read code fluently.

This changes how you should work:

1. **Ask before assuming.** If a request could reasonably mean two things, ask
   which one — do not pick one and build it. A wrong guess costs her a review
   cycle she is not well equipped to catch. Prefer one concrete either/or
   question over an open-ended one.
2. **Explain in plain language.** Say "the headline on the section with the six
   cards", not "the h2 in `Principles.astro:34`". Reference the visible page,
   then the file.
3. **Say what you changed and where to look.** After editing, name the section
   as it appears on the page and tell her what to check in the browser.
4. **Never silently expand scope.** If she asks for a headline change and you
   notice a spacing problem, mention it and ask — do not fix it uninvited.
5. **Surface risk in her terms.** Not "this may break the build" but "this would
   stop the site publishing until it is fixed."
6. **Don't hedge or over-explain.** She is smart and busy — she is just not a
   developer. Skip the tutorial unless asked.

### Questions worth asking

- Copy change: is this the final wording, or a draft to see how it looks?
- New testimonial/FAQ/card: is there a photo, and what name and role go with it?
- "Make it bigger/tighter": on desktop only, or on phones too?
- Anything touching colour or type: should this become a token used everywhere,
  or is it a one-off in this section?

---

## Non-negotiable rules

1. **Tokens only.** Components reference Layer 2 semantic tokens from
   `src/styles/tokens.css` (`--color-text`, `--sp-med`). Never hardcode a colour
   or spacing value. If a token is missing, add it to `tokens.css` — do not
   inline. Those values came from the Figma file's own variables; keeping the
   chain intact is what lets a design change propagate.
2. **Semantic HTML.** Real landmarks, headings in order with no skipped levels,
   lists for lists. No `<div>` soup, no absolute positioning for page layout.
3. **Accessibility is not optional.** Keyboard reachable, visible focus, `alt`
   on every image (empty `alt` for decorative), contrast ≥ 4.5:1.
4. **No client JS** unless genuinely required. The whole page currently ships
   998 bytes inline and no external JS file. Say so explicitly if you add any.
5. **Don't touch** `wrangler.jsonc`, `astro.config.mjs`, `scripts/cf.mjs`, or the
   `package.json` scripts without being asked. They are the deployment contract.
6. **Never commit, push, or deploy unless explicitly asked.**

---

## Project map

```
START-HERE.md              Owner's setup + publishing guide. Keep it accurate.
docs/content-map.md        Which file holds which words. Update when sections move.
docs/figma-to-web.md       How the design became code; font substitution rationale
docs/cloudflare-deploy.md  Deployment, and the two-Cloudflare-account trap
docs/codex-prompt.md       Reusable task prompt
docs/session-transcript.md The build session end to end: decisions, rationale,
                           and the traps that cost time. Read Parts 1-2 if you
                           are new to this repo.

src/pages/index.astro      Assembles the 14 sections in page order
src/components/sections/   One file per band of the page
src/components/            Logo, Button, Header, Footer
src/layouts/BaseLayout.astro  <head>, skip link, page title
src/styles/tokens.css      Design tokens — the contract with Figma
src/styles/fonts.css       Generated @font-face rules. Do not hand-edit.
src/assets/                Images, optimised by Astro at build time
public/fonts/              Self-hosted woff2
```

Light and dark bands are switched by a `.band-light` / `.band-dark` class that
repoints the semantic tokens — the CSS equivalent of a Figma variable Mode.
Components never branch on which band they are in; they just use the aliases.

---

## Verifying

Run these and report the **actual** output. Do not assume.

```bash
npm test
```

Type-check plus build. Must be 0 errors and 0 warnings.

```bash
npm run cf:preview
```

Serves the built site in the real Workers runtime. This is the **only** way to
test the 404 page and trailing-slash redirects — `npm run dev` is Vite and does
not apply Cloudflare's asset rules.

Also check any visual change at 375px wide and tab through it with a keyboard.

---

## Deploying

Do not deploy or push unless explicitly asked. See `docs/cloudflare-deploy.md`.

**Never run bare `npx wrangler deploy` or `npx wrangler login` in this repo.**
This project deploys to a different Cloudflare account than the machine-wide
login on some contributors' machines. Use the npm scripts (`npm run deploy`,
`npm run cf:login`, `npm run cf:whoami`), which route through `scripts/cf.mjs`
and a project-local credential store in `.cf-home/`. A bare wrangler call
silently targets the wrong account.

Pushing to `main` triggers a Cloudflare build automatically — so a push *is* a
deploy. Treat it with that weight.

`compatibility_date` in `wrangler.jsonc` must not exceed the installed
wrangler's release date, or local dev fails with "is in the future and
unsupported".

---

## Known gaps

Search for `TODO(figma)`. Summary in `docs/content-map.md`. The important ones:

- The masterclass band says "Competitive **Soccer** Players" on an otherwise
  swimming-only page. Left as designed deliberately — do not "fix" it silently;
  it is a content decision for the owner.
- All six FAQ answers are placeholders.
- Two of four testimonials are missing; one quote is reconstructed from a card
  clipped by the design's frame edge.
- The logo is a typographic reconstruction, not the exported artwork.

**Do not invent replacement content for these.** Ask.

---

## Working from Figma

See `docs/figma-to-web.md`. Read designs via the Figma MCP server rather than
guessing values, and ask for a **Copy link to selection** URL (it carries a
`node-id`) rather than a screenshot.

Two traps that cost real time before:

- MCP quota follows your seat on the **file's owning team**, not the seat
  `whoami` reports. A View seat is 6 calls per month.
- Large frames break `get_design_context` on transport at roughly 29KB. Map
  with `get_metadata` first, then pull child regions.

---

## Font substitution

The design specifies **Graphik**, a licensed Commercial Type face that cannot be
redistributed. **Inter** is substituted throughout. Barlow is the design's own
secondary face and is used as specified. Both self-hosted from `public/fonts/`.

Do not switch to a Google Fonts `<link>` — it adds a third-party request and
undoes the reason the fonts are self-hosted.

---

## Astro reference

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Components](https://docs.astro.build/en/basics/astro-components/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [Images](https://docs.astro.build/en/guides/images/)

When starting the dev server, use background mode: `astro dev --background`.
Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`.
