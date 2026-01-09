import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  Tab,
  BaseColor,
  SemanticToken,
  ColorMode,
  ShadowDefinition,
  DiscoveredComponent,
  AssetFolder,
  FontDefinition,
  TypographyStyle,
} from '../types';

// ============================================================================
// CSS Change Type (Preview Mode)
// ============================================================================

export interface CSSChange {
  id: string;
  selector: string;
  property: string;
  value: string;
  originalValue?: string;
}

// ============================================================================
// Panel Slice
// ============================================================================

interface PanelSlice {
  isOpen: boolean;
  activeTab: Tab;
  panelWidth: number;
  activeMode: 'normal' | 'textEdit' | 'help';
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  setIsOpen: (open: boolean) => void;
  setActiveTab: (tab: Tab) => void;
  setPanelWidth: (width: number) => void;
  setActiveMode: (mode: 'normal' | 'textEdit' | 'help') => void;
}

// ============================================================================
// Preview Slice
// ============================================================================

interface PreviewSlice {
  isPreviewMode: boolean;
  previewChanges: CSSChange[];
  setPreviewMode: (mode: boolean) => void;
  addPreviewChange: (change: CSSChange) => void;
  removePreviewChange: (id: string) => void;
  clearPreviewChanges: () => void;
  updatePreviewChange: (id: string, updates: Partial<CSSChange>) => void;
}

// ============================================================================
// Variables Slice
// ============================================================================

interface VariablesSlice {
  baseColors: BaseColor[];
  semanticTokens: SemanticToken[];
  colorModes: ColorMode[];
  activeColorMode: string | null;
  borderRadius: Record<string, string>;
  shadows: ShadowDefinition[];
  setBaseColors: (colors: BaseColor[]) => void;
  setSemanticTokens: (tokens: SemanticToken[]) => void;
  setColorModes: (modes: ColorMode[]) => void;
  setActiveColorMode: (id: string | null) => void;
  setBorderRadius: (radius: Record<string, string>) => void;
  setShadows: (shadows: ShadowDefinition[]) => void;
}

// ============================================================================
// Components Slice
// ============================================================================

interface ComponentsSlice {
  components: DiscoveredComponent[];
  isLoadingComponents: boolean;
  lastScanned: string | null;
  setComponents: (components: DiscoveredComponent[]) => void;
  setIsLoadingComponents: (loading: boolean) => void;
  setLastScanned: (date: string | null) => void;
}

// ============================================================================
// Assets Slice
// ============================================================================

interface AssetsSlice {
  assetTree: AssetFolder | null;
  selectedPath: string | null;
  isLoadingAssets: boolean;
  setAssetTree: (tree: AssetFolder | null) => void;
  setSelectedPath: (path: string | null) => void;
  setIsLoadingAssets: (loading: boolean) => void;
}

// ============================================================================
// Typography Slice
// ============================================================================

interface TypographySlice {
  fonts: FontDefinition[];
  typographyStyles: TypographyStyle[];
  setFonts: (fonts: FontDefinition[]) => void;
  setTypographyStyles: (styles: TypographyStyle[]) => void;
}

// ============================================================================
// Combined State
// ============================================================================

export interface DevToolsState
  extends PanelSlice,
    PreviewSlice,
    VariablesSlice,
    ComponentsSlice,
    AssetsSlice,
    TypographySlice {}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_PANEL_WIDTH = 420;
const MIN_PANEL_WIDTH = 300;
const MAX_PANEL_WIDTH_RATIO = 0.8;

const defaultBaseColors: BaseColor[] = [
  { id: 'sun-yellow', name: 'sun-yellow', displayName: 'Sun Yellow', value: '#FCE184', category: 'brand' },
  { id: 'warm-cloud', name: 'warm-cloud', displayName: 'Warm Cloud', value: '#FEF8E2', category: 'brand' },
  { id: 'black', name: 'black', displayName: 'Black', value: '#0F0E0C', category: 'brand' },
  { id: 'white', name: 'white', displayName: 'White', value: '#FFFFFF', category: 'brand' },
  { id: 'sky-blue', name: 'sky-blue', displayName: 'Sky Blue', value: '#95BAD2', category: 'brand' },
  { id: 'sunset-fuzz', name: 'sunset-fuzz', displayName: 'Sunset Fuzz', value: '#FCC383', category: 'brand' },
  { id: 'sun-red', name: 'sun-red', displayName: 'Sun Red', value: '#FF6B63', category: 'brand' },
  { id: 'green', name: 'green', displayName: 'Green', value: '#CEF5CA', category: 'brand' },
];

