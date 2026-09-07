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

## Current state

Already done — do not repeat these:

- The Worker **`race-ready-site` exists and is deployed** in Olya's Cloudflare
  account (the Gmail address the site's Cloudflare account is registered to).
- `.cf-home/` on the original build machine is logged in to that same account.
  `npm run cf:whoami` confirms which account you are acting as.
- The GitHub remote is set to <https://github.com/akkeliya2604/olyaparsite>.

What remains is connecting the repo so pushes publish automatically.

## Connecting the repo for automatic deploys

Do this once, signed in to **Olya's** Cloudflare account.

**Workers & Pages → `race-ready-site` → Settings → Builds → Connect**

Authorise Cloudflare's GitHub app for the `akkeliya2604/olyaparsite` repository,
then set:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview deploy command | `npx wrangler versions upload` *(default — non-production branches)* |
| Root directory | `/` |
| Production branch | `main` |
| Build variables | *(none needed)* |

The deploy command is bare `npx wrangler deploy`, **not** the npm script. That
is correct: Cloudflare's build runners already execute inside Olya's account, so
there is no ambiguity to resolve and no `.cf-home/` present. The wrapper exists
only to disambiguate a laptop that has two Cloudflare accounts.

After this, `git push` to `main` publishes. Pushes to any other branch build a
**preview version** at its own URL without touching production.

> **The most common failure:** `name` in `wrangler.jsonc` must exactly match the
> Worker name in the dashboard. They match today (`race-ready-site`). If you
> rename either, rename both.

## Setting up a new machine

Wrangler is a devDependency, so `npm install` provides it. Nobody needs a global
install.

If the machine will deploy manually (rather than relying on git pushes), log in
once:

```bash
npm run cf:login
```

```bash
npm run cf:whoami
```

Confirm it prints the site owner's Cloudflare address before deploying. On a machine with
only one Cloudflare account this is still safe — the credential simply lives in
`.cf-home/` instead of the machine-wide location.

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
