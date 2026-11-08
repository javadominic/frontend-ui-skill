# Slop signs

Use this list for the audit step. Each sign says who can detect it, because that decides how much to trust the finding.

- **Code** means `scripts/slop-scan.mjs` or `scripts/audit-dom.mjs` finds it without judgment. Treat a hit as a candidate, read the line, then fix it.
- **Eyes** means a model or person has to look at a screenshot. Write the evidence ("hero and pricing use the same card") instead of a score, because scores drift between runs.
- **Human** means only the product owner can judge it. Raise it as a question in the report, not as a finding.

Contents: Colour · Surfaces · Icons and emoji · Copy · Type · Spacing · Layout · Charts and data · Motion · Theme costume · Quality · Whole-screen tests

## Colour

| Sign | Who | Fix |
|---|---|---|
| Purple, violet or blue-to-pink gradient anywhere | Code | One flat colour from the neutral ramp. A small tone shift inside one neutral is allowed. |
| Gradient text | Code | Solid text colour. |
| Coloured glow or shadow (`shadow-purple-500/30`, big zero-offset shadows) | Code | Neutral shadow on light themes, none on dark. Depth comes from surface steps and hairlines. |
| Blurred colour blobs or orbs behind content | Code, Eyes | Delete. If the area feels empty, the fix is content, not decoration. |
| Neon or translucent coloured borders | Code | Hairline: text colour at 6 to 10% opacity. |
| Backgrounds that read orange, blue or green in an app | Eyes | App surfaces stay neutral. Tint shows up in the accent and the one moment. |
| More than one accent in the chrome | Eyes | One accent, used rarely: primary action, selection, the one number that matters. |
| Text under 4.5:1 contrast (3:1 for large text and UI parts) | Code | Darken text or lighten the surface. Muted text is where this usually fails. |

## Surfaces

| Sign | Who | Fix |
|---|---|---|
| Glass: `backdrop-blur` on cards and panels | Code | Opaque surface step. Blur only for a sticky header over scrolling content. |
| Every card has border, shadow, radius and a hover lift | Eyes | Pick one signal for separation. Usually a surface step, or a hairline. |
| Everything is a pill or `rounded-full` | Code | Controls 8 to 10px, cards 12 to 16px, panels 14 to 20px. Inner radius = outer radius minus padding. |
| Bento grid used because it is a trend | Eyes | Keep a grid only if the content has real size differences. |

## Icons and emoji

