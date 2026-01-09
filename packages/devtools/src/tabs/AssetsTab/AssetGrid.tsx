'use client';

import { Icon } from '@radflow/ui';
import type { AssetFile } from '../../types';

interface AssetGridProps {
  files: AssetFile[];
  selectedFiles: string[];
  onSelect: (path: string, multi: boolean) => void;
  onDelete: (path: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AssetGrid({ files, selectedFiles, onSelect, onDelete }: AssetGridProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-content-primary/60 text-xs">
        No files in this folder
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {files.map((file) => (
        <div
          key={file.path}
          onClick={(e) => onSelect(file.path, e.shiftKey || e.metaKey)}
          className={`relative group rounded-lg border overflow-hidden cursor-pointer transition-colors ${
            selectedFiles.includes(file.path)
              ? 'border-focus ring-2 ring-focus/20'
              : 'border-border hover:border-focus'
          }`}
        >
          {/* Preview */}
          <div className="aspect-square bg-surface-tertiary/20 flex items-center justify-center">
            {file.type === 'image' ? (
              <img
                src={file.path}
                alt={file.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-2xl">
                {file.type === 'video' ? '🎬' : '📄'}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-2 bg-surface-primary">
            <p className="text-xs font-medium text-content-primary truncate">{file.name}</p>
            <p className="text-xs text-content-primary/60">{formatSize(file.size)}</p>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file.path);
            }}
            className="absolute top-1 right-1 w-6 h-6 bg-error-red text-cream rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Icon name="close" size={12} className="text-cream" />
          </button>
        </div>
      ))}
    </div>
  );
}

