---
aliases: [Card Component]
tags: [component, radtools]
category: core
source: components/ui/Card.tsx
---

# Card

Container component with consistent retro styling.

## Import

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'dark' \| 'raised'` | `'default'` | Visual style |
| `noPadding` | `boolean` | `false` | Remove default padding |
| `className` | `string` | - | Additional classes |

## Variants

### Default
Cream background, black border.

```tsx
<Card>
  Default card content
</Card>
```

### Dark
Black background, cream text.

```tsx
<Card variant="dark">
  <p className="text-cream">Dark card content</p>
</Card>
```

### Raised
Default + shadow for elevation.

```tsx
<Card variant="raised">
  Elevated card content
</Card>
```

## Sub-components

### CardHeader
Header with bottom border. Use for titles.

```tsx
<Card noPadding>
  <CardHeader>
    <h3 className="font-joystix text-pixel-sm">TITLE</h3>
  </CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

### CardBody
Content area with padding.

```tsx
<Card noPadding>
  <CardBody>
    Main content goes here
  </CardBody>
</Card>
```

### CardFooter
Footer with top border. Use for actions.

```tsx
<Card noPadding>
  <CardBody>Content</CardBody>
  <CardFooter>
    <Button size="sm">Action</Button>
  </CardFooter>
</Card>
```

## Examples

### Basic Card

```tsx
<Card>
  <p>Simple card with default padding</p>
</Card>
```

### Structured Card

```tsx
<Card noPadding>
  <CardHeader>
    <h3 className="font-joystix text-pixel-sm">CARD TITLE</h3>
  </CardHeader>
  <CardBody>
    <p className="font-mondwest text-body-md">
      Main content area with proper typography.
    </p>
  </CardBody>
  <CardFooter>
    <Button size="sm">Primary</Button>
    <Button size="sm" variant="outline">Secondary</Button>
  </CardFooter>
</Card>
```

### Full-Bleed Image

```tsx
<Card noPadding>
  <img
    src="/image.png"
    alt="Full-bleed"
    className="w-full"
  />
  <CardBody>
    <p>Caption below image</p>
  </CardBody>
</Card>
```

### Clickable Card

```tsx
<Card
  variant="raised"
  className="cursor-pointer hover:shadow-[6px_6px_0_0_var(--color-black)]"
  onClick={() => handleClick()}
>
  Click me
</Card>
```

### Grid of Cards

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id} variant="raised">
      <CardBody>{item.name}</CardBody>
    </Card>
  ))}
</div>
```

## Design Notes

- **Background**: `bg-warm-cloud` (default), `bg-black` (dark)
- **Border**: 1px solid black
- **Shadow**: `shadow-card` (4px offset) for raised variant
- **Radius**: `rounded-md` (4px)
- **Padding**: 16px default (CardBody/CardFooter)

## Use Cases

| Use Case | Variant | Notes |
|----------|---------|-------|
| Content container | `default` | Standard content |
| Clickable item | `raised` | Add hover effect |
| Dark mode section | `dark` | Use cream text |
| Image preview | `noPadding` | Full-bleed image |

## Related

- [[Button]] - Actions in cards
- [[Dialog]] - Card-like modal content
- [[Loading Pattern]] - Loading state in cards
- [[Design Tokens]] - Colors, shadows
