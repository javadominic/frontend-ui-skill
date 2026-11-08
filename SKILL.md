---
name: frontend-ui-skill
description: Design, redesign, review or clean up web and app interfaces so they do not look AI-generated. Use for any UI work - landing pages, hero sections, dashboards, app screens, components, portfolio skills and project-proof sections, pricing, forms - on a whole page or on one chosen area only. Use it whenever the user says sloppy, AI-looking, generic, template-y, "make it look professional", unslop, polish, redesign this section, fix the design, or asks for a new page, dashboard or component, even if they do not name this skill. Includes scan scripts that find slop in code and in the rendered page, colour, font, motion and quality rules, and defaults for Indian-market client sites.
---

# Frontend UI skill

Generated interfaces fail in the same ways: every surface glows, every label has an emoji, spacing is whatever number was typed that day, the copy shouts, and the page could belong to any product. This skill fixes the craft and keeps the product. Features, content and section order stay. Every size, colour, word and image becomes a decision.

Removing slop is half the job. A clean screen that could belong to any product is the next template. Every run ends with a screen that only this product could have.

**Where richness goes.** Slop spreads colour and effects over chrome: backgrounds, buttons, borders, labels. Craft keeps chrome quiet and puts the richness into one or two moments of content people remember: a rendered object, a beautiful chart, a real photograph, a preview of the real product.

## Modes

Pick one from the request. If unclear, ask one short question.

| Mode | When | Edits code? |
|---|---|---|
| **Audit** | "review", "what's wrong with", "is this sloppy" | No. Findings and a plan only. |
| **Fix** | an existing screen, section or component to improve | Yes, inside the scope. |
| **Generate** | a new page, section or component | Yes. Same rules apply from the start. |

## Scope

Set the scope before anything else. The user may name it in plain words.

| Scope | Examples |
|---|---|
| **Page** | the whole landing page, the whole app |
| **Area** | hero, dashboard, skills section, project proof, pricing, nav, footer, one form |
| **Component** | a card, a stat tile, a table, one button style |

Rules for a scoped run:

1. **Scope lock.** Change only inside the scope. Problems outside it go into the report as suggestions, never into the code.
2. **Inherit first.** Read the surrounding page's tokens, fonts, spacing, radii, motion and config before designing. The new area must match what is already there. If the page has no system, create a minimal token set, say so, and keep it small.
3. **Seam check.** At the end, compare the new area with the sections directly above and below it: spacing rhythm, type, accent, motion timing. A good section on a mismatched page is a worse result than no change.
4. **Area modules.** If the scope matches one, read it before the passes:

| Area | File |
|---|---|
| Dashboard, admin, app shell, tables, charts | `references/areas/dashboard.md` |
| Hero, first screen, top navigation | `references/areas/hero.md` |
| Skills, tech stack, projects, case studies, portfolio | `references/areas/skills-proof.md` |
| Pricing, testimonials, logos, counts, FAQ | `references/areas/pricing-proof.md` |

Other areas (footer, forms, settings, empty states): apply the passes and the hard rules below, and note in the report that no area module exists yet.

## Project defaults

Match the project's stack and tokens when they exist. For a new project with no stated stack:

- Next.js (App Router) with Tailwind, tokens as CSS variables, icons from lucide, fonts via `next/font`.
- Standalone pages: one HTML file, inline CSS with variables, no build step.
- Motion: pick per section, not per project. GSAP for scroll stories, Motion for React app UI, OGL or R3F for a visual moment, Lottie or Rive for designed states, CSS for everything small. See the section plan and `references/motion.md`.
- Content, theme and links live in config (`references/quality.md`).

These are starting points. If the user states a different stack or component library, use theirs.

## Run it

