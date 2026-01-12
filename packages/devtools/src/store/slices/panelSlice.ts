import { StateCreator } from 'zustand';
import type { Tab, DockPosition } from '../../types';

export interface PanelSlice {
  // Panel state
  isOpen: boolean;
  activeTab: Tab;
  panelPosition: { x: number; y: number };
  panelSize: { width: number; height: number };
  panelWidth: number; // Width for fixed-right/left panel (default 400px)
  isFullscreen: boolean;
  dockPosition: DockPosition; // Where the panel is docked
  isSettingsOpen: boolean; // Settings panel visibility

  // Actions
  togglePanel: () => void;
  setActiveTab: (tab: Tab) => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
  setPanelSize: (size: { width: number; height: number }) => void;
  setPanelWidth: (width: number) => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
  setDockPosition: (position: DockPosition) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export const createPanelSlice: StateCreator<PanelSlice, [], [], PanelSlice> = (set) => ({
  isOpen: false,
  activeTab: 'variables' as Tab,
  panelPosition: { x: 20, y: 20 },
  panelSize: { width: 420, height: 600 },
  panelWidth: 400, // Default width for fixed-right/left panel
  isFullscreen: false,
  dockPosition: 'right' as DockPosition,
  isSettingsOpen: false,

  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPanelPosition: (position) => set({ panelPosition: position }),
  setPanelSize: (size) => set({ panelSize: size }),
  setPanelWidth: (width) => set({ panelWidth: Math.max(300, Math.min(width, window.innerWidth * 0.8)) }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setFullscreen: (value) => set({ isFullscreen: value }),
  setDockPosition: (position) => set({ dockPosition: position }),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
});
