# Theme Architecture Plan v3

**Status:** Final Draft
**Created:** 2026-01-10
**Related:** `devtools-tabs-v1.md`, `devtools-modes-v1.md`

---

## Overview

Design the multi-theme system for RadFlow DevTools where:
- Themes are top-level entities (above light/dark modes)
- Each theme is fully self-contained (components, styles, tokens)
- Themes are publishable as npm packages
- DevTools allows switching, creating, and editing themes

---

## 1. Theme Concept Model

```
┌─────────────────────────────────────────────────────────────────┐
│                         PROJECT                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    ACTIVE THEME                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│  │
│  │  │   TOKENS    │  │ COMPONENTS  │  │       MODES         ││  │
│  │  │ (CSS vars)  │  │  (TSX)      │  │  light │ dark │ ... ││  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘│  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│  │
│  │  │   ASSETS    │  │ AI PROMPTS  │  │    MOCK STATES      ││  │
│  │  │ icons/imgs  │  │ + MJ styles │  │  auth/wallet/etc    ││  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘│  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Other installed themes (read-only when not active):             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ @radflow/    │  │ @radflow/    │  │   local/     │          │
│  │ theme-rad-os │  │ theme-phase  │  │  my-theme    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

**Key Principles:**
- Only ONE theme is active at a time
- Non-active themes have a write-lock (cannot be edited)
- Modes (light/dark) are CSS-only swaps within a theme (no component code changes)
- Each theme has its own: components, assets, AI prompts, mock states
- Themes are standalone (no inheritance between themes)
- `@radflow/ui` is a shared component library that themes CAN import from but don't have to

---

## 2. Theme Package Structure

Themes use a **flat package structure** with components organized in subfolders:

```
packages/theme-rad-os/
├── package.json
├── index.css              # Main entry (@import all CSS)
├── tokens.css             # Brand colors + semantic mappings
├── dark.css               # .dark mode overrides
├── fonts.css              # @font-face declarations
├── typography.css         # @layer base typography
├── base.css               # Base HTML/body styles
├── scrollbar.css          # Scrollbar styling
├── animations.css         # @keyframes
├── components/            # Theme-specific components
│   ├── core/              # Core UI components (Button, Card, etc.)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── solarium/          # Solarium-specific components
│   │   ├── SolariumCard.tsx
│   │   └── index.ts
│   ├── auctions/          # Auction-specific components
│   │   ├── AuctionBid.tsx
│   │   └── index.ts
│   └── index.ts           # Re-exports all
├── assets/
│   ├── icons/
│   └── images/
├── agents/
│   └── .claude/skills/rad-os-theme/SKILL.md
├── tsup.config.ts
└── dist/                  # Built output
```

### Component Folder → Tab Mapping

The Components tab in DevTools maps directly to the folder structure:

```
Components Tab
├── Core           → /components/core/
├── Solarium       → /components/solarium/
├── Auctions       → /components/auctions/
└── Rad Radio      → /components/rad-radio/
```

Each subtab displays the components inside that subfolder.

### Import Pattern (Theme-Qualified)

```tsx
// Import from specific theme
import { Button } from '@radflow/theme-rad-os/components'
import { Button } from '@radflow/theme-phase/components'

// Import specific component sets
import { SolariumCard } from '@radflow/theme-rad-os/components/solarium'
import { AuctionBid } from '@radflow/theme-rad-os/components/auctions'

// Or import from shared @radflow/ui (not theme-specific)
import { Button } from '@radflow/ui'
```

---

## 3. DevTools UI Layout

### 3.1 Top Bar

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [☀️ RadOS ▾]     [Breakpoint ▾]  [Panel Position ▾]  [light/dark toggle] │
└──────────────────────────────────────────────────────────────────────────┘
      │
      └── Theme quick-switcher dropdown
          - Shows: Logo + Theme Name
          - Dropdown lists all installed themes
          - Click to switch active theme
```

### 3.2 LeftRail (Updated)

