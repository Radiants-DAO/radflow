# RadTools Agent Guide

## Build & Validation

```bash
# Typecheck (run first - catches most issues)
pnpm typecheck

# Full build
pnpm build

# Development server
pnpm dev
```

## Package Structure

```
packages/
├── devtools/     # DevTools panel (main implementation target)
├── ui/           # Shared UI component library (@radflow/ui)
└── theme-rad-os/ # Default theme (CSS + components)
```

## Key Patterns

### DevTools Components
- Location: `packages/devtools/src/`
- Use Zustand store: `import { useDevToolsStore } from '../../store'`
- Use semantic tokens: `bg-surface-primary`, `text-content-primary`
- Tab components in: `packages/devtools/src/tabs/`

### UI Components (@radflow/ui)
- Location: `packages/ui/src/`
- Default export required
- TypeScript props interface required
- Import pattern: `import { Button } from '@radflow/ui/Button'`

### CSS/Tokens
- Semantic tokens defined in theme CSS
- Don't use hardcoded colors in components
- Follow `CLAUDE.md` for edit scope attributes

## Learnings

- The `generate-ui-tab.ts` script was removed; UITab.tsx is now manually maintained
- VariablesTab restored from git history (was accidentally deleted)
- Plans in `.plans/` are the source of truth for requirements
