'use client';

import { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { ComponentList } from './ComponentList';
import { PropDisplay } from './PropDisplay';
import type { DiscoveredComponent } from '../../types';

export function ComponentsTab() {
  const { components, isLoading, scanComponents } = useDevToolsStore();
  const [selectedComponent, setSelectedComponent] = useState<DiscoveredComponent | null>(null);

  useEffect(() => {
    scanComponents();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-heading">Components</h2>
        <button
          onClick={() => scanComponents()}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-medium bg-panel-hover text-body rounded-md hover:bg-panel-active border border-border disabled:opacity-50"
        >
          {isLoading ? '⟳ Scanning...' : '↻ Refresh'}
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-caption">
        <span>{components.length} components found</span>
        <span>in /components/</span>
      </div>

      {/* Loading State */}
      {isLoading && components.length === 0 && (
        <div className="text-center py-8 text-caption text-sm">
          Scanning components...
        </div>
      )}

      {/* Component List */}
      {!isLoading && components.length === 0 && (
        <div className="text-center py-8">
          <p className="text-caption text-sm mb-2">No components found</p>
          <p className="text-xs text-caption">
            Create components with default exports in /components/
          </p>
        </div>
      )}

      {components.length > 0 && (
        <div className="space-y-4">
          <ComponentList
            components={components}
            selectedComponent={selectedComponent}
            onSelect={setSelectedComponent}
          />

          {selectedComponent && (
            <>
              <hr className="border-border" />
              <PropDisplay component={selectedComponent} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

