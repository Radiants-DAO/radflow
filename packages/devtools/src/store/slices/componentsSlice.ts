import { StateCreator } from 'zustand';
import type { DiscoveredComponent } from '../../types';

export interface ComponentsSlice {
  // State
  components: DiscoveredComponent[];
  componentsByFolder: Record<string, DiscoveredComponent[]>; // Grouped by folder
  availableFolders: string[]; // List of discovered folders
  isLoading: boolean;
  lastScanned: string | null;

  // Actions
  setComponents: (components: DiscoveredComponent[]) => void;
  setIsLoading: (loading: boolean) => void;
  scanComponents: () => Promise<void>;
  refreshComponents: () => Promise<void>;
  fetchFolders: () => Promise<void>; // Fetch available folders
}

export const createComponentsSlice: StateCreator<ComponentsSlice, [], [], ComponentsSlice> = (set) => {
  const scan = async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/devtools/components');
      const data = await res.json();
      const components = data.components || [];

      // Group components by folder
      const byFolder: Record<string, DiscoveredComponent[]> = {};
      for (const component of components) {
        // Extract folder from path (e.g., /components/core/Button.tsx -> 'core')
        const match = component.path.match(/\/components\/([^/]+)\//);
        const folder = match ? match[1] : 'root';

        if (!byFolder[folder]) {
          byFolder[folder] = [];
        }
        byFolder[folder].push(component);
      }

      set({
        components,
        componentsByFolder: byFolder,
        lastScanned: new Date().toISOString(),
        isLoading: false
      });
    } catch {
      set({ isLoading: false });
    }
  };

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/devtools/components/folders');
      const data = await res.json();
      set({ availableFolders: data.folders || [] });
    } catch (error) {
      console.warn('Failed to fetch folders:', error);
      set({ availableFolders: [] });
    }
  };

  return {
    components: [],
    componentsByFolder: {},
    availableFolders: [],
    isLoading: false,
    lastScanned: null,

    setComponents: (components) => {
      // Group components by folder
      const byFolder: Record<string, DiscoveredComponent[]> = {};
      for (const component of components) {
        const match = component.path.match(/\/components\/([^/]+)\//);
        const folder = match ? match[1] : 'root';

        if (!byFolder[folder]) {
          byFolder[folder] = [];
        }
        byFolder[folder].push(component);
      }

      set({
        components,
        componentsByFolder: byFolder,
        lastScanned: new Date().toISOString()
      });
    },

    setIsLoading: (isLoading) => set({ isLoading }),
    scanComponents: scan,
    refreshComponents: scan,
    fetchFolders,
  };
};