```
┌──┐
│🔍│  Component ID mode
│✏️│  Text Edit mode
│❓│  Help mode
├──┤
│📊│  Variables tab
│🔤│  Typography tab
│🧩│  Components tab
│📁│  Assets tab
│🤖│  AI tab
│⚙️│  Mock States tab
├──┤
│⚙️│  Settings (NEW - at bottom)
└──┘
      │
      └── Opens Settings panel with:
          - Theme management (create/delete/info)
          - Theme creation wizard
          - RadFlow global settings
```

### 3.3 Theme Indicator (Top Bar Detail)

```
┌────────────────────┐
│ [☀️ RadOS ▾]       │  ← Click opens dropdown
├────────────────────┤
│ ☀️ RadOS      ✓   │  ← Active indicator
│ 🌙 Phase          │
│ ⚡ Solarium       │
│ ─────────────────  │
│ + Create Theme     │  ← Opens wizard in Settings
│ ⚙️ Manage Themes   │  ← Opens Settings tab
└────────────────────┘
```

---

## 4. Theme Creation Wizard (AI-Assisted)

Located in Settings panel. Uses comprehensive prompts instead of complex UI programs.

### Wizard Flow

```
Step 1: Basic Info
┌─────────────────────────────────────────────────────────────┐
│ CREATE NEW THEME                                             │
│                                                              │
│ Theme Name: [____________]                                   │
│ Base Theme: [RadFlow ▾]  (copy from)                         │
│ Author:     [____________]                                   │
│ Org/Link:   [____________] (optional)                        │
│                                                              │
│                                    [Cancel]  [Next →]        │
└─────────────────────────────────────────────────────────────┘

Step 2: Color Variables
┌─────────────────────────────────────────────────────────────┐
│ DEFINE BRAND COLORS                                          │
│                                                              │
│ Primary:    [#______] [████]                                 │
│ Secondary:  [#______] [████]                                 │
│ Accent:     [#______] [████]                                 │
│ Background: [#______] [████]                                 │
│ ...                                                          │
│                                                              │
│ 💡 Ensure both light and dark modes generate correct         │
│    semantic tokens.                                          │
│                                                              │
│ [📋 Copy Prompt] ← Comprehensive prompt for AI refinement    │
│                                                              │
│                              [← Back]  [Next →]              │
└─────────────────────────────────────────────────────────────┘

Step 3: Font Import
┌─────────────────────────────────────────────────────────────┐
│ IMPORT FONTS                                                 │
│                                                              │
│ [Drop font files here or browse]                            │
│                                                              │
│ Detected: Mondwest-Regular.woff2, Mondwest-Bold.woff2       │
│                                                              │
│ Font Download Links (Required):                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Font Name: [Mondwest                    ]                │ │
│ │ URL:       [https://pangrampangram.com/...]              │ │
│ │                                          [+ Add Font]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ These links will be included in the theme README.           │
│                                                              │
│                              [← Back]  [Next →]              │
└─────────────────────────────────────────────────────────────┘

Step 4: Icon Library
┌─────────────────────────────────────────────────────────────┐
│ IMPORT ICON LIBRARY                                          │
│                                                              │
│ [Drop icon folder here or browse]                           │
│                                                              │
│ Detected: 143 icons                                         │
│ Format: SVG                                                  │
│                                                              │
│ [📋 Copy Remap Prompt] ← Prompt to remap icon names         │
│                                                              │
│                              [← Back]  [Next →]              │
└─────────────────────────────────────────────────────────────┘

Step 5: Review Theme
┌─────────────────────────────────────────────────────────────┐
│ REVIEW THEME                                                 │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  [Component previews with new theme applied]             │ │
│ │  Button | Card | Input | Badge | ...                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [📋 Copy Review Prompt] ← For AI back-and-forth refinement  │
│                                                              │
│ Questions to consider:                                       │
│ - Do semantic tokens work in both modes?                    │
│ - Are contrasts accessible?                                  │
│ - Does the aesthetic match your vision?                     │
│                                                              │
│                              [← Back]  [Create Theme]        │
└─────────────────────────────────────────────────────────────┘

Step 6: Confirmation & Commit
┌─────────────────────────────────────────────────────────────┐
│ THEME CREATED                                                │
│                                                              │
│ ✓ Theme "Phase" created successfully                        │
│ ✓ Now set as active theme                                   │
│                                                              │
│ [📋 Copy Commit Prompt]                                      │
│ ← Structured prompt to:                                      │
│   - Confirm theme is correct                                │
│   - Commit to RadFlow GitHub repo                           │
│   - Update radflow.config.js                                │
│                                                              │
│ ⚠️ Theme is not saved until committed to GitHub             │
│                                                              │
│                                          [Done]              │
└─────────────────────────────────────────────────────────────┘
```

