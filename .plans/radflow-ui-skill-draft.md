# RadFlow UI Skill (Draft)

Opinionated constraints for building on-brand RadFlow interfaces with AI agents.

---

## Stack

- MUST use RadFlow semantic tokens (`surface-primary`, `content-primary`, `edge-primary`) before Tailwind defaults
- MUST use `@radflow/ui` components before building custom
- MUST use motion/react (formerly framer-motion) when JavaScript animation is required
- SHOULD use tw-animate-css for entrance and micro-animations
- MUST use `cn` utility (clsx + tailwind-merge) for class logic
- MUST import theme CSS: `@import "@radflow/theme-{name}"`

---

## Components

- MUST use `@radflow/ui` components first, check if component exists before building
- MUST use Radix primitives for anything with keyboard or focus behavior
- NEVER mix primitive systems within the same interaction surface
- MUST add `aria-label` to icon-only buttons
- NEVER rebuild keyboard or focus behavior by hand unless explicitly requested
- MUST include `data-component` and `data-theme` attributes for DevTools discovery

---

## Colors

- MUST use semantic color tokens, NEVER hardcoded hex values
- MUST use `surface-*` tokens for backgrounds
- MUST use `content-*` tokens for text and icons
- MUST use `edge-*` tokens for borders
- NEVER use gray—use black at reduced opacity instead
- NEVER use gradients unless explicitly requested
- SHOULD maintain warm color dominance (yellow/cream over blue)

---

## Shadows

- MUST use RadFlow shadow tokens (`shadow-btn`, `shadow-card`), NEVER Tailwind `shadow-*`
- MUST use hard pixel shadows (no blur) in light mode
- NEVER use `box-shadow` with blur radius in light mode
- MUST use glow shadows in dark mode (handled by tokens)
- NEVER use `drop-shadow` filter

---

## Borders & Radius

- MUST use hierarchical radius system (parent ÷ 2 for children)
- MUST use `rounded-lg` (16px) for windows/modals (Level 0)
- MUST use `rounded-md` (8px) for cards/panels (Level 1)
- MUST use `rounded-sm` (4px) for buttons/inputs (Level 2)
- MUST use `rounded-xs` (2px) for badges/tags (Level 3)
- NEVER use `rounded-none` (0px) - too harsh
- NEVER use same radius at all nesting levels

---

## Typography

- MUST use `font-joystix` for headings, buttons, navigation
- MUST use `font-mondwest` for body text, descriptions
- MUST use `font-pixelcode` for code blocks
- MUST use `text-balance` for headings and `text-pretty` for body
- MUST use `tabular-nums` for data tables
- SHOULD use `truncate` or `line-clamp` for dense UI
- NEVER modify `letter-spacing` unless explicitly requested

---

## Interactions

- MUST implement "lift and press" pattern for clickable elements:
  - Hover: `-translate-y-0.5` + deeper shadow
  - Active: `translate-y-0.5` + no shadow
  - Focus: `ring-2 ring-edge-focus ring-offset-2`
- MUST use AlertDialog for destructive or irreversible actions
- SHOULD use structural skeletons for loading states
- MUST show errors next to where the action happens
- NEVER block paste in input or textarea elements
- NEVER use `h-screen`, use `h-dvh`
- MUST respect `safe-area-inset` for fixed elements

---

## Animation

- NEVER add animation unless explicitly requested
- MUST animate only compositor props (`transform`, `opacity`)
- NEVER animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`)
- SHOULD avoid animating paint properties except for small, local UI
- MUST use `ease-out` easing only
- NEVER use bounce or spring easing (too playful for RadOS)
- NEVER exceed 200ms for interaction feedback (150ms preferred)
- MUST pause looping animations when off-screen
- MUST respect `prefers-reduced-motion`
- NEVER introduce custom easing curves unless explicitly requested

---

## Layout

- MUST use a fixed z-index scale (no arbitrary `z-[x]`)
- SHOULD use `size-x` for square elements instead of `w-x h-x`
- MUST give empty states one clear next action
- SHOULD limit accent color (Sun Yellow) to primary actions only

---

## Performance

- NEVER animate large `blur()` or `backdrop-filter` surfaces
- NEVER apply `will-change` outside an active animation
- NEVER use `useEffect` for anything that can be expressed as render logic
- NEVER animate large images or full-screen surfaces

---

## Dark Mode

- MUST test both light and dark modes
- MUST use semantic tokens that auto-swap (no manual `.dark:` overrides for colors)
- MUST verify shadows transform correctly (offset → glow)
- MUST maintain readability and contrast in dark mode

---

## Anti-Patterns (Never Do)

- NEVER use Tailwind default shadows (`shadow-sm`, `shadow-md`, `shadow-lg`)
- NEVER use gray color values (`gray-*`, `slate-*`, `zinc-*`)
- NEVER use blurred shadows in light mode
- NEVER use gradients
- NEVER use glow effects as primary affordances in light mode
- NEVER use Material Design or iOS patterns
- NEVER use rounded corners > 16px except for pills/avatars
- NEVER use bounce/spring animations

---

## Changelog from Original

| Original | RadFlow Version | Reason |
|----------|-----------------|--------|
| "Use Tailwind defaults first" | "Use RadFlow tokens first" | RadOS has custom shadow/color system |
| "Use Tailwind shadow scale" | "Use RadFlow shadow tokens" | Hard pixel shadows, no blur |
| "Any accessible primitive" | "Radix primitives" | RadFlow uses Radix |
| "No specific radius rule" | "Hierarchical radius system" | RadOS design principle |
| "ease-out on entrance" | "ease-out only, never bounce" | RadOS interaction style |
| No font rules | "Joystix/Mondwest/PixelCode" | RadOS typography |
| No lift/press pattern | "Lift and press for all clickables" | RadOS interaction signature |
| No dark mode section | "Dark mode testing required" | RadOS has glow shadows |

---

## Questions

1. Should this live in `@radflow/devtools` as an agent skill?
2. Should it be theme-specific (RadOS skill vs Phase skill)?
3. Should we include code snippets for common patterns?
4. Should this be part of DESIGN_SYSTEM.md or separate?
