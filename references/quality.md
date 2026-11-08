# Quality gates

Checks that make a design shippable. Visual craft can be perfect and still fail on weight, accessibility or structure, so these run on every job.

Contents: Performance budget · Accessibility · Responsive and touch · Discoverability · Config-driven structure · Verify with evidence · Honest limits

## Performance budget

Targets from Google's Core Web Vitals "good" thresholds, measured on real devices or lab throttling:

| Metric | Target |
|---|---|
| Largest Contentful Paint (LCP) | 2.5 s or less |
| Interaction to Next Paint (INP) | 200 ms or less |
| Cumulative Layout Shift (CLS) | 0.1 or less |

How the design stays inside them:

- The hero image is the likely LCP element. AVIF or WebP, sized for the viewport (`srcset`), `fetchpriority="high"`, never lazy-loaded, ideally under about 150 KB.
- Every image has `width` and `height` (or `aspect-ratio`) so nothing jumps. In Next.js use `next/image`.
- Fonts are self-hosted, subset and preloaded (see `fonts.md`).
- Animation libraries, 3D and heavy canvases load after the first screen.
- Do not animate layout. Do not run animation with no stop condition.
- Check the page weight in the network panel, and test with CPU slowed 4x and a mid-tier network profile.

## Accessibility

Target WCAG 2.2 AA.

- Contrast: 4.5:1 text, 3:1 large text and UI parts. See `colour.md`.
- Visible keyboard focus on every interactive element. Tab through the page.
- Real elements: `button` for actions, `a` for navigation, `label` tied to each input, headings in order with one `h1`.
- Alt text on meaningful images, empty `alt=""` on decorative ones.
- Never colour alone for status.
- Respect `prefers-reduced-motion` (see `motion.md`).
- Target size: at least 24 by 24 CSS px, aim for 44px on touch screens.
- Forms: visible labels (not only placeholders), error text that says what to do, `autocomplete` attributes.
- Run an automated check (axe DevTools or Lighthouse) as a backstop. Automated tools find only a portion of problems, so also use the keyboard.

## Responsive and touch

- Design at 375 first, then verify at 375, 768, 1024 and 1440.
- Primary controls 44px on small screens. Add `cursor: pointer` to clickable non-link elements.
- Text, badges and chips must reflow, not clip or truncate important content.
- Nothing scrolls sideways. Wide tables and code scroll inside their own container.
- A dense preview simplifies on mobile (fewer rows and columns) instead of shrinking. No text under 11px.
- Sticky bars respect the safe area: `padding-bottom: env(safe-area-inset-bottom)`.

## Discoverability

Basics that help search engines and AI answer engines understand a site. These do not guarantee ranking.

- One `h1` that says what the business or product is. Headings in order.
- Content is in the HTML the server sends, not only drawn by client-side JavaScript.
- `<title>` and meta description written for the page. Canonical URL set.
- Descriptive link text and alt text.
- Structured data (JSON-LD) where it applies: Organization, LocalBusiness for shops (name, address, phone, hours), Product, FAQPage only for real FAQs.
- Open Graph image so shared links look right.
- Sitemap and a clear internal link structure.

## Config-driven structure

Put what changes in one place, so content updates never touch components.

```
src/
  site.config.ts   // name, nav links, contact (phone, WhatsApp), address, hours, social links, SEO defaults
  theme.ts         // tokens: ramps, accent, radius, type, motion durations
  content/         // copy per page or section, per language if needed
  components/      // read config and content, contain no business copy
```

- A client's phone number or price changes in one file.
- Theme tokens live in one place and are exported as CSS variables.
- Copy for different languages sits in separate files with the same keys.
- Templates for several clients share components and swap config and theme.

## Verify with evidence

Before reporting:

1. `node scripts/slop-scan.mjs <changed paths>`: no high findings left, every remaining medium and low has a reason.
2. `node scripts/audit-dom.mjs <url or file> [--selector "<area>"]`: no measurable problems, or each listed in the report.
3. Look at the three screenshots (375, 768, 1440).
4. Tab through the area with the keyboard.
5. Reduced motion on: nothing loops, nothing slides.
6. Run the whole-screen tests at the end of `signs.md`.

If the app cannot be run or rendered, say so, and say which checks were not done.

## Honest limits

Scripts and screenshots catch measurable and visible problems. They cannot judge taste, whether the copy sounds like the client, or whether the colours fit the audience. State those as open questions for the owner. A clean scan means no known slop pattern was found, not that the design is good.
