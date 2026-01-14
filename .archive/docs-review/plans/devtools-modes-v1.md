# DevTools Modes - Implementation Plan

**Created:** 2026-01-10
**Updated:** 2026-01-11
**Status:** Planning
**Related:** devtools-tabs-v1.md, theme-architecture-plan-v3.md

---

## Overview

This document defines the focused feature sets for DevTools interactive modes. Each mode has a single purpose and clear scope.

| Mode | Scope | Purpose |
|------|-------|---------|
| **Help Mode** | DevTools panel | Explain how to use DevTools sections |
| **Component ID Mode** | Browser page | Identify components, open in DevTools |
| **Text Edit Mode** | Browser page | Collect text changes for AI |
| **Minimized Panel** | DevTools | Always-accessible tool sidebar |
| **Settings Panel** | DevTools | Theme management, global settings |

**Target Audience:** Figma-familiar designers (no complexity toggles)

---

## Theme Integration

**DevTools is styled by the active theme.** When you switch themes, the DevTools panel updates to use:
- Theme's colors for backgrounds, borders, accents
- Theme's typography (if applicable)
- Theme logo in the top bar indicator

This provides:
- Clear visual feedback of which theme is active
- Dogfooding the theme (see if colors work in a real UI)
- Immersive editing experience

---

## Keyboard Shortcuts

### Design Principles

1. **Modes are button-only** - No keyboard shortcuts for Component ID, Text Edit, or Help modes
2. **ESC exits all modes** - Universal escape hatch
3. **Avoid browser conflicts** - No Cmd+Shift+T (reopen tab), Cmd+Shift+I (devtools), Cmd+E (search bar)
4. **Avoid Claude in Chrome conflicts** - Keep shortcuts minimal and unique

### Final Shortcut Map

| Shortcut | Action | Notes |
|----------|--------|-------|
| `Cmd+Shift+K` | Toggle panel (minimized ↔ expanded) | Unique, low conflict risk |
| `1-5` | Switch tabs (when panel open) | Only active when panel focused |
| `ESC` | Exit current mode | Universal |

### Removed Shortcuts

| Old Shortcut | Reason Removed |
|--------------|----------------|
| `Cmd+Shift+T` | Conflicts with Chrome "Reopen closed tab" |
| `Cmd+Shift+I` | Conflicts with Chrome DevTools |
| `Cmd+Shift+?` | Unnecessary - button toggle sufficient |
| `Cmd+E` | Conflicts with Chrome address bar |

### Mode Activation

All modes are activated via **LeftRail buttons only**:

```
┌──┐
│🔍│  ← Click to toggle Component ID mode
│✏️│  ← Click to toggle Text Edit mode
│❓│  ← Click to toggle Help mode
├──┤
│📊│  ← Variables tab
│🔤│  ← Typography tab
│🧩│  ← Components tab
│📁│  ← Assets tab
│🤖│  ← AI tab
│⚙️│  ← Mock States tab
├──┤
│⚙️│  ← Settings (theme management, global settings)
└──┘
```

### Top Bar (Theme Indicator)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Theme: [☀️|RadOS ▾]   [Breakpoint ▾]  [Position ▾]  [◐/◑]               │
└──────────────────────────────────────────────────────────────────────────┘
         ↑
         Theme quick-switcher dropdown
         - Shows: Logo + Theme Name
         - Click to switch themes
         - Dropdown includes: Create Theme, Manage Themes
```

---

## 1. Minimized Panel State

### Rationale

Component ID Mode needs to open DevTools to show component details. A minimized state allows the panel to be "closed" while keeping tools accessible.

### Behavior

**When minimized:**
- Only LeftRail visible (slim vertical sidebar)
- All tools accessible (Component ID, Text Edit, Help)
- All tabs accessible (click expands panel)
- Theme indicator visible in slim top bar

**Layout:**
```
┌──────────────────┐
│ [☀️|RadOS]       │  ← Theme indicator (slim)
├──┬───────────────┘
│🔍│  ← Component ID tool
│✏️│  ← Text Edit tool
│❓│  ← Help tool
├──┤
│📊│  ← Variables tab (click → expand)
│🔤│  ← Typography tab
│🧩│  ← Components tab
│📁│  ← Assets tab
│🤖│  ← AI tab
│⚙️│  ← Mock States tab
├──┤
│⚙️│  ← Settings (click → expand to settings)
└──┘
```

### Keyboard

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+K` | Toggle minimized ↔ expanded |
| `ESC` | Minimize panel (if expanded) |

### Implementation

**Files to modify:**
- `DevToolsProvider.tsx` - Simplify keyboard handler
- `DevToolsPanel.tsx` - Conditional render based on state
- `store/slices/panelSlice.ts` - Add minimized state + toggle

