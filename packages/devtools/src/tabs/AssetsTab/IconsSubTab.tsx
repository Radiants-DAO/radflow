'use client';

import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@radflow/ui/Icon';
import { Button } from '@radflow/ui/Button';

interface IconData {
  name: string;
  path: string;
}

interface IconsSubTabProps {
  searchQuery: string;
}

type IconSizeOption = 16 | 20 | 24 | 32;

export function IconsSubTab({ searchQuery }: IconsSubTabProps) {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<IconSizeOption>(24);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  // Load icons on mount
  useEffect(() => {
    const loadIcons = async () => {
      try {
        const response = await fetch('/api/devtools/icons');
        if (!response.ok) throw new Error('Failed to fetch icons');
        const data = await response.json();
        // API returns array of icon names, convert to IconData format
        const iconList: IconData[] = (data.icons || []).map((name: string) => ({
          name,
          path: `/assets/icons/${name}.svg`,
        }));
        setIcons(iconList);
      } catch (error) {
        console.error('Failed to load icons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIcons();

    // Load recently used from localStorage
    const stored = localStorage.getItem('radflow-recently-used-icons');
    if (stored) {
      try {
        setRecentlyUsed(JSON.parse(stored));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Filter icons by search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return icons;
    const query = searchQuery.toLowerCase();
    return icons.filter((icon) => icon.name.toLowerCase().includes(query));
  }, [icons, searchQuery]);

  // Get recently used icons (last 5)
  const recentIcons = useMemo(() => {
    return recentlyUsed
      .map((name) => icons.find((icon) => icon.name === name))
      .filter((icon): icon is IconData => icon !== undefined)
      .slice(0, 5);
  }, [recentlyUsed, icons]);

  const handleCopyIcon = (iconName: string) => {
    const jsxCode = `<Icon name="${iconName}" size={${selectedSize}} />`;
    navigator.clipboard.writeText(jsxCode);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);

    // Update recently used
    const updated = [iconName, ...recentlyUsed.filter((n) => n !== iconName)].slice(0, 5);
    setRecentlyUsed(updated);
    localStorage.setItem('radflow-recently-used-icons', JSON.stringify(updated));
  };

  const sizeOptions: IconSizeOption[] = [16, 20, 24, 32];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-content-secondary">Loading icons...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Size selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-content-secondary font-mondwest">Icon Size:</span>
        <div className="flex gap-2">
          {sizeOptions.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedSize(size)}
            >
              {size}px
            </Button>
          ))}
        </div>
      </div>

      {/* Recently used section */}
      {recentIcons.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-joystix text-content-primary uppercase">Recently Used</h3>
          <div className="grid grid-cols-8 gap-3">
            {recentIcons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => handleCopyIcon(icon.name)}
                className="group relative flex flex-col items-center justify-center p-3 bg-surface-elevated border border-edge-primary/20 rounded-sm hover:border-edge-focus hover:bg-surface-tertiary transition-all"
                title={icon.name}
              >
                <div className="flex items-center justify-center" style={{ width: selectedSize, height: selectedSize }}>
                  <Icon name={icon.name} size={selectedSize} className="text-content-primary" />
                </div>
                <span className="mt-2 text-xs text-content-tertiary truncate max-w-full">
                  {icon.name}
                </span>
                {copiedIcon === icon.name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-success/90 rounded-md">
                    <Icon name="checkmark" size={20} className="text-content-inverted" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All icons grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-joystix text-content-primary uppercase">
          All Icons ({filteredIcons.length})
        </h3>
        {filteredIcons.length === 0 ? (
          <p className="text-content-tertiary text-center py-8">No icons found matching "{searchQuery}"</p>
        ) : (
          <div className="grid grid-cols-8 gap-3">
            {filteredIcons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => handleCopyIcon(icon.name)}
                className="group relative flex flex-col items-center justify-center p-3 bg-surface-elevated border border-edge-primary/20 rounded-sm hover:border-edge-focus hover:bg-surface-tertiary transition-all"
                title={icon.name}
              >
                <div className="flex items-center justify-center" style={{ width: selectedSize, height: selectedSize }}>
                  <Icon name={icon.name} size={selectedSize} className="text-content-primary" />
                </div>
                <span className="mt-2 text-xs text-content-tertiary truncate max-w-full">
                  {icon.name}
                </span>
                {copiedIcon === icon.name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-success/90 rounded-md">
                    <Icon name="checkmark" size={20} className="text-content-inverted" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
