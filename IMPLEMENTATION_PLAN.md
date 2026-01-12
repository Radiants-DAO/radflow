# RadTools Implementation Plan

> **Generated:** 2026-01-11
> **Source:** `.plans/` specifications (theme-architecture-plan-v3.md, devtools-tabs-v1.md, devtools-modes-v1.md)

## Overview

This plan tracks implementation of the multi-theme RadFlow architecture. Tasks are organized by feature area and dependency chain. Foundation work (Phase 1) must complete before UI features can proceed.

**Current Status:** Core DevTools functional with Variables, Typography, Components, Assets, and Mock States tabs. Recent cleanup removed 27 stub files. Missing: AI Tab, Theme Management system, and mode refinements.

---

## Phase 1: Foundation (Theme Architecture)

**Priority:** CRITICAL - Blocks all multi-theme features
**Dependencies:** None
**Source:** `.plans/theme-architecture-plan-v3.md`
**Iterations:** 12-18 total

### 1.1 Theme Store Slice (~2 iterations)
- [x] Create `packages/devtools/src/store/slices/themeSlice.ts`
  - `activeTheme: string` (currently active theme ID)
  - `availableThemes: Theme[]` (discovered themes)
  - `switchTheme(themeId: string)` action
  - `addTheme(config: ThemeConfig)` action
  - `deleteTheme(themeId: string)` action
  - `writeLockedThemes: string[]` (non-active themes are read-only)
  - Integrated into main store with persistence

### 1.2 Theme Config Structure (~2 iterations)
- [x] Create `packages/devtools/src/lib/themeConfig.ts`
  - Define `ThemeConfig` interface (name, id, version, packageName, cssFiles, componentFolders, assets, prompts)
  - Parse theme package.json files (`parseThemePackage()`)
  - Validate theme structure (`validateThemeConfig()`)
  - Utility functions: `themeConfigToTheme()`, `isThemePackage()`, `extractThemeId()`, `formatThemeName()`

### 1.3 Theme-Scoped API Routes (~5 iterations)
- [ ] Update `/api/devtools/read-css` → `/api/devtools/themes/[themeId]/read-css`
- [ ] Update `/api/devtools/write-css` → `/api/devtools/themes/[themeId]/write-css`
- [ ] Update `/api/devtools/parse-css` → `/api/devtools/themes/[themeId]/parse-css`
- [ ] Add write-lock enforcement (reject writes to non-active themes)
- [ ] Add theme discovery API: `/api/devtools/themes/list`

### 1.4 CSS Import Architecture (~3 iterations)
- [ ] Update `app/globals.css` to support dynamic theme import
  - Current: `@import "@radflow/theme-rad-os";`
  - Goal: DevTools can rewrite import line to switch themes
- [ ] Create utility: `switchThemeImport(themePackageName: string)` in `packages/devtools/src/lib/themeUtils.ts`
- [ ] Implement hot-reload verification after theme switch

### 1.5 Component Theme Targeting (~3 iterations)
- [ ] Add `data-theme` attribute support to component scanner
- [ ] Update component discovery to group by theme
- [ ] Filter component list by active theme in Components tab

**Completion Criteria:**
- Theme store slice exists and functional
- API routes are theme-scoped with write-lock enforcement
- Theme switching updates CSS import and reloads page
- Components display `data-theme` attribute

---

## Phase 2: DevTools UI (Theme Management)

**Priority:** HIGH - Enables theme switching and configuration
**Dependencies:** Phase 1 (themeSlice, API routes)
**Source:** `.plans/devtools-modes-v1.md` (lines 336-390)
**Iterations:** 10-15 total

### 2.1 Settings Panel (~3 iterations)
- [ ] Create `packages/devtools/src/components/SettingsPanel.tsx`
  - Modal overlay with settings sections
  - Theme Management section: List themes, switch active theme, delete theme button
  - DevTools Settings section: Panel position, default tab, keyboard shortcuts reference
  - Styling: Use semantic tokens, match panel theme

