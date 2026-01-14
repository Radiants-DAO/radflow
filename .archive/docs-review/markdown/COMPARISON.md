# RadTools → RadFlow: Comprehensive Comparison

This document details all significant changes between RadTools (former) and RadFlow (current).

---

## Executive Summary

RadFlow represents a **fundamental architectural shift** from a template-copying CLI tool to a **professional npm package monorepo**. The transformation includes:

- **257% increase** in icon library (40 → 143 icons)
- **5 new npm packages** via pnpm workspaces
- **19 new DevTools components** for advanced editing
- **5 new store slices** for state management
- **Complete removal** of Rad_os-specific components
- **New CLI commands** for updates and sync

---

## 1. Project Identity

| Aspect | RadTools (Old) | RadFlow (New) |
|--------|----------------|---------------|
| Version | 0.1.2 | 0.1.4 |
| Package Manager | npm | pnpm (monorepo) |
| Build System | Next.js only | Turbo + Next.js |
| Architecture | Single package | 5-package monorepo |

**New root config files:**
- `pnpm-workspace.yaml` - Monorepo workspace config
- `turbo.json` - Turbo build orchestration

---

## 2. Monorepo Packages (NEW)

RadFlow introduces 5 separate npm packages in `packages/`:

| Package | Purpose |
|---------|---------|
| `@radflow/cli` | CLI tooling |
| `@radflow/ui` | Component library |
| `@radflow/theme` | Base design tokens |
| `@radflow/theme-rad-os` | RadOS-specific theme |
| `@radflow/devtools` | DevTools provider & components |

**Benefits:**
- Independent versioning per package
- Tree-shaking at package boundaries
- Clear dependency separation
- Selective installation (theme-only, components+theme, or full devtools)

---

## 3. Component Library Changes

### Added Components (+3)
| Component | Purpose |
|-----------|---------|
| `Avatar.tsx` | User avatar display |
| `Skeleton.tsx` | Loading placeholder states |
| `Table.tsx` | Data table component |

### Removed Components (-3)
| Component | Reason |
|-----------|--------|
| `Rad_os/AppWindow.tsx` | RadOS-specific, moved to theme package |
| `Rad_os/MobileAppModal.tsx` | RadOS-specific, moved to theme package |
| `Rad_os/WindowTitleBar.tsx` | RadOS-specific, moved to theme package |

### Modified Components

**Button.tsx** - Added copy-to-clipboard functionality:
- New prop: `copyButton?: boolean`
- New prop: `onCopy?: () => Promise<void> | void`
- Added internal state management for copy feedback

---

## 4. DevTools Panel Changes

### New Components (+19)

**Editing System:**
| Component | Purpose |
|-----------|---------|
| `TextEditMode.tsx` | In-place text editing |
| `TextEditOverlay.tsx` | Text edit visual overlay |
| `TextEditConfirmDialog.tsx` | Confirm text changes |
| `TextEditContextMenu.tsx` | Right-click editing menu |

**Component Identification:**
| Component | Purpose |
|-----------|---------|
| `ComponentIdMode.tsx` | Component ID selection mode |
| `ComponentIdOverlay.tsx` | Shows component boundaries |
| `ComponentIdTooltip.tsx` | Component info on hover |
| `ComponentRenderer.tsx` | Dynamic component rendering |

**Help System:**
| Component | Purpose |
|-----------|---------|
| `HelpMode.tsx` | Help mode toggle |
| `HelpOverlay.tsx` | Help information overlay |
| `HelpTooltip.tsx` | Contextual help tooltips |

**Search & UI:**
| Component | Purpose |
|-----------|---------|
| `GlobalSearch.tsx` | Cross-tab search interface |
| `ExpandableSearch.tsx` | Collapsible search field |
| `StatusBar.tsx` | Status display bar |
| `ToolsPanel.tsx` | Tools sidebar panel |
| `FormFieldWrapper.tsx` | Form field styling wrapper |
| `CompoundShowcases.tsx` | Multi-component previews |

**Assets Tab Subtabs:**
| Component | Purpose |
|-----------|---------|
| `AIPromptsSubTab.tsx` | AI prompt templates |
| `BrandSubTab.tsx` | Brand assets management |
| `AssetCard.tsx` | Individual asset display |

