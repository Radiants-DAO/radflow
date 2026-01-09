import { StateCreator } from 'zustand';

export interface HelpSlice {
  isHelpActive: boolean;
  hoveredHelpId: string | null;
  tooltipPosition: { x: number; y: number } | null;
  viewedHelpIds: Set<string>;
  
  toggleHelpMode: () => void;
  setHoveredHelp: (id: string | null, position?: { x: number; y: number }) => void;
  markAsViewed: (id: string) => void;
}

export const createHelpSlice: StateCreator<HelpSlice, [], [], HelpSlice> = (set, get) => ({
  isHelpActive: false,
  hoveredHelpId: null,
  tooltipPosition: null,
  viewedHelpIds: new Set(),
  
  toggleHelpMode: () => set((state) => ({ isHelpActive: !state.isHelpActive })),
  setHoveredHelp: (id, position) => set({ 
    hoveredHelpId: id, 
    tooltipPosition: position || null 
  }),
  markAsViewed: (id) => set((state) => {
    const newSet = new Set(state.viewedHelpIds);
    newSet.add(id);
    return { viewedHelpIds: newSet };
  }),
});
