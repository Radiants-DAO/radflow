'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy, ComponentType } from 'react';
import { useToast, Spinner } from '@radflow/ui';
import { DynamicFolderTab } from './DynamicFolderTab';
import { type ComponentTabConfig } from './tabConfig';
import { ComponentsSecondaryNav } from '../../components/ComponentsSecondaryNav';
import { useDevToolsStore } from '../../store';

// Theme-specific preview components by folder (lazy loaded)
// Format: { [themeId]: { [folderName]: LazyComponent } }
// Preview files are named to match their folder (preview/core.tsx for components/core/)
const themePreviewsByFolder: Record<string, Record<string, React.LazyExoticComponent<ComponentType<object>>>> = {
  'rad-os': {
    core: lazy(() => import('@radflow/theme-rad-os/preview/core')),
  },
  phase: {
    core: lazy(() => import('@radflow/theme-phase/preview/core')),
    landing: lazy(() => import('@radflow/theme-phase/preview/landing')),
  },
};

// Loading fallback for theme previews
function PreviewLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size={24} />
    </div>
  );
}

/**
 * Get the preview component for a folder in a specific theme
 */
function getThemePreviewForFolder(
  themeId: string | undefined,
  folderName: string
): React.LazyExoticComponent<ComponentType<object>> | null {
  if (!themeId) return null;
  const themePreviews = themePreviewsByFolder[themeId];
  if (!themePreviews) return null;
  return themePreviews[folderName] || null;
}

interface ComponentsTabProps {
  activeSubTab?: string;
  onTabsChange?: (tabs: Array<{ id: string; label: string }>) => void;
  onAddFolder?: (folderName: string) => void;
  componentTabs?: Array<{ id: string; label: string }>;
  onComponentSubTabChange?: (tab: string) => void;
}

export function ComponentsTab({
  activeSubTab = 'core',
  onTabsChange,
  onAddFolder,
  componentTabs = [],
  onComponentSubTabChange,
}: ComponentsTabProps) {
  const [folderTabs, setFolderTabs] = useState<ComponentTabConfig[]>([]);
  const { addToast } = useToast();
  const activeTheme = useDevToolsStore((state) => state.activeTheme);

  // Auto-discover folders from API on mount
  useEffect(() => {
    const discoverFolders = async () => {
      try {
        const response = await fetch('/api/devtools/components/folders');
        if (response.ok) {
          const data = await response.json();
          const folders: string[] = data.folders || [];

          // Create tabs from discovered folders
          // Tab ID = folder name (e.g., 'core', 'forms')
          const tabs: ComponentTabConfig[] = folders.map((folder) => ({
            id: folder,
            label: folder.charAt(0).toUpperCase() + folder.slice(1), // Capitalize
            description: `Components from /components/${folder}/`,
          }));

          setFolderTabs(tabs);
        }
      } catch (error) {
        console.warn('Failed to discover component folders:', error);
      }
    };

    discoverFolders();
  }, []);

  // Memoize tabs for parent
  const tabsForParent = useMemo(
    () => folderTabs.map((tab) => ({ id: tab.id, label: tab.label })),
    [folderTabs]
  );

  // Notify parent of tabs change
  useEffect(() => {
    if (onTabsChange) {
      onTabsChange(tabsForParent);
    }
  }, [tabsForParent, onTabsChange]);

  const handleAddFolder = useCallback(async (folderName: string) => {
    // Validate folder name
    if (!folderName || !/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      addToast({
        title: 'Invalid folder name',
        description: 'Folder name must contain only letters, numbers, underscores, or hyphens',
        variant: 'warning',
      });
      return;
    }

    // Check if folder already exists
    if (folderTabs.some((tab) => tab.id === folderName)) {
      addToast({
        title: 'Folder exists',
        description: 'A tab for this folder already exists',
        variant: 'warning',
      });
      return;
    }

    try {
      // Create folder via API
      const response = await fetch('/api/devtools/components/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create folder');
      }

      // Add new tab
      const newTab: ComponentTabConfig = {
        id: folderName,
        label: folderName.charAt(0).toUpperCase() + folderName.slice(1),
        description: `Components from /components/${folderName}/`,
      };

      setFolderTabs((prev) => [...prev, newTab]);
    } catch (error) {
      console.error('Failed to create folder:', error);
      addToast({
        title: 'Failed to create folder',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'error',
      });
    }
  }, [folderTabs, addToast]);

  // Expose handleAddFolder for footer access
  useEffect(() => {
    const windowWithHandler = window as Window & { __componentsTabAddFolder?: (folderName: string) => Promise<void> };
    windowWithHandler.__componentsTabAddFolder = handleAddFolder;
    return () => {
      delete windowWithHandler.__componentsTabAddFolder;
    };
  }, [handleAddFolder]);

  // Get the currently active tab
  const activeTab = folderTabs.find((tab) => tab.id === activeSubTab);

  return (
    <div className="flex flex-col h-full">
      {/* Header with sub-tabs */}
      <div className="flex-shrink-0">
        <div className="pb-0">
          <ComponentsSecondaryNav
            activeSubTab={activeSubTab}
            onSubTabChange={(tabId) => {
              if (onComponentSubTabChange) {
                onComponentSubTabChange(tabId);
              }
            }}
            tabs={componentTabs.length > 0 ? componentTabs : tabsForParent}
            onAddFolder={onAddFolder || (() => {})}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col h-full overflow-auto pt-6 pb-4 pl-4 pr-2 bg-surface-elevated border border-edge-primary rounded space-y-4">
        {activeTab ? (
          (() => {
            const folderName = activeTab.id;
            const themePreview = getThemePreviewForFolder(activeTheme, folderName);

            if (themePreview) {
              const ThemePreviewComponent = themePreview;
              return (
                <Suspense key={`${folderName}-${activeTheme}`} fallback={<PreviewLoadingFallback />}>
                  <ThemePreviewComponent />
                </Suspense>
              );
            }

            // No preview file - show dynamic component list
            return <DynamicFolderTab key={folderName} folderName={folderName} />;
          })()
        ) : (
          <div className="text-center py-8 text-content-primary/60 font-mondwest">
            {folderTabs.length === 0
              ? 'No component folders discovered'
              : 'Select a tab to view components'}
          </div>
        )}
      </div>
    </div>
  );
}
