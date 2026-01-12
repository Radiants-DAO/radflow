import { StateCreator } from 'zustand';

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  tags?: string[];
  isThemeSpecific?: boolean; // True if custom per-theme, false if RadFlow core prompt
}

export interface SrefCode {
  id: string;
  code: string; // e.g., "1234567890"
  description?: string;
  previewImages: string[]; // URLs to 4 preview images (2x2 grid)
}

export interface AISlice {
  // Prompt state
  radflowPrompts: PromptTemplate[]; // Core RadFlow prompts (shared across all themes)
  themePrompts: PromptTemplate[]; // Custom prompts specific to the active theme
  recentlyUsedPrompts: string[]; // Last 5 prompt IDs (for quick access)

  // SREF code state
  srefCodes: SrefCode[]; // Midjourney style reference codes

  // Actions
  addCustomPrompt: (prompt: PromptTemplate) => void;
  removeCustomPrompt: (id: string) => void;
  updateCustomPrompt: (id: string, updates: Partial<PromptTemplate>) => void;
  markPromptAsUsed: (promptId: string) => void;
  loadRadflowPrompts: (prompts: PromptTemplate[]) => void;
  loadThemePrompts: (prompts: PromptTemplate[]) => void;
  loadSrefCodes: (codes: SrefCode[]) => void;
}

export const createAISlice: StateCreator<AISlice, [], [], AISlice> = (set) => ({
  radflowPrompts: [],
  themePrompts: [],
  recentlyUsedPrompts: [],
  srefCodes: [],

  addCustomPrompt: (prompt) => {
    set((state) => {
      // Check if prompt already exists
      const exists = state.themePrompts.some((p) => p.id === prompt.id);
      if (exists) {
        console.warn(`Prompt "${prompt.id}" already exists`);
        return state;
      }

      return {
        themePrompts: [...state.themePrompts, { ...prompt, isThemeSpecific: true }],
      };
    });
  },

  removeCustomPrompt: (id) => {
    set((state) => ({
      themePrompts: state.themePrompts.filter((p) => p.id !== id),
    }));
  },

  updateCustomPrompt: (id, updates) => {
    set((state) => ({
      themePrompts: state.themePrompts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  markPromptAsUsed: (promptId) => {
    set((state) => {
      // Remove if already in list, then add to front
      const filtered = state.recentlyUsedPrompts.filter((id) => id !== promptId);
      const updated = [promptId, ...filtered].slice(0, 5); // Keep only last 5

      return {
        recentlyUsedPrompts: updated,
      };
    });
  },

  loadRadflowPrompts: (prompts) => {
    set({ radflowPrompts: prompts });
  },

  loadThemePrompts: (prompts) => {
    set({ themePrompts: prompts });
  },

  loadSrefCodes: (codes) => {
    set({ srefCodes: codes });
  },
});
