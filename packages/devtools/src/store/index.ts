import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PanelSlice, createPanelSlice } from './slices/panelSlice';
import { VariablesSlice, createVariablesSlice } from './slices/variablesSlice';
import { TypographySlice, createTypographySlice } from './slices/typographySlice';
import { ComponentsSlice, createComponentsSlice } from './slices/componentsSlice';
import { AssetsSlice, createAssetsSlice } from './slices/assetsSlice';
import { MockStatesSlice, createMockStatesSlice } from './slices/mockStatesSlice';
import { SearchSlice, createSearchSlice } from './slices/searchSlice';
import { TextEditSlice, createTextEditSlice } from './slices/textEditSlice';
import { ComponentIdSlice, createComponentIdSlice } from './slices/componentIdSlice';
import { HelpSlice, createHelpSlice } from './slices/helpSlice';

type DevToolsState = PanelSlice &
  VariablesSlice & 
  TypographySlice &
  ComponentsSlice & 
  AssetsSlice & 
  MockStatesSlice &
  SearchSlice &
  TextEditSlice &
  ComponentIdSlice &
  HelpSlice;

export const useDevToolsStore = create<DevToolsState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createPanelSlice(set, get, api),
        ...createVariablesSlice(set, get, api),
        ...createTypographySlice(set, get, api),
        ...createComponentsSlice(set, get, api),
        ...createAssetsSlice(set, get, api),
        ...createMockStatesSlice(set, get, api),
        ...createSearchSlice(set, get, api),
        ...createTextEditSlice(set, get, api),
        ...createComponentIdSlice(set, get, api),
        ...createHelpSlice(set, get, api),
      }),
      {
        name: 'devtools-storage',
        partialize: (state) => ({
          panelPosition: state.panelPosition,
          panelSize: state.panelSize,
          panelWidth: state.panelWidth,
          dockPosition: state.dockPosition,
          activeTab: state.activeTab,
          mockStates: state.mockStates,
        }),
      }
    ),
    { name: 'RadTools DevTools' }
  )
);
