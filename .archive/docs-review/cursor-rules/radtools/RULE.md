---
alwaysApply: true
---

# RadTools DevTools — Development Guide

## Overview

Visual development tool for Next.js projects. Floating panel (`Shift+Cmd+K`) for managing design tokens, typography, components, assets, and mock states. **Development-only** — automatically excluded from production.

**Stack:** Next.js 15, Tailwind CSS v4, Zustand, TypeScript

---

## ⚠️ CRITICAL: RadTools is the Source of Truth

**RadTools is the visual source of truth for all design system changes.** Any modifications to typography, fonts, colors, or design tokens MUST be made through RadTools, not by directly editing `app/globals.css`.

### What RadTools Manages (DO NOT EDIT DIRECTLY)

These sections in `app/globals.css` are managed by RadTools:
- `@theme inline` block (color variables)
- `@theme` block (design tokens)
- `@font-face` declarations
- Typography rules (h1-h6, p, li, etc.)

### Design System Change Workflow

**Correct approach:**
1. Open RadTools → appropriate tab (Variables/Typography/Components)
2. Make changes in the UI using the visual editor
3. Changes persist:
   - **Typography**: Updates `@layer base` in `globals.css` immediately (automatic)
   - **Variables**: Click "Save to CSS" button to persist changes to `@theme` in `globals.css` (manual save)
   - **Components**: Updates component definition files immediately (automatic)

**Incorrect approach:**
1. ❌ Directly edit typography/variables in `globals.css`
2. ❌ Directly edit component definitions without using visual editor
3. ❌ Changes will be overwritten when RadTools syncs

### Sync Mechanism

| Direction | Flow | Trigger |
|-----------|------|---------|
| **Write** | RadTools → `globals.css` / Component files | Typography/Components: Automatic via visual editor. Variables: Manual "Save to CSS" button |
| **Read** | `globals.css` → RadTools | On mount via `loadTypographyFromCSS()` or `loadFromCSS()` |

### Files Safe to Edit Directly

These CSS sections are NOT managed by RadTools:
- Base HTML/body styles (outside managed sections)
- Scrollbar styles (`::-webkit-scrollbar`)
- Animations (`@keyframes`)
- Custom utility classes
- Any CSS not parsed by `devtools/lib/cssParser.ts`

### Cross-Instance Consistency

When working across multiple Cursor instances:
1. RadTools loads from `globals.css` on mount
2. All changes sync back to `globals.css`
3. Single source of truth ensures consistency

---

## Architecture

### File Structure

```
/devtools/              # Dev tools system
  ├── index.ts          # Public exports
  ├── DevToolsProvider.tsx
  ├── DevToolsPanel.tsx
  ├── store/
  │   ├── index.ts      # Combined Zustand store
  │   └── slices/       # Feature slices
  └── tabs/            # Tab components
/components/           # ⚠️ Auto-discovered (default export required)
/app/api/devtools/     # Dev-only API routes (NODE_ENV check required)
```

### State Management

Zustand slice pattern. Each feature gets its own slice, combined in `store/index.ts`.

---

## Tabs

### Variables Tab
Visual editor for `globals.css` design tokens:
- Brand colors (`@theme inline`) — internal reference
- Semantic tokens (`@theme`) — generates utilities automatically
- Border radius, color modes

**Tailwind v4 Token Generation:**

The `@theme` block defines CSS variables that Tailwind v4 auto-generates into utility classes:

```css
@theme {
  --color-sun-yellow: #FCE184;  /* → bg-sun-yellow, text-sun-yellow, border-sun-yellow */
  --color-sky-blue: #95BAD2;    /* → bg-sky-blue, text-sky-blue, border-sky-blue */
  --radius-md: 0.5rem;          /* → rounded-md */
  --shadow-card: 2px 2px 0 0 var(--color-black); /* → shadow-card */
}
```

**Pattern:** Use the generated utility classes in components. Reference actual token names from the Variables tab.

**Visual Editing:**
- Design token changes are made via the visual editor
- Container has `data-edit-scope="theme-variables"` to signal edit scope
- **Manual "Save to CSS" button required** - click to persist changes to `globals.css`

### Typography Tab
Manage fonts (`public/fonts/`) and typography style mappings.

**Visual Editing:**
- Typography styles are edited directly via the visual editor
- Each HTML element (h1, p, code, pre, etc.) has `data-edit-scope="layer-base"` directly on the element
- Changes automatically update `@layer base { [element-tag] { } }` in `globals.css`
- **No manual "Save" button required** - changes persist immediately

### Components Tab
Auto-discovers components from `/components/`:
- **Design System** — `/components/ui/`
- **Project Components** — `/components/` (excluding `ui/`)

**Discovery:** Scans for default exports, extracts TypeScript props.

