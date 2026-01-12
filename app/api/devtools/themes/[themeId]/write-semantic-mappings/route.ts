import { NextResponse } from 'next/server';
import { readFile, writeFile, copyFile } from 'fs/promises';
import { join } from 'path';

/**
 * Get the path to a theme's tokens.css file
 */
function getThemePaths(themeId: string): { tokensPath: string; backupPath: string } {
  const packageDir = join(process.cwd(), 'packages', `theme-${themeId}`);
  return {
    tokensPath: join(packageDir, 'tokens.css'),
    backupPath: join(packageDir, '.tokens.css.backup'),
  };
}

/**
 * POST /api/devtools/themes/[themeId]/write-semantic-mappings
 *
 * Updates semantic token mappings in the theme's tokens.css
 * Changes mappings like: --color-surface-primary: var(--color-warm-cloud)
 * to point to different base colors.
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
    const { mappings } = body as { mappings: Record<string, string> };

    if (!mappings || Object.keys(mappings).length === 0) {
      return NextResponse.json(
        { error: 'No mappings provided' },
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

    // Update semantic token mappings
    let updatedCSS = existingCSS;

    for (const [tokenId, newBaseColorName] of Object.entries(mappings)) {
      // tokenId is like "surface-primary" or "content-secondary"
      // newBaseColorName is like "warm-cloud" or "black"

      // Build the CSS variable name for the semantic token
      const cssVarName = `--color-${tokenId}`;

      // Build the new reference value
      const newReference = `var(--color-${newBaseColorName})`;

      // Find and replace the semantic token definition
      // Match: --color-surface-primary: var(--color-something);
      // Or: --color-surface-primary: #HEXVALUE;
      const regex = new RegExp(
        `(${escapeRegex(cssVarName)}:\\s*)([^;]+)(;)`,
        'g'
      );

      updatedCSS = updatedCSS.replace(regex, `$1${newReference}$3`);
    }

    // Write updated CSS
    await writeFile(tokensPath, updatedCSS, 'utf-8');

    return NextResponse.json({
      success: true,
      themeId,
      updatedMappings: Object.keys(mappings).length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to update semantic mappings for theme "${themeId}"`,
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
