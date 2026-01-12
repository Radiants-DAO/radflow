/**
 * DevTools Icons API
 *
 * Returns icon information for the active theme.
 * Supports both local SVG icons and icon libraries (Phosphor, Lucide, etc.)
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

interface IconLibraryConfig {
  library: string;
  style: string;
  package?: string;
  url?: string;
}

/**
 * Detect active theme from globals.css import
 */
async function detectActiveTheme(): Promise<string | null> {
  try {
    const globalsPath = path.join(process.cwd(), 'app', 'globals.css');
    const content = await fs.readFile(globalsPath, 'utf-8');
    const match = content.match(/@import\s+["']@radflow\/theme-([^"']+)["']/);
    return match?.[1] || null;
  } catch {
    return null;
  }
}

/**
 * Get icon library info with URLs
 */
function getIconLibraryInfo(library: string, style?: string): IconLibraryConfig {
  const libraryLower = library.toLowerCase();
  const config: IconLibraryConfig = {
    library,
    style: style || 'regular',
  };

  switch (libraryLower) {
    case 'phosphor':
      config.package = '@phosphor-icons/react';
      config.url = 'https://phosphoricons.com/';
      break;
    case 'lucide':
      config.package = 'lucide-react';
      config.url = 'https://lucide.dev/icons/';
      break;
    case 'heroicons':
      config.package = '@heroicons/react';
      config.url = 'https://heroicons.com/';
      break;
    case 'tabler':
      config.package = '@tabler/icons-react';
      config.url = 'https://tabler.io/icons';
      break;
  }

  return config;
}

export async function GET(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    // Get theme from query param or auto-detect
    const { searchParams } = new URL(request.url);
    let themeId = searchParams.get('theme');

    if (!themeId) {
      themeId = await detectActiveTheme();
    }

    // Strategy 1: Check theme package.json for icon library config
    if (themeId) {
      const packageJsonPath = path.join(process.cwd(), 'packages', `theme-${themeId}`, 'package.json');
      if (existsSync(packageJsonPath)) {
        try {
          const content = await fs.readFile(packageJsonPath, 'utf-8');
          const packageJson = JSON.parse(content);
          const iconConfig = packageJson.radflow?.icons;

          if (iconConfig?.library) {
            // Theme uses an icon library
            const libraryInfo = getIconLibraryInfo(iconConfig.library, iconConfig.style);
            return NextResponse.json({
              themeId,
              source: 'library',
              icons: [],
              iconLibrary: libraryInfo,
            });
          }
        } catch {
          // Failed to parse package.json
        }
      }

      // Strategy 2: Check for local icons in theme's icons directory
      const themeIconsDir = path.join(process.cwd(), 'packages', `theme-${themeId}`, 'icons');
      if (existsSync(themeIconsDir)) {
        const files = await fs.readdir(themeIconsDir);
        const icons = files
          .filter((file) => file.endsWith('.svg'))
          .map((file) => file.replace('.svg', ''))
          .sort();

        return NextResponse.json({
          themeId,
          source: 'theme-local',
          icons,
          count: icons.length,
          path: `/icons/themes/${themeId}/`,
        });
      }
    }

    // Strategy 3: Fall back to public/assets/icons (legacy RadOS location)
    const publicIconsDir = path.join(process.cwd(), 'public/assets/icons');
    if (existsSync(publicIconsDir)) {
      const files = await fs.readdir(publicIconsDir);
      const icons = files
        .filter((file) => file.endsWith('.svg'))
        .map((file) => file.replace('.svg', ''))
        .sort();

      return NextResponse.json({
        themeId: themeId || null,
        source: 'public',
        icons,
        count: icons.length,
        path: '/assets/icons/',
      });
    }

    // No icons found
    return NextResponse.json({
      themeId: themeId || null,
      source: 'none',
      icons: [],
      count: 0,
    });
  } catch (error) {
    console.error('Failed to scan icons:', error);
    return NextResponse.json(
      { error: 'Failed to scan icons directory' },
      { status: 500 }
    );
  }
}
