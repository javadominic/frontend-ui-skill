# Fonts

Choose type for the product's character, not from a list of popular fonts. This file covers how to choose, what to avoid choosing by default, how to load fonts fast, and licensing for client work.

Contents: Choose by character · Defaults to question · Sources · Script coverage · Loading · Licensing · Pairing rules

## Choose by character

Start from the direction's character words (see SKILL.md). Translate them into type properties, then search.

| Character | Look for |
|---|---|
| Exact, technical, calm | Neutral grotesque or humanist sans, a mono for figures |
| Warm, human, local | Humanist sans with open shapes, or a soft serif for headings |
| Editorial, considered | A serif or high-contrast display for headlines, plain sans for body |
| Fast, playful | Rounded or geometric sans with some personality, kept to headlines |
| Serious, institutional | Sturdy serif or grotesque, restrained weights |

One family for the interface. At most one partner: a mono for figures and meta, or a display face for large headlines. A variable font gives weights and optical sizes with one file.

## Defaults to question

Inter, Roboto, Poppins, Space Grotesk, DM Sans, Montserrat and Open Sans are good fonts. They are also what a model picks when it has not decided anything, so they signal slop when nobody chose them.

Rule: a default font stays only when the report can state why it suits this product (for example, the project already uses it as part of the brand, or it has script coverage the alternatives lack). Otherwise search for something that fits the character.

Also check that a "distinctive" pick is not this year's trend. A font that shows up on every new startup page is the new default.

## Sources

| Source | Use for | Notes |
|---|---|---|
| Google Fonts | Most projects, widest script coverage including Indic | Open licences. Self-host the files. |
| Fontshare | Distinctive free families for creative, portfolio and premium looks | Free for commercial use, per their licence. Check the catalog and licence before committing. |
| Fontsource | Installing open fonts as npm packages | Self-hosted, versioned. |
| Adobe Fonts | Big professional library | Requires a subscription and cannot simply be handed to a client. Avoid for deliverables. |
| Font Squirrel | Downloadable families and webfont kits | Licence differs per font. Read it. |
| Bunny Fonts | A Google Fonts-compatible CDN | Self-hosting removes the need for it. |

Research tools for choosing, not dependencies: Typewolf (real sites for reference), Fontpair (combinations), WhatTheFont (identify a font from an image).

## Script coverage

Many clients will need Hindi or another Indic script, now or later. Check coverage before choosing a Latin font, not after.

- In Google Fonts, filter by script (Devanagari, Bengali, Tamil, Telugu, Gujarati and so on) and confirm the family really lists it. Many popular Latin fonts have no Devanagari.
- Choose a Latin face and an Indic face that share proportions: similar x-height and stroke weight. Match them in size so mixed lines do not look uneven.
- Families with Indic support worth checking (verify current coverage): Noto Sans and Noto Serif for each script, Hind, Mukta, Poppins (has Devanagari), Baloo 2, IBM Plex Sans Devanagari.
- Declare the stack explicitly so the browser does not fall back to a system font mid-line: `font-family: "Latin Face", "Devanagari Face", system-ui, sans-serif;`
- Indic scripts need more line height (see `india.md`).

## Loading

- Self-host. In Next.js use `next/font/google` or `next/font/local`, which also reduces layout shift by matching fallback metrics. Otherwise use Fontsource or your own `@font-face` with `.woff2`.
- Subset to the scripts and weights you use. Load variable fonts instead of many static weights.
- `font-display: swap`, and preload the one font used above the fold.
- Always give a fallback stack (`system-ui, -apple-system, "Segoe UI", sans-serif`).
- Do not load more than two families or more than three weights of one.

Next.js example:

```tsx
import { IBM_Plex_Mono } from "next/font/google";
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
```

## Licensing

Client work means the client must be allowed to keep using the font after handover.

- Prefer open-licence fonts (Google Fonts, Fontsource packages, Fontshare). Record the font and licence in the project config.
- Do not use Adobe Fonts or any subscription-only font in a deliverable unless the client holds the subscription.
- For downloaded fonts, read the licence file. Self-hosting is allowed under most open licences, but check.

## Pairing rules

- Contrast one thing: the roles differ (display against text), not everything at once.
- Numbers and meta in a mono, with `font-variant-numeric: tabular-nums`.
- Headlines in a display face sit in the display size range only. Body stays in the interface family.
- Never pair two fonts that are almost the same. Either make the difference obvious or use one family.
- Test with the real copy and the real numbers, in every script the product will use.
