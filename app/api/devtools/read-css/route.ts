import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

const GLOBALS_PATH = join(process.cwd(), 'app', 'globals.css');

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const css = await readFile(GLOBALS_PATH, 'utf-8');
    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read CSS', details: String(error) },
      { status: 500 }
    );
  }
}

