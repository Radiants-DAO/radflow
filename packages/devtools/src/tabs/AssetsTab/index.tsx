'use client';

import { useEffect, useState, useRef } from 'react';
import { useDevToolsStore } from '../../store';
import { FolderTree } from './FolderTree';
import { AssetGrid } from './AssetGrid';
import { UploadDropzone } from './UploadDropzone';
import type { AssetFile, AssetFolder } from '../../types';
import { Button } from '@radflow/ui/Button';

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
  const messageTimerRef = useRef<NodeJS.Timeout>(undefined);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

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
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => setMessage(null), 3000);
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
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => setMessage(null), 3000);
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
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-edge-primary rounded space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-joystix text-sm uppercase text-content-primary">Assets</h2>
        <div className="flex gap-2">
          {selectedFiles.length > 0 && (
            <Button
              variant="primary"
              size="md"
              iconName="lightning"
              onClick={handleOptimize}
              disabled={isOptimizing}
            >
              {isOptimizing ? 'Optimizing...' : `Optimize (${selectedFiles.length})`}
            </Button>
          )}
          <Button
            variant="outline"
            size="md"
            iconName="refresh"
            onClick={() => refreshAssets()}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-3 py-2 font-mondwest text-base rounded-sm ${
            message.type === 'success'
              ? 'bg-success-green text-content-primary'
              : 'bg-error-red text-cream'
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
          <div className="w-1/3 border border-edge-primary rounded-md p-2 max-h-[300px] overflow-y-auto">
            <FolderTree
              folder={assets}
              selectedFolder={selectedFolder || assets.path}
              onSelectFolder={setSelectedFolder}
            />
          </div>
        )}

        {/* Asset Grid */}
        <div className="flex-1 border border-edge-primary rounded-md p-2 max-h-[300px] overflow-y-auto">
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

