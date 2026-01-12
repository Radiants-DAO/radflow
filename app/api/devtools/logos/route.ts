import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface LogoData {
  name: string;
  path: string;
  variant: 'wordmark' | 'mark' | 'radsun';
  color: 'cream' | 'black' | 'yellow';
}

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const logosDir = path.join(process.cwd(), 'public/assets/logos');

    // Check if directory exists
    try {
      await fs.access(logosDir);
    } catch {
      return NextResponse.json({ logos: [], error: 'Logos directory not found' });
    }

    // Read directory
    const files = await fs.readdir(logosDir);

    // Parse logo files
    const logos: LogoData[] = files
      .filter((file) => file.endsWith('.svg'))
      .map((file) => {
        const name = file.replace('.svg', '');
        const parts = name.split('-');

        // Determine variant
        let variant: 'wordmark' | 'mark' | 'radsun' = 'mark';
        if (name.startsWith('wordmark')) {
          variant = 'wordmark';
        } else if (name.startsWith('radsun')) {
          variant = 'radsun';
        } else if (name.startsWith('rad-mark')) {
          variant = 'mark';
        }

        // Determine color (last part)
        const color = parts[parts.length - 1] as 'cream' | 'black' | 'yellow';

        return {
          name,
          path: `/assets/logos/${file}`,
          variant,
          color,
        };
      })
      .sort((a, b) => {
        // Sort by variant first, then by color
        if (a.variant !== b.variant) {
          return a.variant.localeCompare(b.variant);
        }
        return a.color.localeCompare(b.color);
      });

    return NextResponse.json({
      logos,
      count: logos.length,
      path: '/public/assets/logos/',
    });
  } catch (error) {
    console.error('Failed to scan logos:', error);
    return NextResponse.json(
      { error: 'Failed to scan logos directory' },
      { status: 500 }
    );
  }
}