| Sign | Who | Fix |
|---|---|---|
| Emoji as icons or decoration in labels, titles, buttons, badges | Code | Line icon from one set, one size, one stroke. Drop icons that add nothing. |
| Icons in coloured tiles or gradient squares | Eyes | Plain icon in the text colour of its role. |
| Mixed icon sets, sizes or stroke widths | Eyes | One set (the project's, otherwise lucide), 16 or 18px, 1.5 stroke. |
| Sparkle icon used for anything "AI" | Eyes | Name the action instead. |

## Copy

| Sign | Who | Fix |
|---|---|---|
| Greeting headline ("Welcome back, X!") | Code | Name the context: the page, the period. |
| Exclamation marks in interface text | Code | Remove. |
| Hype words: supercharge, seamless, unlock, revolutionize, game-changing, effortless, magic, next-gen, "AI-powered" on everything | Code | Say what it does, for whom, in plain words. |
| Unverified claims: "Loved by 10,000+ teams", "10x faster", "#1" | Code | Remove unless the owner confirms it is true. List each in the report. |
| Invented testimonials, logos, certifications, awards | Code, Human | Never invent. Leave a clearly marked gap and report it. |
| Placeholder data: Lorem ipsum, John Doe, `$123,456`, `[X]` | Code | Plausible real-looking data for the product's market. |
| Headline could belong to any product | Human | Rewrite from facts on the page. See the template test below. |
| Long placeholder search text ("Search anything...") | Eyes | `Search`. |
| Trailing periods on short labels and headlines | Eyes | Remove. Paragraphs keep theirs. |

## Type

| Sign | Who | Fix |
|---|---|---|
| Uppercase labels with wide tracking | Code | Sentence case. |
| Headings at weight 700 to 900 | Code | 400 to 600. Size and colour carry hierarchy. |
| Negative letter spacing on small text | Code | Zero. Tight tracking only on large display text. |
| Default font nobody chose (Inter, Roboto, Poppins, Space Grotesk) | Code, Human | Choose from the product's character. See `fonts.md`. |
| More than two font families | Code | One interface family plus at most one partner. |
| Numbers in different formats on one screen | Eyes | One format, `tabular-nums`, right-aligned in columns. |
| Italic for emphasis | Code | Use size or colour. |

## Spacing

| Sign | Who | Fix |
|---|---|---|
| Values off the 4px grid (`mt-[13px]`, `py-[11px]`) | Code | Nearest step in `tokens.md`. |
| Same kind of thing, different sizes (rows of unequal height) | Eyes | One height, one gap per kind. |
| Equal space inside groups and between groups | Eyes | Inside smaller than between. |
| Icons and labels not on one line or column | Eyes | One icon box width, fixed gap. |
| Sidebar rows loose, 40px or taller with big gaps | Eyes | 32 to 36px rows, 2 to 4px between. |

## Layout

| Sign | Who | Fix |
|---|---|---|
| Everything stacked and centered | Eyes, Code | Asymmetric split, or text over a large product view. Centered only for one or two short lines. |
| Row of three equal feature cards with icons | Eyes | Vary size by importance, or make it a list. |
| Dashboard squeezed into a narrow centered column | Eyes | App shell fills the viewport, sidebar 240 to 280, content capped near 1440 to 1600. |
| Dead empty band in the first screen | Eyes | Fill the viewport height or let the product view run past the bottom edge. |
| Two or more primary buttons, or three actions under the headline | Eyes | One primary, at most one secondary. |

## Charts and data

| Sign | Who | Fix |
|---|---|---|
| Rainbow bars inside one series | Eyes | One accent for what matters, neutral steps for the rest. |
| Sparklines or mini bars in every stat card | Eyes | Stat card = label, figure, change and what it compares to. |
| Two charts of the same size and type | Eyes | One main chart, everything else smaller and different in kind. |
| Chart type does not fit the data | Eyes | Trend = line, comparison = bars, share = one stacked bar or list, goal = progress bar. |
| Changes with no comparison ("+12%") | Eyes | "+12% vs last month". |
| Skill bars with percentages ("React 90%") | Eyes | Group by what you build with it, link to the project that proves it. |

## Motion

| Sign | Who | Fix |
|---|---|---|
| Looping pulse, ping, bounce, float, shimmer, breathing glow | Code | Remove unless the thing is live. |
| `transition-all`, bouncy springs, `hover:scale` on cards | Code | Name properties. Hover changes colour or surface. |
| Animating width, height, top, left, margin | Code | Transform and opacity. |
| Animation driven by scroll listeners | Code | ScrollTrigger, CSS scroll timeline, IntersectionObserver. |
| Every element flies in from a different side | Eyes | One entrance, short fade and rise, small stagger. |
| No `prefers-reduced-motion` handling | Code | Required. See `motion.md`. |
| Preset-effect libraries (AOS, ScrollReveal, Typed.js, Vanta, tsParticles, Animate.css) | Code | See `motion.md`. |

## Quality

| Sign | Who | Fix |
|---|---|---|
| `outline: none` with no replacement focus style | Code | Visible focus ring. |
| `div` or `span` with `onClick` | Code | `button` or `a`. |
| Images without alt, width or height | Code | Add them. Decorative images get empty alt. |
| Controls under 44px on small screens | Code | 44px minimum for primary controls. |
| Page scrolls sideways at 375px | Code | Fix the overflowing element. |
| Text under 11px | Code | Raise it. |

## Theme costume

A theme (terminal, cyber, retro, brutalist, "hacker") is a costume when it covers everything. It is a signature when it lives in one place. Generated pages almost always wear the costume.

| Sign | Who | Fix |
|---|---|---|
| SNAKE_CASE or SCREAMING labels in the UI (`PROTOCOL_01`, `CORE_PRIMITIVES_&_TOOLING`) | Code | Plain sentence-case words: "Tools", "Scope". |
| `//` or `/` prefixes, `[TAG]` prefixes, `>` prompts on ordinary labels and headings | Code | Remove. A prompt glyph is allowed once, as the signature. |
| Section names renamed into jargon ("Security_Protocols", "Discipline Dossier" instead of "Security work") | Eyes | Use the word a visitor would search for. |
| Monospace for every paragraph and label | Code, Eyes | Sans for reading text. Mono only for data: tool names, commands, payloads, numbers, file paths. |
| Blinking cursor, typing effect or scanline on titles | Code | Remove, or keep one static cursor glyph as the signature. |
| One hue on every border, fill, label, icon and button | Eyes | Neutral chrome. The hue marks the selected item, one status dot, one key figure. |
| Self-assigned status badges (VERIFIED, ACTIVE, AUTHENTICATED, CLICK_TO_INSPECT) | Code, Eyes | Delete. Show the evidence instead. Keep a badge only for a real distinction, once. |
| Several badges saying the same thing in different words | Eyes | One label per distinction. |
| Claims of verification or rigour with nothing shown ("zero synthetic metrics", "verified against production") | Human | Show a screenshot, output, repo or write-up, or remove the claim. |
| Every item framed as a bordered tile with an icon in a bordered tile | Eyes | Use a list, a table or open rows. Boxes only where grouping needs them. |

Test: remove the costume words and symbols from the screenshot. If nothing recognisable about the product is left, the costume was the whole design.

## Whole-screen tests (run these last)

1. **Template test.** Swap in another product's name. If the screen still fits, push the copy, the visual and the signature detail harder. (Eyes, Human)
2. **One bright element.** Point at the one thing that carries colour and craft. If you cannot, there is none. (Eyes)
3. **Squint test.** Blur the screenshot. The primary action and the bright element should survive. (Eyes)
4. **Sentence test.** Say what the visual shows and why it belongs to this product, in one sentence. If it needs two, it is decoration. (Human)
