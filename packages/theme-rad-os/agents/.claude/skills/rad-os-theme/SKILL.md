# Rad OS Theme Guidelines

## Overview

Rad OS is a retro pixel aesthetic theme featuring warm colors, pixel-perfect styling, and nostalgic design elements.

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `black` | `#0F0E0C` | Primary text, borders |
| `sun-yellow` | `#FCE184` | Accents, highlights, interactive states |
| `sky-blue` | `#95BAD2` | Links, focus states |
| `warm-cloud` | `#FEF8E2` | Primary backgrounds |
| `sunset-fuzz` | `#FCC383` | Warnings, secondary accents |
| `sun-red` | `#FF6B63` | Errors, destructive actions |
| `green` | `#CEF5CA` | Success states |

## Semantic Token Mapping

Always use semantic tokens in components, not brand colors directly:

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

## Typography

- **Display/Headers**: `font-joystix` (pixel monospace)
- **Body/Paragraphs**: `font-mondwest` (warm, readable)
- **Code**: `PixelCode` font family

## Shadows

Rad OS uses hard pixel shadows in light mode and glow effects in dark mode:

```css
/* Light mode - hard shadows */
shadow-btn: 0 1px 0 0 var(--color-black)
shadow-card: 2px 2px 0 0 var(--color-black)

/* Dark mode - yellow glow */
shadow-btn: 0 1px 8px 0 rgba(252, 225, 132, 0.3)
shadow-card: 0 0 12px 2px rgba(252, 225, 132, 0.2)
```

## Border Radius

Minimal radius for pixel-perfect edges:
- `radius-none`: 0 (default for most elements)
- `radius-sm`: 4px (buttons, inputs)
- `radius-md`: 8px (cards)
- `radius-full`: 9999px (pills, avatars)

## Component Guidelines

1. **Buttons**: Yellow background, black text, hard shadow
2. **Cards**: Cream background, black border, offset shadow
3. **Inputs**: Cream background, black border, yellow focus ring
4. **Tooltips**: Black background, cream text

## Dark Mode

Dark mode inverts the primary/secondary relationship:
- Primary surface becomes dark (`#1C1917`)
- Content becomes light (warm-cloud)
- Shadows become yellow glows
