# Component System

## Purpose

The Component System provides discovery, preview, and management of UI components within the design system. It enables visual exploration of available components, their variants, and properties, with the ability to edit component definitions directly.

---

## Component Discovery

### Automatic Scanning
Components are discovered automatically from the project structure.

**Discovery Process:**
- Scan designated component directories
- Identify React components by export pattern
- Extract component metadata (name, props, defaults)
- Group components by folder/category
- Build searchable index

### Component Metadata
Information extracted from each component.

**Extracted Data:**
- Component name
- File path
- Props interface (names, types, defaults)
- Variants (if defined)
- Size options (if defined)
- Required vs optional props

### Folder Organization
Components grouped by their directory structure.

**Behavior:**
- Each folder becomes a category
- Nested folders create subcategories
- Components sorted alphabetically within folders
- Empty folders hidden from view
- New folders can be created from the UI

---

## Component Preview

### Live Rendering
Components render with actual implementation, not static images.

**Behavior:**
- Real React components mounted in preview
- Full interactivity available
- State changes visible
- Animations and transitions work
- Responsive behavior testable

### Variant Gallery
All variants of a component displayed together.

**Layout:**
- Each variant rendered separately
- Labels identify variant name
- Side-by-side comparison
- Consistent preview environment

### Size Showcase
Components with size props show all sizes.

**Layout:**
- Each size rendered at actual dimensions
- Labels show size name
- Visual comparison of scale
- Relative sizing visible

### Props Playground
Interactive controls to modify component props.

**Features:**
- Toggle boolean props
- Select from enumerated options
- Input text values
- See results immediately
- Reset to defaults

---

## Component Categories

### Standard Categories
Common component groupings.

**Typical Categories:**
- **Buttons** — Actions and controls
- **Inputs** — Form fields and controls
- **Layout** — Containers and structure
- **Navigation** — Menus, tabs, breadcrumbs
- **Feedback** — Alerts, toasts, progress
- **Overlays** — Modals, dialogs, popovers
- **Data Display** — Tables, lists, cards
- **Typography** — Text components, headings

### Custom Categories
Projects can define their own groupings.

**Behavior:**
- Create new category folders
- Move components between categories
- Rename categories
- Delete empty categories

### Category Metadata
Optional metadata for categories.

**Attributes:**
- Display name (different from folder name)
- Description
- Icon
- Sort order

---

## Component Editing

### Style Editing
Modify component visual styles directly.

**Editable Properties:**
- Colors (background, text, border)
- Spacing (padding, margin, gap)
- Typography (font, size, weight)
- Effects (shadow, opacity, blur)
- Layout (flex, grid properties)

### Variant-Specific Editing
Edit styles for specific variants.

**Behavior:**
- Select variant to edit
- Changes apply only to that variant
- Base styles remain unchanged
- Visual diff shows variant differences

### Base Style Editing
Edit styles that affect all variants.

**Behavior:**
- Changes propagate to all variants
- Variant-specific overrides preserved
- Preview shows impact across variants

### Prop Default Editing
Modify default prop values.

**Behavior:**
- Change default variant
- Change default size
- Update other prop defaults
- Affects all unspecified usage

---

## Component Targeting

### Edit Scope System
Components specify where edits should persist.

**Targeting Attributes:**
- `component-definition` — Edit the component's source file
- `layer-base` — Edit global base styles
- `theme-variables` — Edit theme token values

### Variant Targeting
Edits can target specific variants.

**Behavior:**
- Attribute specifies which variant to modify
- Missing attribute targets base styles
- Multiple variants can be edited in sequence

### Component Identification
Each component instance can be uniquely identified.

**Attributes:**
- Component name
- Variant (if applicable)
- Instance ID (for duplicates)
- File path reference

---

## Component Information

### Props Documentation
Display prop information for developers.

**Shown Information:**
- Prop name
- Type definition
- Default value
- Required status
- Description (if available)

### Usage Examples
Show common usage patterns.

**Features:**
- Basic usage
- With common props
- Variant examples
- Composition patterns

### Accessibility Notes
Component accessibility information.

**Includes:**
- ARIA roles applied
- Keyboard interaction
- Screen reader behavior
- Required accessibility props

---

## Theme-Aware Preview

### Theme Context
Components preview within current theme context.

**Behavior:**
- Components use active theme tokens
- Switching themes updates all previews
- Theme-specific variations visible
- Dark mode toggle in preview

### Theme-Specific Components
Some themes may have unique components.

**Handling:**
- Components flagged as theme-specific
- Warning when viewing in wrong theme
- Fallback display for missing components

---

## Persistence

### Component File Updates
Edits write back to component source files.

**Saved Changes:**
- Style modifications
- Default prop values
- Variant definitions
- Size configurations

### Validation Before Save
Changes validated before writing.

**Checks:**
- Valid style values
- No conflicting overrides
- TypeScript compatibility
- No breaking changes to interface

### Change Preview
See exactly what will change before saving.

**Features:**
- Diff view of file changes
- Highlight modified lines
- Show file path
- Confirm or cancel

---

## Ideal Behaviors

### Visual Diff Between Variants
Side-by-side comparison highlighting differences between variants. CSS diff showing exactly what changes.

### Component Relationship Mapping
Visualize which components use which other components. Understand composition hierarchy.

### Usage Analytics
Show where each component is used in the project. Identify unused components. Track variant usage distribution.

### Breaking Change Detection
When editing a component, detect if changes would break existing usage. Warn before saving breaking changes.

### Component Templates
Create new components from templates. Standard patterns for common component types. Accelerate component creation.

### Storybook Integration
Import/export to Storybook format. Sync stories with RadFlow previews. Unified component documentation.

### Version History
Track changes to component definitions over time. Revert to previous versions. Compare versions visually.

### Design Token Binding
Visual interface to bind component styles to design tokens. Ensure components use semantic tokens not raw values.

### Responsive Preview
Preview component at multiple viewport sizes. Identify responsive issues. Test breakpoint behavior.

### Interactive State Preview
Preview hover, focus, active, disabled states. Toggle states manually. Ensure all states are properly styled.
