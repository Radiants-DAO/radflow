import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { VariablesSlice, createVariablesSlice } from './slices/variablesSlice';
import { ComponentsSlice, createComponentsSlice } from './slices/componentsSlice';
import { AssetsSlice, createAssetsSlice } from './slices/assetsSlice';
import { CommentsSlice, createCommentsSlice } from './slices/commentsSlice';
import { MockStatesSlice, createMockStatesSlice } from './slices/mockStatesSlice';
import { ChangelogSlice, createChangelogSlice } from './slices/changelogSlice';
import type { Tab } from '../types';

interface PanelState {
  isOpen: boolean;
  activeTab: Tab;
  panelPosition: { x: number; y: number };
  togglePanel: () => void;
  setActiveTab: (tab: Tab) => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
}

type DevToolsState = PanelState & 
  VariablesSlice & 
  ComponentsSlice & 
  AssetsSlice & 
  CommentsSlice & 
  MockStatesSlice & 
  ChangelogSlice;

export const useDevToolsStore = create<DevToolsState>()(
  devtools(
    persist(
      (set, get, api) => ({
        // Panel state
        isOpen: false,
        activeTab: 'variables' as Tab,
        panelPosition: { x: 20, y: 20 },
        togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setPanelPosition: (position) => set({ panelPosition: position }),

        // Slices
        ...createVariablesSlice(set, get, api),
        ...createComponentsSlice(set, get, api),
        ...createAssetsSlice(set, get, api),
        ...createCommentsSlice(set, get, api),
        ...createMockStatesSlice(set, get, api),
        ...createChangelogSlice(set, get, api),
      }),
      {
        name: 'devtools-storage',
        partialize: (state) => ({
          // Only persist these fields
          panelPosition: state.panelPosition,
          activeTab: state.activeTab,
          comments: state.comments,
          mockStates: state.mockStates,
          changelogEntries: state.changelogEntries,
        }),
      }
    ),
    { name: 'RadTools DevTools' }
  )
);

