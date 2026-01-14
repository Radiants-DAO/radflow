# RadTools Data Structures Reference

Complete type definitions for the RadTools write-css API.

## Tailwind v4 Token Generation

RadTools uses Tailwind CSS v4's `@theme` directive for automatic utility class generation:

```css
@theme {
  /* Colors: --color-{name} → bg-{name}, text-{name}, border-{name} */
  --color-sun-yellow: #FCE184;
  --color-sky-blue: #95BAD2;
  
  /* Radius: --radius-{name} → rounded-{name} */
  --radius-md: 0.5rem;
  
  /* Shadows: --shadow-{name} → shadow-{name} */
  --shadow-card: 2px 2px 0 0 var(--color-black);
}
```

The `name` in your BaseColor becomes the CSS variable suffix and the generated utility class name.

## BaseColor

Represents a color token in the design system.

```typescript
interface BaseColor {
  id: string;           // Unique identifier, also used in references
  name: string;         // CSS variable suffix: "primary" → --color-primary
  displayName: string;  // Human-readable: "Primary"
  value: string;        // Hex value: "#3B82F6"
  category: 'brand' | 'neutral';
}
```

### Example BaseColors

```typescript
const baseColors: BaseColor[] = [
  // Brand colors - main design system colors
  { id: 'primary', name: 'primary', displayName: 'Primary', value: '#3B82F6', category: 'brand' },
  { id: 'secondary', name: 'secondary', displayName: 'Secondary', value: '#64748B', category: 'brand' },
  { id: 'accent', name: 'accent', displayName: 'Accent', value: '#F59E0B', category: 'brand' },
  { id: 'surface', name: 'surface', displayName: 'Surface', value: '#FFFFFF', category: 'brand' },
  { id: 'background', name: 'background', displayName: 'Background', value: '#F8FAFC', category: 'brand' },
  
  // Neutral colors - grayscale palette
  { id: 'lightest', name: 'lightest', displayName: 'Lightest', value: '#F8FAFC', category: 'neutral' },
  { id: 'lighter', name: 'lighter', displayName: 'Lighter', value: '#E2E8F0', category: 'neutral' },
  { id: 'light', name: 'light', displayName: 'Light', value: '#94A3B8', category: 'neutral' },
  { id: 'dark', name: 'dark', displayName: 'Dark', value: '#475569', category: 'neutral' },
  { id: 'darker', name: 'darker', displayName: 'Darker', value: '#1E293B', category: 'neutral' },
  { id: 'darkest', name: 'darkest', displayName: 'Darkest', value: '#0F172A', category: 'neutral' },
];
```

### Generated CSS

```css
@theme inline {
  /* Internal reference only - not for utility generation */
  --color-primary: #3B82F6;
  --color-secondary: #64748B;
}

@theme {
  /* Tailwind v4 auto-generates utilities from these variables:
     --color-primary → bg-primary, text-primary, border-primary
     --color-secondary → bg-secondary, text-secondary, border-secondary */
  --color-primary: #3B82F6;
  --color-secondary: #64748B;
}
```

**Key Insight:** The `name` field in BaseColor determines both the CSS variable name (`--color-{name}`) and the generated utility classes (`bg-{name}`, `text-{name}`, `border-{name}`).

## FontDefinition & FontFile

Represents a font family and its files.

```typescript
interface FontFile {
  id: string;
  weight: number;         // 400, 700, etc.
  style: string;          // "normal" | "italic"
  format: 'woff2' | 'woff' | 'ttf' | 'otf';
  path: string;           // "/fonts/Inter-Regular.woff2"
}

interface FontDefinition {
  id: string;
  name: string;           // "Inter"
  family: string;         // CSS font-family: "Inter, sans-serif"
  files: FontFile[];
  weights: number[];      // [400, 500, 700]
  styles: string[];       // ["normal", "italic"]
}
```

### Example FontDefinitions

```typescript
const fonts: FontDefinition[] = [
  {
    id: 'inter',
    name: 'Inter',
    family: 'Inter',
    files: [
      { id: 'inter-regular', weight: 400, style: 'normal', format: 'woff2', path: '/fonts/Inter-Regular.woff2' },
      { id: 'inter-medium', weight: 500, style: 'normal', format: 'woff2', path: '/fonts/Inter-Medium.woff2' },
      { id: 'inter-bold', weight: 700, style: 'normal', format: 'woff2', path: '/fonts/Inter-Bold.woff2' },
    ],
    weights: [400, 500, 700],
    styles: ['normal'],
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    family: 'JetBrains Mono',
    files: [
      { id: 'jetbrains-regular', weight: 400, style: 'normal', format: 'woff2', path: '/fonts/JetBrainsMono-Regular.woff2' },
    ],
    weights: [400],
    styles: ['normal'],
  },
];
```

### Generated CSS

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

## TypographyStyle

Represents typography settings for HTML elements.

```typescript
interface TypographyStyle {
  id: string;
  element: string;        // HTML element: "h1", "h2", "p", "code", etc.
  fontFamilyId: string;   // References FontDefinition.id
  fontSize: string;       // Tailwind class: "text-4xl", "text-base"
  lineHeight?: string;    // Tailwind class: "leading-tight", "leading-relaxed"
  letterSpacing?: string; // Tailwind class: "tracking-wide"
  fontWeight: string;     // Tailwind class: "font-bold", "font-normal"
  baseColorId: string;    // References BaseColor.id for text color
  displayName: string;    // UI label: "Heading 1"
  utilities?: string[];   // Additional Tailwind classes
}
```

