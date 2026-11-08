# Section plan

A project is a set of sections, and each section has its own job. This file is how the skill chooses layout, motion library, colour treatment, icons and type for each section separately, without the whole page turning into a collage.

Contents: The plan · What may vary per section · What stays global · Scoped section themes · Mix by product type · Worked example · Checks

## The plan

Before building, write one row per section (or per area in a scoped run). Keep it in the report.

| Section | Job | Layout (`layouts.md`) | Motion (library, recipe) | Section theme | Icons | Moment |
|---|---|---|---|---|---|---|

- **Job:** what the visitor should do or understand here, in one phrase.
- **Layout:** one entry from `layouts.md`.
- **Motion:** the library and the recipe from `motion.md`, or "CSS only", or "none". Say why when it is not CSS.
- **Section theme:** "default" or the scoped override (see below).
- **Icons:** which set, or "none".
- **Moment:** the one memorable thing in this section, if it has one. Most sections have none. The page has one or two in total.

Do not give every section a different treatment. Three or four distinct treatments across a page read as designed. Eight read as a collage.

## What may vary per section

| Thing | May vary per section | Limit |
|---|---|---|
| Animation library | Yes. OGL in one section, GSAP in another, Motion in app UI, CSS elsewhere | One animator per element. Shared easing and durations. Lazy-load heavy ones. See `motion.md`. |
| Layout | Yes | Each from `layouts.md`, for a content reason |
| Surface mode | Yes. A dark band on a light page, or the reverse | Defined as a scoped theme, same neutral ramp family |
| Colour inside the moment | Yes. A chart, rendered object or image may be rich | Each colour means something. Stays inside the product's world. |
| Category colours | Yes, when categories are real (order status, service lines, chart series) | Fixed mapping used everywhere, toned to the palette, never colour alone |
| Illustration style or imagery | Within one art direction | Same light, same treatment, same crop language |
| Display type size and weight | Yes, within the type scale | Same two families |

## What stays global

These are what make one page look like one product. Changing them per section is how pages look generated or pasted together.

| Thing | Rule |
|---|---|
| Neutral ramp family | One per project. Sections may use different steps, not a different ramp. |
| Accent in the chrome | One hue for buttons, links, selection and focus on every section |
| Font families | At most two for the whole project (interface family plus one partner). A section may use the display face at large sizes, never a third family. |
| Interface icon set | One per project, one size and stroke. See `icons.md`. |
| Spacing scale, radii, easing, durations | The tokens in `tokens.md` |
| Semantic colours | Same green, amber, red and blue meanings everywhere |
| Copy voice | One voice |

If the user wants more variety than this allows, offer scoped section themes first, and give the trade-off in a line: the more things vary, the less the product feels like one thing.

## Scoped section themes

A section theme overrides tokens for one section using CSS variables. It changes surfaces and text, not the accent hue, and not the fonts.

```css
:root { --bg: var(--ink-50); --surface: #fff; --text: var(--ink-900); --text-2: var(--ink-600); --accent: var(--accent-600); }

.theme-inverse {            /* dark band on a light page */
  --bg: var(--ink-950);
  --surface: var(--ink-900);
  --text: var(--ink-50);
  --text-2: var(--ink-400);
  --accent: var(--accent-400);   /* same hue, lighter step for contrast on dark */
  background: var(--bg); color: var(--text);
}
```

Rules:

- Check contrast again inside the scoped section (muted text and accent first).
- The accent keeps its hue and moves along its own ramp.
- A themed section needs a reason: emphasis (the proof section), rhythm (breaking a long light page), or a product mode (a dark code or terminal area). Not decoration.
- Dashboards: category colours get their own scoped variables (`--cat-1` to `--cat-6`), defined once, with names that say what they mean.

## Mix by product type

Starting points. The direction step can overrule them with a reason.

| Product | Layout leaning | Motion mix | Notes |
|---|---|---|---|
| Agency or local-business site | Split hero, alternating case studies, list | GSAP for one story section, CSS elsewhere | Fast first screen. WhatsApp and call actions. |
| Portfolio, security or developer | Master-detail, compact project list | CSS and WAAPI, Motion if React, GSAP for one reveal | Proof is the moment. |
| SaaS marketing page | Split hero with product view, comparison table | GSAP for hero sequence, CSS elsewhere | Real product preview, not stock art. |
| App or dashboard | Shell with sidebar, stat row and main chart | Motion for lists, panels, layout changes. CSS for hover | Quiet chrome. No decorative loops. |
| E-commerce or catalogue | Grid with real size differences, sticky filters | CSS, AutoAnimate for filtering | Image weight is the budget. |
| Creative, game or stream overlay | Full-bleed scene, minimal UI | OGL or R3F or Rive for the one visual, GSAP for sequences | The visual is the product. Keep it lazy-loaded and reduced-motion safe. |
| Education or content | Sticky side and content, timeline | CSS, IntersectionObserver reveals | Reading comes first. |

## Worked example (agency site)

| Section | Job | Layout | Motion | Theme | Icons | Moment |
|---|---|---|---|---|---|---|
| Hero | Say what we do and for whom | Split with media | One entrance, CSS | default | none | A real project preview |
| Services | Help the visitor find their need | Open list with expandable rows | CSS grid-row expand | default | Lucide, 16px | none |
| Work | Prove it | Alternating case studies | GSAP ScrollTrigger reveal, once | default | none | The lead case study |
| Process | Show how it works | Timeline | IntersectionObserver reveal | default | none | none |
| Proof | Show real clients and results | One quote plus compact list | CSS | inverse | none | none |
| Contact | Make reaching us easy | Split with form | none | default | Lucide | WhatsApp action |

Three libraries or fewer, and the heavy ones are absent because nothing needed them.

## Checks

- Every section has a row, and every non-CSS motion choice has a reason.
- No element is animated by two libraries.
- Heavy libraries are lazy-loaded in their own section.
- Only allowed things vary between sections. Global items are identical on every section.
- Scoped themes pass contrast.
- The page has at most two moments.
