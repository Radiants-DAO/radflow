# DevTools Tabs - Implementation Plan

**Created:** 2026-01-10
**Status:** Planning
**Related:** devtools-modes-v1.md

---

## Overview

This document defines the tab structure for DevTools. The focus is on designer-friendly workflows with AI integration.

### Tab Structure

```
┌─────────────────────────────────────────────────────────────┐
│ RADTOOLS                                                    │
├──┬──┬──┬──┬──┬──┬──────────────────────────────────────────┤
│📊│🔤│🧩│📁│🤖│⚙️│                                           │
│ V│ T│ C│ A│AI│ M│                                           │
└──┴──┴──┴──┴──┴──┴──────────────────────────────────────────┘

V = Variables    (existing)
T = Typography   (existing)
C = Components   (existing)
A = Assets       (3 sub-tabs: Icons, Logos, Images)
AI = AI          (NEW - prompts, Midjourney styles)
M = Mock States  (existing)
```

---

## Assets Tab

### Sub-tabs

| Sub-tab | Purpose |
|---------|---------|
| **Icons** | Browse 143+ icons, copy as JSX |
| **Logos** | Brand logos with variants, copy/download |
| **Images** | Media library with upload |

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

### Sub-tabs

| Sub-tab | Purpose |
|---------|---------|
| **Prompts** | RadTools prompt templates for common tasks |
| **Styles** | Midjourney SREF codes with preview images |

---

### Prompts Sub-tab

**Purpose:** Pre-built prompts for AI-assisted design/dev workflows

**Categories:**

| Category | Example Prompts |
|----------|-----------------|
| **Components** | "Create a card with image, title, and CTA" |
| **Layout** | "Add a hero section with headline and signup form" |
| **Styling** | "Make this more retro/pixel-art styled" |
| **Refactoring** | "Convert this to use semantic tokens" |
| **Accessibility** | "Add proper ARIA labels to this form" |

**Features:**

| Feature | Description |
|---------|-------------|
| Copy button | Copy prompt to clipboard |
| Use button | Opens in AI chat (future) |
| Categories | Organized by task type |
| Custom prompts | Add your own templates |
| Search | Filter prompts |

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Search prompts...                                        │
├─────────────────────────────────────────────────────────────┤
│ COMPONENTS                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "Create a card component with image, title, and CTA    │ │
│ │  button that links to a detail page"                   │ │
│ │                                              [Copy] 📋  │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "Add a navigation bar with logo, links, and a CTA      │ │
│ │  button using the Button component"                    │ │
│ │                                              [Copy] 📋  │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ STYLING                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "Update this component to use semantic tokens instead  │ │
│ │  of hardcoded colors"                                  │ │
│ │                                              [Copy] 📋  │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ + Add Custom Prompt                                         │
└─────────────────────────────────────────────────────────────┘
```

**Prompt Data Structure:**
```typescript
interface PromptTemplate {
  id: string;
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
