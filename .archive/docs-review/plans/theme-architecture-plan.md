# Theme Architecture Plan

## Overview

Design the multi-theme system for RadFlow DevTools where:
- Themes are top-level entities (above light/dark modes)
- Each theme is fully self-contained (components, styles, tokens)
- Themes are publishable as npm packages
- DevTools allows switching, creating, and editing themes

---

# CONSOLIDATED PLAN

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

**Key principles:**
- Only ONE theme is active at a time
- Non-active themes have a write-lock (cannot be edited)
- Modes (light/dark) are CSS-only swaps within a theme (no component code changes)
- Each theme has its own: components, assets, AI prompts, mock states
- Themes are standalone (no inheritance between themes)

---

## 2. DevTools UI Layout

### 2.1 Top Bar

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

### 2.2 LeftRail (Updated)

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

### 2.3 Theme Indicator (Top Bar Detail)

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

## 3. Theme Creation Wizard (AI-Assisted)

Located in Settings panel. Uses comprehensive prompts instead of complex UI programs.

### Wizard Flow:

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

Step 3: Icon Library
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

Step 4: Review Theme
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

Step 5: Confirmation Prompt
┌─────────────────────────────────────────────────────────────┐
│ THEME CREATED                                                │
│                                                              │
│ ✓ Theme "Phase" created successfully,                        │
│ ✓ Now set as active theme                                   │
│                                                              │
│ [📋 Copy Confirmation Prompt]                                │
│ ← Structured prompt to confirm theme is correct + commit
    to RadFlow repo to "save" it                               │
│                                                              │
│                                          [Done]              │
└─────────────────────────────────────────────────────────────┘
```

### What Gets Copied (Theme Duplication):

| Copied | Not Copied |
|--------|------------|
| ✅ All CSS files (tokens, dark, typography, etc.) | ❌ Font files (licensing) |
| ✅ All components from source theme | ❌ Asset files (icons, images) |
| ✅ package.json (with new name) | |
| ✅ Agent/skill files | |

**Icons:** User imports their own icon library during wizard, remapped via AI prompt.

**Fonts:** User must download separately + import during theme setup (e.g., Mondwest trial from Pangram Pangram).

---

## 4. Theme Settings Panel

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

## 5. Store Architecture

### 5.1 New `themeSlice`

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

### 5.2 State Scope

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

### 5.3 Slice Modification Approach

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

## 6. API Routes

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
  const activeTheme = getActiveTheme(); // from store or config

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

## 7. Component Targeting

Components use `data-theme` attribute for edit targeting, when a new theme is created, copied components much all be updated to match the theme:

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

## 8. Tab Behavior with Themes

All tabs show the **active theme's data**:

| Tab | Shows |
|-----|-------|
| Variables | Active theme's tokens |
| Typography | Active theme's fonts/typography |
| Components | Active theme's component library |
| Assets | Active theme's icons/images |
| AI | Active theme's prompts + MJ styles |
| Mock States | Active theme's mock state presets |

Switching themes = all tabs refresh with new theme's data.

---

## 9. Default Mock States

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

## 10. Fonts Policy

**Fonts are NOT distributed with themes.**

Rationale: Licensing restrictions (e.g., Mondwest is commercial).
When someone is importing fonts during the theme creation step, ask for releavant font links after file upload (Required). 

### Installation Instructions (Theme README):

```markdown
## Required Fonts

This theme uses fonts that must be downloaded separately:

1. **Mondwest** - Download trial from [Pangram Pangram](https://pangrampangram.com/products/bitmap-mondwest)
2. Place font files in `public/fonts/`
3. Theme will work once fonts are installed
```

Theme wizard generates these instructions.

---

## 11. Publishing Workflow

Publishing uses a **prompt-based approach** (not complex UI):

1. Click "Export Theme" in Settings
2. System generates comprehensive prompt for clipboard
3. User pastes prompt to AI (Claude/Cursor)
4. AI:
   - Validates all required files present
   - Generates/updates README
   - Creates commit message
   - Prepares PR to RadFlow GitHub
5. User reviews and submits PR

Theme changes require approved PR to RadFlow GitHub repo.
Last step of creating a theme is saving it to the RadFlow github.

---

## 12. Updates to Related Plans

### devtools-tabs-v1.md

- [ ] Add: "All tabs show active theme's data"
- [ ] Add: "Tab content refreshes on theme switch"
- [ ] Update Assets tab: "Shows active theme's assets"
- [ ] Update AI tab: "Shows active theme's prompts/styles"

### devtools-modes-v1.md

- [ ] Add: Settings cog at bottom of LeftRail
- [ ] Add: Theme quick-switcher in top bar
- [ ] Update LeftRail diagram
- [ ] Add: Component ID mode shows `data-theme` in overlay

---

# NEEDS INPUT

## NI-1: Theme Package Structure (Q1, Q8)

You mentioned themes need unique component libraries. Here are two options:

### Option A: Flat Package Structure

```
packages/
├── theme-rad-os/
│   ├── index.css
│   ├── tokens.css
│   ├── components/
│   │   ├── Button.tsx
│   │   └── ...
│   └── package.json
├── theme-phase/
│   ├── index.css
│   ├── components/
│   │   ├── Button.tsx      # Phase's Button
│   │   └── ...
│   └── package.json
```

**Imports:**
```tsx
import { Button } from '@radflow/theme-phase/components'
import { Button } from '@radflow/theme-rad-os/components'
```

### Option B: Separate UI + Theme Packages

```
packages/
├── theme-rad-os/          # CSS only
│   ├── index.css
│   └── tokens.css
├── ui-rad-os/             # Components for RadOS
│   └── components/
├── ui-solarium/           # Separate component set
│   └── components/
├── ui-auctions/           # Another component set
│   └── components/
```

**Imports:**
```tsx
import '@radflow/theme-rad-os'           // CSS
import { Button } from '@radflow/ui-rad-os'  // Components
import { AuctionCard } from '@radflow/ui-auctions'  // Add-on
```

**Question:** Which structure fits your vision of RadFlow having UI, Solarium, Auctions, Rad Radio as component sets that can be installed independently?
Option A if components can be organized into folders inside of /components (e.g. the "Components" tab maps to /components, and the subtabs of "components" maps to subfolders + displays the components inside of them)
---

## NI-2: Theme Extension vs Standalone (Q2)

You asked about tradeoffs for extend vs standalone:

### Option A: Fully Standalone

Each theme has complete copies of everything.

**Pros:**
- No dependency management
- Themes can diverge completely
- Simple mental model

**Cons:**
- Duplicate code across themes
- Bug fixes need to be applied to each theme
- Larger bundle sizes

### Option B: Extend Base (`@radflow/theme` provides skeleton)

Themes import base and override.

**Pros:**
- Shared bug fixes
- Smaller theme packages
- Consistent structure

**Cons:**
- Breaking changes in base affect all themes
- Less flexibility for radical departures
- Version coordination required

### Option C: Hybrid (Your Lean)

- Tokens: Themes define their own (no inheritance)
- Components: Shared base `@radflow/ui`, themes can extend or replace

**Pros:**
- Best of both worlds
- Core components are reusable
- Themes still have full control

**Cons:**
- More complex import story
- Need clear "override" pattern

**Recommendation:** Given you said themes are standalone (Q44) and each has its own components, I'd suggest **Option A (Standalone)** with the caveat that `@radflow/ui` remains a separate shared library that themes CAN import from but don't have to.

Great, that sounds good as @radflow/ui will be continously updated w/ compatible components. 

---

## NI-3: Component Import Pattern (Q12)

You said "theme-qualified import" but wanted tradeoffs:

### Option A: Theme-Qualified Import (Your Lean)

```tsx
import { Button } from '@radflow/theme-phase/components'
```

**Pros:**
- Explicit about source
- No magic/context needed
- Tree-shaking works well

**Cons:**
- Verbose imports
- Changing themes = updating all imports
- Can't easily switch themes at runtime

### Option B: Context-Based Import

```tsx
import { Button } from '@radflow/ui'
// ThemeProvider determines which Button renders

<ThemeProvider theme="phase">
  <Button /> {/* Renders Phase's Button */}
</ThemeProvider>
```

**Pros:**
- Clean imports
- Runtime theme switching
- Good for theme previews

**Cons:**
- Magic behavior
- Larger bundle (all themes' components loaded)
- Harder to tree-shake

### Option C: Aliased Imports (Build-Time)

```tsx
// In code:
import { Button } from '@theme/components'

// radflow.config.js:
export default {
  theme: 'phase'  // Build resolves @theme to @radflow/theme-phase
}
```

**Pros:**
- Clean imports
- Build-time resolution (good tree-shaking)
- Easy to switch themes

**Cons:**
- Requires build config
- IDE autocomplete may not work well

**Recommendation:** For your use case (one theme per project, explicit control), **Option A (Theme-Qualified)** is cleanest. The verbosity is a feature—it's explicit. 

I like Option A. 
---

## NI-4: Theme Discovery (Q14)

How should DevTools find installed themes?

### Option A: Scan `packages/theme-*/`

Only finds local themes in monorepo.

### Option B: Config File (`radflow.config.js`)

```js
export default {
  themes: [
    '@radflow/theme-rad-os',
    '@radflow/theme-phase',
    './themes/my-local-theme'
  ]
}
```

Explicit, works for npm + local.

### Option C: Scan `node_modules/@radflow/theme-*` + `packages/theme-*`

Auto-discovers both npm and local.

### Option D: Registry File (`themes.json`)

```json
{
  "themes": [
    { "id": "rad-os", "path": "packages/theme-rad-os" },
    { "id": "phase", "path": "node_modules/@radflow/theme-phase" }
  ]
}
```

Updated by CLI or DevTools.

**Recommendation:** **Option B or C**. Config file is more explicit but requires manual updates. Auto-scan is convenient but may find things you don't want.

For RadFlow (monorepo with npm publishing), I'd suggest **Option C** (auto-scan) with a config override for special cases.

Followup question: 

Wouldn't themes be imported from github? I feel like the config file seems simplest as it will be updated when a new theme is committed to GH (will be in the theme-commit prompt)

---

## NI-5: globals.css Role (Q28)

You said "hot-swapped per theme" but need to clarify:

### Option A: Theme Import Switcher

```css
/* app/globals.css */
@import "@radflow/theme-rad-os";  /* ← DevTools swaps this line */
```

When theme switches, DevTools rewrites the import.

**Pros:** Simple
**Cons:** Requires file write + reload

### Option B: CSS Variables at Runtime

All themes loaded, active theme's variables win via specificity:

```css
/* All themes loaded */
@import "@radflow/theme-rad-os";
@import "@radflow/theme-phase";

/* Active theme class on <html> */
html.theme-phase { /* Phase tokens override */ }
```

**Pros:** Instant switching, no file writes
**Cons:** Larger CSS bundle, potential conflicts

### Option C: Dynamic Import (Next.js)

```tsx
// layout.tsx
import dynamic from 'next/dynamic'

const ThemeCSS = dynamic(() =>
  import(`@radflow/theme-${activeTheme}/index.css`)
)
```

**Pros:** Only active theme loaded
**Cons:** Requires build support, flash of unstyled content

**Recommendation:** For editing (DevTools), use **Option A** (file rewrite). For production, use **Option C** or just import the one theme you use.
I'm a bit confused here. 

Why use option A for editing? bc then it forces the AI to be smart?

---

## NI-6: Tailwind @theme Integration (Q36)

Current Tailwind v4 uses `@theme` block for tokens. With multiple themes:

### Option A: Single Active @theme (Hot-Swap)

Only active theme's `@theme` block is in globals.css. Switching themes swaps the entire block.

```css
/* globals.css - written by DevTools based on active theme */
@theme {
  --color-surface-primary: var(--color-warm-cloud);
  /* ... Phase's tokens */
}
```

**Pros:** Clean, standard Tailwind
**Cons:** Requires file write + rebuild for theme switch

### Option B: Theme-Prefixed Tokens

All themes loaded, prefixed by theme name:

```css
@theme {
  --rad-os-color-surface-primary: ...;
  --phase-color-surface-primary: ...;

  /* Active theme's tokens mapped to canonical names */
  --color-surface-primary: var(--phase-color-surface-primary);
}
```

**Pros:** All themes available
**Cons:** Bloated CSS, complex variable management

### Option C: Separate CSS Files (No @theme Sharing)

Each theme has its own complete CSS. Project imports one:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@radflow/theme-phase";  /* Includes that theme's @theme block */
```

**Pros:** Clean separation
**Cons:** Theme switch requires import change

**Recommendation:** **Option A or C**. Since you said one theme at a time per project (Q37), there's no need to load multiple @theme blocks. Keep it simple—each theme is a complete CSS package.
Yes, let's use option C.

---

## NI-7: Build Process (Q41)

### Option A: CSS-Only (No Build)

Themes are just CSS files. Components live in `@radflow/ui` (separate).

```
theme-phase/
├── index.css      # Just import this
├── tokens.css
└── dark.css
```

**Pros:** Simplest, no build step
**Cons:** Components separate from theme

### Option B: tsup for Components, CSS Passthrough

Theme includes components, built with tsup:

```
theme-phase/
├── src/
│   ├── components/
│   │   └── Button.tsx
│   └── index.ts
├── index.css        # Passed through
├── dist/            # Built components
└── tsup.config.ts
```

**Pros:** Components bundled with theme
**Cons:** Build step required

### Option C: Full Build (TypeScript + CSS Processing)

Everything processed: TypeScript compiled, CSS optimized.

**Pros:** Production-ready output
**Cons:** Complex build, slower iteration

**Recommendation:** **Option B** if themes include components. Since you want each theme to have its own component set, tsup is the right choice—it's what `@radflow/ui` already uses.

let's use tsup!

---

## NI-8: package.json Structure (Q42)

Here's a complete theme package.json with explanations:

```json
{
  "name": "@radflow/theme-phase",
  "version": "1.0.0",
  "description": "Phase theme for RadFlow",

  "exports": {
    // Main entry - imports all CSS
    ".": "./index.css",

    // Individual CSS files for granular imports
    "./tokens": "./tokens.css",
    "./dark": "./dark.css",
    "./typography": "./typography.css",

    // Components (if theme includes them)
    "./components": {
      "types": "./dist/components/index.d.ts",
      "import": "./dist/components/index.mjs",
      "require": "./dist/components/index.js"
    },

    // Individual component imports for tree-shaking
    "./components/*": {
      "types": "./dist/components/*.d.ts",
      "import": "./dist/components/*.mjs",
      "require": "./dist/components/*.js"
    }
  },

  "peerDependencies": {
    // React for components
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

  // Theme metadata (custom field for DevTools)
  "radflow": {
    "type": "theme",
    "author": "Phase Labs",
    "icon": "./assets/icon.svg",
    "links": {
      "github": "https://github.com/phase-labs",
      "website": "https://phase.xyz"
    }
  }
}
```

**Key decisions:**
- `exports` map enables tree-shaking and granular imports
- `peerDependencies` keeps React external (user provides it)
- Custom `radflow` field stores theme metadata for DevTools discovery. 

This looks good. People will likely setup their own projects with create-next-app then import things from RadFlow

---

## NI-9: Testing Workflow (Q40)

You asked for context. Here's the scenario:

**Problem:** When you change `--color-surface-primary`, you want to see how that change affects ALL components using that token (Button, Card, Input, etc.) without manually navigating to each.


### Option A: Components Tab Live Preview

The Components tab shows all components with current token values. Change a token in Variables tab → Components tab previews update instantly.

```
┌─────────────────────────────────────────────────────────────┐
│ VARIABLES TAB                    │ COMPONENTS TAB           │
│                                  │                          │
│ surface-primary: [████] #FCE184  │ ┌──────┐ ┌──────┐       │
│        ↓ (change to #FF0000)     │ │Button│ │Card  │       │
│ surface-primary: [████] #FF0000  │ │ red! │ │ red! │       │
│                                  │ └──────┘ └──────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Option B: "Theme Preview" Mode

Dedicated mode that shows a gallery of all components with current theme applied. Single view for theme review.

### Option C: Use App Page as Preview

The actual app page reflects token changes in real-time. You see changes in context.

**Recommendation:** **Option C** is already how it works (preview mode injects CSS). For a more structured review, consider adding a "Component Gallery" page to the app that shows all components—not a DevTools feature, just a page.

I think this is a feature for the Variables tab, this feature should basically be a prompt-builder so that the right values are mapped. It should probably be a full-page popup with a similar view to what you have above for option A, except it should show the color name, its hex, and its mappings. The user should be able to change the hex, name, and mappings. changes to these will update a preview window on the right hand side (like option A). To actually "save" the edit, they will need to prompt AI. 
---

# QUESTIONS (Raw Answers Preserved Below)

---

## Related Plans

| Plan | Impact |
|------|--------|
| `devtools-tabs-v1.md` | Tabs (Variables, Typography, Components, Assets, AI, Mock States) assume single theme. Need to specify how each tab interacts with active theme. |
| `devtools-modes-v1.md` | Defines LeftRail structure. Theme switcher location must not conflict. May need modification to add theme indicator. |

### Changes Required to Other Plans

**After this plan is finalized:**

1. **devtools-tabs-v1.md** needs:
   - [ ] Clarify that Variables/Typography/Components tabs edit the active theme
   - [ ] Decide if Assets tab shows theme-specific or shared assets
   - [ ] Decide if AI tab prompts/styles are theme-specific

2. **devtools-modes-v1.md** needs:
   - [ ] Add theme indicator to LeftRail or top bar
   - [ ] Specify Component ID mode behavior when multiple themes have same component name

---

## Current Architecture Reference

**Store slices (10 total):**
- `panelSlice` - Panel UI state
- `variablesSlice` - Colors, semantic tokens, shadows
- `typographySlice` - Fonts, typography styles
- `componentsSlice` - Component discovery
- `assetsSlice` - Asset management
- `mockStatesSlice` - Mock data states
- `searchSlice` - Global search
- `textEditSlice` - Text editing mode
- `componentIdSlice` - Component ID overlay
- `helpSlice` - Help panel

**API routes:**
- `/api/devtools/read-css` - Reads `app/globals.css`
- `/api/devtools/write-css` - Writes to `app/globals.css`
- `/api/devtools/components` - Scans for components
- `/api/devtools/fonts` - Lists fonts
- `/api/devtools/icons` - Lists icons
- `/api/devtools/assets` - Asset management

**Current theme-rad-os structure:**
```
packages/theme-rad-os/
├── index.css        # Main entry (@import all)
├── tokens.css       # Brand + semantic tokens
├── dark.css         # .dark mode overrides
├── fonts.css        # @font-face declarations
├── typography.css   # @layer base typography
├── base.css         # Base HTML/body styles
├── scrollbar.css    # Scrollbar styling
├── animations.css   # @keyframes
├── package.json
└── agents/.claude/skills/rad-os-theme/SKILL.md
```

