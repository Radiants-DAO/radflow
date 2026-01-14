# RadOS Design System

> **For AI Code Generation**: This document describes the RadOS visual language. Use it to generate consistent, on-brand UI components.

---

## Quick Reference (Read This First)

| Property | Value |
|----------|-------|
| **Primary Color** | Sun Yellow `#FCE184` |
| **Background** | Warm Cloud `#FEF8E2` |
| **Text** | Black `#0F0E0C` |
| **Accent** | Sky Blue `#95BAD2` |
| **Heading Font** | Joystix (monospace, retro) |
| **Body Font** | Mondwest (humanist, warm) |
| **Shadow Style** | Hard pixel offsets (no blur) |
| **Border Radius** | 4px default (subtle, not rounded) |
| **Interaction** | Lift on hover, press on click |

---

## Design Philosophy

### The RadOS Aesthetic

RadOS is a **retro-modern** design system inspired by 1980s-90s computing interfaces. It combines:

- **Warm, inviting colors** (yellows, creams) that feel friendly and approachable
- **Hard pixel shadows** that create a tactile, physical quality
- **Mixed typography** (retro monospace + modern humanist) for visual tension
- **Mechanical interactions** (lift and press) that mimic physical buttons

### Emotional Tone

RadOS should feel:
- **Nostalgic** but not dated
- **Playful** but not childish
- **Warm** but not soft
- **Technical** but not cold

### Core Principles

1. **Retro-Modern Balance**: 80s aesthetics meet modern usability
2. **Physical Interactions**: UI elements behave like mechanical objects
3. **Warm Color Dominance**: Yellow and cream dominate, blue accents
4. **Hard Edges, Soft Curves**: Pixel shadows with subtle border radius
5. **Semantic Everything**: No hardcoded values, all tokens

---

## Color System

### Brand Palette

| Name | Hex | RGB | Character |
|------|-----|-----|-----------|
| **Sun Yellow** | `#FCE184` | 252, 225, 132 | Primary brand, CTAs, energy |
| **Warm Cloud** | `#FEF8E2` | 254, 248, 226 | Backgrounds, calm, space |
| **Black** | `#0F0E0C` | 15, 14, 12 | Text, borders, grounding |
| **Sky Blue** | `#95BAD2` | 149, 186, 210 | Links, focus, trust |
| **Sunset Fuzz** | `#FCC383` | 252, 195, 131 | Warnings, attention |
| **Sun Red** | `#FF6B63` | 255, 107, 99 | Errors, destructive |
| **Green** | `#CEF5CA` | 206, 245, 202 | Success, confirmation |
| **White** | `#FFFFFF` | 255, 255, 255 | Elevated surfaces |

### Semantic Tokens

**Always use semantic tokens, never raw hex values.**

#### Surfaces (Backgrounds)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `surface-primary` | Warm Cloud | Black | Main content areas |
| `surface-secondary` | Black | Warm Cloud | Inverted sections |
| `surface-tertiary` | Sun Yellow | Sun Yellow | Accent backgrounds, CTAs |
| `surface-elevated` | White | Black (lighter) | Cards, modals, dropdowns |

#### Content (Text & Icons)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `content-primary` | Black | Warm Cloud | Body text, headings |
| `content-secondary` | Sun Yellow | Sun Yellow | Secondary emphasis |
| `content-tertiary` | Warm Cloud | Black | Muted, placeholder |
| `content-link` | Sky Blue | Sky Blue | Hyperlinks |

#### Edges (Borders)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `edge-primary` | Black | Warm Cloud | Default borders |
| `edge-secondary` | Sun Yellow | Sun Yellow | Accent borders |
| `edge-focus` | Sky Blue | Sky Blue | Focus rings |

### Color Usage Rules

#### Do

```
┌─────────────────────────────────────┐
│ ████████████████████████████████████│ ← Sun Yellow header
├─────────────────────────────────────┤
│                                     │
│  [Primary Button]  [Outline Button] │ ← Yellow CTA, outlined secondary
│                                     │
│  Body text in black on cream bg     │ ← High contrast
│                                     │
└─────────────────────────────────────┘
  Warm Cloud background
```

