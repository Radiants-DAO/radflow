import { StateCreator } from 'zustand';
import type { Tab } from '../../types';

export interface PanelSlice {
  // Panel state
  isOpen: boolean;
  activeTab: Tab;
  panelWidth: number; // Width for fixed-right panel (default 400px)
  isSettingsOpen: boolean; // Settings panel visibility

  // Actions
  togglePanel: () => void;
  setActiveTab: (tab: Tab) => void;
  setPanelWidth: (width: number) => void;
  openSettings: () => void;
  closeSettings: () => void;
  expandAndNavigate: (tab: Tab) => void;
}

export const createPanelSlice: StateCreator<PanelSlice, [], [], PanelSlice> = (set) => ({
  isOpen: false,
  activeTab: 'variables' as Tab,
  panelWidth: 400, // Default width for fixed-right panel
  isSettingsOpen: false,

  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPanelWidth: (width) => set({ panelWidth: Math.max(300, Math.min(width, window.innerWidth * 0.8)) }),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  expandAndNavigate: (tab: Tab) => set({ activeTab: tab, isOpen: true }),
});
