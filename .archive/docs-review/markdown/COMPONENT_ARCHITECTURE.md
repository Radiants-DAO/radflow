# Component Architecture: Current vs Desired State

## Current State

```
packages/
├── theme-rad-os/components/core/    ← 25 full component implementations
├── theme-phase/components/core/     ← 25 full component implementations (duplicated logic)
└── ui/                              ← Re-exports from theme-rad-os
```

**Problems:**
- Logic duplicated across themes (copy button, modal behavior, keyboard nav)
- Bug fixes must be applied to every theme
- 4 themes × 25 components = 100 files to maintain
- No shared behavioral contract between themes

---

## Desired State

```
packages/
├── primitives/                      ← Headless hooks (shared logic, no styles)
│   ├── useButton.ts
│   ├── useDialog.ts
│   ├── useToast.ts
│   ├── useSelect.ts
│   ├── useTabs.ts
│   └── usePopover.ts
│
├── theme-rad-os/components/core/    ← Styled components using primitives
├── theme-phase/components/core/     ← Styled components using primitives
├── theme-[new-1]/components/core/   ← New themes built on primitives
├── theme-[new-2]/components/core/   ← New themes built on primitives
│
└── ui/                              ← Re-exports from default theme
```

**Benefits:**
- Logic lives in one place — bug fixes happen once
- Themes own only their visual layer
- New themes are faster to build (just styles + structure)
- Consistent API across all themes

---

## Component Classification

### Complex (Extract Hooks)

| Component | Hook | Shared Logic |
|-----------|------|--------------|
| Button | `useButton` | Copy state, timers, polymorphic `as`, loading |
| Dialog | `useDialog` | Modal behavior, focus trap, escape, overlay click |
| Sheet | `useSheet` | Same as Dialog (side panel variant) |
| Toast | `useToast` | Queue, auto-dismiss timers, positioning |
| Select | `useSelect` | Open/close, keyboard nav, filtering |
| Combobox | `useCombobox` | Search, filtering, keyboard nav |
| Tabs | `useTabs` | Active state, keyboard nav, ARIA |
| Popover | `usePopover` | Positioning, click-outside, focus |
| DropdownMenu | `useDropdown` | Menu state, keyboard nav, submenus |
| ContextMenu | `useContextMenu` | Right-click trigger, positioning |
| Accordion | `useAccordion` | Expand/collapse state, single/multi mode |
| Slider | `useSlider` | Value state, drag handling, keyboard |

### Simple (Duplicate or Share)

These are mostly presentational — minimal logic, safe to duplicate:

- Alert, Avatar, Badge, Breadcrumbs, Card, Checkbox, Divider
- HelpPanel, Icon, Input, NumberField, Progress, ScrollArea
- Skeleton, Switch, Table, Tooltip

---

## Migration Path

1. **Create `packages/primitives`** with first batch of hooks
2. **Refactor rad-os and phase** to use primitives
3. **Build new themes** directly on primitives
4. **Incrementally** extract remaining hooks as needed

---

## API Contract

All themes must implement the same props interface for core components:

```tsx
// Every Button across all themes accepts:
interface ButtonProps {
  variant?: string;        // Theme defines available variants
  size?: 'sm' | 'md' | 'lg';
  iconName?: string;
  iconOnly?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  copyButton?: boolean;
  onCopy?: () => Promise<void> | void;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}
```

Variant values differ per theme, but the prop shape is consistent.
