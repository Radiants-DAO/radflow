import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface ThemeConfig {
  id: string;
  name: string;
  packageName: string;
  description?: string;
  colorMode?: 'light' | 'dark';
}

/**
 * GET /api/devtools/themes/list
 * Discovers all theme packages in the monorepo
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

    for (const entry of entries) {
      if (!entry.isDirectory() || !entry.name.startsWith('theme-')) continue;

      const packagePath = join(packagesDir, entry.name);
      const packageJsonPath = join(packagePath, 'package.json');

      try {
        const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonContent);

        const themeId = entry.name.replace('theme-', '');
        const radflowConfig = packageJson.radflow || {};

        themes.push({
          id: themeId,
          name: radflowConfig.displayName || themeId,
          packageName: packageJson.name,
          description: radflowConfig.description || packageJson.description,
          colorMode: radflowConfig.colorMode,
        });
      } catch (error) {
        console.warn(`Failed to parse theme package ${entry.name}:`, error);
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
