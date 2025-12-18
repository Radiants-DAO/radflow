import { NextResponse } from 'next/server';
import { readFile, writeFile, copyFile } from 'fs/promises';
import { join } from 'path';

const GLOBALS_PATH = join(process.cwd(), 'app', 'globals.css');
const BACKUP_PATH = join(process.cwd(), 'app', '.globals.css.backup');

interface BrandColor {
  id: string;
  name: string;
  value: string;
  category: 'brand' | 'neutral';
}

interface SemanticToken {
  id: string;
  name: string;
  reference: string;
  category: 'background' | 'text' | 'border' | 'system';
}

interface ColorMode {
  id: string;
  name: string;
  className: string;
  overrides: Record<string, string>;
}

export async function POST(req: Request) {
  // Security: Block in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const { brandColors, semanticTokens, colorModes, borderRadius } = await req.json();

    // Create backup before writing
    try {
      await copyFile(GLOBALS_PATH, BACKUP_PATH);
    } catch {
      // Backup failed, but continue anyway - might be first run
      console.warn('Could not create backup of globals.css');
    }

    // Generate new CSS
    const newCSS = generateCSS({
      brandColors,
      semanticTokens,
      colorModes,
      borderRadius,
    });

    // Write updated CSS
    await writeFile(GLOBALS_PATH, newCSS, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to write CSS:', error);
    return NextResponse.json(
      { 
        error: 'Failed to write CSS', 
        details: String(error),
        hint: 'Try restoring from backup: copy .globals.css.backup to globals.css'
      },
      { status: 500 }
    );
  }
}

function generateCSS(data: {
  brandColors: BrandColor[];
  semanticTokens: SemanticToken[];
  colorModes: ColorMode[];
  borderRadius: Record<string, string>;
}): string {
  const { brandColors, semanticTokens, colorModes, borderRadius } = data;

  // Generate brand colors for @theme inline
  const brandColorVars = brandColors
    .map((c) => `  --${c.category === 'neutral' ? 'neutral' : 'brand'}-${c.name}: ${c.value};`)
    .join('\n');

  // Generate semantic tokens
  const semanticVars = semanticTokens
    .map((t) => {
      const value = t.reference.startsWith('--') ? `var(${t.reference})` : t.reference;
      return `  --color-${t.name}: ${value};`;
    })
    .join('\n');

  // Generate border radius
  const radiusVars = Object.entries(borderRadius)
    .map(([key, value]) => `  --radius-${key}: ${value};`)
    .join('\n');

  // Generate color mode classes
  const modeBlocks = colorModes
    .map((mode) => {
      const overrides = Object.entries(mode.overrides)
        .map(([token, ref]) => {
          const value = ref.startsWith('--') ? `var(${ref})` : ref;
          return `  --color-${token}: ${value};`;
        })
        .join('\n');
      return `.${mode.name} {\n${overrides}\n}`;
    })
    .join('\n\n');

  return `@import "tailwindcss";

@theme inline {
  /* ============================================
     BRAND COLORS (internal reference only)
     ============================================ */
  
${brandColorVars}
  
  /* Fonts */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@theme {
  /* ============================================
     SEMANTIC COLORS (generate utilities)
     ============================================ */
  
${semanticVars}
  
  /* Border Radius */
${radiusVars}
}

/* ============================================
   COLOR MODES
   ============================================ */

${modeBlocks}

body {
  background: var(--color-primary);
  color: var(--color-body);
  font-family: var(--font-sans), Arial, Helvetica, sans-serif;
}
`;
}

