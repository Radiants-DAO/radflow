import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * GET /api/devtools/themes/[themeId]/parse-css
 *
 * Reads and parses CSS files for a specific theme.
 * Returns parsed CSS data (colors, typography, tokens, etc.).
 *
 * Note: CSS parsing is intentionally done client-side (not here) to keep
 * the API lightweight. This endpoint is reserved for future use if we need
 * server-side parsing.
 *
 * For now, clients should:
 * 1. Fetch raw CSS from /api/devtools/themes/[themeId]/read-css
 * 2. Parse it client-side using @radflow/devtools/lib/cssParser
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
    // Read the CSS file
    const globalsPath = join(process.cwd(), 'app', 'globals.css');
    const css = await readFile(globalsPath, 'utf-8');

    // For now, return raw CSS and let client parse it
    // In the future, we could parse server-side if needed
    return NextResponse.json({
      themeId,
      css,
      note: 'Parse client-side using @radflow/devtools/lib/cssParser'
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