### What Gets Copied (Theme Duplication)

| Copied | Not Copied |
|--------|------------|
| ✅ All CSS files (tokens, dark, typography, etc.) | ❌ Font files (licensing) |
| ✅ All components from source theme | ❌ Asset files (icons, images) |
| ✅ package.json (with new name) | |
| ✅ Agent/skill files | |

**Icons:** User imports their own icon library during wizard, remapped via AI prompt.

**Fonts:** User uploads font files + provides download links. Links go in README. Files placed in `public/fonts/`.

---

## 5. Theme Settings Panel

Located in Settings (⚙️ at bottom of LeftRail).

```
┌─────────────────────────────────────────────────────────────┐
│ THEME SETTINGS                                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ INSTALLED THEMES                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☀️ RadOS                                          ✓ Active│ │
│ │    Author: Radiants                                      │ │
│ │    [GitHub] [Twitter] [Website]                         │ │
│ │                                              [Delete]    │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 🌙 Phase                                                 │ │
│ │    Author: Phase Labs                                    │ │
│ │    [GitHub] [Twitter]                                    │ │
│ │                                    [Activate] [Delete]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [+ Create New Theme]                                         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ EXPORT THEME                                                 │
│                                                              │
│ [📋 Copy Export Prompt]                                      │
│ ← Validates files, generates README, creates commit         │
│   for PR to RadFlow GitHub                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Variables Tab: Token Editor (Full-Page Mode)

A full-page popup for editing color tokens with live preview.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOKEN EDITOR                                                         [✕]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌───────────────────────────────┐│
│  │ BRAND COLORS                        │  │ PREVIEW                       ││
│  │                                     │  │                               ││
│  │ Name         Hex       Mappings     │  │ ┌─────────┐ ┌─────────┐      ││
│  │ ─────────────────────────────────── │  │ │ Button  │ │ Card    │      ││
│  │ sun-yellow   #FCE184   surface-     │  │ │ primary │ │         │      ││
│  │              [edit]    tertiary,    │  │ └─────────┘ └─────────┘      ││
│  │                        accent       │  │                               ││
│  │                        [edit]       │  │ ┌─────────┐ ┌─────────┐      ││
│  │                                     │  │ │ Input   │ │ Badge   │      ││
│  │ warm-cloud   #FEF8E2   surface-     │  │ │         │ │         │      ││
│  │              [edit]    primary,     │  │ └─────────┘ └─────────┘      ││
│  │                        background   │  │                               ││
│  │                        [edit]       │  │ [Toggle: Light / Dark]       ││
│  │                                     │  │                               ││
│  │ black        #0F0E0C   content-     │  └───────────────────────────────┘│
│  │              [edit]    primary,     │                                   │
│  │                        edge-primary │                                   │
│  │                        [edit]       │                                   │
│  │                                     │                                   │
│  │ [+ Add Color]                       │                                   │
│  └─────────────────────────────────────┘                                   │
│                                                                             │
│  Changes are previewed live. To save:                                       │
│  [📋 Copy Save Prompt] ← AI will update CSS files and commit               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Features

- **Editable fields:** Color name, hex value, semantic token mappings
- **Live preview:** Right panel shows components updating in real-time
- **Mode toggle:** Switch between light/dark to verify both work
- **Prompt-based save:** Generates comprehensive prompt for AI to update CSS files

---

## 7. Theme Discovery

Themes are tracked in `radflow.config.js`, updated when themes are committed to GitHub:

```js
// radflow.config.js
export default {
  themes: [
    '@radflow/theme-rad-os',
    '@radflow/theme-phase',
    './packages/theme-local'  // Local dev themes
  ],
  activeTheme: '@radflow/theme-rad-os'
}
```

**Discovery flow:**
1. DevTools reads `radflow.config.js` on startup
2. Theme creation wizard adds new theme to config
3. Commit prompt includes updating `radflow.config.js`
4. GitHub is the source of truth for theme list

---

## 8. CSS Architecture

### Tailwind Integration (Option C: Separate CSS Files)

Each theme is a complete CSS package with its own `@theme` block:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@radflow/theme-rad-os";  /* Includes @theme block */
```

