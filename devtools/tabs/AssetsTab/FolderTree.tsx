'use client';

import { useState } from 'react';
import type { AssetFolder, AssetFile } from '../../types';

interface FolderTreeProps {
  folder: AssetFolder;
  selectedFolder: string | null;
  onSelectFolder: (path: string) => void;
  depth?: number;
}

export function FolderTree({ folder, selectedFolder, onSelectFolder, depth = 0 }: FolderTreeProps) {
  const [expanded, setExpanded] = useState(depth < 2);

  const subfolders = folder.children.filter((c): c is AssetFolder => 'children' in c);
  const files = folder.children.filter((c): c is AssetFile => !('children' in c));

  return (
    <div style={{ paddingLeft: depth > 0 ? '12px' : '0' }}>
      <button
        onClick={() => {
          setExpanded(!expanded);
          onSelectFolder(folder.path);
        }}
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-left transition-colors ${
          selectedFolder === folder.path
            ? 'bg-panel-active text-heading'
            : 'hover:bg-panel-hover text-body'
        }`}
      >
        <span>{expanded ? '📂' : '📁'}</span>
        <span className="flex-1">{folder.name}</span>
        <span className="text-caption">{files.length}</span>
      </button>

      {expanded && subfolders.length > 0 && (
        <div className="mt-1">
          {subfolders.map((subfolder) => (
            <FolderTree
              key={subfolder.path}
              folder={subfolder}
              selectedFolder={selectedFolder}
              onSelectFolder={onSelectFolder}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

