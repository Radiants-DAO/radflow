import { NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * GET /api/devtools/themes/[themeId]/icons
 *
 * Returns icon information for a specific theme.
 * - Local icons: Reads from theme's icons directory
 * - Library icons: Returns icon library configuration from package.json
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
    // Read theme's package.json for icon configuration
    const packageJsonPath = join(packageDir, 'package.json');
    let packageJson: {
      radflow?: {
        icons?: {
          library?: string;
          style?: string;
          package?: string;
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

    const iconConfig = packageJson.radflow?.icons || {};

    // Check for local icons in theme's icons directory
    const themeIconsDir = join(packageDir, 'icons');
    const localIcons: string[] = [];

    if (existsSync(themeIconsDir)) {
      const files = await readdir(themeIconsDir);
      const svgFiles = files
        .filter(file => file.endsWith('.svg'))
        .map(file => file.replace('.svg', ''))
        .sort();
      localIcons.push(...svgFiles);
    }

    // Also check public/assets/icons for backwards compatibility (RadOS)
    const publicIconsDir = join(process.cwd(), 'public', 'assets', 'icons');
    const publicIcons: string[] = [];

    if (existsSync(publicIconsDir)) {
      const files = await readdir(publicIconsDir);
      const svgFiles = files
        .filter(file => file.endsWith('.svg'))
        .map(file => file.replace('.svg', ''))
        .sort();
      publicIcons.push(...svgFiles);
    }

    // Return icon information based on configuration
    const response: {
      themeId: string;
      iconLibrary: {
        library: string;
        style: string;
        package?: string;
        url?: string;
      } | null;
      localIcons: string[];
      publicIcons: string[];
      source: 'library' | 'local' | 'public';
    } = {
      themeId,
      iconLibrary: null,
      localIcons,
      publicIcons,
      source: 'public', // default
    };

    // If theme specifies an icon library
    if (iconConfig.library) {
      response.iconLibrary = {
        library: iconConfig.library,
        style: iconConfig.style || 'regular',
        package: iconConfig.package,
      };

      // Add library-specific URLs
      switch (iconConfig.library.toLowerCase()) {
        case 'phosphor':
          response.iconLibrary.url = 'https://phosphoricons.com/';
          response.source = 'library';
          break;
        case 'lucide':
          response.iconLibrary.url = 'https://lucide.dev/icons/';
          response.source = 'library';
          break;
        case 'heroicons':
          response.iconLibrary.url = 'https://heroicons.com/';
          response.source = 'library';
          break;
        case 'tabler':
          response.iconLibrary.url = 'https://tabler.io/icons';
          response.source = 'library';
          break;
      }
    } else if (localIcons.length > 0) {
      response.source = 'local';
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to get icons for theme "${themeId}"`, details: String(error) },
      { status: 500 }
    );
  }
}
