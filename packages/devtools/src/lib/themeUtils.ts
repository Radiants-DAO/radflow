/**
 * Theme Utilities
 *
 * Utilities for managing theme switching, CSS import rewriting, and theme operations.
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const GLOBALS_PATH = join(process.cwd(), 'app', 'globals.css');

/**
 * Switch the active theme by rewriting the CSS import in globals.css
 *
 * This function:
 * 1. Reads the current globals.css file
 * 2. Finds and replaces the theme import line
 * 3. Writes the updated CSS back to globals.css
 * 4. Returns success/failure status
 *
 * @param themePackageName - The npm package name of the theme (e.g., '@radflow/theme-rad-os')
 * @returns Promise resolving to success status and optional error message
 */
export async function switchThemeImport(themePackageName: string): Promise<{
  success: boolean;
  error?: string;
  previousTheme?: string;
}> {
  try {
    // Read current globals.css
    const currentCSS = await readFile(GLOBALS_PATH, 'utf-8');

    // Find the current theme import line
    // Pattern matches: @import "@radflow/theme-<name>";
    const themeImportRegex = /@import\s+["']@radflow\/theme-[^"']+["'];?/g;
    const currentImportMatch = currentCSS.match(themeImportRegex);

    if (!currentImportMatch || currentImportMatch.length === 0) {
      return {
        success: false,
        error: 'No theme import found in globals.css',
      };
    }

    // Extract previous theme name for rollback capability
    const previousTheme = currentImportMatch[0].match(/@radflow\/theme-([^"']+)/)?.[1];

    // Generate new import line
    const newImportLine = `@import "${themePackageName}";`;

    // Replace the theme import line
    const updatedCSS = currentCSS.replace(themeImportRegex, newImportLine);

    // Write updated CSS back to file
    await writeFile(GLOBALS_PATH, updatedCSS, 'utf-8');

    return {
      success: true,
      previousTheme,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Verify the current theme import in globals.css
 *
 * @returns The current theme package name, or null if not found
 */
export async function getCurrentThemeImport(): Promise<string | null> {
  try {
    const currentCSS = await readFile(GLOBALS_PATH, 'utf-8');
    const themeImportRegex = /@import\s+["'](@radflow\/theme-[^"']+)["'];?/;
    const match = currentCSS.match(themeImportRegex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate that a theme package name is in the correct format
 *
 * @param packageName - The package name to validate
 * @returns true if valid, false otherwise
 */
export function isValidThemePackageName(packageName: string): boolean {
  // Should match pattern: @radflow/theme-<name> or theme-<name>
  const pattern = /^(@radflow\/)?theme-[a-z0-9-]+$/;
  return pattern.test(packageName);
}

/**
 * Trigger a hot reload by touching a Next.js file
 * This ensures the CSS changes are reflected immediately
 *
 * Note: In Next.js dev mode, file changes trigger automatic reloads.
 * This function is a placeholder for future enhancement.
 *
 * @returns Promise resolving when reload is triggered
 */
export async function triggerHotReload(): Promise<void> {
  // In Next.js dev mode, the file write automatically triggers HMR
  // No additional action needed
  return Promise.resolve();
}

/**
 * Get the theme ID from the current theme import
 * Extracts 'phase' from '@radflow/theme-phase' or 'rad-os' from '@radflow/theme-rad-os'
 *
 * @returns The theme ID, or null if not found
 */
export async function getCurrentThemeId(): Promise<string | null> {
  const packageName = await getCurrentThemeImport();
  if (!packageName) return null;

  // Extract theme ID from package name: @radflow/theme-phase -> phase
  const match = packageName.match(/@radflow\/theme-(.+)/);
  return match ? match[1] : null;
}

/**
 * Get file paths for a theme's CSS files
 *
 * @param themeId - The theme identifier (e.g., 'phase', 'rad-os')
 * @returns Object with paths to all theme CSS files
 */
export function getThemeFilePaths(themeId: string): {
  tokensPath: string;
  typographyPath: string;
  fontsPath: string;
  darkPath: string;
  basePath: string;
  scrollbarPath: string;
  animationsPath: string;
  indexPath: string;
  packageDir: string;
} {
  const packageDir = join(process.cwd(), 'packages', `theme-${themeId}`);
  return {
    packageDir,
    tokensPath: join(packageDir, 'tokens.css'),
    typographyPath: join(packageDir, 'typography.css'),
    fontsPath: join(packageDir, 'fonts.css'),
    darkPath: join(packageDir, 'dark.css'),
    basePath: join(packageDir, 'base.css'),
    scrollbarPath: join(packageDir, 'scrollbar.css'),
    animationsPath: join(packageDir, 'animations.css'),
    indexPath: join(packageDir, 'index.css'),
  };
}
