import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { detectPackageManager } from './utils/detect-package-manager.js';
import { installDependencies } from './utils/install-dependencies.js';
import { copyTemplates } from './utils/copy-templates.js';
import { updateLayout } from './utils/update-layout.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message: string) {
  console.log(message);
}

function success(message: string) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function warn(message: string) {
  console.log(`${colors.yellow}!${colors.reset} ${message}`);
}

function error(message: string) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function box(lines: string[]) {
  const maxLength = Math.max(...lines.map((l) => l.length));
  const top = `╭${'─'.repeat(maxLength + 4)}╮`;
  const bottom = `╰${'─'.repeat(maxLength + 4)}╯`;
  const middle = lines.map((l) => `│  ${l.padEnd(maxLength)}  │`).join('\n');
  return `${top}\n${middle}\n${bottom}`;
}

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function confirm(question: string): Promise<boolean> {
  const answer = await prompt(`${question} (Y/n) `);
  return answer.toLowerCase() !== 'n';
}

function checkPrerequisites(cwd: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for package.json
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    errors.push('No package.json found. Run this command in a Next.js project root.');
    return { valid: false, errors };
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // Check for Next.js
  const hasNext =
    packageJson.dependencies?.next || packageJson.devDependencies?.next;
  if (!hasNext) {
    errors.push('Next.js not found in dependencies. This tool requires Next.js.');
  }

  // Check for Tailwind v4 (can be tailwindcss or @tailwindcss/postcss)
  const tailwindVersion =
    packageJson.dependencies?.tailwindcss ||
    packageJson.devDependencies?.tailwindcss ||
    packageJson.dependencies?.['@tailwindcss/postcss'] ||
    packageJson.devDependencies?.['@tailwindcss/postcss'];
  if (!tailwindVersion) {
    errors.push('Tailwind CSS not found in dependencies.');
  } else if (!tailwindVersion.includes('4') && !tailwindVersion.includes('^4')) {
    warn(`Tailwind CSS version ${tailwindVersion} detected. RadTools is optimized for Tailwind v4.`);
  }

  // Check for app directory (App Router)
  const appDir = path.join(cwd, 'app');
  if (!fs.existsSync(appDir)) {
    errors.push('No /app directory found. RadTools requires Next.js App Router.');
  }

  return { valid: errors.length === 0, errors };
}

function checkExistingInstallation(cwd: string): string[] {
  const conflicts: string[] = [];

  if (fs.existsSync(path.join(cwd, 'devtools'))) {
    conflicts.push('devtools/ directory already exists');
  }

  if (fs.existsSync(path.join(cwd, 'app', 'api', 'devtools'))) {
    conflicts.push('app/api/devtools/ directory already exists');
  }

  return conflicts;
}

export async function init() {
  const cwd = process.cwd();

  // Header
  log('');
  log(
    box([
      '',
      `${colors.bold}RadTools${colors.reset} - Visual Dev Tools`,
      'for Next.js + Tailwind v4',
      '',
    ])
  );
  log('');

  // Check prerequisites
  log(`${colors.dim}Checking prerequisites...${colors.reset}`);
  const { valid, errors: prereqErrors } = checkPrerequisites(cwd);

  if (!valid) {
    for (const err of prereqErrors) {
      error(err);
    }
    process.exit(1);
  }

  success('Next.js project detected');
  success('Tailwind CSS detected');
  success('App Router detected');
  log('');

  // Check for existing installation
  const conflicts = checkExistingInstallation(cwd);
  if (conflicts.length > 0) {
    warn('Existing installation detected:');
    for (const conflict of conflicts) {
      log(`  - ${conflict}`);
    }
    log('');
    const proceed = await confirm('Do you want to overwrite existing files?');
    if (!proceed) {
      log('Installation cancelled.');
      process.exit(0);
    }
    log('');
  }

  // Detect package manager
  const packageManager = detectPackageManager(cwd);
  success(`Using ${packageManager}`);
  log('');

  // Installation
  log(`${colors.bold}Installing RadTools...${colors.reset}`);
  log('');

  // Get templates directory (relative to compiled CLI)
  const templatesDir = path.resolve(__dirname, '..', '..', 'templates');

  // Copy templates
  try {
    await copyTemplates(templatesDir, cwd);
    success('Created devtools/');
    success('Created components/ui/');
    success('Created app/api/devtools/');
    success('Created public/assets/icons/');
    success('Replaced app/globals.css with RadTools theme');
  } catch (err) {
    error(`Failed to copy templates: ${(err as Error).message}`);
    process.exit(1);
  }

  // Update layout.tsx
  try {
    const updated = await updateLayout(cwd);
    if (updated) {
      success('Updated app/layout.tsx with DevToolsProvider');
    } else {
      warn('Could not auto-update layout.tsx. Please add DevToolsProvider manually.');
    }
  } catch (err) {
    warn(`Could not update layout.tsx: ${(err as Error).message}`);
    warn('Please add DevToolsProvider manually.');
  }

  // Install dependencies
  log('');
  log(`${colors.dim}Installing dependencies...${colors.reset}`);
  try {
    await installDependencies(packageManager, cwd);
    success('Installed zustand, sharp');
  } catch (err) {
    warn(`Could not auto-install dependencies: ${(err as Error).message}`);
    log('');
    log('Please install manually:');
    log(`  ${packageManager} ${packageManager === 'npm' ? 'install' : 'add'} zustand sharp`);
  }

  // Success message
  log('');
  log(
    box([
      '',
      `${colors.green}RadTools installed successfully!${colors.reset}`,
      '',
      `Press ${colors.cyan}Shift+Cmd+K${colors.reset} to open devtools`,
      `(${colors.dim}Shift+Ctrl+K on Windows/Linux${colors.reset})`,
      '',
    ])
  );
  log('');

  // Next steps
  log(`${colors.bold}Next steps:${colors.reset}`);
  log('');
  log(`  1. Start your dev server: ${colors.cyan}${packageManager} run dev${colors.reset}`);
  log(`  2. Press ${colors.cyan}Shift+Cmd+K${colors.reset} to open RadTools`);
  log('');
}
