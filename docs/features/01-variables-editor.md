# Variables Editor

## Purpose

The Variables Editor manages design tokens—the foundational values that define a design system's visual language. It provides a visual interface for editing colors, shadows, border radius, animation timing, and effects, with changes persisting directly to the theme's source files.

**What Variables Editor owns:**
- Colors (brand palette + semantic tokens)
- Shadows (elevation system)
- Border Radius (shape language)
- Animation (duration + timing function)
- Effects (backdrop blur, focus ring)

**What it doesn't own:**
- Spacing (Tailwind handles this)
- Typography (Typography Editor owns this)
- Component-specific tokens (Component Browser)

---

## Token Architecture

### Base Colors
Raw color values that serve as the palette foundation. These are the actual hex/rgb values from which all other colors derive.

- Each base color has a **name** (for reference) and a **value** (the actual color)
- Base colors are the only place raw color values should exist
- Adding, removing, or modifying base colors affects the entire available palette

### Semantic Tokens
Named references that map to base colors based on their purpose, not their appearance.

**Surface Tokens** — Background colors for UI regions
- `surface-primary` — Main content areas
- `surface-secondary` — Subordinate regions
- `surface-tertiary` — Deeply nested or de-emphasized areas
- `surface-elevated` — Floating elements (modals, dropdowns)
- `surface-inverse` — Inverted color scheme regions

**Content Tokens** — Text and icon colors
- `content-primary` — Primary text, important information
- `content-secondary` — Supporting text, labels
- `content-tertiary` — Placeholder text, disabled states
- `content-inverse` — Text on inverse backgrounds
- `content-link` — Interactive text links

**Edge Tokens** — Borders and dividers
- `edge-default` — Standard borders
- `edge-subtle` — Low-contrast dividers
- `edge-strong` — High-contrast borders
- `edge-focus` — Focus ring color

**Accent Tokens** — Brand and interaction colors
- `accent-primary` — Primary brand/action color
- `accent-secondary` — Secondary actions
- `accent-success` — Positive states
- `accent-warning` — Cautionary states
- `accent-error` — Error states

### Shadow Tokens
Elevation definitions using shadow properties.

- `shadow-sm` — Subtle lift (cards, buttons)
- `shadow-md` — Medium elevation (dropdowns, popovers)
- `shadow-lg` — High elevation (modals, dialogs)
- `shadow-xl` — Maximum elevation (command palettes)

Each shadow supports multiple layers for realistic depth.

### Border Radius Tokens
Corner rounding values for consistent shape language.

- `radius-none` — Sharp corners (0)
- `radius-sm` — Subtle rounding
- `radius-md` — Standard rounding
- `radius-lg` — Pronounced rounding
- `radius-full` — Pill/circle shapes

### Animation Tokens
Timing values that define the theme's motion feel.

**Duration Scale** — How long animations take
- `duration-fast` — Micro-interactions, instant feedback (100-150ms)
- `duration-base` — Standard transitions, hover states (200-300ms)
- `duration-slow` — Emphasis, entrance animations (400-500ms)
- `duration-slower` — Complex sequences, page transitions (600ms+)

**Timing Function** — How animations accelerate
- `timing-default` — Standard easing (ease-out or theme-specific)
- `timing-linear` — Constant speed (progress indicators)
- `timing-bounce` — Playful overshoot (optional, theme-specific)

Animation timing is part of theme identity. A retro theme might feel snappy (fast, linear). A modern theme might feel smooth (slower, ease-out).

### Effects Tokens
Visual effects that vary by theme.

**Backdrop Blur** — Glass/frosted effects
- `blur-none` — No blur (0)
- `blur-sm` — Subtle frosting (4px)
- `blur-md` — Standard glass effect (8px)
- `blur-lg` — Heavy frosting (16px)

Not all themes use blur. RadOS has none (pixel aesthetic). Phase uses it heavily (glass morphism).

**Focus Ring** — Accessibility focus indicators
- `focus-ring-width` — Ring thickness (2px typical)
- `focus-ring-color` — Ring color (often accent or edge-focus)
- `focus-ring-offset` — Gap between element and ring (2px typical)
- `focus-ring-style` — Solid, glow, or theme-specific treatment

Focus ring style is theme identity. RadOS uses hard outlines. Phase uses soft glows.

---

## Editing Capabilities

### Inline Value Editing
Click any token value to edit it directly in place.

**Behavior:**
- Single click enters edit mode
- Value is selected for immediate replacement
- Enter key commits the change
- Escape key cancels without saving
- Clicking away commits the change
- Invalid values show validation feedback

### Color Picker Integration
Color values provide both text input and visual picker.

