# RadFlow Architecture

RadFlow is a visual design system editor that writes directly to theme package CSS files. It runs locally during development via Claude Code or Cursor.

---

## High-Level Structure

```
Development Setup (Linked Workspaces)
======================================

~/dev/
├── radflow/                    # Core repo (this repo)
│   ├── packages/
│   │   ├── devtools/           # @radflow/devtools - Visual editor
│   │   └── primitives/         # @radflow/primitives - Headless hooks
│   ├── app/                    # Next.js routes (thin wrappers)
│   └── pnpm-workspace.yaml     # Links external theme repos
│
├── theme-phase/                # Separate repo - Phase theme
│   ├── package.json            # "name": "@radflow/theme-phase"
│   ├── radflow.config.json     # DevTools configuration
│   ├── theme/                  # CSS files (tokens, typography, etc.)
│   ├── components/             # Styled components using primitives
│   ├── pages/                  # Page components
│   └── skills/                 # Theme-specific Claude skills
│
└── theme-rad-os/               # Separate repo - RadOS theme
    └── (same structure)
```

---

## Core Packages

### @radflow/devtools

Visual editor that runs in the browser during development.

**Responsibilities:**
- Parse and display design tokens from active theme
- Write CSS changes to theme package files
- Component discovery and preview
- Typography and font management
- Theme switching (via globals.css import rewrite)

**Does NOT deploy publicly.** Consumed as npm dependency by theme repos.

### @radflow/primitives

Headless hooks for complex component behavior.

**Includes:**
- `useDialog` - Modal behavior, focus trap, escape handling
- `useSheet` - Side panel variant of dialog
- `useToast` - Queue management, auto-dismiss timers
- `useSelect` - Keyboard navigation, filtering
- `useTabs` - Active state, keyboard nav, ARIA
- `usePopover` - Positioning, click-outside
- `useDropdown` - Menu state, submenus
- `useButton` - Copy state, loading, polymorphic `as`
- `useAccordion` - Expand/collapse, single/multi mode
- `useSlider` - Value state, drag handling

**Themes import these hooks and wrap with their own styling.**

---

## Theme Package Structure

Each theme is a separate git repo that can be linked for development.

```
theme-phase/
├── package.json                 # @radflow/theme-phase
├── radflow.config.json          # DevTools configuration
│
├── theme/                       # CSS source of truth
│   ├── index.css                # Entry (imports all)
│   ├── tokens.css               # @theme blocks - colors, shadows, radii
│   ├── typography.css           # @layer base - element styles
│   ├── fonts.css                # @font-face declarations
│   ├── dark.css                 # Color mode overrides
│   ├── base.css                 # html/body styles
│   ├── scrollbar.css            # ::-webkit-scrollbar
│   └── animations.css           # @keyframes
│
├── components/
│   ├── core/                    # 30+ styled components
│   │   ├── Button.tsx           # Uses usePrimitiveButton + Phase styling
│   │   ├── Dialog.tsx           # Uses usePrimitiveDialog + Phase styling
│   │   └── ...
│   └── landing/                 # Page-specific components
│       ├── ServiceCard.tsx
│       ├── NavLink.tsx
│       └── ...
│
├── pages/
│   ├── landing/                 # Landing page export
│   │   └── index.tsx
│   ├── pricing/
│   └── dashboard/
│
├── assets/                      # Theme-specific assets
│   ├── logos/
│   ├── icons/
│   └── avatars/
│
├── skills/                      # Theme-specific Claude skills
│   └── phase-design.md
│
└── agents/                      # Theme-specific agents
    └── phase-compliance.md
```

---

## radflow.config.json

Each theme provides configuration for DevTools.

```json
{
  "name": "Phase",
  "id": "phase",

  "theme": {
    "root": "./theme",
    "tokens": "./theme/tokens.css",
    "typography": "./theme/typography.css",
    "fonts": "./theme/fonts.css",
    "dark": "./theme/dark.css"
  },

  "devtools": {
    "icons": {
      "typography": "./assets/icons/typography.svg",
      "components": "./assets/icons/components.svg",
      "variables": "./assets/icons/variables.svg"
    },
    "fonts": {
      "heading": "Audiowide",
      "body": "Outfit",
      "code": "Kode Mono"
    },
    "sref": {
      "codes": ["sref-phase-001", "sref-phase-002"],
      "images": "./assets/sref/"
    }
  },

  "skills": {
    "recommended": ["phase-design", "phase-component-create"]
  }
}
```

---

## Development Workflow

### Initial Setup

```bash
# Clone all repos into same parent directory
mkdir radflow-dev && cd radflow-dev
git clone git@github.com:org/radflow.git
git clone git@github.com:org/theme-phase.git

# Install from radflow (links everything)
cd radflow
pnpm install

# Start development
pnpm dev
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  # Link external theme repos
  - '../theme-phase'
  - '../theme-rad-os'
```

### Theme Activation

Set environment variable or edit globals.css:

```bash
# .env.local
NEXT_PUBLIC_ACTIVE_THEME=phase
```

```css
/* app/globals.css - auto-generated based on env */
@import "tailwindcss";
@import "@radflow/theme-phase";
```

