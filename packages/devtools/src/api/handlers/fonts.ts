import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

interface FontFile {
  name: string;
  path: string;
  format: string;
}

/**
 * GET /api/devtools/fonts
 * Lists available font files in the public/fonts directory
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const fontsDir = join(process.cwd(), 'public', 'fonts');
    const fonts = await scanFontsDirectory(fontsDir, '/fonts');

    return NextResponse.json({ fonts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to scan fonts', details: String(error) },
      { status: 500 }
    );
  }
}

async function scanFontsDirectory(dirPath: string, urlPath: string): Promise<FontFile[]> {
  const fonts: FontFile[] = [];
  const validExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot'];

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const fullUrlPath = `${urlPath}/${entry.name}`;

      if (entry.isDirectory()) {
        const subFonts = await scanFontsDirectory(fullPath, fullUrlPath);
        fonts.push(...subFonts);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (validExtensions.includes(ext)) {
          fonts.push({
            name: entry.name,
            path: fullUrlPath,
            format: ext.slice(1),
          });
        }
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return fonts;
}
