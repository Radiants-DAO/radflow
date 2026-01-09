import { StateCreator } from 'zustand';
import type { TextChange } from '../../types';

export interface TextEditSlice {
  isTextEditActive: boolean;
  pendingChanges: TextChange[];
  currentElement: HTMLElement | null;
  originalState: { text: string; tag: string } | null;
  
  toggleTextEditMode: () => void;
  setCurrentElement: (element: HTMLElement | null, originalState?: { text: string; tag: string }) => void;
  addChange: (change: TextChange) => void;
  clearChanges: () => void;
  getPageChanges: () => TextChange[];
  getRadToolsChanges: () => TextChange[];
  formatChangesForClipboard: () => string;
}

export const createTextEditSlice: StateCreator<TextEditSlice, [], [], TextEditSlice> = (set, get) => ({
  isTextEditActive: false,
  pendingChanges: [],
  currentElement: null,
  originalState: null,
  
  toggleTextEditMode: () => {
    const state = get();
    if (state.isTextEditActive) {
      // Exiting mode - copy changes to clipboard if any
      const changes = state.pendingChanges;
      if (changes.length > 0) {
        const formatted = state.formatChangesForClipboard();
        navigator.clipboard.writeText(formatted).catch(console.error);
      }
      // Clear current element and reset
      if (state.currentElement) {
        state.currentElement.contentEditable = 'false';
        state.currentElement.blur();
      }
      set({ 
        isTextEditActive: false, 
        currentElement: null, 
        originalState: null 
      });
    } else {
      set({ isTextEditActive: true });
    }
  },
  setCurrentElement: (element, originalState) => set({ 
    currentElement: element, 
    originalState: originalState || null 
  }),
  addChange: (change) => set((state) => ({ 
    pendingChanges: [...state.pendingChanges, change] 
  })),
  clearChanges: () => set({ pendingChanges: [] }),
  getPageChanges: () => get().pendingChanges.filter(c => !c.isRadToolsChange),
  getRadToolsChanges: () => get().pendingChanges.filter(c => c.isRadToolsChange),
  formatChangesForClipboard: () => {
    const changes = get().pendingChanges;
    if (changes.length === 0) return '';
    
    const lines = ['[TEXT_CHANGES]:'];
    
    changes.forEach((change) => {
      lines.push(`"${change.originalText}" → "${change.newText}"`);
    });
    
    return lines.join('\n');
  },
});
