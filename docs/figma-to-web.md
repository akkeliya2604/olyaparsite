# Figma → website: how this actually works

## The short answer about the "Export" button

**There is no Figma button that turns a mockup into a website.** This is the
most common false start, so it is worth being precise about what each thing does.

| Feature | What it really does | Use here |
|---|---|---|
| **Export panel** (`Shift+Ctrl+E`) | Exports selected layers as PNG / JPG / SVG / PDF — **images only** | Yes, for icons and illustrations |
| **Copy as code** (right-click) | CSS for *one layer*: its box, fill, font | Reference only |
| **Dev Mode** | Inspect panel: measurements, colours, variables, per-layer CSS | Reference only |
| **Figma Sites** | Genuinely publishes a hosted site from your design | No — bypasses git and Cloudflare |
| **Figma Make** | AI generates an app from a prompt or design | No |
| **Anima / Locofy / Builder.io** | Plugins that generate HTML or React from frames | No — output is unmaintainable div-soup |
| **Figma MCP server** | Lets an AI coding agent *read* the design directly | **Yes — this is the one** |

Why not the plugins that "just export code"? Because they translate a *drawing*
into markup. They emit absolutely-positioned `<div>`s with no headings, no
landmarks, no alt text, and no responsive behaviour. For a portfolio aimed at
UI/UX roles that is actively harmful: the first thing a design-literate reviewer
does is resize the window and tab through with a keyboard.

## The approach used here

Read the design *as data* — frames, auto-layout, variables, text styles — and
hand-write semantic HTML and CSS from it. You get pixel-faithful output that is
also accessible and responsive.

## One-time setup

Figma's official remote MCP server is `https://mcp.figma.com/mcp`, and it is
**available on all seats and plans, including free**. (There is also a desktop
server, but that one needs a Dev or Full seat on a paid plan — you do not need it.)

```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```

Or, as an official bundle that adds workflow skills too:

```bash
claude plugin install figma@claude-plugins-official
```

Then authenticate:

1. Start a new Claude Code session
2. Type `/mcp`
3. Select **figma** → **Authenticate**
4. Click **Allow Access** in the browser

> **`/mcp` opens an interactive terminal dialog.** If the app you are in does not
> show it, run `claude` from a normal terminal in this folder and authenticate
> once there — the credential is stored globally and works everywhere afterwards.

> **MCP servers only load when a session starts.** After adding the server you
> must restart the session before the Figma tools exist.

## Pointing at a specific frame

Two ways, and the second is much more reliable:

1. Select a frame in Figma and ask for "the current selection"
2. **Right-click the frame → Copy link to selection**, and paste that URL

That URL looks like `…/design/<fileKey>/<name>?node-id=123-456`. The `node-id`
is what removes all ambiguity about which frame is meant.

## Design tokens: the part that matters

`src/styles/tokens.css` is the contract between the two sides. It is deliberately
laid out to mirror how Figma organises variables:

| Figma | `tokens.css` |
|---|---|
| Collection "Primitives" (`Color/Gray/700`) | Layer 1 — raw values |
| Collection "Semantic" (alias variables) | Layer 2 — `--color-text`, `--space-4` |
| Modes (Light / Dark) | Layer 3 — mode overrides |

**The one rule: components only ever reference Layer 2.** A component that
hardcodes `#1a1a1a` or `24px` has broken the chain — change the colour in Figma
and nothing propagates. If a needed value has no token, add the token; do not
inline the value.

This is also the single best thing to talk about in an interview, because it is
the difference between "I made some screens" and "I built a system".

## Handling assets

The agent can read layout and tokens, but **binary assets you export yourself**:

| Asset | Export as | Where it goes | Why |
|---|---|---|---|
| Icons, logos, simple shapes | **SVG** | `public/` | Vector, tiny, recolourable via `currentColor` |
| Photos, complex imagery | **PNG/JPG @2x** | `src/assets/` | Goes through Astro's image pipeline for resizing + modern formats |
| Screenshots in case studies | **PNG @2x** | `src/assets/` | Same |

The `public/` vs `src/assets/` split matters: files in `public/` are copied
verbatim and never optimised; files in `src/assets/` are processed by Astro's
`<Image />` component, which emits WebP/AVIF at the right dimensions. Photos in
`public/` are the most common cause of a slow portfolio site.

**Fonts:** do not link Google Fonts in the page head — it costs a round trip to
a third-party origin. Download the `.woff2`, put it in `public/fonts/`, and
declare `@font-face` with `font-display: swap`.

## The workflow, end to end

1. Copy a frame link in Figma (**Copy link to selection**)
2. Paste it in the session and say what to build
3. The agent reads the frame's structure, variables and text styles
4. Tokens land in `tokens.css`; markup becomes semantic components
5. Export any icons/images by hand into `public/` or `src/assets/`
6. `npm run dev` and compare side by side against Figma
7. Check it at 375px wide and tab through it with the keyboard
8. Commit, push — Cloudflare deploys automatically

## What to check before calling a page done

- [ ] Headings descend in order (`h1` → `h2` → `h3`), no levels skipped
- [ ] Every image has `alt` (decorative ones get `alt=""`)
- [ ] Keyboard-only: every interactive element reachable, focus ring always visible
- [ ] Text contrast ≥ 4.5:1 (Figma's design may fail this — check, don't assume)
- [ ] Works at 375px wide without horizontal scroll
- [ ] No hardcoded colours or spacing outside `tokens.css`
- [ ] Respects `prefers-reduced-motion`
