# Search & Navigation

## Purpose

Search and Navigation systems enable rapid discovery and keyboard-driven workflows throughout the app. As a native Mac application, RadFlow uses system-standard shortcuts plus Figma-inspired spatial navigation.

**Key Principle:** Git is the save function. Cmd+S commits. No ambiguity about what "save" means.

---

## Search Systems

RadFlow has two distinct search interfaces.

### Content Search (Cmd+F)
Find and navigate to content.

**Searchable Content:**
- Components (by name, category)
- Pages (by name, route)
- Design tokens (by name, value)
- Icons (by name, tags)
- Docs (by title, content)
- Colors (by name, hex value)

**Behavior:**
- Opens search overlay
- Type to filter results
- Results categorized by type
- Arrow keys to navigate
- Enter to jump to result
- Escape to close

**Result Actions:**
- Navigate to item on canvas
- Spotlight/highlight result
- Expand section if collapsed
- Switch canvas section if needed

### Prompt Builder (Cmd+E)
Contextual command palette for AI prompts.

**Concept:**
Select element(s) → Cmd+E → contextual quick prompts → Enter to copy

**Behavior:**
- Opens based on current selection
- Shows relevant quick prompts for selected element type
- Progressive prompt building
- Enter copies built prompt to clipboard
- Integrates with Prompts tab library

**Context Examples:**
- Button selected → "Change variant", "Update colors", "Add hover state"
- Multiple components selected → "Apply to all", "Make consistent", "Update spacing"
- Token selected → "Generate scale", "Find usage", "Suggest alternatives"

**Prompt Building:**
- Start with context (selected elements)
- Add modifiers from quick prompts
- Preview final prompt
- Copy or send directly to AI

---

## Canvas Navigation

### Zoom
Figma-quality zoom behavior.

**Controls:**
- Pinch to zoom (trackpad) — smooth, precise
- Scroll wheel zoom
- Cmd++ / Cmd+- for step zoom
- Cmd+0 to fit all
- Cmd+1 to zoom to 100%

**Quality Bar:** Must feel as good as Figma. No lag, no jitter.

### Pan
Move around the canvas.

**Methods:**
- Two-finger drag (trackpad)
- Spacebar + drag
- Middle mouse drag
- Arrow keys (when nothing selected)

### Section Navigation
Jump between canvas sections.

**Floating Pill Nav:**
- Persistent floating control
- Shows section names/icons
- Click to snap to section
- Current section highlighted

**Keyboard:**
| Shortcut | Action |
|----------|--------|
| Cmd+1 | Snap to Components section |
| Cmd+2 | Snap to Pages section |
| Cmd+3 | Snap to Docs section |
| Cmd+4 | Snap to Violations section |

### Mini Map
Navigation aid for large canvases.

**Features:**
- Thumbnail of entire canvas
- Current viewport rectangle
- Click to jump
- Collapsible
- Section boundaries visible

---

## Edit Mode Navigation

### Entering Edit Mode
Open items for detailed editing.

**From Canvas:**
- Select page/component/doc
- Press **E** to enter edit mode
- Or double-click item

**Behavior:**
- Canvas transitions out
- Edit view opens
- Snapshot taken for discard option
- Original state preserved until commit

### Page Editor Tabs
Multiple pages can be open.

**Behavior:**
- Each open page is a tab
- Single canvas view (only one canvas)
- Multiple page editor tabs allowed
- Tab shows page name + modified indicator

### Exiting Edit Mode

| Shortcut | Action |
|----------|--------|
| Escape | Quick return to canvas (prompts if unsaved) |
| Cmd+S | Commit changes and return |
| Cmd+W | Close with "Commit or Discard?" prompt |

**Commit or Discard Dialog:**
- "You have unsaved changes to [Page Name]"
- [Commit] — saves to git, closes
- [Discard] — reverts to snapshot, closes
- [Cancel] — stays in editor

---

## Git as Save

### Core Concept
Every "save" is a git commit. No ambiguous local saves.

**Cmd+S Behavior:**
1. Stage changed files
2. Open commit message input (pre-filled with smart default)
3. Commit on Enter
4. Return to canvas

**Smart Commit Messages:**
- "Update Button primary variant colors"
- "Edit HomePage hero section"
- "Modify --color-primary token"

### Snapshot System
Preserve state for discard option.

**On Enter Edit Mode:**
- Snapshot current file state
- Store in memory (not git stash)
- Enable discard option

