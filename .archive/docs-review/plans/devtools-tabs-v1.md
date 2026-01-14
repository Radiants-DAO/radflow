# DevTools Tabs - Implementation Plan

**Created:** 2026-01-10
**Updated:** 2026-01-11
**Status:** Planning
**Related:** devtools-modes-v1.md, theme-architecture-plan-v3.md

---

## Overview

This document defines the tab structure for DevTools. The focus is on designer-friendly workflows with AI integration.

**Theme Context:** All tabs display data from the **active theme**. Switching themes refreshes all tab content. See `theme-architecture-plan-v3.md` for full theme architecture.

### Tab Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Theme: [☀️|RadOS]  [Breakpoint ▾]  [Position ▾]  [◐/◑]                      │
├──┬──┬──┬──┬──┬──┬───────────────────────────────────────────────────────────┤
│📊│🔤│🧩│📁│🤖│⚙️│                                                            │
│ V│ T│ C│ A│AI│ M│                                                            │
└──┴──┴──┴──┴──┴──┴───────────────────────────────────────────────────────────┘

V = Variables    (active theme's tokens)
T = Typography   (active theme's fonts/typography)
C = Components   (active theme's components - with subfolders as subtabs)
A = Assets       (active theme's icons, logos, images)
AI = AI          (RadFlow Prompts + Theme Prompts + Styles)
M = Mock States  (active theme's mock state presets)
```

### Theme Behavior

| Event | Tab Response |
|-------|--------------|
| Theme switch | All tabs refresh with new theme's data |
| Theme edit | Only active theme's files are modified |
| Non-active theme | Read-only (write-lock enforced) |

---

## Variables Tab

### Theme Context

Variables tab shows the **active theme's** color tokens, semantic mappings, shadows, and border radius.

### Token Editor (Full-Page Mode)

A full-page popup for comprehensive token editing with live preview.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOKEN EDITOR                                                         [✕]   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐  ┌───────────────────────────────┐│
│  │ BRAND COLORS                        │  │ PREVIEW                       ││
│  │                                     │  │                               ││
│  │ Name         Hex       Mappings     │  │ ┌─────────┐ ┌─────────┐      ││
│  │ ─────────────────────────────────── │  │ │ Button  │ │ Card    │      ││
│  │ sun-yellow   #FCE184   surface-     │  │ │         │ │         │      ││
│  │              [edit]    tertiary     │  │ └─────────┘ └─────────┘      ││
│  │                        [edit]       │  │                               ││
│  │                                     │  │ [Toggle: Light / Dark]       ││
│  │ [+ Add Color]                       │  └───────────────────────────────┘│
│  └─────────────────────────────────────┘                                   │
│                                                                             │
│  [📋 Copy Save Prompt] ← AI will update CSS files and commit               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Editable fields: Color name, hex value, semantic token mappings
- Live preview: Right panel shows components updating in real-time
- Mode toggle: Switch between light/dark to verify both work
- Prompt-based save: Generates comprehensive prompt for AI to update CSS files

---

## Components Tab

### Theme Context

Components tab shows the **active theme's** component library. Components are organized in subfolders that become subtabs.

### Subfolder → Subtab Mapping

```
Components Tab
├── [Core]         → /components/core/       (Button, Card, Input...)
├── [Solarium]     → /components/solarium/   (SolariumCard, SunDial...)
├── [Auctions]     → /components/auctions/   (AuctionBid, BidCard...)
└── [Rad Radio]    → /components/rad-radio/  (Player, TrackList...)
```

Each theme defines its own component folder structure. Subtabs are auto-discovered from subfolders.

### Component Display

Each component shows:
- Component name and source path
- `data-theme` attribute (identifies owning theme)
- Props table (type, required, default)
- Visual preview of variants
- Soft convention warnings if props differ from recommendations

---

## Assets Tab

### Theme Context

Assets tab shows the **active theme's** icons, logos, and images. Each theme has its own asset library.

### Asset Updates (Post-Creation)

New assets can be added after initial theme creation:
1. Drop files in `packages/theme-{name}/assets/`
2. Open Assets tab - new files shown with "New" badge
3. Click "Register Assets" or use prompt to commit

### Sub-tabs

| Sub-tab | Purpose |
|---------|---------|
| **Icons** | Browse theme's icon library, copy as JSX |
| **Logos** | Theme's brand logos with variants, copy/download |
| **Images** | Theme's media library with upload |

---

### Icons Sub-tab

**Purpose:** Browse and use the icon library

**Features:**

| Feature | Description |
|---------|-------------|
| Visual grid | Icons as clickable tiles |
| Size preview | Toggle 16/20/24/32px |
| Search | Filter by name |
| Click to copy | Copies `<Icon name="x" size={20} />` |
| Recently used | Last 5 icons at top |
| Hover preview | Larger preview + name |

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Search icons...                    Size: [16][20][24][32]│
├─────────────────────────────────────────────────────────────┤
│ RECENT                                                      │
│ [⬇️] [📋] [⚙️] [🔍] [✓]                                      │
├─────────────────────────────────────────────────────────────┤
│ ALL ICONS (143)                                             │
│ [icon] [icon] [icon] [icon] [icon] [icon] [icon] [icon]    │
│ [icon] [icon] [icon] [icon] [icon] [icon] [icon] [icon]    │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

**Copy output:**
```tsx
<Icon name="download" size={20} />
```

---

### Logos Sub-tab

**Purpose:** Brand logo variants with copy/download

**Logo Configurations:**
(From BrandAssetsApp reference)

| Variant | Colors | Background |
|---------|--------|------------|
| Wordmark | cream, black, yellow | black/cream |
| Mark | cream, black, yellow | black/cream |
| RadSun | cream, black, yellow | black/cream |

**Features:**

| Feature | Description |
|---------|-------------|
| Grid layout | 3x3 grid of logo variants |
| Background toggle | Light/dark preview |
| Copy SVG | Button to copy SVG code |
| Download | PNG and SVG download buttons |

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ LOGOS                                  Background: [◐] [◑] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │  [WORDMARK] │ │  [WORDMARK] │ │  [WORDMARK] │            │
│ │   cream     │ │    black    │ │   yellow    │            │
│ │  [📋] [↓]   │ │  [📋] [↓]   │ │  [📋] [↓]   │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │   [MARK]    │ │   [MARK]    │ │   [MARK]    │            │
│ │   cream     │ │    black    │ │   yellow    │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │  [RADSUN]   │ │  [RADSUN]   │ │  [RADSUN]   │            │
│ │   cream     │ │    black    │ │   yellow    │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

**No inline guidelines** - keep minimal per user feedback.

---

### Images Sub-tab

**Purpose:** Media library with upload and optimization

**Features:**

| Feature | Description |
|---------|-------------|
| Drag-drop upload | Drop zone for new images |
| Grid view | Thumbnails with metadata |
| Bulk optimize | Select multiple → optimize |
| File info | Dimensions, size, format |
| Delete | Remove unwanted images |

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │        Drag & drop images here or click to upload       │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ IMAGES (12)                              [Optimize Selected]│
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ [thumb] │ │ [thumb] │ │ [thumb] │ │ [thumb] │           │
│ │ hero.jpg│ │ bg.png  │ │ team.jpg│ │ prod.png│           │
│ │ 1.2MB   │ │ 340KB   │ │ 890KB   │ │ 120KB   │           │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## AI Tab (New Top-Level)

### Purpose

AI-powered workflows for designers. Includes prompt templates and Midjourney style references.

### Theme Context

- **RadFlow Prompts:** Core prompts maintained by RadFlow team (shared across all themes)
- **Theme Prompts:** Custom prompts specific to the active theme
- **Styles:** Midjourney SREF codes (theme-specific)

### Sub-tabs

| Sub-tab | Purpose | Source |
|---------|---------|--------|
| **RadFlow Prompts** | Core prompt templates for common tasks | `@radflow/devtools/prompts/` |
| **Theme Prompts** | Theme-specific prompt templates | `packages/theme-{name}/prompts/` |
| **Styles** | Midjourney SREF codes with preview images | Theme-specific |

---

### RadFlow Prompts Sub-tab

**Purpose:** Core prompts maintained by RadFlow team, available to all themes.

**Categories:**

| Category | Example Prompts |
|----------|-----------------|
| **Components** | "Create a card with image, title, and CTA" |
| **Layout** | "Add a hero section with headline and signup form" |
| **Styling** | "Convert this to use semantic tokens" |
| **Refactoring** | "Migrate component to new prop pattern" |
| **Accessibility** | "Add proper ARIA labels to this form" |

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [RadFlow Prompts] [Theme Prompts] [Styles]                  │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search prompts...                                        │
├─────────────────────────────────────────────────────────────┤
│ RADFLOW PROMPTS                                             │
│ Core prompts maintained by RadFlow team                     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Create Component                                   [📋] │ │
│ │ Generate a new component following RadFlow patterns     │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Migrate to Semantic Tokens                         [📋] │ │
│ │ Update component to use semantic tokens                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

---

### Theme Prompts Sub-tab

**Purpose:** Custom prompts specific to the active theme.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [RadFlow Prompts] [Theme Prompts] [Styles]                  │
├─────────────────────────────────────────────────────────────┤
│ THEME PROMPTS (RadOS)                                       │
│ Custom prompts for this theme                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ RadOS Pixel Art Style                              [📋] │ │
│ │ Apply retro pixel aesthetic to component                │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Add Solarium Animation                             [📋] │ │
│ │ Animate component with sun-themed motion                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [+ Add Custom Prompt]                                       │
└─────────────────────────────────────────────────────────────┘
```

**Features:**

| Feature | Description |
|---------|-------------|
| Copy button | Copy prompt to clipboard |
| Categories | Organized by task type |
| Custom prompts | Add theme-specific templates |
| Search | Filter prompts |

**Prompt Data Structure:**
```typescript
interface PromptTemplate {
  id: string;
  source: 'radflow' | 'theme';        // NEW: identifies prompt source
  themeId?: string;                    // NEW: for theme-specific prompts
  category: 'components' | 'layout' | 'styling' | 'refactoring' | 'accessibility' | 'custom';
  title: string;
  prompt: string;
  tags?: string[];
}
```

---

### Styles Sub-tab (Midjourney SREF)

**Purpose:** Brand-aligned Midjourney style references

**Source:** BrandAssetsApp SREF_CODES

**Current Codes:**

| Code | Preview Images |
|------|----------------|
| `--sref 2686106303 1335137003 --p 28kclbj` | 4 cowboy/portrait images |
| `--sref 1335137003 --p 28kclbj` | 4 bandana/product images |

**Features:**

| Feature | Description |
|---------|-------------|
| Code display | Full SREF code shown |
| Copy button | Copy code to clipboard |
| Image grid | 4 preview images per code |
| Expandable | Click to see full-size images |

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ MIDJOURNEY STYLE CODES                                      │
│                                                             │
│ Copy SREF codes to achieve the Radiants visual style.       │
│ Use --p codes to add personal spice to generations.         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ --sref 2686106303 1335137003 --p 28kclbj         [📋]  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │ │
│ │ │ [img] │ │ [img] │ │ [img] │ │ [img] │               │ │
│ │ └───────┘ └───────┘ └───────┘ └───────┘               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ --sref 1335137003 --p 28kclbj                    [📋]  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐               │ │
│ │ │ [img] │ │ [img] │ │ [img] │ │ [img] │               │ │
│ │ └───────┘ └───────┘ └───────┘ └───────┘               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**SREF Data Structure:**
```typescript
interface SrefCode {
  id: string;
  code: string;
  images: string[]; // 4 preview image paths
  description?: string;
}
```

---

## Implementation Notes

### File Structure

```
packages/devtools/src/tabs/
├── AssetsTab/
│   ├── index.tsx          # Main tab with sub-tab routing
│   ├── IconsSubTab.tsx    # Icons grid
│   ├── LogosSubTab.tsx    # Logos grid
│   └── ImagesSubTab.tsx   # Images with upload
├── AITab/
│   ├── index.tsx          # Main tab with sub-tab routing
│   ├── PromptsSubTab.tsx  # Prompt templates
│   └── StylesSubTab.tsx   # Midjourney SREF codes
```

### Data Files

```
packages/devtools/src/data/
├── prompts.ts             # Default prompt templates
└── srefCodes.ts           # Midjourney SREF codes (from BrandAssetsApp)
```

### Store Updates

```typescript
// New slice for AI tab
interface AISlice {
  customPrompts: PromptTemplate[];
  recentlyUsedPrompts: string[];
  addCustomPrompt: (prompt: PromptTemplate) => void;
  removeCustomPrompt: (id: string) => void;
}
```

---

## Migration from BrandAssetsApp

| BrandAssetsApp Tab | RadTools Location |
|--------------------|-------------------|
| Logos | Assets → Logos sub-tab |
| Colors | Variables tab (already exists) |
| Fonts | Typography tab (already exists) |
| AI Gen | AI → Styles sub-tab |

---

## Priority Order

1. **AI Tab - Prompts** - Highest value, enables AI workflows
2. **AI Tab - Styles** - Migrate SREF codes from BrandAssetsApp
3. **Assets - Icons** - Improve icon browsing/copying
4. **Assets - Logos** - Migrate from BrandAssetsApp
5. **Assets - Images** - Already partially implemented

---

## Questions Resolved

1. ~~Should AI be a sub-tab?~~ → No, separate top-level tab
2. ~~Icon copy format?~~ → Component JSX: `<Icon name="x" size={20} />`
3. ~~Logo guidelines inline?~~ → No, keep minimal