#### Don't

- Don't use Sun Yellow text on Warm Cloud (low contrast)
- Don't use gray—use Black at reduced opacity instead
- Don't use gradients (flat colors only)
- Don't mix warm and cool colors equally (warm dominates)

---

## Typography

### Font Stack

| Role | Font | Fallback | Character |
|------|------|----------|-----------|
| **Headings** | Joystix | monospace | Blocky, retro, commanding |
| **Body** | Mondwest | sans-serif | Warm, humanist, readable |
| **Code** | PixelCode | monospace | Pixel-perfect, technical |

### Type Scale

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| `text-4xl` | 2.25rem (36px) | 1.1 | Hero headlines |
| `text-3xl` | 1.875rem (30px) | 1.2 | Page titles |
| `text-2xl` | 1.5rem (24px) | 1.25 | Section headings |
| `text-xl` | 1.25rem (20px) | 1.3 | Subsection headings |
| `text-lg` | 1.125rem (18px) | 1.4 | Large body, intros |
| `text-base` | 0.875rem (14px) | 1.6 | Default body |
| `text-sm` | 0.75rem (12px) | 1.5 | Captions, labels |
| `text-xs` | 0.625rem (10px) | 1.4 | Fine print |

### Typography Rules

**Headings (Joystix)**
- Use for h1-h6, navigation, buttons
- Always uppercase or title case
- Tight letter-spacing

**Body (Mondwest)**
- Use for paragraphs, descriptions, long-form
- Relaxed line-height (1.6)
- Normal letter-spacing

**Code (PixelCode)**
- Use for code blocks, technical values
- Slightly smaller than body (0.875em)

### Example

```
┌─────────────────────────────────────────────┐
│  WELCOME TO RADFLOW                         │ ← Joystix, 3xl, bold
│                                             │
│  Build beautiful interfaces with our        │ ← Mondwest, base
│  retro-modern design system.                │
│                                             │
│  npm install @radflow/theme-rad-os          │ ← PixelCode, sm
│                                             │
│  [Get Started]                              │ ← Joystix in button
└─────────────────────────────────────────────┘
```

---

## Shadows & Depth

### Philosophy

RadOS uses **hard pixel shadows**—offset-based with no blur. This creates a distinctive retro computing aesthetic reminiscent of 1980s Macintosh interfaces.

### Shadow Scale

| Name | Value | Usage |
|------|-------|-------|
| `shadow-btn` | `0 1px 0 0 #0F0E0C` | Button resting state |
| `shadow-btn-hover` | `0 3px 0 0 #0F0E0C` | Button hover (lifted) |
| `shadow-card` | `2px 2px 0 0 #0F0E0C` | Cards, containers |
| `shadow-card-lg` | `4px 4px 0 0 #0F0E0C` | Elevated cards |
| `shadow-card-hover` | `6px 6px 0 0 #0F0E0C` | Card hover state |

### Light Mode Shadows

```
Button (resting):        Button (hover):         Button (active):
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│    Click     │        │    Click     │        │    Click     │
└──────────────┘        └──────────────┘        └──────────────┘
 ██████████████         ↑ 2px lift              (no shadow)
 1px offset             ████████████████
                        3px offset
```

```
Card:                    Card (hover):
┌──────────────────┐    ┌──────────────────┐
│                  │    │                  │
│   Card Content   │    │   Card Content   │
│                  │    │                  │
└──────────────────┘    └──────────────────┘
  ██████████████████      ████████████████████
  2px offset              ↑ lifts
                            ██████████████████████
                            6px offset
```

### Dark Mode Shadows

In dark mode, hard shadows become **yellow glows**:

| Light Mode | Dark Mode |
|------------|-----------|
| `2px 2px 0 0 black` | `0 0 12px rgba(252,225,132,0.3)` |
| Hard offset | Soft glow |
| Black | Yellow/cream |

### Don't

- Never use blur radius in light mode (`box-shadow: 0 2px 8px` is wrong)
- Never use gray shadows (always pure black or yellow glow)
- Never use drop-shadow filter (use box-shadow only)

