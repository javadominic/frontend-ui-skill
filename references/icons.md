# Icons

Icons are small, so inconsistency in them shows more than anywhere else. The rule is one icon family for the interface, with a short list of allowed extras.

Contents: Choose the set · What may differ · Sizing and stroke · Use and removal · Accessibility · Implementation

## Choose the set

Pick one set per project by matching its look to the product's character and the type's weight. If the project already uses a set, keep it.

| Set | Look | Notes (verify current details before relying on them) |
|---|---|---|
| Lucide | Clean line icons on a 24px grid, stroke width adjustable | Good default for apps and sites, tree-shakeable React package |
| Phosphor | Line icons in several weights, including a duotone and a fill style | Useful when you need one family in different weights for hierarchy |
| Heroicons | Outline and solid, from the Tailwind team | Fits Tailwind projects, smaller catalog |
| Tabler | Large catalog of line icons | Useful when a niche icon is needed and others lack it |
| Radix Icons | Small 15px icons | For dense developer-tool UI |

The owner may have a preferred list. Use it when given. Do not mix two of these in one interface to get an icon the first lacks. Pick the larger catalog instead, or draw the missing icon in the same grid and stroke.

## What may differ

| Case | Allowed |
|---|---|
| Brand logos (payment methods, social links, tool logos) | Yes, from a brand-logo set such as Simple Icons or the brand's own asset. Check each brand's usage rules. Show them monochrome in the text colour unless the brand colour is the point. |
| Animated states (success, loading, empty) | Yes, as Lottie or Rive files, in the project's palette |
| Illustrations and spot art | Yes, as illustration, not as icons. One art direction. |
| Flags and country markers | Yes, from a dedicated set |
| A second UI icon set | No |

## Sizing and stroke

- 16px in dense UI (tables, sidebars, buttons), 18 to 20px in navigation and cards, 24px for standalone actions. Never more than three sizes in a project.
- One stroke width everywhere, 1.5 as the default at 16 to 20px, matched to the type weight.
- The icon box has the same width in every row and a fixed gap to its label (8 or 10px), so labels align.
- Icons take the colour of their text role, usually secondary or muted. They never get their own colours. Status uses a small dot or the semantic colour with a label.
- Icons next to text are optical-aligned with the cap height of the label.
- Do not put icons in coloured or bordered tiles, or in gradient squares.

## Use and removal

Remove an icon when it adds nothing: an icon before every card title, before every section label, or repeating the word beside it. Keep one when it speeds recognition (navigation, actions with no room for words, status) or when it is the signature of the product.

Icon-only buttons need a visible tooltip or an accessible name, and a 44px hit area on touch screens.

## Accessibility

- Decorative icons next to text: `aria-hidden="true"`.
- Icon-only controls: an `aria-label` or visually hidden text, plus a tooltip for sighted users.
- Meaning never relies on the icon alone. Pair status icons with words.
- Respect forced-colours and high-contrast modes by using `currentColor` for strokes.

## Implementation

- Import individual icons, not the whole package, so unused icons are not shipped.
- One `Icon` wrapper component that sets size, stroke and `aria-hidden`, so the rules live in one place.
- For plain HTML pages, inline the few SVGs used and set `stroke="currentColor"`.

```tsx
import { Shield } from "lucide-react";
export const Icon = ({ as: I, size = 16, label }: { as: any; size?: number; label?: string }) =>
  <I size={size} strokeWidth={1.5} aria-hidden={label ? undefined : true} aria-label={label} />;
```
