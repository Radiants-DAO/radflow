import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';

/**
 * Remove CSS comments from a string
 */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Resolve @import statements in CSS and return the combined content.
 */
async function resolveImports(css: string, basePath: string): Promise<string> {
  const importRegex = /@import\s+["']([^"']+)["']\s*;?/g;
  let result = css;
  const imports: { match: string; path: string; index: number }[] = [];

  const cssWithoutComments = stripComments(css);

  let match;
  while ((match = importRegex.exec(cssWithoutComments)) !== null) {
    imports.push({ match: match[0], path: match[1], index: match.index });
  }

  for (const imp of imports) {
    let importedCss = '';

    try {
      if (imp.path.startsWith('.') || imp.path.startsWith('/')) {
        const importPath = join(dirname(basePath), imp.path);
        importedCss = await readFile(importPath, 'utf-8');
        importedCss = await resolveImports(importedCss, importPath);
      } else if (imp.path.startsWith('@')) {
        const packageName = imp.path;
        const packageDirName = packageName.split('/').pop() || packageName;
        const workspacePath = join(process.cwd(), 'packages', packageDirName, 'index.css');

        try {
          importedCss = await readFile(workspacePath, 'utf-8');
          importedCss = await resolveImports(importedCss, workspacePath);
        } catch {
          const nodeModulesPath = join(process.cwd(), 'node_modules', packageName, 'index.css');
          try {
            importedCss = await readFile(nodeModulesPath, 'utf-8');
            importedCss = await resolveImports(importedCss, nodeModulesPath);
          } catch {
            continue;
          }
        }
      } else if (imp.path === 'tailwindcss') {
        continue;
      } else {
        continue;
      }

      result = result.replace(imp.match, importedCss);
    } catch (error) {
      console.warn(`Failed to resolve import ${imp.path}:`, error);
    }
  }

  return result;
}

/**
 * GET /api/devtools/read-css
 * Reads and resolves all CSS imports from globals.css
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const globalsPath = join(process.cwd(), 'app', 'globals.css');
    let css = await readFile(globalsPath, 'utf-8');
    css = await resolveImports(css, globalsPath);

    return new NextResponse(css, {
      headers: { 'Content-Type': 'text/css' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read CSS', details: String(error) },
      { status: 500 }
    );
  }
}
