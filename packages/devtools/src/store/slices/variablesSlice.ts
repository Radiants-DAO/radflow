import { StateCreator } from 'zustand';
import type { BaseColor, ColorMode, SemanticToken, ShadowToken } from '../../types';

export interface VariablesSlice {
  baseColors: BaseColor[];
  colorModes: ColorMode[];
  activeColorMode: string | null;
  borderRadius: Record<string, string>;
  semanticTokens: SemanticToken[];
  shadows: ShadowToken[];
  
  setActiveColorMode: (id: string | null) => void;
  loadFromCSS: () => Promise<void>;
}

// Default base colors matching radOS globals.css
const defaultBaseColors: BaseColor[] = [
  { id: 'cream', name: 'cream', displayName: 'Cream', value: '#FEF8E2', category: 'brand' },
  { id: 'black', name: 'black', displayName: 'Black', value: '#0F0E0C', category: 'brand' },
  { id: 'sun-yellow', name: 'sun-yellow', displayName: 'Sun Yellow', value: '#FCE184', category: 'brand' },
  { id: 'sky-blue', name: 'sky-blue', displayName: 'Sky Blue', value: '#95BAD2', category: 'brand' },
  { id: 'warm-cloud', name: 'warm-cloud', displayName: 'Warm Cloud', value: '#FEF8E2', category: 'brand' },
  { id: 'sunset-fuzz', name: 'sunset-fuzz', displayName: 'Sunset Fuzz', value: '#FCC383', category: 'brand' },
  { id: 'sun-red', name: 'sun-red', displayName: 'Sun Red', value: '#FF6B63', category: 'brand' },
  { id: 'green', name: 'green', displayName: 'Green', value: '#CEF5CA', category: 'brand' },
  { id: 'white', name: 'white', displayName: 'White', value: '#FFFFFF', category: 'brand' },
  { id: 'success-green', name: 'success-green', displayName: 'Success Green', value: '#22C55E', category: 'system' },
  { id: 'warning-yellow', name: 'warning-yellow', displayName: 'Warning Yellow', value: '#FCE184', category: 'system' },
  { id: 'error-red', name: 'error-red', displayName: 'Error Red', value: '#FF6B63', category: 'system' },
  { id: 'focus-state', name: 'focus-state', displayName: 'Focus State', value: '#95BAD2', category: 'system' },
];

export const createVariablesSlice: StateCreator<VariablesSlice, [], [], VariablesSlice> = (set) => ({
  baseColors: defaultBaseColors,
  colorModes: [],
  activeColorMode: null,
  borderRadius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  semanticTokens: [],
  shadows: [],

  setActiveColorMode: (id) => set({ activeColorMode: id }),

  loadFromCSS: async () => {
    try {
      const res = await fetch('/api/devtools/read-css');
      if (!res.ok) throw new Error('Failed to fetch CSS');
      const css = await res.text();
      
      const { parseGlobalsCSS, parsedCSSToStoreState } = await import('../../lib/cssParser');
      const parsed = parseGlobalsCSS(css);
      const state = parsedCSSToStoreState(parsed);
      
      set({
        baseColors: state.baseColors,
        colorModes: state.colorModes,
        borderRadius: state.borderRadius,
        semanticTokens: state.semanticTokens,
        shadows: state.shadows,
      });
    } catch {
      // Failed to load CSS - keep defaults
    }
  },
});
