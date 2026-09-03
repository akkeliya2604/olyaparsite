# Agent instructions

Astro 7 static portfolio site, deployed to Cloudflare Workers static assets.

## Non-negotiable rules

1. **Tokens only.** Components must reference Layer 2 semantic tokens from
   `src/styles/tokens.css` (`--color-text`, `--space-4`). Never hardcode a colour
   or spacing value. If a token is missing, add it to `tokens.css` — do not inline.
2. **Semantic HTML.** Real landmarks, headings in order, lists for lists. No
   `<div>` soup and no absolute positioning for page layout.
3. **Accessibility is not optional** — this site is a UI/UX portfolio, so its own
   markup is part of the work being judged. Keyboard reachable, visible focus,
   `alt` on every image, contrast >= 4.5:1.
4. **No client JS** unless genuinely required. Say so explicitly if adding any.
5. **Don't touch** `wrangler.jsonc`, `astro.config.mjs`, or `package.json`
   scripts without being asked.

## Verifying

- `npm test` — type-check + build. Must be 0 errors, 0 warnings.
- `npm run cf:preview` — the **only** way to test 404 handling and trailing-slash
  redirects locally. `npm run dev` does not apply Cloudflare's asset rules.
- Check at 375px wide and tab through with a keyboard.

## Deploying

Do not deploy or push unless explicitly asked. See
[docs/cloudflare-deploy.md](docs/cloudflare-deploy.md).

**Never run bare `npx wrangler deploy` or `npx wrangler login` in this repo.**
This project deploys to a different Cloudflare account than the machine-wide
login. Use the npm scripts (`npm run deploy`, `npm run cf:login`,
`npm run cf:whoami`), which route through `scripts/cf.mjs` and a project-local
credential store in `.cf-home/`. A bare wrangler call silently targets the
wrong account.

`compatibility_date` in `wrangler.jsonc` must not exceed the installed wrangler's
release date, or local dev fails with "is in the future and unsupported".

## Working from Figma

See [docs/figma-to-web.md](docs/figma-to-web.md). Read designs via the Figma MCP
server rather than guessing values; ask for a **Copy link to selection** URL
(it carries a `node-id`) rather than working from a screenshot.

## Astro reference

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)
- [Images](https://docs.astro.build/en/guides/images/)

When starting the dev server, use background mode: `astro dev --background`.
Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`.
