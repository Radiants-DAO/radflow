---
aliases: [Design Tokens, Colors, Typography, Spacing]
tags: [architecture, design]
layer: ui
source: app/globals.css
---

# Design Tokens

RadOS design tokens define the visual language: colors, typography, shadows, and spacing.

## Colors

All colors are defined in `app/globals.css` using CSS custom properties.

### Primary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-warm-cloud` | #FEF8E2 | Primary background |
| `--color-cream` | #FEF8E2 | Alias for warm-cloud |
| `--color-sun-yellow` | #FCE184 | Accent, active states, CTAs |
| `--color-black` | #0F0E0C | Text, borders, shadows |

### Secondary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-sky-blue` | #95BAD2 | Secondary accent, links |
| `--color-sunset-fuzz` | #FCC383 | Warm accent |
| `--color-sun-red` | #FF6B63 | Error, warnings, destructive |
| `--color-green` | #CEF5CA | Success states |

### Tailwind Classes

```tsx
// Backgrounds
<div className="bg-warm-cloud" />
<div className="bg-sun-yellow" />
<div className="bg-black" />

// Text
<span className="text-black" />
<span className="text-cream" />
<span className="text-sun-red" />

// Borders
<div className="border-black" />
```

## Typography

### Fonts

| Font | Class | Usage |
|------|-------|-------|
| [[Joystix]] | `font-joystix` | Headings, buttons, labels |
| [[Mondwest]] | `font-mondwest` | Body text, descriptions |
| [[PixelCode]] | `font-pixelcode` | Code, monospace |

### Pixel Font Sizes (Joystix)

| Class | Size | Usage |
|-------|------|-------|
| `text-pixel-xs` | 10px | Tiny labels |
| `text-pixel-sm` | 12px | Small labels |
| `text-pixel-md` | 14px | Default labels |
| `text-pixel-lg` | 18px | Headings |
| `text-pixel-xl` | 24px | Large headings |

### Body Font Sizes (Mondwest)

| Class | Size | Usage |
|-------|------|-------|
| `text-body-xs` | 12px | Captions |
| `text-body-sm` | 14px | Small text |
| `text-body-md` | 16px | Body text |
| `text-body-lg` | 18px | Large body |
| `text-body-xl` | 20px | Lead text |

### Usage Examples

```tsx
// Heading
<h1 className="font-joystix text-pixel-lg uppercase text-black">
  BRAND ASSETS
</h1>

// Body text
<p className="font-mondwest text-body-md text-black">
  Download our logo files in various formats.
</p>

// Label
<label className="font-joystix text-pixel-xs uppercase text-black/70">
  FILE FORMAT
</label>
```

## Shadows

Pixel-perfect box shadows for the retro aesthetic.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-btn` | `2px 2px 0 0 var(--color-black)` | Buttons |
| `--shadow-btn-hover` | `3px 3px 0 0 var(--color-black)` | Button hover |
| `--shadow-card` | `4px 4px 0 0 var(--color-black)` | Cards, windows |

### Tailwind Classes

```tsx
// Button shadow
<Button className="shadow-btn hover:shadow-btn-hover" />

// Card shadow
<Card className="shadow-card" />

// Custom shadow
<div className="shadow-[4px_4px_0_0_var(--color-black)]" />
```

## Borders

Standard borders for consistency.

```tsx
// Standard border
<div className="border border-black" />

// Thick border
<div className="border-2 border-black" />

// Rounded corners
<div className="rounded-sm" />  // 2px
<div className="rounded-md" />  // 4px
```

## Spacing

Use Tailwind's spacing scale:

| Class | Value |
|-------|-------|
| `p-2` | 8px |
| `p-3` | 12px |
| `p-4` | 16px |
| `gap-2` | 8px |
| `gap-4` | 16px |

## Anti-Patterns

### Don't Use

```tsx
// ❌ Hardcoded colors
className="bg-[#FCE184]"

// ❌ Inline styles
style={{ backgroundColor: '#FCE184' }}

// ❌ Wrong font
className="font-sans"  // Use font-joystix or font-mondwest
```

### Do Use

```tsx
// ✅ Design tokens
className="bg-sun-yellow"

// ✅ Tailwind classes
className="font-joystix text-pixel-lg"

// ✅ CSS variables (when needed)
style={{ color: 'var(--color-sun-yellow)' }}
```

## Related

- [[Design System]] - Visual language principles
- [[RadTools]] - Component library using these tokens
- [[radtools-reviewer]] - Agent that checks token usage
