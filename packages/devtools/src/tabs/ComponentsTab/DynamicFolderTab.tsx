'use client';

import { useState, useEffect } from 'react';
import { useDevToolsStore } from '../../store';
import { ComponentList } from './ComponentList';
import { Button } from '@radflow/ui/Button';
import type { DiscoveredComponent } from '../../types';

interface DynamicFolderTabProps {
  folderName: string;
}

export function DynamicFolderTab({ folderName }: DynamicFolderTabProps) {
  const { components, isLoading, scanComponents } = useDevToolsStore();
  const [folderComponents, setFolderComponents] = useState<DiscoveredComponent[]>([]);

  // Scan components from this specific folder
  useEffect(() => {
    const scanFolder = async () => {
      try {
        const response = await fetch(`/api/devtools/components?folder=${encodeURIComponent(folderName)}`);
        const data = await response.json();
        setFolderComponents(data.components || []);
      } catch (error) {
        setFolderComponents([]);
      }
    };

    scanFolder();
  }, [folderName]);

  // Preview content is not dynamically loaded - previews are handled by specific tab components
  // like DesignSystemTab or UITab. DynamicFolderTab shows discovered components without previews.

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-surface-primary border border-edge-primary rounded space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-joystix text-sm uppercase text-content-primary">{folderName}</h2>
        <Button
          variant="outline"
          size="sm"
          iconName="refresh"
          onClick={async () => {
            try {
              const response = await fetch(`/api/devtools/components?folder=${encodeURIComponent(folderName)}`);
              const data = await response.json();
              setFolderComponents(data.components || []);
            } catch (error) {
              // Failed to refresh
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Scanning...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 font-mondwest text-base text-content-primary/60">
        <span>{folderComponents.length} components found</span>
        <span>in /components/{folderName}/</span>
      </div>

      {/* Loading State */}
      {isLoading && folderComponents.length === 0 && (
        <div className="text-center py-8 text-content-primary/60 font-mondwest text-base">
          Scanning components...
        </div>
      )}

      {/* Component List */}
      {!isLoading && folderComponents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-content-primary/60 font-mondwest text-base mb-2">No components found</p>
          <p className="font-mondwest text-sm text-content-primary/60">
            Create components with default exports in /components/{folderName}/
          </p>
        </div>
      )}

      {folderComponents.length > 0 && (
        <ComponentList components={folderComponents} folderName={folderName} />
      )}
    </div>
  );
}

