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
 * GET /api/devtools/themes/[themeId]/read-css
 *
 * Reads CSS files for a specific theme package.
 * Returns the combined CSS content from the theme's index.css with all imports resolved.
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

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
        'X-Theme-Id': themeId,
      },
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
