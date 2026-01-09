import { StateCreator } from 'zustand';
import type { ComponentInfo } from '../../types';

export interface ComponentIdSlice {
  isComponentIdActive: boolean;
  hoveredComponent: ComponentInfo | null;
  tooltipPosition: { x: number; y: number } | null;
  
  toggleComponentIdMode: () => void;
  setHoveredComponent: (info: ComponentInfo | null, position?: { x: number; y: number }) => void;
}

export const createComponentIdSlice: StateCreator<ComponentIdSlice, [], [], ComponentIdSlice> = (set) => ({
  isComponentIdActive: false,
  hoveredComponent: null,
  tooltipPosition: null,
  
  toggleComponentIdMode: () => set((state) => ({ isComponentIdActive: !state.isComponentIdActive })),
  setHoveredComponent: (info, position) => set({ 
    hoveredComponent: info, 
    tooltipPosition: position || null 
  }),
});
