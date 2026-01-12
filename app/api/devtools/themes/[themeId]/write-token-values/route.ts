import { NextResponse } from 'next/server';
import { readFile, writeFile, copyFile } from 'fs/promises';
import { join } from 'path';

/**
 * Get the path to a theme's tokens.css file
 * themeId can be 'rad-os' (workspace package) or a path like 'app/globals.css'
 */
function getThemePaths(themeId: string): { tokensPath: string; backupPath: string } {
  // For workspace theme packages (e.g., 'rad-os' -> packages/theme-rad-os/tokens.css)
  const packageDir = join(process.cwd(), 'packages', `theme-${themeId}`);
  return {
    tokensPath: join(packageDir, 'tokens.css'),
    backupPath: join(packageDir, '.tokens.css.backup'),
  };
}

/**
 * POST /api/devtools/themes/[themeId]/write-token-values
 *
 * Updates individual token values in the theme's tokens.css
 * - colors: { "warm-cloud": "#FEF8E2", "sun-yellow": "#FCE184" }
 * - radius: { "sm": "4px", "md": "8px" }
 * - shadows: { "card": "2px 2px 0 0 black", "btn": "0 1px 0 0 black" }
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
    const { colors, radius, shadows, addColors, removeColors } = body as {
      colors?: Record<string, string>;
      radius?: Record<string, string>;
      shadows?: Record<string, string>;
      addColors?: Array<{ name: string; value: string }>;
      removeColors?: string[];
    };

    const hasColors = colors && Object.keys(colors).length > 0;
    const hasRadius = radius && Object.keys(radius).length > 0;
    const hasShadows = shadows && Object.keys(shadows).length > 0;
    const hasAddColors = addColors && addColors.length > 0;
    const hasRemoveColors = removeColors && removeColors.length > 0;

    if (!hasColors && !hasRadius && !hasShadows && !hasAddColors && !hasRemoveColors) {
      return NextResponse.json(
        { error: 'No values provided' },
        { status: 400 }
      );
    }

    // Get paths for this theme
    const { tokensPath, backupPath } = getThemePaths(themeId);

    // Read existing CSS content
    let existingCSS: string;
    try {
      existingCSS = await readFile(tokensPath, 'utf-8');
    } catch {
      return NextResponse.json(
        { error: `Could not read tokens.css for theme "${themeId}"` },
        { status: 500 }
      );
    }

    // Create backup before writing
    try {
      await copyFile(tokensPath, backupPath);
    } catch {
      // Could not create backup - continue anyway
    }

    let updatedCSS = existingCSS;
    let updatedCount = 0;

    // Update color values
    if (hasColors) {
      for (const [colorName, newValue] of Object.entries(colors)) {
        // Match: --color-{name}: {value};
        // The color name can be a brand color (warm-cloud) or neutral (neutral-black)
        const regex = new RegExp(
          `(--color-${escapeRegex(colorName)}:\\s*)([^;]+)(;)`,
          'g'
        );
        const newCSS = updatedCSS.replace(regex, `$1${newValue}$3`);
        if (newCSS !== updatedCSS) {
          updatedCSS = newCSS;
          updatedCount++;
        }
      }
    }

    // Update radius values
    if (hasRadius) {
      for (const [key, newValue] of Object.entries(radius)) {
        // Match: --radius-{key}: {value};
        const regex = new RegExp(
          `(--radius-${escapeRegex(key)}:\\s*)([^;]+)(;)`,
          'g'
        );
        const newCSS = updatedCSS.replace(regex, `$1${newValue}$3`);
        if (newCSS !== updatedCSS) {
          updatedCSS = newCSS;
          updatedCount++;
        }
      }
    }

    // Update shadow values
    if (hasShadows) {
      for (const [name, newValue] of Object.entries(shadows)) {
        // Match: --shadow-{name}: {value};
        const regex = new RegExp(
          `(--shadow-${escapeRegex(name)}:\\s*)([^;]+)(;)`,
          'g'
        );
        const newCSS = updatedCSS.replace(regex, `$1${newValue}$3`);
        if (newCSS !== updatedCSS) {
          updatedCSS = newCSS;
          updatedCount++;
        }
      }
    }

    // Remove colors (delete entire lines)
    if (hasRemoveColors) {
      for (const colorName of removeColors) {
        // Match entire line: --color-{name}: {value}; (including leading whitespace and newline)
        const regex = new RegExp(
          `\\n?\\s*--color-${escapeRegex(colorName)}:\\s*[^;]+;`,
          'g'
        );
        const newCSS = updatedCSS.replace(regex, '');
        if (newCSS !== updatedCSS) {
          updatedCSS = newCSS;
          updatedCount++;
        }
      }
    }

    // Add new colors (insert into @theme inline block)
    if (hasAddColors) {
      // Find the @theme inline block and insert before its closing }
      const themeInlineMatch = updatedCSS.match(/@theme\s+inline\s*\{[\s\S]*?\}/);
      if (themeInlineMatch) {
        const themeInlineBlock = themeInlineMatch[0];
        const insertPoint = themeInlineBlock.lastIndexOf('}');
        const newColorLines = addColors
          .map(({ name, value }) => `  --color-${name}: ${value};`)
          .join('\n');
        const updatedBlock =
          themeInlineBlock.slice(0, insertPoint) +
          '\n' + newColorLines + '\n' +
          themeInlineBlock.slice(insertPoint);
        updatedCSS = updatedCSS.replace(themeInlineBlock, updatedBlock);
        updatedCount += addColors.length;
      }
    }

    // Write updated CSS
    await writeFile(tokensPath, updatedCSS, 'utf-8');

    return NextResponse.json({
      success: true,
      themeId,
      updatedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to update token values for theme "${themeId}"`,
        details: String(error),
        hint: `Try restoring from backup in packages/theme-${themeId}/`
      },
      { status: 500 }
    );
  }
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