### 2.2 Settings Button (LeftRail) (~1 iteration)
- [ ] Add Settings button (⚙️) to bottom of LeftRail
- [ ] Connect to `openSettings()` action in panelSlice
- [ ] Update `packages/devtools/src/components/LeftRail.tsx`

### 2.3 Top Bar (Theme Indicator) (~2 iterations)
- [ ] Create `packages/devtools/src/components/TopBar.tsx`
  - Display active theme name and logo
  - Quick theme dropdown (click to expand list of themes)
  - Settings button shortcut
- [ ] Add to DevToolsPanel header area

### 2.4 Theme Switcher Dropdown (~3 iterations)
- [ ] Create `packages/devtools/src/components/ThemeSwitcher.tsx`
  - Dropdown listing `availableThemes` from store
  - Click to switch theme (calls `switchTheme()`)
  - Shows active theme with checkmark
  - Visual preview: theme logo + primary color swatch

### 2.5 DevTools Theme Styling (~2 iterations)
- [ ] Update `packages/devtools/src/DevToolsPanel.tsx` to apply active theme's CSS
- [ ] Ensure panel background, text colors, and UI components use semantic tokens
- [ ] Test with rad-os theme (verify yellow/cream/black palette applies)

**Completion Criteria:**
- Settings button accessible in LeftRail
- Settings panel opens with theme management section
- Theme switcher functional (switches CSS import and reloads)
- DevTools styled by active theme

---

## Phase 3: Theme Creation Wizard

**Priority:** MEDIUM - Enables creating new themes
**Dependencies:** Phase 1 (themeSlice, API routes), Phase 2 (Settings Panel)
**Source:** `.plans/theme-architecture-plan-v3.md` (Phase 3)
**Iterations:** 15-20 total

### 3.1 Wizard Component (~2 iterations)
- [ ] Create `packages/devtools/src/components/ThemeCreationWizard.tsx`
  - Multi-step modal (6 steps)
  - Navigation: Back, Next, Cancel buttons
  - Progress indicator (Step 1/6)

### 3.2 Wizard Steps (~10 iterations, ~2 per step)
- [ ] **Step 1: Basic Info**
  - Theme name, ID (auto-slugified), description
  - Package name (e.g., `@radflow/theme-phase`)
- [ ] **Step 2: Colors**
  - Base colors: Primary, secondary, accent
  - Upload brand palette or pick from presets
- [ ] **Step 3: Fonts**
  - Upload custom fonts or select from Google Fonts
  - Define typography scale (h1-h6, body, caption)
- [ ] **Step 4: Icons**
  - Upload icon set or use default
  - Preview icons in grid
- [ ] **Step 5: Preview**
  - Live preview of theme applied to sample UI
  - Show Variables, Typography, Components tabs
- [ ] **Step 6: Confirmation**
  - Summary of theme config
  - "Create Theme" button → calls API to scaffold theme files

### 3.3 Theme Scaffolding API (~4 iterations)
- [ ] Create `/api/devtools/themes/create` endpoint
  - Accept `ThemeConfig` from wizard
  - Generate folder structure: `packages/theme-[id]/`
  - Write CSS files: `tokens.css`, `dark.css`, `typography.css`, `fonts.css`
  - Write package.json with theme metadata
  - Create empty `components/`, `assets/`, `agents/` folders
  - Add theme to `availableThemes` in store

### 3.4 Launch Wizard from Settings (~1 iteration)
- [ ] Add "Create New Theme" button in Settings Panel
- [ ] Opens ThemeCreationWizard modal

**Completion Criteria:**
- Wizard accessible from Settings Panel
- All 6 steps functional with form validation
- New theme scaffolded in `packages/theme-[id]/`
- Theme appears in theme switcher dropdown

---

## Phase 4: Token Editor (Variables Tab)

**Priority:** MEDIUM - Improves Variables tab workflow
**Dependencies:** Phase 1 (theme-scoped API routes)
**Source:** `.plans/devtools-tabs-v1.md` (lines 36-69)
**Iterations:** 12-16 total

