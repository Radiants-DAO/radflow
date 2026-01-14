# Canvas Editor

## Purpose

The Canvas Editor is the primary view for managing a project's design system. It provides a spatial interface for browsing, sorting, filtering, and editing component definitions — ensuring everything stays within brand guidelines.

**Key Principle:** The canvas is a design system enforcement tool. It surfaces violations, enables bulk operations, and gives visual oversight of the entire component library.

---

## Canvas vs Page Editor

Two complementary views for different tasks.

| Aspect | Canvas Editor | Page Editor |
|--------|---------------|-------------|
| View | Entire component library | Single page viewport |
| Content | Component definitions | Component instances |
| Entry | Default on project open | "Edit" button on page |
| Focus | Library management | Page design |
| Styles | Definition styles only | Inline/override styles |

**Workflow:**
1. Open project → Canvas Editor (default)
2. Browse/edit component library
3. Click page thumbnail → "Edit" → Page Editor
4. Design in viewport context
5. Close Page Editor → return to Canvas

---

## Canvas Sections

The canvas contains distinct sections for different content types.

### Components Section
The primary section — a visual component library.

**Contains:**
- All component definitions from theme
- Rendered previews at consistent size
- Component name labels
- Category groupings

**Not Included:**
- Component instances from pages
- Inline style overrides
- Page-specific variations

### Pages Section
Thumbnails of all pages in the project.

**Contains:**
- Page previews at reduced scale
- Page names/routes
- "Edit" button to enter Page Editor
- Last modified indicator

### Docs Section
Documentation integrated with the design system.

**Contains:**
- Markdown documentation
- Obsidian vault integration (future)
- Design guidelines
- Component usage notes

---

## Component Library Management

### Component Display
How components appear on canvas.

**Each Component Shows:**
- Live rendered preview
- Component name
- Variant indicator (if multiple)
- Category badge
- Violation indicator (if applicable)

**Layout:**
- Grid arrangement by default
- Consistent card sizes
- Grouped by category
- Collapsible groups

### Sorting
Arrange components by properties.

**Sort Options:**
- Alphabetical (name)
- By category
- By background color
- By text color
- By border radius
- By shadow
- Recently modified

**Sort Behavior:**
- Components using semantic tokens sort correctly
- Components with hardcoded/inline styles sort incorrectly (by design — this exposes violations)
- Sort indicator shows active sort

### Filtering
Show subsets of the library.

**Filter Options:**
- By category (buttons, cards, inputs, etc.)
- By property value (all components using `--color-primary`)
- By variant count
- By violation status
- By token usage

**Filter Behavior:**
- Multiple filters combine (AND logic)
- Active filters shown as chips
- Clear all filters option
- Filter count displayed

### Multi-Select
Select multiple components for bulk operations.

**Selection Methods:**
- Click to select one
- Shift+click to add to selection
- Cmd+click to toggle in selection
- Click+drag rectangle to select area

**Selection Actions:**
- Copy Component IDs (for AI targeting)
- Bulk edit via Properties Panel
- Apply category
- Export selection

---

## Component ID Mode on Canvas

Component ID Mode works on the canvas for AI-assisted bulk editing.

### Canvas Behavior
When Component ID Mode is active:

**Visual:**
- Pills appear on each component: `Button`, `Card`, etc.
- Selected components highlighted
- Multi-select enabled

**Clipboard Format (single):**
```
Button @ components/Button/Button.tsx:12
```

**Clipboard Format (multi-select):**
```
Button @ components/Button/Button.tsx:12
Card @ components/Card/Card.tsx:8
Input @ components/Input/Input.tsx:15
```

**Use Case:**
Select 5 buttons → copy IDs → paste into prompt → "Make all these use rounded-full corners"

---

## Design System Violations

### Violation Detection
Identify components that don't follow design system rules.

**Detected Violations:**
- Hardcoded color values (not tokens)
- Inline styles instead of className
- Non-standard spacing values
- Missing semantic tokens
- Inconsistent naming

### Violations Box
A dedicated area for components needing review.

**Behavior:**
- Components with violations appear in "Needs Review" section
- Red indicator on component card
- Violation type shown on hover
- Click to see full violation details

**AI Generation Review:**
When AI generates or modifies components:
- New components appear in review queue first
- Violations highlighted immediately
- Accept/reject workflow
- "Fix violations" AI action

### Violation Details
What you see when inspecting a violation.

**Shows:**
- Violation type
- Offending code line
- Expected value (semantic token)
- Actual value (hardcoded)
- "Fix" button (AI-assisted)

---

## Properties Panel

The Properties Panel remains visible on canvas for contextual editing.

### Panel Behavior
Same as Page Editor, but for definitions.

**When Component Selected:**
- Shows component properties
- Edit controls for variants
- Token bindings visible
- Changes write to definition file

**When Multiple Selected:**
- Shows shared properties
- Batch edit available
- Mixed values indicated

### Quick Edits
Fast property changes without prompting.

**Available Controls:**
- Color picker (token-bound)
- Radius selector (scale values)
- Shadow selector (defined shadows)
- Spacing controls (scale values)

---

## Canvas Navigation

### Zoom
Scale the view from overview to detail.

**Controls:**
- Scroll wheel zooms
- Pinch gesture on trackpad
- Zoom controls in toolbar
- Zoom to fit (see all)
- Zoom to selection

**Zoom Levels:**
- Overview (see entire library)
- Category level (see groups)
- Component level (see details)

### Pan
Move around the canvas.

