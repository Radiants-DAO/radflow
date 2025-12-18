'use client';

import { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { FolderTree } from './FolderTree';
import { AssetGrid } from './AssetGrid';
import { UploadDropzone } from './UploadDropzone';
import type { AssetFile, AssetFolder } from '../../types';

export function AssetsTab() {
  const { 
    assets, 
    selectedFolder, 
    setSelectedFolder, 
    refreshAssets, 
    uploadAsset, 
    deleteAsset,
    optimizeAssets,
    isLoading 
  } = useDevToolsStore();
  
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    refreshAssets();
  }, []);

  // Get files in selected folder
  const getFilesInFolder = (folder: AssetFolder | null, targetPath: string | null): AssetFile[] => {
    if (!folder || !targetPath) return [];
    
    if (folder.path === targetPath) {
      return folder.children.filter((c): c is AssetFile => !('children' in c));
    }

    for (const child of folder.children) {
      if ('children' in child) {
        const result = getFilesInFolder(child, targetPath);
        if (result.length > 0 || child.path === targetPath) {
          return result.length > 0 ? result : child.children.filter((c): c is AssetFile => !('children' in c));
        }
      }
    }

    return [];
  };

  const currentFiles = assets ? getFilesInFolder(assets, selectedFolder || assets.path) : [];

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        const folder = selectedFolder?.replace('/assets/', '') || '';
        await uploadAsset(file, folder);
      }
      setMessage({ type: 'success', text: `Uploaded ${files.length} file(s)` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm('Delete this file?')) return;
    await deleteAsset(path);
    setSelectedFiles((prev) => prev.filter((p) => p !== path));
  };

  const handleOptimize = async () => {
    if (selectedFiles.length === 0) return;
    setIsOptimizing(true);
    try {
      await optimizeAssets(selectedFiles);
      setMessage({ type: 'success', text: 'Optimization complete!' });
    } catch {
      setMessage({ type: 'error', text: 'Optimization failed' });
    } finally {
      setIsOptimizing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSelect = (path: string, multi: boolean) => {
    setSelectedFiles((prev) => {
      if (multi) {
        return prev.includes(path) 
          ? prev.filter((p) => p !== path)
          : [...prev, path];
      }
      return prev.includes(path) && prev.length === 1 ? [] : [path];
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-heading">Assets</h2>
        <div className="flex gap-2">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="px-3 py-1.5 text-xs font-medium bg-tertiary text-heading rounded-md hover:bg-tertiary/90 disabled:opacity-50"
            >
              {isOptimizing ? 'Optimizing...' : `⚡ Optimize (${selectedFiles.length})`}
            </button>
          )}
          <button
            onClick={() => refreshAssets()}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium bg-panel-hover text-body rounded-md hover:bg-panel-active border border-border disabled:opacity-50"
          >
            {isLoading ? '⟳ Loading...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-3 py-2 text-xs rounded-md ${
            message.type === 'success'
              ? 'bg-success text-heading'
              : 'bg-error text-alternate'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Upload Dropzone */}
      <UploadDropzone onUpload={handleUpload} isUploading={isUploading} />

      {/* Content */}
      <div className="flex gap-4">
        {/* Folder Tree */}
        {assets && (
          <div className="w-1/3 border border-border rounded-lg p-2 max-h-[300px] overflow-y-auto">
            <FolderTree
              folder={assets}
              selectedFolder={selectedFolder || assets.path}
              onSelectFolder={setSelectedFolder}
            />
          </div>
        )}

        {/* Asset Grid */}
        <div className="flex-1 border border-border rounded-lg p-2 max-h-[300px] overflow-y-auto">
          <AssetGrid
            files={currentFiles}
            selectedFiles={selectedFiles}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

