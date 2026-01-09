---
aliases: [Button Component]
tags: [component, radtools]
category: core
source: components/ui/Button.tsx
---

# Button

Interactive button with retro lift effect. Supports link behavior.

## Import

```tsx
import { Button } from '@/components/ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset |
| `fullWidth` | `boolean` | `false` | Expand to fill container |
| `iconOnly` | `boolean` | `false` | Square button with icon only |
| `iconName` | `string` | - | Icon filename (without .svg) |
| `loading` | `boolean` | `false` | Show loading spinner |
| `href` | `string` | - | URL for link behavior |
| `disabled` | `boolean` | `false` | Disabled state |

## Variants

### Primary (default)
Yellow background, black text. Use for primary actions.

```tsx
<Button variant="primary">Primary Action</Button>
```

### Secondary
Black background, cream text. Use for secondary actions.

```tsx
<Button variant="secondary">Secondary Action</Button>
```

### Outline
Transparent with border. Use for tertiary actions.

```tsx
<Button variant="outline">Outline Action</Button>
```

### Ghost
No border, subtle hover. Use for minimal UI.

```tsx
<Button variant="ghost">Ghost Action</Button>
```

## Examples

### Basic Button

```tsx
<Button>Click Me</Button>
```

### Button with Icon

```tsx
<Button iconName="download">Download</Button>
```

### Icon-Only Button

```tsx
<Button iconOnly iconName="close" aria-label="Close" />
```

### Full-Width Button

```tsx
<Button fullWidth>Submit</Button>
```

### Loading State

```tsx
<Button iconName="save" loading>Saving...</Button>
```

### As Link

```tsx
// Internal link
<Button href="/about">Learn More</Button>

// External link (new tab)
<Button href="https://example.com" target="_blank">
  Visit Site
</Button>
```

### Disabled

```tsx
<Button disabled>Cannot Click</Button>
```

## Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 28px | 8px 12px | pixel-xs |
| `md` | 32px | 8px 16px | pixel-sm |
| `lg` | 40px | 12px 24px | pixel-md |

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## Design Notes

- **Font**: Uses [[Joystix]] (`font-joystix`)
- **Shadow**: `shadow-btn` (2px offset), `shadow-btn-hover` (3px) on hover
- **Border**: 1px solid black
- **Disabled**: 50% opacity + `cursor-not-allowed`
- **No transitions**: Instant state changes

## Accessibility

- Always include `aria-label` for icon-only buttons
- Disabled buttons are not focusable
- Focus ring visible on keyboard navigation

## Related

- [[Card]] - Often used together
- [[Dialog]] - Buttons in dialogs
- [[Form Pattern]] - Form submit buttons
- [[Design Tokens]] - Color tokens used