**Methods:**
- Click+drag on background
- Two-finger drag on trackpad
- Arrow keys when canvas focused
- Spacebar+drag

### Mini Map
Navigation aid for large libraries.

**Features:**
- Thumbnail of entire canvas
- Current view rectangle
- Click to jump
- Collapsible

---

## Section Organization

### Grouping
Organize components into custom groups.

**Behavior:**
- Drag components into groups
- Name groups
- Collapse/expand groups
- Groups persist across sessions

### Arrangement
Position sections and groups.

**Options:**
- Auto-layout (default grid)
- Manual positioning
- Snap to grid
- Alignment guides

### Section Visibility
Show/hide canvas sections.

**Controls:**
- Toggle Components section
- Toggle Pages section
- Toggle Docs section
- Toggle Violations section

---

## Persistence

### Canvas State
What persists across sessions.

**Saved:**
- Zoom level and position
- Active sort/filter
- Group arrangement
- Section visibility
- Collapsed groups

### Component Changes
Edits persist to source files.

**Behavior:**
- Same write-back as Page Editor
- Changes go to component definition files
- Unsaved changes indicated
- Save confirmation on close

---

## Page Editor Transition

### Entering Page Editor
Switch from canvas to page editing.

**Methods:**
- Click "Edit" on page thumbnail
- Double-click page
- Keyboard shortcut with page selected

**Transition:**
- Canvas fades/slides out
- Page loads in viewport frame
- DevTools panel available
- Full Page Editor features active

### Exiting Page Editor
Return to canvas view.

**Methods:**
- Close button
- Escape key
- Keyboard shortcut

**Behavior:**
- Page changes saved (or prompted)
- Return to previous canvas position
- Page thumbnail updates if changed

---

## Obsidian Integration (Future)

### Docs on Canvas
Documentation as canvas nodes.

**Behavior:**
- Markdown files displayed as cards
- Click to expand/edit
- Link to related components
- Bidirectional linking

### Vault Connection
Connect to Obsidian vault.

**Features:**
- Watch vault directory
- Sync on file change
- Component references link to canvas
- Design decisions documented alongside code

---

## Research Notes

### Complexity Assessment
**Very High** — The canvas editor is the most complex feature in RadFlow.

### Research Required

**Infinite Canvas**

*Canvas Rendering*
- React canvas libraries (react-konva, fabric.js, xyflow)
- Custom WebGL/Canvas2D rendering
- GPU acceleration for smooth interaction
- Virtual rendering (only render visible items)

*Figma-Style Interaction*
- Smooth zoom/pan with momentum
- Zoom toward cursor position
- Minimap implementation
- Section snapping

**Component Grid**

*Grid Layout*
- Responsive grid for component cards
- Grouping and collapsing
- Drag-to-reorder
- Auto-layout algorithms

*Component Rendering*
- Live React component preview in cards
- Consistent sizing across variants
- Lazy loading for large libraries

**Sorting/Filtering**

*Property-Based Sorting*
- Extract style properties from components
- Sort by token usage (semantic) vs hardcoded values
- Real-time re-sorting on filter change

*AST Analysis*
- Detect hardcoded values in component code
- Identify token references
- Flag violations

**Multi-Select**

*Selection Rectangle*
- Drawing selection box on canvas
- Detecting items within bounds
- Shift+click, Cmd+click behaviors

*Bulk Operations*
- Batch property editing
- Copy multiple Component IDs
- Apply category to selection

**Design System Violations**

*Static Analysis*
- Parse component AST for hardcoded values
- Detect non-token color values
- Flag inline styles
- Identify non-standard spacing

*Violation UI*
- "Needs Review" section
- Violation badges on cards
- Detail panel with fix suggestions

### Search Terms
```
"react infinite canvas library"
"react-konva vs fabric.js vs xyflow"
"figma canvas implementation"
"virtual canvas rendering react"
"ast detect hardcoded css values"
"eslint plugin detect hardcoded colors"
"selection rectangle javascript canvas"
"drag select multiple items"
"component library management ui"
"storybook canvas view"
```

### Rust Backend Integration

| Module | Purpose |
|--------|---------|
| Component Analyzer | AST analysis for violations |
| Property Extractor | Extract style properties for sorting |
| Canvas State | Persist zoom, position, groups |
| Index | Fast component lookup for filtering |

**Key Technical Work:**
- AST traversal for violation detection (SWC)
- Property extraction for sorting
- Efficient state serialization

**Commands Needed:**
- `analyze_component(path)` → Violations list
- `extract_properties(path)` → Style properties
- `save_canvas_state(state)` → Persist layout
- `load_canvas_state()` → Restore layout

### Technical Challenges
1. **Performance** — Canvas must stay smooth with 100+ components
2. **Violation Detection** — AST analysis must be accurate and fast
3. **Live Preview** — Components must render correctly in cards
4. **State Management** — Canvas state is complex (zoom, pan, groups, filters)

### Canvas Library Evaluation

| Library | Pros | Cons |
|---------|------|------|
| react-konva | Mature, good docs | Canvas-based, not DOM |
| xyflow | Built for node graphs | May be overkill |
| fabric.js | Full-featured | Heavy, learning curve |
| Custom | Full control | More work |

### Reference Implementations
- Figma (canvas interaction gold standard)
- Storybook (component library UI)
- Linear (Kanban-style grouping)
- Notion (drag-and-drop blocks)

### Open Questions
- Canvas library or custom implementation?
- How to render live React components in canvas?
- Violation detection: real-time or on-demand?
- Obsidian integration: how deep? (just watch files, or full API?)