Theme switching = change the import line. This happens via:
1. DevTools writes to `globals.css` when theme switches
2. Next.js hot-reloads the CSS

### Theme CSS Structure

```css
/* @radflow/theme-rad-os/index.css */
@import "./tokens.css";
@import "./dark.css";
@import "./fonts.css";
@import "./typography.css";
@import "./base.css";
@import "./scrollbar.css";
@import "./animations.css";
```

```css
/* tokens.css */
@theme {
  /* Brand colors */
  --color-sun-yellow: #FCE184;
  --color-warm-cloud: #FEF8E2;
  --color-black: #0F0E0C;

  /* Semantic mappings */
  --color-surface-primary: var(--color-warm-cloud);
  --color-content-primary: var(--color-black);
  --color-edge-primary: var(--color-black);
  /* ... */
}
```

```css
/* dark.css */
.dark {
  --color-surface-primary: var(--color-black);
  --color-content-primary: var(--color-warm-cloud);
  /* ... */
}
```

---

## 9. Store Architecture

### 9.1 New `themeSlice`

```typescript
interface ThemeSlice {
  // Theme management
  activeThemeId: string;
  availableThemes: ThemeInfo[];

  // Actions
  setActiveTheme: (themeId: string) => void;
  addTheme: (theme: ThemeInfo) => void;
  removeTheme: (themeId: string) => void;
}

interface ThemeInfo {
  id: string;                    // e.g., "rad-os", "phase"
  name: string;                  // e.g., "RadOS", "Phase"
  author: string;
  authorOrg?: string;
  links?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  icon?: string;                 // Path to theme icon
  path: string;                  // e.g., "packages/theme-rad-os"
  isLocal: boolean;              // true if in packages/, false if in node_modules
}
```

### 9.2 State Scope

| State | Scope | Rationale |
|-------|-------|-----------|
| Panel position/width | Shared | UI preference, theme-independent |
| Active tab | Shared | Navigation state |
| Mock states | **Per-theme** | Different themes mock different app states |
| Search query | Shared | Transient UI state |
| Help mode on/off | Shared | UI mode |
| Text edit pending changes | Shared | Cross-cutting concern |
| Variables (colors, tokens) | **Per-theme** | Theme-specific |
| Typography | **Per-theme** | Theme-specific |
| Components | **Per-theme** | Theme-specific |
| Assets | **Per-theme** | Theme-specific |
| AI prompts | **Per-theme** | Theme-specific |

### 9.3 Slice Modification Approach

Add `activeThemeId` to store. Existing slices filter/scope by it:

```typescript
// Example: variablesSlice
interface VariablesSlice {
  // Data keyed by theme
  themeVariables: Record<ThemeId, VariablesData>;

  // Computed: current theme's variables
  get variables(): VariablesData;  // filters by activeThemeId

  // Actions scope to active theme
  setBaseColor: (color: BaseColor) => void;
  // ... internally uses activeThemeId
}
```

---

## 10. API Routes

### Current → New

| Current | New |
|---------|-----|
| `/api/devtools/read-css` | `/api/devtools/themes/[themeId]/read-css` |
| `/api/devtools/write-css` | `/api/devtools/themes/[themeId]/write-css` |
| `/api/devtools/components` | `/api/devtools/themes/[themeId]/components` |
| `/api/devtools/fonts` | `/api/devtools/themes/[themeId]/fonts` |
| `/api/devtools/icons` | `/api/devtools/themes/[themeId]/icons` |
| `/api/devtools/assets` | `/api/devtools/themes/[themeId]/assets` |
| (new) | `/api/devtools/themes` — list all themes |

### Write-Lock Enforcement

API routes enforce that only active theme can be written:

