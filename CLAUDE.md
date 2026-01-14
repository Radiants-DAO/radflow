# CLAUDE.md

This file provides guidance to Claude Code when working with RadFlow.

## What is RadFlow?

RadFlow is a visual design system editor that writes directly to theme package CSS files. It runs locally during development and is not deployed publicly.

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system design.**

---

## Development Commands

```bash
# Install dependencies (pnpm monorepo)
pnpm install

# Development server (Next.js)
pnpm dev

# Build all packages
pnpm build

# Build specific package
pnpm --filter @radflow/devtools build

# Lint
pnpm lint
```

---

## Repository Structure

```
radflow/                        # Core repo
├── packages/
│   ├── devtools/               # @radflow/devtools - Visual editor
│   └── primitives/             # @radflow/primitives - Headless hooks (WIP)
├── app/                        # Next.js routes (thin wrappers to theme pages)
│   ├── api/devtools/           # DevTools API routes
│   └── globals.css             # Theme import ONLY
└── pnpm-workspace.yaml         # Links external theme repos

# Theme repos (separate, linked via pnpm workspace)
theme-phase/                    # @radflow/theme-phase
theme-rad-os/                   # @radflow/theme-rad-os
```

---

## Linked Workspaces

Themes are separate git repos linked during development:

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - '../theme-phase'
  - '../theme-rad-os'
```

Clone all repos into same parent, run `pnpm install` from radflow/.

---

## What DevTools Writes

| Edit Type | Writes To |
|-----------|-----------|
| Variables (colors, shadows) | `theme-*/theme/tokens.css` |
| Typography | `theme-*/theme/typography.css` |
| Fonts | `theme-*/theme/fonts.css` |
| Color modes | `theme-*/theme/dark.css` |
| Theme switching | `app/globals.css` (import line only) |

**Write-lock**: Only the active theme can be edited. Writes to inactive themes return 403.

---

## Theme Package Structure

```
theme-phase/
├── radflow.config.json         # DevTools configuration
├── theme/                      # CSS source of truth
│   ├── tokens.css              # @theme blocks
│   ├── typography.css          # @layer base
│   └── ...
├── components/
│   ├── core/                   # Styled components
│   └── landing/                # Page-specific components
├── pages/                      # Page exports
├── skills/                     # Theme-specific Claude skills
└── assets/                     # Theme-specific assets
```

---

## globals.css

Contains ONLY the theme import:

```css
@import "tailwindcss";
@import "@radflow/theme-phase";
```

**DO NOT add tokens, typography, or styles here.** They belong in theme packages.

---

## Component Requirements

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
  return <button className="bg-primary text-foreground">{children}</button>;
}
```

**Rules:**
1. Default export (DevTools scanner requirement)
2. Default prop values (preview requirement)
3. TypeScript props interface
4. Semantic tokens only, never hardcoded colors

---

## Semantic Tokens

### Phase Theme (Dark-first, Web3)

```css
--color-background: var(--color-black);
--color-foreground: var(--color-cream);
--color-primary: var(--color-gold);
--glass-bg: rgba(243, 238, 217, 0.05);
--glass-border: rgba(243, 238, 217, 0.2);
```

### RadOS Theme (Light-first, Retro)

```css
--color-background: var(--color-warm-cloud);
--color-foreground: var(--color-black);
--color-primary: var(--color-sun-yellow);
```

---

## API Routes

All `/api/devtools/*` routes are development-only:

```typescript
if (process.env.NODE_ENV !== 'development') {
  return Response.json({ error: 'Not available' }, { status: 403 });
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+K` | Toggle DevTools panel |
| `Cmd+Shift+T` | Toggle Text Edit mode (clipboard only) |
| `Cmd+Shift+I` | Toggle Component ID mode |
| `1-5` | Quick-switch tabs |
| `Esc` | Close modals / Exit modes |

---

## Known Limitations

1. **Component editing not implemented**: `data-edit-scope="component-definition"` is documented but CSS-to-TSX write is not built
2. **Text Edit mode**: Copies to clipboard only, does not persist to files
3. **Skills**: Must be installed manually from AI tab to theme's `skills/` directory

---

## Path Aliases

```typescript
@/*                  → ./
@radflow/devtools    → packages/devtools/src
@radflow/primitives  → packages/primitives/src
```

---

## Contributing to Primitives

When creating reusable component logic:

1. Build in theme first (working implementation)
2. Extract hook to `packages/primitives/src/`
3. Submit PR to radflow repo
4. Update theme to use primitive

---

## Icons

Both themes use **Phosphor Icons** (`@phosphor-icons/react`):

```tsx
import { ArrowRight } from '@phosphor-icons/react';
<ArrowRight size={24} />
```
