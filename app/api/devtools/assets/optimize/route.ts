import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import sharp from 'sharp';

const ASSETS_DIR = join(process.cwd(), 'public', 'assets');

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const { files } = await req.json();

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const results: { path: string; originalSize: number; optimizedSize: number }[] = [];

    for (const filePath of files) {
      // Validate path to prevent directory traversal
      const safePath = filePath.replace(/\.\./g, '').replace(/^\/+/, '');
      const fullPath = join(process.cwd(), 'public', safePath);

      // Ensure the path is within the assets directory
      if (!fullPath.startsWith(ASSETS_DIR)) {
        continue;
      }

      const ext = extname(fullPath).toLowerCase();
      
      // Only optimize images
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        continue;
      }

      try {
        const originalBuffer = await readFile(fullPath);
        const originalSize = originalBuffer.length;

        let optimizedBuffer: Buffer;

        if (ext === '.png') {
          optimizedBuffer = await sharp(originalBuffer)
            .png({ quality: 80, compressionLevel: 9 })
            .toBuffer();
        } else if (ext === '.webp') {
          optimizedBuffer = await sharp(originalBuffer)
            .webp({ quality: 80 })
            .toBuffer();
        } else {
          optimizedBuffer = await sharp(originalBuffer)
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();
        }

        // Only save if we actually reduced the size
        if (optimizedBuffer.length < originalSize) {
          await writeFile(fullPath, optimizedBuffer);
          results.push({
            path: safePath,
            originalSize,
            optimizedSize: optimizedBuffer.length,
          });
        } else {
          results.push({
            path: safePath,
            originalSize,
            optimizedSize: originalSize,
          });
        }
      } catch {
        // Failed to optimize file - skip
      }
    }

    return NextResponse.json({ 
      success: true, 
      results,
      totalSaved: results.reduce((sum, r) => sum + (r.originalSize - r.optimizedSize), 0),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to optimize files', details: String(error) },
      { status: 500 }
    );
  }
}

