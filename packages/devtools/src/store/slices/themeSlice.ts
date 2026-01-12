import { StateCreator } from 'zustand';

export interface Theme {
  id: string;
  name: string;
  packageName: string;
  version?: string;
  description?: string;
  cssFiles?: string[];
  componentFolders?: string[];
  isActive?: boolean;
}

export interface ThemeSlice {
  // Theme state
  activeTheme: string; // Currently active theme ID (e.g., 'rad-os')
  availableThemes: Theme[]; // All discovered themes
  writeLockedThemes: string[]; // Non-active themes are read-only

  // Actions
  switchTheme: (themeId: string) => void;
  addTheme: (theme: Theme) => void;
  deleteTheme: (themeId: string) => void;
  setAvailableThemes: (themes: Theme[]) => void;
  isThemeWriteLocked: (themeId: string) => boolean;
}

export const createThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = (set, get) => ({
  activeTheme: 'rad-os', // Default to rad-os theme
  availableThemes: [
    {
      id: 'rad-os',
      name: 'RadOS',
      packageName: '@radflow/theme-rad-os',
      version: '1.0.0',
      description: 'Default RadFlow theme with yellow/cream/black palette',
      isActive: true,
    },
  ],
  writeLockedThemes: [], // Non-active themes are write-locked

  switchTheme: (themeId) => {
    const { availableThemes } = get();
    const theme = availableThemes.find((t) => t.id === themeId);

    if (!theme) {
      console.error(`Theme "${themeId}" not found`);
      return;
    }

    set((state) => {
      // Update active theme
      const newActiveTheme = themeId;

      // Calculate new write-locked themes (all non-active themes)
      const newWriteLockedThemes = state.availableThemes
        .filter((t) => t.id !== themeId)
        .map((t) => t.id);

      // Update theme active status
      const updatedThemes = state.availableThemes.map((t) => ({
        ...t,
        isActive: t.id === themeId,
      }));

      return {
        activeTheme: newActiveTheme,
        writeLockedThemes: newWriteLockedThemes,
        availableThemes: updatedThemes,
      };
    });
  },

  addTheme: (theme) => {
    set((state) => {
      // Check if theme already exists
      const exists = state.availableThemes.some((t) => t.id === theme.id);
      if (exists) {
        console.warn(`Theme "${theme.id}" already exists`);
        return state;
      }

      return {
        availableThemes: [...state.availableThemes, { ...theme, isActive: false }],
      };
    });
  },

  deleteTheme: (themeId) => {
    set((state) => {
      // Prevent deleting the active theme
      if (state.activeTheme === themeId) {
        console.error('Cannot delete the active theme. Switch to another theme first.');
        return state;
      }

      // Prevent deleting rad-os (default theme)
      if (themeId === 'rad-os') {
        console.error('Cannot delete the default RadOS theme');
        return state;
      }

      return {
        availableThemes: state.availableThemes.filter((t) => t.id !== themeId),
        writeLockedThemes: state.writeLockedThemes.filter((id) => id !== themeId),
      };
    });
  },

  setAvailableThemes: (themes) => {
    set({ availableThemes: themes });
  },

  isThemeWriteLocked: (themeId) => {
    const { writeLockedThemes } = get();
    return writeLockedThemes.includes(themeId);
  },
});
