import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';

const ROOT_COMPONENTS_DIR = join(process.cwd(), 'components');

interface DiscoveredComponent {
  name: string;
  path: string;
  props: PropDefinition[];
  theme?: string; // Theme package name (e.g., '@radflow/theme-phase')
  themeId?: string; // Theme ID (e.g., 'phase')
}

interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
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

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Dev tools API not available in production' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    let themeId = searchParams.get('theme');

    // Auto-detect theme if not specified
    if (!themeId) {
      themeId = await detectActiveTheme();
    }

    // Determine base directory based on theme
    let baseDir: string;
    let source: 'theme' | 'root' = 'root';

    if (themeId) {
      const themeComponentsDir = join(process.cwd(), 'packages', `theme-${themeId}`, 'components');
      try {
        await readdir(themeComponentsDir);
        baseDir = themeComponentsDir;
        source = 'theme';
      } catch {
        // Theme doesn't have components folder, fall back to root
        baseDir = ROOT_COMPONENTS_DIR;
      }
    } else {
      baseDir = ROOT_COMPONENTS_DIR;
    }

    // If folder is specified, scan only that folder
    const scanDir = folder ? join(baseDir, folder) : baseDir;

    const components = await scanComponents(scanDir, themeId);
    return NextResponse.json({
      components,
      source,
      themeId: themeId || null,
    });
  } catch (error) {
    // If components directory doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ components: [], source: 'none', themeId: null });
    }
    return NextResponse.json(
      { error: 'Failed to scan components', details: String(error) },
      { status: 500 }
    );
  }
}

async function scanComponents(dir: string, themeId: string | null): Promise<DiscoveredComponent[]> {
  const components: DiscoveredComponent[] = [];

  async function scan(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        // Skip test files and stories
        if (entry.name.includes('.test.') || entry.name.includes('.stories.')) {
          continue;
        }

        try {
          const content = await readFile(fullPath, 'utf-8');
          const component = parseComponent(content, '/' + relative(process.cwd(), fullPath), themeId);
          if (component) {
            components.push(component);
          }
        } catch {
          // Failed to parse component - skip
        }
      }
    }
  }

  await scan(dir);
  return components;
}

function parseComponent(
  content: string,
  filePath: string,
  activeThemeId: string | null
): DiscoveredComponent | null {
  // Check for default export
  const hasDefaultExport =
    /export\s+default\s+function\s+(\w+)/.test(content) ||
    /export\s+default\s+(\w+)/.test(content);

  if (!hasDefaultExport) return null;

  // Extract component name
  const nameMatch = content.match(/export\s+default\s+function\s+(\w+)/);
  const name = nameMatch?.[1] || 'Unknown';

  // Extract props interface
  const propsMatch = content.match(/interface\s+(\w+Props)\s*\{([^}]+)\}/);
  const props: PropDefinition[] = [];

  if (propsMatch) {
    const propsBody = propsMatch[2];
    const propLines = propsBody.split('\n').filter((l) => l.trim());

    for (const line of propLines) {
      const propMatch = line.match(/(\w+)(\?)?:\s*([^;]+)/);
      if (propMatch) {
        props.push({
          name: propMatch[1],
          type: propMatch[3].trim(),
          required: !propMatch[2],
        });
      }
    }
  }

  // Try inline type annotation if no interface found
  if (props.length === 0) {
    const inlineMatch = content.match(/\{\s*([^}]+)\s*\}\s*:\s*\{([^}]+)\}/);
    if (inlineMatch) {
      const propsBody = inlineMatch[2];
      const propLines = propsBody.split(/[,;]/).filter((l) => l.trim());

      for (const line of propLines) {
        const propMatch = line.trim().match(/(\w+)(\?)?:\s*(.+)/);
        if (propMatch) {
          props.push({
            name: propMatch[1],
            type: propMatch[3].trim(),
            required: !propMatch[2],
          });
        }
      }
    }
  }

  // Extract default values from destructuring
  const destructureMatch = content.match(/\{\s*([^}]+)\s*\}\s*:\s*(?:\w+Props|\{[^}]+\})/);
  if (destructureMatch) {
    const destructureBody = destructureMatch[1];
    for (const prop of props) {
      const defaultMatch = destructureBody.match(
        new RegExp(`${prop.name}\\s*=\\s*(['"\`]?[^,}]+['"\`]?)`)
      );
      if (defaultMatch) {
        prop.defaultValue = defaultMatch[1].trim();
      }
    }
  }

  // Use provided themeId or extract from file path
  let theme: string | undefined;
  let themeId: string | undefined;

  const themeMatch = filePath.match(/\/packages\/(theme-[^/]+)\//);
  if (themeMatch) {
    const themePackageId = themeMatch[1]; // e.g., 'theme-phase'
    themeId = themePackageId.replace('theme-', ''); // e.g., 'phase'
    theme = `@radflow/${themePackageId}`; // e.g., '@radflow/theme-phase'
  } else if (filePath.includes('/packages/ui/')) {
    // Components from @radflow/ui package
    theme = '@radflow/ui';
    themeId = 'ui';
  } else if (filePath.includes('/components/') && activeThemeId) {
    // Local components with active theme context
    theme = `@radflow/theme-${activeThemeId}`;
    themeId = activeThemeId;
  } else {
    // Local components without theme context
    theme = undefined;
    themeId = undefined;
  }

  return {
    name,
    path: filePath,
    props,
    theme,
    themeId,
  };
}

