'use client';

import { useState } from 'react';
import { Button } from '@radflow/ui/Button';
import { IconsSubTab } from './IconsSubTab';
import { LogosSubTab } from './LogosSubTab';
import { ImagesSubTab } from './ImagesSubTab';

type AssetSubTab = 'icons' | 'logos' | 'images';

export function AssetsTab() {
  const [activeSubTab, setActiveSubTab] = useState<AssetSubTab>('icons');
  const [searchQuery, setSearchQuery] = useState('');

  const subTabs: Array<{ id: AssetSubTab; label: string }> = [
    { id: 'icons', label: 'Icons' },
    { id: 'logos', label: 'Logos' },
    { id: 'images', label: 'Images' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header with sub-tabs and search */}
      <div className="flex-shrink-0 border-b border-edge-primary/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex gap-2">
            {subTabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeSubTab === tab.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveSubTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-surface-primary border border-edge-primary rounded-sm text-content-primary placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-edge-focus focus:bg-surface-elevated"
          />
        </div>
      </div>

      {/* Sub-tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeSubTab === 'icons' && <IconsSubTab searchQuery={searchQuery} />}
        {activeSubTab === 'logos' && <LogosSubTab searchQuery={searchQuery} />}
        {activeSubTab === 'images' && <ImagesSubTab searchQuery={searchQuery} />}
      </div>
    </div>
  );
}