---

## App Router Integration

Theme pages export components. App router has thin wrappers.

**Theme package exports:**
```tsx
// packages/theme-phase/pages/landing/index.tsx
export default function PhaseLanding() {
  return (
    <div className="bg-background text-foreground">
      {/* Full landing page */}
    </div>
  );
}
```

**App router wrapper:**
```tsx
// app/phase/page.tsx
export { default } from '@radflow/theme-phase/pages/landing';
```

**App router layout (optional):**
```tsx
// app/phase/layout.tsx
export { metadata } from '@radflow/theme-phase/pages/landing/metadata';

export default function PhaseLayout({ children }) {
  return children;
}
```

---

## Skills System

### Skill Library

RadFlow maintains a central library of skills in the DevTools AI tab:

| Category | Examples |
|----------|----------|
| **Design** | Generate component, Apply design system |
| **Compliance** | Audit accessibility, Check token usage |
| **Tools** | Create commit, Review PR |

### Installation Flow

1. User opens DevTools → AI tab
2. Browse available skills from RadFlow library
3. Click "Install" on desired skills
4. Skill is copied to theme's `skills/` directory
5. Skill persists even if RadFlow is unlinked

### Theme-Specific Skills

Themes can include their own skills:
```
theme-phase/skills/
├── phase-design.md        # "Generate Phase-styled component"
└── phase-landing.md       # "Create Phase landing section"
```

These appear in AI tab when theme is active.

---

## Component Architecture

### Primitives → Themed Components

```tsx
// @radflow/primitives
export function useDialog(options) {
  // Focus trap, escape handling, overlay click
  // Returns: { isOpen, open, close, triggerProps, dialogProps }
}

// @radflow/theme-phase/components/core/Dialog.tsx
import { useDialog } from '@radflow/primitives';

export default function Dialog({ children, ...props }) {
  const { isOpen, dialogProps } = useDialog(props);

  return (
    <div
      {...dialogProps}
      className="bg-glass-bg border-glass-border backdrop-blur-md"
    >
      {children}
    </div>
  );
}
```

### Component Requirements

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',  // Required: default values for DevTools
  size = 'md',
  children
}: ButtonProps) {
  // ...
}
```

**Rules:**
1. Default export (DevTools scanner requirement)
2. Default prop values (visual preview requirement)
3. TypeScript props interface
4. Use semantic tokens, never hardcoded colors

---

## Contributing Components to Primitives

When a theme creates a component that would benefit all themes:

1. **Open PR** to radflow repo
2. **Extract hook logic** into `packages/primitives/src/`
3. **Add tests** for the primitive
4. **Update docs** with usage examples
5. **Theme updates** its component to use the new primitive

---

## Asset Organization

### Shared Assets (in radflow/)

```
public/assets/
├── icons/              # System icons (Phosphor-style)
└── shared/             # Brand-agnostic images
```

### Theme Assets (in theme repo)

```
theme-phase/assets/
├── logos/              # Phase branding
├── icons/              # Theme-specific icons
├── avatars/            # Team/user avatars
├── tokens/             # Crypto token images
└── sref/               # Midjourney style references
```

---

## DevTools Theme Awareness

DevTools reads `radflow.config.json` to customize its UI per theme:

| Tab | Theme-Specific |
|-----|----------------|
| Variables | Token values from theme CSS |
| Typography | Font names from config |
| Components | Discovered from theme package |
| Mock States | Uses theme semantic tokens |
| AI | Theme-recommended skills + SREF codes |

**Icon mapping**: DevTools loads icons from paths specified in config. Falls back to neutral icons if not specified.

---

## Write-Lock Enforcement

Only the **active theme** can be edited through DevTools.

```typescript
// API route check
const activeTheme = await getCurrentThemeId(); // 'phase'
if (themeId !== activeTheme) {
  return Response.json({ error: 'Cannot edit inactive theme' }, { status: 403 });
}
```

This prevents accidental edits to wrong theme.

---

## Production Deployment

### Theme Repos Deploy Independently

```bash
# In theme-phase repo
pnpm build
vercel deploy  # or netlify, etc.
```

### RadFlow Packages Published to npm

```bash
# In radflow repo
pnpm --filter @radflow/devtools publish
pnpm --filter @radflow/primitives publish
```

### Theme Uses Published Packages

```json
// theme-phase/package.json (production)
{
  "dependencies": {
    "@radflow/primitives": "^1.0.0"
  },
  "devDependencies": {
    "@radflow/devtools": "^1.0.0"
  }
}
```

---

## Summary

| Concept | Location | Published |
|---------|----------|-----------|
| DevTools | `radflow/packages/devtools` | npm |
| Primitives | `radflow/packages/primitives` | npm |
| Theme CSS | `theme-*/theme/` | With theme |
| Theme Components | `theme-*/components/` | With theme |
| Theme Pages | `theme-*/pages/` | With theme |
| Theme Skills | `theme-*/skills/` | With theme |
| Route Wrappers | `radflow/app/` | Dev only |

RadFlow is the development tool. Themes are the products.
