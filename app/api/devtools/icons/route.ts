/**
 * DevTools Icons API
 *
 * Returns a list of all icon names from /public/assets/icons/
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const iconsDir = path.join(process.cwd(), 'public/assets/icons');

    // Check if directory exists
    try {
      await fs.access(iconsDir);
    } catch {
      return NextResponse.json({ icons: [], error: 'Icons directory not found' });
    }

    // Read directory
    const files = await fs.readdir(iconsDir);

    // Filter for SVG files and remove extension
    const icons = files
      .filter((file) => file.endsWith('.svg'))
      .map((file) => file.replace('.svg', ''))
      .sort();

    return NextResponse.json({
      icons,
      count: icons.length,
      path: '/public/assets/icons/',
    });
  } catch (error) {
    console.error('Failed to scan icons:', error);
    return NextResponse.json(
      { error: 'Failed to scan icons directory' },
      { status: 500 }
    );
  }
}
