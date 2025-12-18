import type { BrandColor, SemanticToken, ColorMode } from '../types';

export interface ParsedCSS {
  themeInline: Record<string, string>;
  theme: Record<string, string>;
  colorModes: Record<string, Record<string, string>>;
}

/**
 * Parse globals.css and extract theme variables
 */
export function parseGlobalsCSS(css: string): ParsedCSS {
  const result: ParsedCSS = {
    themeInline: {},
    theme: {},
    colorModes: {},
  };

  // Parse @theme inline block
  const themeInlineMatch = css.match(/@theme\s+inline\s*\{([\s\S]*?)\n\}/);
  if (themeInlineMatch) {
    result.themeInline = parseVariables(themeInlineMatch[1]);
  }

  // Parse @theme block (not inline) - need to match @theme that's NOT followed by "inline"
  const themeMatch = css.match(/@theme\s*\{([\s\S]*?)\n\}/);
  if (themeMatch) {
    result.theme = parseVariables(themeMatch[1]);
  }

  // Parse color mode classes (.dark, .light, etc.)
  const modeMatches = css.matchAll(/\.(\w+)\s*\{([\s\S]*?)\n\}/g);
  for (const match of modeMatches) {
    const modeName = match[1];
    // Only capture known color modes
    if (['dark', 'light', 'contrast'].includes(modeName)) {
      result.colorModes[modeName] = parseVariables(match[2]);
    }
  }

  return result;
}

/**
 * Parse CSS variables from a block of CSS
 */
export function parseVariables(block: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const matches = block.matchAll(/(--[\w-]+):\s*([^;]+);/g);
  
  for (const match of matches) {
    vars[match[1]] = match[2].trim();
  }
  
  return vars;
}

/**
 * Resolve a CSS variable reference (handles var() references)
 */
export function resolveVariable(
  varName: string,
  parsed: ParsedCSS
): string | null {
  // Check theme first, then themeInline
  let value = parsed.theme[varName] || parsed.themeInline[varName];
  
  if (!value) return null;
  
  // Resolve var() references
  const varRef = value.match(/var\((--[\w-]+)\)/);
  if (varRef) {
    return resolveVariable(varRef[1], parsed);
  }
  
  return value;
}

/**
 * Convert parsed CSS to store-friendly structures
 */
export function parsedCSSToStoreState(parsed: ParsedCSS): {
  brandColors: BrandColor[];
  semanticTokens: SemanticToken[];
  colorModes: ColorMode[];
  borderRadius: Record<string, string>;
} {
  const brandColors: BrandColor[] = [];
  const semanticTokens: SemanticToken[] = [];
  const borderRadius: Record<string, string> = {};

  // Extract brand colors from @theme inline
  for (const [key, value] of Object.entries(parsed.themeInline)) {
    if (key.startsWith('--brand-')) {
      brandColors.push({
        id: crypto.randomUUID(),
        name: key.replace('--brand-', ''),
        value,
        category: 'brand',
      });
    } else if (key.startsWith('--neutral-')) {
      brandColors.push({
        id: crypto.randomUUID(),
        name: key.replace('--neutral-', ''),
        value,
        category: 'neutral',
      });
    }
  }

  // Extract semantic tokens and border radius from @theme
  for (const [key, value] of Object.entries(parsed.theme)) {
    if (key.startsWith('--color-')) {
      const name = key.replace('--color-', '');
      let category: SemanticToken['category'] = 'background';
      
      if (['heading', 'body', 'caption', 'link', 'link-hover'].includes(name)) {
        category = 'text';
      } else if (['border', 'border-strong', 'border-accent'].includes(name)) {
        category = 'border';
      } else if (['success', 'warning', 'error', 'focus', 'focus-ring'].includes(name)) {
        category = 'system';
      }

      semanticTokens.push({
        id: crypto.randomUUID(),
        name,
        reference: value.includes('var(') ? value.match(/var\((--[\w-]+)\)/)?.[1] || value : value,
        category,
      });
    } else if (key.startsWith('--radius-')) {
      const radiusName = key.replace('--radius-', '');
      borderRadius[radiusName] = value;
    }
  }

  // Extract color modes
  const colorModes: ColorMode[] = Object.entries(parsed.colorModes).map(([name, overrides]) => {
    const processedOverrides: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(overrides)) {
      if (key.startsWith('--color-')) {
        const tokenName = key.replace('--color-', '');
        const reference = value.includes('var(') ? value.match(/var\((--[\w-]+)\)/)?.[1] || value : value;
        processedOverrides[tokenName] = reference;
      }
    }

    return {
      id: crypto.randomUUID(),
      name,
      className: `.${name}`,
      overrides: processedOverrides,
    };
  });

  return {
    brandColors,
    semanticTokens,
    colorModes,
    borderRadius,
  };
}

/**
 * Generate CSS content from store state
 */
export function generateCSSFromState(data: {
  brandColors: BrandColor[];
  semanticTokens: SemanticToken[];
  colorModes: ColorMode[];
  borderRadius: Record<string, string>;
}): string {
  const { brandColors, semanticTokens, colorModes, borderRadius } = data;

  // Generate brand colors for @theme inline
  const brandColorVars = brandColors
    .map((c) => `  --${c.category === 'neutral' ? 'neutral' : 'brand'}-${c.name}: ${c.value};`)
    .join('\n');

  // Generate semantic tokens
  const semanticVars = semanticTokens
    .map((t) => {
      const value = t.reference.startsWith('--') ? `var(${t.reference})` : t.reference;
      return `  --color-${t.name}: ${value};`;
    })
    .join('\n');

  // Generate border radius
  const radiusVars = Object.entries(borderRadius)
    .map(([key, value]) => `  --radius-${key}: ${value};`)
    .join('\n');

  // Generate color mode classes
  const modeBlocks = colorModes
    .map((mode) => {
      const overrides = Object.entries(mode.overrides)
        .map(([token, ref]) => {
          const value = ref.startsWith('--') ? `var(${ref})` : ref;
          return `  --color-${token}: ${value};`;
        })
        .join('\n');
      return `.${mode.name} {\n${overrides}\n}`;
    })
    .join('\n\n');

  return `@import "tailwindcss";

@theme inline {
  /* ============================================
     BRAND COLORS (internal reference only)
     ============================================ */
  
${brandColorVars}
  
  /* Fonts */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@theme {
  /* ============================================
     SEMANTIC COLORS (generate utilities)
     ============================================ */
  
${semanticVars}
  
  /* Border Radius */
${radiusVars}
}

/* ============================================
   COLOR MODES
   ============================================ */

${modeBlocks}

body {
  background: var(--color-primary);
  color: var(--color-body);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
`;
}

