# Colour

How to build a colour system that is accessible, has few moving parts, and belongs to the product. Exact neutral ramps and role mapping are in `tokens.md`. This file covers the thinking.

Contents: System shape · Harmony as a check · Semantic colours · States · Section themes · Light and dark · Charts · Accessibility · Colour psychology · Cultural context · Validation

## System shape

Three layers, in this order:

1. **Neutral ramp** (11 steps, 50 to 950), tinted toward the product's world. It carries backgrounds, surfaces, borders and text. This is most of the screen.
2. **One accent** with its own ramp. It marks the primary action, the selection, and the one number that matters.
3. **Semantic colours** (success, warning, error, info) for meaning only, toned down to sit inside the palette.

The moments (see SKILL.md) are the exception. Inside one or two chosen places colour can be rich: a chart, a rendered object, an image. Each colour there still means something.

Generate ramps in OKLCH with `scripts/ramp.mjs` so steps look even. Hand-picked hex steps tend to bunch.

Add a secondary or tertiary brand colour only when the product genuinely has them (a real brand guide, a category system where each colour labels something). A palette of three competing hues is how generic interfaces happen.

## Harmony as a check

Complementary, analogous, triadic and split-complementary schemes describe how hues relate. Use them to check a choice, not to generate more colours.

- If the accent and a chart's second series clash, check the angle between them on the colour wheel.
- Analogous colours (neighbours) give calm charts. Complementary pairs give strong contrast and suit "good versus bad" or "this versus that."
- The 60-30-10 split (dominant, secondary, accent) is a starting sanity check. In this system neutral is the 60 and 30, accent is the 10 or less.

## Semantic colours

| Role | Hue family | Rule |
|---|---|---|
| Success | Green | Pair with a check icon or the word "Paid" |
| Warning | Amber | Pair with a label. Amber text needs a dark shade to pass contrast. |
| Error | Red | Pair with a message that says what to do |
| Info | Blue or neutral | Often neutral is enough |

Never use colour alone: status needs a label or icon (about 1 in 12 men has some colour-vision deficiency). Tone them down: a fully saturated green or red next to a quiet palette looks pasted on. Check each in both themes.

## States

Define every state once and reuse it.

| State | Treatment |
|---|---|
| Default | Base surface and text |
| Hover | One surface step (for example 100 to 200) or text colour step, 120ms |
| Active / pressed | One more step, plus scale 0.98 |
| Selected | Surface step with a hairline highlight, optionally the accent on a small marker |
| Focus | Visible 2px ring in the accent or text colour, 2px offset. Never remove without a replacement. |
| Disabled | Lower contrast text and no hover. Still readable, 3:1 minimum for the label if it must be understood. |
| Loading | Skeleton in two neutral steps, no shimmer loop on large areas |
| Error / success | Semantic colour plus message |

## Section themes

Different sections may carry a scoped theme (a dark band on a light page, category colours in a dashboard) using CSS variables, as set out in `section-plan.md`. The neutral ramp family and the accent hue stay the same project-wide. The accent moves along its own ramp for contrast, and every themed section is re-checked for contrast. A new accent hue per section is the quickest way to make a page look pasted together.

## Light and dark

Build both from semantic tokens. Do not invert.

- Dark surfaces are steps of the ramp, usually 950 for the page, 900 for raised, 800 for hover. Depth comes from the step and a hairline, not shadows.
- Pure black and pure white are harsh. Use 950 and 50.
- Re-check contrast for muted text, borders and semantic colours in each theme. Saturated colours that work on white often vibrate on dark.
- Reduce accent chroma slightly on dark, or move it one step lighter.
- Support the OS setting with `prefers-color-scheme`, and a manual toggle if the product needs one.

## Charts

- One accent per chart. The thing that matters (current month, tracked line) gets the accent, everything else sits in neutral steps.
- Several hues only when series must be told apart. Even then one leads and the rest are quiet.
- Grid lines are muted hairlines, labels are muted and use the mono with tabular numbers.
- Sequential data uses one hue changing in lightness. Diverging data uses two hues meeting at a neutral midpoint.
- Colour-blind check: do not rely on red against green. Add labels, direct labelling, or pattern.

## Accessibility

- Normal text 4.5:1, large text (24px, or 18.66px bold) 3:1, UI components and meaningful graphics 3:1 (WCAG 2.2 AA).
- Muted text is where contrast fails first. Measure it on the actual surface it sits on, not on white.
- Text over images needs a scrim or a calm area. Measure at the worst pixel behind the text.
- WCAG 2 contrast ratios are what the standard requires today. They miss some cases (thin light text on dark can pass and still be hard to read), so also look at the screen.
- `audit-dom.mjs` measures computed text contrast per element. It skips text on gradients and images, so check those by eye.

## Colour psychology

Treat colour associations as a hypothesis, not a rule. The research on colour and behaviour shows effects that are small and depend on context, and the confident claims common online ("blue builds trust, red creates urgency") are overstated. Use these rules instead.

1. **Category convention beats association.** Banking uses blue or green largely because users expect it. Breaking a convention costs recognition, so do it only on purpose.
2. **Context decides meaning.** Red means error in a form, celebration on a wedding invitation, a sale on a banner. One hex cannot carry one fixed meaning.
3. **Culture changes meaning.** See below. Ask who the audience is before choosing.
4. **Take colour from the product's world, not a mood table.** A farm marketplace draws colour from soil, crops and market signage, not from "green means growth." The direction step (SKILL.md) is where this happens.
5. **Contrast and hierarchy do more than hue.** The accent works because it is rare and legible, not because of its emotional charge.
6. **Test with the audience.** A palette justified only by theory is unproven. Show two options to five people from the audience when stakes are high.

Never write lines like "orange creates urgency, so use it for CTAs." State the real reason: it is the only saturated colour on the page.

## Cultural context

Associations differ by region, religion and community. For Indian audiences, a few flags to raise with the client, not rules:

- Red and gold are strongly auspicious in many Hindu wedding and festival contexts, and red is also the universal error colour in interfaces.
- Saffron and orange carry religious and, in some contexts, political associations. Use deliberately, and ask a brand that is meant to be neutral.
- Green has religious meaning for some communities and agricultural meaning for many. White is associated with mourning in some contexts and with cleanliness in others.
- Payment, health and government apps in India use a wide range of colours, so category habits are less fixed than in some other markets. Look at what the client's actual competitors use.

These are cautions from general knowledge. Confirm with the client for anything high-visibility.

## Validation

Before shipping a palette:

1. Run `audit-dom.mjs` for contrast on the real page.
2. View at 375 and 1440 in light and dark.
3. View a greyscale screenshot. The hierarchy and the primary action must survive without hue.
4. Simulate colour blindness (DevTools rendering emulation) and confirm status and charts still read.
5. Write the tokens and the usage rules (which role, which step) in the project config so the next change does not reintroduce arbitrary colours.
