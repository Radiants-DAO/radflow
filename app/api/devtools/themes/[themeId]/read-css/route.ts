import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * GET /api/devtools/themes/[themeId]/read-css
 *
 * Reads CSS files for a specific theme.
 * Returns the content of globals.css (which imports the theme's CSS).
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

  try {
    // For now, we read from app/globals.css which imports the active theme
    // In the future, we might read directly from the theme package's CSS files
    const globalsPath = join(process.cwd(), 'app', 'globals.css');
    const css = await readFile(globalsPath, 'utf-8');

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to read CSS for theme "${themeId}"`,
        details: String(error)
      },
      { status: 500 }
    );
  }
}
