import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

/**
 * GET /api/devtools/components/folders
 *
 * Returns component folders for the active theme.
 * Reads from packages/theme-{activeTheme}/components/
 * Falls back to /components/ if no theme-specific folder exists.
 */
export async function GET(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  // Get active theme from query string or detect from globals.css
  const url = new URL(req.url);
  let themeId = url.searchParams.get('theme');

  if (!themeId) {
    // Detect active theme from globals.css
    try {
      const globalsPath = join(process.cwd(), 'app', 'globals.css');
      const globalsContent = await readFile(globalsPath, 'utf-8');
      const match = globalsContent.match(/@import\s+["']@radflow\/theme-([^"']+)["']/);
      themeId = match?.[1] || null;
    } catch {
      // Couldn't detect theme
    }
  }

  const EXCLUDED_FOLDERS = ['icons']; // icons has its own dedicated tab

  // Try theme-specific components folder first
  if (themeId) {
    const themeComponentsDir = join(process.cwd(), 'packages', `theme-${themeId}`, 'components');
    try {
      const entries = await readdir(themeComponentsDir, { withFileTypes: true });
      const folders = entries
        .filter((entry) =>
          entry.isDirectory() &&
          !entry.name.startsWith('.') &&
          !EXCLUDED_FOLDERS.includes(entry.name)
        )
        .map((entry) => entry.name)
        .sort();

      return NextResponse.json({
        folders,
        source: 'theme',
        themeId,
      });
    } catch {
      // Theme doesn't have components folder, fall through
    }
  }

  // Fall back to root /components/ directory
  const rootComponentsDir = join(process.cwd(), 'components');
  try {
    const entries = await readdir(rootComponentsDir, { withFileTypes: true });
    const folders = entries
      .filter((entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        !EXCLUDED_FOLDERS.includes(entry.name)
      )
      .map((entry) => entry.name)
      .sort();

    return NextResponse.json({
      folders,
      source: 'root',
      themeId: themeId || null,
    });
  } catch (error) {
    // If components directory doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({
        folders: [],
        source: 'none',
        themeId: themeId || null,
      });
    }
    return NextResponse.json(
      { error: 'Failed to list folders', details: String(error) },
      { status: 500 }
    );
  }
}
