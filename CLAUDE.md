# RadFlow Development Rules

## Core Principle

**RadFlow is the visual source of truth for all design system changes.**

Any modifications to typography, fonts, colors, components, or design tokens MUST be made through RadFlow, not by directly editing source files. Visual changes push directly to source code.

```
RadFlow UI  →  Source Files
  (visual)      (code)
```

---

## What RadFlow Manages (DO NOT EDIT DIRECTLY)

| Tab | Reads From | Writes To |
|-----|------------|-----------|
| **Variables** | `globals.css` @theme | `globals.css` @theme block |
| **Typography** | `globals.css` @layer base | `globals.css` @layer base |
| **Components** | `/components/*/` TSX | Component definition TSX files |

### Files Managed by RadFlow

These sections are managed by RadFlow — do not edit directly:
- `@theme inline` block (color variables)
- `@theme` block (design tokens)
- `@font-face` declarations
- Typography rules in `@layer base` (h1-h6, p, li, etc.)
- Component definition files (`/components/*/ComponentName.tsx`)

### Files Safe to Edit Directly

- Base HTML/body styles (outside managed sections)
- Scrollbar styles (`::-webkit-scrollbar`)
- Animations (`@keyframes`)
- Custom utility classes
- Any CSS not parsed by the cssParser

---

## Edit Scope Attributes

Components use data attributes to identify edit targets. **Attributes must be directly on editable elements.**

| Attribute | Value | Writes To |
|-----------|-------|-----------|
| `data-edit-scope` | `layer-base` | `globals.css` → `@layer base { [element-tag] { } }` |
| `data-edit-scope` | `theme-variables` | `globals.css` → `@theme { }` |
| `data-edit-scope` | `component-definition` | `/components/*/Component.tsx` (requires `data-component`) |
| `data-edit-variant` | variant name | Variant-specific styles in Component.tsx |
| (no attribute) | - | Preview-only, no persistence |

### Decision Logic

```
IF data-edit-scope="layer-base":
  → Update @layer base { [element-tag] { } } in globals.css
  → Changes persist immediately

IF data-edit-scope="theme-variables":
  → Update @theme { } in globals.css
  → Requires "Save to CSS" button click

IF data-edit-scope="component-definition":
  → Read data-component to find target file
  → IF data-edit-variant exists:
      → Update variant-specific styles
  → ELSE:
      → Update base styles (affects all variants)
  → Changes persist immediately

IF no data-edit-scope:
  → Preview-only, no persistence
```

### Examples

```tsx
// Typography: edits go to @layer base
<h1 data-edit-scope="layer-base">Heading 1</h1>

// Component base (affects all variants)
<Button
  variant="primary"
  data-edit-scope="component-definition"
  data-component="Button"
>
  Primary
</Button>

// Component variant (affects only this variant)
<Button
  variant="secondary"
  data-edit-scope="component-definition"
  data-component="Button"
  data-edit-variant="secondary"
>
  Secondary
</Button>

// Preview-only (no editing power)
<Button variant="primary" size="lg">
  Large Button
</Button>
```

---

## When Modifying RadFlow

1. **Never treat preview files as static documentation** — they are the editing interface
2. **All visual changes must have a write-back path** — if you add editable UI, add the API to persist it
3. **Data attributes are required** — any editable element needs targeting attributes
4. **Attributes go on elements, not containers** — no DOM traversal, direct targeting only

---

## Component Requirements

```tsx
// From @radflow/ui or /components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',  // REQUIRED: Default values for visual editor
  size = 'md',
  children
}: ButtonProps) {
  return <button className="...">{children}</button>;
}
```

**Rules:**
1. Default export (named exports ignored by scanner)
2. Default prop values (visual editor requirement)
3. TypeScript props interface
4. Location: `/components/` (not `/app/components/`)
5. Use semantic tokens (`bg-surface-primary`), never hardcoded colors

---

## Package Structure

RadFlow is a pnpm monorepo with 5 packages:

| Package | Description |
|---------|-------------|
| `@radflow/theme` | Base semantic token interface |
| `@radflow/theme-rad-os` | RadOS theme (yellow/cream/black) |
| `@radflow/ui` | 25 core components with tree-shaking |
| `@radflow/devtools` | Visual editor with preview mode |
| `@radflow/cli` | Setup utilities (init, assets, eject, update) |

---

## CLI Commands

```bash
# Initialize (copies agents + assets)
npx radflow init

# Update to latest (selective updates)
npx radflow update
npx radflow update --components
npx radflow update --devtools

# Check for available updates
npx radflow outdated

# Update assets only
npx radflow assets

# Eject components for customization
npx radflow eject Button Card Dialog
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+K` | Toggle DevTools panel |
| `Cmd+Shift+T` | Toggle Text Edit mode |
| `Cmd+Shift+I` | Toggle Component ID mode |
| `Cmd+Shift+?` | Toggle Help mode |
| `1-5` | Quick-switch between tabs |
| `Esc` | Close modals / Exit modes |
