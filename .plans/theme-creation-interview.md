# Theme Creation Interview Process

This document captures the iterative process of creating a theme from scratch, which will inform the design of a comprehensive theme creation prompt.

---

## Interview Log

### Question 1: Theme Identity

**Asked:** What is the name/identity of this theme? What project or brand is it for?

**Answer:** Existing brand - has existing brand guidelines, Figma files, or design system

---

### Question 2: Brand Sources

**Asked:** What design sources do you have? (Figma files, style guides, existing code, etc.)

**Answer:**
- Figma mockups (design files but no formal design system/tokens)
- Style guide/PDF (brand guidelines document with colors, fonts, usage rules)

**Action:** User to paste Figma file links and/or upload style guide reference

---

### Question 3: Theme Name

**Asked:** What should this theme be called? This becomes the package name (@radflow/theme-{name})

**Answer:** Phase → `@radflow/theme-phase`

---

### Question 4: Primary Brand Color

**Asked:** What is the primary/hero color for Phase? (The main brand color used for CTAs, highlights, key UI elements)

**Answer:** Extract from Figma - will provide full file URL

**Figma URL:** https://www.figma.com/design/9j2y6LylNwDsWqW07wAsTR/Untitled?node-id=1-365&m=dev

**Extracted Colors (from Figma MCP):**
```
100:           #f3eed9  (cream/warm white - text, accents)
200:           #fce184  (yellow/gold - primary highlights)
300:           #80d0ff  (light blue - accent)
400:           #80d0ff  (light blue - same as 300)
500:           #6676ff  (purple/indigo - accent)
Background 1:  #0f0c0e  (dark background)
Text:          #f3eed9  (primary text)
Grey Text:     #9a957e  (muted/secondary text)
Background 2:  #f3eed90d (subtle overlay, 5% opacity cream)
Outline 1/2:   #f3eed933 (borders, 20% opacity cream)
```

