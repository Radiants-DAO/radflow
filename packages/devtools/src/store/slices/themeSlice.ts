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
  switchTheme: (themeId: string) => Promise<void>;
  addTheme: (theme: Theme) => void;
  deleteTheme: (themeId: string) => void;
  setAvailableThemes: (themes: Theme[]) => void;
  fetchAvailableThemes: () => Promise<void>;
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

  switchTheme: async (themeId) => {
    const { availableThemes } = get();
    const theme = availableThemes.find((t) => t.id === themeId);

    if (!theme) {
      console.error(`Theme "${themeId}" not found`);
      return;
    }

    // Call API to switch CSS import
    try {
      const response = await fetch('/api/devtools/themes/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themePackageName: theme.packageName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to switch theme:', errorData.message || errorData.error);
        return;
      }

      // Update store state on successful API call
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

      // Trigger page reload to apply new CSS
      // In Next.js dev mode, HMR will handle this automatically
      // In production, this code won't run (API is dev-only)
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching theme:', error);
    }
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

  fetchAvailableThemes: async () => {
    try {
      // Fetch both available themes and current active theme in parallel
      const [themesResponse, currentResponse] = await Promise.all([
        fetch('/api/devtools/themes/list'),
        fetch('/api/devtools/themes/current'),
      ]);

      if (!themesResponse.ok) {
        console.error('Failed to fetch available themes:', themesResponse.statusText);
        return;
      }

      // Get current theme from globals.css (may fail if no import found)
      let detectedActiveTheme = get().activeTheme;
      if (currentResponse.ok) {
        const currentData = await currentResponse.json() as { themeId: string };
        detectedActiveTheme = currentData.themeId;
      }

      const data = await themesResponse.json() as { themes: Theme[] };
      const themes: Theme[] = data.themes.map((themeConfig) => ({
        id: themeConfig.id,
        name: themeConfig.name,
        packageName: themeConfig.packageName,
        version: themeConfig.version,
        description: themeConfig.description,
        cssFiles: themeConfig.cssFiles,
        componentFolders: themeConfig.componentFolders,
        isActive: themeConfig.id === detectedActiveTheme,
      }));

      // Calculate write-locked themes (all non-active themes)
      const writeLockedThemes = themes
        .filter((t) => t.id !== detectedActiveTheme)
        .map((t) => t.id);

      set({
        availableThemes: themes,
        activeTheme: detectedActiveTheme,
        writeLockedThemes,
      });
    } catch (error) {
      console.error('Error fetching available themes:', error);
    }
  },

  isThemeWriteLocked: (themeId) => {
    const { writeLockedThemes } = get();
    return writeLockedThemes.includes(themeId);
  },
});