---

## Borders & Radius

### Hierarchical Radius System

RadOS uses a **cascading radius system** where child elements have progressively smaller radii than their parents. This creates visual harmony and prevents nested elements from having awkward corner relationships.

```
┌─────────────────────────────────────────────────────────────────┐
│  Nesting Level        │  Radius   │  Example                   │
├─────────────────────────────────────────────────────────────────┤
│  Level 0 (Window)     │  16px     │  Modal, Dialog, Window     │
│  Level 1 (Child)      │  8px      │  Card inside modal         │
│  Level 2 (Grandchild) │  4px      │  Button inside card        │
│  Level 3 (Leaf)       │  2px      │  Badge inside button       │
└─────────────────────────────────────────────────────────────────┘

Rule: Each nesting level = parent radius ÷ 2
```

### Border Radius Scale

| Name | Value | Nesting Level | Usage |
|------|-------|---------------|-------|
| `rounded-none` | 0px | — | Never use (too harsh) |
| `rounded-xs` | 2px | Level 3 (leaf) | Badges, tags, nested small elements |
| `rounded-sm` | 4px | Level 2 | Buttons, inputs, chips |
| `rounded-md` | 8px | Level 1 | Cards, sections, panels |
| `rounded-lg` | 16px | Level 0 | Windows, modals, dialogs, page containers |
| `rounded-full` | 9999px | — | Pills, avatars, circular buttons |

### Visual Hierarchy Example

```
╭──────────────────────────────────────────────────╮  ← Window (16px)
│                                                  │
│  ╭────────────────────────────────────────────╮  │  ← Card (8px)
│  │                                            │  │
│  │  ╭────────────────╮  ╭────────────────╮   │  │  ← Buttons (4px)
│  │  │    Cancel      │  │     Save       │   │  │
│  │  ╰────────────────╯  ╰────────────────╯   │  │
│  │                                            │  │
│  ╰────────────────────────────────────────────╯  │
│                                                  │
╰──────────────────────────────────────────────────╯
```

### Border Rules

- Default border: `1px solid` using `edge-primary`
- Border color is always black (light) or cream (dark)
- Focus borders use `edge-focus` (Sky Blue)
- **Match radius to nesting level**, not component type

### Don't

```
WRONG: Same radius at all levels    RIGHT: Cascading radius
╭────────────────────────────╮      ╭────────────────────────────╮
│ ╭────────────────────────╮ │      │ ╭────────────────────────╮ │
│ │ ╭────────────────────╮ │ │      │ │ ╭──────────────────╮   │ │
│ │ │      Button        │ │ │      │ │ │     Button       │   │ │
│ │ ╰────────────────────╯ │ │      │ │ ╰──────────────────╯   │ │
│ ╰────────────────────────╯ │      │ ╰────────────────────────╯ │
╰────────────────────────────╯      ╰────────────────────────────╯
All 16px (visually awkward)         16px → 8px → 4px (harmonious)
```

---

## Interactions & Animation

### The "Lift and Press" Pattern

RadOS interactive elements behave like **physical buttons**:

1. **Resting**: Element at base position with shadow
2. **Hover**: Element lifts up, shadow deepens
3. **Active**: Element presses down, shadow disappears
4. **Focus**: Blue ring appears around element

### Implementation

```tsx
// Button interaction classes
className={cn(
  // Base shadow
  "shadow-btn",
  // Hover: lift + deeper shadow
  "hover:-translate-y-0.5 hover:shadow-btn-hover",
  // Active: press + no shadow
  "active:translate-y-0.5 active:shadow-none",
  // Focus: blue ring
  "focus:ring-2 focus:ring-edge-focus focus:ring-offset-2"
)}
```

### Transition Timing

| Duration | Easing | Usage |
|----------|--------|-------|
| 150ms | ease-out | Fades, opacity changes |
| 200ms | ease-out | Transforms, slides |
| 300ms | ease-out | Maximum for any UI transition |

### Animation Keyframes

