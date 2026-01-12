import { NextResponse } from 'next/server';
import { readFile, writeFile, copyFile } from 'fs/promises';
import { getCurrentThemeId, getThemeFilePaths } from '../../lib/themeUtils';
import type { BaseColor, FontDefinition, TypographyStyle, ColorMode } from '../../types';

/**
 * POST /api/devtools/write-css
 * Writes CSS changes to the active theme package
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const themeId = await getCurrentThemeId();
    if (!themeId) {
      return NextResponse.json(
        { error: 'No theme detected. Ensure globals.css imports a @radflow/theme-* package.' },
        { status: 400 }
      );
    }

    const themePaths = getThemeFilePaths(themeId);
    const { baseColors, borderRadius, fonts, typographyStyles, colorModes } = await req.json();

    const results: Record<string, boolean> = {};

    if (typographyStyles?.length > 0) {
      await updateTypographyFile(themePaths.typographyPath, typographyStyles, fonts || [], themeId);
      results.typography = true;
    }

    if (fonts?.length > 0) {
      await updateFontsFile(themePaths.fontsPath, fonts, themeId);
      results.fonts = true;
    }

    if (colorModes?.length > 0) {
      await updateColorModesFile(themePaths.darkPath, colorModes, themeId);
      results.colorModes = true;
    }

    if (baseColors?.length > 0) {
      await updateTokensFile(themePaths.tokensPath, baseColors, borderRadius || {}, themeId);
      results.tokens = true;
    }

    return NextResponse.json({ success: true, themeId, updated: results });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write CSS', details: String(error) },
      { status: 500 }
    );
  }
}

async function updateTypographyFile(
  filePath: string,
  typographyStyles: TypographyStyle[],
  fonts: FontDefinition[],
  themeId: string
): Promise<void> {
  const backupPath = filePath.replace('.css', '.css.backup');
  try { await copyFile(filePath, backupPath); } catch { /* ignore */ }

  const fontFamilyMap = new Map<string, string>();
  for (const font of fonts) {
    fontFamilyMap.set(font.id, font.family);
  }

  const elementRules: string[] = [];

  for (const style of typographyStyles) {
    const classes: string[] = [];
    const inlineStyles: string[] = [];

    if (style.fontSize) classes.push(style.fontSize);
    if (style.fontWeight) classes.push(style.fontWeight);
    if (style.lineHeight) classes.push(style.lineHeight);
    if (style.letterSpacing) classes.push(style.letterSpacing);
    if (style.baseColorId) classes.push(`text-${style.baseColorId}`);
    if (style.utilities) classes.push(...style.utilities);

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

  const content = `/* @radflow/theme-${themeId} - Typography (auto-generated) */

@layer base {
${elementRules.join('\n\n')}
}
`;

  await writeFile(filePath, content, 'utf-8');
}

async function updateFontsFile(filePath: string, fonts: FontDefinition[], themeId: string): Promise<void> {
  const backupPath = filePath.replace('.css', '.css.backup');
  try { await copyFile(filePath, backupPath); } catch { /* ignore */ }

  const fontFaceBlocks: string[] = [];

  for (const font of fonts) {
    for (const file of font.files) {
      const format = file.format === 'ttf' ? 'truetype' : file.format === 'otf' ? 'opentype' : file.format;
      fontFaceBlocks.push(`@font-face {
  font-family: '${font.family}';
  src: url('${file.path}') format('${format}');
  font-weight: ${file.weight};
  font-style: ${file.style};
  font-display: swap;
}`);
    }
  }

  const utilityClasses: string[] = [];
  for (const font of fonts) {
    const className = font.family.toLowerCase().replace(/\s+/g, '-');
    utilityClasses.push(`  .font-${className} {\n    font-family: '${font.family}', sans-serif;\n  }`);
  }

  const content = `/* @radflow/theme-${themeId} - Fonts (auto-generated) */

${fontFaceBlocks.join('\n\n')}

@layer utilities {
${utilityClasses.join('\n\n')}
}
`;

  await writeFile(filePath, content, 'utf-8');
}

async function updateColorModesFile(filePath: string, colorModes: ColorMode[], themeId: string): Promise<void> {
  const backupPath = filePath.replace('.css', '.css.backup');
  try { await copyFile(filePath, backupPath); } catch { /* ignore */ }

  const colorModeBlocks: string[] = [];

  for (const mode of colorModes) {
    if (Object.keys(mode.overrides).length === 0) continue;

    const overrideVars = Object.entries(mode.overrides)
      .map(([tokenName, colorRef]) => {
        const varName = colorRef.startsWith('neutral-')
          ? `--color-neutral-${colorRef.replace('neutral-', '')}`
          : `--color-${colorRef}`;
        return `  --color-${tokenName}: var(${varName});`;
      })
      .join('\n');

    colorModeBlocks.push(`.${mode.name} {\n${overrideVars}\n}`);
  }

  const content = `/* @radflow/theme-${themeId} - Color Modes (auto-generated) */

${colorModeBlocks.join('\n\n')}
`;

  await writeFile(filePath, content, 'utf-8');
}

async function updateTokensFile(
  filePath: string,
  baseColors: BaseColor[],
  borderRadius: Record<string, string>,
  themeId: string
): Promise<void> {
  const backupPath = filePath.replace('.css', '.css.backup');
  try { await copyFile(filePath, backupPath); } catch { /* ignore */ }

  let existingCSS = '';
  try { existingCSS = await readFile(filePath, 'utf-8'); } catch { /* ignore */ }

  const brandColors = baseColors.filter((c) => c.category === 'brand');
  const neutralColors = baseColors.filter((c) => c.category === 'neutral');

  const brandVars = brandColors.map((c) => `  --color-${c.name}: ${c.value};`).join('\n');
  const neutralVars = neutralColors.map((c) => `  --color-neutral-${c.name}: ${c.value};`).join('\n');

  const themeInlineContent = `@theme inline {\n  /* Brand Colors */\n${brandVars}\n\n  /* Neutral Colors */\n${neutralVars}\n}`;

  const radiusVars = Object.entries(borderRadius)
    .map(([key, value]) => `  --radius-${key}: ${value};`)
    .join('\n');

  const themeContent = `@theme {\n  /* Brand Colors */\n${brandVars}\n\n  /* Neutral Colors */\n${neutralVars}\n\n  /* Border Radius */\n${radiusVars}\n}`;

  let updatedCSS = existingCSS;

  const themeInlineRegex = /@theme\s+inline\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/;
  if (themeInlineRegex.test(updatedCSS)) {
    updatedCSS = updatedCSS.replace(themeInlineRegex, themeInlineContent);
  }

  const themeRegex = /@theme\s*(?!inline)\{[^}]*(?:\{[^}]*\}[^}]*)*\}/;
  if (themeRegex.test(updatedCSS)) {
    updatedCSS = updatedCSS.replace(themeRegex, themeContent);
  }

  await writeFile(filePath, updatedCSS, 'utf-8');
}
