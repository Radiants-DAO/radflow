import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, unlink, mkdir, writeFile } from 'fs/promises';
import { join, relative, extname } from 'path';

const ASSETS_DIR = join(process.cwd(), 'public', 'assets');

interface AssetFile {
  name: string;
  path: string;
  type: 'image' | 'video' | 'other';
  size: number;
}

interface AssetFolder {
  name: string;
  path: string;
  children: (AssetFolder | AssetFile)[];
}

// GET - List all assets
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    // Ensure assets directory exists
    await mkdir(ASSETS_DIR, { recursive: true });
    
    // Also ensure subdirectories exist
    const subdirs = ['icons', 'images', 'logos', 'backgrounds'];
    for (const dir of subdirs) {
      await mkdir(join(ASSETS_DIR, dir), { recursive: true });
    }

    const assets = await scanAssets(ASSETS_DIR);
    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list assets', details: String(error) },
      { status: 500 }
    );
  }
}

// POST - Upload asset
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate folder path to prevent directory traversal
    const safePath = folder.replace(/\.\./g, '').replace(/^\/+/, '');
    const targetDir = join(ASSETS_DIR, safePath);
    
    // Ensure target directory exists
    await mkdir(targetDir, { recursive: true });

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = join(targetDir, file.name);
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      path: '/assets/' + safePath + '/' + file.name 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete asset
export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const { path: filePath } = await req.json();

    // Validate path to prevent directory traversal
    const safePath = filePath.replace(/\.\./g, '').replace(/^\/+/, '');
    const fullPath = join(process.cwd(), 'public', safePath);

    // Ensure the path is within the assets directory
    if (!fullPath.startsWith(ASSETS_DIR)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    await unlink(fullPath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete file', details: String(error) },
      { status: 500 }
    );
  }
}

async function scanAssets(dir: string): Promise<AssetFolder> {
  const entries = await readdir(dir, { withFileTypes: true });
  const children: (AssetFolder | AssetFile)[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = '/assets/' + relative(ASSETS_DIR, fullPath);

    if (entry.isDirectory()) {
      const folder = await scanAssets(fullPath);
      children.push(folder);
    } else {
      const stats = await stat(fullPath);
      const ext = extname(entry.name).toLowerCase();
      
      let type: 'image' | 'video' | 'other' = 'other';
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
        type = 'image';
      } else if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) {
        type = 'video';
      }

      children.push({
        name: entry.name,
        path: relativePath,
        type,
        size: stats.size,
      });
    }
  }

  return {
    name: dir === ASSETS_DIR ? 'assets' : relative(join(dir, '..'), dir),
    path: '/assets/' + relative(ASSETS_DIR, dir),
    children,
  };
}

