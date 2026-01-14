# Component Browser

## Purpose

The Component Browser is the editor's interface for discovering, previewing, and inspecting components from the active theme. It presents whatever components the theme provides, enabling visual exploration and editing.

**The editor is the console. The theme is the game.**

The Component Browser doesn't define what components exist — it discovers and displays them.

---

## Discovery

### Theme Scanning
The editor scans the active theme package for components.

**What's Scanned:**
- Theme's component directory
- Files with default exports
- TypeScript/JSX component patterns

**What's Extracted:**
- Component name
- File path
- Props interface
- Default prop values
- Variant definitions (if detectable)

### Component Manifest (Optional)
Themes can provide a manifest for richer metadata.

**Manifest Provides:**
- Component categorization
- Variant enumeration
- Size options
- Compound component relationships
- Preview hints

**Without Manifest:**
- Components discovered via file scanning
- Grouped by folder structure
- Props inferred from code
- Basic preview only

### Index Updates
Component index stays current.

**Behavior:**
- Initial scan on theme load
- File watcher detects changes
- Index updates on component file save
- Sub-second refresh

---

## Browsing

### Component List
All discovered components displayed for browsing.

**Organization:**
- Grouped by category (from manifest or folder)
- Alphabetical within groups
- Collapsible sections
- Component count per section

### Search
Find components quickly.

**Search Scope:**
- Component name
- Category name
- Prop names
- Tags (if manifest provides)

**Behavior:**
- Real-time filtering as you type
- Highlight matching text
- Show result count

### Filtering
Narrow component list.

**Filters:**
- By category
- By variant availability
- By size availability
- Custom tags

---

## Preview

### Live Rendering
Components render with actual implementation.

**Behavior:**
- Real React component mounted
- Full interactivity
- Actual theme styles applied
- State changes work

### Variant Display
Show all variants of a component.

**Layout:**
- Each variant rendered separately
- Variant name labeled
- Side-by-side comparison
- Consistent preview container

### Size Display
Show size variations.

**Layout:**
- Each size rendered
- Size name labeled
- Actual dimensions visible
- Relative scale apparent

### Props Playground
Interact with component props.

**Controls:**
- Boolean toggles
- Enum dropdowns
- Text inputs
- Reset to defaults

**Behavior:**
- Preview updates immediately
- Invalid values prevented
- Shows which props are modified

---

## Inspection

### Component Info
Details about selected component.

**Displayed:**
- Component name
- File path
- Category
- Available variants
- Available sizes

### Props Reference
Full props documentation.

**Displayed:**
- Prop name
- Type
- Default value
- Required/optional
- Description (if available)

### Source Link
Quick access to component code.

**Behavior:**
- Click to reveal file path
- Copy path to clipboard
- Open in external editor (if configured)

---

## Editing

### Style Editing
Modify component styles visually.

**Editable:**
- Colors (background, text, border)
- Spacing (padding, margin)
- Typography (font, size, weight)
- Effects (shadow, radius)

**Targeting:**
- Edit base styles (all variants)
- Edit specific variant
- Changes write to component file

### Token Binding
Connect styles to design tokens.

**Behavior:**
- Select a style property
- Choose from available tokens
- Preview token value
- Save binds style to token

### Variant Editing
Modify variant-specific styles.

**Behavior:**
- Select variant to edit
- Only that variant's styles modified
- Base styles unaffected
- Preview shows variant in isolation

---

## Persistence

### Where Edits Save
Component changes write to theme files.

**Destinations:**
- Component style changes → component TSX file
- Token binding changes → component TSX file
- New variants → component TSX file

### Change Tracking
Edits tracked until saved.

**Behavior:**
- Pending changes indicated
- Save commits to file
- Reset discards changes
- File watcher confirms save

---

## Expansion Points

### Future: Any React Project
Currently designed for RadFlow themes. Future versions will discover components from any React project structure.

**Required for Expansion:**
- Configurable component directories
- Multiple discovery patterns
- Framework-agnostic scanning

### Future: Other Frameworks
Eventually support Vue, Svelte, and other component-based frameworks.

**Required for Expansion:**
- Framework detection
- Framework-specific parsers
- Unified component model

---

## Ideal Behaviors

### Visual Diff
Compare variants visually. Highlight style differences. Show what changes between variants.

### Usage Map
Show where each component is used in the project. Click to navigate to usage. Identify unused components.

### Relationship Graph
Visualize component composition. Which components use which. Dependency tree.

### Performance Hints
Indicate component complexity. Bundle size impact. Render performance notes.

### Accessibility Audit
Check component accessibility. ARIA compliance. Keyboard navigation. Color contrast.

### Documentation Generation
Auto-generate component docs. Props table. Usage examples. Export as markdown.

---

## Research Notes

### Complexity Assessment
**High** — TypeScript/TSX parsing and props extraction is technically complex.

### Research Required

**TSX Parsing in Rust**
- SWC for TypeScript/JSX parsing
- Extracting props interfaces from TypeScript
- Detecting default export components
- Finding variant/size prop enumerations

**React Component Introspection**
- How to detect component name from file
- Extracting default prop values
- Compound component detection (Card, Card.Header, etc.)

**Live Component Rendering**
- Rendering components in isolation (Storybook-style)
- Handling component dependencies
- Props playground implementation

### Search Terms
```
"swc typescript ast rust"
"swc parse props interface"
"typescript interface extraction ast"
"react component introspection"
"storybook component isolation"
"react component props playground"
```

### Rust Backend Integration

| Module | Purpose |
|--------|---------|
| TSX Parser | Parse component files, extract metadata |
| Props Extractor | Find TypeScript interface, extract prop definitions |
| Component Index | Build searchable index of all components |
| File Watcher | Update index when components change |

**Key Crate:** `swc_ecma_parser` for TypeScript/JSX parsing

**Commands Needed:**
- `scan_components(theme_path)` → List of component metadata
- `parse_component(path)` → Full component info (props, variants, etc.)
- `get_component_source(name)` → Source code for preview

### Technical Challenges
1. **Props Interface Extraction** — Need to parse TypeScript interfaces, handle union types (variant: 'primary' | 'secondary'), extract default values
2. **Default Export Detection** — Components must use default export, need to identify the exported component
3. **Variant Detection** — Find `variant` prop, extract possible values from union type

### Open Questions
- How to handle components that import other components?
- Support for styled-components or CSS-in-JS?
- Manifest file: JSON schema or inferred from code?