**Design Notes:**
- Dark-mode first design
- Warm cream text (#f3eed9) on near-black (#0f0c0e)
- Yellow/gold (#fce184) as primary accent (CTAs, highlights)
- Blue (#80d0ff, #6676ff) as secondary accents
- Muted olive-grey (#9a957e) for secondary text

---

### Question 5: Semantic Token Mapping

**Asked:** How should these Figma colors map to RadFlow semantic tokens?

**Answer:** Define base colors first, discover semantic mapping through component implementation. Don't force semantic names upfront - let usage reveal the right abstractions.

**Initial Base Colors for Phase:**
```css
--color-cream: #f3eed9;
--color-gold: #fce184;
--color-blue: #80d0ff;
--color-indigo: #6676ff;
--color-black: #0f0c0e;
--color-grey: #9a957e;
```

---

### Question 6: Typography

**Asked:** What fonts does Phase use? (Extract from Figma or specify)

**Answer:** User specified Google Fonts:
- **Heading:** Audiowide - https://fonts.google.com/specimen/Audiowide
- **Body:** Outfit - https://fonts.google.com/specimen/Outfit
- **Mono:** Kode Mono - https://fonts.google.com/specimen/Kode+Mono

---

### Question 7: Border Radius

**Asked:** What corner radius style does Phase use?

**Answer:** Sharp (0-2px) - minimal rounding, almost square corners

```css
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 8px;
```

---

### Question 8: Shadows & Depth

**Asked:** What shadow/elevation style does Phase use?

**Answer:** None/Minimal - flat design, relies on borders and color contrast for depth

```css
--shadow-sm: none;
--shadow-md: 0 1px 2px rgba(0,0,0,0.1);
--shadow-lg: 0 2px 4px rgba(0,0,0,0.15);
```

---

### Question 9: Button Styles

**Asked:** How are buttons styled in Phase?

**Figma URL:** https://www.figma.com/design/9j2y6LylNwDsWqW07wAsTR/Untitled?node-id=6-4831&m=dev

**Answer:** Tinted glass effect buttons with color variants

**Button Variants:**
| Variant | Background | Border |
|---------|------------|--------|
| Default | `rgba(243,238,217,0.05)` | `rgba(243,238,217,0.2)` |
| Blue | `rgba(128,208,255,0.1)` | `rgba(128,208,255,0.5)` |
| Purple | `rgba(153,163,255,0.1)` | `rgba(153,163,255,0.5)` |
| Green | `rgba(142,242,217,0.1)` | `rgba(142,242,217,0.5)` |
| Disabled | purple at 25% opacity | |
| Text | transparent, no border | arrow icon |

**Button Pattern:**
- Height: 40px
- Font: Outfit Bold, 16px, uppercase
- Text color: always cream (#f3eed9)
- Right side: 40x40px icon area
- No border-radius (sharp corners)
- Glass effect: 10% opacity bg, 50% opacity border

---

### Question 10: Card Styles

**Asked:** How are cards/containers styled?

**Answer:** Same glass effect as buttons - semi-transparent background + subtle border

```css
/* Card base */
background: rgba(243, 238, 217, 0.05);
border: 1px solid rgba(243, 238, 217, 0.2);
```

---

### Question 11: Input/Form Styles

**Asked:** How are form inputs styled?

**Figma URL:** https://www.figma.com/design/9j2y6LylNwDsWqW07wAsTR/Untitled?node-id=1-2061&m=dev

**Answer:** Same glass effect, consistent with buttons/cards

**Form Pattern:**
- Section headers: `// SECTION NAME` (Audiowide, uppercase)
- Labels: Kode Mono, uppercase, small, grey (#9a957e)
- Input fields: Glass effect bg + subtle border
- Placeholder text: Muted grey
- Select dropdowns: Same style with chevron icon
- Textareas: Same glass effect, taller

```css
/* Input base */
background: rgba(243, 238, 217, 0.05);
border: 1px solid rgba(243, 238, 217, 0.2);
color: #f3eed9;
font-family: 'Outfit', sans-serif;
```

---

### Question 12: Navigation/Header

**Asked:** What does the navigation/header look like?

**Figma URL:** https://www.figma.com/design/9j2y6LylNwDsWqW07wAsTR/Untitled?node-id=1-2049&m=dev

**Answer:** Horizontal bar with equal-width nav cells

**Navigation Pattern:**
- Height: 97px
- Logo: Cream bg (#f3eed9) with dark icon + "PHASE" wordmark
- Tagline: "STAKE // DELEGATE // TAXES" (Kode Mono, grey)
- Nav links: Equal-width cells, Outfit SemiBold 18px, uppercase
- Default state: Glass effect bg
- Active state: Purple tint (`rgba(153,163,255,0.15)`)
- Borders: Background-1 color (#0f0c0e) between items
- Hamburger menu on right

---

### Question 13: Footer

**Asked:** What does the footer look like?

**Figma URL:** https://www.figma.com/design/9j2y6LylNwDsWqW07wAsTR/Untitled?node-id=1-2116&m=dev

**Answer:** Minimal footer with large watermark

**Footer Pattern:**
- Large "PHASE" watermark (very subtle, dark on dark)
- "EST. 2021" on left
- Links in center: "TAX // STAKE // DELEGATION // CONTACT // BLOG"
- "LEGAL" on right
- Uses `//` separator pattern consistent with brand

---

### Question 14: Icons/Iconography

**Asked:** What icons or iconography does Phase use?

**Answer:** Phosphor Icons (https://phosphoricons.com/)

---

### Question 15: Special Components

**Asked:** Are there any unique/special components specific to Phase?

**Answer:** Yes - Web3 components, staking pages, analytics screens exist in Figma.
**Approach:** Start with basics first - re-skin RadFlow's /ui components. Create dedicated Phase component library later.

---

## Extracted Patterns

### Design Language Summary

**Phase** is a dark-mode-first Web3 brand with:

1. **Color Philosophy:** Warm cream (#f3eed9) on near-black (#0f0c0e), with gold (#fce184) and blue (#80d0ff, #6676ff) accents

2. **Glass Effect:** Consistent across all components
   - Background: 5-10% opacity cream
   - Border: 20-50% opacity of accent color
   - Creates depth without shadows

3. **Typography Hierarchy:**
   - Display: Audiowide (futuristic, uppercase)
   - Body: Outfit (clean geometric sans)
   - Code/Labels: Kode Mono

4. **Visual Characteristics:**
   - Sharp corners (0-2px radius)
   - No/minimal shadows
   - `//` separator pattern in text
   - Section headers: `// SECTION NAME`

5. **Component Pattern:**
   - Color variants via accent tinting (blue, purple, green)
   - Active states: stronger tint
   - Disabled: reduced opacity

### Base Colors for Implementation

```css
/* Phase Base Colors */
--color-cream: #f3eed9;
--color-gold: #fce184;
--color-blue: #80d0ff;
--color-indigo: #6676ff;
--color-green: #8ef2d9;
--color-black: #0f0c0e;
--color-grey: #9a957e;

/* Glass Effect Utilities */
--glass-bg: rgba(243, 238, 217, 0.05);
--glass-border: rgba(243, 238, 217, 0.2);
--glass-bg-blue: rgba(128, 208, 255, 0.1);
--glass-border-blue: rgba(128, 208, 255, 0.5);
--glass-bg-purple: rgba(153, 163, 255, 0.1);
--glass-border-purple: rgba(153, 163, 255, 0.5);
--glass-bg-green: rgba(142, 242, 217, 0.1);
--glass-border-green: rgba(142, 242, 217, 0.5);
```

### Fonts

- **Heading:** [Audiowide](https://fonts.google.com/specimen/Audiowide)
- **Body:** [Outfit](https://fonts.google.com/specimen/Outfit)
- **Mono:** [Kode Mono](https://fonts.google.com/specimen/Kode+Mono)

---

## Final Prompt Template

### Theme Creation Prompt (v1)

Use this comprehensive prompt to create a new RadFlow theme. Fill in the sections below, then an AI agent can generate the complete theme package.

---

```markdown
# Theme Creation Request

## 1. IDENTITY

**Theme Name:** [e.g., Phase, Midnight, Corporate]
**Package Name:** @radflow/theme-[name]
**Description:** [One sentence describing the theme's purpose/vibe]

## 2. SOURCES

**Figma File:** [URL to main Figma file]
**Key Nodes:**
- Home/Hero: [node-id]
- Buttons: [node-id]
- Forms: [node-id]
- Navigation: [node-id]
- Cards: [node-id]

**Style Guide:** [URL or description if available]

## 3. COLORS

Extract from Figma or specify manually:

| Name | Hex | Usage |
|------|-----|-------|
| [name] | #[hex] | [primary bg / text / accent / etc.] |

**Color Mode:** [ ] Light-first  [ ] Dark-first  [ ] Both

## 4. TYPOGRAPHY

| Role | Font Name | Google Fonts URL |
|------|-----------|------------------|
| Heading | [name] | [url] |
| Body | [name] | [url] |
| Mono | [name] | [url] |

## 5. SHAPE & DEPTH

**Border Radius:**
- [ ] Sharp (0-2px)
- [ ] Subtle (4-8px)
- [ ] Rounded (12-16px)
- [ ] Pill (full)

**Shadows:**
- [ ] None/Flat
- [ ] Subtle
- [ ] Prominent
- [ ] Glows/Effects

**Special Effects:** [e.g., glass/frosted effect, gradients, etc.]

## 6. COMPONENT PATTERNS

**Button Style:**
- Background approach: [solid / outline / glass / gradient]
- Variants: [list color variants if any]
- Special features: [icon placement, hover effects, etc.]

**Card Style:**
- Background: [solid / glass / bordered]
- Borders: [visible / subtle / none]

**Input Style:**
- Background: [solid / transparent / glass]
- Border style: [underline / full border / none]
- Focus state: [ring / border color / glow]

## 7. ICONS

**Icon Library:** [Phosphor / Lucide / Heroicons / Custom / RadOS]
**Icon Style:** [Regular / Bold / Thin / Duotone]

## 8. SPECIAL PATTERNS

List any unique design patterns specific to this brand:
- [e.g., "// SECTION" header format]
- [e.g., separator characters between nav items]
- [e.g., specific animation preferences]

## 9. IMPLEMENTATION APPROACH

- [ ] Re-skin existing RadFlow/UI components first
- [ ] Create custom components immediately
- [ ] Both in parallel

**Priority Components:** [list most important components to style first]

---

**Additional Context:**
[Any other information about the brand, constraints, or preferences]
```

---

### Example: Phase Theme (Completed)

```markdown
# Theme Creation Request

## 1. IDENTITY

**Theme Name:** Phase
**Package Name:** @radflow/theme-phase
**Description:** Dark-mode Web3 brand with warm cream text and glass-effect components

## 2. SOURCES

**Figma File:** https://www.figma.com/design/9j2y6LylNwDsWqW07wAsTR/Untitled
**Key Nodes:**
- Home/Hero: 1-365
- Buttons: 6-4831
- Forms: 1-2061
- Navigation: 1-2049
- Footer: 1-2116

## 3. COLORS

| Name | Hex | Usage |
|------|-----|-------|
| cream | #f3eed9 | Primary text, light accents |
| gold | #fce184 | Primary CTA, highlights |
| blue | #80d0ff | Secondary accent |
| indigo | #6676ff | Tertiary accent |
| green | #8ef2d9 | Success states |
| black | #0f0c0e | Primary background |
| grey | #9a957e | Muted text, labels |

**Color Mode:** [x] Dark-first

## 4. TYPOGRAPHY

| Role | Font Name | Google Fonts URL |
|------|-----------|------------------|
| Heading | Audiowide | https://fonts.google.com/specimen/Audiowide |
| Body | Outfit | https://fonts.google.com/specimen/Outfit |
| Mono | Kode Mono | https://fonts.google.com/specimen/Kode+Mono |

## 5. SHAPE & DEPTH

**Border Radius:** [x] Sharp (0-2px)

**Shadows:** [x] None/Flat

**Special Effects:** Glass effect - 5-10% opacity backgrounds with 20-50% opacity borders

## 6. COMPONENT PATTERNS

**Button Style:**
- Background approach: glass (tinted transparent)
- Variants: default (cream), blue, purple, green
- Special features: 40x40 icon area on right, uppercase text

**Card Style:**
- Background: glass effect
- Borders: subtle cream at 20% opacity

**Input Style:**
- Background: glass effect
- Border style: full border at 20% opacity
- Focus state: border color change

## 7. ICONS

**Icon Library:** Phosphor
**Icon Style:** Regular

## 8. SPECIAL PATTERNS

- `// SECTION NAME` header format
- `//` separator between nav/footer links
- Color tinting for variants (10% bg, 50% border)
- Large watermark text in footer

## 9. IMPLEMENTATION APPROACH

- [x] Re-skin existing RadFlow/UI components first
- [ ] Create custom components immediately

**Priority Components:** Button, Card, Input, Dialog, Navigation
```
