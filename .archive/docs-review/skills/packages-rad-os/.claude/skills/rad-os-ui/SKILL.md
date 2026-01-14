# RadOS UI Skill

Opinionated constraints for building on-brand RadOS interfaces with AI agents.

**Theme:** RadOS
**Reference:** See `DESIGN_SYSTEM.md` in this theme package for full specifications.

---

## Stack

- MUST use RadOS semantic tokens (`surface-primary`, `content-primary`, `edge-primary`) before Tailwind defaults
- MUST use `@radflow/ui` components before building custom
- MUST use motion/react (formerly framer-motion) when JavaScript animation is required
- SHOULD use tw-animate-css for entrance and micro-animations
- MUST use `cn` utility (clsx + tailwind-merge) for class logic
- MUST import theme: `@import "@radflow/theme-rad-os"`

---

## Components

- MUST use `@radflow/ui` components first—check if component exists before building
- MUST use Radix primitives for keyboard/focus behavior
- NEVER mix primitive systems within the same interaction surface
- MUST add `aria-label` to icon-only buttons
- NEVER rebuild keyboard or focus behavior by hand
- MUST include `data-component` and `data-theme="rad-os"` attributes

---

## Colors

- MUST use semantic tokens, NEVER hardcoded hex
- MUST use `surface-*` for backgrounds, `content-*` for text, `edge-*` for borders
- NEVER use gray—use black at reduced opacity
- NEVER use gradients
- SHOULD maintain warm color dominance (yellow/cream over blue)

**RadOS Palette:**
| Token | Light | Dark |
|-------|-------|------|
| `surface-primary` | Warm Cloud #FEF8E2 | Black #0F0E0C |
| `surface-secondary` | Black #0F0E0C | Warm Cloud #FEF8E2 |
| `surface-tertiary` | Sun Yellow #FCE184 | Sun Yellow |
| `content-primary` | Black #0F0E0C | Warm Cloud #FEF8E2 |
| `content-secondary` | Sun Yellow #FCE184 | Sun Yellow |
| `content-inverted` | Warm Cloud #FEF8E2 | Black #0F0E0C |
| `edge-primary` | Black #0F0E0C | Warm Cloud #FEF8E2 |
| `edge-focus` | Sky Blue #95BAD2 | Sky Blue |

**Semantic Token Mapping:**
```css
/* Backgrounds */
bg-surface-primary    /* warm-cloud - main backgrounds */
bg-surface-secondary  /* black - contrasting areas */
bg-surface-tertiary   /* sun-yellow - accent backgrounds */

/* Text */
text-content-primary  /* black - main text */
text-content-secondary /* sun-yellow - accent text */
text-content-inverted /* warm-cloud - text on dark backgrounds */

/* Borders */
border-edge-primary   /* black - main borders */
border-edge-secondary /* sun-yellow - accent borders */
```

---

## Shadows

- MUST use RadOS shadow tokens (`shadow-btn`, `shadow-card`), NEVER Tailwind `shadow-*`
- MUST use hard pixel shadows (no blur) in light mode
- NEVER use `box-shadow` with blur radius in light mode
- NEVER use `drop-shadow` filter

**RadOS Shadow Scale:**
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `shadow-btn` | `0 1px 0 0 #0F0E0C` | `0 1px 8px 0 rgba(252,225,132,0.3)` | Button resting |
| `shadow-btn-hover` | `0 3px 0 0 #0F0E0C` | `0 2px 12px 0 rgba(252,225,132,0.4)` | Button hover |
| `shadow-card` | `2px 2px 0 0 #0F0E0C` | `0 0 12px 2px rgba(252,225,132,0.2)` | Cards |
| `shadow-card-hover` | `6px 6px 0 0 #0F0E0C` | `0 0 16px 4px rgba(252,225,132,0.3)` | Card hover |

---

## Borders & Radius

RadOS uses a **hierarchical radius system**—child elements have smaller radii than parents.

| Nesting Level | Radius | Usage |
|---------------|--------|-------|
| Level 0 | `rounded-lg` (16px) | Windows, modals, dialogs |
| Level 1 | `rounded-md` (8px) | Cards, panels |
| Level 2 | `rounded-sm` (4px) | Buttons, inputs |
| Level 3 | `rounded-xs` (2px) | Badges, tags |

- MUST match radius to nesting level
- NEVER use `rounded-none` (0px)—too harsh
- NEVER use same radius at all nesting levels
- NEVER use rounded corners > 16px (except pills/avatars)

---

## Typography

- MUST use `font-joystix` for headings, buttons, navigation
- MUST use `font-mondwest` for body text, descriptions
- MUST use `font-pixelcode` for code blocks
- MUST use `text-balance` for headings, `text-pretty` for body
- MUST use `tabular-nums` for data
- NEVER modify `letter-spacing`

---

## Interactions

RadOS uses the **"lift and press"** pattern for all clickable elements:

```
Hover:  -translate-y-0.5 + shadow-btn-hover (element lifts)
Active: translate-y-0.5 + shadow-none (element presses)
Focus:  ring-2 ring-edge-focus ring-offset-2
```

- MUST implement lift-and-press for buttons, cards, clickable elements
- MUST use AlertDialog for destructive actions
- MUST show errors next to the action
- NEVER block paste in inputs
- NEVER use `h-screen`, use `h-dvh`

---

## Animation

- NEVER add animation unless explicitly requested
- MUST animate only `transform` and `opacity`
- NEVER animate layout properties (`width`, `height`, `margin`)
- MUST use `ease-out` easing only
- NEVER use bounce or spring easing
- NEVER exceed 200ms for interaction feedback (150ms preferred)
- MUST respect `prefers-reduced-motion`

---

## Dark Mode

- MUST test both light and dark modes
- MUST use semantic tokens (auto-swap, no manual `.dark:` for colors)
- Shadows transform: hard offset → yellow glow
- MUST verify contrast and readability

---

## Layout & Performance

- MUST use fixed z-index scale (no `z-[x]`)
- SHOULD use `size-x` for square elements
- MUST give empty states one clear next action
- NEVER animate `blur()` or `backdrop-filter`
- NEVER use `will-change` outside active animation

---

## Never Do (Anti-Patterns)

- NEVER use Tailwind default shadows (`shadow-sm`, `shadow-md`, `shadow-lg`)
- NEVER use gray colors (`gray-*`, `slate-*`, `zinc-*`)
- NEVER use blurred shadows in light mode
- NEVER use gradients
- NEVER use glow effects as primary affordances (light mode)
- NEVER use Material Design or iOS patterns
- NEVER use bounce/spring animations
- NEVER use rounded corners > 16px (except pills/avatars)

---

## Quick Reference

**Button classes:**
```
bg-surface-tertiary text-content-primary border border-edge-primary
rounded-sm shadow-btn
hover:-translate-y-0.5 hover:shadow-btn-hover
active:translate-y-0.5 active:shadow-none
focus:ring-2 focus:ring-edge-focus focus:ring-offset-2
transition-all duration-200
```

**Card classes:**
```
bg-surface-elevated border border-edge-primary
rounded-md shadow-card
hover:shadow-card-hover
transition-shadow duration-200
```

**Input classes:**
```
bg-surface-primary border border-edge-primary rounded-sm px-3 py-2
focus:bg-surface-elevated focus:ring-2 focus:ring-edge-focus
placeholder:text-content-tertiary placeholder:opacity-40
```
