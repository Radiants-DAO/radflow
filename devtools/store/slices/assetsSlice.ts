import { StateCreator } from 'zustand';
import type { AssetFolder, AssetFile } from '../../types';

export interface AssetsSlice {
  // State
  assets: AssetFolder | null;
  selectedFolder: string | null;
  uploadProgress: Record<string, number>;
  isLoading: boolean;
  
  // Actions
  setAssets: (assets: AssetFolder) => void;
  setSelectedFolder: (path: string | null) => void;
  setUploadProgress: (fileName: string, progress: number) => void;
  clearUploadProgress: (fileName: string) => void;
  refreshAssets: () => Promise<void>;
  uploadAsset: (file: File, folder: string) => Promise<void>;
  deleteAsset: (path: string) => Promise<void>;
  optimizeAssets: (paths: string[]) => Promise<void>;
}

export const createAssetsSlice: StateCreator<AssetsSlice, [], [], AssetsSlice> = (set, get) => ({
  assets: null,
  selectedFolder: null,
  uploadProgress: {},
  isLoading: false,

  setAssets: (assets) => set({ assets }),
  
  setSelectedFolder: (path) => set({ selectedFolder: path }),
  
  setUploadProgress: (fileName, progress) => set((state) => ({
    uploadProgress: { ...state.uploadProgress, [fileName]: progress }
  })),
  
  clearUploadProgress: (fileName) => set((state) => {
    const { [fileName]: _, ...rest } = state.uploadProgress;
    return { uploadProgress: rest };
  }),

  refreshAssets: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/devtools/assets');
      const data = await res.json();
      set({ assets: data.assets, isLoading: false });
    } catch (error) {
      console.error('Failed to refresh assets:', error);
      set({ isLoading: false });
    }
  },

  uploadAsset: async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [file.name]: 0 }
    }));
    
    try {
      const res = await fetch('/api/devtools/assets', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        set((state) => ({
          uploadProgress: { ...state.uploadProgress, [file.name]: 100 }
        }));
        await get().refreshAssets();
      }
    } catch (error) {
      console.error('Failed to upload asset:', error);
    } finally {
      setTimeout(() => get().clearUploadProgress(file.name), 2000);
    }
  },

  deleteAsset: async (path) => {
    try {
      await fetch('/api/devtools/assets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
      await get().refreshAssets();
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  },

  optimizeAssets: async (paths) => {
    try {
      await fetch('/api/devtools/assets/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: paths }),
      });
      await get().refreshAssets();
    } catch (error) {
      console.error('Failed to optimize assets:', error);
    }
  },
});