**Visual Editing:**
- Component instances use data attributes to declare edit behavior:
  - **Base components**: `data-edit-scope="component-definition"` + `data-component="ComponentName"` (no `data-edit-variant`)
    - Edits affect the component's base styles (affects all variants unless overridden)
  - **Variant components**: All three attributes (`data-edit-scope`, `data-component`, `data-edit-variant="variantName"`)
    - Edits affect only that specific variant's override styles
  - **Preview-only**: No data attributes (no editing power)
- Changes automatically update component definition files (`/components/*/ComponentName.tsx`)
- **No manual "Save" button required** - changes persist immediately

### Assets Tab
File management for `public/assets/` (upload, organize, optimize).

### Mock States Tab
Wallet state presets (Connected, Disconnected, Token Hodler). Use `useMockState('wallet')` in components.

---

## Component Requirements

**Critical for Cursor Visual Editor:**

```tsx
// /components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',  // ⚠️ REQUIRED: Default values for visual editor
  size = 'md',         // ⚠️ REQUIRED: Visual editor needs defaults
  children
}: ButtonProps) {
  return <button className="bg-primary text-heading">{children}</button>;
}
```

**Rules:**
1. Default export (named exports ignored)
2. Default prop values (visual editor requirement)
3. TypeScript props interface
4. Location: `/components/` (not `/app/components/`)
5. Use semantic tokens (`bg-primary`), never hardcoded colors

---

## Implementation Checklist

### Before Creating a Component

1. **Check Component Discovery first** — Open RadTools → Components tab
   - Does this component already exist?
   - Can you extend an existing component with a new variant?
   - Can you compose existing components?

2. **Only create new components when necessary**

### Component Completion Checklist

**Structure:**
- [ ] Default export
- [ ] TypeScript props interface
- [ ] Default prop values for all optional props
- [ ] Located in `/components/` or `/components/ui/`

**Design System:**
- [ ] Uses semantic tokens only (no hardcoded colors like `bg-blue-500`)
- [ ] Follows typography system (semantic HTML elements)
- [ ] Matches existing component patterns

**Quality:**
- [ ] Responsive (mobile-first, uses `sm:`, `md:`, `lg:` breakpoints)
- [ ] Accessible (semantic HTML, keyboard navigation, ARIA when needed)
- [ ] Performant (Next.js Image for images, minimal re-renders)

**Reusability:**
- [ ] Identified if pattern is reusable (used in 2+ places)
- [ ] If reusable: placed in `/components/ui/` for design system
- [ ] If project-specific: placed in `/components/`

### Common Patterns Reference

For reusable component patterns (Card, Input, Modal, etc.), see [references/component-patterns.md](references/component-patterns.md).

---

## API Routes Pattern

**Location:** `/app/api/devtools/[feature]/route.ts`

**Security:** All routes MUST check `NODE_ENV`:

```ts
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }
  // Implementation
}
```

**Routes:**
- `POST /api/devtools/write-css` — Writes to `globals.css` (creates backup)
- `POST /api/devtools/assets/upload`
- `GET /api/devtools/components` — Component scanning

---

## CSS Writer (RadTools → globals.css)

**⚠️ This is the ONLY correct way to modify design tokens and typography.**

Writes to `globals.css` via `/api/devtools/write-css`:
- Surgically updates only: `@theme` blocks, `@font-face`, typography rules
- Preserves all other CSS (scrollbar, animations, base styles)
- Creates `.globals.css.backup` before write
- Parses via regex (`[\s\S]*?` pattern for nested braces)

**Store locations:**
- Typography/Fonts: `devtools/store/slices/typographySlice.ts`
- Colors/Variables: `devtools/store/slices/variablesSlice.ts`

---

## Environment

- `DevToolsProvider` renders nothing in production
- API routes return 403 in production
- `useMockState()` returns `undefined` in production
- No setup required (auto-initializes in development)

---

## Keyboard Shortcuts

- `Shift + Cmd + K` (Mac) / `Shift + Ctrl + K` (Windows) — Toggle panel

---

---

## Edit Scope Attributes

DevTools panels use data attributes **directly on editable elements** to declare edit behavior. No DOM traversal needed.

| Attribute | Value | Edits Go To |
|-----------|-------|-------------|
| `data-edit-scope` | `layer-base` | `globals.css` → `@layer base { [element-tag] { } }` |
| `data-edit-scope` | `theme-variables` | `globals.css` → `@theme { }` |
| `data-edit-scope` | `component-definition` | `/components/*/Component.tsx` (requires `data-component`) |
| `data-edit-variant` | variant name | Variant-specific styles in Component.tsx |
| (no attribute) | - | Instance-specific (props/inline) - preview only |

### Decision Logic

