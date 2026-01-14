# Component Patterns Reference

Reusable component patterns for RadTools projects. All patterns use semantic tokens and follow RadTools component requirements.

## Tailwind v4 Token Reference

These patterns use tokens from the radOS design system. Your project's tokens are defined in `globals.css` `@theme` block:

```css
@theme {
  --color-{name}: value;  /* → bg-{name}, text-{name}, border-{name} */
  --radius-{name}: value; /* → rounded-{name} */
  --shadow-{name}: value; /* → shadow-{name} */
}
```

**Common radOS tokens used below:**
- Colors: `sun-yellow`, `sky-blue`, `cream`, `black`, `warm-cloud`, `sun-red`, `green`
- Radius: `sm`, `md`, `lg`, `full`
- Shadows: `card`, `card-lg`, `btn`

Check your project's Variables tab in RadTools for available tokens.

## Card

Flexible container with optional title and description.

```tsx
// /components/ui/Card.tsx
interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ 
  title, 
  description, 
  children,
  variant = 'default'
}: CardProps) {
  const variants = {
    default: 'bg-surface border border-black shadow-card',
    elevated: 'bg-surface shadow-card-lg',
    outlined: 'bg-transparent border-2 border-accent'
  };
  
  return (
    <div className={`rounded-md p-6 ${variants[variant]}`}>
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      {description && <p className="text-body mb-4">{description}</p>}
      {children}
    </div>
  );
}
```

**Variants:**
- `default` — Standard card with border and shadow
- `elevated` — Card with larger shadow, no border
- `outlined` — Transparent with accent border

---

## Input

Form input with label and error state.

```tsx
// /components/ui/Input.tsx
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-md
          bg-surface text-body
          border ${error ? 'border-sun-red' : 'border-black'}
          focus:outline-none focus:ring-2 focus:ring-sky-blue
          transition-colors
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-sun-red">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
```

**Features:**
- Forwarded ref for form libraries
- Error state with visual feedback
- Focus ring using semantic color

---

## Modal

Overlay dialog with backdrop.

```tsx
// /components/ui/Modal.tsx
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title,
  children,
  size = 'md'
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl'
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-surface rounded-lg p-6 w-full ${sizes[size]} shadow-card-lg animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <h2 id="modal-title" className="text-xl font-bold mb-4">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
```

**Features:**
- Escape key closes modal
- Click outside closes modal
- Body scroll lock when open
- Accessible with ARIA attributes
- Entrance animation

---

## Select

Dropdown select with label.

```tsx
// /components/ui/Select.tsx
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  options,
  value = '',
  onChange,
  placeholder = 'Select...',
  error
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full px-3 py-2 rounded-md
          bg-surface text-body
          border ${error ? 'border-sun-red' : 'border-black'}
          focus:outline-none focus:ring-2 focus:ring-sky-blue
          transition-colors
          appearance-none
          bg-[url('/assets/icons/chevron-down.svg')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]
        `}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-sun-red">{error}</p>}
    </div>
  );
}
```

---

## Badge

Small label for status or categories.

```tsx
// /components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md'
}: BadgeProps) {
  const variants = {
    default: 'bg-sky-blue text-black',
    success: 'bg-green text-black',
    warning: 'bg-sun-yellow text-black',
    error: 'bg-sun-red text-white'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]}
      ${sizes[size]}
    `}>
      {children}
    </span>
  );
}
```

---

## Tooltip

Hover tooltip for additional context.

```tsx
// /components/ui/Tooltip.tsx
import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({
  content,
  children,
  position = 'top'
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute ${positions[position]}
          px-2 py-1 text-xs
          bg-black text-cream
          rounded shadow-lg
          whitespace-nowrap
          animate-fadeIn
          z-50
        `}>
          {content}
        </div>
      )}
    </div>
  );
}
```

---

## Skeleton

Loading placeholder.

```tsx
// /components/ui/Skeleton.tsx
interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = ''
}: SkeletonProps) {
  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };
  
  return (
    <div 
      className={`
        bg-black/10 animate-pulse
        ${roundedStyles[rounded]}
        ${className}
      `}
      style={{ width, height }}
    />
  );
}
```

**Usage:**
```tsx
// Text skeleton
<Skeleton width="200px" height="1rem" />

// Avatar skeleton
<Skeleton width="40px" height="40px" rounded="full" />

// Card skeleton
<Skeleton width="100%" height="200px" rounded="lg" />
```

---

## Layout Patterns

### Responsive Grid

```tsx
// 3-column card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card title="Card 1">Content</Card>
  <Card title="Card 2">Content</Card>
  <Card title="Card 3">Content</Card>
</div>
```

### Two-Column Feature Layout

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  <div>
    <h2>Feature Title</h2>
    <p className="text-body mt-4">Feature description goes here.</p>
    <Button className="mt-6">Learn More</Button>
  </div>
  <img 
    src="/assets/images/feature.png" 
    alt="Feature illustration"
    className="rounded-lg shadow-card"
  />
</div>
```

### List Item with Icon

```tsx
<div className="flex items-center gap-4 p-4 bg-surface rounded-md border border-black">
  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
    <Icon name="check" className="text-white" />
  </div>
  <div className="flex-1">
    <h4 className="font-medium">Item Title</h4>
    <p className="text-sm text-body">Item description</p>
  </div>
  <Button variant="ghost" size="sm">Action</Button>
</div>
```

---

## Animation Patterns

### Fade In

```tsx
<div className="animate-fadeIn">
  Content fades in
</div>
```

### Scale In (for modals/popovers)

```tsx
<div className="animate-scaleIn">
  Content scales and fades in
</div>
```

### Staggered List

```tsx
<div className="space-y-4">
  {items.map((item, i) => (
    <div 
      key={item.id}
      className="animate-fadeIn"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      {item.content}
    </div>
  ))}
</div>
```

### Hover Transitions

```tsx
// Color transition
<button className="bg-primary hover:bg-primary/90 transition-colors duration-200">
  Hover me
</button>

// Scale on hover
<div className="transform hover:scale-105 transition-transform duration-300">
  Hover to scale
</div>

// Lift on hover
<div className="hover:-translate-y-1 hover:shadow-card-lg transition-all duration-200">
  Hover to lift
</div>
```

---

## Accessibility Checklist

When implementing components:

- [ ] Use semantic HTML (`<button>`, `<nav>`, `<header>`, `<main>`, `<article>`)
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skipping)
- [ ] Alt text for all images
- [ ] Keyboard navigation works (tab order, Enter/Space activation)
- [ ] Focus states are visible
- [ ] ARIA labels for icon-only buttons: `aria-label="Close"`
- [ ] ARIA for dynamic content: `aria-live`, `role="alert"`
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
