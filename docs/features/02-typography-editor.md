# Typography Editor

## Purpose

The Typography Editor manages text styling across the design system. It provides visual control over font families, sizes, weights, line heights, and spacing for all typographic elements, with changes persisting to the typography source files.

---

## Typography Scale

### Heading Hierarchy
Semantic heading levels with distinct visual treatments.

- **H1** — Page titles, hero text, primary headings
- **H2** — Section headings, major divisions
- **H3** — Subsection headings, card titles
- **H4** — Group headings, list titles
- **H5** — Minor headings, labels with emphasis
- **H6** — Smallest headings, overlines, captions

Each level maintains clear visual hierarchy while respecting accessibility requirements for heading structure.

### Body Text
Standard text elements for content.

- **Paragraph (p)** — Primary body text
- **List items (li)** — Ordered and unordered list content
- **Links (a)** — Interactive text with distinct styling
- **Labels** — Form labels and UI text
- **Captions** — Supporting text, image captions

### Display Text
Large-format text for impact.

- **Display Large** — Hero sections, landing pages
- **Display Medium** — Feature callouts
- **Display Small** — Emphasized sections

---

## Font Management

### Font Families
Control over typeface selection for different purposes.

**Font Categories:**
- **Heading Font** — Used for all heading levels
- **Body Font** — Used for paragraphs and general text
- **Mono Font** — Used for code and technical content
- **Display Font** — Optional, for large display text

### Font Sources
Fonts can come from multiple sources.

**System Fonts:**
- Pre-installed operating system fonts
- No loading delay, maximum compatibility
- Limited design options

**Web Fonts:**
- Google Fonts, Adobe Fonts, other CDN sources
- Wide selection, consistent cross-platform
- Requires network request

**Custom Fonts:**
- Self-hosted font files
- Full control over licensing and availability
- Uploaded and managed within RadFlow

### Font Upload
Adding custom fonts to the design system.

**Behavior:**
- Upload font files (woff, woff2, ttf, otf)
- Specify font family name
- Define font weights available
- Indicate style variants (normal, italic)
- System generates appropriate font-face declarations

### Font Preview
Fonts are previewed with actual design system text.

**Behavior:**
- Sample text shows each available weight
- Preview updates when switching fonts
- Side-by-side comparison available
- Shows how font renders at various sizes

---

## Style Properties

### Size
Font size controls with responsive scaling.

**Properties:**
- Base size value
- Fluid scaling range (min and max)
- Viewport-relative scaling factor
- Preview at multiple viewport widths

### Weight
Font weight selection from available options.

**Properties:**
- Numeric weight value (100-900)
- Named weight mapping (light, regular, medium, bold)
- Weight constrained to available font weights
- Fallback behavior for unavailable weights

### Line Height
Vertical spacing between lines of text.

**Properties:**
- Unitless ratio (preferred: 1.5)
- Absolute value option
- Tighter for headings, looser for body text
- Affects readability and visual density

### Letter Spacing
Horizontal space between characters.

**Properties:**
- Em-relative values
- Tighter for large text, normal for body
- Affects readability and visual character

### Text Transform
Case transformation options.

**Options:**
- None (preserve original case)
- Uppercase (all capitals)
- Lowercase (all lowercase)
- Capitalize (first letter of each word)

---

## Fluid Typography

### Responsive Scaling
Typography that scales smoothly across viewport sizes.

**Concept:**
- Minimum size at smallest viewport
- Maximum size at largest viewport
- Smooth interpolation between
- No jarring breakpoint jumps

### Scale Configuration
Controls for fluid behavior.

**Parameters:**
- Minimum viewport width (where min size applies)
- Maximum viewport width (where max size applies)
- Minimum font size
- Maximum font size
- Easing curve (linear or custom)

### Scale Preview
Visualization of scaling behavior.

**Features:**
- Slider to simulate viewport width
- Real-time size display at each width
- Graph showing scale curve
- Compare multiple elements simultaneously

---

## Editing Experience

### Live Preview
Typography changes preview immediately on actual content.

**Behavior:**
- Edit heading → all headings on page update
- Changes reflect across all matching elements
- Preview shows multiple instances for context
- Scroll through page while editing

### Sample Text Display
Each typography level shows representative sample text.

**Features:**
- Default sample text for each element type
- Custom sample text option
- Multiple paragraphs for body text
- Various lengths to show line breaking

### Property Panels
Grouped controls for related properties.

**Organization:**
- Font selection panel
- Size and scale panel
- Spacing panel (line height, letter spacing)
- Style panel (weight, transform)

### Inline Editing
Click-to-edit for quick adjustments.

**Behavior:**
- Click a property value to edit
- Slider controls for numeric values
- Dropdown for enumerated options
- Enter to commit, Escape to cancel

---

## Hierarchy Visualization

### Scale Relationship
Visual display of the complete type scale.

**Features:**
- All levels displayed together
- Clear size progression visible
- Ratio between levels shown
- Identify gaps or inconsistencies

### Contrast with Background
Typography previewed against various backgrounds.

**Combinations:**
- Text on surface-primary
- Text on surface-secondary
- Inverse text on dark backgrounds
- Accent text colors

---

## Persistence

### What Gets Saved
Typography changes persist to specific locations.

**Saved Properties:**
- Font family assignments
- Size values (including fluid definitions)
- Weight values
- Line height values
- Letter spacing values
- Text transform rules

### Target Locations
Different properties save to appropriate files.

**Destinations:**
- Element styles → base layer definitions
- Font face declarations → font configuration
- Font assignments → typography configuration
- Custom fonts → asset directory

### Change Tracking
Typography modifications tracked like other changes.

**Behavior:**
- Pending indicator on modified properties
- Total pending count in tab header
- Save all commits all typography changes
- Reset discards all pending typography changes

---

## Ideal Behaviors

### Visual Type Scale Generator
Given a base size and scale ratio, automatically generate a harmonious type scale for all heading levels.

### Accessibility Checking
Automatic verification that type sizes meet minimum accessibility requirements. Warnings for sizes below recommended minimums.

### Font Pairing Suggestions
Based on selected heading font, suggest complementary body fonts that pair well typographically.

### Performance Preview
Indicate font file sizes and estimated loading impact. Suggest system font alternatives for performance-critical situations.

### Character Set Preview
Show available characters in selected font. Identify missing glyphs for required languages.

### Vertical Rhythm Tools
Calculate and visualize baseline grid alignment. Suggest line-height and spacing values that maintain consistent vertical rhythm.

### Responsive Testing
Preview typography at common device breakpoints. Side-by-side comparison of mobile, tablet, desktop rendering.

### Export Options
Export type scale as design tokens, CSS custom properties, or Tailwind configuration. Share typography decisions across projects.
