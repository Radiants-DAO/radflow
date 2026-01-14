# RadFlow Architecture

## Overview

RadFlow is a **pnpm monorepo platform** for building design systems with visual editing tools. It hosts multiple themes, component libraries, and provides DevTools for visual development — all distributable as npm packages.

```
RadFlow Monorepo (Hub)
    ↓ npm publish
User Projects (consume packages)
    ↓ contribute back
RadFlow Monorepo (gains new themes/components)
```

---

## Core Concepts

### RadFlow as Platform

RadFlow is not just "a component library" — it's a platform that:

1. **Hosts multiple themes** - rad-os, solarium, cyberpunk, client-specific
2. **Hosts multiple component sets** - 25 core UI, theme-specific components
3. **Provides DevTools** - visual editor that works with any combination
4. **Enables contribution** - projects build locally, contribute back to the hub

### Semantic Token Architecture

Components use semantic tokens, not brand colors:

```tsx
// CORRECT (semantic - works with any theme):
className="bg-surface-primary border-edge-primary text-content-primary"

// WRONG (brand-specific - breaks with other themes):
className="bg-warm-cloud border-black text-black"
```

This means swapping `@radflow/theme-rad-os` for `@radflow/theme-cyberpunk` changes every component's appearance without touching component code.

---

## Three Tiers of Adoption

```
┌─────────────────────────────────────────────────────────────────┐
│  TIER 3: Full DevTools Suite                                    │
│  @radflow/devtools - Visual editor, contribution wizard        │
├─────────────────────────────────────────────────────────────────┤
│  TIER 2: Components + Theme                                     │
│  @radflow/ui + @radflow/components-* - Ready-to-use components │
├─────────────────────────────────────────────────────────────────┤
│  TIER 1: Just CSS                                               │
│  @radflow/theme-* - Design tokens, typography, shadows         │
└─────────────────────────────────────────────────────────────────┘
```

### Tier 1: Just CSS

For developers who want the RadFlow aesthetic with their own components.

```bash
pnpm add @radflow/theme-rad-os
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@radflow/theme-rad-os";
```

**What they get:**
- Brand colors (`--color-sun-yellow`, `--color-warm-cloud`, etc.)
- Semantic tokens (`--color-surface-primary`, `--color-content-primary`, etc.)
- Typography scale, font families
- Shadows, border radius, spacing
- Dark mode via `.dark` class

### Tier 2: Components + Theme

For developers who want ready-to-use components with customization via tokens.

```bash
pnpm add @radflow/ui @radflow/theme-rad-os
# Optional: theme-specific components
pnpm add @radflow/components-rad-os
```

```tsx
import { Button, Card, Dialog } from '@radflow/ui'
import { AppWindow, WindowTitleBar } from '@radflow/components-rad-os'
```

**Customization options:**
1. **Props** - variant, size, iconName, etc.
2. **className overrides** - Tailwind classes
3. **Token overrides** - Redefine semantic tokens in your CSS
4. **Theme swap** - Use a different theme package entirely
5. **Eject** - Copy component source for deep customization

### Tier 3: Full DevTools Suite

For developers who want visual editing, live preview, and AI-assisted workflows.

```bash
pnpm add @radflow/ui @radflow/theme-rad-os @radflow/devtools
npx radflow init  # Copies agents + assets
```

```tsx
// app/layout.tsx
import { DevToolsProvider } from '@radflow/devtools'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <DevToolsProvider>
          {children}
        </DevToolsProvider>
      </body>
    </html>
  )
}
```

---

## Package Structure

```
packages/
├── theme/                      # Base semantic token interface
├── theme-rad-os/               # Rad OS theme
│   ├── index.css               # Main entry
│   ├── tokens.css              # Brand + semantic tokens
│   └── dark.css                # Dark mode overrides
│
├── ui/                         # 25 core components
│   ├── Accordion.tsx
│   ├── Alert.tsx
│   ├── Avatar.tsx              # NEW
│   ├── Badge.tsx
│   ├── Breadcrumbs.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Checkbox.tsx
│   ├── ContextMenu.tsx
│   ├── Dialog.tsx
│   ├── Divider.tsx
│   ├── DropdownMenu.tsx
│   ├── HelpPanel.tsx
│   ├── Icon.tsx
│   ├── Input.tsx
│   ├── Popover.tsx
│   ├── Progress.tsx
│   ├── Select.tsx
│   ├── Sheet.tsx
│   ├── Skeleton.tsx            # NEW
│   ├── Slider.tsx
│   ├── Switch.tsx
│   ├── Table.tsx               # NEW
│   ├── Tabs.tsx
│   ├── Toast.tsx
│   └── Tooltip.tsx
│
├── devtools/                   # Visual editor
│   ├── DevToolsProvider.tsx
│   ├── DevToolsPanel.tsx
│   ├── store/                  # Zustand (11 slices)
│   │   ├── panelSlice.ts
│   │   ├── variablesSlice.ts
│   │   ├── typographySlice.ts
│   │   ├── assetsSlice.ts
│   │   ├── clipboardSlice.ts   # NEW
│   │   ├── componentIdSlice.ts # NEW
│   │   ├── helpSlice.ts        # NEW
│   │   ├── statusSlice.ts      # NEW
│   │   └── textEditSlice.ts    # NEW
│   ├── tabs/
│   │   ├── VariablesTab/
│   │   ├── TypographyTab/
│   │   ├── ComponentsTab/
│   │   ├── AssetsTab/
│   │   └── MockStatesTab/
│   ├── components/             # 19+ DevTools components
│   └── lib/
│       ├── cssParser.ts
│       ├── componentDiscovery.ts
│       ├── componentRegistry.ts    # NEW
│       ├── globalSearchIndex.ts    # NEW
│       ├── helpRegistry.ts         # NEW
│       ├── propValueResolver.ts    # NEW
│       └── searchIndex.ts          # NEW
│
└── cli/                        # CLI utilities
    ├── init                    # Setup agents + assets
    ├── assets                  # Copy icons/images to public/
    ├── eject                   # Copy component source locally
    ├── update                  # Selective sync
    └── outdated                # Check for updates
```

