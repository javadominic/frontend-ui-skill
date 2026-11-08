# Layout components

A catalog of layouts to choose from, so sections do not default to a stack of bordered boxes. Pick by what the content is, not by what looks new. Each entry says when it fits, how it behaves on a phone, and gives a starting skeleton using the tokens in `tokens.md`.

Contents: Choosing · Master-detail · Open list with expandable rows · Split with media · Alternating case studies · Sticky side and content · Stat row with main chart · Comparison table · Timeline · Grid with real size differences · Tabs · Rules for all

## Choosing

| Content | Layout |
|---|---|
| Several items, each with a detail view (skills, services, protocols, plans) | Master-detail (desktop), expandable rows or tabs (mobile) |
| A list of things with short descriptions | Open list with hairlines, not cards |
| One strong visual plus a message | Split with media |
| Projects or case studies with screenshots | Alternating rows, or one large and a compact list |
| Long page with a navigation aid (docs, settings, policies) | Sticky side and content |
| Dashboard overview | Stat row above one main chart, narrow list beside it |
| Plans or options compared on the same attributes | Comparison table |
| Things in order of time | Timeline |
| Items genuinely of different importance | Grid with real size differences |

If every item is equal and short, a plain list beats cards. Cards need a reason: the item has an image, an action or a different state.

## Master-detail

Use for 3 to 7 items that each have a longer description, like the Security section. A list on the left selects what shows on the right.

Desktop (from 1024px): list column 320 to 400px, detail fluid. Phone: the same list becomes an accordion (expandable rows) or a horizontal tab strip, with the detail below the selected item.

```css
.md { display: grid; gap: 32px; grid-template-columns: minmax(280px, 380px) 1fr; align-items: start; }
.md-list { display: grid; gap: 2px; position: sticky; top: 24px; }
.md-item { display: grid; gap: 4px; padding: 12px 16px; border-radius: 10px; text-align: left; }
.md-item[aria-selected="true"] { background: var(--surface-hover); }
.md-detail { min-width: 0; }
@media (max-width: 1023px) { .md { grid-template-columns: 1fr; } .md-list { position: static; } }
```

- The list uses real tabs (`role="tablist"`, `role="tab"`, `aria-selected`, arrow-key navigation) or buttons, and the panel `role="tabpanel"`.
- The selected state is a surface step and a small accent marker, not a bright border and green fill.
- Detail structure, in this order: title, one sentence of scope, tools as plain text, the evidence (screenshot, link, output), then secondary facts.
- Animation: a marker that slides between items and a short fade and rise on the panel. See the recipes in `motion.md`.

## Open list with expandable rows

For FAQs, services, long skill groups. Rows separated by a hairline, no boxes.

```html
<details class="row"><summary>Application security testing</summary><p>…</p></details>
```

```css
.row { border-top: 1px solid var(--border); padding: 16px 0; }
.row summary { display: flex; justify-content: space-between; gap: 16px; cursor: pointer; font-weight: 500; }
```

Animate the open state with `grid-template-rows: 0fr` to `1fr` on a wrapper (transform-free height animation that is cheap), 200ms, off for reduced motion.

## Split with media

Text on one side, a real visual on the other, at least half the width for the visual. Centre the text block vertically against the visual. On a phone the visual follows the text.

```css
.split { display: grid; gap: 48px; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: center; }
@media (max-width: 767px) { .split { grid-template-columns: 1fr; gap: 32px; } }
```

## Alternating case studies

For two to four flagship projects. Each row: screenshot one side, text the other, swapping sides. Keep the image aspect ratio identical across rows. Below them, the remaining projects as a compact list (name, one line, stack, link).

```css
.case { display: grid; gap: 48px; grid-template-columns: 1fr 1fr; align-items: center; }
.case:nth-child(even) .case-media { order: 2; }
@media (max-width: 767px) { .case { grid-template-columns: 1fr; } .case:nth-child(even) .case-media { order: 0; } }
```

## Sticky side and content

A narrow navigation or summary column that stays in view while a long column scrolls.

```css
.sc { display: grid; gap: 48px; grid-template-columns: 240px minmax(0, 1fr); }
.sc-side { position: sticky; top: 24px; align-self: start; }
@media (max-width: 1023px) { .sc { grid-template-columns: 1fr; } .sc-side { position: static; } }
```

## Stat row with main chart

Three or four compact stats in a row above one wide chart, with a narrow ranked list beside the chart on wide screens. See `areas/dashboard.md`.

```css
.stats { display: grid; gap: 16px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.main { display: grid; gap: 16px; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
@media (max-width: 1023px) { .stats { grid-template-columns: repeat(2, 1fr); } .main { grid-template-columns: 1fr; } }
```

## Comparison table

Plans or options compared on identical rows in a fixed order. Use a real `table` with a sticky first column on small screens, scrolling inside its own container so the page never scrolls sideways. Recommended option marked with one quiet label and a surface step.

## Timeline

Vertical line with entries on one side, dates in muted mono. Entries are plain rows, not cards. A phone keeps the same single column.

```css
.tl { border-left: 1px solid var(--border); padding-left: 24px; display: grid; gap: 32px; }
.tl-date { color: var(--text-3); font-variant-numeric: tabular-nums; }
```

## Grid with real size differences

Only when the items genuinely differ in importance: a flagship item spans two columns, supporting items span one. If you cannot say why one tile is larger, use a list.

```css
.g { display: grid; gap: 16px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.g .lead { grid-column: span 2; grid-row: span 2; }
@media (max-width: 767px) { .g { grid-template-columns: 1fr; } .g .lead { grid-column: auto; grid-row: auto; } }
```

## Tabs

For parallel views of the same thing (code in different languages, monthly vs yearly). Not for content that visitors should compare side by side. Same accessibility pattern as master-detail. Keep the tab strip one line, scrollable on a phone.

## Rules for all

- `minmax(0, 1fr)` for fluid columns so long words and tables cannot blow the grid open.
- Gap values from the spacing scale. Same gap for the same kind of relationship.
- At 375px every layout collapses to a single reading-order column.
- Containers cap at 1440 to 1600px, and body text lines at 60 to 75 characters.
- Do not box something just to group it. Space and a hairline group things first.
