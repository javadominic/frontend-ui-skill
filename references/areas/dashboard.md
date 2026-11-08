# Area: dashboard and app views

Use when the scope is a dashboard, an analytics page, an admin screen, a table-heavy view or any app shell. App screens are looked at for hours, so the chrome stays quiet and the content carries the colour.

## Shape

- The shell fills the viewport: a sidebar 240 to 280px wide and fluid content, capped near 1440 to 1600px. Never shrink an app into a narrow centered column. If the original was drawn as a window on a backdrop, keep it visibly a window with desktop proportions inside.
- The page is as long as its content, with more sections below the first screen.
- Surfaces, borders and text stay neutral (graphite or ink ramp). The product's colour appears in the accent, the main chart and the one moment.

## Hierarchy

One main chart is clearly the biggest thing on the screen, drawn with care: smooth lines, a mirrored comparison, a labelled current point. Anything else that shows data is smaller and different in kind, like a ranked list with thin bars or a short table. Never a second chart of the same size.

Grid rhythm: three or four compact stats in a row above one wide chart, or a wide chart next to a narrow list. Equal-width cards with the same kind of content, side by side, read as a template.

## Stat cards

A stat card is a label, a big figure, and a change with what it compares to ("+12% vs last month"). No sparklines, tallies, mini bars or decorative icons added to fill space. A card may hold a real-looking object when it is exactly what its number counts, like a paid receipt beside paid revenue, as long as it reads on its own.

## Charts

- Choose the type for the data: trend = line, comparison = bars, share = one stacked bar or ranked list, single goal = progress bar.
- One accent per chart: what matters (current period, tracked series) gets the accent, everything else neutral steps.
- Muted hairline grid, muted mono labels with tabular numbers, no uppercase day labels, no glow, no rainbow inside one series.
- If the chart is placeholder noise, replace it with data that tells something real for the product (see the mock data rules in `india.md` for Indian clients).

## Navigation

- Rows 32 to 36px tall, 2 to 4px between rows, icons in one column, labels on one line.
- Section label sits closer to its own items than the section above: 24 above, 8 below.
- The active item is a surface step with a hairline highlight, not a gradient with a glow.
- Counts and meta are quiet muted text, often mono, not glowing pills.
- Keyboard shortcuts appear as small keycaps.
- Measure the sidebar after the spacing pass. It is where spacing breaks most often.

## Tables and lists

- One row height and one gap per list. Numbers right-aligned in tabular figures. Header row in muted text, sentence case.
- Zebra stripes only if rows are long and dense. A hairline between rows is usually enough.
- Row hover is a surface step. Selected row has the accent marker.
- Empty, loading and error states are designed: say what is missing and what to do. Skeletons use two neutral steps and no looping shimmer on large areas.

## Moments

Dashboards almost never need generated images. The moment comes from the product: the main chart done beautifully, figures set well, real content like product photos or avatars, a status that feels alive (one calm pulse on a live indicator). A physical thing the product handles, like a payment card in a finance app, is built in code with real materials: soft gradient, a chip, a number.

## Signature candidates

A live status dot, keycap hints, a tabular mono figure treatment, a thin progress line under the header. Choose one that belongs to the product.

## Checks for this area

- The shell fills 1440px and the sidebar measures 240 to 280px.
- One main chart. No two charts of the same size.
- Stat cards contain only label, figure, comparison.
- Sidebar rows equal height. No coloured surfaces.
- At 375px the sidebar collapses to a menu, the main chart stays readable, and the preview simplifies instead of shrinking.