### Package Responsibilities

| Package | Contains | Writes Files? |
|---------|----------|---------------|
| `@radflow/theme` | Base CSS structure, semantic token names | No |
| `@radflow/theme-*` | Token values, dark mode, theme-specific agents | No |
| `@radflow/ui` | 25 core React components | No |
| `@radflow/components-*` | Theme-specific React components | No |
| `@radflow/devtools` | Visual editor, base agents, contribution wizard | No* |
| `@radflow/cli` | Init, assets, eject, update commands | Yes (explicit commands only) |

*DevTools can write if optional API route is added for persistence.

---

## DevTools

### Tab Overview

| Tab | Purpose | Features |
|-----|---------|----------|
| **Variables** | Design tokens | Colors, radius, shadows, color modes |
| **Typography** | Fonts & styles | Font manager, element styles (h1-h6, p, code) |
| **Components** | Browse & preview | Auto-discovery, prop editor, live playground |
| **Assets** | File management | 143 icons, images, logos, drag-drop upload |
| **Mock States** | Test data | Wallet states, custom presets |

### Interactive Tools

| Tool | Shortcut | Description |
|------|----------|-------------|
| Text Edit | `Cmd+Shift+T` | Click any text to edit inline, auto-copies to clipboard |
| Component ID | `Cmd+Shift+I` | Hover to identify React components, click to copy name |
| Help Mode | `Cmd+Shift+?` | Hover over any UI element for contextual help |
| Global Search | — | Search components, variables, and assets |
| Clipboard History | — | Track copied colors and code snippets |

### Dynamic Component Discovery

DevTools scans and displays components from multiple sources:

```
Components Tab: [ui] [rad_os] [solarium]
                 ↑      ↑         ↑
           npm package  │    local folder
                   npm package
```

- **npm packages**: Discovered from `node_modules/@radflow/`
- **Local folders**: Scanned from `components/[name]/`

### Preview Mode (Default)

DevTools operates in preview mode by default:

1. **Live CSS injection** - Changes apply via JavaScript
2. **Temporary** - Refresh resets to theme defaults
3. **Export/Copy** - Generate CSS to paste into your files

### Persistence Mode (Opt-in)

Add the API route to enable saving:

```tsx
// app/api/radflow/route.ts
export { handler as POST } from '@radflow/devtools/api'
```

This enables DevTools to write changes to your project files.

---

## Edit Scope Attributes

Components use data attributes to identify edit targets:

| Attribute | Value | Writes To |
|-----------|-------|-----------|
| `data-edit-scope` | `layer-base` | `globals.css` → `@layer base { [element-tag] { } }` |
| `data-edit-scope` | `theme-variables` | `globals.css` → `@theme { }` |
| `data-edit-scope` | `component-definition` | `/components/*/Component.tsx` |
| `data-edit-variant` | variant name | Variant-specific styles in Component.tsx |
| (no attribute) | — | Preview-only, no persistence |

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
```

---

## Agent Context

### Base Context (with DevTools)

Every project gets base RadFlow AI context:

```
.claude/
├── skills/radflow/           # Component creation, editing
├── CLAUDE.md                 # Project instructions
.cursor/
├── rules/radflow/
```

### Theme-Specific Context

Themes can include their own AI instructions:

```
@radflow/theme-solarium/
└── agents/
    └── .claude/skills/solarium/
        └── SKILL.md           # Solarium-specific patterns
```

---

## CLI Commands

```bash
# Initial setup (copies agents + assets)
npx radflow init

# Selective updates
npx radflow update
npx radflow update --components
npx radflow update --devtools
npx radflow update --agents

# Check for updates
npx radflow outdated

# Copy/update assets only
npx radflow assets

# Eject components for customization
npx radflow eject Button Card Dialog
```

---

## Eject Escape Hatch

For deep customization of specific components:

```bash
npx radflow eject Button Card
```

Creates:
```
components/
└── radflow/
    ├── Button.tsx    # You now own this
    └── Card.tsx      # You now own this
```

**Behavior:**
- Ejected components are YOUR code
- `npm update` won't touch them
- Non-ejected dependencies stay as package imports
- Only eject when you truly need deep changes

---

## Component Requirements

For components to work in this system:

1. **Use semantic tokens** - `bg-surface-tertiary`, not `bg-sun-yellow`
2. **Accept className prop** - For Tailwind overrides
3. **Default export** - Named exports ignored by scanner
4. **Default prop values** - Required for visual editor
5. **TypeScript props interface** - Full type safety
6. **Tree-shakeable** - Unused components don't bloat bundle

```tsx
// Example: Correct component structure
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children
}: ButtonProps) {
  return (
    <button className={cn(
      'bg-surface-tertiary text-content-primary border-edge-primary',
      className
    )}>
      {children}
    </button>
  )
}
```

---

## Summary

| Before (File Copying) | After (npm Packages) |
|-----------------------|----------------------|
| `npx radtools init` copies files | `pnpm add @radflow/*` |
| `templates/` folder | `packages/` monorepo |
| `radtools update` | `npx radflow update` |
| Merge conflicts on update | No conflicts (source in npm) |
| Single theme | Multiple themes |
| No contribution path | Contribution wizard + PR flow |
| Manual AI setup | Agent context bundled |
| 22 components | 25 components |
| 40 icons | 143 icons |
| npm | pnpm workspaces |
