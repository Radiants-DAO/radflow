/**
 * Version Utilities
 *
 * Utilities for semantic versioning of theme packages.
 * Handles version bumping, validation, and git tagging.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export type VersionBumpType = 'major' | 'minor' | 'patch';

/**
 * Parse a semantic version string into its components
 */
export function parseVersion(version: string): { major: number; minor: number; patch: number } | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

/**
 * Format version components back to string
 */
export function formatVersion(major: number, minor: number, patch: number): string {
  return `${major}.${minor}.${patch}`;
}

/**
 * Bump a version string according to the specified type
 * @example bumpVersion('1.2.3', 'patch') -> '1.2.4'
 * @example bumpVersion('1.2.3', 'minor') -> '1.3.0'
 * @example bumpVersion('1.2.3', 'major') -> '2.0.0'
 */
export function bumpVersion(currentVersion: string, bumpType: VersionBumpType): string {
  const parsed = parseVersion(currentVersion);
  if (!parsed) {
    throw new Error(`Invalid version format: ${currentVersion}`);
  }

  let { major, minor, patch } = parsed;

  switch (bumpType) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
      patch += 1;
      break;
  }

  return formatVersion(major, minor, patch);
}

/**
 * Validate that a version string follows semantic versioning
 */
export function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(version);
}

/**
 * Compare two semantic versions
 * @returns -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const parsed1 = parseVersion(v1);
  const parsed2 = parseVersion(v2);

  if (!parsed1 || !parsed2) {
    throw new Error('Invalid version format');
  }

  if (parsed1.major !== parsed2.major) {
    return parsed1.major > parsed2.major ? 1 : -1;
  }

  if (parsed1.minor !== parsed2.minor) {
    return parsed1.minor > parsed2.minor ? 1 : -1;
  }

  if (parsed1.patch !== parsed2.patch) {
    return parsed1.patch > parsed2.patch ? 1 : -1;
  }

  return 0;
}

/**
 * Update the version field in a package.json file
 */
export async function updatePackageVersion(
  packageJsonPath: string,
  newVersion: string
): Promise<void> {
  if (!isValidVersion(newVersion)) {
    throw new Error(`Invalid version format: ${newVersion}`);
  }

  const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);

  packageJson.version = newVersion;

  await fs.promises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf-8'
  );
}

/**
 * Get the current version from a package.json file
 */
export async function getCurrentVersion(packageJsonPath: string): Promise<string> {
  const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  return packageJson.version;
}

/**
 * Get the path to a theme's package.json
 */
export function getThemePackageJsonPath(themeId: string): string {
  const workspaceRoot = process.cwd();
  return path.join(workspaceRoot, 'packages', `theme-${themeId}`, 'package.json');
}

/**
 * Bump the version of a theme package
 * Updates package.json and returns the new version
 */
export async function bumpThemeVersion(
  themeId: string,
  bumpType: VersionBumpType
): Promise<string> {
  const packageJsonPath = getThemePackageJsonPath(themeId);

  // Check if package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Theme package.json not found: ${packageJsonPath}`);
  }

  // Get current version
  const currentVersion = await getCurrentVersion(packageJsonPath);

  // Bump version
  const newVersion = bumpVersion(currentVersion, bumpType);

  // Update package.json
  await updatePackageVersion(packageJsonPath, newVersion);

  return newVersion;
}

/**
 * Generate a git tag name for a theme version
 * @example generateGitTag('rad-os', '1.2.3') -> 'theme-rad-os-v1.2.3'
 */
export function generateGitTag(themeId: string, version: string): string {
  return `theme-${themeId}-v${version}`;
}

/**
 * Create a git tag for a theme version
 * Note: This assumes git is available and the working directory is a git repository
 */
export async function createGitTag(
  themeId: string,
  version: string,
  message?: string
): Promise<void> {
  const tag = generateGitTag(themeId, version);
  const tagMessage = message || `Release ${themeId} v${version}`;

  try {
    execSync(`git tag -a ${tag} -m "${tagMessage}"`, {
      cwd: process.cwd(),
      stdio: 'pipe',
    });
  } catch (error) {
    throw new Error(`Failed to create git tag: ${error}`);
  }
}

/**
 * Check if a git tag already exists
 */
export async function gitTagExists(themeId: string, version: string): Promise<boolean> {
  const tag = generateGitTag(themeId, version);

  try {
    execSync(`git rev-parse ${tag}`, {
      cwd: process.cwd(),
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the version bump type based on conventional commit messages
 * Analyzes commit messages since the last tag to determine the appropriate version bump
 */
export function getVersionBumpFromCommits(commits: string[]): VersionBumpType {
  // Check for breaking changes (BREAKING CHANGE: or ! after type)
  const hasBreakingChange = commits.some(
    (commit) => commit.includes('BREAKING CHANGE:') || /^[a-z]+!:/.test(commit)
  );

  if (hasBreakingChange) {
    return 'major';
  }

  // Check for new features (feat:)
  const hasFeature = commits.some((commit) => commit.startsWith('feat:'));

  if (hasFeature) {
    return 'minor';
  }

  // Default to patch (fixes, docs, chores, etc.)
  return 'patch';
}
