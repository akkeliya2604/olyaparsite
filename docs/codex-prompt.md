# Codex handoff

## Codex setup *(runtime settings — not part of the prompt)*

- **Task:** new task per case study; do not accumulate one long thread.
- **Mode:** Default — the scaffold and acceptance criteria already exist.
- **Model / reasoning:** balanced coding model, medium reasoning. Raise to high only for the Figma variable → token mapping.
- **Environment:** local checkout of this repo; no worktree needed for single-branch work.
- **Context:** `src/styles/tokens.css`, `src/layouts/BaseLayout.astro`, `src/content.config.ts`, one existing page as a pattern.
- **Tools:** Figma MCP server (`https://mcp.figma.com/mcp`). Nothing else.

---

## Prompt — copy from here down

```text
You are working in an Astro 7 static site that is a UI/UX portfolio, deployed to
Cloudflare Workers static assets. The scaffold, build and deploy pipeline already
work — do not restructure them.

GOAL
Build the page described by this Figma frame: <PASTE FIGMA FRAME URL WITH node-id>

Read the frame through the Figma MCP server. Do not guess at values that the
design already specifies.

PATHS
- src/styles/tokens.css      Design tokens. Layer 1 = primitives, Layer 2 =
                             semantic aliases, Layer 3 = dark mode.
- src/layouts/BaseLayout.astro  Wraps every page; handles <head>, skip link,
                             header and footer.
- src/components/            Reusable components, one .astro file each.
- src/pages/                 File-based routing. index.astro -> /
- src/content/work/*.md      Case studies. Schema enforced in src/content.config.ts
- public/                    Verbatim static files (SVG icons, fonts)
- src/assets/                Images that should go through Astro's <Image />

CONSTRAINTS
- Components must only use Layer 2 tokens (--color-text, --space-4). Never
  hardcode a colour or spacing value. If a needed token does not exist, add it
  to tokens.css Layer 1 + Layer 2 rather than inlining the value.
- Semantic HTML: real <header>/<nav>/<main>/<footer>, headings in order with no
  skipped levels, lists for lists. No <div> soup, no absolute positioning for
  page layout.
- Must work at 375px wide with no horizontal scroll, and be fully keyboard
  navigable with a visible focus ring.
- Text contrast >= 4.5:1. If the Figma design fails this, flag it rather than
  silently shipping it.
- Use Astro's <Image /> for photos. Raw <img> only for SVGs in public/.
- Ship no client-side JavaScript unless the design genuinely requires
  interactivity; say so explicitly if you add any.
- Do not edit wrangler.jsonc, astro.config.mjs, or package.json scripts.
- Do not commit, push, or deploy.

COMPLETION CRITERIA
- The route renders and visually matches the Figma frame at 1440px and 375px.
- `npm test` passes with 0 errors and 0 warnings.
- No new hardcoded colour or spacing values anywhere outside tokens.css.
- Every image has an alt attribute (empty alt for decorative images).

VERIFICATION (run these; report actual output, do not assume)
1. npm test
2. npm run build && npm run cf:preview, then check the new route, a deep link,
   and a nonexistent path returning the custom 404.
3. State explicitly which parts of the frame you could not reproduce and why.

STOPPING POINT
Stop after verification and report. Do not commit, push, deploy, or start on
another frame.
```
