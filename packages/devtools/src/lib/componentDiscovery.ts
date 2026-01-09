import type { DiscoveredComponent, ComponentSource } from '../types';

/**
 * Default npm packages to scan for components
 */
const DEFAULT_NPM_PACKAGES = ['@radflow/ui'];

/**
 * Default local folders to scan for components
 */
const DEFAULT_LOCAL_FOLDERS = ['components/ui', 'components'];

/**
 * Configuration for component discovery
 */
export interface DiscoveryConfig {
  /** npm packages to scan (e.g., '@radflow/ui', '@radflow/components-solarium') */
  npmPackages?: string[];
  /** Local folders to scan (e.g., 'components/ui', 'components/solarium') */
  localFolders?: string[];
  /** API endpoint for server-side scanning */
  apiEndpoint?: string;
}

/**
 * Default discovery configuration
 */
export const defaultDiscoveryConfig: DiscoveryConfig = {
  npmPackages: DEFAULT_NPM_PACKAGES,
  localFolders: DEFAULT_LOCAL_FOLDERS,
  apiEndpoint: '/api/devtools/components',
};

/**
 * Discover components from configured sources
 * This calls the server API to scan for components
 */
export async function discoverComponents(config: DiscoveryConfig = defaultDiscoveryConfig): Promise<DiscoveredComponent[]> {
  const { apiEndpoint = '/api/devtools/components' } = config;

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        npmPackages: config.npmPackages ?? DEFAULT_NPM_PACKAGES,
        localFolders: config.localFolders ?? DEFAULT_LOCAL_FOLDERS,
      }),
    });

    if (!response.ok) {
      console.warn('[RadFlow] Component discovery failed:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.components ?? [];
  } catch (error) {
    console.warn('[RadFlow] Component discovery error:', error);
    return [];
  }
}

/**
 * Get component sources from configuration
 */
export function getComponentSources(config: DiscoveryConfig = defaultDiscoveryConfig): ComponentSource[] {
  const sources: ComponentSource[] = [];

  // Add npm package sources
  for (const packageName of config.npmPackages ?? DEFAULT_NPM_PACKAGES) {
    sources.push({
      type: 'npm',
      path: `node_modules/${packageName}`,
      packageName,
    });
  }

  // Add local folder sources
  for (const folder of config.localFolders ?? DEFAULT_LOCAL_FOLDERS) {
    sources.push({
      type: 'local',
      path: folder,
    });
  }

  return sources;
}

/**
 * Filter components by source type
 */
export function filterBySource(components: DiscoveredComponent[], source: 'npm' | 'local'): DiscoveredComponent[] {
  return components.filter((c) => c.source === source);
}

/**
 * Filter components by package name
 */
export function filterByPackage(components: DiscoveredComponent[], packageName: string): DiscoveredComponent[] {
  return components.filter((c) => c.packageName === packageName);
}

/**
 * Group components by their source package or folder
 */
export function groupBySource(components: DiscoveredComponent[]): Record<string, DiscoveredComponent[]> {
  return components.reduce(
    (acc, component) => {
      const key = component.packageName ?? component.path.split('/')[0];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(component);
      return acc;
    },
    {} as Record<string, DiscoveredComponent[]>
  );
}

/**
 * Search components by name
 */
export function searchComponents(components: DiscoveredComponent[], query: string): DiscoveredComponent[] {
  const lowerQuery = query.toLowerCase();
  return components.filter((c) => c.name.toLowerCase().includes(lowerQuery));
}
