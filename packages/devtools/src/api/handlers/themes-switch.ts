import { NextResponse } from 'next/server';
import { switchThemeImport, isValidThemePackageName } from '../../lib/themeUtils';

/**
 * POST /api/devtools/themes/switch
 * Switches the active theme by rewriting globals.css
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { themePackageName } = body;

    if (!themePackageName || typeof themePackageName !== 'string') {
      return NextResponse.json(
        { error: 'Theme package name is required' },
        { status: 400 }
      );
    }

    if (!isValidThemePackageName(themePackageName)) {
      return NextResponse.json(
        { error: 'Invalid theme package name' },
        { status: 400 }
      );
    }

    const result = await switchThemeImport(themePackageName);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to switch theme', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      previousTheme: result.previousTheme,
      newTheme: themePackageName,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
