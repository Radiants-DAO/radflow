/**
 * README Generator
 *
 * Utilities for generating README.md files for theme packages.
 * Auto-generates documentation from theme metadata.
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Theme metadata for README generation
 */
export interface ThemeMetadata {
  name: string;
  packageName: string;
  version: string;
  description?: string;
  author?: string;
  license?: string;
  repository?: string;
  keywords?: string[];
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    surface?: string;
    text?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
    mono?: string;
  };
  components?: string[];
  icons?: number;
  hasLogos?: boolean;
  hasAgents?: boolean;
}

/**
 * Generate a complete README.md for a theme package
 */
export function generateReadme(metadata: ThemeMetadata): string {
  const sections: string[] = [];

  // Header
  sections.push(generateHeader(metadata));

  // Installation
  sections.push(generateInstallationSection(metadata));

  // Usage
  sections.push(generateUsageSection(metadata));

  // What's Included
  sections.push(generateIncludesSection(metadata));

  // Theme Configuration (colors, fonts)
  if (metadata.colors || metadata.fonts) {
    sections.push(generateConfigurationSection(metadata));
  }

  // Components (if any)
  if (metadata.components && metadata.components.length > 0) {
    sections.push(generateComponentsSection(metadata));
  }

  // Dark Mode
  sections.push(generateDarkModeSection());

  // Documentation Links
  sections.push(generateDocumentationSection(metadata));

  // License
  sections.push(generateLicenseSection(metadata));

  // Footer
  sections.push(generateFooter(metadata));

  return sections.join('\n\n');
}

/**
 * Generate header section
 */
function generateHeader(metadata: ThemeMetadata): string {
  const lines = [`# ${metadata.name}`];

  if (metadata.description) {
    lines.push('');
    lines.push(metadata.description);
  }

  if (metadata.keywords && metadata.keywords.length > 0) {
    lines.push('');
    const badges = metadata.keywords
      .map((keyword) => `![${keyword}](https://img.shields.io/badge/${keyword}-theme-yellow)`)
      .join(' ');
    lines.push(badges);
  }

  return lines.join('\n');
}

/**
 * Generate installation section
 */
function generateInstallationSection(metadata: ThemeMetadata): string {
  return `## Installation

Install via your package manager:

\`\`\`bash
# npm
npm install ${metadata.packageName}

# pnpm
pnpm add ${metadata.packageName}

# yarn
yarn add ${metadata.packageName}
\`\`\``;
}

/**
 * Generate usage section
 */
function generateUsageSection(metadata: ThemeMetadata): string {
  return `## Usage

### Quick Start

Import the complete theme in your global CSS file:

\`\`\`css
@import "tailwindcss";
@import "${metadata.packageName}";
\`\`\`

### Modular Imports

Or import specific parts for more control:

\`\`\`css
/* Core tokens and colors */
@import "${metadata.packageName}/tokens";

/* Dark mode overrides */
@import "${metadata.packageName}/dark";

/* Typography styles */
@import "${metadata.packageName}/typography";

/* Font definitions */
@import "${metadata.packageName}/fonts";

/* Base styles */
@import "${metadata.packageName}/base";

/* Scrollbar styles */
@import "${metadata.packageName}/scrollbar";

/* Animations */
@import "${metadata.packageName}/animations";
\`\`\``;
}

/**
 * Generate what's included section
 */
function generateIncludesSection(metadata: ThemeMetadata): string {
  const items: string[] = [];

  // Always included
  items.push('- ✅ **Design Tokens** - Semantic color system with light/dark mode');
  items.push('- ✅ **Typography System** - Complete typographic scale');
  items.push('- ✅ **Dark Mode** - Built-in dark mode support');
  items.push('- ✅ **Animations** - Smooth, performant animations');

  // Conditional items
  if (metadata.components && metadata.components.length > 0) {
    items.push(`- ✅ **UI Components** - ${metadata.components.length} custom components`);
  }

  if (metadata.icons) {
    items.push(`- ✅ **Icons** - ${metadata.icons} custom icons`);
  }

  if (metadata.hasLogos) {
    items.push('- ✅ **Brand Assets** - Logo variants and brand marks');
  }

  if (metadata.hasAgents) {
    items.push('- ✅ **AI Agents** - Custom prompts and design guidelines');
  }

  return `## What's Included\n\n${items.join('\n')}`;
}

/**
 * Generate configuration section
 */