**New state:**
```typescript
interface PanelSlice {
  isOpen: boolean;        // Panel visible at all
  isMinimized: boolean;   // Panel in slim mode
  // ...existing
}
```

---

## 2. Help Mode

### Purpose

Explain DevTools UI sections. Static info bar, not overlays.

### Scope

DevTools panel only (not browser page)

### Activation

- **Toggle:** Click Help button (❓) in LeftRail
- **Exit:** Click button again OR press ESC

### Display

Dark-themed info bar at top of panel (matches header style):

```
┌─────────────────────────────────────────────────────────────┐
│ ▓ COMPONENTS TAB                                            │
│   Browse UI components from @radflow/ui and /components.    │
│   Click any component to see variants and props.            │
└─────────────────────────────────────────────────────────────┘
```

### Behavior

1. Click Help button to toggle
2. Info bar appears at top of DevTools panel
3. Content updates based on active tab or hovered element
4. Normal navigation still works (not blocking)
5. ESC or click button again to exit

### Content Map

| Context | Title | Description |
|---------|-------|-------------|
| Variables tab | VARIABLES | Edit design tokens. Changes preview live. Click "Save to CSS" to persist. |
| Typography tab | TYPOGRAPHY | Manage fonts and base HTML typography. Changes save to globals.css. |
| Components tab | COMPONENTS | Browse available components. Click to see variants and props. |
| Assets tab | ASSETS | Browse icons, logos, and images. Click to copy or download. |
| AI tab | AI | Prompt templates and Midjourney style references. |
| Mock States tab | MOCK STATES | Simulate auth, wallet, and subscription states for testing. |
| Component ID tool hover | COMPONENT ID | Click any element on your page to identify its component. |
| Text Edit tool hover | TEXT EDIT | Click text to edit inline. Enter saves, Escape cancels. |
| Help tool hover | HELP | You are here. Hover over tabs and tools for info. |
| Resize handle hover | RESIZE | Drag to resize panel width. |

### Implementation

**Files to modify:**
- `components/HelpMode.tsx` - Replace tooltip with static bar
- `lib/helpRegistry.ts` - Update content structure
- `DevToolsPanel.tsx` - Add help bar to panel header area

**New registry structure:**
```typescript
interface HelpItem {
  title: string;      // Short uppercase title
  description: string; // One sentence explanation
}
```

---

## 3. Component ID Mode

### Purpose

Identify components on the page, open them in DevTools.

### Scope

Browser page only (not DevTools panel)

### Activation

- **Toggle:** Click Component ID button (🔍) in LeftRail
- **Exit:** Click button again OR press ESC

### Behavior

**Hover:**
- Blue outline on RadFlow components
- Floating label shows component name + source + theme

```
┌─────────────────┐
│ Button          │
│ @radflow/ui     │
│ theme: rad-os   │  ← Shows data-theme attribute
└─────────────────┘
```

The `data-theme` attribute identifies which theme owns the component. This is important for:
- Verifying you're editing the right theme's component
- Understanding component source when using multiple themes

**Click:**
- Opens DevTools (expands if minimized)
- Navigates to component in Components tab
- Component is highlighted/selected
- Auto-scrolls to component

**Right-click RadFlow component:**
- Context menu: "Open in Components tab"

**Right-click non-RadFlow element:**
- Context menu: "Extract to component..." (future feature)

### Click Actions

| Action | Result |
|--------|--------|
| Click | Open in Components tab (auto-scroll + highlight) |
| Right-click | Context menu |

### Implementation

**Files to modify:**
- `components/ComponentIdMode.tsx` - Add click handler, remove keyboard listener
- `store/slices/componentIdSlice.ts` - Add navigation action
- `store/slices/panelSlice.ts` - Add expandAndNavigate action

**New flow:**
```
Click component →
  panelSlice.expandPanel() →
  panelSlice.setActiveTab('components') →
  componentsSlice.selectComponent(name) →
  scroll into view + highlight
```

---

## 4. Text Edit Mode

### Current State (Complete)

Text Edit Mode is already well-implemented:

| Feature | Status |
|---------|--------|
| Click to edit text | ✅ |
| Enter commits change | ✅ |
| Escape reverts | ✅ |
| Clipboard format for AI | ✅ |
| Hover highlight | ✅ |

### Activation

- **Toggle:** Click Text Edit button (✏️) in LeftRail
- **Exit:** Click button again OR press ESC

### Enhancement: Change Count Badge

When text edit is active and changes exist, show badge on tool button:

```
┌──┐
│✏️│ 3  ← Badge shows pending change count
└──┘
```

### Implementation

**Files to modify:**
- `components/LeftRail.tsx` - Add badge to text edit button
- `DevToolsProvider.tsx` - Remove Cmd+Shift+T keyboard listener
- Read from `textEditSlice.pendingChanges.length`

