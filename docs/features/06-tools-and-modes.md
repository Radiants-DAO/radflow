# Tools & Modes

## Purpose

Tools and Modes provide specialized interaction paradigms for specific tasks. They transform how the user interacts with the page, enabling inspection, editing, and exploration that wouldn't be possible in the default state.

---

## Component ID Mode

### Purpose
Provide a universal addressing system for page elements that enables precise AI-assisted editing. The goal is minimal tokens, maximum precision — an LLM should know exactly where to edit without searching.

### Core Principle
**Visual:** Minimal — small pills showing element type (`<Button>`, `AnimatedStatCard`)
**Clipboard:** Complete — full file path + line number for direct navigation

```
AnimatedStatCard @ app/dashboard/page.tsx:47
```

This format tells an LLM exactly where to go. No DOM paths, no CSS classes, no noise.

---

### Activation
Enter Component ID Mode through toolbar or keyboard shortcut.

**Indicators:**
- Cursor changes to crosshair
- Mode indicator visible in toolbar
- Subtle overlay on interactive elements

---

### Visual Display

**Element Pills**
Small, unobtrusive tags appear on or near elements.

**Display:**
- Component name for React components: `AnimatedStatCard`
- HTML tag for non-components: `<div>`, `<button>`, `<h1>`
- Positioned to not obscure element content
- Semi-transparent until hovered

**Hover State:**
- Pill becomes fully opaque
- Element gets subtle highlight outline
- No tooltip clutter — the pill IS the identifier

---

### Selection Behaviors

**Single Click — Select One**
- Element highlighted
- Location copied to clipboard
- Toast confirms: "Copied: AnimatedStatCard @ page.tsx:47"

**Shift+Click — Add to Selection**
- Add element to current selection
- All selected elements copied as list
- Visual indicator on all selected elements

```
AnimatedStatCard @ app/dashboard/page.tsx:47
MetricsCard @ app/dashboard/page.tsx:52
Button @ app/dashboard/page.tsx:61
```

**Shift+Cmd+Click — Select All of Type**
- Select all instances of that component/element on current page
- Clipboard contains summary format:

```
ALL AnimatedStatCard on /dashboard (4 instances)
→ app/dashboard/page.tsx:47, 89, 134, 201
```

**Click+Drag — Rectangle Selection**
- Draw rectangle to select multiple elements
- All elements within rectangle selected
- Same clipboard format as Shift+Click

---

### Clipboard Format

**React Component:**
```
ComponentName @ path/to/file.tsx:lineNumber
```

**HTML Element (non-component):**
```
<tagName> @ path/to/file.tsx:lineNumber "content preview"
```

The content preview (first ~30 chars) helps disambiguate multiple same-tag elements.

**Multiple Selection:**
```
ComponentA @ file.tsx:12
ComponentB @ file.tsx:34
<h1> @ file.tsx:56 "Welcome to RadFlow"
```

**All of Type:**
```
ALL ComponentName on /pagePath (count instances)
→ file.tsx:12, 34, 56, 78
```

---

### Line Number Accuracy

Line numbers are **live and accurate** because:
- Rust backend maintains file index
- File watcher updates index on save
- Line numbers recalculated on file change
- Sub-second accuracy after edits

If a file changes between copy and paste, line numbers reflect the new state (not stale data).

---

### Element Identification

**What Gets an ID:**
- All React components (detected by React DevTools fiber)
- All semantic HTML elements (headings, buttons, links, etc.)
- Elements with `data-edit-scope` attribute
- Focusable/interactive elements

