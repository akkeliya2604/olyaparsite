# Codex handoff

Codex reads `AGENTS.md` automatically, so most of this is already in its context
when it opens the repo. Use the prompts below for bigger or riskier tasks where
you want the constraints restated explicitly.

## Codex setup *(runtime settings — not part of any prompt)*

- **Task:** a new task per change; do not accumulate one long thread.
- **Mode:** Default for copy and content edits; Plan for anything touching layout,
  tokens, or more than one section.
- **Model / reasoning:** balanced coding model, medium reasoning. Raise to high
  only for Figma variable → token mapping or cross-section refactors.
- **Environment:** local checkout; no worktree needed for single-branch work.
- **Context:** `AGENTS.md`, `docs/content-map.md`, plus the one section file
  being changed. Do not preload every section.
- **Tools:** Figma MCP server only when working from the design.

---

## Prompt A — everyday content change

For copy, testimonials, FAQ answers, swapping an image.

```text
Read AGENTS.md first, then make this change:

<describe the change in plain language — which section as it appears on the
page, and what the new text should say>

Rules:
- Find the section using docs/content-map.md.
- Change only the words. Do not touch <style> blocks, imports, or layout.
- If any text I gave you does not fit the existing structure (too long, wrong
  number of items), stop and ask rather than restructuring the section.
- Do not fix unrelated things you notice. Mention them instead.

Then run `npm test` and report the real output. Do not commit or push.
Tell me which section changed and what to look at in the browser.
```

## Prompt B — building a new section from Figma

```text
Read AGENTS.md first. Build the section in this Figma frame:
<PASTE FIGMA FRAME URL WITH node-id>

Read it through the Figma MCP server. Do not guess values the design specifies.

Constraints:
- Use only Layer 2 tokens from src/styles/tokens.css (--color-text, --sp-med).
  If a token is missing, add it to tokens.css rather than inlining a value.
- Follow the pattern of the existing files in src/components/sections/, and set
  the section's band with .band-light / .band-dark rather than styling colours
  directly.
- Semantic HTML, headings in order, alt on every image, keyboard reachable.
- No client-side JavaScript unless the design requires interaction. Say so
  explicitly if you add any.
- Use Astro's <Image /> for photos.

Completion criteria:
- Renders correctly at 1440px and 375px.
- `npm test` passes with 0 errors and 0 warnings.
- No hardcoded colour or spacing values outside tokens.css.

Verify with `npm test` and `npm run cf:preview`, and report the actual output.
State anything in the frame you could not reproduce and why.
Stop there — do not commit, push, or deploy.
```

## Prompt C — a build is failing

```text
Read AGENTS.md first. `npm test` (or the Cloudflare build) is failing with:

<PASTE THE FULL ERROR TEXT>

Find the cause and fix it with the smallest change that works. Do not refactor
anything else while you are in there.

Explain in plain language what was wrong and what you changed. Re-run `npm test`
and show me the real output. Do not commit or push.
```

---

## What to hand Codex, and what to decide yourself

Codex is good at: finding the right file, making the edit safely, catching build
errors, explaining what a piece of code does.

Decide yourself: what the site should say, which photo to use, whether the
"Soccer" copy should stay, what the FAQ answers are. Codex should ask about
these rather than invent them — `AGENTS.md` tells it to. If it invents content
instead of asking, that is worth pushing back on.
