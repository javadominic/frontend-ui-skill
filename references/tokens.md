# Tokens

Exact values for every pass. Use these unless the project already has a system, in which case read that first and match it (see scope rules in SKILL.md).

Contents: Spacing · Radius · Type scale · Neutral ramps · Accent · Semantic roles · Easing and durations · Breakpoints · Hit targets

## Spacing

Everything sits on a 4px grid. Use these steps:

`4  8  12  16  20  24  32  40  48  64  80  96  128`

| Use | Value |
|---|---|
| Gap between an icon and its label | 8 (10 in roomy rows) |
| Space inside a group (list rows, form fields) | 4 to 12 |
| Space between groups | 24 to 32 |
| Compact panel and sidebar padding | 16 |
| Card padding | 20 to 24 |
| Page edge padding | 24 to 32 (16 on mobile) |
| Space between page sections (landing) | 80 to 128 |
| Sidebar row height | 32 to 36, with 2 to 4 between rows |
| Sidebar section label | 24 above, 8 below |

A 2px nudge inside a small control is fine. A value that exactly centers something is fine. Everything else snaps to the grid.

## Radius

| Element | Radius |
|---|---|
| Inputs, buttons, small controls | 8 to 10 |
| Cards | 12 to 16 |
| Panels, modals | 14 to 20 |
| Pills | Only for tags and toggles, with half the height as the radius |

Nested radius: inner = outer minus the padding between them, minimum 4.

## Type scale

Pick a family for the character first (see `fonts.md`). Sizes in px, line height in px.

| Role | Size / line | Weight | Notes |
|---|---|---|---|
| Caption, meta | 12 / 16 | 400 | Never below 11 |
| Small, table cells, sidebar | 13 / 20 | 400 to 500 | Dense app UI |
| Body | 15 or 16 / 24 | 400 | 16 on marketing pages |
| Lead | 18 / 28 | 400 | |
| Title (section) | 24 / 32 | 500 | |
| Heading | 32 / 40 | 500 | Tracking -0.01em allowed from here up |
| Display | 48 to 64 / 1.05 to 1.1 | 500 | Tracking -0.02em allowed |
| Display, mobile | 36 to 40 / 1.1 | 500 | |

Weights: 400 and 500, 600 for rare emphasis, never 700 or above on headings. Body line length 60 to 75 characters. Use `font-variant-numeric: tabular-nums` on every figure. Indic scripts need more line height: see `india.md`.

## Neutral ramps

Generated with `scripts/ramp.mjs` in OKLCH, so each step is an even visual jump. Pick one by the product's world, keep it for surfaces, borders and text.

Regenerate or tune with: `node scripts/ramp.mjs --name <name> --hue <0-360> --chroma <0.004-0.02>`

**Graphite** (default for apps and dashboards, near-grey):
`50 #f8fafe · 100 #f1f4f8 · 200 #e4e6ea · 300 #d2d4d8 · 400 #9fa2a5 · 500 #727578 · 600 #535559 · 700 #3e4043 · 800 #252729 · 900 #16171a · 950 #090a0d`

**Warm** (paper, food, craft, editorial; use on landing pages, not app chrome):
`50 #fff9f3 · 100 #f9f2eb · 200 #ece5de · 300 #d9d3cc · 400 #a6a09a · 500 #79736d · 600 #5a544e · 700 #443f39 · 800 #2a2520 · 900 #1b1611 · 950 #0d0905`

**Ink** (technical, night-shift tools, security; slight blue):
`50 #f7fafe · 100 #ecf4fe · 200 #dde7f5 · 300 #cbd5e3 · 400 #99a2af · 500 #6c7582 · 600 #4d5662 · 700 #38404b · 800 #1f2731 · 900 #101821 · 950 #050a13`

Mapping (light theme / dark theme):

| Role | Light | Dark |
|---|---|---|
| Page background | 50 | 950 |
| Raised surface | white or 100 | 900 |
| Surface hover or selected | 100 or 200 | 800 |
| Hairline border | text colour at 6 to 10% opacity | same |
| Text primary | 900 | 50 |
| Text secondary | 600 | 400 |
| Text muted | 500 (4.5:1 on white, check on tinted surfaces) | 400 |

Text muted at step 500 only just passes on white. On a tinted surface, move it to 600 and check. On dark, the secondary step 400 on 950 passes comfortably.

## Accent

One accent. Take it from the product's world or the real brand colour. Generate its ramp with `ramp.mjs` at chroma 0.10 to 0.18 and the chosen hue.

- Text on the accent needs 4.5:1. If it fails, darken the accent or use dark text on it.
- Accent used as text on a light surface uses a darker step (usually 600 or 700).
- On dark themes the primary button can be off-white (step 50) with dark text, and the accent lives in a small place like the selection or one key figure.

## Semantic roles

Name tokens by role, not by value. Keep two layers: raw ramp values (`graphite-900`) and semantic names that point to them.

```css
:root {
  --bg: var(--graphite-50);
  --surface: #fff;
  --surface-hover: var(--graphite-100);
  --border: color-mix(in oklab, var(--graphite-900) 8%, transparent);
  --text: var(--graphite-900);
  --text-2: var(--graphite-600);
  --text-3: var(--graphite-500);
  --accent: var(--accent-600);
  --accent-text: #fff;
  --focus: var(--accent-600);
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: var(--graphite-950);
    --surface: var(--graphite-900);
    --surface-hover: var(--graphite-800);
    --text: var(--graphite-50);
    --text-2: var(--graphite-400);
    --text-3: var(--graphite-400);
  }
}
```

Status colours (success, warning, error, info) carry meaning only, are toned down to sit inside the palette, and always come with a label or icon, never colour alone.

## Easing and durations

One easing curve across a project, plus a few durations.

```css
--ease: cubic-bezier(0.22, 1, 0.36, 1); /* settles quickly, no overshoot */
--dur-1: 120ms; /* hover, press, colour changes */
--dur-2: 200ms; /* menus, tooltips, small enters */
--dur-3: 320ms; /* panels, modals, page content enter */
--dur-4: 500ms; /* one hero entrance at most */
```

## Breakpoints

Design at 375 first. Verify at 375, 768, 1024 and 1440.

| Name | Min width | Notes |
|---|---|---|
| base | 0 | Single column, 16px edge padding, 44px controls |
| md | 768 | Two columns where the content needs it |
| lg | 1024 | App sidebar appears |
| xl | 1440 | Cap content width near 1440 to 1600 |

## Hit targets

44px minimum for primary controls on screens 768px wide or less, 32px minimum on desktop. WCAG 2.2 AA sets a 24px floor, which is a minimum and not a goal. Inline links in a paragraph are exempt.
