import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

const COMPONENTS_DIR = join(process.cwd(), 'components');

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true });
    
    // Filter to only directories, excluding hidden folders and special folders
    const EXCLUDED_FOLDERS = ['icons']; // icons has its own dedicated tab
    const folders = entries
      .filter((entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('.') &&
        !EXCLUDED_FOLDERS.includes(entry.name)
      )
      .map((entry) => entry.name)
      .sort();

    return NextResponse.json({ folders });
  } catch (error) {
    // If components directory doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ folders: [] });
    }
    return NextResponse.json(
      { error: 'Failed to list folders', details: String(error) },
      { status: 500 }
    );
  }
}