1. **Scope and mode.** State them in one line.
2. **Read the context.** Find the files that render the scope. Read existing tokens, fonts, config. If you can run or render the app, take screenshots at 375 and 1440 wide. If you only have a screenshot or a URL, say what you could not inspect.
3. **Scan.** If there is code: `node scripts/slop-scan.mjs <paths>`. If you can render it: `node scripts/audit-dom.mjs <url or file> [--selector "<area>"]`. Treat hits as candidates and read each line. Scripts only find measurable signs, so the next step still matters.
4. **Audit.** Go through `references/signs.md`. List each sign with where it lives, one line each, and who can detect it (code, eyes, human).
5. **Write the section plan** (`references/section-plan.md`): one row per section or area with its layout, motion library and recipe, scoped theme, icons and moment. Libraries are chosen per section, so one project can mix GSAP, Motion, OGL, Lottie and plain CSS, each in its own place. Do not default to a stack of bordered cards, and do not leave a section completely still unless the user asked for a static page.
6. **Decide how much to change.**
   - **Heavy slop** (many signs across colour, type, icons, copy): full process.
   - **Light slop** (mostly designed, a few signs): polish mode. Fix what the audit found, keep the palette, type, layout and visual, put bigger ideas in the report as suggestions.
   - **No slop:** say so, suggest at most two or three refinements with exact values, change nothing unless the user agrees. Never change a good screen to make it different.
7. **Set the direction, then stop for confirmation** (see Direction). Skip the wait only if the user said to just do it, or the run is polish mode on an existing brand.
8. **Fix in passes** (see Passes). Finish each pass across the whole scope before starting the next.
9. **Verify and loop** (see Verify). If the scan still shows high findings, fix them and scan again.
10. **Report** (see Report).

Keep it quick. Render at most three times per run.

## Direction

Write short lines (product, character, world, moments, signature, layout and motion) from what the page says the product does and who it is for, never from what is trending.

- **Product.** What it does and for whom, one plain sentence.
- **Character.** Two or three concrete words ("calm, exact, a little warm"). Not allowed: clean, modern, sleek, minimal, premium. They describe every template.
- **World.** The place or material the product belongs to (paper and ink, instruments and night shifts, soil and market stalls). It sets the tint of the neutrals, the accent and the visual.
- **Moments.** One or two places that get rich colour, material and detail, chosen from what the product shows.
- **Signature.** One small detail only this product would have, used consistently: a live status dot, keycaps, a route line, a hand-drawn underline. One, not five.
- **Layout and motion.** Name the layout from `references/layouts.md` and the one purposeful motion from `references/motion.md` that each area will use (for example master-detail with a sliding marker and a panel fade). The section plan holds these. If you cannot name them, the area will default to boxes and stillness.

**Theme discipline.** If the product has a flavour (terminal, security, retro, brutalist, playful), the flavour lives in one layer: the signature, or the display type, or the one visual. Everything else is plain. A theme worn on every label, border, badge and paragraph is a costume, and costumes are what make pages look generated. Section names are the words a visitor would search for. Reading text is in a readable face. Mono is for data.

If there is a real brand (a logo file, a colour, a font that is not slop), keep it and build the direction around it. In a scoped run, the direction is one line that confirms the page's existing character.

## Passes

Do them in this order. The order matters: copy first because the length of a headline decides its size and place, spacing before everything visual because the rhythm changes how everything else reads, motion last because it should fit a screen that already works.

1. **Copy.** Plain headlines from facts already on the page. No greeting headlines, exclamation marks, hype words or unverified claims. Short labels, no trailing periods on short strings, changes say what they compare to. Real-looking data. Rules in `signs.md`.
2. **Spacing.** Everything on the 4px grid, same thing same size, inside-group smaller than between-groups, aligned columns. Values in `tokens.md`.
3. **Colour.** One tinted neutral ramp, three text roles, one accent used rarely. No hue gradients, gradient text, glows, coloured shadows or blobs. Hairline borders. Details in `references/colour.md`, values in `tokens.md`.
4. **Type.** Chosen for the character, one family plus at most one partner, weights 400 to 600, sentence case, tabular figures. Check script coverage. Details in `references/fonts.md`.
5. **Icons.** One line set for the interface (`references/icons.md`), one size, one stroke, colour from the text role. Remove emoji and icons that add nothing.
6. **Layout.** Keep sections and order. Rebuild the area with the layout you chose from `references/layouts.md`. Boxes only where grouping needs them. Asymmetric over centered stack. One primary action.
7. **Components and details.** Nested radii, quiet counts and badges, chart hierarchy, stat cards that are numbers, hover and focus states inside the palette, visible focus ring, logo as plain wordmark. Area modules have specifics.
8. **Visual moment.** Build the one memorable thing: a real preview with plausible data, a rich chart, a rendered object, a real photo. Do not replace removed decoration with new decoration, and do not swap one trend for another (glass, grain, neon, bento).
9. **Motion and states.** Remove loops and bouncy effects, then add the one purposeful motion you chose (sliding marker, panel change, staggered reveal, expandable row), using the recipes in `references/motion.md`. One entrance at most. Reduced motion always handled.

