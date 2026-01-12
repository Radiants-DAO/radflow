import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join, extname, basename } from 'path';

interface IconInfo {
  name: string;
  path: string;
  content?: string;
}

/**
 * GET /api/devtools/icons
 * Lists available SVG icons in the public/icons directory
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
    const includeContent = url.searchParams.get('content') === 'true';

    const iconsDir = join(process.cwd(), 'public', 'icons');
    const icons = await scanIconsDirectory(iconsDir, '/icons', includeContent);

    return NextResponse.json({ icons });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to scan icons', details: String(error) },
      { status: 500 }
    );
  }
}

async function scanIconsDirectory(
  dirPath: string,
  urlPath: string,
  includeContent: boolean
): Promise<IconInfo[]> {
  const icons: IconInfo[] = [];

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const fullUrlPath = `${urlPath}/${entry.name}`;

      if (entry.isDirectory()) {
        const subIcons = await scanIconsDirectory(fullPath, fullUrlPath, includeContent);
        icons.push(...subIcons);
      } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.svg') {
        const icon: IconInfo = {
          name: basename(entry.name, '.svg'),
          path: fullUrlPath,
        };

        if (includeContent) {
          try {
            icon.content = await readFile(fullPath, 'utf-8');
          } catch {
            // Ignore read errors
          }
        }

        icons.push(icon);
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return icons;
}
