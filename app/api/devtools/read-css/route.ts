import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';

const GLOBALS_PATH = join(process.cwd(), 'app', 'globals.css');

/**
 * Remove CSS comments from a string
 */
function stripComments(css: string): string {
  // Remove /* ... */ comments
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Resolve @import statements in CSS and return the combined content.
 * Handles both relative paths and package imports (e.g., @radflow/theme-rad-os)
 */
async function resolveImports(css: string, basePath: string): Promise<string> {
  const importRegex = /@import\s+["']([^"']+)["']\s*;?/g;
  let result = css;
  const imports: { match: string; path: string; index: number }[] = [];

  // Strip comments to avoid matching @import inside comments
  const cssWithoutComments = stripComments(css);

  // Collect all imports from uncommented CSS
  let match;
  while ((match = importRegex.exec(cssWithoutComments)) !== null) {
    imports.push({ match: match[0], path: match[1], index: match.index });
  }

  // Process imports in order
  for (const imp of imports) {
    let importedCss = '';

    try {
      if (imp.path.startsWith('.') || imp.path.startsWith('/')) {
        // Relative or absolute path
        const importPath = join(dirname(basePath), imp.path);
        importedCss = await readFile(importPath, 'utf-8');
        // Recursively resolve nested imports
        importedCss = await resolveImports(importedCss, importPath);
      } else if (imp.path.startsWith('@')) {
        // Package import (e.g., @radflow/theme-rad-os)
        // Try to resolve from node_modules or workspace packages
        const packageName = imp.path;

        // Extract the package directory name from the full package name
        // @radflow/theme-rad-os -> theme-rad-os
        const packageDirName = packageName.split('/').pop() || packageName;

        // First try workspace packages
        const workspacePath = join(process.cwd(), 'packages', packageDirName, 'index.css');

        try {
          importedCss = await readFile(workspacePath, 'utf-8');
          // Recursively resolve nested imports from the package
          importedCss = await resolveImports(importedCss, workspacePath);
        } catch {
          // Try node_modules as fallback
          const nodeModulesPath = join(process.cwd(), 'node_modules', packageName, 'index.css');
          try {
            importedCss = await readFile(nodeModulesPath, 'utf-8');
            importedCss = await resolveImports(importedCss, nodeModulesPath);
          } catch {
            // Package not found, keep the import statement
            console.warn(`Could not resolve import: ${imp.path}`);
            continue;
          }
        }
      } else if (imp.path === 'tailwindcss') {
        // Skip tailwindcss import - it's handled by the build system
        continue;
      } else {
        // Unknown import type, skip
        continue;
      }

      // Replace the import with the resolved content
      result = result.replace(imp.match, importedCss);
    } catch (error) {
      console.warn(`Failed to resolve import ${imp.path}:`, error);
    }
  }

  return result;
}

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    let css = await readFile(GLOBALS_PATH, 'utf-8');

    // Resolve all imports to get the full CSS content
    css = await resolveImports(css, GLOBALS_PATH);

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read CSS', details: String(error) },
      { status: 500 }
    );
  }
}
