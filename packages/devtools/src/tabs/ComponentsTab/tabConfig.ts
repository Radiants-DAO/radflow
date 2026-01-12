/**
 * Tab Configuration for Components Tab
 *
 * This config allows adding new component tabs dynamically.
 * Each tab can have its own content component.
 */

export interface ComponentTabConfig {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Optional description */
  description?: string;
}

/**
 * Component tabs are dynamically discovered from theme folders.
 * Each theme has a components/ directory with subfolders (e.g., core/, forms/).
 * Tabs are auto-generated from these folders.
 *
 * To add a preview for a folder:
 * 1. Create preview/[folderName].tsx in the theme package
 * 2. Add the lazy import to themePreviewsByFolder in ComponentsTab/index.tsx
 */
export const COMPONENT_TABS: ComponentTabConfig[] = [
  // All tabs are dynamically discovered from component folders
];

/**
 * Get a tab config by ID
 */
export function getTabById(id: string): ComponentTabConfig | undefined {
  return COMPONENT_TABS.find((tab) => tab.id === id);
}

/**
 * Check if a tab ID is valid
 */
export function isValidTabId(id: string): boolean {
  return COMPONENT_TABS.some((tab) => tab.id === id);
}

export default COMPONENT_TABS;
