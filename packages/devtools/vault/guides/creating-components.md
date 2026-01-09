---
aliases: [Creating Components, Component Pattern, RadTools Component]
tags: [guides, components, radtools]
audience: [developers, agents]
---

# Creating RadTools Components

Guide for creating new RadTools UI components following design system patterns.

## Component Structure

```
components/
  ui/
    Button/
      Button.tsx       # Component implementation
      index.ts         # Export
    Card/
      Card.tsx
      index.ts
    index.ts           # Re-export all components
```

## Component Template

### Basic Component

```tsx
// components/ui/[Component]/[Component].tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Variants configuration
const variants = {
  default: 'bg-warm-cloud border-primary text-primary',
  primary: 'bg-sun-yellow border-primary text-primary',
  secondary: 'bg-secondary border-primary text-warm-cloud',
  ghost: 'bg-transparent border-transparent text-primary hover:bg-sun-yellow/20',
  danger: 'bg-sun-red border-primary text-white',
} as const;

const sizes = {
  sm: 'px-2 py-1 text-pixel-xs',
  md: 'px-4 py-2 text-pixel-sm',
  lg: 'px-6 py-3 text-pixel-md',
} as const;

// Props interface
export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  disabled?: boolean;
  children: React.ReactNode;
}

// Component
export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  (
    {
      variant = 'default',
      size = 'md',
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'border-2 font-joystix uppercase transition-all duration-100',
          // Variant styles
          variants[variant],
          // Size styles
          sizes[size],
          // Disabled styles
          disabled && 'opacity-50 cursor-not-allowed',
          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Component.displayName = 'Component';

export default Component;
```

### Export File

```tsx
// components/ui/[Component]/index.ts
export { Component } from './Component';
export type { ComponentProps } from './Component';
```

### Add to UI Index

```tsx
// components/ui/index.ts
export * from './Button';
export * from './Card';
export * from './Component';
// ... other exports
```

## Universal Patterns

### Disabled State (All Components)

**Consistent across all interactive components:**

```tsx
// 50% opacity + cursor-not-allowed
disabled && 'opacity-50 cursor-not-allowed'
```

Never use grayscale or per-component disabled styles.

## Design Tokens

### Colors

```tsx
// Use Tailwind classes that reference CSS variables
const colorClasses = {
  // Backgrounds
  'bg-warm-cloud': 'var(--color-warm-cloud)',      // #FEF8E2
  'bg-sun-yellow': 'var(--color-sun-yellow)',      // #FCE184
  'bg-secondary': 'var(--color-black)',            // #0F0E0C
  'bg-sky-blue': 'var(--color-sky-blue)',          // #95BAD2
  'bg-sunset-fuzz': 'var(--color-sunset-fuzz)',    // #FCC383
  'bg-sun-red': 'var(--color-sun-red)',            // #FF6B63
  'bg-green': 'var(--color-green)',                // #CEF5CA

  // Text
  'text-primary': 'var(--color-black)',
  'text-warm-cloud': 'var(--color-warm-cloud)',

  // Borders
  'border-primary': 'var(--color-black)',
};
```

### Typography

```tsx
// Font families
'font-joystix'   // Pixel font for headings, buttons, labels
'font-mondwest'  // Body text

// Font sizes (pixel font)
'text-pixel-xs'  // 0.5rem / 8px
'text-pixel-sm'  // 0.625rem / 10px
'text-pixel-md'  // 0.75rem / 12px
'text-pixel-lg'  // 1rem / 16px
'text-pixel-xl'  // 1.25rem / 20px

// Font sizes (body font)
'text-body-xs'   // 0.75rem
'text-body-sm'   // 0.875rem
'text-body-md'   // 1rem
'text-body-lg'   // 1.125rem
'text-body-xl'   // 1.25rem
```

### Shadows

```tsx
// Button shadow (small offset)
'shadow-btn'        // 2px 2px 0px 0px var(--border-primary)
'shadow-btn-hover'  // 3px 3px 0px 0px var(--border-primary)

// Card shadow (larger offset)
'shadow-card'       // 4px 4px 0px 0px var(--border-primary)
```

## Component Examples

### Button Pattern

```tsx
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconOnly = false,
      fullWidth = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2',
          'border-2 border-primary',
          'font-joystix uppercase',
          'transition-all duration-100',
          'shadow-btn',
          // Hover (not disabled)
          !disabled && 'hover:-translate-y-0.5 hover:shadow-btn-hover',
          // Active
          'active:translate-y-0.5 active:shadow-none',
          // Variants
          variants[variant],
          // Sizes
          sizes[size],
          // Modifiers
          iconOnly && 'p-2',
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
```

### Tabs Pattern (with Context)

```tsx
// Context for tab state
const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);

  const value = controlledValue ?? uncontrolledValue;
  const handleValueChange = onValueChange ?? setUncontrolledValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn('flex flex-col', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabTrigger({ value, children }: TabTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabTrigger must be used within Tabs');

  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        'flex items-center gap-2 px-4 py-2',
        'font-joystix text-pixel-sm uppercase',
        'border-2 border-b-0 border-primary',
        '-mb-[2px]',
        isActive
          ? 'bg-warm-cloud text-primary'
          : 'bg-sun-yellow/50 text-black/50 hover:bg-sun-yellow/70'
      )}
    >
      {children}
    </button>
  );
}
```

### Tooltip Pattern

```tsx
export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50',
            'px-2 py-1',
            'bg-secondary text-warm-cloud',
            'border border-primary',
            'font-joystix text-pixel-xs',
            'whitespace-nowrap',
            sideClasses[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

## Utility: cn (classnames)

```tsx
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Accessibility Checklist

- [ ] Use semantic HTML elements (`button`, `input`, etc.)
- [ ] Add `aria-label` for icon-only buttons
- [ ] Support keyboard navigation (Tab, Enter, Escape)
- [ ] Include focus indicators (ring styles)
- [ ] Support `disabled` state properly
- [ ] Use `forwardRef` for DOM access
- [ ] Add `displayName` for DevTools

## Component Checklist

- [ ] Create component file with TypeScript
- [ ] Define props interface extending HTML attributes
- [ ] Implement variant and size props
- [ ] Use `cn()` for class merging
- [ ] Apply RadTools design tokens
- [ ] Support `ref` forwarding
- [ ] Add `displayName`
- [ ] Create index.ts export
- [ ] Add to ui/index.ts
- [ ] Test all variants and sizes
- [ ] Verify hover, active, disabled states
- [ ] Check accessibility

## Related

- [[radtools-reference|RadTools Reference]] - All component APIs
- [[Design Tokens]] - Colors, typography, spacing
- [[components/_moc|Component Index]] - Component overview