function generateConfigurationSection(metadata: ThemeMetadata): string {
  const sections: string[] = ['## Theme Configuration'];

  if (metadata.colors) {
    sections.push('### Color Palette\n');
    const colorItems: string[] = [];

    if (metadata.colors.primary) {
      colorItems.push(`- **Primary**: \`${metadata.colors.primary}\``);
    }
    if (metadata.colors.secondary) {
      colorItems.push(`- **Secondary**: \`${metadata.colors.secondary}\``);
    }
    if (metadata.colors.accent) {
      colorItems.push(`- **Accent**: \`${metadata.colors.accent}\``);
    }
    if (metadata.colors.surface) {
      colorItems.push(`- **Surface**: \`${metadata.colors.surface}\``);
    }
    if (metadata.colors.text) {
      colorItems.push(`- **Text**: \`${metadata.colors.text}\``);
    }

    sections.push(colorItems.join('\n'));
  }

  if (metadata.fonts) {
    sections.push('\n### Typography\n');
    const fontItems: string[] = [];

    if (metadata.fonts.heading) {
      fontItems.push(`- **Headings**: ${metadata.fonts.heading}`);
    }
    if (metadata.fonts.body) {
      fontItems.push(`- **Body Text**: ${metadata.fonts.body}`);
    }
    if (metadata.fonts.mono) {
      fontItems.push(`- **Monospace**: ${metadata.fonts.mono}`);
    }

    sections.push(fontItems.join('\n'));
  }

  return sections.join('\n');
}

/**
 * Generate components section
 */
function generateComponentsSection(metadata: ThemeMetadata): string {
  if (!metadata.components || metadata.components.length === 0) {
    return '';
  }

  const componentList = metadata.components
    .map((component) => `- \`${component}\``)
    .join('\n');

  return `## Components

This theme includes ${metadata.components.length} custom components:

${componentList}

Import components from the theme package:

\`\`\`tsx
import { Button } from '${metadata.packageName}/components/Button';
import { Card } from '${metadata.packageName}/components/Card';
\`\`\``;
}

/**
 * Generate dark mode section
 */
function generateDarkModeSection(): string {
  return `## Dark Mode

This theme includes comprehensive dark mode support. Enable it by adding the \`dark\` class to your root HTML element:

\`\`\`html
<html class="dark">
  <!-- Your app content -->
</html>
\`\`\`

Or toggle dynamically with JavaScript:

\`\`\`javascript
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');

// Toggle dark mode
document.documentElement.classList.toggle('dark');
\`\`\`

### Dark Mode Features

- Automatic color inversion for semantic tokens
- Optimized contrast ratios for accessibility
- Softer shadows for dark backgrounds
- Smooth transitions between modes`;
}

/**
 * Generate documentation section
 */
function generateDocumentationSection(metadata: ThemeMetadata): string {
  const links: string[] = ['## Documentation'];

  links.push('For comprehensive guides and examples:');
  links.push('');
  links.push('- [RadFlow Documentation](https://github.com/Radiants-DAO/radflow)');
  links.push('- [Theme Customization Guide](https://github.com/Radiants-DAO/radflow/blob/main/docs/themes.md)');
  links.push('- [Component Reference](https://github.com/Radiants-DAO/radflow/blob/main/docs/components.md)');

  if (metadata.repository) {
    links.push(`- [Source Repository](${metadata.repository})`);
  }

  return links.join('\n');
}

/**
 * Generate license section
 */
function generateLicenseSection(metadata: ThemeMetadata): string {
  const license = metadata.license || 'MIT';

  let content = `## License\n\n${license}`;

  if (metadata.author) {
    content += `\n\nCreated by ${metadata.author}`;
  }

  return content;
}

/**
 * Generate footer
 */
function generateFooter(metadata: ThemeMetadata): string {
  return `---

**Version**: ${metadata.version}

Generated by [RadFlow DevTools](https://github.com/Radiants-DAO/radflow)`;
}

/**
 * Extract theme metadata from a theme package
 */
