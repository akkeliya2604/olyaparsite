# Deploying to Cloudflare

This site runs on **Cloudflare Workers with static assets** — Cloudflare's
recommended target for new projects. There is no Worker script: `wrangler.jsonc`
has no `main` field, so Cloudflare just serves the files Astro builds.

## Two Cloudflare accounts on one machine

This project deploys to **Olya's** Cloudflare account. The machine-wide login
belongs to a **different** account and must stay that way.

This matters because `wrangler login` stores its OAuth token in a single
machine-wide file:

```
%APPDATA%\xdg.config\.wrangler\config\default.toml
```

Running a plain `wrangler login` for a second account **silently overwrites the
first one**. Every other project and shell on this machine would then start
deploying to the wrong account, with no warning.

### The fix: a per-project credential store

Wrangler resolves that directory from `XDG_CONFIG_HOME`. `scripts/cf.mjs` points
it at `.cf-home/` inside this repo, for the spawned process only — the shell and
every other tool are unaffected. It is a virtualenv, but for Cloudflare.

| Command | Account used |
|---|---|
| `npm run cf:login` / `deploy` / `cf:preview` / `cf:whoami` | **This project's** (`.cf-home/`) |
| bare `npx wrangler …` | Machine-wide (the other account) |

> **Always go through the npm scripts.** A bare `npx wrangler deploy` in this
> folder will happily deploy to the wrong account. `npm run cf:whoami` tells you
> which account you are about to act as — check it when unsure.

`.cf-home/` contains a live OAuth token and is gitignored. Never commit it.

## One-time setup

### 1. Log in as Olya

```bash
npm run cf:login
```

A browser opens. **Make sure the Cloudflare session in that browser is Olya's
account, not the other one** — log out first, or use a private window. Then:

```bash
npm run cf:whoami
```

Confirm the email shown is Olya's before going further.

### 2. First deploy from your machine

This creates the Worker, which must exist before a repo can be attached to it.

```bash
npm run deploy
```

Wrangler prints the live URL: `https://joe-goodreau-site.<subdomain>.workers.dev`

### 3. Push the repo to GitHub

```bash
git remote add origin git@github.com:<user>/<repo>.git
```

```bash
git push -u origin main
```

### 4. Connect the repo for automatic deploys

In **Olya's** Cloudflare dashboard:
**Workers & Pages → `joe-goodreau-site` → Settings → Builds → Connect**

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview deploy command | `npx wrangler versions upload` *(default — non-production branches)* |
| Root directory | `/` |
| Production branch | `main` |
| Build variables | *(none needed)* |

Note the deploy command here is bare `npx wrangler deploy`, **not** the npm
script. That is correct: Cloudflare's build runners already execute inside
Olya's account, so there is no ambiguity to resolve and no `.cf-home/` present.
The wrapper only exists to disambiguate *your laptop*.

From then on, `git push` to `main` deploys. Pushes to any other branch build a
**preview version** at its own URL without touching production — useful for
trying a layout change you are unsure about.

> **The most common failure:** `name` in `wrangler.jsonc` must exactly match the
> Worker name in the dashboard. If they differ, the build succeeds and the
> deploy fails with a confusing error.

## Differences from your other project

Your other project uses **Cloudflare Pages**, a different product:

| | Pages | Workers Builds *(this project)* |
|---|---|---|
| Output location | "Build output directory" field in dashboard | `assets.directory` in `wrangler.jsonc` |
| Deploy step | Implicit | Explicit "Deploy command" |
| Config in git | No | Yes — `wrangler.jsonc` |

So there is no "build output directory" box to fill in here — that path comes
from the committed config instead.

## Everyday commands

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server, hot reload. **Use this while designing.** |
| `npm test` | Type-check + build. Run before pushing. |
| `npm run cf:preview` | Serves `dist/` in the **real** Workers runtime |
| `npm run deploy` | Manual deploy, bypassing git |
| `npm run cf:whoami` | Which Cloudflare account this project will act as |

`npm run dev` and `npm run cf:preview` are not the same thing. The dev server is
Vite and does not apply `not_found_handling` or `html_handling`, so a broken 404
page or trailing-slash rule looks fine in `dev` and breaks in production. When
you touch routing, check `cf:preview`.

## Custom domain

**Workers & Pages → your Worker → Settings → Domains & Routes → Add**

If the domain is already on Cloudflare, DNS is configured for you. Then update
`site` in `astro.config.mjs` to the real domain so canonical URLs are correct.

## When a deploy fails

1. **Workers & Pages → your Worker → Deployments** — read the build log
2. Reproduce locally with `npm test`; it runs the same build
3. Check the Node version — `package.json` sets `engines.node >= 22.12.0`
4. Confirm `wrangler.jsonc` `name` matches the dashboard Worker name
5. `compatibility_date` cannot be later than the deploying wrangler's release
   date, or you get "is in the future and unsupported". If you bump it, bump
   `wrangler` too.

## Rolling back

**Deployments** tab → last good deployment → **Rollback**. Instant, and it does
not require a git revert. Fix forward in git afterwards.
