# Race Ready — Maya Reynolds

Astro static site, built from a Figma design, deployed to Cloudflare Workers.

> **Spec work.** Built from the Figma file *Project — Joe Goodreau (new site)*,
> whose contents are branded "Maya Reynolds / Race Ready". Not a real business;
> deployed under a neutral Worker name (`race-ready-site`).
>
> The design specifies **Graphik**, a licensed Commercial Type face that cannot
> be redistributed. **Inter** is substituted throughout; Barlow is the design's
> own secondary face and is used as specified. See `src/styles/fonts.css`.

> **New here, or not a developer?** Read **[START-HERE.md](START-HERE.md)** —
> it covers installing everything from scratch and publishing your first change.

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload — use this while designing |
| `npm test` | Type-check + build. Run before pushing. |
| `npm run build` | Build to `dist/` |
| `npm run cf:preview` | Serve `dist/` in the **real** Cloudflare runtime (tests 404s + redirects) |
| `npm run deploy` | Manual deploy to Cloudflare |
| `npm run cf:login` | Log in to this project's Cloudflare account |
| `npm run cf:whoami` | Check which Cloudflare account this project acts as |

`npm run dev` does not apply Cloudflare's 404 and trailing-slash rules. When you
change routing, verify with `npm run cf:preview`.

> **Cloudflare credentials are project-scoped.** This site deploys to a different
> Cloudflare account than the machine-wide `wrangler login`. Always use the npm
> scripts above — a bare `npx wrangler deploy` here targets the *other* account.
> See [docs/cloudflare-deploy.md](docs/cloudflare-deploy.md).

## Layout

```
src/
├── styles/tokens.css       Design tokens, taken from the Figma variables. Start here.
├── styles/fonts.css        Self-hosted @font-face rules (generated)
├── styles/global.css       Reset + element defaults
├── layouts/BaseLayout.astro
├── components/             Logo, Button, Header, Footer
├── components/sections/    One component per band of the page
└── pages/index.astro       Assembles the sections in order
public/fonts/               Self-hosted woff2 (latin subsets)
src/assets/                 Images from Figma, optimised by Astro at build
scripts/cf.mjs              Wrangler wrapper -- pins Cloudflare creds to this repo
```

## Editing content

Copy lives inside each section component in `src/components/sections/`, as plain
arrays or markup. There is no CMS and no content collection -- the page is a
single marketing layout, so the copy sits next to the markup that renders it.

Search for `TODO(figma)` for the places where the design was incomplete,
ambiguous, or contradictory.

## Docs

- [START-HERE.md](START-HERE.md) — setup and publishing, for a non-developer
- [docs/content-map.md](docs/content-map.md) — which file holds which words
- [docs/figma-to-web.md](docs/figma-to-web.md) — how the Figma design becomes code
- [docs/cloudflare-deploy.md](docs/cloudflare-deploy.md) — deployment and CI
- [docs/codex-prompt.md](docs/codex-prompt.md) — handoff prompt for building pages

## Stack

- **Astro 7** — static output, zero client JS by default
- **Cloudflare Workers** static assets — config in `wrangler.jsonc`
- No CSS framework — plain CSS with custom properties, so the Figma design
  system maps 1:1 instead of being translated into utility classes
