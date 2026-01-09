import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const ASSETS_DIR = join(process.cwd(), 'public', 'assets');

// Allowed image extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.avif'];

// Extract filename from URL or Content-Disposition header
function extractFilename(url: string, contentDisposition?: string | null): string {
  // Try Content-Disposition first
  if (contentDisposition) {
    const match = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^'"\n;]+)\1/i);
    if (match && match[2]) {
      return match[2];
    }
  }

  // Parse URL path
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      // Remove query params if any leaked through
      const cleanName = lastSegment.split('?')[0];
      if (cleanName && cleanName.includes('.')) {
        return decodeURIComponent(cleanName);
      }
    }
  } catch {
    // URL parsing failed
  }

  // Generate a default filename with timestamp
  return `image-${Date.now()}.png`;
}

// Infer extension from content-type
function getExtensionFromContentType(contentType: string | null): string {
  if (!contentType) return '.png';

  const typeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/x-icon': '.ico',
    'image/vnd.microsoft.icon': '.ico',
    'image/avif': '.avif',
  };

  return typeMap[contentType.split(';')[0].trim()] || '.png';
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const { url, folder = 'images' } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Only allow http/https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Only HTTP/HTTPS URLs are supported' }, { status: 400 });
    }

    // Fetch the image
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RadTools-Asset-Downloader/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status} ${response.statusText}` },
        { status: 400 }
      );
    }

    const contentType = response.headers.get('content-type');
    const contentDisposition = response.headers.get('content-disposition');

    // Verify it's an image
    if (contentType && !contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'URL does not point to an image' },
        { status: 400 }
      );
    }

    // Get the image data
    const buffer = Buffer.from(await response.arrayBuffer());

    // Determine filename
    let filename = extractFilename(url, contentDisposition);

    // Ensure proper extension
    const ext = extname(filename).toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      const inferredExt = getExtensionFromContentType(contentType);
      filename = ext ? filename.replace(/\.[^.]+$/, inferredExt) : filename + inferredExt;
    }

    // Sanitize filename
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Validate folder path to prevent directory traversal
    const safePath = folder.replace(/\.\./g, '').replace(/^\/+/, '');
    const targetDir = join(ASSETS_DIR, safePath);

    // Ensure target directory exists
    await mkdir(targetDir, { recursive: true });

    // Write file
    const filePath = join(targetDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      filename,
      path: '/assets/' + safePath + '/' + filename,
      size: buffer.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to download image', details: String(error) },
      { status: 500 }
    );
  }
}