**On Discard:**
- Restore files to snapshot
- No git history created
- Clean return to canvas

*Note: Snapshot system needs separate detailed spec.*

---

## Keyboard Shortcuts

### Global (Always Active)

| Shortcut | Action |
|----------|--------|
| Cmd+F | Content search |
| Cmd+E | Prompt builder (contextual) |
| Cmd+, | Preferences |
| Cmd+Q | Quit (with warning if unsaved) |
| Cmd+Z | Undo |
| Cmd+Shift+Z | Redo |

### Canvas View

| Shortcut | Action |
|----------|--------|
| Cmd+1 | Snap to Components |
| Cmd+2 | Snap to Pages |
| Cmd+3 | Snap to Docs |
| Cmd+4 | Snap to Violations |
| E | Enter edit mode (with selection) |
| Cmd+0 | Zoom to fit |
| Cmd++ | Zoom in |
| Cmd+- | Zoom out |

### Edit Mode (Page/Component Editor)

| Shortcut | Action |
|----------|--------|
| Escape | Return to canvas |
| Cmd+S | Commit and close |
| Cmd+W | Close (commit/discard prompt) |
| T | Text edit mode |
| V | Select mode |
| I | Inspect mode |
| Cmd+Shift+I | Component ID mode |

### Function Keys
Mappable in preferences.

| Key | Default (Suggested) |
|-----|---------------------|
| F1 | Help / Documentation |
| F2 | Rename selected |
| F3 | Find next |
| F4 | — |
| F5 | Refresh preview |
| F6-F12 | User mappable |

---

## Figma-Style Shortcuts

Familiar shortcuts for designers.

### Selection & Tools

| Shortcut | Action |
|----------|--------|
| V | Select tool |
| T | Text tool / Text edit mode |
| I | Inspect mode |
| H | Hand tool (pan) |
| Z | Zoom tool |

### Object Manipulation

