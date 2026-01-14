# Assets Manager

## Purpose

The Assets Manager provides a browser for theme-owned visual assets: icons and logos. Assets are components with variants/names — click to copy for use in code or prompts.

**Assets Manager owns:**
- Icons (Icon component with `name` prop)
- Logos (Logo component with `variant` prop)
- Size configuration for both

**What it doesn't own:**
- Fonts (Typography Editor)
- Images (project-specific, use Finder)
- File organization (offload to native filesystem)

---

## Icons

### Icon as Component
Icons are a single component with each icon as a `name` option.

```tsx
<Icon name="search" />
<Icon name="home" />
<Icon name="settings" size="lg" />
```

### Icon Browser
Grid view of all available icons.

**Display:**
```
ICONS                              [Open in Finder]
─────────────────────────────────────────────────
Size: [16] [20] [24] [32]

┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│  🔍  │ │  🏠  │ │  ⚙️  │ │  👤  │ │  ✉️  │
│search│ │ home │ │ settings│ │ user │ │ mail │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### Size Options
Preview icons at different sizes.

**Size Selector:**
- Buttons to switch preview size (16, 20, 24, 32px)
- All icons re-render at selected size
- Shows how icons look at each scale

### Click to Copy
Single click copies the icon name.

**Behavior:**
- Click icon → copies `search` to clipboard
- Toast confirms: "Copied: search"
- Default size assumed

### Right-Click Context Menu
Right-click shows size options.

**Menu:**
```
┌─────────────────────┐
│ Copy "search"       │
├─────────────────────┤
│ sm (16px)          │
│ md (20px)       ✓  │
│ lg (24px)          │
│ xl (32px)          │
├─────────────────────┤
│ Edit sizes...       │
└─────────────────────┘
```

**Behavior:**
- Select size → copies `search` (size context for prompt)
- Edit sizes → opens size configuration panel

### Size Configuration
Define available sizes for icons.

**Panel:**
```
ICON SIZES
─────────────────────
sm:  [16] px
md:  [20] px  (default)
lg:  [24] px
xl:  [32] px

[+ Add Size]
```

**Behavior:**
- Edit pixel values
- Set default size
- Add/remove size options
- Changes persist to theme

### Search
Filter icons by name.

**Behavior:**
- Type to filter
- Matches icon names
- Real-time filtering

---

## Logos

### Logo as Component
Logos are a single component with visual variants.

```tsx
<Logo variant="wordmark" />
<Logo variant="logomark" />
<Logo variant="horizontal" />
<Logo variant="vertical" />
```

### Logo Browser
Display all logo variants.

**Display:**
```
LOGOS                              [Open in Finder]
─────────────────────────────────────────────────

┌─────────────────────────────────┐
│                                 │
│      RADFLOW                    │  wordmark
│                                 │
└─────────────────────────────────┘

┌──────────┐
│    ◉     │  logomark
└──────────┘

┌─────────────────────────────────┐
│   ◉  RADFLOW                    │  horizontal
└─────────────────────────────────┘

┌──────────┐
│    ◉     │
│ RADFLOW  │  vertical
└──────────┘
```

### Click to Copy
Single click copies the variant name.

**Behavior:**
- Click logo → copies `wordmark` to clipboard
- Toast confirms: "Copied: wordmark"

### Right-Click Context Menu
Right-click shows options.

**Menu:**
```
┌─────────────────────┐
│ Copy "wordmark"     │
├─────────────────────┤
│ View in Finder      │
│ Edit variant...     │
└─────────────────────┘
```

### Variant Management
Logo variants defined in theme.

**Variants vary by theme but typically include:**
- `wordmark` — Text only
- `logomark` — Icon/symbol only
- `horizontal` — Icon + text side by side
- `vertical` — Icon + text stacked

---

## Open in Finder

### Purpose
Offload file organization to native filesystem.

**Behavior:**
- Click "Open in Finder" button
- Opens theme's assets directory in native file browser
- User can add, rename, organize files there
- Assets Manager refreshes on focus return

### Why
- Native file management is better than building it
- Drag-and-drop already works in Finder
- Batch operations easier in native UI
- Keeps editor focused on design work

---

## Asset Ownership

### Theme-Owned
All assets belong to the active theme.

**Structure:**
```
@radflow/theme-example/
├── components/
│   ├── Icon.tsx       ← Icon component
│   └── Logo.tsx       ← Logo component
├── assets/
│   ├── icons/         ← SVG files
│   └── logos/         ← Logo files
└── ...
```

### Component Implementation
Icons and Logos are React components in theme.

**Icon Component Pattern:**
```tsx
// Icon.tsx
export default function Icon({ name, size = 'md' }) {
  // Renders SVG based on name
}
```

**Logo Component Pattern:**
```tsx
// Logo.tsx
export default function Logo({ variant = 'wordmark' }) {
  // Renders logo based on variant
}
```

---

## Persistence

### Size Configuration
Icon sizes save to theme configuration.

**Destination:**
- Theme manifest or dedicated config file
- Size scale persisted

### Asset Discovery
Icons and logos discovered from filesystem.

**Behavior:**
- Scan theme's assets directory
- Match SVG files to icon names
- Refresh on file changes

---

## Ideal Behaviors

### Fuzzy Search
Forgiving search that finds icons even with typos.

### Usage Tracking
Show which icons are used in the project. Identify unused icons.

### Quick Add
Drag SVG onto panel to add new icon. Auto-names from filename.

### Preview in Context
Show icon in a mini component preview (button, nav item, etc.)

---

## Research Notes

### Complexity Assessment
**Low** — Simple file browsing with standard UI patterns.

### Research Required

**Native File Operations**
- "Reveal in Finder" / "Show in Explorer" via Tauri
- File system watching for asset directory
- Drag-and-drop file handling

**Context Menu Implementation**
- Right-click context menus in Tauri
- Native vs web-based context menu styling
- Keyboard accessibility for context menus

**SVG Handling**
- SVG metadata extraction (viewBox, dimensions)
- SVG sprite generation (optional optimization)
- Icon component patterns (React)

### Search Terms
```
"tauri reveal in finder"
"tauri shell open"
"tauri context menu"
"react right click context menu"
"svg viewbox parsing"
"react icon component pattern"
```

### Rust Backend Integration

| Module | Purpose |
|--------|---------|
| File System | Scan asset directories, watch for changes |
| Shell Commands | Open Finder/Explorer at path |
| SVG Parser | Extract metadata from SVG files (optional) |

**Key Tauri APIs:**
- `tauri::api::shell::open` — Open file in default app
- `tauri::api::path` — Resolve asset paths

**Commands Needed:**
- `list_icons(theme_path)` → Icon names and metadata
- `list_logos(theme_path)` → Logo variants
- `reveal_in_finder(path)` → Open native file browser
- `get_icon_sizes(theme_path)` → Configured size scale

### Implementation Notes
- Asset discovery is file-based (scan directories)
- No database needed — filesystem is source of truth
- File watcher updates UI when assets added/removed

### Open Questions
- Support animated SVGs (Lottie)?
- Icon search: by filename only, or parse SVG content for keywords?
- Batch operations: rename multiple icons at once?
