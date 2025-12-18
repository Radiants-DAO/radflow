'use client';

import { useState } from 'react';
import type { DiscoveredComponent } from '../../types';

interface ComponentListProps {
  components: DiscoveredComponent[];
  selectedComponent: DiscoveredComponent | null;
  onSelect: (component: DiscoveredComponent | null) => void;
}

export function ComponentList({ components, selectedComponent, onSelect }: ComponentListProps) {
  const [search, setSearch] = useState('');

  const filtered = components.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.path.toLowerCase().includes(search.toLowerCase())
  );

  // Group by directory
  const grouped = filtered.reduce((acc, comp) => {
    const parts = comp.path.split('/');
    const dir = parts.slice(0, -1).join('/') || '/';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(comp);
    return acc;
  }, {} as Record<string, DiscoveredComponent[]>);

  return (
    <div className="space-y-3">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search components..."
        className="w-full px-3 py-2 text-xs bg-panel border border-border rounded-md text-body placeholder:text-caption focus:outline-none focus:border-focus"
      />

      {/* Component List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {Object.entries(grouped).map(([dir, comps]) => (
          <div key={dir}>
            <h4 className="text-xs font-medium text-caption mb-1 font-mono">{dir}</h4>
            <div className="space-y-1">
              {comps.map((comp) => (
                <button
                  key={comp.path}
                  onClick={() => onSelect(selectedComponent?.path === comp.path ? null : comp)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${
                    selectedComponent?.path === comp.path
                      ? 'bg-panel-active text-heading'
                      : 'bg-panel-hover text-body hover:bg-panel-active'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{comp.name}</span>
                    <span className="text-caption">{comp.props.length} props</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-xs text-caption italic text-center py-4">
            {search ? 'No components match your search' : 'No components found'}
          </p>
        )}
      </div>
    </div>
  );
}