```
Check the edited element for data-edit-scope:

IF data-edit-scope="layer-base":
  → Use element's tag name (h1, p, code, etc.)
  → Update @layer base { [element-tag] { } } in globals.css
  → NEVER apply inline styles
  → Changes persist immediately (no save needed)

IF data-edit-scope="theme-variables":
  → Update @theme { } in globals.css
  → Requires manual "Save to CSS" button click to persist

IF data-edit-scope="component-definition":
  → Read data-component to find target file
  → IF data-edit-variant exists:
      → Update variantStyles[variant] in Component.tsx
      → Only affects that specific variant
  → ELSE (no data-edit-variant):
      → Update baseStyles in Component.tsx
      → Affects all variants unless they have overrides
  → Changes persist immediately (no save needed)

IF no data-edit-scope:
  → Instance-specific edit (props/inline/className)
  → Preview-only - no persistence
```

### Examples

```tsx
// Typography: data-edit-scope directly on element
<h1 data-edit-scope="layer-base">Heading 1</h1>
<code data-edit-scope="layer-base">inline code</code>
<pre data-edit-scope="layer-base">code block</pre>

// Component base (affects all variants): no data-edit-variant
<Button 
  variant="primary" 
  data-edit-scope="component-definition"
  data-component="Button"
>
  Primary
</Button>

// Component variant (affects only this variant): includes data-edit-variant
<Button 
  variant="secondary" 
  data-edit-scope="component-definition"
  data-component="Button"
  data-edit-variant="secondary"
>
  Secondary
</Button>

// Preview-only (no editing power): no data attributes
<Button variant="primary" size="lg">
  Large Button
</Button>
```

### Adding New Component Previews

When adding new components to the Components Tab, follow this pattern:

**Base Component (affects all variants):**
```tsx
<Button 
  variant="primary"
  data-edit-scope="component-definition"
  data-component="Button"
  // NO data-edit-variant - this is the base
>
  Primary
</Button>
```

**Variant Component (affects only this variant):**
```tsx
<Button 
  variant="secondary"
  data-edit-scope="component-definition"
  data-component="Button"
  data-edit-variant="secondary"
>
  Secondary
</Button>
```

**Preview-Only (no editing power):**
```tsx
<Button variant="primary" size="lg">
  Large Button
</Button>
```

**Important:** 
- Attributes must be directly on each component instance, not on container/wrapper elements
- Base components (no `data-edit-variant`) affect all variants unless they have specific overrides
- Variant components (with `data-edit-variant`) only affect their specific variant styles
- Preview-only components have no data attributes

---

## Troubleshooting

**Components not appearing:** Check default export, `/components/` location, refresh button.

**CSS not updating:** Check console, verify `NODE_ENV=development`, check file permissions.

**Dev tools not showing:** Verify `NODE_ENV=development`, check `DevToolsProvider` in layout, try keyboard shortcut.

**Component edits not persisting:** Verify edits are being applied to `/components/*/ComponentName.tsx`, not preview files. Check that the component definition file is being updated, not instance files.

---

## Building from Figma

When creating components or pages from Figma designs, use Figma MCP tools directly with existing RadTools tokens.

### Workflow

1. **Use Figma MCP** to extract design:
   ```
   get_design_context(nodeId, fileKey) → component code
   ```

2. **Replace hardcoded colors** with RadTools semantic tokens:
   ```tsx
   // ❌ Figma output (hardcoded)
   <div className="bg-[#3B82F6] text-[#FFFFFF]">
   
   // ✅ RadTools tokens
   <div className="bg-primary text-white">
   ```

3. **Follow component requirements:**
   - Default export
   - Default prop values
   - TypeScript props interface
   - Location: `/components/` or `/components/ui/`

### Token Reference

Tailwind v4 auto-generates utility classes from `@theme` CSS variables. Check RadTools Variables tab for available tokens.

**Pattern:** `--color-{name}` → `bg-{name}`, `text-{name}`, `border-{name}`

| CSS Variable | Generated Utilities |
|--------------|---------------------|
| `--color-sun-yellow` | `bg-sun-yellow`, `text-sun-yellow`, `border-sun-yellow` |
| `--color-sky-blue` | `bg-sky-blue`, `text-sky-blue`, `border-sky-blue` |
| `--color-cream` | `bg-cream`, `text-cream`, `border-cream` |
| `--radius-md` | `rounded-md` |
| `--shadow-card` | `shadow-card` |

**Note:** Token names are project-specific. Check `globals.css` `@theme` block or RadTools Variables tab for your project's tokens.

### Quick Example

```tsx
// /components/ui/Card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({
  title,
  children
}: CardProps) {
  return (
    <div className="bg-warm-cloud border border-black rounded-md p-4 shadow-card">
      <h3 className="font-bold mb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
```

**Note:** Uses actual radOS tokens: `bg-warm-cloud`, `border-black`, `rounded-md`, `shadow-card`. Check your project's `@theme` block for available tokens.

### Design System Sync

For importing or updating the design system itself (colors, typography, spacing), use the `radtools-figma-sync` skill instead.