| Shortcut | Action |
|----------|--------|
| Cmd+D | Duplicate |
| Cmd+G | Group |
| Cmd+Shift+G | Ungroup |
| Cmd+] | Bring forward |
| Cmd+[ | Send backward |
| Cmd+Shift+] | Bring to front |
| Cmd+Shift+[ | Send to back |

### Zoom Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+0 | Zoom to fit |
| Cmd+1 | Zoom to 100% |
| Cmd+2 | Zoom to selection |
| Shift+1 | Zoom to Components |
| Shift+2 | Zoom to Pages |

---

## Window Management

### Single Canvas
Only one canvas view at a time.

**Behavior:**
- Opening project shows canvas
- Canvas cannot be duplicated
- Canvas is the "home" view

### Page Editor Tabs
Multiple editors in tabs.

**Behavior:**
- Cmd+T — (reserved, TBD)
- Cmd+W — Close current tab
- Cmd+Shift+W — Close all tabs
- Cmd+Tab — Next tab (within app)
- Ctrl+Tab — Next editor tab

### Window Controls
Standard Mac window behavior.

**Behavior:**
- Red (close) — Quit app (with warning)
- Yellow (minimize) — Minimize to dock
- Green (fullscreen) — Enter fullscreen
- No multi-window (single canvas constraint)

---

## Menu Bar

*Note: Full menu structure TBD once features finalized.*

### File Menu
- New... (TBD)
- Open Project...
- Open Recent →
- Close Tab (Cmd+W)
- Save / Commit (Cmd+S)
- Export Theme...

### Edit Menu
- Undo (Cmd+Z)
- Redo (Cmd+Shift+Z)
- Cut (Cmd+X)
- Copy (Cmd+C)
- Paste (Cmd+V)
- Select All (Cmd+A)

### View Menu
- Zoom In (Cmd++)
- Zoom Out (Cmd+-)
- Zoom to Fit (Cmd+0)
- Components Section (Cmd+1)
- Pages Section (Cmd+2)
- Docs Section (Cmd+3)
- Violations Section (Cmd+4)
- Enter Fullscreen

### Help Menu
- RadFlow Help
- Keyboard Shortcuts
- Release Notes
- Check for Updates...

---

## Preferences

### Keyboard Section
Customize shortcuts.

**Options:**
- View all shortcuts
- Search shortcuts
- Remap function keys
- Reset to defaults
- Import/export keybindings

### Vim Mode
Optional vim-style navigation.

**When Enabled:**
- j/k for up/down navigation
- h/l for left/right
- / for search
- : for command mode
- gg/G for top/bottom

**Scope:**
- Canvas navigation
- List navigation
- Panel navigation
- Not text editing (standard text input)

---

## Spotlight System

### Purpose
Draw attention to search results and navigation targets.

### Visual Treatment

**Spotlight Effect:**
- Target element highlighted
- Surrounding content dimmed (subtle)
- Outline or glow on target
- Smooth transition animation

### Triggers

**What Causes Spotlight:**
- Content search result selection
- Component ID click
- Cross-section navigation
- Error/violation indicator click

### Duration

**Behavior:**
- Automatic fade after 2 seconds
- Click anywhere dismisses
- New spotlight replaces old
- Persists while hovering target

---

## Navigation History

### Back/Forward
Navigate through recent locations.

**Behavior:**
- Cmd+[ — Go back
- Cmd+] — Go forward
- History tracks canvas position, section, selection
- History clears on project close

### Recent Items
Quick access to recently viewed.

**Behavior:**
- Shown in Content Search (Cmd+F)
- "Recent" section at top of results
- Clear recent option
- Persists across sessions

---

## Reserved / TBD

Shortcuts reserved for future features:

| Shortcut | Reserved For |
|----------|--------------|
| Cmd+N | New... (terminal window?) |
| Cmd+T | TBD |
| Cmd+P | TBD (print? publish?) |
| Cmd+R | TBD (refresh? run?) |

---

## Research Notes

### Complexity Assessment
**Medium-High** — Figma-quality zoom/pan and search indexing are substantial features.

### Research Required

**Content Search (Cmd+F)**

*Fuzzy Search*
- Fuzzy matching algorithms (Levenshtein, trigram)
- Search result ranking
- Tantivy search engine integration

*Search UX*
- Search overlay patterns (Spotlight, Alfred, Raycast)
- Result categorization and grouping
- Keyboard navigation in results

**Canvas Navigation**

*Figma-Quality Zoom/Pan*
- Smooth pinch-to-zoom implementation
- Momentum scrolling
- Zoom anchoring (zoom toward cursor)
- Performance optimization for large canvases

*Canvas Libraries*
- React-based canvas options (react-konva, fabric.js, custom)
- GPU-accelerated rendering
- Virtual rendering for large component counts

**Git Integration**

*Git as Save*
- git2-rs commit workflow
- Smart commit message generation
- Staging specific files
- Pre-commit hooks

*Snapshot System*
- In-memory file state snapshots
- Efficient diff for discard
- Multi-file snapshot management

**Keyboard Shortcuts**

*Native Mac Shortcuts*
- Tauri keyboard shortcut registration
- Global vs local shortcuts
- Menu bar integration

*Vim Mode*
- Vim keybinding libraries
- Mode state management
- Command parsing

### Search Terms
```
"tantivy fuzzy search rust"
"fuzzy search algorithm javascript"
"react infinite canvas zoom pan"
"pinch to zoom javascript"
"figma zoom implementation"
"canvas zoom toward cursor"
"git2-rs commit example"
"tauri keyboard shortcuts"
"vim keybindings javascript"
"raycast search ui"
```

### Rust Backend Integration

| Module | Purpose |
|--------|---------|
| Search Index | Tantivy-based full-text search |
| Git Module | Commit, status, diff operations |
| Snapshot Store | In-memory file state for discard |
| Keyboard | Global shortcut registration |

**Key Crates:**
- `tantivy` — Full-text search engine
- `git2` — Git operations
- `tauri` — Keyboard shortcut APIs

**Commands Needed:**
- `search(query)` → Ranked search results
- `index_project(path)` → Build search index
- `git_commit(message, files)` → Create commit
- `snapshot_create(files)` → Store current state
- `snapshot_restore(id)` → Restore to snapshot

### Technical Challenges
1. **Zoom Quality** — Must match Figma smoothness (60fps, no jank)
2. **Search Speed** — Results must appear as user types (<50ms)
3. **Git UX** — Commit flow must feel seamless, not like CLI

### Reference Implementations
- Figma (zoom/pan gold standard)
- Raycast/Alfred (search UI)
- VS Code (keyboard shortcuts, command palette)

### Open Questions
- Canvas library: use existing or build custom?
- Search: index on startup or incrementally?
- Vim mode: how complete? (basic navigation vs full vim)
