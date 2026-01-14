# Design System Documentation Plan

**Created:** 2026-01-11
**Status:** Planning
**Purpose:** Create comprehensive design system documentation that enables AI (Claude/Cursor) to generate on-brand UI components

---

## Overview

This plan defines a **modular documentation system** for themes. Each theme gets:
1. A **core design system document** (DESIGN_SYSTEM.md) - quick reference + principles
2. **Deep-dive modules** - detailed specs per category
3. **Example library** - code + visual mockups

The documentation serves as context for AI code generation, enabling Claude/Cursor to produce consistent, on-brand components without constant correction.

---

## Document Structure

```
packages/theme-rad-os/
├── DESIGN_SYSTEM.md              # Core doc (entry point)
├── docs/
│   ├── 01-principles.md          # Philosophy, aesthetic, emotional tone
│   ├── 02-colors.md              # Full color specification
│   ├── 03-typography.md          # Fonts, scale, usage
│   ├── 04-spacing-layout.md      # Spacing scale, grid, containers
│   ├── 05-shadows-depth.md       # Shadow system, elevation
│   ├── 06-borders-radius.md      # Border styles, radius scale
│   ├── 07-interactions.md        # Hover, active, focus, animations
│   ├── 08-components.md          # Component patterns, variants
│   ├── 09-dark-mode.md           # Dark mode philosophy, token swaps
│   ├── 10-dont-do.md             # Anti-patterns, common mistakes
│   └── examples/
│       ├── buttons.md            # Button examples with mockups
│       ├── cards.md              # Card examples
│       ├── forms.md              # Form examples
│       └── layouts.md            # Page layout examples
```

---

## Core Document: DESIGN_SYSTEM.md

### Purpose
Single entry point that AI reads first. Contains:
- Quick reference (tokens, key values)
- Links to deep-dive modules
- Most important principles front-loaded

### Structure

```markdown
# {Theme Name} Design System

## Quick Reference (AI: Read This First)
- Primary colors: {3-5 key colors with hex}
- Typography: {heading font} + {body font}
- Key aesthetic: {2-3 word description}
- Shadow style: {1 line description}
- Border radius: {default value}

## Design Philosophy
{2-3 paragraphs on the aesthetic, mood, influences}

## Token Overview
{Table of semantic tokens with values}

## Component Patterns
{Quick reference for common patterns}

## Deep Dives
- [Principles](docs/01-principles.md)
- [Colors](docs/02-colors.md)
- ...

## Anti-Patterns (Don't Do This)
{Top 5-10 most common mistakes}
```

---

## Module Specifications

### 01-principles.md

**Content:**
- Aesthetic philosophy (retro-modern, warm, playful)
- Historical influences (80s/90s computing, pixel art)
- Emotional tone (friendly, approachable, nostalgic)
- Design tensions (retro vs modern, playful vs professional)
- Core principles (3-5 memorable rules)

**Format:**
```markdown
# Design Principles

## Aesthetic Philosophy
{Prose description}

## Influences
- {Influence 1}: {How it manifests}
- {Influence 2}: {How it manifests}

## Emotional Tone
{What users should feel}

## Core Principles
1. **{Principle Name}**: {Description}
2. ...

## The RadOS "Feel"
{Sensory description AI can use for guidance}
```

---

### 02-colors.md

**Content:**
- Complete brand palette (all colors with hex, RGB, HSL)
- Semantic token mappings (which brand color → which token)
- Color usage rules (when to use each)
- Color combinations (approved pairings)
- Accessibility notes (contrast ratios)

**Format:**
```markdown
# Color System

## Brand Palette
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Sun Yellow | #FCE184 | 252,225,132 | Primary accent, CTAs |

## Semantic Tokens
### Surfaces
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|

### Content (Text/Icons)
...

### Edges (Borders)
...

## Color Combinations
### ✅ Approved Pairings
- Sun Yellow bg + Black text (primary CTA)
- ...

### ❌ Avoid
- Sun Yellow text on Warm Cloud (low contrast)
- ...

## Accessibility
{Contrast ratios, WCAG compliance notes}
```

---

### 03-typography.md

**Content:**
- Font stack (primary, secondary, code)
- Type scale (all sizes with px and rem)
- Line height rules
- Font weight usage
- Heading hierarchy
- Body text rules
- Special text (code, quotes, captions)

