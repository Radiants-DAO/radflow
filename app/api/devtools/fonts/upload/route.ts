import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const FONTS_DIR = join(process.cwd(), 'public', 'fonts');

export async function POST(req: Request) {
  // Security: Block in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    // Note: 'name' field is extracted from formData but not used in file operations
    const family = formData.get('family') as string;
    const weight = formData.get('weight') as string;
    const style = formData.get('style') as string;
    const format = formData.get('format') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Ensure fonts directory exists
    if (!existsSync(FONTS_DIR)) {
      await mkdir(FONTS_DIR, { recursive: true });
    }

    // Generate filename
    const safeFamilyName = family.replace(/\s+/g, '-');
    const weightLabel = getWeightLabel(parseInt(weight, 10));
    const styleLabel = style === 'italic' ? '-Italic' : '';
    const filename = `${safeFamilyName}-${weightLabel}${styleLabel}.${format}`;

    // Write file
    const filePath = join(FONTS_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return the public path
    const publicPath = `/fonts/${filename}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload font', details: String(error) },
      { status: 500 }
    );
  }
}

function getWeightLabel(weight: number): string {
  const labels: Record<number, string> = {
    100: 'Thin',
    200: 'ExtraLight',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
    800: 'ExtraBold',
    900: 'Black',
  };
  return labels[weight] || 'Regular';
}

