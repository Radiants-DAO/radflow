import { StateCreator } from 'zustand';
import type { ChangelogEntry } from '../../types';

export interface ChangelogSlice {
  // State
  changelogEntries: ChangelogEntry[];
  
  // Actions
  addChangelogEntry: (entry: Omit<ChangelogEntry, 'id' | 'timestamp'>) => void;
  updateChangelogEntry: (id: string, updates: Partial<ChangelogEntry>) => void;
  deleteChangelogEntry: (id: string) => void;
  clearChangelog: () => void;
}

export const createChangelogSlice: StateCreator<ChangelogSlice, [], [], ChangelogSlice> = (set) => ({
  changelogEntries: [],

  addChangelogEntry: (entry) => set((state) => ({
    changelogEntries: [
      {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
      ...state.changelogEntries,  // Newest first
    ]
  })),

  updateChangelogEntry: (id, updates) => set((state) => ({
    changelogEntries: state.changelogEntries.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    )
  })),

  deleteChangelogEntry: (id) => set((state) => ({
    changelogEntries: state.changelogEntries.filter((e) => e.id !== id)
  })),

  clearChangelog: () => set({ changelogEntries: [] }),
});