```typescript
// write-css/route.ts
export async function POST(req, { params }) {
  const { themeId } = params;
  const activeTheme = getActiveTheme(); // from config

  if (themeId !== activeTheme) {
    return Response.json(
      { error: 'Cannot write to non-active theme' },
      { status: 403 }
    );
  }

  // ... proceed with write
}
```

---

## 11. Component Targeting

Components use `data-theme` attribute for edit targeting. When a new theme is created, copied components must all be updated to match the theme:

```tsx
<Button
  data-edit-scope="component-definition"
  data-component="Button"
  data-theme="phase"  // Identifies which theme owns this component
/>
```

When editing:
1. DevTools reads `data-theme` to identify target
2. Verifies `data-theme` matches active theme (write-lock)
3. Writes to `packages/theme-{data-theme}/components/Button.tsx`

---

## 12. Tab Behavior with Themes

All tabs show the **active theme's data**:

| Tab | Shows |
|-----|-------|
| Variables | Active theme's tokens |
| Typography | Active theme's fonts/typography |
| Components | Active theme's component library (with subfolders as subtabs) |
| Assets | Active theme's icons/images |
| AI | Active theme's prompts + MJ styles |
| Mock States | Active theme's mock state presets |

Switching themes = all tabs refresh with new theme's data.

---

## 13. Default Mock States

Each new theme starts with these default mock states:

```typescript
const DEFAULT_MOCK_STATES = [
  { id: 'logged-out', name: 'Logged Out', description: 'User not authenticated' },
  { id: 'logged-in', name: 'Logged In', description: 'User authenticated' },
  { id: 'wallet-disconnected', name: 'Wallet Disconnected', description: 'No wallet connected' },
  { id: 'wallet-connected', name: 'Wallet Connected', description: 'Wallet connected' },
  { id: 'loading', name: 'Loading', description: 'Data is loading' },
  { id: 'premium', name: 'Premium User', description: 'User has premium subscription' },
  { id: 'free', name: 'Free User', description: 'User on free tier' },
  { id: 'admin', name: 'Admin', description: 'User has admin privileges' },
];
```

Themes can add/remove/customize these.

---

## 14. Fonts Policy

**Fonts are NOT distributed with themes.**

Rationale: Licensing restrictions (e.g., Mondwest is commercial).

### Theme Creation: Font Import Step

1. User uploads font files (.woff2, .ttf, etc.)
2. User provides download links (required)
3. Links are stored in theme metadata and README
4. Font files are placed in `public/fonts/`

### README Example (Auto-Generated)

```markdown
## Required Fonts

This theme uses fonts that must be downloaded separately:

| Font | Download Link |
|------|---------------|
| Mondwest | [Pangram Pangram](https://pangrampangram.com/products/bitmap-mondwest) |
| PixelCode | [Included - open source] |

After downloading, place font files in `public/fonts/`.
```

---

## 15. Build Process

Themes use **tsup** for components with CSS passthrough:

```
theme-phase/
├── src/
│   ├── components/
│   │   ├── core/
│   │   │   └── Button.tsx
│   │   ├── solarium/
│   │   │   └── SolariumCard.tsx
│   │   └── index.ts
│   └── index.ts
├── index.css        # Passed through (not processed)
├── tokens.css
├── dark.css
├── dist/            # Built components
├── tsup.config.ts
└── package.json
```

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/components/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  external: ['react', 'react-dom'],
})
```

---

## 16. Package.json Structure

```json
{
  "name": "@radflow/theme-phase",
  "version": "1.0.0",
  "description": "Phase theme for RadFlow",

  "exports": {
    ".": "./index.css",
    "./tokens": "./tokens.css",
    "./dark": "./dark.css",
    "./typography": "./typography.css",
    "./components": {
      "types": "./dist/components/index.d.ts",
      "import": "./dist/components/index.mjs",
      "require": "./dist/components/index.js"
    },
    "./components/core": {
      "types": "./dist/components/core/index.d.ts",
      "import": "./dist/components/core/index.mjs",
      "require": "./dist/components/core/index.js"
    },
    "./components/solarium": {
      "types": "./dist/components/solarium/index.d.ts",
      "import": "./dist/components/solarium/index.mjs",
      "require": "./dist/components/solarium/index.js"
    },
    "./components/*": {
      "types": "./dist/components/*.d.ts",
      "import": "./dist/components/*.mjs",
      "require": "./dist/components/*.js"
    }
  },

  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19"
  },

  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  },

  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },

  "radflow": {
    "type": "theme",
    "author": "Phase Labs",
    "icon": "./assets/icon.svg",
    "links": {
      "github": "https://github.com/phase-labs",
      "website": "https://phase.xyz"
    },
    "fonts": [
      {
        "name": "Mondwest",
        "url": "https://pangrampangram.com/products/bitmap-mondwest"
      }
    ]
  }
}
```

---

## 17. Publishing Workflow

Publishing uses a **prompt-based approach**:

1. Click "Export Theme" in Settings
2. System generates comprehensive prompt for clipboard
3. User pastes prompt to AI (Claude/Cursor)
4. AI:
   - Validates all required files present
   - Generates/updates README
   - Updates `radflow.config.js`
   - Creates commit message
   - Prepares PR to RadFlow GitHub
5. User reviews and submits PR

**Theme changes require approved PR to RadFlow GitHub repo.**

The final step of creating a theme is committing it to GitHub - until then, it's not "saved."

---

## 18. Updates to Related Plans

### devtools-tabs-v1.md

- [ ] Add: "All tabs show active theme's data"
- [ ] Add: "Tab content refreshes on theme switch"
- [ ] Update Components tab: "Subfolders become subtabs (core, solarium, auctions, etc.)"
- [ ] Update Assets tab: "Shows active theme's assets"
- [ ] Update AI tab: "Shows active theme's prompts/styles"
- [ ] Add: Token Editor full-page popup to Variables tab

### devtools-modes-v1.md

- [ ] Add: Settings cog at bottom of LeftRail
- [ ] Add: Theme quick-switcher in top bar
- [ ] Update LeftRail diagram
- [ ] Add: Component ID mode shows `data-theme` in overlay

---

## 19. Open Questions

### Q1: Theme Discovery Clarification

**Your question:** Wouldn't themes be imported from GitHub? The config file seems simplest as it will be updated when a new theme is committed to GH.

**Answer:** Yes, exactly. The flow is:

1. Themes live in the RadFlow GitHub repo (or forks)
2. `radflow.config.js` tracks which themes are installed
3. When you create a new theme, the commit prompt includes updating the config
4. Users install themes via npm (`npm install @radflow/theme-phase`)
5. After install, they add the theme to their project's `radflow.config.js`

The config file IS the discovery mechanism. DevTools reads it to know what themes are available. Perfect, we'll use the config file. 

### Q2: globals.css Hot-Swap Clarification

**Your question:** Why use Option A (file rewrite) for editing? Because it forces the AI to be smart?

**Answer:** Not quite. Here's the reasoning:

**Option A (File Rewrite)** is recommended because:
1. **Simplicity:** One source of truth (`globals.css` with one `@import`)
2. **Standard Tailwind:** Tailwind v4 expects a single `@theme` block
3. **Clean builds:** Production bundle only includes active theme
4. **DevTools already does file writes** for token/typography changes

The "hot-swap" works like this:
1. User clicks different theme in dropdown
2. DevTools writes to `globals.css`: changes `@import "@radflow/theme-rad-os"` to `@import "@radflow/theme-phase"`
3. Next.js hot-reloads the CSS
4. Page updates with new theme

The AI doesn't need to be "smart" here - this is a simple find-and-replace operation that DevTools does automatically. Great. let's make sure this is automatic (not prompt)

**For production apps:** They just import the one theme they use. No switching needed.

---

## 20. DevTools Theming

**DevTools itself is styled by the active theme.**

When you switch themes, the DevTools panel updates to use:
- Theme's colors for backgrounds, borders, accents
- Theme's typography (if applicable)
- Theme logo in the top bar indicator

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Theme: [☀️ | RadFlow]     [Breakpoint ▾]  [Position ▾]  [◐/◑]           │
│         ↑                                                                │
│         Theme logo + name as persistent indicator                        │
└──────────────────────────────────────────────────────────────────────────┘
```

