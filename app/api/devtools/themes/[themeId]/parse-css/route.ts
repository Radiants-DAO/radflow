import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { getThemeFilePaths } from '@radflow/devtools/lib/themeUtils';

/**
 * Resolve @import statements in CSS and return the combined content.
 */
async function resolveImports(css: string, basePath: string): Promise<string> {
  const importRegex = /@import\s+["']([^"']+)["']\s*;?/g;
  let result = css;
  const imports: { match: string; path: string }[] = [];

  // Collect all imports
  let match;
  while ((match = importRegex.exec(css)) !== null) {
    imports.push({ match: match[0], path: match[1] });
  }

  // Process imports in order
  for (const imp of imports) {
    try {
      if (imp.path.startsWith('.') || imp.path.startsWith('/')) {
        // Relative or absolute path
        const importPath = join(dirname(basePath), imp.path);
        let importedCss = await readFile(importPath, 'utf-8');
        // Recursively resolve nested imports
        importedCss = await resolveImports(importedCss, importPath);
        result = result.replace(imp.match, importedCss);
      }
      // Skip non-relative imports (tailwindcss, etc.)
    } catch (error) {
      console.warn(`Failed to resolve import ${imp.path}:`, error);
    }
  }

  return result;
}

/**
 * GET /api/devtools/themes/[themeId]/parse-css
 *
 * Reads and returns CSS for a specific theme package.
 * Returns raw CSS - parsing is done client-side for performance.
 *
 * For CSS parsing, clients should use @radflow/devtools/lib/cssParser
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ themeId: string }> }
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  const { themeId } = await context.params;

  try {
    // Get paths for this theme package
    const themePaths = getThemeFilePaths(themeId);

    // Read the theme's index.css
    let css = await readFile(themePaths.indexPath, 'utf-8');

    // Resolve all imports to get the full CSS content
    css = await resolveImports(css, themePaths.indexPath);

    return NextResponse.json({
      themeId,
      css,
      packageDir: themePaths.packageDir,
      files: {
        tokens: themePaths.tokensPath,
        typography: themePaths.typographyPath,
        fonts: themePaths.fontsPath,
        dark: themePaths.darkPath,
      },
      note: 'Parse client-side using @radflow/devtools/lib/cssParser',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to read CSS for theme "${themeId}"`,
        details: String(error),
        hint: `Ensure packages/theme-${themeId}/ exists with index.css`,
      },
      { status: 500 }
    );
  }
}
