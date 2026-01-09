#!/usr/bin/env node

/**
 * RadFlow DevTools Postinstall Script
 *
 * Copies .claude/ directory to the consuming project's root.
 * Contains AI agent configurations.
 */

import { existsSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
};

function log(message) {
  console.log(`${colors.dim}[radflow]${colors.reset} ${message}`);
}

function success(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function warn(message) {
  console.log(`${colors.yellow}!${colors.reset} ${message}`);
}

/**
 * Find the project root by looking for package.json
 * Walks up from node_modules/@radflow/devtools to find the consuming project
 */
function findProjectRoot() {
  // Start from where this package is installed
  // Typically: /project/node_modules/@radflow/devtools/scripts/postinstall.js
  let current = __dirname;

  // Walk up looking for a package.json that's NOT in node_modules
  for (let i = 0; i < 10; i++) {
    current = dirname(current);

    // Check if we're at a project root (has package.json and not inside node_modules)
    const packageJsonPath = join(current, 'package.json');
    const nodeModulesInPath = current.includes('node_modules');

    if (existsSync(packageJsonPath) && !nodeModulesInPath) {
      return current;
    }
  }

  return null;
}

/**
 * Recursively copy directory, merging with existing content
 * Won't overwrite files that already exist
 */
function copyDirMerge(src, dest) {
  if (!existsSync(src)) return;

  mkdirSync(dest, { recursive: true });

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirMerge(srcPath, destPath);
    } else if (!existsSync(destPath)) {
      // Only copy if destination doesn't exist (don't overwrite user customizations)
      cpSync(srcPath, destPath);
    }
  }
}

function main() {
  // Skip if running in CI or during package development
  if (process.env.CI || process.env.RADFLOW_SKIP_POSTINSTALL) {
    return;
  }

  const projectRoot = findProjectRoot();

  if (!projectRoot) {
    // Probably running during package development, skip silently
    return;
  }

  const packageDir = join(__dirname, '..');

  // Copy agents (.claude directory)
  const agentsSrc = join(packageDir, 'agents');
  const agentsDest = join(projectRoot, '.claude');

  if (existsSync(agentsSrc)) {
    copyDirMerge(agentsSrc, agentsDest);
    success('Installed RadFlow agents to .claude/');
  }

  log('RadFlow DevTools ready!');
}

main();