This provides:
- Clear visual feedback of which theme is active
- Dogfooding the theme (see if colors work in a real UI)
- Immersive editing experience

---

## 21. Git-Based Preview Mode

All theme editing happens on a **branch**. Committing = merging to main.

### Workflow

```
1. User starts editing theme
   → DevTools auto-creates branch: `theme/rad-os/edit-{timestamp}`

2. All changes save to working files on this branch
   → CSS updates, component edits, asset additions

3. User reviews changes in DevTools
   → See diff, test components, verify both modes

4. User clicks "Commit Theme"
   → Prompt generates commit message
   → Branch merges to main (or creates PR)

5. To discard: delete the branch
   → Theme reverts to last committed state
```

### Benefits

- Safe experimentation (branch isolation)
- Easy rollback (delete branch)
- Natural PR workflow for team review
- Git history tracks all theme changes

---

## 22. Theme Versioning

Theme versions are **auto-generated from commits** using conventional commits.

### Commit Message → Version Bump

| Commit Prefix | Version Bump | Example |
|---------------|--------------|---------|
| `fix:` | Patch (0.0.x) | `fix: correct dark mode contrast` |
| `feat:` | Minor (0.x.0) | `feat: add ghost button variant` |
| `BREAKING CHANGE:` | Major (x.0.0) | `feat!: rename color tokens` |

### Tooling

Use `semantic-release` or similar in CI:

```yaml
# .github/workflows/release.yml
- uses: semantic-release/semantic-release
  with:
    branches: [main]
```

When theme changes merge to main:
1. CI analyzes commit messages
2. Determines version bump
3. Updates package.json
4. Publishes to npm
5. Creates GitHub release

---

## 23. Prompt Architecture

Prompts are organized in **separate sections**: RadFlow core prompts + theme-specific prompts.

### AI Tab Structure

```
┌─────────────────────────────────────────────────────────────┐
│ AI                                                           │
├─────────────────────────────────────────────────────────────┤
│ [RadFlow Prompts] [Theme Prompts] [Styles]                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ RADFLOW PROMPTS                                              │
│ Core prompts maintained by RadFlow team                      │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Create Component                                   [📋] │ │
│ │ Generate a new component following RadFlow patterns     │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Migrate to Semantic Tokens                         [📋] │ │
│ │ Update component to use semantic tokens                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ...                                                          │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│ [RadFlow Prompts] [Theme Prompts] [Styles]                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ THEME PROMPTS (RadOS)                                        │
│ Custom prompts for this theme                                │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ RadOS Pixel Art Style                              [📋] │ │
│ │ Apply retro pixel aesthetic to component                │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Add Solarium Animation                             [📋] │ │
│ │ Animate component with sun-themed motion                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [+ Add Custom Prompt]                                        │
└─────────────────────────────────────────────────────────────┘
```

### Storage

| Prompts | Location |
|---------|----------|
| RadFlow core | `@radflow/devtools/prompts/` or `@radflow/prompts` package |
| Theme-specific | `packages/theme-{name}/prompts/` |

---

## 24. Asset Updates (Post-Creation)

Assets can be added/updated after initial theme creation via **file system + prompt**.

### Workflow

1. **Add files to folder:**
   ```
   packages/theme-rad-os/assets/icons/new-icon.svg
   packages/theme-rad-os/assets/images/hero.png
   ```

2. **Open Assets tab in DevTools**
   - New files detected automatically
   - Shown with "New" badge

3. **Click "Register Assets" or use prompt:**
   ```
   [📋 Copy Asset Registration Prompt]
   ```

4. **AI updates necessary files:**
   - Icon index if applicable
   - Asset manifest
   - Commits changes

### Assets Tab Features

- Drag-drop upload (places in correct folder)
- Preview new assets
- Bulk registration
- Delete with confirmation

---

## 25. Component Conventions (Soft)

Themes have **recommended** component props, but not enforced.

### Recommended Props for Core Components

