import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { parseThemePackage, type ThemeConfig } from '@radflow/devtools/lib/themeConfig';

/**
 * GET /api/devtools/themes/list
 *
 * Discovers all theme packages in the monorepo and returns their metadata.
 * Scans packages/ directory for theme-* folders and parses their package.json.
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const packagesDir = join(process.cwd(), 'packages');
    const entries = await readdir(packagesDir, { withFileTypes: true });

    const themes: ThemeConfig[] = [];

    // Scan for theme packages
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      // Check if this is a theme package (starts with 'theme-')
      if (!entry.name.startsWith('theme-')) continue;

      const packagePath = join(packagesDir, entry.name);
      const packageJsonPath = join(packagePath, 'package.json');

      try {
        const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonContent);

        // Parse theme configuration
        const themeConfig = parseThemePackage(packageJson, packagePath);
        themes.push(themeConfig);
      } catch (error) {
        console.warn(`Failed to parse theme package ${entry.name}:`, error);
        // Continue scanning other packages
      }
    }

    return NextResponse.json({ themes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to discover themes', details: String(error) },
      { status: 500 }
    );
  }
}