### Example TypographyStyles

```typescript
const typographyStyles: TypographyStyle[] = [
  {
    id: 'h1',
    element: 'h1',
    fontFamilyId: 'inter',
    fontSize: 'text-4xl',
    lineHeight: 'leading-tight',
    fontWeight: 'font-bold',
    baseColorId: 'darkest',
    displayName: 'Heading 1',
  },
  {
    id: 'h2',
    element: 'h2',
    fontFamilyId: 'inter',
    fontSize: 'text-3xl',
    lineHeight: 'leading-tight',
    fontWeight: 'font-semibold',
    baseColorId: 'darkest',
    displayName: 'Heading 2',
  },
  {
    id: 'p',
    element: 'p',
    fontFamilyId: 'inter',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    fontWeight: 'font-normal',
    baseColorId: 'dark',
    displayName: 'Paragraph',
  },
  {
    id: 'a',
    element: 'a',
    fontFamilyId: 'inter',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'primary',
    displayName: 'Link',
    utilities: ['underline', 'hover:opacity-80'],
  },
  {
    id: 'code',
    element: 'code',
    fontFamilyId: 'jetbrains-mono',
    fontSize: 'text-sm',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'darker',
    displayName: 'Inline Code',
    utilities: ['bg-lighter', 'px-1', 'py-0.5', 'rounded-sm'],
  },
];
```

### Generated CSS

```css
@layer base {
  h1 {
    @apply font-inter text-4xl font-bold leading-tight text-darkest;
  }

  h2 {
    @apply font-inter text-3xl font-semibold leading-tight text-darkest;
  }

  p {
    @apply font-inter text-base font-normal leading-relaxed text-dark;
  }

  code {
    @apply text-sm font-normal leading-normal text-darker bg-lighter px-1 py-0.5 rounded-sm;
    font-family: "JetBrains Mono";
  }
}
```

## ColorMode

Optional dark/light mode overrides.

```typescript
interface ColorMode {
  id: string;
  name: string;        // CSS class name: "dark"
  className: string;   // ".dark"
  overrides: Record<string, string>;  // token name → base color reference
}
```

### Example ColorMode

```typescript
const colorModes: ColorMode[] = [
  {
    id: 'dark',
    name: 'dark',
    className: '.dark',
    overrides: {
      'surface': 'darkest',      // --color-surface uses darkest in dark mode
      'background': 'darker',
      'primary': 'accent',       // Swap primary to accent in dark mode
    }
  }
];
```

## BorderRadius

Simple key-value map for border radius tokens.

```typescript
const borderRadius: Record<string, string> = {
  none: '0',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  full: '9999px',
};
```

### Generated CSS

```css
@theme {
  --radius-none: 0;
  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-full: 9999px;
}
```

## Complete API Request Example

```typescript
const importFromFigma = async () => {
  const response = await fetch('/api/devtools/write-css', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      baseColors: [
        { id: 'primary', name: 'primary', displayName: 'Primary', value: '#3B82F6', category: 'brand' },
        { id: 'secondary', name: 'secondary', displayName: 'Secondary', value: '#64748B', category: 'brand' },
        { id: 'darkest', name: 'darkest', displayName: 'Darkest', value: '#0F172A', category: 'neutral' },
      ],
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
      },
      fonts: [
        {
          id: 'inter',
          name: 'Inter',
          family: 'Inter',
          files: [
            { id: 'inter-regular', weight: 400, style: 'normal', format: 'woff2', path: '/fonts/Inter-Regular.woff2' },
          ],
          weights: [400],
          styles: ['normal'],
        },
      ],
      typographyStyles: [
        {
          id: 'h1',
          element: 'h1',
          fontFamilyId: 'inter',
          fontSize: 'text-4xl',
          lineHeight: 'leading-tight',
          fontWeight: 'font-bold',
          baseColorId: 'darkest',
          displayName: 'Heading 1',
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to import from Figma');
  }
};
```

## Figma MCP → RadTools Mapping

| Figma Tool | Extracts | RadTools Type |
|-----------|----------|---------------|
| `get_variable_defs` | Color variables | `BaseColor[]` |
| `get_variable_defs` | Spacing variables | `borderRadius` |
| `get_design_context` | Text styles | `TypographyStyle[]` |
| `get_design_context` | Font information | `FontDefinition[]` |

### Figma Variable Name Conventions

```
Figma: "Brand/Primary"     → id: 'primary', category: 'brand'
Figma: "Brand/Secondary"   → id: 'secondary', category: 'brand'
Figma: "Neutral/50"        → id: 'lightest', category: 'neutral'
Figma: "Neutral/900"       → id: 'darkest', category: 'neutral'
Figma: "Surface/Default"   → id: 'surface', category: 'brand'
```

### Figma Text Style Mapping

```
Figma: "Display/Large"     → element: 'h1'
Figma: "Display/Medium"    → element: 'h2'
Figma: "Heading/Large"     → element: 'h3'
Figma: "Body/Regular"      → element: 'p'
Figma: "Body/Small"        → element: 'small'
Figma: "Code/Regular"      → element: 'code'
Figma: "Code/Block"        → element: 'pre'
```
