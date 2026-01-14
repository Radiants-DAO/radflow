# Typography Editor

## Purpose

The Typography Editor provides a styleguide view of all HTML text elements and a Properties Panel for quick edits. It's where designers define how base HTML elements look across the entire theme.

**Typography Editor owns:**
- HTML element base styles (h1-h6, p, a, li, etc.)
- Font management (add/link/upload fonts)
- Font assignments (which font for headings vs body)

**What it doesn't own:**
- Component-specific text styles (Component Browser)
- Design tokens like colors (Variables Editor)
- Arbitrary inline styles (not allowed — prompt for custom classes)

---

## Styleguide View

### HTML Elements
All styleable text elements displayed as a living styleguide.

| Element | Description |
|---------|-------------|
| `body` | Base font, size, color for all pages |
| `h1` - `h6` | Heading hierarchy |
| `p` | Paragraph text |
| `a` | Links (includes hover, visited states) |
| `ul`, `ol` | List containers |
| `li` | List items |
| `strong` | Bold/important text |
| `em` | Italic/emphasized text |
| `blockquote` | Quoted text blocks |
| `code` | Inline code |
| `pre` | Code blocks |
| `label` | Form labels |
| `figcaption` | Image/figure captions |

### Live Preview
Each element renders with actual theme styles.

**Display:**
```
H1 Heading
═══════════════════════════════════

H2 Heading
───────────────────────────────────

H3 Heading

Paragraph text that shows how body copy looks.
This should be long enough to demonstrate line
height and reading comfort.

• List item one
• List item two

Link text

**Strong text** and *emphasized text*

> Blockquote showing quoted text

`inline code`
```

### Click to Select
Click any element in styleguide → Properties Panel shows its styles.

---

## Properties Panel

### Context-Aware Controls
When an element is selected, show relevant quick-edit controls.

**For Text Elements (h1-h6, p, etc.):**

| Property | Control | Options |
|----------|---------|---------|
| Font family | Dropdown | Available fonts |
| Font size | Dropdown | From scale (xs, sm, base, lg, xl) |
| Font weight | Dropdown | Available weights (400, 500, 700) |
| Line height | Dropdown | From scale (tight, normal, relaxed) |
| Letter spacing | Dropdown | From scale (tight, normal, wide) |
| Text align | Buttons | `[L] [C] [R] [J]` |
| Text transform | Buttons | `[Aa] [AA] [aa]` |
| Color | Token picker | Content tokens only |

**For Links (a):**
- Same as above, plus:
- Text decoration toggle (underline on/off)
- Hover state section

**For Lists (ul, ol):**
- List style (disc, decimal, none)

**For Code (code, pre):**
- Background (surface tokens)
- Font family (mono fonts)

### Tag Conversion
Change element type in Properties Panel or via right-click on page.

**Dropdown:**
```
Element: [h1 ▼]
         ├─ h1
         ├─ h2
         ├─ h3
         ├─ p
         └─ span
```

**Behavior:**
- Select new tag
- Source file updates
- Inherits new tag's base styles
- Clean conversion (no style preservation)

### What's NOT in Properties Panel

**Not Available:**
- Arbitrary pixel values (use scale)
- Custom hex colors (use tokens)
- Inline style overrides
- Custom margins/padding

**Want custom styling?** → Prompt the agent to create a proper class.

---

## Font Manager

### Available Fonts
View fonts currently in theme.

**Display:**
```
FONTS
─────────────────────────
Joystix Monospace
  Weights: 400

Mondwest
  Weights: 400, 700

[+ Add Font]
```

### Add Font

**Link (Google Fonts, CDN):**
1. Click [+ Add Font]
2. Select "Link from URL"
3. Paste URL
4. Font available in dropdowns

**Upload (Local files):**
1. Click [+ Add Font]
2. Select "Upload files"
3. Drop .woff2, .woff, .ttf files
4. Name the font family
5. Assign weights to files

### Font Roles
Which fonts are used where.

```
Headings:  [Joystix ▼]
Body:      [Mondwest ▼]
Mono:      [Joystix ▼]
```

Changing role updates all elements using that role.

---

## Direct Text Editing

### On-Page Editing
Edit text content directly on the canvas.

**Behavior:**
1. Double-click text element
2. Element becomes editable
3. Edit text content
4. Click away or Enter to save
5. Changes write to source file

### Tag Conversion on Page
Right-click text element → change tag type.

**Behavior:**
- Select new tag from context menu
- Element converts in source
- Picks up new tag's base styles

---

## Persistence

### Where Styles Save

| Change | Destination |
|--------|-------------|
| Element styles | `@layer base { h1 { } }` in typography.css |
| Font faces | `@font-face { }` in fonts.css |
| Font files | Theme assets directory |

### Change Tracking
- Pending changes indicated
- Save commits all changes
- Reset discards changes

---

## Ideal Behaviors

### Font Preview
Preview fonts before applying.

### Weight Detection
Auto-detect weights from uploaded font files.

### Contrast Preview
Show contrast ratio when changing text colors.

### Usage Indicators
Show which elements use each font. Identify unused fonts.

---

## Research Notes

### Complexity Assessment
**Medium** — Font file parsing is the main technical challenge.

### Research Required

**Font File Parsing**
- Detect font weights from .woff2, .ttf, .otf files
- Extract font family name, style, weight metadata
- Variable font axis detection (if supporting variable fonts)

**Google Fonts Integration**
- Google Fonts API for browsing/linking fonts
- Font preview before adding to theme
- CDN URL generation

**CSS @font-face Generation**
- Proper @font-face syntax for different formats
- Font-display strategies (swap, fallback, optional)
- Unicode range subsetting (optional optimization)

### Search Terms
```
"parse woff2 font metadata rust"
"ttf font weight detection"
"google fonts api v2"
"css font-face generator"
"variable font axis parsing"
"font subsetting rust"
```

### Rust Backend Integration

| Module | Purpose |
|--------|---------|
| Font Parser | Extract metadata from font files |
| File System | Copy uploaded fonts to theme assets |
| CSS Generator | Generate @font-face declarations |

**Potential Crates:**
- `ttf-parser` — Parse TrueType/OpenType fonts
- `woff2` — Decompress WOFF2 files (if needed for parsing)

**Commands Needed:**
- `parse_font_file(path)` → Font metadata (family, weights, styles)
- `add_font_to_theme(file, theme_id)` → Copy file, update CSS
- `generate_font_face(font_config)` → CSS @font-face string

### Open Questions
- Support variable fonts or just static weights?
- Font preview: render sample text before adding?
- Google Fonts: direct link or download to theme?
