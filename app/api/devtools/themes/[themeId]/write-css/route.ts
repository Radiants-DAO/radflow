import { NextResponse } from 'next/server';
import { readFile, writeFile, copyFile } from 'fs/promises';
import { join } from 'path';
import type { BaseColor, FontDefinition, TypographyStyle, ColorMode } from '@radflow/devtools/types';

/**
 * Get the paths to theme package files
 */
function getThemePaths(themeId: string) {
  const packageDir = join(process.cwd(), 'packages', `theme-${themeId}`);
  return {
    packageDir,
    tokensPath: join(packageDir, 'tokens.css'),
    tokensBackup: join(packageDir, '.tokens.css.backup'),
    fontsPath: join(packageDir, 'fonts.css'),
    fontsBackup: join(packageDir, '.fonts.css.backup'),
    typographyPath: join(packageDir, 'typography.css'),
    typographyBackup: join(packageDir, '.typography.css.backup'),
    darkPath: join(packageDir, 'dark.css'),
    darkBackup: join(packageDir, '.dark.css.backup'),
  };
}

/**
 * POST /api/devtools/themes/[themeId]/write-css
 *
 * Writes CSS changes for a specific theme.
 * Includes write-lock enforcement: only the active theme can be written to.
 */
export async function POST(
  req: Request,
  context: { params: Promise<{ themeId: string }> }
) {
  // Security: Block in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  const { themeId } = await context.params;

  try {
    const body = await req.json();
    const { baseColors, borderRadius, fonts, typographyStyles, colorModes, activeTheme } = body;

    // Write-lock enforcement: Only allow writes to the active theme
    if (activeTheme && themeId !== activeTheme) {
      return NextResponse.json(
        {
          error: 'Theme is write-locked',
          message: `Cannot write to theme "${themeId}". Only the active theme "${activeTheme}" can be modified.`,
          writeLocked: true
        },
        { status: 403 }
      );
    }

    // Get paths for this theme package
    const paths = getThemePaths(themeId);
    const updates: string[] = [];

    // Update tokens.css (contains @theme inline and @theme blocks)
    if (baseColors || borderRadius) {
      try {
        let tokensCSS = await readFile(paths.tokensPath, 'utf-8');
        await copyFile(paths.tokensPath, paths.tokensBackup).catch(() => {});

        tokensCSS = updateCSSBlocks(tokensCSS, {
          baseColors: baseColors || [],
          borderRadius: borderRadius || {},
        });

        await writeFile(paths.tokensPath, tokensCSS, 'utf-8');
        updates.push('tokens.css');
      } catch (err) {
        return NextResponse.json(
          { error: `Could not update tokens.css for theme "${themeId}"`, details: String(err) },
          { status: 500 }
        );
      }
    }

    // Update fonts.css (contains @font-face declarations)
    if (fonts) {
      try {
        let fontsCSS = await readFile(paths.fontsPath, 'utf-8');
        await copyFile(paths.fontsPath, paths.fontsBackup).catch(() => {});

        fontsCSS = updateFontFaces(fontsCSS, fonts);

        await writeFile(paths.fontsPath, fontsCSS, 'utf-8');
        updates.push('fonts.css');
      } catch (err) {
        return NextResponse.json(
          { error: `Could not update fonts.css for theme "${themeId}"`, details: String(err) },
          { status: 500 }
        );
      }
    }

    // Update typography.css (contains @layer base)
    if (typographyStyles) {
      try {
        let typographyCSS = await readFile(paths.typographyPath, 'utf-8');
        await copyFile(paths.typographyPath, paths.typographyBackup).catch(() => {});

        typographyCSS = updateLayerBase(typographyCSS, typographyStyles, fonts || []);

        await writeFile(paths.typographyPath, typographyCSS, 'utf-8');
        updates.push('typography.css');
      } catch (err) {
        return NextResponse.json(
          { error: `Could not update typography.css for theme "${themeId}"`, details: String(err) },
          { status: 500 }
        );
      }
    }

    // Update dark.css (contains color mode classes)
    if (colorModes) {
      try {
        let darkCSS = await readFile(paths.darkPath, 'utf-8');
        await copyFile(paths.darkPath, paths.darkBackup).catch(() => {});

        darkCSS = updateColorModeClasses(darkCSS, colorModes);

        await writeFile(paths.darkPath, darkCSS, 'utf-8');
        updates.push('dark.css');
      } catch (err) {
        return NextResponse.json(
          { error: `Could not update dark.css for theme "${themeId}"`, details: String(err) },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, themeId, updatedFiles: updates });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to write CSS for theme "${themeId}"`,
        details: String(error),
        hint: `Try restoring from backup files in packages/theme-${themeId}/`
      },
      { status: 500 }
    );
  }
}

/**
 * Surgically update only the @theme inline and @theme blocks,
 * preserving all other CSS (fonts, base styles, scrollbar, etc.)
 */
function updateCSSBlocks(
  existingCSS: string,
  data: {
    baseColors: BaseColor[];
    borderRadius: Record<string, string>;
  }
): string {
  const { baseColors, borderRadius } = data;

  // Build a map of baseColorId -> value for resolving references
  const colorMap = new Map<string, { name: string; value: string }>();
  for (const color of baseColors) {
    colorMap.set(color.id, { name: color.name, value: color.value });
  }

  // Generate @theme inline block content
  const themeInlineContent = generateThemeInlineBlock(baseColors);

  // Generate @theme block content
  const themeContent = generateThemeBlock(baseColors, borderRadius);

  let updated = existingCSS;

  // Replace @theme inline block (match from @theme inline { to the closing } )
  // Use a more robust regex that handles nested content
  const themeInlineRegex = /@theme\s+inline\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/;
  if (themeInlineRegex.test(updated)) {
    updated = updated.replace(themeInlineRegex, themeInlineContent);
  } else {
    // If no @theme inline block exists, insert after @import
    const importMatch = updated.match(/@import\s+["']tailwindcss["'];?\s*/);
    if (importMatch) {
      const insertPos = (importMatch.index || 0) + importMatch[0].length;
      updated = updated.slice(0, insertPos) + '\n\n' + themeInlineContent + '\n' + updated.slice(insertPos);
    }
  }

  // Replace @theme block (not inline) - need to match @theme { but not @theme inline {
  // Look for @theme that is NOT followed by "inline"
  const themeRegex = /@theme\s*(?!inline)\{[^}]*(?:\{[^}]*\}[^}]*)*\}/;
  if (themeRegex.test(updated)) {
    updated = updated.replace(themeRegex, themeContent);
  } else {
    // If no @theme block exists, insert after @theme inline
    const themeInlineEndMatch = updated.match(/@theme\s+inline\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/);
    if (themeInlineEndMatch) {
      const insertPos = (themeInlineEndMatch.index || 0) + themeInlineEndMatch[0].length;
      updated = updated.slice(0, insertPos) + '\n\n' + themeContent + updated.slice(insertPos);
    }
  }

  return updated;
}

/**
 * Generate the @theme inline block with base colors
 */
function generateThemeInlineBlock(baseColors: BaseColor[]): string {
  const brandColors = baseColors.filter(c => c.category === 'brand');
  const neutralColors = baseColors.filter(c => c.category === 'neutral');

  const brandVars = brandColors
    .map(c => `  --color-${c.name}: ${c.value};`)
    .join('\n');

  const neutralVars = neutralColors
    .map(c => `  --color-neutral-${c.name}: ${c.value};`)
    .join('\n');

  return `@theme inline {
  /* ============================================
     BRAND COLORS (internal reference only)
     ============================================ */

${brandVars}

  /* Neutral Colors */
${neutralVars}

  /* System Colors */
  --color-success-green: #22C55E;
  --color-success-green-dark: #87BB82;
  --color-warning-yellow: var(--color-sun-yellow);
  --color-warning-yellow-dark: #BE9D2B;
  --color-error-red: var(--color-sun-red);
  --color-error-red-dark: #9E433E;
  --color-focus-state: var(--color-sky-blue);

  /* Fonts */
  --font-mondwest: 'Mondwest';
  --font-joystix: 'Joystix Monospace', monospace;
}`;
}

/**
 * Generate the @theme block with brand colors and border radius
 */
function generateThemeBlock(
  baseColors: BaseColor[],
  borderRadius: Record<string, string>
): string {
  // Generate brand color utilities (Tailwind v4 auto-generates bg-*, text-*, border-* from these)
  const brandColorUtils: string[] = [];
  for (const color of baseColors) {
    if (color.category === 'brand') {
      brandColorUtils.push(`  --color-${color.name}: ${color.value};`);
    }
  }

  // Generate neutral color utilities
  const neutralColorUtils: string[] = [];
  for (const color of baseColors) {
    if (color.category === 'neutral') {
      neutralColorUtils.push(`  --color-neutral-${color.name}: ${color.value};`);
    }
  }

  // Generate border radius
  const radiusVars = Object.entries(borderRadius)
    .map(([key, value]) => `  --radius-${key}: ${value};`)
    .join('\n');

  return `@theme {
  /* ============================================
     BRAND COLORS (Tailwind v4 auto-generates utilities)
     bg-sun-yellow, text-black, border-warm-cloud, etc.
     ============================================ */

${brandColorUtils.join('\n')}

  /* Neutral Colors */
${neutralColorUtils.join('\n')}

  /* System Colors */
  --color-success-green: #22C55E;
  --color-success-green-dark: #87BB82;
  --color-warning-yellow: var(--color-sun-yellow);
  --color-warning-yellow-dark: #BE9D2B;
  --color-error-red: var(--color-sun-red);
  --color-error-red-dark: #9E433E;
  --color-focus-state: var(--color-sky-blue);

  /* Border Radius → rounded-sm, rounded-md, etc. */
${radiusVars}

  /* Box Shadows → shadow-btn, shadow-card, etc. */
  --shadow-btn: 0 1px 0 0 var(--color-black);
  --shadow-btn-hover: 0 3px 0 0 var(--color-black);
  --shadow-card: 2px 2px 0 0 var(--color-black);
  --shadow-card-lg: 4px 4px 0 0 var(--color-black);
  --shadow-inner: inset 0 0 0 1px var(--color-black);

  /* Font Families */
  --font-family-mondwest: var(--font-mondwest);
  --font-family-joystix: var(--font-joystix);
}`;
}

/**
 * Update @font-face declarations
 * Preserves existing fonts and adds new ones
 */
function updateFontFaces(css: string, fonts: FontDefinition[]): string {
  // Remove existing @font-face blocks
  let updated = css.replace(/@font-face\s*\{[^}]+\}\s*/g, '');

  // Generate new @font-face blocks
  const fontFaceBlocks: string[] = [];

  for (const font of fonts) {
    for (const file of font.files) {
      const format = file.format === 'ttf' ? 'truetype'
        : file.format === 'otf' ? 'opentype'
        : file.format;

      fontFaceBlocks.push(`@font-face {
  font-family: '${font.family}';
  src: url('${file.path}') format('${format}');
  font-weight: ${file.weight};
  font-style: ${file.style};
  font-display: swap;
}`);
    }
  }

  // Insert after @import tailwindcss
  const importMatch = updated.match(/@import\s+["']tailwindcss["'];?\s*\n?/);
  if (importMatch && fontFaceBlocks.length > 0) {
    const insertPos = (importMatch.index || 0) + importMatch[0].length;
    const fontFaceCSS = '\n' + fontFaceBlocks.join('\n\n') + '\n';
    updated = updated.slice(0, insertPos) + fontFaceCSS + updated.slice(insertPos);
  }

  return updated;
}

/**
 * Update @layer base with typography styles
 */
function updateLayerBase(
  css: string,
  typographyStyles: TypographyStyle[],
  fonts: FontDefinition[]
): string {
  // Build font family map
  const fontFamilyMap = new Map<string, string>();
  for (const font of fonts) {
    fontFamilyMap.set(font.id, font.family.toLowerCase().replace(/\s+/g, ''));
  }

  // Generate element rules
  const elementRules: string[] = [];

  for (const style of typographyStyles) {
    const classes: string[] = [];

    // Add font family class if available
    const fontClass = fontFamilyMap.get(style.fontFamilyId);
    if (fontClass) {
      classes.push(`font-${fontClass}`);
    }

    // Add size, weight, and other classes
    if (style.fontSize) classes.push(style.fontSize);
    if (style.fontWeight) classes.push(style.fontWeight);
    if (style.lineHeight) classes.push(style.lineHeight);
    if (style.letterSpacing) classes.push(style.letterSpacing);

    // Add color - convert baseColorId to Tailwind class
    // baseColorId is the base color name (e.g., 'black', 'cream', 'sky-blue')
    if (style.baseColorId) {
      classes.push(`text-${style.baseColorId}`);
    }

    // Add utilities
    if (style.utilities) {
      classes.push(...style.utilities);
    }

    if (classes.length > 0) {
      elementRules.push(`  ${style.element} {
    @apply ${classes.join(' ')};
  }`);
    }
  }

  const layerBaseContent = `@layer base {
${elementRules.join('\n\n')}
}`;

  // Replace existing @layer base or insert before closing content
  // Match @layer base { ... } with any whitespace/newlines
  const layerBaseRegex = /@layer\s+base\s*\{[\s\S]*?\}/;

  if (layerBaseRegex.test(css)) {
    return css.replace(layerBaseRegex, layerBaseContent);
  } else {
    // Insert at the end of the file
    return css.trimEnd() + '\n\n' + layerBaseContent + '\n';
  }
}

/**
 * Update color mode classes in CSS
 * Writes color mode overrides as CSS classes (.dark, .light, etc.)
 */
function updateColorModeClasses(css: string, colorModes: ColorMode[]): string {
  let updated = css;

  // First, remove existing color mode class blocks that we manage
  // Match patterns like .dark { ... } or .light { ... }
  const knownModeNames = colorModes.map(m => m.name);

  for (const modeName of knownModeNames) {
    // Remove existing block for this mode
    const modeRegex = new RegExp(`\\.${modeName}\\s*\\{[^}]*\\}\\s*`, 'g');
    updated = updated.replace(modeRegex, '');
  }

  // Also clean up any orphan color mode classes that might exist
  // This regex matches common color mode class names
  const commonModes = ['dark', 'light', 'contrast'];
  for (const modeName of commonModes) {
    if (!knownModeNames.includes(modeName)) {
      // Only remove if it's a devtools-managed block (has CSS variable overrides)
      const modeRegex = new RegExp(`\\.${modeName}\\s*\\{[^}]*--[^}]*\\}\\s*`, 'g');
      updated = updated.replace(modeRegex, '');
    }
  }

  // Generate new color mode class blocks
  const colorModeBlocks: string[] = [];

  for (const mode of colorModes) {
    if (Object.keys(mode.overrides).length === 0) continue;

    const overrideVars = Object.entries(mode.overrides)
      .map(([colorName, colorRef]) => {
        // colorRef is like "neutral-darkest" or "sun-yellow" (base color name)
        // Convert to CSS variable reference
        const varName = colorRef.startsWith('neutral-')
          ? `--color-neutral-${colorRef.replace('neutral-', '')}`
          : `--color-${colorRef}`;
        return `  --color-${colorName}: var(${varName});`;
      })
      .join('\n');

    colorModeBlocks.push(`.${mode.name} {\n${overrideVars}\n}`);
  }

  if (colorModeBlocks.length === 0) {
    return updated;
  }

  // Find the right place to insert color mode classes
  // Insert after @theme block but before :root or scrollbar styles
  const colorModeCSS = `\n/* ============================================
   COLOR MODES (DevTools managed)
   ============================================ */\n\n${colorModeBlocks.join('\n\n')}\n`;

  // Look for :root block as insertion point
  const rootMatch = updated.match(/:root\s*\{/);
  if (rootMatch && rootMatch.index !== undefined) {
    // Insert before :root
    updated = updated.slice(0, rootMatch.index) + colorModeCSS + '\n' + updated.slice(rootMatch.index);
  } else {
    // Look for scrollbar styles as insertion point
    const scrollbarMatch = updated.match(/\/\*.*scrollbar.*\*\//i);
    if (scrollbarMatch && scrollbarMatch.index !== undefined) {
      // Insert before scrollbar section
      updated = updated.slice(0, scrollbarMatch.index) + colorModeCSS + '\n' + updated.slice(scrollbarMatch.index);
    } else {
      // Append at the end
      updated = updated.trimEnd() + '\n' + colorModeCSS;
    }
  }

  return updated;
}
