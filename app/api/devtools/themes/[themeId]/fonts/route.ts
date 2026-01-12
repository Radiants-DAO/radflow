import { NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * GET /api/devtools/themes/[themeId]/fonts
 *
 * Returns font information for a specific theme.
 * Reads font configuration from the theme's package.json and fonts directory.
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
  const packageDir = join(process.cwd(), 'packages', `theme-${themeId}`);

  try {
    // Read theme's package.json for font configuration
    const packageJsonPath = join(packageDir, 'package.json');
    let packageJson: {
      radflow?: {
        fonts?: {
          heading?: string;
          body?: string;
          mono?: string;
          [key: string]: string | undefined;
        };
      };
    } = {};

    try {
      const content = await readFile(packageJsonPath, 'utf-8');
      packageJson = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: `Could not read package.json for theme "${themeId}"` },
        { status: 404 }
      );
    }

    const fontConfig = packageJson.radflow?.fonts || {};

    // Check for local fonts in theme's fonts directory
    const themeFontsDir = join(packageDir, 'fonts');
    const localFonts: Array<{
      family: string;
      role: string;
      files: Array<{ filename: string; path: string; format: string }>;
      source: 'local';
    }> = [];

    if (existsSync(themeFontsDir)) {
      const files = await readdir(themeFontsDir);
      const fontFiles = files.filter(file => {
        const ext = file.split('.').pop()?.toLowerCase();
        return ['woff2', 'woff', 'ttf', 'otf'].includes(ext || '');
      });

      // Group by family name
      const fontMap = new Map<string, Array<{ filename: string; path: string; format: string }>>();

      for (const file of fontFiles) {
        const nameWithoutExt = file.replace(/\.[^.]+$/, '');
        const parts = nameWithoutExt.split(/[-_]/);
        let familyName = parts[0];

        if (parts.length > 1) {
          const secondPart = parts[1];
          if (['Sans', 'Mono', 'Serif'].includes(secondPart)) {
            familyName = `${parts[0]} ${secondPart}`;
          } else if (secondPart.toLowerCase() === 'monospace') {
            familyName = `${parts[0]} Monospace`;
          }
        }

        familyName = familyName
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        const ext = file.split('.').pop()?.toLowerCase() || '';
        const path = `/fonts/themes/${themeId}/${file}`;

        if (!fontMap.has(familyName)) {
          fontMap.set(familyName, []);
        }
        fontMap.get(familyName)!.push({ filename: file, path, format: ext });
      }

      for (const [family, files] of fontMap) {
        // Determine role based on fontConfig
        let role = 'custom';
        for (const [key, value] of Object.entries(fontConfig)) {
          if (value === family) {
            role = key;
            break;
          }
        }
        localFonts.push({ family, role, files, source: 'local' });
      }
    }

    // Build remote/Google fonts from config
    const remoteFonts: Array<{
      family: string;
      role: string;
      source: 'google' | 'remote';
      url?: string;
    }> = [];

    for (const [role, family] of Object.entries(fontConfig)) {
      if (!family) continue;

      // Check if this font is already in local fonts
      const isLocal = localFonts.some(f => f.family === family);
      if (!isLocal) {
        // Assume it's a Google Font
        remoteFonts.push({
          family,
          role,
          source: 'google',
          url: `https://fonts.google.com/specimen/${encodeURIComponent(family.replace(/\s+/g, '+'))}`,
        });
      }
    }

    return NextResponse.json({
      themeId,
      config: fontConfig,
      localFonts,
      remoteFonts,
      allFonts: [
        ...localFonts.map(f => ({
          family: f.family,
          role: f.role,
          source: f.source,
          files: f.files,
        })),
        ...remoteFonts.map(f => ({
          family: f.family,
          role: f.role,
          source: f.source,
          url: f.url,
        })),
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get fonts for theme "${themeId}"`, details: String(error) },
      { status: 500 }
    );
  }
}
