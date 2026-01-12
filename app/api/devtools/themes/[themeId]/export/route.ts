import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { validateThemeConfig } from '@/packages/devtools/src/lib/themeConfig';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ExportThemeRequest {
  includeComponents?: boolean;
  includeAssets?: boolean;
  includeAgents?: boolean;
  format?: 'tarball' | 'directory'; // Default: tarball
}

/**
 * Export a theme as a package ready for publishing
 *
 * GET /api/devtools/themes/[themeId]/export
 * Query params:
 *  - includeComponents: boolean (default: true)
 *  - includeAssets: boolean (default: true)
 *  - includeAgents: boolean (default: true)
 *  - format: 'tarball' | 'directory' (default: 'tarball')
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ themeId: string }> }
) {
  try {
    const { themeId } = await params;
    const searchParams = request.nextUrl.searchParams;

    const includeComponents = searchParams.get('includeComponents') !== 'false';
    const includeAssets = searchParams.get('includeAssets') !== 'false';
    const includeAgents = searchParams.get('includeAgents') !== 'false';
    const format = (searchParams.get('format') as 'tarball' | 'directory') || 'tarball';

    // Locate theme directory
    const packagesDir = path.join(process.cwd(), 'packages');
    const themePath = path.join(packagesDir, `theme-${themeId}`);

    // Verify theme exists
    try {
      await fs.access(themePath);
    } catch {
      return NextResponse.json(
        { error: `Theme not found: theme-${themeId}` },
        { status: 404 }
      );
    }

    // Read and validate package.json
    const packageJsonPath = path.join(themePath, 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    // Extract theme config
    const themeConfig = {
      id: themeId,
      name: packageJson.name,
      packageName: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      cssFiles: extractCssFilesFromExports(packageJson.exports),
    };

    // Validate theme configuration
    const validationErrors = validateThemeConfig(themeConfig);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Theme validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    // Generate README if it doesn't exist or is outdated
    const readmePath = path.join(themePath, 'README.md');
    try {
      await fs.access(readmePath);
    } catch {
      // README doesn't exist, generate it
      const readme = await generateReadmeForExport(themePath, packageJson);
      await fs.writeFile(readmePath, readme, 'utf-8');
    }

    // Create export manifest
    const manifest = {
      themeId,
      packageName: packageJson.name,
      version: packageJson.version,
      exportedAt: new Date().toISOString(),
      includes: {
        components: includeComponents,
        assets: includeAssets,
        agents: includeAgents,
      },
    };

    // Write manifest
    const manifestPath = path.join(themePath, '.export-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

    if (format === 'tarball') {
      // Create tarball for distribution using npm pack
      const tarballName = `${packageJson.name.replace(/[@\/]/g, '-')}-${packageJson.version}.tgz`;
      const tmpDir = path.join(process.cwd(), 'tmp');
      await fs.mkdir(tmpDir, { recursive: true });

      try {
        // Use npm pack to create a proper npm package tarball
        const { stdout } = await execAsync('npm pack', { cwd: themePath });
        const createdTarball = stdout.trim();
        const sourceTarballPath = path.join(themePath, createdTarball);
        const destTarballPath = path.join(tmpDir, tarballName);

        // Move tarball to tmp directory
        await fs.rename(sourceTarballPath, destTarballPath);

        // Read the tarball and return as download
        const tarballBuffer = await fs.readFile(destTarballPath);

        // Clean up temporary files
        await fs.unlink(destTarballPath);
        await fs.unlink(manifestPath);

        return new NextResponse(tarballBuffer, {
          headers: {
            'Content-Type': 'application/gzip',
            'Content-Disposition': `attachment; filename="${tarballName}"`,
          },
        });
      } catch (error) {
        // Clean up on error
        await fs.unlink(manifestPath).catch(() => {});
        throw error;
      }
    } else {
      // Return directory path (for local exports)
      await fs.unlink(manifestPath);
      return NextResponse.json({
        success: true,
        themePath: `packages/theme-${themeId}`,
        manifest,
      });
    }
  } catch (error) {
    console.error('Error exporting theme:', error);
    return NextResponse.json(
      {
        error: 'Failed to export theme',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * Extract CSS files from package.json exports
 */
function extractCssFilesFromExports(exports?: Record<string, string>): string[] {
  if (!exports) return [];

  const cssFiles: string[] = [];

  for (const [key, value] of Object.entries(exports)) {
    if (value.endsWith('.css')) {
      cssFiles.push(value);
    }
  }

  return cssFiles;
}

/**
 * Generate README content for theme export
 */
async function generateReadmeForExport(themePath: string, packageJson: any): Promise<string> {
  const themeId = packageJson.name.replace(/^@radflow\/theme-/, '');
  const themeName = themeId
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Check what's included in the theme
  const hasComponents = await directoryHasFiles(path.join(themePath, 'components'));
  const hasIcons = await directoryHasFiles(path.join(themePath, 'assets', 'icons'));
  const hasLogos = await directoryHasFiles(path.join(themePath, 'assets', 'logos'));
  const hasAgents = await directoryHasFiles(path.join(themePath, 'agents'));

  return `# ${themeName}

${packageJson.description || `A custom theme for RadFlow`}

## Installation

\`\`\`bash
npm install ${packageJson.name}
# or
pnpm add ${packageJson.name}
# or
yarn add ${packageJson.name}
\`\`\`

## Usage

Import the theme in your global CSS file:

\`\`\`css
@import "tailwindcss";
@import "${packageJson.name}";
\`\`\`

Or import specific parts:

\`\`\`css
@import "${packageJson.name}/fonts";
@import "${packageJson.name}/tokens";
@import "${packageJson.name}/dark";
@import "${packageJson.name}/typography";
\`\`\`

## What's Included

${hasComponents ? '- ✅ Custom UI components' : ''}
${hasIcons ? '- ✅ Icon library' : ''}
${hasLogos ? '- ✅ Logo assets' : ''}
${hasAgents ? '- ✅ AI agents and prompts' : ''}
- ✅ Design tokens and semantic colors
- ✅ Typography system
- ✅ Dark mode support
- ✅ Custom animations

## Dark Mode

This theme includes dark mode support. Add the \`dark\` class to your root element to enable:

\`\`\`html
<html class="dark">
  <!-- Your app -->
</html>
\`\`\`

## Documentation

For full documentation, visit [RadFlow Documentation](https://github.com/Radiants-DAO/radflow).

## License

${packageJson.license || 'MIT'}

## Version

Current version: ${packageJson.version}

---

Generated by RadFlow DevTools
`;
}

/**
 * Check if a directory exists and has files
 */
async function directoryHasFiles(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath);
    return files.length > 0;
  } catch {
    return false;
  }
}