### 4.1 Full-Page Token Editor Modal (~2 iterations)
- [ ] Create `packages/devtools/src/components/TokenEditor.tsx`
  - Full-screen modal overlay
  - Split panel: Editor (left) + Live Preview (right)
  - Close button (X) and Cancel/Save buttons

### 4.2 Editor Panel (Left) (~4 iterations)
- [ ] Token list with search/filter
- [ ] Editable fields per token:
  - Token name (semantic name, e.g., `bg-surface-primary`)
  - Hex value (color picker)
  - Mapped base color (dropdown)
  - Description (optional)
- [ ] Add/Remove token buttons
- [ ] Light/Dark mode toggle (switches preview between modes)

### 4.3 Live Preview Panel (Right) (~3 iterations)
- [ ] Render sample UI components using edited tokens
- [ ] Show: Buttons, Cards, Inputs, Typography
- [ ] Real-time updates as tokens change
- [ ] Mode toggle updates preview immediately

### 4.4 Prompt-Based Save (~3 iterations)
- [ ] "Save to CSS" button opens prompt modal
- [ ] User describes changes (e.g., "Updated primary button color to match brand")
- [ ] AI reads prompt + token diff, updates `globals.css` @theme block
- [ ] Commits changes with user's description
- [ ] Close editor and refresh Variables tab

### 4.5 Launch from Variables Tab (~1 iteration)
- [ ] Add "Edit Tokens" button in Variables tab header
- [ ] Opens TokenEditor modal

**Completion Criteria:**
- Token editor accessible from Variables tab
- Live preview functional with real-time updates
- Prompt-based save writes to active theme's CSS
- Light/dark mode toggle works in preview

---

## Phase 5: Component Subfolders

**Priority:** LOW - Organizational improvement
**Dependencies:** Phase 1 (data-theme attributes, theme-scoped components)
**Source:** `.plans/theme-architecture-plan-v3.md` (Phase 5)
**Iterations:** 6-9 total

### 5.1 Component Subfolder Discovery (~3 iterations)
- [ ] Update component scanner in `packages/devtools/src/lib/componentScanner.ts`
- [ ] Detect subfolders in `packages/theme-[id]/components/`
  - Example: `components/core/`, `components/solarium/`, `components/auctions/`
- [ ] Group components by folder in store

### 5.2 Dynamic Subtabs in Components Tab (~3 iterations)
- [ ] Create `packages/devtools/src/tabs/ComponentsTab/DynamicFolderTab.tsx` (if not exists)
- [ ] Auto-generate subtabs for each discovered folder
  - Example: [Core] subtab shows `components/core/*` components
  - Example: [Solarium] subtab shows `components/solarium/*` components
- [ ] Update Components tab to render folder subtabs

### 5.3 Component Metadata Display (~2 iterations)
- [ ] Show `data-theme` attribute in component card
- [ ] Show source path (folder + file)
- [ ] Add folder name to component props table

**Completion Criteria:**
- Component scanner detects subfolders
- Components tab displays folder-based subtabs
- Each subtab shows components from that folder
- Component cards show folder and theme metadata

---

## Phase 6: AI Tab

**Priority:** HIGH - Major missing feature
**Dependencies:** Phase 1 (theme-scoped data)
**Source:** `.plans/devtools-tabs-v1.md` (lines 250-416)
**Iterations:** 15-20 total

### 6.1 AI Store Slice (~2 iterations)
- [ ] Create `packages/devtools/src/store/slices/aiSlice.ts`
  - `radflowPrompts: PromptTemplate[]` (core prompts)
  - `themePrompts: PromptTemplate[]` (per-theme custom prompts)
  - `srefCodes: SrefCode[]` (Midjourney style codes)
  - `addCustomPrompt(prompt: PromptTemplate)` action
  - `removeCustomPrompt(id: string)` action
  - `recentlyUsedPrompts: string[]` (last 5 prompt IDs)

