'use client';

import { UI_SEARCH_INDEX, type SearchableItem } from '../tabs/ComponentsTab/UITabSearchIndex';
import type { DiscoveredComponent } from '../types';

export type { SearchableItem };

/**
 * Extended searchable item that includes tab information for cross-tab navigation
 */
export interface ExtendedSearchableItem extends SearchableItem {
  tabId: string; // e.g., 'design-system', 'folder-UI', 'folder-Rad_os', 'assets'
  componentName?: string; // For discovered components
  iconName?: string; // For icons
}

/**
 * Fetch available icons from the API
 */
async function fetchIcons(): Promise<string[]> {
  try {
    const response = await fetch('/api/devtools/icons');
    if (!response.ok) return [];
    const data = await response.json();
    return data.icons || [];
  } catch {
    return [];
  }
}

/**
 * Build a dynamic search index from multiple sources:
 * 1. DesignSystemTab SEARCH_INDEX (static)
 * 2. Component registry (from API)
 * 3. Folder contents (from API)
 * 4. Icons (from API)
 */
export async function buildSearchIndex(
  registryComponents: DiscoveredComponent[] = [],
  folderContents: Record<string, DiscoveredComponent[]> = {}
): Promise<ExtendedSearchableItem[]> {
  const index: ExtendedSearchableItem[] = [];

  // 1. Add UI tab items
  UI_SEARCH_INDEX.forEach((item) => {
    index.push({
      ...item,
      tabId: 'ui',
    });
  });

  // 2. Add registry components (for UI tab or similar)
  registryComponents.forEach((comp) => {
    index.push({
      text: comp.name,
      sectionId: 'components',
      type: 'button', // Generic type for components
      tabId: 'folder-UI', // Default to UI folder, or could be determined by component path
      componentName: comp.name,
    });
  });

  // 4. Add folder components
  Object.entries(folderContents).forEach(([folderName, components]) => {
    components.forEach((comp) => {
      index.push({
        text: comp.name,
        sectionId: 'components',
        type: 'button',
        tabId: `folder-${folderName}`,
        componentName: comp.name,
      });
    });
  });

  // 5. Add icons
  const icons = await fetchIcons();
  icons.forEach((iconName) => {
    index.push({
      text: iconName,
      sectionId: 'icons',
      type: 'icon',
      tabId: 'assets',
      iconName: iconName,
    });
  });

  return index;
}

/**
 * Search the index for matching items
 */
export function searchIndex(
  index: ExtendedSearchableItem[],
  query: string
): ExtendedSearchableItem[] {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase().trim();

  return index.filter((item) => {
    // Match text
    if (item.text.toLowerCase().includes(queryLower)) return true;
    
    // Match component name if available
    if (item.componentName?.toLowerCase().includes(queryLower)) return true;
    
    // Match section ID
    if (item.sectionId.toLowerCase().includes(queryLower)) return true;
    
    // Match subsection title
    if (item.subsectionTitle?.toLowerCase().includes(queryLower)) return true;
    
    return false;
  }).slice(0, 20); // Limit results
}
