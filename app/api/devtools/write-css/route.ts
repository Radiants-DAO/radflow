import { NextResponse } from 'next/server';
import { readFile, writeFile, copyFile } from 'fs/promises';
import { getCurrentThemeId, getThemeFilePaths } from '@radflow/devtools/lib/themeUtils';
import type { BaseColor, FontDefinition, TypographyStyle, ColorMode } from '@radflow/devtools/types';

export async function POST(req: Request) {
  // Security: Block in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    // Detect current theme
    const themeId = await getCurrentThemeId();
    if (!themeId) {
      return NextResponse.json(
        { error: 'No theme detected. Ensure globals.css imports a @radflow/theme-* package.' },
        { status: 400 }
      );
    }

    const themePaths = getThemeFilePaths(themeId);
    const { baseColors, borderRadius, fonts, typographyStyles, colorModes } = await req.json();

    const results: { typography?: boolean; fonts?: boolean; colorModes?: boolean; tokens?: boolean } = {};

    // Update typography in theme package
    if (typographyStyles && Array.isArray(typographyStyles) && typographyStyles.length > 0) {
      try {
        await updateTypographyFile(themePaths.typographyPath, typographyStyles, fonts || [], themeId);
        results.typography = true;
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to update typography for theme "${themeId}"`, details: String(error) },
          { status: 500 }
        );
      }
    }

    // Update fonts in theme package
    if (fonts && Array.isArray(fonts) && fonts.length > 0) {
      try {
        await updateFontsFile(themePaths.fontsPath, fonts, themeId);
        results.fonts = true;
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to update fonts for theme "${themeId}"`, details: String(error) },
          { status: 500 }
        );
      }
    }

    // Update color modes in theme package (dark.css)
    if (colorModes && Array.isArray(colorModes) && colorModes.length > 0) {
      try {
        await updateColorModesFile(themePaths.darkPath, colorModes, themeId);
        results.colorModes = true;
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to update color modes for theme "${themeId}"`, details: String(error) },
          { status: 500 }
        );
      }
    }

    // Update tokens in theme package (tokens.css) - base colors and border radius
    if (baseColors && Array.isArray(baseColors) && baseColors.length > 0) {
      try {
        await updateTokensFile(themePaths.tokensPath, baseColors, borderRadius || {}, themeId);
        results.tokens = true;
      } catch (error) {
        return NextResponse.json(
          { error: `Failed to update tokens for theme "${themeId}"`, details: String(error) },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      themeId,
      updated: results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to write CSS',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Update typography.css in the theme package
 */
async function updateTypographyFile(
  filePath: string,
  typographyStyles: TypographyStyle[],
  fonts: FontDefinition[],
  themeId: string
): Promise<void> {
  // Create backup
  const backupPath = filePath.replace('.css', '.css.backup');
  try {
    await copyFile(filePath, backupPath);
  } catch {
    // Continue without backup
  }

  // Build font family map
  const fontFamilyMap = new Map<string, string>();
  for (const font of fonts) {
    // Map font ID to a CSS-safe family name
    fontFamilyMap.set(font.id, font.family);
  }

  // Generate element rules
  const elementRules: string[] = [];

  for (const style of typographyStyles) {
    const classes: string[] = [];
    const inlineStyles: string[] = [];

    // Add size, weight, and other classes
    if (style.fontSize) classes.push(style.fontSize);
    if (style.fontWeight) classes.push(style.fontWeight);
    if (style.lineHeight) classes.push(style.lineHeight);
    if (style.letterSpacing) classes.push(style.letterSpacing);

    // Add color - convert baseColorId to Tailwind class
    if (style.baseColorId) {
      classes.push(`text-${style.baseColorId}`);
    }

    // Add utilities
    if (style.utilities) {
      classes.push(...style.utilities);
    }

    // Get font family - use inline style for explicit font control
    const fontFamily = fontFamilyMap.get(style.fontFamilyId);
    if (fontFamily) {
      inlineStyles.push(`font-family: '${fontFamily}', sans-serif;`);
    }

    const applyLine = classes.length > 0 ? `    @apply ${classes.join(' ')};` : '';
    const styleLine = inlineStyles.length > 0 ? `    ${inlineStyles.join('\n    ')}` : '';

    const ruleBody = [applyLine, styleLine].filter(Boolean).join('\n');

    if (ruleBody) {
      elementRules.push(`  ${style.element} {\n${ruleBody}\n  }`);
    }
  }

  // Get theme display name for header
  const themeDisplayName = themeId === 'rad-os' ? 'Rad OS' : themeId.charAt(0).toUpperCase() + themeId.slice(1);

  const content = `/* ============================================================================
   @radflow/theme-${themeId} - Typography

   Base typography styles using @layer base for Tailwind v4 integration.
   Auto-generated by RadFlow DevTools - edits will be overwritten.
   ============================================================================ */

@layer base {
${elementRules.join('\n\n')}
}
`;

  await writeFile(filePath, content, 'utf-8');
}

/**
 * Update fonts.css in the theme package
 */
async function updateFontsFile(
  filePath: string,
  fonts: FontDefinition[],
  themeId: string
): Promise<void> {
  // Create backup
  const backupPath = filePath.replace('.css', '.css.backup');
  try {
    await copyFile(filePath, backupPath);
  } catch {
    // Continue without backup
  }

  // Generate @font-face blocks
  const fontFaceBlocks: string[] = [];

  for (const font of fonts) {
    for (const file of font.files) {
      const format =
        file.format === 'ttf'
          ? 'truetype'
          : file.format === 'otf'
          ? 'opentype'
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

  // Generate utility classes
  const utilityClasses: string[] = [];
  for (const font of fonts) {
    const className = font.family.toLowerCase().replace(/\s+/g, '-');
    utilityClasses.push(`  .font-${className} {
    font-family: '${font.family}', sans-serif;
  }`);
  }

  // Get theme display name
  const themeDisplayName = themeId === 'rad-os' ? 'Rad OS' : themeId.charAt(0).toUpperCase() + themeId.slice(1);

  const content = `/* ============================================================================
   @radflow/theme-${themeId} - Fonts

   Font face declarations for ${themeDisplayName} theme.
   Auto-generated by RadFlow DevTools - edits will be overwritten.
   ============================================================================ */

${fontFaceBlocks.join('\n\n')}

/* Font family utility classes */
@layer utilities {
${utilityClasses.join('\n\n')}
}
`;

  await writeFile(filePath, content, 'utf-8');
}

/**
 * Update dark.css (color modes) in the theme package
 */
async function updateColorModesFile(
  filePath: string,
  colorModes: ColorMode[],
  themeId: string
): Promise<void> {
  // Create backup
  const backupPath = filePath.replace('.css', '.css.backup');
  try {
    await copyFile(filePath, backupPath);
  } catch {
    // Continue without backup
  }

  // Read existing file to preserve any manual additions
  let existingContent = '';
  try {
    existingContent = await readFile(filePath, 'utf-8');
  } catch {
    // File doesn't exist, create fresh
  }

  // Generate color mode class blocks
  const colorModeBlocks: string[] = [];

  for (const mode of colorModes) {
    if (Object.keys(mode.overrides).length === 0) continue;

    const overrideVars = Object.entries(mode.overrides)
      .map(([tokenName, colorRef]) => {
        // colorRef is the base color name (e.g., 'cream', 'black', 'neutral-darkest')
        const varName = colorRef.startsWith('neutral-')
          ? `--color-neutral-${colorRef.replace('neutral-', '')}`
          : `--color-${colorRef}`;
        return `  --color-${tokenName}: var(${varName});`;
      })
      .join('\n');

    colorModeBlocks.push(`.${mode.name} {\n${overrideVars}\n}`);
  }

  // Get theme display name
  const themeDisplayName = themeId === 'rad-os' ? 'Rad OS' : themeId.charAt(0).toUpperCase() + themeId.slice(1);

  const content = `/* ============================================================================
   @radflow/theme-${themeId} - Color Modes

   Color mode overrides for ${themeDisplayName} theme.
   Auto-generated by RadFlow DevTools - edits will be overwritten.
   ============================================================================ */

${colorModeBlocks.join('\n\n')}
`;

  await writeFile(filePath, content, 'utf-8');
}

/**
 * Update tokens.css in the theme package
 */
async function updateTokensFile(
  filePath: string,
  baseColors: BaseColor[],
  borderRadius: Record<string, string>,
  themeId: string
): Promise<void> {
  // Create backup
  const backupPath = filePath.replace('.css', '.css.backup');
  try {
    await copyFile(filePath, backupPath);
  } catch {
    // Continue without backup
  }

  // Read existing content to preserve structure
  let existingCSS = '';
  try {
    existingCSS = await readFile(filePath, 'utf-8');
  } catch {
    // File doesn't exist
  }

  // Build color categories
  const brandColors = baseColors.filter((c) => c.category === 'brand');
  const neutralColors = baseColors.filter((c) => c.category === 'neutral');

  // Generate @theme inline block
  const brandVars = brandColors.map((c) => `  --color-${c.name}: ${c.value};`).join('\n');
  const neutralVars = neutralColors.map((c) => `  --color-neutral-${c.name}: ${c.value};`).join('\n');

  const themeInlineContent = `@theme inline {
  /* Brand Colors */
${brandVars}

  /* Neutral Colors */
${neutralVars}
}`;

  // Generate @theme block with utilities
  const brandUtilVars = brandColors.map((c) => `  --color-${c.name}: ${c.value};`).join('\n');
  const neutralUtilVars = neutralColors.map((c) => `  --color-neutral-${c.name}: ${c.value};`).join('\n');
  const radiusVars = Object.entries(borderRadius)
    .map(([key, value]) => `  --radius-${key}: ${value};`)
    .join('\n');

  const themeContent = `@theme {
  /* Brand Colors (Tailwind v4 auto-generates utilities) */
${brandUtilVars}

  /* Neutral Colors */
${neutralUtilVars}

  /* Border Radius */
${radiusVars}
}`;

  let updatedCSS = existingCSS;

  // Replace @theme inline block
  const themeInlineRegex = /@theme\s+inline\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/;
  if (themeInlineRegex.test(updatedCSS)) {
    updatedCSS = updatedCSS.replace(themeInlineRegex, themeInlineContent);
  }

  // Replace @theme block (not inline)
  const themeRegex = /@theme\s*(?!inline)\{[^}]*(?:\{[^}]*\}[^}]*)*\}/;
  if (themeRegex.test(updatedCSS)) {
    updatedCSS = updatedCSS.replace(themeRegex, themeContent);
  }

  await writeFile(filePath, updatedCSS, 'utf-8');
}