### 6.2 AI Tab Main Component (~2 iterations)
- [ ] Create `packages/devtools/src/tabs/AITab/index.tsx`
  - Sub-tabs: [RadFlow Prompts], [Theme Prompts], [Styles]
  - Search bar (filters across all sub-tabs)
  - Tab indicator shows count (e.g., "RadFlow Prompts (12)")

### 6.3 RadFlow Prompts Sub-Tab (~3 iterations)
- [ ] Create `packages/devtools/src/tabs/AITab/PromptsSubTab.tsx`
- [ ] Display core prompt templates (read from `packages/devtools/src/data/prompts.ts`)
- [ ] Grouped by category: Components, Layout, Styling, Refactoring, Accessibility
- [ ] Each prompt card:
  - Title, category tag, prompt text (expandable)
  - Copy button (📋) - copies prompt to clipboard
  - Tags (optional) for filtering
- [ ] Search/filter by title, category, tags

### 6.4 Theme Prompts Sub-Tab (~3 iterations)
- [ ] Create `packages/devtools/src/tabs/AITab/ThemePromptsSubTab.tsx`
- [ ] Display custom prompts for active theme (from `themePrompts` in store)
- [ ] "Add Custom Prompt" button opens modal
  - Fields: Title, Category, Prompt text, Tags
  - Save adds to theme-specific prompts
- [ ] Each prompt card has Edit and Delete buttons
- [ ] Prompts stored per theme (not shared across themes)

### 6.5 Styles Sub-Tab (Midjourney SREF) (~3 iterations)
- [ ] Create `packages/devtools/src/tabs/AITab/StylesSubTab.tsx`
- [ ] Display SREF codes (read from `packages/devtools/src/data/srefCodes.ts`)
- [ ] Each SREF card:
  - SREF code (e.g., `--sref 1234567890`)
  - 4 preview images in 2x2 grid
  - Copy button - copies code to clipboard
  - Expand button - shows full-size images in modal
- [ ] Search/filter by code or description

### 6.6 Data Files (~2 iterations)
- [ ] Create `packages/devtools/src/data/prompts.ts`
  - Export `radflowPrompts: PromptTemplate[]` (12-15 core prompts)
- [ ] Create `packages/devtools/src/data/srefCodes.ts`
  - Export `srefCodes: SrefCode[]` (8-10 brand-aligned codes)
  - Include preview image URLs

### 6.7 Add AI Tab to LeftRail (~1 iteration)
- [ ] Update `packages/devtools/src/components/LeftRail.tsx`
- [ ] Add AI button (🤖) between Assets and Mock States
- [ ] Wire to `setActiveTab('ai')` action

**Completion Criteria:**
- AI tab accessible from LeftRail
- All 3 sub-tabs functional (Prompts, Theme Prompts, Styles)
- Copy buttons work for prompts and SREF codes
- Custom prompts can be added/edited/deleted
- Search filters across all prompt types

---

## Phase 7: Assets Tab Sub-Tabs

**Priority:** MEDIUM - Improves asset management workflow
**Dependencies:** Phase 1 (theme-scoped assets)
**Source:** `.plans/devtools-tabs-v1.md` (lines 111-247)
**Iterations:** 10-14 total

### 7.1 Icons Sub-Tab (~4 iterations)
- [ ] Create `packages/devtools/src/tabs/AssetsTab/IconsSubTab.tsx`
- [ ] Visual grid of icons (16x16 default)
- [ ] Size toggle: 16px, 20px, 24px, 32px
- [ ] Search/filter by icon name
- [ ] Click icon → copies JSX to clipboard: `<Icon name="x" size={20} />`
- [ ] Recently used icons section (last 5)
- [ ] Icon preview on hover (larger size)

### 7.2 Logos Sub-Tab (~3 iterations)
- [ ] Create `packages/devtools/src/tabs/AssetsTab/LogosSubTab.tsx`
- [ ] 3x3 grid showing logo variants:
  - Row 1: Wordmark (cream, black, yellow)
  - Row 2: Mark (cream, black, yellow)
  - Row 3: RadSun (cream, black, yellow)