| Animation | Duration | Usage |
|-----------|----------|-------|
| `fadeIn` | 150ms | Modals appearing |
| `scaleIn` | 150ms | Popovers, dropdowns |
| `slideIn` | 200ms | Panels, drawers |

### Don't

- Never use bounce easing (too playful/cartoonish)
- Never exceed 300ms for UI transitions
- Never use spring physics (too modern)
- Never animate colors (feels cheap)

---

## Component Patterns

### Button

```tsx
<Button variant="primary" size="md">
  Get Started
</Button>
```

**Variants:**

```
Primary (Sun Yellow):    Secondary (Black):       Outline:                Ghost:
╭──────────────────╮    ╭──────────────────╮    ╭──────────────────╮
│   Get Started    │    │   Learn More     │    │    Cancel        │    Cancel
╰──────────────────╯    ╰──────────────────╯    ╰──────────────────╯
 ██████████████████      ██████████████████      ██████████████████     no border
 Yellow bg, black text   Black bg, cream text    Transparent, border    minimal
```

**Sizes:**
- `sm`: 32px height, text-sm
- `md`: 40px height, text-base (default)
- `lg`: 48px height, text-lg

### Card

```tsx
<Card variant="default">
  <CardHeader>Title</CardHeader>
  <CardBody>Content here</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

**Structure:**

```
╭────────────────────────────────────╮
│ CARD HEADER                        │ ← Optional, border-bottom
├────────────────────────────────────┤
│                                    │
│ Card body content goes here.       │ ← Main content area
│ Can contain any elements.          │
│                                    │
├────────────────────────────────────┤
│ [Action 1]           [Action 2]    │ ← Optional footer
╰────────────────────────────────────╯
  ████████████████████████████████████  ← 2px shadow
```

### Input

```tsx
<Input placeholder="Enter your email" />
```

**States:**

```
Default:                 Focus:                   Error:
╭──────────────────────╮ ╭──────────────────────╮ ╭──────────────────────╮
│ Placeholder text     │ │ User typing...       │ │ Invalid input        │
╰──────────────────────╯ ╰──────────────────────╯ ╰──────────────────────╯
 Black border            ┃ Blue focus ring      ┃ ┃ Red border           ┃
                         ╰━━━━━━━━━━━━━━━━━━━━━━╯ ╰━━━━━━━━━━━━━━━━━━━━━━╯
                         White elevated bg        Error message below
```

### Badge

```tsx
<Badge variant="default">New</Badge>
```

```
Default:    Success:    Warning:    Error:
╭─────╮    ╭─────╮     ╭─────╮     ╭─────╮
│ New │    │ Done│     │ Wait│     │ Fail│
╰─────╯    ╰─────╯     ╰─────╯     ╰─────╯
Yellow     Green       Orange      Red
```

---

## Dark Mode

### Philosophy

Dark mode is **not a simple inversion**. It maintains RadOS character while adapting:

- Shadows become glows (hard offset → soft aura)
- Warm colors remain prominent (yellow glows)
- Contrast ratios maintained for readability

### Token Swaps

| Token | Light | Dark |
|-------|-------|------|
| `surface-primary` | Warm Cloud | Black |
| `surface-elevated` | White | Dark gray |
| `content-primary` | Black | Warm Cloud |
| `edge-primary` | Black | Warm Cloud |
| `shadow-card` | `2px 2px 0 black` | `0 0 12px yellow/30%` |

### Visual Comparison

```
Light Mode:                          Dark Mode:
╭────────────────────────────╮      ╭────────────────────────────╮
│                            │      │                            │
│  Welcome to RadOS          │      │  Welcome to RadOS          │
│                            │      │                            │
│  [Get Started]             │      │  [Get Started]             │
│                            │      │                            │
╰────────────────────────────╯      ╰────────────────────────────╯
  ████████████████████████████        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  Hard black shadow                   Soft yellow glow

Cream background                     Black background
Black text                           Cream text
```

---

## Anti-Patterns (Don't Do This)

### Visual Mistakes

#### ❌ Blurred Shadows

```
WRONG:                              RIGHT:
╭────────────────╮                  ╭────────────────╮
│    Button      │                  │    Button      │
╰────────────────╯                  ╰────────────────╯
  ░░░░░░░░░░░░░░░░                    ████████████████
  Blurred shadow                      Hard pixel shadow