```typescript
// Button - recommended interface
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

// Card - recommended interface
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### Theme Flexibility

Themes CAN:
- Add extra variants (`variant: 'neon'`)
- Add theme-specific props (`pixelated?: boolean`)
- Omit variants that don't fit theme

Themes SHOULD:
- Keep core variants if possible (for cross-theme compatibility)
- Document deviations in theme README
- Use semantic tokens consistently

### Validation

DevTools shows warning (not error) if:
- Core component missing recommended prop
- Variant names differ from convention

---

## 26. Error Handling

When operations fail, DevTools shows a **modal with details**.

### Error Modal

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Theme Switch Failed                               [✕]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Could not switch to "Phase" theme.                          │
│                                                              │
│ Error: EACCES: permission denied, open                       │
│        'app/globals.css'                                     │
│                                                              │
│ Possible causes:                                             │
│ • File is locked by another process                         │
│ • Insufficient permissions                                   │
│ • File path has changed                                      │
│                                                              │
│ Current theme remains: RadOS                                 │
│                                                              │
│                              [Copy Error]  [Retry]  [Close]  │
└─────────────────────────────────────────────────────────────┘
```

### Error Types

| Operation | Error Handling |
|-----------|----------------|
| Theme switch | Modal, stay on current theme |
| CSS write | Modal, offer retry or manual fix prompt |
| Component save | Modal, preserve unsaved changes |
| Asset upload | Toast for minor, modal for critical |
| Git operations | Modal with git-specific guidance |

---

## 27. User Theming (Production Apps)

**Theming is developer-only.** End users see the theme the developer chose.

Production apps:
- Import ONE theme in `globals.css`
- No runtime theme switching for end users
- Theme is baked in at build time

```css
/* Production app - single theme */
@import "tailwindcss";
@import "@radflow/theme-phase";
```

If an app wants to offer user-facing theme switching in the future, that would be:
- A separate feature built by the app developer
- Not part of RadFlow DevTools scope
- Would require loading multiple themes (larger bundle)

---

## 28. Implementation Phases

### Phase 1: Foundation
- [ ] Add `themeSlice` to store
- [ ] Create `radflow.config.js` structure
- [ ] Update API routes to theme-scoped paths
- [ ] Add write-lock enforcement
- [ ] Set up git-based branching for edits

### Phase 2: UI
- [ ] Add Settings cog to LeftRail
- [ ] Add theme switcher to top bar (with logo/name)
- [ ] Make DevTools panel respect active theme's styling
- [ ] Create Theme Settings panel
- [ ] Create error modals

### Phase 3: Theme Wizard
- [ ] Create Theme Creation Wizard (steps 1-6)
- [ ] Font import with download links
- [ ] Icon library import with remap prompt
- [ ] Review step with component previews

### Phase 4: Token Editor
- [ ] Build full-page Token Editor popup
- [ ] Add live preview panel
- [ ] Add prompt generation for saves

### Phase 5: Component Subfolders
- [ ] Update component scanner to read subfolders
- [ ] Update Components tab to show subtabs per folder
- [ ] Add `data-theme` to all components
- [ ] Add soft convention warnings

### Phase 6: AI & Prompts
- [ ] Set up prompt storage (core + theme)
- [ ] Build AI tab with separate sections
- [ ] Create core prompt library
- [ ] Enable theme-specific prompt additions

### Phase 7: Publishing
- [ ] Set up semantic-release for versioning
- [ ] Create export prompt template
- [ ] Add README generation
- [ ] Test full create → branch → commit → PR flow

---

## Summary

| Decision | Choice |
|----------|--------|
| Package structure | Flat with component subfolders |
| Theme independence | Standalone (no inheritance) |
| Component imports | Theme-qualified (`@radflow/theme-x/components`) |
| Theme discovery | `radflow.config.js` |
| CSS architecture | Separate complete CSS per theme (Option C) |
| Build tool | tsup |
| globals.css | Single import, auto-rewritten on theme switch |
| Editing workflow | Git-based branching (branch = preview, merge = commit) |
| DevTools appearance | Styled by active theme |
| Theme indicator | Logo + name in top bar |
| Versioning | Auto from conventional commits |
| Prompts | Separate tabs (RadFlow core + theme-specific) |
| Asset updates | File system + prompt registration |
| Component contracts | Soft conventions (recommended, not enforced) |
| Error handling | Modal with details + retry |
| User theming | Developer-only (no runtime switching) |
