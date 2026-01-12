import { StateCreator } from 'zustand';
import type { SearchResult } from '../../types';

export interface SearchSlice {
  searchQuery: string;
  searchResults: SearchResult[];
  selectedResultIndex: number;
  isSearchOpen: boolean;
  pendingSubTab: string | null; // Sub-tab to navigate to after search closes

  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setSelectedResultIndex: (index: number) => void;
  setSearchOpen: (open: boolean) => void;
  setPendingSubTab: (subTab: string | null) => void;
  navigateToResult: (result: SearchResult) => void;
}

export const createSearchSlice: StateCreator<SearchSlice, [], [], SearchSlice> = (set) => ({
  searchQuery: '',
  searchResults: [],
  selectedResultIndex: 0,
  isSearchOpen: false,
  pendingSubTab: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results, selectedResultIndex: 0 }),
  setSelectedResultIndex: (index) => set({ selectedResultIndex: index }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setPendingSubTab: (subTab) => set({ pendingSubTab: subTab }),
  navigateToResult: () => {
    set({ isSearchOpen: false });
    // Navigation is handled by GlobalSearch component
    // This function is called after tab change
  },
});