**Variables Tab:**
| Component | Purpose |
|-----------|---------|
| `ShadowDisplay.tsx` | Box shadow visualization |

### Removed Components (-1)
| Component | Reason |
|-----------|--------|
| `DraggablePanel.tsx` | Functionality integrated elsewhere; `react-draggable` dependency removed |

### Preview Changes
- **Removed:** `previews/Rad_os.tsx` - RadOS-specific preview
- **Added:** `previews/ui.tsx` - General UI component preview

---

## 5. DevTools Store (Zustand)

### New Slices (+5)
| Slice | Purpose |
|-------|---------|
| `clipboardSlice.ts` | Copy/paste state |
| `componentIdSlice.ts` | Component selection state |
| `helpSlice.ts` | Help mode state |
| `statusSlice.ts` | Status bar messages |
| `textEditSlice.ts` | Text editing state |

### Existing Slices (unchanged)
- `assetsSlice.ts`
- `panelSlice.ts`
- `typographySlice.ts`
- `variablesSlice.ts`

---

## 6. DevTools Lib Utilities

### New Utilities (+6)
| Utility | Purpose |
|---------|---------|
| `componentRegistry.ts` | Component metadata registry |
| `componentTemplates.ts` | Component template definitions |
| `globalSearchIndex.ts` | Global search indexing |
| `searchIndex.ts` | Search functionality |
| `helpRegistry.ts` | Help content registry |
| `propValueResolver.ts` | Dynamic prop resolution |

### Existing Utilities (modified)
- `cssParser.ts` - Updated parsing logic

---

## 7. CLI Enhancements

### New Commands
| Command | Alias | Purpose |
|---------|-------|---------|
| `update` | `sync` | Sync to latest RadTools version |
| `outdated` | `status` | Check for available updates |

### New Update Options
```
--dry-run      Preview changes without modifying files
--components   Update only components/ui
--devtools     Update only devtools
--agents       Update only Claude agents/skills
```

### New CLI Files
- `src/cli/update.ts` - Update logic with version tracking
- `src/cli/outdated.ts` - Update checking

### Version Tracking
- Creates `.radtools-version` file to track installed version
- Enables selective category updates

---

## 8. API Routes

### New Routes (+3)
| Route | Purpose |
|-------|---------|
| `/api/devtools/assets/download-url` | Asset download URL generation |
| `/api/devtools/icons` | Icon listing and retrieval |
| `/api/devtools/components/folders` | Component folder management |

### Existing Routes (8)
- `/api/devtools/components`
- `/api/devtools/write-css`
- (others preserved)

---

## 9. Icon Library

**Massive expansion: 40 → 143 icons (+257%)**

### New Icon Categories

**Media/Audio (12):**
boombox, cd, cd-horizontal, record-player, tape, music-8th-notes, equalizer, block-equalizer, headphones, volume-faders, volume-high, volume-mute

**Playback Controls (10):**
play, pause, stop-playback, record-playback, skip-back, skip-forward, seek-back, seek-forward, eject, go-forward

**Finance (5):**
USDC, coins, money, trophy, trophy2

**System/Hardware (12):**
computer, hard-drive, usb, usb-icon, battery-full, battery-low, broken-battery, cell-bars, wifi, plug, electric, tv

**Communication (6):**
envelope-closed, envelope-open, microphone, microphone-mute, telephone, paper-plane

**Code/Development (6):**
code-file, code-folder, code-window, code-window-filled, comments-blank, comments-typing

**Charts (3):**
bar-chart, line-chart, pie-chart

**Security (2):**
lock-closed, lock-open

**Visibility (2):**
eye, eye-hidden

**Status/Alerts (4):**
info, info-filled, warning-filled, warning-filled-outline, warning-hollow, close-filled, question-filled

**Gaming (2):**
game-controller, joystick

**Cursors (7):**
cursor2, cursors1, cursor-text, crosshair1, crosshair2, crosshair2-retro, crosshair-3, crosshair4

**Media/Files (8):**
camera, film-camera, film-strip, film-strip-outline, document, document2, document-image, multiple-images

