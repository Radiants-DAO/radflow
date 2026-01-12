'use client';

import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@radflow/ui';

interface IconData {
  name: string;
  path: string;
}

interface IconLibraryInfo {
  library: string;
  style: string;
  package?: string;
  url?: string;
}

interface IconsApiResponse {
  themeId: string | null;
  source: 'library' | 'theme-local' | 'public' | 'none';
  icons: string[];
  iconLibrary?: IconLibraryInfo;
  path?: string;
}

interface IconsSubTabProps {
  searchQuery: string;
  selectedSize: 16 | 20 | 24 | 32;
}

export function IconsSubTab({ searchQuery, selectedSize }: IconsSubTabProps) {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [iconLibrary, setIconLibrary] = useState<IconLibraryInfo | null>(null);
  const [iconSource, setIconSource] = useState<string>('none');

  // Load icons on mount
  useEffect(() => {
    const loadIcons = async () => {
      try {
        const response = await fetch('/api/devtools/icons');
        if (!response.ok) throw new Error('Failed to fetch icons');
        const data: IconsApiResponse = await response.json();

        setIconSource(data.source);

        // Check if theme uses an icon library
        if (data.source === 'library' && data.iconLibrary) {
          setIconLibrary(data.iconLibrary);
          setIcons([]);
        } else {
          // Local icons - convert to IconData format
          const basePath = data.path || '/assets/icons/';
          const iconList: IconData[] = (data.icons || []).map((name: string) => ({
            name,
            path: `${basePath}${name}.svg`,
          }));
          setIcons(iconList);
          setIconLibrary(null);
        }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-content-secondary">Loading icons...</p>
      </div>
    );
  }

  // Show icon library info if theme uses a library
  if (iconLibrary) {
    return (
      <div className="p-4 space-y-6">
        <div className="bg-surface-elevated border border-edge-primary rounded-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-surface-tertiary rounded-sm flex items-center justify-center">
              <Icon name="cube" size={24} className="text-content-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-content-primary capitalize">
                {iconLibrary.library} Icons
              </h3>
              <p className="text-sm text-content-secondary">
                Style: {iconLibrary.style}
              </p>
            </div>
          </div>

          <p className="text-sm text-content-secondary">
            This theme uses the <span className="font-mono text-content-primary">{iconLibrary.package}</span> icon library.
            Browse and copy icon names from the official website.
          </p>

          {iconLibrary.url && (
            <a
              href={iconLibrary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-tertiary border border-edge-primary rounded-sm text-sm text-content-primary hover:bg-surface-primary transition-colors"
            >
              <Icon name="external-link" size={16} />
              Browse {iconLibrary.library} Icons
            </a>
          )}

          <div className="border-t border-edge-primary/20 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Usage Example</h4>
            <div className="bg-surface-primary border border-edge-primary/20 rounded-sm p-3 font-mono text-sm text-content-secondary">
              {iconLibrary.library.toLowerCase() === 'phosphor' ? (
                <>
                  <div className="text-content-secondary/60">// Import</div>
                  <div>import {'{'} Heart {'}'} from &apos;{iconLibrary.package}&apos;;</div>
                  <div className="mt-2 text-content-secondary/60">// Use</div>
                  <div>&lt;Heart size={'{'}32{'}'} weight=&quot;{iconLibrary.style}&quot; /&gt;</div>
                </>
              ) : iconLibrary.library.toLowerCase() === 'lucide' ? (
                <>
                  <div className="text-content-secondary/60">// Import</div>
                  <div>import {'{'} Heart {'}'} from &apos;{iconLibrary.package}&apos;;</div>
                  <div className="mt-2 text-content-secondary/60">// Use</div>
                  <div>&lt;Heart size={'{'}32{'}'} /&gt;</div>
                </>
              ) : (
                <>
                  <div className="text-content-secondary/60">// Import</div>
                  <div>import {'{'} IconName {'}'} from &apos;{iconLibrary.package}&apos;;</div>
                  <div className="mt-2 text-content-secondary/60">// Use</div>
                  <div>&lt;IconName size={'{'}32{'}'} /&gt;</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Recently used section */}
      {recentIcons.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-joystix text-content-primary uppercase">Recently Used</h3>
          <div className="flex flex-wrap gap-3">
            {recentIcons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => handleCopyIcon(icon.name)}
                className="group relative flex flex-col items-center w-20 p-3 bg-surface-elevated border border-edge-primary/20 rounded-sm hover:border-edge-focus hover:bg-surface-tertiary transition-all"
                title={icon.name}
              >
                <div className="aspect-square w-full flex items-center justify-center">
                  <Icon name={icon.name} size={selectedSize} className="text-content-primary" />
                </div>
                <span className="mt-2 text-[10px] text-content-primary text-center w-full truncate">
                  {icon.name}
                </span>
                {copiedIcon === icon.name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-success/90 rounded-sm">
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
          <p className="text-content-primary text-center py-8">No icons found matching &ldquo;{searchQuery}&rdquo;</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filteredIcons.map((icon) => (
              <button
                key={icon.name}
                onClick={() => handleCopyIcon(icon.name)}
                className="group relative flex flex-col items-center w-20 p-3 bg-surface-elevated border border-edge-primary/20 rounded-sm hover:border-edge-focus hover:bg-surface-tertiary transition-all"
                title={icon.name}
              >
                <div className="aspect-square w-full flex items-center justify-center">
                  <Icon name={icon.name} size={selectedSize} className="text-content-primary" />
                </div>
                <span className="mt-2 text-[10px] text-content-primary text-center w-full truncate">
                  {icon.name}
                </span>
                {copiedIcon === icon.name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-success/90 rounded-sm">
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
