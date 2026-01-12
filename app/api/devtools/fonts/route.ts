import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface FontInfo {
  family: string;
  files: Array<{ filename: string; path: string; format: string }>;
  source: 'local' | 'google' | 'remote';
  weights?: number[];
}

/**
 * Detect active theme from globals.css import
 */
async function detectActiveTheme(): Promise<string | null> {
  try {
    const globalsPath = join(process.cwd(), 'app', 'globals.css');
    const content = await readFile(globalsPath, 'utf-8');
    const match = content.match(/@import\s+["']@radflow\/theme-([^"']+)["']/);
    return match?.[1] || null;
  } catch {
    return null;
  }
}

/**
 * Parse @font-face declarations from CSS file
 */
function parseFontFacesFromCSS(css: string): FontInfo[] {
  const fonts: FontInfo[] = [];
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;

  let match;
  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];

    // Extract font-family
    const familyMatch = block.match(/font-family:\s*['"]?([^'";\n]+)['"]?/);
    if (!familyMatch) continue;

    const family = familyMatch[1].trim();

    // Extract src URL
    const srcMatch = block.match(/src:\s*url\(['"]?([^'")\s]+)['"]?\)/);
    const url = srcMatch?.[1] || '';

    // Extract format
    const formatMatch = block.match(/format\(['"]?([^'")\s]+)['"]?\)/);
    const format = formatMatch?.[1] || 'woff2';

    // Extract font-weight (can be a range like "100 900")
    const weightMatch = block.match(/font-weight:\s*([^;\n]+)/);
    const weightStr = weightMatch?.[1]?.trim() || '400';
    const weights: number[] = [];

    if (weightStr.includes(' ')) {
      // Variable font with weight range
      const [min, max] = weightStr.split(/\s+/).map(Number);
      for (let w = min; w <= max; w += 100) {
        weights.push(w);
      }
    } else {
      weights.push(parseInt(weightStr, 10) || 400);
    }

    // Determine source type
    let source: 'local' | 'google' | 'remote' = 'remote';
    if (url.includes('fonts.gstatic.com') || url.includes('fonts.googleapis.com')) {
      source = 'google';
    } else if (url.startsWith('/') || url.startsWith('./')) {
      source = 'local';
    }

    // Check if this font family already exists
    const existing = fonts.find((f) => f.family === family);
    if (existing) {
      // Add file to existing font
      existing.files.push({
        filename: family.replace(/\s+/g, '-') + '.' + format,
        path: url,
        format,
      });
    } else {
      fonts.push({
        family,
        files: [
          {
            filename: family.replace(/\s+/g, '-') + '.' + format,
            path: url,
            format,
          },
        ],
        source,
        weights,
      });
    }
  }

  return fonts;
}

export async function GET(request: Request) {
  // Security: Block in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    // Get theme from query param or auto-detect
    const { searchParams } = new URL(request.url);
    let themeId = searchParams.get('theme');

    if (!themeId) {
      themeId = await detectActiveTheme();
    }

    // Strategy 1: Theme with local fonts directory
    if (themeId) {
      const themeFontsDir = join(process.cwd(), 'packages', `theme-${themeId}`, 'fonts');
      if (existsSync(themeFontsDir)) {
        const fonts = await scanLocalFonts(themeFontsDir, `/fonts/themes/${themeId}`);
        return NextResponse.json({
          fonts,
          themeId,
          source: 'theme-local',
        });
      }

      // Strategy 2: Theme with fonts.css (Google Fonts / remote)
      const themeFontsCss = join(process.cwd(), 'packages', `theme-${themeId}`, 'fonts.css');
      if (existsSync(themeFontsCss)) {
        const cssContent = await readFile(themeFontsCss, 'utf-8');
        const fonts = parseFontFacesFromCSS(cssContent);
        return NextResponse.json({
          fonts,
          themeId,
          source: 'theme-css',
        });
      }
    }

    // Strategy 3: Fall back to public/fonts (legacy RadOS location)
    const publicFontsDir = join(process.cwd(), 'public', 'fonts');
    if (existsSync(publicFontsDir)) {
      const fonts = await scanLocalFonts(publicFontsDir, '/fonts');
      return NextResponse.json({
        fonts,
        themeId: themeId || null,
        source: 'public',
      });
    }

    // No fonts found
    return NextResponse.json({
      fonts: [],
      themeId: themeId || null,
      source: 'none',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list fonts', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Scan local fonts directory and return font info
 */
async function scanLocalFonts(
  fontsDir: string,
  fontPathPrefix: string
): Promise<Array<{ family: string; files: Array<{ filename: string; path: string; format: string }> }>> {
  const files = await readdir(fontsDir);

  // Filter to only font files
  const fontFiles = files.filter((file) => {
    const ext = file.split('.').pop()?.toLowerCase();
    return ['woff2', 'woff', 'ttf', 'otf'].includes(ext || '');
  });

  // Group fonts by family name
  const fontMap = new Map<string, Array<{ filename: string; path: string; format: string }>>();

  for (const file of fontFiles) {
    // Extract font family name from filename
    const nameWithoutExt = file.replace(/\.[^.]+$/, '');
    const parts = nameWithoutExt.split(/[-_]/);

    let familyName = parts[0];

    if (parts.length > 1) {
      const secondPart = parts[1];
      if (secondPart === 'Sans' || secondPart === 'Mono') {
        familyName = `${parts[0]} ${secondPart}`;
      } else if (secondPart.toLowerCase() === 'monospace') {
        familyName = `${parts[0]} Monospace`;
      }
    }

    // Capitalize first letter of each word
    familyName = familyName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const ext = file.split('.').pop()?.toLowerCase() || '';
    const path = `${fontPathPrefix}/${file}`;

    if (!fontMap.has(familyName)) {
      fontMap.set(familyName, []);
    }

    fontMap.get(familyName)!.push({
      filename: file,
      path,
      format: ext,
    });
  }

  // Convert to array format
  return Array.from(fontMap.entries()).map(([family, files]) => ({
    family,
    files,
  }));
}

