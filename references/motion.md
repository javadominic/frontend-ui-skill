# Motion

Motion has two jobs: explain a change, and give one memorable moment. Anything else is decoration. This file covers which library to use, how to keep it fast, and how to respect users who turn motion off.

Contents: Choose the library · One system per project · What to animate · Performance rules · Reduced motion · Scroll patterns · Entrances · Banned patterns

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
| Anime.js, React Spring, Popmotion | Overlap GSAP and Motion. Mixing animation systems makes layout fights. |
| Motion One | Superseded by the Motion library. |

## One system per project

Pick GSAP or Motion at the start and stay with it. If the project already uses one, keep using it. A second animation system that measures or changes layout will fight the first. CSS transitions alongside either are fine.

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

## Banned patterns

Looping pulse, ping, bounce, float, shimmer on headings, breathing glow, tilt-on-hover cards, cursor-follower blobs, typewriter headlines, particle backgrounds, confetti outside a real success moment, `transition-all`, bouncy overshoot easing, `hover:scale` on cards.
