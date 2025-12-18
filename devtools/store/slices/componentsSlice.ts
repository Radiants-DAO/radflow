import { StateCreator } from 'zustand';
import type { DiscoveredComponent } from '../../types';

export interface ComponentsSlice {
  // State
  components: DiscoveredComponent[];
  isLoading: boolean;
  lastScanned: string | null;
  
  // Actions
  setComponents: (components: DiscoveredComponent[]) => void;
  setIsLoading: (loading: boolean) => void;
  scanComponents: () => Promise<void>;
  refreshComponents: () => Promise<void>;
}

export const createComponentsSlice: StateCreator<ComponentsSlice, [], [], ComponentsSlice> = (set) => ({
  components: [],
  isLoading: false,
  lastScanned: null,

  setComponents: (components) => set({ 
    components, 
    lastScanned: new Date().toISOString() 
  }),
  
  setIsLoading: (isLoading) => set({ isLoading }),

  scanComponents: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/devtools/components');
      const data = await res.json();
      set({ 
        components: data.components || [], 
        lastScanned: new Date().toISOString(),
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to scan components:', error);
      set({ isLoading: false });
    }
  },

  refreshComponents: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/devtools/components');
      const data = await res.json();
      set({ 
        components: data.components || [], 
        lastScanned: new Date().toISOString(),
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to refresh components:', error);
      set({ isLoading: false });
    }
  },
});