**Misc (20+):**
bomb, broadcast-dish, calendar, calendar2, clock, fire, globe, hand-point, heart, lightbulb, lightbulb2, list, pencil, print, reload, refresh1, refresh-filled, share, skull-and-crossbones, swap, underline, upload, zip-file, zip-file2, windows, window-error, picture-in-picture, full-screen, outline-box, cut, copied-to-clipboard, copy-to-clipboard, sort-descending, sort-filter-empty, sort-filter-filled, usericon, home2, power1, power2, save-2, minus

---

## 10. CSS/Styling Changes

### Font Sizing Strategy

**Old (RadTools):**
```css
body {
  font-size: clamp(1rem, 1vw, 1.125rem);
}
```

**New (RadFlow):**
```css
html {
  font-size: clamp(16px, 0.95rem + 0.25vw, 18px);
}
body {
  font-size: 1rem;
}
```

**Why:** Moved responsive sizing to `html` element for better proportional scaling of all rem-based values.

### Default Theme Colors

**Old:**
```css
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
}
```

**New:**
```css
body {
  background-color: var(--color-sun-yellow);
  color: var(--color-black);
}
```

**Why:** Shifted to explicit theme colors instead of semantic tokens for body defaults.

---

## 11. Documentation

### New Documentation Files
| File | Size | Purpose |
|------|------|---------|
| `ARCHITECTURE.md` | 23KB | Detailed architecture explanation |
| `MIGRATION.md` | 6KB | npm package migration guide |
| `CLAUDE.md` | 4KB | Claude AI development rules |

---

## 12. AI Agent Configuration

### Claude Configuration (NEW)
```
.claude/
├── skills/
│   ├── radtools/              # Main RadTools skill
│   ├── radtools-component-create/  # Component creation
│   └── radtools-figma-sync/   # Figma sync skill
├── agents/                    # Claude agents
└── settings.local.json        # Local settings
```

### Cursor Configuration (preserved)
```
.cursor/
├── skills/      # Cursor skills
├── rules/       # Cursor rules
└── debug.log    # Debug log
```

**Impact:** RadFlow now supports both Claude and Cursor editors with separate configurations.

---

## 13. Dependency Changes

### Removed
| Package | Reason |
|---------|--------|
| `react-draggable` | DraggablePanel removed |

### Added (implicit via monorepo)
- `pnpm` as package manager
- `turbo` for build orchestration

---

## 14. Template Changes

### New Template Directories
- `templates/.claude/` - Claude agents/skills for syncing

### Removed
- `templates/hooks/` - Removed (contained `useWindowManager.ts`)
- `templates/components/Rad_os/` - Moved to separate theme package

---

## 15. Summary Statistics

| Metric | RadTools | RadFlow | Delta |
|--------|----------|---------|-------|
| Version | 0.1.2 | 0.1.4 | +0.1.2 |
| Total Components | 28 | 27 | -1 |
| UI Components | 25 | 27 | +2 |
| Icons | 40 | 143 | +103 (+257%) |
| DevTools Components | 12 | 31 | +19 |
| Store Slices | 7 | 12 | +5 |
| Lib Utilities | 1 | 7 | +6 |
| CLI Commands | 1 | 3 | +2 |
| API Routes | 8 | 11 | +3 |
| Documentation Files | 1 | 5 | +4 |
| Monorepo Packages | 0 | 5 | +5 |

---

## 16. Breaking Changes

1. **Package Manager:** npm → pnpm (requires `pnpm install` instead of `npm install`)
2. **Rad_os Components Removed:** Projects using `AppWindow`, `MobileAppModal`, or `WindowTitleBar` must migrate to `@radflow/theme-rad-os` package
3. **DraggablePanel Removed:** Any custom implementations using this component need refactoring
4. **CSS Body Defaults:** Background/foreground now use explicit colors instead of semantic tokens

---

## 17. Migration Path

For existing RadTools users:

1. **Update package manager:** Install pnpm globally
2. **Install new version:** `pnpm install`
3. **Update imports:** If using Rad_os components, install `@radflow/theme-rad-os`
4. **Run sync:** `npx radtools update` to get latest templates
5. **Check CSS:** Verify body background/color works with new defaults

---

*Generated: January 2026*
*Comparing: RadTools 0.1.2 → RadFlow 0.1.4*