**Format:**
```markdown
# Typography

## Font Stack
| Role | Font | Fallback | Character |
|------|------|----------|-----------|
| Headings | Joystix | monospace | Retro, blocky |
| Body | Mondwest | sans-serif | Warm, readable |
| Code | PixelCode | monospace | Pixel-perfect |

## Type Scale
| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| 4xl | 2.25rem | 1.1 | Hero headlines |

## Usage Rules
### Headings
- h1: {usage}
- h2: {usage}
...

### Body Text
{Rules for paragraph styling}

### Code
{Rules for inline and block code}

## Examples
{Code + ASCII mockup of typography in use}
```

---

### 04-spacing-layout.md

**Content:**
- Spacing scale (4px base, all increments)
- Component internal spacing
- Component external spacing (margins)
- Grid system (if any)
- Container widths
- Responsive breakpoints

---

### 05-shadows-depth.md

**Content:**
- Shadow philosophy (hard pixel shadows)
- Shadow scale (btn, card, elevated)
- Elevation levels
- Light mode shadows (offset-based)
- Dark mode shadows (glow-based)
- When to use each level

**Format:**
```markdown
# Shadows & Depth

## Philosophy
RadOS uses **hard pixel shadows** (no blur) in light mode,
creating a retro 1980s computer interface aesthetic.

## Shadow Scale
| Name | Value | Usage |
|------|-------|-------|
| shadow-btn | 0 1px 0 0 black | Buttons default |
| shadow-btn-hover | 0 3px 0 0 black | Buttons hover |
| shadow-card | 2px 2px 0 0 black | Cards |

## Light Mode Shadows
{Detailed explanation with examples}

## Dark Mode Shadows
{Glow system explanation}

## Elevation Hierarchy
1. Base (no shadow)
2. Raised (shadow-card)
3. Floating (shadow-card-lg)
4. Overlay (shadow-card-hover)

## ❌ Don't
- Never use blurred shadows (box-shadow with blur radius)
- Never use gray shadows (always pure black or yellow glow)
```

---

### 06-borders-radius.md

**Content:**
- Border width scale
- Border color usage
- Border radius scale
- When to use each radius
- Combination patterns

---

### 07-interactions.md

**Content:**
- Hover states (lift effect)
- Active states (press effect)
- Focus states (ring style)
- Disabled states
- Transition timing
- Animation keyframes
- Micro-interactions

**Format:**
```markdown
# Interactions & Animation

## The "Lift and Press" Pattern
RadOS buttons and interactive elements use a signature
physical interaction pattern:

### Hover
- Element lifts up: `transform: translateY(-2px)`
- Shadow deepens: `shadow-btn` → `shadow-btn-hover`

### Active (Click)
- Element presses down: `transform: translateY(2px)`
- Shadow disappears: `shadow-none`

### Focus
- Blue ring: `ring-2 ring-focus ring-offset-2`

## Transition Timing
| Duration | Easing | Usage |
|----------|--------|-------|
| 150ms | ease-out | Fades, scales |
| 200ms | ease-out | Slides, transforms |

## Keyframe Animations
{List with usage}

## ❌ Don't
- Never use bounce easing (too playful)
- Never exceed 300ms for UI transitions
```

---

### 08-components.md

**Content:**
- Component philosophy
- Variant system explanation
- Size system explanation
- State handling patterns
- Composition patterns
- Slot/children patterns

---

### 09-dark-mode.md

**Content:**
- Dark mode philosophy (not just inversion)
- Token swaps (what changes)
- Shadow transformation (offset → glow)
- Color adjustments
- Testing checklist

---

### 10-dont-do.md

**Content:**
- Visual anti-patterns (with mockups)
- Code anti-patterns
- Common AI mistakes
- Accessibility violations
- Brand violations

**Format:**
```markdown
# Anti-Patterns (Don't Do This)

## Visual Anti-Patterns

### ❌ Blurred Shadows
```
WRONG:
┌─────────────────┐
│     Button      │ ← soft shadow (blur)
└─────────────────┘
  ░░░░░░░░░░░░░░░

RIGHT:
┌─────────────────┐
│     Button      │ ← hard pixel shadow
└─────────────────┘
 █████████████████
