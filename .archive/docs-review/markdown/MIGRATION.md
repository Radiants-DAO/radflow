# Migration Guide: RadTools to RadFlow

This guide helps you migrate from the old `npx radtools init` (file-copying) approach to the new RadFlow npm package architecture.

## Overview

**Before:** RadTools copied template files directly into your project
**After:** RadFlow is consumed as npm packages with optional file setup

## Breaking Changes

### Package Manager: npm to pnpm

RadFlow uses pnpm workspaces. Install pnpm if you haven't:

```bash
npm install -g pnpm
```

### Rad_os Components Removed

The following components have been moved to a separate theme package:

- `AppWindow` → `@radflow/components-rad-os`
- `MobileAppModal` → `@radflow/components-rad-os`
- `WindowTitleBar` → `@radflow/components-rad-os`

If you used these, install the theme-specific package:

```bash
pnpm add @radflow/components-rad-os
```

### CSS Body Defaults Changed

**Before:** Body used semantic tokens
```css
body {
  @apply bg-surface-primary text-content-primary;
}
```

**After:** Body uses explicit color values
```css
body {
  @apply bg-warm-cloud text-black;
}
```

Update your styles if you relied on semantic body tokens.

### DraggablePanel Removed

The `DraggablePanel` component and `react-draggable` dependency have been removed. If you used panel dragging, implement it locally or use a different library.

### New Components Added

Three new UI components are available:

- `Avatar` - User avatar with image/initials fallback
- `Skeleton` - Loading placeholder
- `Table` - Data table with sorting

---

## Quick Migration

```bash
# 1. Remove copied files
rm -rf devtools/
rm -rf app/api/devtools/

# 2. Install packages
pnpm add @radflow/ui @radflow/theme-rad-os @radflow/devtools

# 3. Set up agents and assets
npx radflow init

# 4. Update your CSS imports
# In app/globals.css, replace with:
@import "tailwindcss";
@import "@radflow/theme-rad-os";
```

---

## Step-by-Step Migration

### Step 1: Assess Your Current Setup

Check what RadTools files exist in your project:

```bash
# These will be removed or replaced
ls -la devtools/           # → Replaced by @radflow/devtools
ls -la components/ui/      # → Replaced by @radflow/ui (keep custom components)
ls -la app/api/devtools/   # → Simplified to single route
```

### Step 2: Backup Custom Components

If you've modified any RadTools components, back them up:

```bash
# Example: Save modified Button
cp components/ui/Button.tsx components/custom/Button.tsx
```

### Step 3: Install npm Packages

Choose your tier of adoption:

**Tier 1: Theme Only (CSS)**
```bash
pnpm add @radflow/theme-rad-os
```

**Tier 2: Components + Theme**
```bash
pnpm add @radflow/ui @radflow/theme-rad-os
```

**Tier 3: Full DevTools Suite**
```bash
pnpm add @radflow/ui @radflow/theme-rad-os @radflow/devtools
```

### Step 4: Update CSS Imports

Replace your `app/globals.css` with:

```css
@import "tailwindcss";
@import "@radflow/theme-rad-os";

/* Your custom styles below */
```

If you had custom CSS variables or overrides, add them after the imports:

```css
@import "tailwindcss";
@import "@radflow/theme-rad-os";

/* Custom token overrides */
@theme {
  --color-surface-primary: #your-custom-color;
}

/* Your custom styles */
.my-custom-class {
  /* ... */
}
```

### Step 5: Update Component Imports

Find and replace component imports:

**Before:**
```tsx
import { Button, Card } from '@/components/ui';
import { Icon } from '@/components/icons';
```

**After:**
```tsx
import { Button, Card, Icon } from '@radflow/ui';
```

Use your editor's find & replace:
- Find: `from '@/components/ui'` → Replace: `from '@radflow/ui'`
- Find: `from '@/components/icons'` → Replace: `from '@radflow/ui'`

### Step 6: Update DevTools Provider

**Before:**
```tsx
import { DevToolsProvider } from '@/devtools/DevToolsProvider';
```

**After:**
```tsx
import { DevToolsProvider } from '@radflow/devtools';
```

### Step 7: Set Up Persistence API (Optional)

If you want DevTools to save changes to files:

```tsx
// app/api/radflow/route.ts
export { handler as POST } from '@radflow/devtools/api';

export async function GET() {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  try {
    const cssPath = path.join(process.cwd(), 'app', 'globals.css');
    const content = await fs.readFile(cssPath, 'utf-8');
    return new Response(content, { headers: { 'Content-Type': 'text/css' } });
  } catch {
    return Response.json({ error: 'Failed to read CSS' }, { status: 500 });
  }
}
```

### Step 8: Clean Up Old Files

Once everything works, remove the old files:

```bash
# Remove copied DevTools
rm -rf devtools/

# Remove copied API routes (keep custom routes)
rm -rf app/api/devtools/

# Remove copied components (keep custom components)
rm -rf components/ui/  # Only if you haven't customized them!
rm -rf components/icons/

# Remove old templates
rm -rf templates/
```

### Step 9: Set Up AI Agent Context

```bash
npx radflow init --skip-api
```

This creates:
- `.claude/skills/radflow/`
- `.cursor/rules/radflow/`
- `public/assets/icons/` (143 icons)
- `public/assets/images/`
- `public/assets/logos/`

---

## Handling Custom Components

### If You Modified RadFlow Components

Use the eject command to copy the latest source:

```bash
npx radflow eject Button Card
```

Then merge your customizations into the ejected files.

### Import Pattern for Mixed Usage

```tsx
// Use npm package for standard components
import { Card, Dialog } from '@radflow/ui';

// Use local for customized components
import { Button } from '@/components/radflow/Button';
```

---

## Common Issues

### "Module not found" Errors

Make sure you've installed all packages:
```bash
pnpm add @radflow/ui @radflow/theme-rad-os @radflow/devtools
```

### Styles Not Applying

Check your globals.css imports:
```css
@import "tailwindcss";
@import "@radflow/theme-rad-os";
```

### TypeScript Errors

The npm packages include types. If you see errors, try:
```bash
# Rebuild types
rm -rf node_modules/.cache
pnpm build
```

### DevTools Not Opening

Make sure DevToolsProvider wraps your app:
```tsx
<DevToolsProvider>
  {children}
</DevToolsProvider>
```

And press `Cmd+Shift+K` (Mac) or `Ctrl+Shift+K` (Windows/Linux).

### Rad_os Components Missing

Install the theme-specific component package:
```bash
pnpm add @radflow/components-rad-os
```

```tsx
import { AppWindow, WindowTitleBar } from '@radflow/components-rad-os';
```

---

## What's New in RadFlow

### New Components
- `Avatar` - User avatars with image/initials
- `Skeleton` - Loading placeholders
- `Table` - Data tables with sorting

### Expanded Icon Library
- 40 → 143 icons (257% increase)
- New categories: media playback, finance, system hardware, charts, security

### New DevTools Features
- **Text Edit Mode** (`Cmd+Shift+T`) - Click any text to edit inline
- **Component ID Mode** (`Cmd+Shift+I`) - Hover to identify React components
- **Help Mode** (`Cmd+Shift+?`) - Contextual help for any UI element
- **Global Search** - Search components, variables, and assets
- **Clipboard History** - Track copied colors and code

### New CLI Commands
```bash
npx radflow update              # Selective updates
npx radflow update --components # Only components
npx radflow update --devtools   # Only DevTools
npx radflow outdated           # Check for updates
```

---

## Comparison: Before and After

| Aspect | Before (RadTools) | After (RadFlow) |
|--------|-------------------|-----------------|
| Install | `npx radtools init` | `pnpm add @radflow/*` |
| Update | `npx radtools update` | `npx radflow update` |
| Components | `@/components/ui` | `@radflow/ui` |
| DevTools | `@/devtools/DevToolsProvider` | `@radflow/devtools` |
| Theme | Copied globals.css | `@import "@radflow/theme-rad-os"` |
| Conflicts | Merge conflicts on update | No conflicts |
| Customization | Edit source files | Token overrides + eject |
| Package Manager | npm | pnpm |
| Components | 22 | 25 (+Avatar, Skeleton, Table) |
| Icons | 40 | 143 |

---

## Questions?

- [GitHub Issues](https://github.com/Radiants-DAO/radflow/issues)
- [Documentation](https://github.com/Radiants-DAO/radflow)
