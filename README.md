# Frontend UI skill

A skill for AI coding assistants that stops generated interfaces from looking generated. It finds the usual slop (glowing gradients, emoji icons, shouting copy, arbitrary spacing, looping motion), fixes it in a fixed order, and pushes the result toward a screen that only your product could have.

It works on a whole page or on one area you name: a dashboard, a hero, a skills and projects section, a pricing block, a single component.

Built for web frontends: HTML, React, Next.js, Tailwind. Includes defaults for Indian-market client sites (rupee formatting, Indic scripts, WhatsApp and call actions), which you can ignore for other markets.

## What it does

- **Three modes:** audit (report only), fix (edit existing UI), generate (build new UI with the same rules).
- **Scope lock:** change only the chosen area, inherit the page's existing tokens first, check the seam with neighbouring sections afterwards.
- **Section plan:** each section gets its own layout and its own animation library, so one project can mix GSAP, Motion, OGL, Lottie and plain CSS safely. Colour, fonts and the icon set stay global, with scoped section themes for variety.
- **Nine ordered passes:** copy, spacing, colour, type, icons, layout, components, one visual moment, motion.
- **Scripts that find slop without judgment:** a source scanner (including theme-costume patterns and two animation libraries in one file), a rendered-page audit (contrast, tap targets, fonts, focus rings, looping animation, screenshots at 375, 768 and 1440 px) and an OKLCH colour ramp generator.
- **Reference rules** for colour (including colour psychology), fonts and licensing, animation libraries and component recipes, a layout component catalog, performance and accessibility gates, and config-driven structure.
- **Theme discipline:** a terminal, security or retro flavour lives in one layer. No SNAKE_CASE labels, `//` prefixes, all-monospace pages, blinking cursors or self-assigned status badges.
- **Hard rules:** never invent testimonials, logos, metrics or prices; always handle reduced motion; keep content in config.

## Install

**Claude Code:** copy this folder into `~/.claude/skills/frontend-ui-skill/` (all projects) or `.claude/skills/frontend-ui-skill/` inside a project.

**Claude.ai:** upload the packaged `.skill` file in your skills settings.

**Other agents that read `SKILL.md` folders:** place the folder where that tool looks for skills. The scripts need only Node.js 18 or newer.

## Use it

Ask in plain words. Examples:

- `Audit the hero on my landing page. Don't change anything.`
- `Fix only the dashboard. Keep the rest of the page as it is.`
- `Redo my skills and projects section so it shows real proof.`
- `Build a pricing section for a small Pune phone repair shop.`
- `This looks AI-generated. Clean it up.`

## Scripts

```bash
# 1. Static scan of source files (no dependencies)
node scripts/slop-scan.mjs src/ --fail-on high

# 2. Rendered audit, one area or the whole page (needs Playwright)
npm i -D playwright && npx playwright install chromium
node scripts/audit-dom.mjs http://localhost:3000 --selector "#dashboard" --out ./audit

# 3. Generate a neutral or accent colour ramp as CSS variables
node scripts/ramp.mjs --name graphite --hue 260 --chroma 0.006
```

A scan hit is a candidate, not a verdict. Read the line before fixing it.

## What it can and cannot catch

| Who can detect it | Examples |
|---|---|
| Code | gradient text, emoji in UI, `transition-all`, looping animation, off-grid spacing, low contrast, small tap targets, missing alt text, missing reduced-motion handling |
| A model looking at a screenshot | everything centered and stacked, equal cards everywhere, two same-size charts, decoration with no meaning |
| Only a human | taste, brand voice, whether the colours fit the audience |

A clean scan means no known slop pattern was found. It does not mean the design is good.

## Layout

```
SKILL.md                 process, modes, scope rules, passes, hard rules, report format
references/
  signs.md               audit list, who can detect each sign
  tokens.md              spacing, radius, type scale, neutral ramps, easing, breakpoints
  colour.md              colour system, states, themes, charts, accessibility, colour psychology
  fonts.md               choosing fonts, Indic coverage, loading, licensing
  motion.md              animation libraries by tier, mixing them by section, performance, reduced motion, recipes
  section-plan.md        per-section layout, motion library, scoped theme and icons; what may vary
  layouts.md             layout components: master-detail, split, case studies, timeline and more
  icons.md               icon set choice, allowed extras, sizing, accessibility
  quality.md             performance budget, accessibility, responsive, discoverability
  india.md               Indian-market defaults
  areas/                 dashboard, hero, skills-proof, pricing-proof
examples/
  security-section.html  a security portfolio section rebuilt with these rules
scripts/
  slop-scan.mjs          static scan
  audit-dom.mjs          rendered audit and screenshots
  ramp.mjs               OKLCH colour ramp generator
```

## Status

Early draft. The three scripts were tested on small sample files (one deliberately sloppy, one clean, one copied from a real over-themed security section). One example section was rebuilt with the rules and passes both scanners. The skill itself has not yet been run against a range of real projects, so expect rules to change as it meets real pages. Font names, library licences and Indic font coverage were written from general knowledge and should be checked before you rely on them for client work.

## Contributing

Open an issue with a screenshot of the slop it missed, or of a good design it wrongly flagged.

## Credits and license

Add credits for any work this skill draws on, and the license, here before publishing.