---

## 5. Settings Panel (New)

### Purpose

Theme management and global DevTools settings. Accessed via Settings cog (⚙️) at bottom of LeftRail.

### Activation

- **Open:** Click Settings button (⚙️) at bottom of LeftRail
- **Close:** Click X or click outside panel

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ SETTINGS                                              [✕]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ THEME MANAGEMENT                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☀️ RadOS                                      ✓ Active  │ │
│ │    Author: Radiants                                     │ │
│ │    [GitHub] [Twitter]                      [Delete]     │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ 🌙 Phase                                                │ │
│ │    Author: Phase Labs                                   │ │
│ │    [GitHub]                    [Activate] [Delete]      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [+ Create New Theme]                                         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ EXPORT THEME                                                 │
│ [📋 Copy Export Prompt]                                      │
├─────────────────────────────────────────────────────────────┤
│ DEVTOOLS SETTINGS                                            │
│ Panel position: [Right ▾]                                   │
│ Default state: [Minimized ▾]                                │
└─────────────────────────────────────────────────────────────┘
```

### Features

| Feature | Description |
|---------|-------------|
| Theme list | All installed themes with active indicator |
| Activate | Switch to different theme |
| Delete | Remove theme (with confirmation) |
| Create | Opens Theme Creation Wizard |
| Export | Copy prompt for publishing theme |
| DevTools settings | Panel position, default state |

See `theme-architecture-plan-v3.md` for full Theme Creation Wizard flow.

---

## 6. Components Tab

### Decision: No Copy Buttons

**Rationale:** With AI agents, users describe intent rather than copy code.

- "Use the Button with secondary variant" → Agent generates JSX
- The value of Components tab is **reference**, not copying

### Keep Current Behavior

- Component name and source path
- `data-theme` attribute (identifies owning theme)
- Props table (type, required, default)
- Visual preview of variants
- Search functionality
- Soft convention warnings if props differ from recommendations

---

## Removed Features

### CommentsTab
- **Deleted:** 2026-01-10
- **Reason:** Stub code, no implementation planned

### ChangelogTab
- **Deleted:** 2026-01-10
- **Reason:** Stub code, not needed for current workflow

### Vault Documentation
- **Deleted:** 2026-01-10
- **Reason:** Outdated, replaced by in-code documentation

### Mode Keyboard Shortcuts
- **Removed:** 2026-01-10
- **Reason:** Conflict with browser/Claude in Chrome shortcuts
- **Replacement:** Button toggles in LeftRail

---

## Implementation Order

1. **Remove keyboard shortcuts for modes** - Clean up DevToolsProvider.tsx
2. **Minimized Panel State** - Foundation for Component ID click behavior
3. **Theme Infrastructure** - Add themeSlice, theme discovery, config parsing
4. **Top Bar + Theme Switcher** - Theme indicator with dropdown
5. **Settings Panel** - Theme management, create button
6. **DevTools Theme Styling** - Panel uses active theme's colors
7. **Help Mode Refactor** - Replace tooltip with static bar
8. **Component ID Click Handler** - Navigate to Components tab, show data-theme
9. **Text Edit Badge** - Show pending change count
10. **Theme Creation Wizard** - 6-step wizard (can be phased separately)

---

## File Changes Summary

| File | Changes |
|------|---------|
| `DevToolsProvider.tsx` | Remove mode shortcuts, keep only Cmd+Shift+K and ESC |
| `store/slices/panelSlice.ts` | Add `isMinimized`, `expandPanel()` |
| `store/slices/themeSlice.ts` | **NEW:** Theme management state |
| `DevToolsPanel.tsx` | Conditional render for minimized state, theme styling |
| `components/HelpMode.tsx` | Replace tooltip with static bar |
| `components/LeftRail.tsx` | Add badge support, Settings button at bottom |
| `components/TopBar.tsx` | **NEW:** Theme indicator with switcher dropdown |
| `components/SettingsPanel.tsx` | **NEW:** Theme management, DevTools settings |
| `components/ThemeCreationWizard.tsx` | **NEW:** 6-step theme wizard |
| `components/ComponentIdMode.tsx` | Add click → navigate, show `data-theme` in overlay |
| `lib/helpRegistry.ts` | Simplify to title + description |
| `lib/themeUtils.ts` | **NEW:** Theme discovery, switching utilities |

---

## Questions Resolved

1. ~~Copy import useful?~~ → No, removed
2. ~~Copy code useful?~~ → No, removed
3. ~~Help overlay style?~~ → Static bar in header
4. ~~Non-RadFlow elements?~~ → Right-click context menu (future)
5. ~~Mode keyboard shortcuts?~~ → Removed, button-only activation
6. ~~Default panel state?~~ → Minimized
7. ~~Component ID navigation?~~ → Auto-scroll + highlight
