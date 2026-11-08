# Motion

Motion has two jobs: explain a change, and give one memorable moment. Anything else is decoration. This file covers which library to use, how to keep it fast, and how to respect users who turn motion off.

Contents: Choose the library · Mix libraries by section · What to animate · Performance rules · Reduced motion · Scroll patterns · Entrances · Component recipes · Banned patterns

## Choose the library

Library licences and versions change. Before recommending a paid or plugin-gated feature on a client project, check the library's current licence page.

**Default stack**

| Need | Use |
|---|---|
| Hover, press, colour, small state changes | CSS transitions on named properties |
| Dialogs, menus, accordions, route fades | CSS, or Motion in a React app |
| React component state, layout animation, exit animation, gestures | Motion (`motion/react`, formerly Framer Motion) |
| Marketing pages with timelines, pinned sections, scroll sequences, text reveals, SVG | GSAP with ScrollTrigger, SplitText, Flip |
| Scroll-linked effect on a simple page | CSS scroll-driven animation where supported, else ScrollTrigger |
| Animated list add/remove with no design | AutoAnimate |

**Allowed with a reason stated in the report**

| Library | Reason that qualifies |
|---|---|
| Lottie | A designer already exported the animation (success, loading, empty state) |
| Rive | State-driven character or interactive vector (a mascot that reacts to input) |
| Three.js / React Three Fiber | The 3D object is the screen's one bright moment and is lazy-loaded |
| OGL, PixiJS | The shader or 2D effect is the product (not a background) |
| Lenis | A pinned storytelling page, never an app or dashboard |
| Theatre.js | A scripted cinematic page with a designer editing the timeline |
| Vivus, GSAP MorphSVG | Drawing or morphing an SVG that carries meaning |

**Avoid by default**

| Library | Why |
|---|---|
| AOS, ScrollReveal | Identical fade-up on everything. ScrollTrigger or Motion give control. |
| Animate.css, Hover.css, Magic CSS | Bounce, wobble, tada: attention-grabbing presets. |
| Typed.js | Typewriter headline is a cliché. |
| Vanta.js, tsParticles | Animated particle or net background is decoration and costs battery. |
| Anime.js, React Spring, Popmotion | Overlap GSAP and Motion. Use only if the project already depends on them, and keep each to its own section. |
| Motion One | Superseded by the Motion library. |

## Mix libraries by section, one animator per element

A project may use several libraries, each chosen for the job of the section it sits in. A hero can run an OGL shader, the story section a GSAP ScrollTrigger sequence, the app UI Motion, a success state Lottie, and everything small plain CSS. What matters is that they do not fight.

Typical mix (a starting point, not a recipe):

| Section | Library | Why |
|---|---|---|
| Hero with a shader or particle-free generative visual | OGL | Small WebGL, one canvas, lazy-loaded |
| Scroll story, pinned sections, text reveals | GSAP with ScrollTrigger, SplitText | Timelines and scrubbing |
| App screens, dashboards, modals, lists | Motion | State-driven React animation, layout and exit |
| Interactive character or reactive icon | Rive | State machines |
| Designer-exported success or empty state | Lottie | Plays an existing file |
| 3D product object | React Three Fiber (or Three.js) | The object is the moment |
| Hover, press, small state changes everywhere | CSS | No library cost |

Rules that make a mix safe:

1. **One animator per element.** Never let two libraries animate the same element or the same property. Draw the boundary at the section or component.
2. **No cross-measuring.** A library must not measure or change the layout of a region another library is animating (for example a Motion `layout` list inside a GSAP-pinned section).
3. **Shared timing.** Use the same easing and durations everywhere so the product feels like one thing. The curve in `tokens.md` is `cubic-bezier(0.22, 1, 0.36, 1)`: pass it to Motion as `ease: [0.22, 1, 0.36, 1]`, to CSS and WAAPI as the variable, and to GSAP through a custom ease if that plugin is available, otherwise use the closest built-in ease (`power3.out`). Check which GSAP plugins are available under the current licence.
4. **Lazy-load by section.** Heavy libraries (Three, OGL, Rive, Lottie) load with a dynamic import when their section nears the viewport, never in the first bundle.
5. **Clean up.** Revert GSAP contexts and kill ScrollTriggers on unmount, dispose WebGL contexts, cancel any `requestAnimationFrame` loop, pause canvases off-screen.
6. **Reduced motion in every library** (see below). A mix means several places to handle it, so list them in the section plan.
7. **Say why.** Each library in the project has a one-line reason in the section plan. If two libraries can do a job, use the one already loaded.
8. **Budget.** More than three animation libraries in one project needs a stated reason, because each one adds weight for visitors on mid-range phones.

## What to animate

Keep motion that explains something:

- Hover: colour or surface change, 120ms.
- Press: scale to 0.98, 120ms.
- Menu, popover, tooltip: fade plus 4 to 8px rise from where it opened, 200ms.
- Panel or modal: fade plus 8 to 16px rise, 320ms. Exit is faster than enter.
- A changed number: tween between values.
- Layout change in a list or grid: FLIP (Motion `layout`, GSAP Flip).
- A live status: one gentle pulse is fine because the thing is live.

