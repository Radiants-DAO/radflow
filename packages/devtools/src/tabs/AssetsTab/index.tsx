'use client';

import { useState, useEffect } from 'react';
import { Button } from '@radflow/ui';
import { IconsSubTab } from './IconsSubTab';
import { LogosSubTab } from './LogosSubTab';
import { ImagesSubTab } from './ImagesSubTab';
import { useDevToolsStore } from '../../store';

type AssetSubTab = 'icons' | 'logos' | 'images';
type IconSizeOption = 16 | 20 | 24 | 32;

export function AssetsTab() {
  const [activeSubTab, setActiveSubTab] = useState<AssetSubTab>('icons');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIconSize, setSelectedIconSize] = useState<IconSizeOption>(24);
  const { pendingSubTab, setPendingSubTab } = useDevToolsStore();

  // Handle pending sub-tab navigation from global search
  useEffect(() => {
    if (pendingSubTab === 'icons' || pendingSubTab === 'logos' || pendingSubTab === 'images') {
      setActiveSubTab(pendingSubTab);
      setPendingSubTab(null);
    }
  }, [pendingSubTab, setPendingSubTab]);

  const subTabs: Array<{ id: AssetSubTab; label: string }> = [
    { id: 'icons', label: 'Icons' },
    { id: 'logos', label: 'Logos' },
    { id: 'images', label: 'Images' },
  ];

  const iconSizeOptions: IconSizeOption[] = [16, 20, 24, 32];

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

          {/* Icon size selector - only show for icons tab */}
          {activeSubTab === 'icons' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-content-secondary">Size:</span>
              <div className="flex gap-1">
                {iconSizeOptions.map((size) => (
                  <Button
                    key={size}
                    variant={selectedIconSize === size ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedIconSize(size)}
                    className="min-w-[40px]"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-surface-primary border border-edge-primary rounded-sm text-content-primary placeholder:text-content-primary focus:outline-none focus:ring-2 focus:ring-edge-focus focus:bg-surface-elevated"
          />
        </div>
      </div>

      {/* Sub-tab content */}
      <div className="flex-1 overflow-y-auto pt-4 pb-4 pl-4 pr-2 bg-surface-elevated border border-edge-primary rounded">
        {activeSubTab === 'icons' && <IconsSubTab searchQuery={searchQuery} selectedSize={selectedIconSize} />}
        {activeSubTab === 'logos' && <LogosSubTab searchQuery={searchQuery} />}
        {activeSubTab === 'images' && <ImagesSubTab searchQuery={searchQuery} />}
      </div>
    </div>
  );
}