const defaultSemanticTokens: SemanticToken[] = [
  { id: 'background', name: 'background', displayName: 'Background', referencedColorId: 'sun-yellow', resolvedValue: '#FCE184', category: 'page' },
  { id: 'foreground', name: 'foreground', displayName: 'Foreground', referencedColorId: 'black', resolvedValue: '#0F0E0C', category: 'page' },
  { id: 'primary', name: 'primary', displayName: 'Primary', referencedColorId: 'sun-yellow', resolvedValue: '#FCE184', category: 'action' },
  { id: 'secondary', name: 'secondary', displayName: 'Secondary', referencedColorId: 'black', resolvedValue: '#0F0E0C', category: 'action' },
  { id: 'accent', name: 'accent', displayName: 'Accent', referencedColorId: 'sky-blue', resolvedValue: '#95BAD2', category: 'action' },
];

const defaultShadows: ShadowDefinition[] = [
  { id: 'btn', name: 'btn', displayName: 'Button', value: '0 1px 0 0 var(--color-black)' },
  { id: 'btn-hover', name: 'btn-hover', displayName: 'Button Hover', value: '0 3px 0 0 var(--color-black)' },
  { id: 'card', name: 'card', displayName: 'Card', value: '2px 2px 0 0 var(--color-black)' },
  { id: 'card-lg', name: 'card-lg', displayName: 'Card Large', value: '4px 4px 0 0 var(--color-black)' },
];

const defaultBorderRadius: Record<string, string> = {
  none: '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  full: '9999px',
};

// ============================================================================
// Store
// ============================================================================

export const useDevToolsStore = create<DevToolsState>()(
  devtools(
    persist(
      (set) => ({
        // Panel state
        isOpen: false,
        activeTab: 'variables' as Tab,
        panelWidth: DEFAULT_PANEL_WIDTH,
        activeMode: 'normal',

        togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
        openPanel: () => set({ isOpen: true }),
        closePanel: () => set({ isOpen: false }),
        setIsOpen: (isOpen) => set({ isOpen }),
        setActiveTab: (activeTab) => set({ activeTab }),
        setPanelWidth: (width) => {
          const maxWidth = typeof window !== 'undefined' ? window.innerWidth * MAX_PANEL_WIDTH_RATIO : 800;
          set({ panelWidth: Math.max(MIN_PANEL_WIDTH, Math.min(width, maxWidth)) });
        },
        setActiveMode: (activeMode) => set({ activeMode }),

        // Preview state
        isPreviewMode: true, // Default to preview mode
        previewChanges: [],

        setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
        addPreviewChange: (change) =>
          set((state) => ({
            previewChanges: [...state.previewChanges.filter((c) => c.id !== change.id), change],
          })),
        removePreviewChange: (id) =>
          set((state) => ({
            previewChanges: state.previewChanges.filter((c) => c.id !== id),
          })),
        clearPreviewChanges: () => set({ previewChanges: [] }),
        updatePreviewChange: (id, updates) =>
          set((state) => ({
            previewChanges: state.previewChanges.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          })),

        // Variables state
        baseColors: defaultBaseColors,
        semanticTokens: defaultSemanticTokens,
        colorModes: [],
        activeColorMode: null,
        borderRadius: defaultBorderRadius,
        shadows: defaultShadows,

        setBaseColors: (baseColors) => set({ baseColors }),
        setSemanticTokens: (semanticTokens) => set({ semanticTokens }),
        setColorModes: (colorModes) => set({ colorModes }),
        setActiveColorMode: (activeColorMode) => set({ activeColorMode }),
        setBorderRadius: (borderRadius) => set({ borderRadius }),
        setShadows: (shadows) => set({ shadows }),

        // Components state
        components: [],
        isLoadingComponents: false,
        lastScanned: null,

        setComponents: (components) => set({ components, lastScanned: new Date().toISOString() }),
        setIsLoadingComponents: (isLoadingComponents) => set({ isLoadingComponents }),
        setLastScanned: (lastScanned) => set({ lastScanned }),

        // Assets state
        assetTree: null,
        selectedPath: null,
        isLoadingAssets: false,

        setAssetTree: (assetTree) => set({ assetTree }),
        setSelectedPath: (selectedPath) => set({ selectedPath }),
        setIsLoadingAssets: (isLoadingAssets) => set({ isLoadingAssets }),

        // Typography state
        fonts: [],
        typographyStyles: [],

        setFonts: (fonts) => set({ fonts }),
        setTypographyStyles: (typographyStyles) => set({ typographyStyles }),
      }),
      {
        name: 'devtools-storage',
        partialize: (state) => ({
          panelWidth: state.panelWidth,
          activeTab: state.activeTab,
          activeMode: state.activeMode,
        }),
      }
    ),
    { name: 'RadFlow DevTools' }
  )
);

export default useDevToolsStore;
