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
 * Default component tabs configuration
 *
 * To add a new tab:
 * 1. Add an entry here with a unique id and label
 * 2. Create a corresponding component in the ComponentsTab folder
 * 3. Update the ComponentsTab index.tsx to render the new component
 */
export const COMPONENT_TABS: ComponentTabConfig[] = [
  {
    id: 'folder-Rad_os',
    label: 'RadOS',
    description: 'RadOS window components (AppWindow, WindowTitleBar, etc.)',
  },
  {
    id: 'ui',
    label: 'UI',
    description: 'Components from @radflow/ui package',
  },
  {
    id: 'design-system',
    label: 'Design System',
    description: 'Core UI components (manual reference)',
  },
  // Dynamic folder tabs are added via localStorage and the Add button
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