export async function extractThemeMetadata(themePath: string): Promise<ThemeMetadata> {
  const packageJsonPath = path.join(themePath, 'package.json');
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);

  // Extract theme ID from package name
  const themeId = packageJson.name.replace(/^@radflow\/theme-/, '');
  const name = formatThemeName(themeId);

  // Check for components
  const componentsPath = path.join(themePath, 'components');
  let components: string[] = [];
  try {
    const componentFiles = await fs.readdir(componentsPath);
    components = componentFiles
      .filter((file) => file.endsWith('.tsx'))
      .map((file) => file.replace('.tsx', ''));
  } catch {
    // No components directory
  }

  // Check for icons
  const iconsPath = path.join(themePath, 'assets', 'icons');
  let iconCount = 0;
  try {
    const iconFiles = await fs.readdir(iconsPath);
    iconCount = iconFiles.filter((file) => file.endsWith('.svg')).length;
  } catch {
    // No icons directory
  }

  // Check for logos
  const logosPath = path.join(themePath, 'assets', 'logos');
  let hasLogos = false;
  try {
    const logoFiles = await fs.readdir(logosPath);
    hasLogos = logoFiles.length > 0;
  } catch {
    // No logos directory
  }

  // Check for agents
  const agentsPath = path.join(themePath, 'agents');
  let hasAgents = false;
  try {
    const agentFiles = await fs.readdir(agentsPath);
    hasAgents = agentFiles.length > 0;
  } catch {
    // No agents directory
  }

  // Extract colors from tokens.css if available
  let colors: ThemeMetadata['colors'] = undefined;
  try {
    const tokensPath = path.join(themePath, 'tokens.css');
    const tokensContent = await fs.readFile(tokensPath, 'utf-8');
    colors = extractColorsFromCSS(tokensContent);
  } catch {
    // No tokens.css
  }

  // Extract fonts from tokens.css or typography.css
  let fonts: ThemeMetadata['fonts'] = undefined;
  try {
    const tokensPath = path.join(themePath, 'tokens.css');
    const tokensContent = await fs.readFile(tokensPath, 'utf-8');
    fonts = extractFontsFromCSS(tokensContent);
  } catch {
    // No fonts found
  }

  return {
    name,
    packageName: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    author: packageJson.author,
    license: packageJson.license,
    repository: extractRepositoryUrl(packageJson.repository),
    keywords: packageJson.keywords,
    colors,
    fonts,
    components,
    icons: iconCount > 0 ? iconCount : undefined,
    hasLogos,
    hasAgents,
  };
}

/**
 * Generate and write README for a theme
 */
export async function generateAndWriteReadme(themePath: string): Promise<void> {
  const metadata = await extractThemeMetadata(themePath);
  const readme = generateReadme(metadata);
  const readmePath = path.join(themePath, 'README.md');
  await fs.writeFile(readmePath, readme, 'utf-8');
}

// Helper functions

function formatThemeName(themeId: string): string {
  if (themeId === 'rad-os') return 'RadOS';

  return themeId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractRepositoryUrl(repository?: string | { url: string }): string | undefined {
  if (!repository) return undefined;
  if (typeof repository === 'string') return repository;
  return repository.url;
}

function extractColorsFromCSS(css: string): ThemeMetadata['colors'] {
  const colors: ThemeMetadata['colors'] = {};

  const primaryMatch = css.match(/--color-primary:\s*([^;]+);/);
  const secondaryMatch = css.match(/--color-secondary:\s*([^;]+);/);
  const accentMatch = css.match(/--color-accent:\s*([^;]+);/);
  const surfaceMatch = css.match(/--color-surface:\s*([^;]+);/);
  const textMatch = css.match(/--color-text:\s*([^;]+);/);

  if (primaryMatch) colors.primary = primaryMatch[1].trim();
  if (secondaryMatch) colors.secondary = secondaryMatch[1].trim();
  if (accentMatch) colors.accent = accentMatch[1].trim();
  if (surfaceMatch) colors.surface = surfaceMatch[1].trim();
  if (textMatch) colors.text = textMatch[1].trim();

  return Object.keys(colors).length > 0 ? colors : undefined;
}

function extractFontsFromCSS(css: string): ThemeMetadata['fonts'] {
  const fonts: ThemeMetadata['fonts'] = {};

  const headingMatch = css.match(/--font-heading:\s*['"]?([^'";]+)['"]?;/);
  const bodyMatch = css.match(/--font-body:\s*['"]?([^'";]+)['"]?;/);
  const monoMatch = css.match(/--font-mono:\s*['"]?([^'";]+)['"]?;/);

  if (headingMatch) fonts.heading = headingMatch[1].trim();
  if (bodyMatch) fonts.body = bodyMatch[1].trim();
  if (monoMatch) fonts.mono = monoMatch[1].trim();

  return Object.keys(fonts).length > 0 ? fonts : undefined;
}