```

### ❌ Wrong Color Combinations
{Examples}

### ❌ Over-Rounded Corners
{Examples}

## Code Anti-Patterns

### ❌ Hardcoded Colors
```tsx
// WRONG
<div className="bg-[#FCE184]">

// RIGHT
<div className="bg-surface-tertiary">
```

### ❌ Missing Semantic Tokens
{Examples}

## Common AI Mistakes
1. Using Material Design shadow patterns
2. Adding too much border radius
3. Using gray instead of black for borders
4. Forgetting dark mode token swaps
5. Over-animating (too bouncy)
```

---

## Example Library

Each example file contains:
1. Use case description
2. Code snippet
3. ASCII visual mockup
4. Variant examples
5. Do's and Don'ts specific to that component

### Example Format

```markdown
# Button Examples

## Primary Button (Default)

### Use Case
Main call-to-action, form submissions, primary actions.

### Code
```tsx
<Button variant="primary" size="md">
  Get Started
</Button>
```

### Visual
```
┌─────────────────┐
│   Get Started   │  ← Sun Yellow bg, Black text
└─────────────────┘
 ████████████████   ← 1px black shadow (hard)
```

### States
```
Default:        Hover:          Active:
┌──────────┐   ┌──────────┐    ┌──────────┐
│  Button  │   │  Button  │    │  Button  │
└──────────┘   └──────────┘    └──────────┘
 ██████████    ↑ lifted        (pressed, no shadow)
               ████████████
```

### ✅ Do
- Use for primary actions
- Limit to 1-2 per view

### ❌ Don't
- Don't use for navigation links
- Don't use multiple primary buttons in same section
```

---

## Template vs Filled

The structure above serves as a **template**. Each theme fills it with their specific values:

| Section | Template Provides | Theme Fills In |
|---------|-------------------|----------------|
| principles.md | Structure, questions | Philosophy, influences, tone |
| colors.md | Table format, categories | Actual hex values, mappings |
| typography.md | Scale structure | Font names, sizes |
| shadows.md | Categories | Shadow values, philosophy |
| interactions.md | Pattern names | Timing, transforms |
| dont-do.md | Example format | Theme-specific anti-patterns |

---

## Questions for You

Before I create the full template, I'd like to confirm:

### Q1: AI Context Loading
How should AI load this documentation?
- A) Single file (concatenate all modules into DESIGN_SYSTEM.md)
- B) Modular with imports (AI reads core, fetches modules as needed)
- C) Tiered (always load core + principles, load others on demand)

### Q2: Visual Mockup Style
For the ASCII mockups, should they be:
- A) Simple boxes (like above)
- B) More detailed with content hints
- C) Multiple variations per component

### Q3: Code Example Depth
How much code context per example?
- A) Minimal (just the component JSX)
- B) With imports and props
- C) Full file context (imports, types, usage)

### Q4: RadOS-Specific Content
Should I draft the RadOS content now, or create the empty template first?
- A) Template first, then fill RadOS as example
- B) RadOS first (as the primary example), extract template from it
- C) Both in parallel

---

## Implementation Phases

### Phase 1: Template Creation
- [ ] Create DESIGN_SYSTEM.md template
- [ ] Create module templates (01-10)
- [ ] Create example template

### Phase 2: RadOS Content
- [ ] Fill principles from exploration
- [ ] Fill colors from tokens.css
- [ ] Fill typography from typography.css
- [ ] Fill shadows from tokens.css
- [ ] Fill interactions from components
- [ ] Create don't-do list
- [ ] Create 4-6 component examples

### Phase 3: Validation
- [ ] Test with Claude (can it generate correct components?)
- [ ] Test with Cursor (same test)
- [ ] Iterate based on AI mistakes

### Phase 4: Theme Template
- [ ] Extract generic template from RadOS
- [ ] Document how to fill for new themes
- [ ] Add to theme creation wizard

---

## Success Criteria

The documentation is successful when:
1. AI can generate a Button that matches RadOS without correction
2. AI can generate a Card that matches RadOS without correction
3. AI knows to use hard shadows, not blurred
4. AI knows to use semantic tokens, not hardcoded colors
5. AI can explain why a design choice is "not RadOS"
6. AI can generate dark mode variants correctly

---

## Notes

{Space for discussion notes}
