# Olya Parashuk — portfolio

Astro static site, built from a Figma design, deployed to Cloudflare Workers.

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
├── styles/tokens.css   Design tokens — the contract with Figma. Start here.
├── styles/global.css   Reset + element defaults
├── layouts/            Page shells
├── components/         Reusable pieces
├── content/work/       Case studies, one Markdown file each
├── content.config.ts   Schema for the above, enforced at build time
└── pages/              File-based routes
public/                 Copied verbatim (SVG icons, fonts, favicon)
scripts/cf.mjs          Wrangler wrapper -- pins Cloudflare creds to this repo
```

## Adding a case study

Create `src/content/work/my-project.md`:

```markdown
---
title: "Project name"
summary: "One sentence on the outcome."
role: "Product Designer"
year: 2025
tags: ["Research", "Prototyping"]
order: 1
draft: false
---

## Context
...
```

It appears at `/work/my-project/` automatically. `order` sorts the index (lower
first); `draft: true` keeps it out of the build. A missing or wrong-typed field
fails `npm test` rather than shipping broken.

## Docs

- [docs/figma-to-web.md](docs/figma-to-web.md) — how the Figma design becomes code
- [docs/cloudflare-deploy.md](docs/cloudflare-deploy.md) — deployment and CI
- [docs/codex-prompt.md](docs/codex-prompt.md) — handoff prompt for building pages

## Stack

- **Astro 7** — static output, zero client JS by default
- **Cloudflare Workers** static assets — config in `wrangler.jsonc`
- No CSS framework — plain CSS with custom properties, so the Figma design
  system maps 1:1 instead of being translated into utility classes