## Performance rules

1. Animate `transform` and `opacity`. Never animate width, height, top, left, right, bottom, margin or padding.
2. Paint-triggering properties (colour, border, gradient, filter) only on small isolated elements.
3. Do not read layout and write layout in the same frame. Measure once, then animate with transform (the FLIP pattern).
4. Do not drive animation from `scroll` events or `scrollY`. Use ScrollTrigger, CSS `animation-timeline: scroll()` or `view()`, or IntersectionObserver.
5. Pause or stop animation when off-screen.
6. No `requestAnimationFrame` loop without a stop condition.
7. `will-change` only on elements about to animate, removed afterwards. Many promoted layers cost memory.
8. Blur in animation: 8px or less, one-shot, never on a large surface, never looping.
9. Do not animate CSS variables that feed transform, opacity or position, and scope any animated variable locally.
10. View Transitions only for navigation-level changes.
11. Lazy-load heavy canvases and 3D scenes below the first screen.

Many visitors to small-business sites are on mid-range Android phones on mobile data. Test motion there, or throttle the CPU 4x in DevTools.

## Reduced motion

Required on every project that animates. People with vestibular disorders can get sick from parallax and large movement. Replace movement with a fade or with nothing. Never remove the information the motion carried.

CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Motion (React): wrap the app once.

```tsx
import { MotionConfig } from "motion/react";
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

`reducedMotion="user"` disables transform and layout animation and keeps opacity. For custom logic use `useReducedMotion()`.

GSAP:

```js
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // all movement, pins, scrubs, parallax live here
});
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.set(".reveal", { opacity: 1, y: 0 }); // final state, no movement
});
```

Test it: turn the OS setting on and reload. `audit-dom.mjs` also reports anything still looping.

## Scroll patterns

- **Reveal on enter:** ScrollTrigger with `once: true`, or `animation-timeline: view()` with a fallback. Fade plus 12 to 24px rise. Stagger 40 to 80ms. Not every section.
- **Pinned story:** ScrollTrigger `pin` with a scrubbed timeline. Only when the sequence is the product's story. Disable pinning on small screens or when reduced motion is on.
- **Parallax:** a few pixels on one hero layer at most, off for reduced motion.
- **Smooth scroll (Lenis):** opt-in, see above.
- **Cleanup:** in React, create GSAP work in `useGSAP()` or `gsap.context()` and revert it on unmount.

## Entrances

At most one entrance on load: a short fade and rise for the main content with a small stagger, 320 to 500ms total feel. Elements do not fly in from different directions. Hero entrance is the only place 500ms is allowed.

## Component recipes

Small, working patterns. Each respects reduced motion by checking `matchMedia("(prefers-reduced-motion: reduce)")` or by the CSS block above. Prefer these to inventing effects.

**Sliding selection marker (master-detail, tabs, nav).** One absolutely positioned element moves with `transform`; rows have equal height so it never resizes.

```css
.list { position: relative; display: grid; grid-auto-rows: 1fr; }
.marker { position: absolute; left: 0; top: 0; width: 2px; background: var(--accent);
          transition: transform 320ms var(--ease); }
```
```js
marker.style.height = tab.offsetHeight + "px";
marker.style.transform = `translateY(${tab.offsetTop}px)`;
```

**Panel change (fade and rise).** Web Animations API on the container, 320ms. Skip when reduced motion is on.

```js
if (!reduce.matches) panel.animate(
  [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
  { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
```

**Staggered list or chips.** 200ms fade, 40ms between items, `fill: "backwards"` so items do not flash before their delay.

```js
items.forEach((el, i) => el.animate([{ opacity: 0 }, { opacity: 1 }],
  { duration: 200, delay: 60 + i * 40, easing: "ease-out", fill: "backwards" }));
```

**Expandable row (no height animation).** Animate `grid-template-rows` on a wrapper.

```css
.collapse { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 200ms var(--ease); }
.collapse[data-open="true"] { grid-template-rows: 1fr; }
.collapse > div { overflow: hidden; }
```

**Scroll reveal (once).** IntersectionObserver, never a scroll listener.

```js
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
```
```css
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 320ms var(--ease), transform 320ms var(--ease); }
.reveal.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
```

**Number tween.** Count to the new value over 600ms with `requestAnimationFrame` and stop at the target. Format with `Intl.NumberFormat` every frame so the grouping stays right.

**Shared-element selection in React.** With Motion, give the marker a `layoutId` inside the list and it animates between rows: `{selected && <motion.span layoutId="marker" className="marker" />}`. With GSAP use Flip: `Flip.getState(el)`, move it, then `Flip.from(state, { duration: 0.32, ease: "power3.out" })`.

**Pick one moment per section.** A section gets the marker, or the stagger, or the reveal. Not all three plus a hover effect. Motion should help someone find the change, not decorate.

## Banned patterns

Looping pulse, ping, bounce, float, shimmer on headings, breathing glow, tilt-on-hover cards, cursor-follower blobs, typewriter headlines, particle backgrounds, confetti outside a real success moment, `transition-all`, bouncy overshoot easing, `hover:scale` on cards.