## Hard rules

These apply in every mode and scope.

- **Never invent.** No fake testimonials, logos, client names, user counts, certifications, prices or metrics. Unknown content becomes a marked gap listed in the report.
- **Keep the product.** Do not rename it, remove features or reorder sections unless asked. Keep a real logo. If the logo is slop (emoji, sparkle in a gradient tile), redraw it flat as a wordmark.
- **Reduced motion.** Every animated page handles `prefers-reduced-motion`.
- **Accessibility floor.** 4.5:1 text contrast, visible focus, real buttons and links, alt text, 44px primary controls on small screens.
- **Performance floor.** LCP image not lazy-loaded and light, images sized, fonts self-hosted and subset, heavy libraries lazy-loaded.
- **Content in config.** Copy, links, contact details and theme tokens live in config and content files, not scattered in components.
- **No costume.** No SNAKE_CASE labels, no `//` or `[TAG]` prefixes, no all-monospace pages, no blinking cursors, no self-assigned status badges (VERIFIED, ACTIVE, AUTHENTICATED). See `signs.md`, Theme costume.
- **One animator per element, two font families at most, one accent in the chrome, one icon set for the interface.** Different sections may use different animation libraries, and may carry a scoped section theme (see `references/section-plan.md`).
- **Indian audience.** Load `references/india.md` when the audience or client is in India, or unspecified for client work: rupee format and grouping, Indic script support, WhatsApp and call actions, realistic Indian mock data, mid-range Android on mobile data as the baseline.
- **Fonts and libraries for client work** must be open-licensed or held by the client.
- **Do not claim the result is good.** Report what was checked and what cannot be checked.

## Verify

1. `slop-scan.mjs` on the changed paths: no high findings, and no snake-label, slash-prefix, snake-title or mono-everywhere hits. Any remaining medium or low has a stated reason. Scan again after each fix.
2. `audit-dom.mjs` on the rendered scope: no measurable problems, or each is listed.
3. Look at the 375, 768 and 1440 screenshots yourself.
4. Keyboard through the scope. Reduced motion on.
5. Whole-screen tests at the end of `signs.md` (template, one bright element, squint, one-sentence), plus the costume test: remove the theme words and symbols, and the page must still say what the product is.
6. Scoped run: seam check against the neighbouring sections.

If a check could not be run, say which and why.

## Report

Use this structure, short:

```
Scope and mode:
Direction: product / character / world / moments / signature (one line each)
Inherited from the page: (scoped runs only)
Audit: what was found, by pass (counts, not essays)
Changes: a few lines per pass
Left alone and why: (including out-of-scope suggestions)
Needs the owner: unverified claims removed, gaps to fill (testimonials, logos, prices, photos), taste calls
Checks run: scripts, screenshots, keyboard, reduced motion; any not run
```

## What the checks cannot do

Scripts catch measurable slop. Screenshots let you judge hierarchy and balance. Only the owner can judge taste, voice and fit for the audience. Raise those as questions. A clean scan means no known slop pattern was found, not that the design is good.

## Files

- `references/signs.md`: the audit list with who can detect each sign
- `references/tokens.md`: spacing, radius, type scale, neutral ramps, easing, breakpoints
- `references/colour.md`: colour system, states, themes, charts, accessibility, colour psychology
- `references/fonts.md`: choosing, defaults to question, Indic coverage, loading, licensing
- `references/motion.md`: library tiers, performance, reduced motion, scroll patterns, component recipes
- `references/section-plan.md`: per-section choices, what may vary between sections and what stays global, scoped section themes
- `references/icons.md`: icon set choice, allowed extras, sizing, accessibility
- `references/layouts.md`: layout components with when to use them and CSS skeletons
- `references/quality.md`: performance budget, accessibility, responsive, discoverability, config structure
- `references/india.md`: Indian-market defaults
- `references/areas/*.md`: dashboard, hero, skills-proof, pricing-proof
- `scripts/slop-scan.mjs`: static scan of source files
- `scripts/audit-dom.mjs`: rendered audit and screenshots (needs Playwright)
- `scripts/ramp.mjs`: OKLCH colour ramp generator
