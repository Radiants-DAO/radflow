import { NextResponse } from 'next/server';
import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

interface ComponentInfo {
  name: string;
  path: string;
  hasDefaultExport: boolean;
}

/**
 * GET /api/devtools/components
 * Discovers React components in the project
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const url = new URL(req.url);
    const dir = url.searchParams.get('dir') || 'components';

    const componentsDir = join(process.cwd(), dir);
    const components = await scanDirectory(componentsDir, dir);

    return NextResponse.json({ components, directory: dir });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to scan components', details: String(error) },
      { status: 500 }
    );
  }
}

async function scanDirectory(dirPath: string, relativePath: string): Promise<ComponentInfo[]> {
  const components: ComponentInfo[] = [];

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const relPath = join(relativePath, entry.name);

      if (entry.isDirectory()) {
        // Check for index file in directory
        const indexPath = join(fullPath, 'index.tsx');
        try {
          await stat(indexPath);
          const content = await readFile(indexPath, 'utf-8');
          const hasDefault = /export\s+default/.test(content);
          components.push({
            name: entry.name,
            path: relPath,
            hasDefaultExport: hasDefault,
          });
        } catch {
          // No index.tsx, scan recursively
          const subComponents = await scanDirectory(fullPath, relPath);
          components.push(...subComponents);
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (['.tsx', '.jsx'].includes(ext) && !entry.name.startsWith('_')) {
          const content = await readFile(fullPath, 'utf-8');
          const hasDefault = /export\s+default/.test(content);
          components.push({
            name: basename(entry.name, ext),
            path: relPath,
            hasDefaultExport: hasDefault,
          });
        }
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return components;
}