```

#### ❌ Too Much Border Radius

```
WRONG:                              RIGHT:
╭────────────────────╮              ╭────────────────────╮
│                    │              │                    │
│      Card          │              │      Card          │
│                    │              │                    │
╰────────────────────╯              ╰────────────────────╯
16px+ radius (too soft)             4px radius (subtle)
```

#### ❌ Gray Colors

```
WRONG:                              RIGHT:
Text in #666666 gray                Text in #0F0E0C black
Border in #CCCCCC gray              Border in #0F0E0C black
Shadow in gray                      Shadow in pure black
```

### Code Mistakes

#### ❌ Hardcoded Colors

```tsx
// WRONG
<div className="bg-[#FCE184] text-[#0F0E0C]">

// RIGHT
<div className="bg-surface-tertiary text-content-primary">
```

#### ❌ Wrong Shadow Syntax

```tsx
// WRONG - blurred shadow
<div className="shadow-lg">  // Tailwind default has blur

// RIGHT - RadOS hard shadow
<div className="shadow-card">  // Custom hard shadow
```

#### ❌ Missing Interaction States

```tsx
// WRONG - static button
<button className="bg-surface-tertiary">

// RIGHT - full interaction
<button className="bg-surface-tertiary shadow-btn
  hover:-translate-y-0.5 hover:shadow-btn-hover
  active:translate-y-0.5 active:shadow-none
  focus:ring-2 focus:ring-edge-focus">
```

#### ❌ Using Default Tailwind Utilities

```tsx
// WRONG - Tailwind defaults
rounded-lg        // 8px, too round
shadow-md         // blurred shadow
text-gray-600     // gray, not black
bg-gray-100       // gray, not cream

// RIGHT - RadOS tokens
rounded-sm        // 4px
shadow-card       // hard shadow
text-content-primary
bg-surface-primary
```

### Common AI Mistakes

1. **Material Design patterns**: Don't use elevation/shadow system from Material
2. **iOS patterns**: Don't use heavy blur, vibrancy, or rounded rectangles
3. **Gradient usage**: RadOS is flat colors only
4. **Bounce animations**: Too playful, use ease-out only
5. **Gray scale**: Use black at opacity, never gray hex values

---

## Component Generation Checklist

When generating a RadOS component, verify:

- [ ] Uses semantic color tokens (not hex values)
- [ ] Uses `shadow-btn` or `shadow-card` (not Tailwind `shadow-*`)
- [ ] Uses `rounded-sm` (4px) by default
- [ ] Has hover lift effect (`hover:-translate-y-0.5`)
- [ ] Has active press effect (`active:translate-y-0.5`)
- [ ] Has focus ring (`focus:ring-2 ring-edge-focus`)
- [ ] Uses Joystix for headings/buttons, Mondwest for body
- [ ] Works in both light and dark mode
- [ ] No blurred shadows
- [ ] No gray colors

---

## Quick Copy Reference

### Common Class Combinations

**Primary Button:**
```
bg-surface-tertiary text-content-primary border border-edge-primary rounded-sm shadow-btn hover:-translate-y-0.5 hover:shadow-btn-hover active:translate-y-0.5 active:shadow-none focus:ring-2 focus:ring-edge-focus focus:ring-offset-2 transition-all duration-200
```

**Card:**
```
bg-surface-elevated border border-edge-primary rounded-sm shadow-card hover:shadow-card-hover transition-shadow duration-200
```

**Input:**
```
bg-surface-primary border border-edge-primary rounded-sm px-3 py-2 focus:bg-surface-elevated focus:ring-2 focus:ring-edge-focus focus:ring-offset-2 placeholder:text-content-tertiary placeholder:opacity-40
```

**Text Heading:**
```
font-joystix text-content-primary
```

**Text Body:**
```
font-mondwest text-content-primary leading-relaxed
```

---

## Version

- **Theme**: RadOS v1.0
- **Document**: v1.0
- **Last Updated**: 2026-01-11
