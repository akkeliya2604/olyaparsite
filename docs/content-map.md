# Where every piece of text lives

The page is built from 14 sections stacked in order. Each one is a separate
file in `src/components/sections/`. This table is in the same order you see
them scrolling down the live site.

To find something fast: open the project in VS Code and press **Ctrl+Shift+F**
(Cmd+Shift+F on Mac), then search for the exact words you see on the site.
That is usually quicker than reading this table.

| # | On the page | File | Shape |
|---|---|---|---|
| — | Nav links (Home, About, Course…) | `src/components/Header.astro` | list |
| — | "MR / Maya Reynolds" wordmark | `src/components/Logo.astro` | markup |
| — | Browser tab title, Google description | `src/layouts/BaseLayout.astro` | markup |
| 1 | "Swim the race you trained for" + both buttons | `sections/Hero.astro` | markup |
| 2 | Scrolling ticker strip | `sections/Marquee.astro` | **list** |
| 3 | "Most swimmers train everything…" + Old Way / Race Ready Way cards | `sections/ProblemSection.astro` | markup |
| 4 | "Built for competitive swimmers", Primary/Also/And, Parents box | `sections/AudienceSection.astro` | **list** |
| 5 | "Six principles", the six cards | `sections/Principles.astro` | **list** |
| 6 | "Ready isn't a feeling / It's a practice" | `sections/StatementBand.astro` | markup |
| 7 | "Meet Maya Reynolds" + her two paragraphs | `sections/MeetMaya.astro` | markup |
| 8 | Testimonial quotes and names | `sections/Testimonials.astro` | **list** |
| 9 | "Where to start", the three programme cards | `sections/Programs.astro` | **list** |
| 10 | "Your Race-Ready path", the three numbered steps | `sections/PathSteps.astro` | **list** |
| 11 | Masterclass band (**says "Soccer" — see below**) | `sections/MasterclassBand.astro` | markup |
| 12 | The six FAQ questions | `sections/Faq.astro` | **list** |
| 13 | "Follow the work" + Instagram tiles | `sections/InstagramStrip.astro` | markup |
| 14 | "Start training the mental game" | `sections/FinalCta.astro` | markup |
| — | Footer: logo, © 2026, social icons | `src/components/Footer.astro` | **list** |

## The two shapes, and which is easier

**list** — the easiest kind. Near the top of the file, between the two `---`
lines, you will find something like:

```js
const principles = [
  { title: "Mindset", body: "Choose the response that moves you forward." },
  { title: "Focus",   body: "Stay with the next length, stroke, and cue." },
];
```

Change the text inside the quote marks. To add another card, copy a whole line
including its trailing comma and edit the copy. The page updates itself — you
do not touch the layout at all.

**markup** — the text sits inside HTML tags further down:

```html
<h2>Built for competitive swimmers</h2>
```

Change only what is between `>` and `<`. Leave the tags themselves alone.

## Rules that keep things from breaking

- Every quote mark and comma matters. If the page goes blank, you almost
  certainly deleted one — press Ctrl+Z until it comes back.
- `&mdash;` is a long dash (—) and `&rsquo;` is a curly apostrophe (’). They
  look odd in code and correct on the page. Leave them as they are.
- Anything inside a `<style>` block is appearance, not words. Do not edit it to
  change text.
- Lines starting with `import` connect files together. Deleting one breaks the
  page.

## Known gaps in the design

Search the project for **`TODO(figma)`** to find all of these in place:

| What | Where | Needs |
|---|---|---|
| Says "Competitive **Soccer** Players" | `MasterclassBand.astro` | The whole site is about swimming. Left as designed — fix in Figma, then here. |
| FAQ answers are all "Answer to be supplied." | `Faq.astro` | Real answers to the six questions. |
| Only 2 of 4 testimonials exist | `Testimonials.astro` | Two more quotes with names and roles. The counter adjusts automatically. |
| Noah Bennett's quote | `Testimonials.astro` | Reconstructed from a card cut off at the edge of the design — worth checking against Figma. |
| Instagram tiles are empty boxes | `InstagramStrip.astro` | Three images, or an embed. |
| "MR" logo is typed, not the real artwork | `src/components/Logo.astro` | The exported logo file from Figma. |
| Maya's portrait is cut from the design image | `src/assets/maya-portrait.png` | The original photo, which would be sharper. |

## Changing pictures

Images live in `src/assets/`. To swap one, put the new file in that folder and
change the `import` line at the top of the section that uses it.

Keep the same file type where you can (`.png` for `.png`). The site converts
everything to modern formats and generates the right sizes automatically, so do
not worry about resizing or compressing first.