**Behavior:**
- Text field accepts hex values (#RRGGBB)
- Color swatch opens native color picker on click
- Changes preview immediately
- Supports copy/paste of color values

### Drag-and-Drop Token Mapping
Semantic tokens can be remapped to different base colors via drag-and-drop.

**Behavior:**
- Drag a semantic token over base color swatches
- Valid drop targets highlight
- Dropping creates a new mapping
- Visual preview shows result before dropping
- The semantic token now references the new base color

### Batch Operations
Multiple tokens can be modified in a single editing session.

**Behavior:**
- All changes accumulate as "pending"
- Pending changes counter shows total modifications
- Changes can be previewed collectively
- Single action commits all pending changes
- Single action discards all pending changes

---

## Color Modes

### Light and Dark Mode Support
Design tokens exist in context of color modes. The editor allows switching between modes to edit each independently.

**Behavior:**
- Mode selector switches the editing context
- Token values may differ between modes
- Preview updates to show selected mode
- Changes persist to the appropriate mode definition
- Some tokens may be shared across modes, others mode-specific

### Mode Preview
While editing, users can preview how tokens appear in each mode.

**Behavior:**
- Toggle between light/dark preview
- See token relationships in context
- Identify contrast issues before saving

---

## Live Preview

### Preview Drawer
A dedicated preview panel shows design tokens in realistic contexts.

**Purpose:**
- See how colors work together before committing
- Identify contrast and accessibility issues
- Preview surface/content combinations
- Test shadow and radius values in context

**Behavior:**
- Toggle on/off independently of editing
- Updates in real-time as values change
- Shows multiple token categories in use
- Demonstrates semantic relationships

### Token Relationship Visualization
The editor shows how semantic tokens relate to base colors.

**Behavior:**
- Visual lines or indicators show token derivation
- Changing a base color shows all affected semantic tokens
- Orphaned tokens (pointing to deleted colors) are highlighted

---

## Persistence

### Change Tracking
All modifications are tracked until explicitly saved.

**Visual Indicators:**
- Modified values show pending state (ring/highlight)
- Counter displays total pending changes
- Changed sections are visually distinguished

### Save Action
Committing changes writes to source files.

**Behavior:**
- Single action saves all pending changes
- Changes write to appropriate source locations:
  - Base colors → theme color definitions
  - Semantic tokens → token mapping definitions
  - Shadows → shadow token definitions
  - Radius → radius token definitions
  - Animation → animation token definitions
  - Effects → effects token definitions
- Success confirmation shows what was saved
- Failure shows specific errors with guidance

### Reset Action
Discarding changes reverts to last saved state.

**Behavior:**
- Single action clears all pending changes
- No confirmation for reset (changes were never saved)
- Editor state returns to source file state

### Reload Action
Refreshing from source handles external changes.

**Behavior:**
- Re-reads source files
- Warns if pending changes would be lost
- Useful when source files changed externally

---

## Validation

### Color Format Validation
Color inputs are validated for correct format.

**Rules:**
- Hex format: #RGB or #RRGGBB
- RGB format: rgb(R, G, B)
- Invalid formats show error state
- Prevents saving invalid values

### Contrast Accessibility
Color combinations are checked for accessibility.

**Guidance:**
- Surface + Content combinations checked for WCAG compliance
- Warning indicators for low-contrast pairings
- Suggestions for improving contrast

### Token Completeness
The system validates that all required tokens are defined.

**Checks:**
- All semantic token categories have values
- No orphaned references to deleted colors
- Shadow and radius scales are complete
- Animation duration scale is defined
- Focus ring tokens are defined (accessibility requirement)

---

## Ideal Behaviors

### Instant Feedback
Color changes should preview in under 16ms. There should be no perceptible delay between input and visual update.

### Smart Defaults
When adding new colors, the system should suggest names based on the color value (e.g., suggesting "blue-500" for a medium blue).

### Undo Stack
Individual changes should be undoable, not just the entire pending set. Users should be able to step back through their editing session.

### Color Harmony Tools
The editor should offer tools for generating harmonious color palettes—complementary, analogous, triadic relationships from a selected base color.

### Import/Export
Users should be able to import colors from external sources (Figma, Adobe, CSS files) and export the current palette in multiple formats.

### Animation Preview
When editing animation tokens, preview actual motion. Slider to scrub through duration. Side-by-side comparison of timing functions.

### Effect Comparison
Toggle effects on/off to see impact. A/B preview of blur levels. Focus ring preview on interactive elements.

### Theme Comparison
View same tokens across different themes. See how RadOS shadows differ from Phase shadows. Understand theme identity through token differences.

---

## Research Notes

### Complexity Assessment
**Medium** — Standard UI patterns with some specialized math for accessibility calculations.

### Research Required

**Color Picker Implementation**
- Native macOS color picker integration via Tauri
- Custom color picker UI patterns (saturation/brightness square, hue slider)
- Color space support: hex, RGB, HSL, OKLCH

**WCAG Contrast Calculation**
- Relative luminance formula
- Contrast ratio algorithm (WCAG 2.1 AA/AAA thresholds)
- Real-time contrast checking as colors change

**Animation Token Preview**
- Bezier curve editor for timing functions
- Animation duration visualization
- Side-by-side timing function comparison

### Search Terms
```
"tauri native color picker macos"
"wcag contrast ratio algorithm"
"relative luminance calculation"
"css color space conversion rust"
"bezier curve editor javascript"
"lightningcss custom properties parsing"
```

### Rust Backend Integration

| Module | Purpose |
|--------|---------|
| CSS Parser | Parse `@theme` block, extract token definitions |
| File Watcher | Detect external changes to token files |
| Token Updater | Modify token values, regenerate valid CSS |

**Key Crate:** `lightningcss` for CSS parsing and manipulation

**Commands Needed:**
- `parse_tokens(path)` → Token list with values
- `update_token(path, name, value)` → Write updated CSS
- `validate_contrast(fg, bg)` → Contrast ratio result

### Open Questions
- Should color picker be native (macOS) or custom (web-based)?
- How to handle OKLCH color space (newer, better perceptual uniformity)?
- Animation preview: CSS animations in preview panel, or dedicated visualizer?