- [ ] Background toggle: Light / Dark (to test contrast)
- [ ] Each logo card:
  - Copy SVG button (copies SVG code to clipboard)
  - Download button (PNG, SVG format options)
- [ ] Hover shows logo name and dimensions

### 7.3 Images Sub-Tab (~4 iterations)
- [ ] Create `packages/devtools/src/tabs/AssetsTab/ImagesSubTab.tsx`
- [ ] Drag-drop upload zone (reuse `UploadDropzone.tsx`)
- [ ] Grid view of uploaded images
- [ ] Each image card shows:
  - Thumbnail preview
  - Filename
  - Dimensions (e.g., 1920x1080)
  - File size (e.g., 245 KB)
  - Format (PNG, JPG, WebP)
- [ ] Bulk actions: Select multiple → Optimize, Delete
- [ ] Optimize images button (compress, convert to WebP)

### 7.4 Update Assets Tab Index (~2 iterations)
- [ ] Update `packages/devtools/src/tabs/AssetsTab/index.tsx`
- [ ] Add sub-tabs: [Icons], [Logos], [Images]
- [ ] Route to correct sub-tab based on selection

**Completion Criteria:**
- Assets tab has 3 sub-tabs (Icons, Logos, Images)
- Icons sub-tab shows grid with copy JSX functionality
- Logos sub-tab shows variants with copy/download options
- Images sub-tab supports drag-drop upload and bulk optimize

---

## Phase 8: DevTools Modes Refinements

**Priority:** MEDIUM - Improves mode interactions
**Dependencies:** Phase 2 (Settings Panel for minimized state)
**Source:** `.plans/devtools-modes-v1.md`
**Iterations:** 10-14 total

### 8.1 Remove Conflicting Keyboard Shortcuts (~1 iteration)
- [x] Update `packages/devtools/src/DevToolsProvider.tsx`
  - **Removed:** `Cmd+Shift+T` (Text Edit mode) - conflicts with Chrome
  - **Removed:** `Cmd+Shift+I` (Component ID mode) - conflicts with Chrome DevTools
  - **Removed:** `Cmd+Shift+?` (Help mode) - should be button-only
  - **Removed:** `Cmd+E` (Global search) - conflicts with Chrome address bar
  - **Kept:** `Cmd+Shift+K` (toggle panel)
  - **Kept:** `1-5` (tab switching, only when panel focused)
  - **Kept:** `Escape` (exit mode)
- [x] Update `packages/devtools/src/lib/helpRegistry.ts` - removed shortcut references

### 8.2 Minimized Panel State (~3 iterations)
- [ ] Update `packages/devtools/src/store/slices/panelSlice.ts`
  - Add `isMinimized: boolean` state
  - Add `expandPanel()` action (sets `isMinimized: false`)
  - Add `minimizePanel()` action (sets `isMinimized: true`)
  - Add `toggleMinimized()` action
- [ ] Update `packages/devtools/src/DevToolsPanel.tsx`
  - Conditional render: If minimized, show only LeftRail (slim mode)
  - If expanded, show full panel (LeftRail + content area)
- [ ] Wire `Cmd+Shift+K` to `toggleMinimized()`

### 8.3 Help Mode Refactor (~3 iterations)
- [ ] Update `packages/devtools/src/components/HelpMode.tsx`
  - Remove tooltip overlay positioning logic
  - Render as static info bar at top of panel (below TopBar)
  - Style: Dark background, cream text, matches header
  - Display: Title + one-sentence description
- [ ] Update `packages/devtools/src/lib/helpRegistry.ts`
  - Simplify data structure: `{ id, title, description }`
  - Remove complex positioning logic
- [ ] Add help bar to `DevToolsPanel.tsx` header area

