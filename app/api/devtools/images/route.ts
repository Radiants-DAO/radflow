import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ImageFile {
  name: string;
  path: string;
  size: number;
  dimensions?: { width: number; height: number };
  format: string;
}

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const imagesDir = path.join(process.cwd(), 'public/assets/images');

    // Check if directory exists
    try {
      await fs.access(imagesDir);
    } catch {
      // Directory doesn't exist yet, return empty array
      return NextResponse.json({ images: [], count: 0 });
    }

    // Read directory
    const files = await fs.readdir(imagesDir);

    // Filter for image files
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
    const images: ImageFile[] = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!imageExtensions.includes(ext)) continue;

      const filePath = path.join(imagesDir, file);
      const stats = await fs.stat(filePath);

      images.push({
        name: file,
        path: `/assets/images/${file}`,
        size: stats.size,
        format: ext.slice(1).toUpperCase(),
      });
    }

    // Sort by name
    images.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      images,
      count: images.length,
      path: '/public/assets/images/',
    });
  } catch (error) {
    console.error('Failed to scan images:', error);
    return NextResponse.json(
      { error: 'Failed to scan images directory' },
      { status: 500 }
    );
  }
}
