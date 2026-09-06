# Design QA

Reference: Figma Home frame `117:5648` at 1920px. Design properties and
Prototype reactions were inspected for the full Home frame and its component
variants.

## Prototype reactions implemented

- Header links: hover, Smart Animate, Linear, 150ms.
- Buttons: hover, Smart Animate, Ease Out, 300ms.
- "Old Way" and "Race Ready Way" cards: hover, Smart Animate, Linear, 200ms.
- Blue motion mark: 1ms start, Ease Out Back 600ms reveal, 800ms hold, Linear
  300ms exit, instant reset.
- Audience groups: hover, Smart Animate, Linear, 200ms.
- Parents card: hover, Smart Animate, Ease Out, 300ms.
- Six principle cards: hover, Smart Animate, Linear, 200ms.
- Statement: 100ms Linear seed followed by 400ms Linear fill; click hides and
  resets the second line without a transition.
- Testimonial arrows: click, Smart Animate, Ease Out, 300ms. The implementation
  retains the two supplied testimonials rather than inventing the missing two.
- Trust bar: Linear 10s loop with an instant reset.
- FAQ items: click, Smart Animate, Ease In Out, 300ms.

## Result

final result: passed

- Every Home band was captured from the local production build at 1920px and
  compared side by side with its corresponding Figma render.
- Both problem-card hover variants were checked against the Figma component
  variants. Their Linear 200ms transitions use the correct source photographs,
  masks, corner radii, text colours, and overlays.
- The page was checked at 375px. The viewport and document scroll width both
  measured 375px; the repeating trust-bar track remains clipped inside its band.
- Keyboard focus was visible on navigation, buttons, carousel controls, the
  statement, FAQ controls, and social links. The mobile menu opened, exposed its
  links, and closed after navigation.
- Testimonial navigation, FAQ expansion, statement hide/reset, hover states,
  reduced-motion handling, and all inspected Prototype timings passed without
  browser console or page errors.
- A rendered-DOM comparison confirmed the same 845 words, in the same order, as
  the pre-change Home page.
- `npm test` completed with 0 errors, 0 warnings, and 0 hints; the static build
  produced both `/index.html` and `/404.html`.

`npm run cf:preview` was also attempted. Wrangler 4.129.0 cannot start the
Workers runtime on this machine's macOS 13.3.0 because it requires macOS 13.5.0
or later. This host limitation does not affect the completed browser comparison
against the built static site.