### 8.4 Component ID Mode Click Handler (~3 iterations)
- [ ] Update `packages/devtools/src/components/ComponentIdMode.tsx`
  - Add click event listener on component overlay
  - On click: `expandPanel()` + `setActiveTab('components')` + `selectComponent(name)`
  - Auto-scroll to component in Components tab
  - Highlight selected component (visual feedback)
- [ ] Update `packages/devtools/src/store/slices/componentIdSlice.ts`
  - Add `navigateToComponent(name: string)` action
- [ ] Update `packages/devtools/src/store/slices/panelSlice.ts`
  - Add `expandAndNavigate(tab: string, componentName?: string)` action

### 8.5 Text Edit Mode Badge (~1 iteration)
- [ ] Update `packages/devtools/src/components/LeftRail.tsx`
  - Add badge to Text Edit button showing pending change count
  - Read from `textEditSlice.pendingChanges.length`
  - Badge style: Small circle, cream background, black text
  - Show only if count > 0

### 8.6 Display data-theme Attribute in Component ID Mode (~1 iteration)
- [ ] Update `packages/devtools/src/components/ComponentIdMode.tsx`
  - Show `data-theme` attribute value in floating label
  - Format: "Button | @radflow/ui | theme: rad-os"

**Completion Criteria:**
- Conflicting keyboard shortcuts removed (only button activation)
- Minimized panel state functional (Cmd+Shift+K toggles)
- Help mode displays as static info bar (not tooltip)
- Component ID mode click navigates to Components tab
- Text Edit mode button shows pending change count badge
- Component ID mode shows data-theme attribute

---

## Phase 9: Publishing & Versioning

**Priority:** LOW - Future enhancement
**Dependencies:** Phase 1-3 (themes must be creatable and manageable)
**Source:** `.plans/theme-architecture-plan-v3.md` (Phase 7)
**Iterations:** 8-12 total

### 9.1 Semantic Versioning (~2 iterations)
- [ ] Add version field to theme package.json
- [ ] Create `packages/devtools/src/lib/versionUtils.ts`
  - `bumpVersion(type: 'major' | 'minor' | 'patch')` function
  - Update package.json version
  - Create git tag

### 9.2 Theme Export (~3 iterations)
- [ ] Create `/api/devtools/themes/[themeId]/export` endpoint
  - Validates theme structure
  - Generates README.md with theme documentation
  - Creates tarball for npm publish

### 9.3 README Generation (~2 iterations)
- [ ] Create `packages/devtools/src/lib/readmeGenerator.ts`
  - Auto-generate README from theme metadata
  - Sections: Installation, Usage, Components, Tokens, Typography
  - Include preview images (screenshots from Components tab)

### 9.4 PR Workflow (~3 iterations)
- [ ] Create branch for theme publish: `publish/theme-[id]-v[version]`
- [ ] Auto-commit theme changes
- [ ] Open PR with generated README and changelog

**Completion Criteria:**
- Theme export generates valid npm package
- README auto-generated with theme documentation
- PR workflow creates publish branch and opens PR

---

## Implementation Dependencies Map

```
Phase 1 (Foundation)
├─→ Phase 2 (DevTools UI)
│   ├─→ Phase 3 (Theme Wizard)
│   └─→ Phase 8.2 (Minimized Panel)
├─→ Phase 4 (Token Editor)
├─→ Phase 5 (Component Subfolders)
├─→ Phase 6 (AI Tab)
└─→ Phase 7 (Assets Sub-Tabs)

Phase 2 + Phase 8.2 (Minimized Panel)
└─→ Phase 8.3-8.6 (Mode Refinements)

Phase 1 + Phase 2 + Phase 3
└─→ Phase 9 (Publishing)
```

---

## Quick Reference: File Locations

### Store Slices
- `packages/devtools/src/store/slices/themeSlice.ts` (Phase 1.1) - ✅ **CREATED**
- `packages/devtools/src/store/slices/aiSlice.ts` (Phase 6.1) - **NOT CREATED**

