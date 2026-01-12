import { NextResponse } from 'next/server';
import { getCurrentThemeImport } from '@radflow/devtools/lib/themeUtils';

/**
 * GET /api/devtools/themes/current
 *
 * Returns the currently active theme by reading the CSS import in globals.css.
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const currentPackage = await getCurrentThemeImport();

    if (!currentPackage) {
      return NextResponse.json(
        { error: 'No theme import found in globals.css' },
        { status: 404 }
      );
    }

    // Extract theme ID from package name
    // @radflow/theme-rad-os -> rad-os
    const themeId = currentPackage.replace('@radflow/theme-', '');

    return NextResponse.json({
      themeId,
      packageName: currentPackage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to detect current theme', details: String(error) },
      { status: 500 }
    );
  }
}
