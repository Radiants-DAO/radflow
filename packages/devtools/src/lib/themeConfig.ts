/**
 * Theme Configuration
 *
 * Defines the structure and utilities for theme configuration.
 * Themes are packages that provide CSS files, components, assets, and prompts.
 */

import { Theme } from '../store/slices/themeSlice';

/**
 * Extended theme configuration with additional metadata
 */
export interface ThemeConfig {
  // Basic info
  id: string;
  name: string;
  packageName: string;
  version: string;
  description?: string;

  // File paths
  cssFiles: string[];
  componentFolders?: string[];

  // Assets
  assets?: {
    icons?: string;
    logos?: string;
    images?: string;
  };

  // AI prompts
  prompts?: {
    path: string; // Path to prompts file
  };

  // Metadata
  author?: string;
  license?: string;
  repository?: string;
  keywords?: string[];
}

/**
 * Package.json structure for theme packages
 */
interface ThemePackageJson {
  name: string;
  version: string;
  description?: string;
  main?: string;
  exports?: Record<string, string>;
  author?: string;
  license?: string;
  repository?: string | { url: string };
  keywords?: string[];
}

/**
 * Parse a theme package.json file and extract theme configuration
 */
export function parseThemePackage(packageJson: ThemePackageJson, packagePath: string): ThemeConfig {
  // Generate theme ID from package name (e.g., '@radflow/theme-rad-os' -> 'rad-os')
  const id = extractThemeId(packageJson.name);

  // Extract display name (capitalize and format)
  const name = formatThemeName(id);

  // Parse CSS files from exports
  const cssFiles = extractCssFiles(packageJson.exports);

  // Determine component folders (if any)
  const componentFolders = extractComponentFolders(packagePath);

  return {
    id,
    name,
    packageName: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    cssFiles,
    componentFolders,
    author: packageJson.author,
    license: packageJson.license,
    repository: extractRepositoryUrl(packageJson.repository),
    keywords: packageJson.keywords,
  };
}

/**
 * Extract theme ID from package name
 * @example '@radflow/theme-rad-os' -> 'rad-os'
 * @example 'theme-my-theme' -> 'my-theme'
 */
function extractThemeId(packageName: string): string {
  const match = packageName.match(/theme-(.+)$/);
  return match ? match[1] : packageName;
}

/**
 * Format theme ID into display name
 * @example 'rad-os' -> 'RadOS'
 * @example 'my-theme' -> 'My Theme'
 */
function formatThemeName(id: string): string {
  // Special case for known themes
  if (id === 'rad-os') return 'RadOS';

  // General case: capitalize each word
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract CSS file paths from package.json exports
 */
function extractCssFiles(exports?: Record<string, string>): string[] {
  if (!exports) return [];

  const cssFiles: string[] = [];

  for (const [, value] of Object.entries(exports)) {
    if (value.endsWith('.css')) {
      cssFiles.push(value);
    }
  }

  return cssFiles;
}

/**
 * Extract component folders from theme package
 */
function extractComponentFolders(_packagePath: string): string[] | undefined {
  // This will be implemented when we add file system scanning
  // For now, return undefined
  return undefined;
}

/**
 * Extract repository URL from package.json
 */
function extractRepositoryUrl(repository?: string | { url: string }): string | undefined {
  if (!repository) return undefined;
  if (typeof repository === 'string') return repository;
  return repository.url;
}

/**
 * Validate theme configuration
 * Returns an array of validation errors (empty if valid)
 */
export function validateThemeConfig(config: ThemeConfig): string[] {
  const errors: string[] = [];

  // Required fields
  if (!config.id) errors.push('Theme ID is required');
  if (!config.name) errors.push('Theme name is required');
  if (!config.packageName) errors.push('Package name is required');
  if (!config.version) errors.push('Version is required');

  // Package name format
  if (config.packageName && !config.packageName.includes('theme')) {
    errors.push('Package name should include "theme" (e.g., @radflow/theme-name)');
  }

  // Version format (basic semver check)
  if (config.version && !config.version.match(/^\d+\.\d+\.\d+/)) {
    errors.push('Version must follow semver format (e.g., 1.0.0)');
  }

  // CSS files should exist
  if (!config.cssFiles || config.cssFiles.length === 0) {
    errors.push('At least one CSS file is required');
  }

  return errors;
}

/**
 * Convert ThemeConfig to Theme (for store)
 */
export function themeConfigToTheme(config: ThemeConfig): Theme {
  return {
    id: config.id,
    name: config.name,
    packageName: config.packageName,
    version: config.version,
    description: config.description,
    cssFiles: config.cssFiles,
    componentFolders: config.componentFolders,
    isActive: false,
  };
}

/**
 * Check if a package name is a valid theme package
 */
export function isThemePackage(packageName: string): boolean {
  return packageName.includes('theme-') || packageName.startsWith('@radflow/theme');
}
