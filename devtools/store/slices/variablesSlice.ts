import { StateCreator } from 'zustand';
import type { BrandColor, SemanticToken, ColorMode } from '../../types';

export interface VariablesSlice {
  // State
  brandColors: BrandColor[];
  semanticTokens: SemanticToken[];
  colorModes: ColorMode[];
  activeColorMode: string | null;
  borderRadius: Record<string, string>;
  
  // Actions
  addBrandColor: (color: Omit<BrandColor, 'id'>) => void;
  updateBrandColor: (id: string, updates: Partial<BrandColor>) => void;
  deleteBrandColor: (id: string) => void;
  
  addSemanticToken: (token: Omit<SemanticToken, 'id'>) => void;
  updateSemanticToken: (id: string, updates: Partial<SemanticToken>) => void;
  deleteSemanticToken: (id: string) => void;
  
  addColorMode: (mode: Omit<ColorMode, 'id'>) => void;
  updateColorMode: (id: string, updates: Partial<ColorMode>) => void;
  deleteColorMode: (id: string) => void;
  setActiveColorMode: (id: string | null) => void;
  
  updateBorderRadius: (key: string, value: string) => void;
  
  // Sync
  syncToCSS: () => Promise<void>;
  loadFromCSS: () => Promise<void>;
}

export const createVariablesSlice: StateCreator<VariablesSlice, [], [], VariablesSlice> = (set, get) => ({
  brandColors: [],
  semanticTokens: [],
  colorModes: [],
  activeColorMode: null,
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  addBrandColor: (color) => set((state) => ({
    brandColors: [...state.brandColors, { ...color, id: crypto.randomUUID() }]
  })),
  
  updateBrandColor: (id, updates) => set((state) => ({
    brandColors: state.brandColors.map((c) => 
      c.id === id ? { ...c, ...updates } : c
    )
  })),
  
  deleteBrandColor: (id) => set((state) => ({
    brandColors: state.brandColors.filter((c) => c.id !== id)
  })),

  addSemanticToken: (token) => set((state) => ({
    semanticTokens: [...state.semanticTokens, { ...token, id: crypto.randomUUID() }]
  })),
  
  updateSemanticToken: (id, updates) => set((state) => ({
    semanticTokens: state.semanticTokens.map((t) => 
      t.id === id ? { ...t, ...updates } : t
    )
  })),
  
  deleteSemanticToken: (id) => set((state) => ({
    semanticTokens: state.semanticTokens.filter((t) => t.id !== id)
  })),

  addColorMode: (mode) => set((state) => ({
    colorModes: [...state.colorModes, { ...mode, id: crypto.randomUUID() }]
  })),
  
  updateColorMode: (id, updates) => set((state) => ({
    colorModes: state.colorModes.map((m) => 
      m.id === id ? { ...m, ...updates } : m
    )
  })),
  
  deleteColorMode: (id) => set((state) => ({
    colorModes: state.colorModes.filter((m) => m.id !== id)
  })),
  
  setActiveColorMode: (id) => set({ activeColorMode: id }),

  updateBorderRadius: (key, value) => set((state) => ({
    borderRadius: { ...state.borderRadius, [key]: value }
  })),

  syncToCSS: async () => {
    const state = get();
    await fetch('/api/devtools/write-css', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandColors: state.brandColors,
        semanticTokens: state.semanticTokens,
        colorModes: state.colorModes,
        borderRadius: state.borderRadius,
      }),
    });
  },

  loadFromCSS: async () => {
    try {
      // Fetch globals.css via API route (client-side)
      const res = await fetch('/api/devtools/read-css');
      const css = await res.text();
      
      // Import parser dynamically to avoid SSR issues
      const { parseGlobalsCSS, parsedCSSToStoreState } = await import('../../lib/cssParser');
      
      const parsed = parseGlobalsCSS(css);
      const state = parsedCSSToStoreState(parsed);
      
      set({
        brandColors: state.brandColors,
        semanticTokens: state.semanticTokens,
        colorModes: state.colorModes,
        borderRadius: state.borderRadius,
      });
    } catch (error) {
      console.error('Failed to load CSS:', error);
    }
  },
});