**What's Excluded:**
- Pure layout containers (unless they're components)
- Styling wrappers
- Internal library elements

---

### Exit Behavior

**Exit Methods:**
- Press Escape key
- Click toolbar toggle
- Activate different mode
- Close DevTools panel

**On Exit:**
- All visual pills removed
- Selection cleared
- Clipboard retains last copied selection

---

## Inspect Mode

### Purpose
Visualize spacing, layout, and measurements — like Figma's inspect tools. Understand how elements relate spatially without editing.

### Activation
Enter Inspect Mode through toolbar or keyboard shortcut.

**Indicators:**
- Mode indicator in toolbar
- Cursor changes to inspect cursor
- Selected element shows spacing overlay

---

### Spacing Visualization
See padding, margin, and gap values for selected element.

**On Selection:**
```
          ┌─ margin-top: 16px ─┐
     ┌────┬────────────────────┬────┐
     │    │   padding: 24px    │    │
     │ m  │  ┌────────────┐    │ m  │
     │ a  │  │  Content   │    │ a  │
     │ r  │  └────────────┘    │ r  │
     │ g  │                    │ g  │
     │ i  │                    │ i  │
     │ n  │                    │ n  │
     └────┴────────────────────┴────┘
          └─ margin-bottom: 16px ─┘
```

**Display:**
- Padding shown as inner overlay (one color)
- Margin shown as outer overlay (different color)
- Values displayed in pixels
- Gap values shown between flex/grid children

---

### Measurement Tool (Alt+Hover)
Hold Alt and hover to see distances between elements.

**Behavior:**
- Hold Alt key
- Hover over any element
- Red measurement lines appear showing distance to:
  - Parent edges
  - Sibling elements
  - Canvas/viewport edges

**Display:**
```
┌─────────┐
│ Button  │
└─────────┘
     │
     │ 24px    ← measurement line with value
     │
┌─────────┐
│  Card   │
└─────────┘
```

**Like Figma:** Same interaction pattern. Alt+hover = instant measurements.

---

### Layout Visualization
See flexbox and grid structure.

**For Flex Containers:**
- Arrow showing flex-direction
- Gap values between children
- Alignment indicators (justify, align)

**For Grid Containers:**
- Grid lines overlay
- Column/row sizes
- Gap values

**Display:**
```
┌──────────────────────────────────┐
│  flex-direction: row             │
│  gap: 16px                       │
│  ┌────┐ ← 16px → ┌────┐ ← 16px → ┌────┐
│  │ A  │          │ B  │          │ C  │
│  └────┘          └────┘          └────┘
└──────────────────────────────────┘
```

---

### Token Reference
Show which design tokens are applied.

**On Selection:**
- Background: `var(--color-surface-primary)`
- Border: `var(--color-edge-default)`
- Shadow: `var(--shadow-card)`
- Radius: `var(--radius-md)`

Click token name → navigate to Variables Editor.

---

### Exit Behavior

**Exit Methods:**
- Press Escape key
- Click toolbar toggle
- Activate different mode

**On Exit:**
- All overlays removed
- Measurements cleared

---

## Responsive Preview

### Purpose
View the design at different viewport sizes. Not editing — just viewing.

### Device Frames
Quick toggles for common sizes.

**Presets:**
- 📱 Phone (375px)
- 📱 Phone Large (428px)
- 📱 Tablet (768px)
- 🖥 Desktop (1280px)
- 🖥 Wide (1536px)

### Preview Behavior
Canvas wraps in device frame.

**Display:**
```
┌─────────────────────────────────┐
│  [📱] [📱] [📱] [🖥] [🖥] [Custom: ____]
├─────────────────────────────────┤
│                                 │
│      ┌─────────────┐            │
│      │             │            │
│      │   Preview   │  375px     │
│      │   at size   │            │
│      │             │            │
│      └─────────────┘            │
│                                 │
└─────────────────────────────────┘
```

### Custom Size
Enter custom width for specific testing.

**Behavior:**
- Input field for pixel width
- Height follows content (or set explicitly)
- Remembers recent custom sizes

### Breakpoint Indicator
Show which CSS breakpoint is active.

**Display:**
- Current breakpoint name (sm, md, lg, xl)
- Pixel value
- Visual marker at breakpoint boundaries

---

## Help Mode

### Purpose
Provide contextual guidance for the current state of the interface.

### Activation
Enter Help Mode through toolbar or keyboard shortcut.

**Behavior:**
- Help content appears for current context
- Context = active tab + active tool
- Overlay or panel displays help

### Contextual Help
Help content adapts to current state.

**Contexts:**
- Variables Tab — explain token editing workflow
- Typography Tab — explain typography controls and direct text editing
- Components Tab — explain component preview system
- Assets Tab — explain asset management
- Component ID Mode — explain inspection workflow
- Inspect Mode — explain spacing and measurement tools

### Help Content
What help includes.

**Content:**
- Feature title
- Brief description
- Key actions/shortcuts
- Tips and best practices
- Common workflows

### Display
How help is presented.

**Presentation:**
- Non-intrusive overlay or bar
- Readable without blocking content
- Dismissible
- Links to detailed documentation

### Exit Behavior
Leave Help Mode.

**Exit Methods:**
- Press Escape
- Click close button
- Click outside help content
- Activate different mode

---

## Preview Mode

### Purpose
View the page without DevTools chrome. See the design as users will see it.

### Activation
Toggle preview mode on/off.

**Behavior:**
- DevTools panel hides
- All overlays removed
- Page renders clean
- Keyboard shortcut still active for exit

### Page State
What happens to the page in preview.

**Preserved:**
- Current theme
- Any pending (unsaved) changes
- Current viewport
- Scroll position

**Removed:**
- DevTools panel
- Mode indicators
- Inspection overlays
- Help displays

### Exit Behavior
Return to editing mode.

**Methods:**
- Keyboard shortcut
- Edge trigger (mouse to screen edge)
- Auto-timeout (optional)

---

## Mode Interaction

### Mode Exclusivity
Only one mode active at a time.

**Behavior:**
- Activating a mode deactivates others
- Clear indication of current mode
- Easy to identify active mode
- Default state when no mode active

### Mode Persistence
Modes don't persist across sessions.

**Behavior:**
- Page refresh exits all modes
- Panel close exits all modes
- Tab switch may or may not exit mode (context-dependent)

### Mode + Tab Interaction
How modes work with tabs.

**Behavior:**
- Component ID Mode works across all tabs (it's about the page, not the panel)
- Inspect Mode works across all tabs
- Help Mode content changes with active tab
- Some modes may restrict tab switching

---

## Ideal Behaviors

### Component ID Enhancements

**Embedded Terminal Integration**
Visual element pills appear in terminal input. Pills show truncated name, clipboard contains full path. Any CLI tool can receive element context.

**Selection Sets**
Save named selection sets for reuse. "Header elements", "Dashboard cards". Quick recall without re-selecting.

**Tree View**
Show component hierarchy tree alongside inspection. Hovering in tree highlights on page. Click in tree selects element.

**Props Inspector**
Show full props for selected component. Live values, not just defaults. Update as state changes.

**Context Injection**
Selected elements automatically available to AI tools. No manual paste needed. MCP-style bridge to external tools.

**Source Preview**
Inline preview of component source code. Scroll to relevant line. One-click open in editor.

**History**
Remember recently inspected components. Quick navigation to previous selections.

**Batch Edit Prompting**
Select multiple elements → type instruction → AI applies to all. "Make all these use rounded corners."

### New Modes to Consider

**Accessibility Mode**
Highlight accessibility issues. Show focus order. Display ARIA attributes. Contrast ratio indicators.

**Animation Mode**
Highlight animated elements. Pause/play animations. Adjust animation timing. Preview transitions.

---

## Research Notes

### Complexity Assessment
**High** — React DevTools integration and source mapping are technically challenging.

### Research Required

**Component ID Mode**

*React Component Detection*
- React DevTools Fiber internals
- Detecting component names from rendered elements
- Mapping DOM elements back to source components

*Source Map Parsing*
- Parsing .map files in Rust
- Mapping transpiled code to original line numbers
- Real-time line number updates as files change

*Selection Rectangle*
- Rectangle selection implementation
- Detecting elements within selection bounds
- Multi-select state management

**Inspect Mode**

*Figma-Style Measurements*
- Alt+hover measurement implementation
- Distance calculation between elements
- Measurement line rendering (SVG overlay)

*Spacing Visualization*
- getComputedStyle for padding/margin
- Box model visualization
- Flexbox/Grid gap detection

**Responsive Preview**

*Device Frames*
- Viewport resizing in Tauri webview
- Device frame UI (bezels, status bar)
- Breakpoint detection from CSS

### Search Terms
```
"react devtools fiber api"
"react element to component mapping"
"source map parsing rust"
"source-map-js alternative rust"
"figma measurement tool implementation"
"element distance calculation javascript"
"css box model visualization"
"tauri webview resize"
```

### Rust Backend Integration

| Module | Purpose |
|--------|---------|
| Source Mapper | Parse source maps, map line numbers |
| File Index | Track component locations in files |
| File Watcher | Update line numbers on file change |

**Key Challenge:** Line Number Accuracy
- Must parse source maps to find original line numbers
- File watcher must trigger re-indexing on save
- Sub-second updates required for good UX

**Commands Needed:**
- `get_element_source(component_name, file_path)` → Line number
- `parse_source_map(path)` → Mapping data
- `index_components(project_path)` → Component location index

### Technical Challenges
1. **React Fiber Access** — Need to access React internals to find component names
2. **Source Map Complexity** — Vite/Next.js source maps can be complex
3. **Real-time Updates** — Line numbers must stay accurate as user edits

### Reference Implementations
- React DevTools extension (open source)
- Figma's inspect feature
- Chrome DevTools Elements panel

### Open Questions
- Use React DevTools protocol or custom implementation?
- Source maps: parse in Rust or JavaScript?
- How to handle minified/production builds?