### Components
- `packages/devtools/src/components/SettingsPanel.tsx` (Phase 2.1) - **NOT CREATED**
- `packages/devtools/src/components/TopBar.tsx` (Phase 2.3) - **NOT CREATED**
- `packages/devtools/src/components/ThemeSwitcher.tsx` (Phase 2.4) - **NOT CREATED**
- `packages/devtools/src/components/ThemeCreationWizard.tsx` (Phase 3.1) - **NOT CREATED**
- `packages/devtools/src/components/TokenEditor.tsx` (Phase 4.1) - **NOT CREATED**

### Tabs
- `packages/devtools/src/tabs/AITab/index.tsx` (Phase 6.2) - **NOT CREATED**
- `packages/devtools/src/tabs/AITab/PromptsSubTab.tsx` (Phase 6.3) - **NOT CREATED**
- `packages/devtools/src/tabs/AITab/ThemePromptsSubTab.tsx` (Phase 6.4) - **NOT CREATED**
- `packages/devtools/src/tabs/AITab/StylesSubTab.tsx` (Phase 6.5) - **NOT CREATED**
- `packages/devtools/src/tabs/AssetsTab/IconsSubTab.tsx` (Phase 7.1) - **NOT CREATED**
- `packages/devtools/src/tabs/AssetsTab/LogosSubTab.tsx` (Phase 7.2) - **NOT CREATED**
- `packages/devtools/src/tabs/AssetsTab/ImagesSubTab.tsx` (Phase 7.3) - **NOT CREATED**

### Data Files
- `packages/devtools/src/data/prompts.ts` (Phase 6.6) - **NOT CREATED**
- `packages/devtools/src/data/srefCodes.ts` (Phase 6.6) - **NOT CREATED**

### Utilities
- `packages/devtools/src/lib/themeConfig.ts` (Phase 1.2) - ✅ **CREATED**
- `packages/devtools/src/lib/themeUtils.ts` (Phase 1.4) - **NOT CREATED**
- `packages/devtools/src/lib/versionUtils.ts` (Phase 9.1) - **NOT CREATED**
- `packages/devtools/src/lib/readmeGenerator.ts` (Phase 9.3) - **NOT CREATED**

### API Routes
- `app/api/devtools/themes/[themeId]/read-css/route.ts` (Phase 1.3) - **NOT CREATED**
- `app/api/devtools/themes/[themeId]/write-css/route.ts` (Phase 1.3) - **NOT CREATED**
- `app/api/devtools/themes/[themeId]/parse-css/route.ts` (Phase 1.3) - **NOT CREATED**
- `app/api/devtools/themes/list/route.ts` (Phase 1.3) - **NOT CREATED**
- `app/api/devtools/themes/create/route.ts` (Phase 3.3) - **NOT CREATED**
- `app/api/devtools/themes/[themeId]/export/route.ts` (Phase 9.2) - **NOT CREATED**

---

## Next Steps

1. **Start with Phase 1 (Foundation)** - This unlocks all other phases
2. **Prioritize Phase 6 (AI Tab)** after foundation - High user value
3. **Phase 8.1 (Remove keyboard shortcuts)** - Quick win, improves UX immediately
4. Review generated plan and adjust priorities based on user needs

---

**Last Updated:** 2026-01-11
**Total Tasks:** ~90 individual tasks across 9 phases
**Total Iterations:** ~100-130 Ralph loops

| Phase | Iterations | Priority |
|-------|------------|----------|
| 1. Foundation | 12-18 | CRITICAL |
| 2. DevTools UI | 10-15 | HIGH |
| 3. Theme Wizard | 15-20 | MEDIUM |
| 4. Token Editor | 12-16 | MEDIUM |
| 5. Component Subfolders | 6-9 | LOW |
| 6. AI Tab | 15-20 | HIGH |
| 7. Assets Sub-Tabs | 10-14 | MEDIUM |
| 8. Mode Refinements | 10-14 | MEDIUM |
| 9. Publishing | 8-12 | LOW |

**Quick wins (1-2 iterations):** 8.1 (keyboard shortcuts), 2.2 (settings button), 6.7 (AI tab in rail)
