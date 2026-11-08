# Area: hero and first screen

Use when the scope is the top of a landing page, a home page or a product page. The hero decides whether the page feels like this product or like any product.

## Content

- The headline says what the product does for whom, in plain words, using facts already on the page. It could not fit another product.
- One short line of support. No paragraph.
- One primary action and at most one secondary action beside it. Nothing stacked underneath, no row of logos, no badge above the headline.
- For small local businesses, the primary action is often "Call" or "WhatsApp" (see `india.md`).
- If a claim cannot be verified, it does not go in the hero.

## Layout, pick one

1. **Scene hero.** One image fills the hero edge to edge. Its subject sits on one side. The headline sits on a calm empty part of the same image, in the upper part of the space between the navigation and the top of the product view, a little above true centre. The product view rises from the bottom edge and runs past it.
2. **Split.** Text on one side, the visual on the other with at least half the width. Centre the text block vertically against the visual. If the visual is much taller, shorten it instead of pushing the text down. Prefer one solid visual to floating cards.
3. **Text over a large product view.** For products where the screen is the proof.
4. **Centered stack.** Only for one or two short lines and no visual.

Long headlines align left. Compose the first screen as a whole: it fills the viewport height without a dead empty band, and the next section begins to show or the product view runs off the bottom edge so the page invites a scroll.

## Navigation

Logo, the existing links, one button. "Log in" is a quiet text link beside it, not a second button. A floating pill header is optional, not required. On small screens the links collapse into one menu button. Do not add links that did not exist.

## The visual

Show something true.

- **Preferred:** a preview of the real product built in code with plausible data (the main screen, one key card, the result the product produces), carrying one moment: a rendered object, a rich chart, a small object from the product's world.
- **Scene image:** generate or commission one from the product's world with calm empty space for text. Prompt recipe below.
- **Real photography:** the shop, the team, the product. Better than any stock image. Compress it (AVIF or WebP, under about 150 KB for the hero).
- **Never:** glossy blobs, orbs, nebulas, floating cubes, glowing grids, holographic brains, robots, stock 3D.

Image prompt recipe (when you have an image tool, otherwise write the prompt and leave a slot of the right size): subject from the world in one sentence · where the subject sits and which area stays calm and empty · light direction and time of day · material and texture · palette limited to the direction's tint · camera and crop · "no text, no logos, no people's faces" if not needed. Crop to the hero's aspect ratio at 1440 and at 375.

## Mobile

Everything stacks in reading order. The headline drops to the mobile size from `tokens.md`. The visual follows the actions. A dense preview simplifies instead of shrinking. Controls 44px.

## Motion

At most one entrance on load: a short fade and rise for the headline and support text with a small stagger. A subtle parallax on the scene image is optional and off for reduced motion. No looping motion in the hero.

## Moments and signature

The moment is the visual. The signature is a small detail only this product has, used here and again where it belongs: a route line, a live dot, keycaps, a hand-drawn underline.

## Checks for this area

- Headline fails the template test (swap the product name for another and it no longer fits).
- One primary and at most one secondary action.
- The hero image or preview is not a placeholder box.
- The LCP image is not lazy-loaded and is under budget.
- Text on an image measures 4.5:1 or has a scrim.
- Fills the viewport at 375, 768 and 1440 with no dead band.
