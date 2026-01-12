'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy, ComponentType } from 'react';
import { useToast, Spinner } from '@radflow/ui';
import { UITab as DefaultUITab } from './UITab';
import { DynamicFolderTab } from './DynamicFolderTab';
import { AddTabButton } from './AddTabButton';
import { COMPONENT_TABS, type ComponentTabConfig } from './tabConfig';
import { ComponentsSecondaryNav } from '../../components/ComponentsSecondaryNav';
import { useDevToolsStore } from '../../store';

// Theme-specific preview components by folder (lazy loaded)
// Format: { [themeId]: { [folderName]: LazyComponent } }
const themePreviewsByFolder: Record<string, Record<string, React.LazyExoticComponent<ComponentType<object>>>> = {
  phase: {
    core: lazy(() => import('@radflow/theme-phase/preview/core')),
  },
  // Default RadOS theme uses the built-in UITab for 'ui' folder
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

const STORAGE_KEY = 'devtools-dynamic-component-tabs';

/**
 * Load dynamic tabs from localStorage
 */
function loadDynamicTabs(): ComponentTabConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save dynamic tabs to localStorage
 */
function saveDynamicTabs(tabs: ComponentTabConfig[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  } catch {
    // Ignore storage errors
  }
}

interface ComponentsTabProps {
  activeSubTab?: string;
  onTabsChange?: (tabs: Array<{ id: string; label: string }>) => void;
  onAddFolder?: (folderName: string) => void;
  componentTabs?: Array<{ id: string; label: string }>;
  onComponentSubTabChange?: (tab: string) => void;
}

export function ComponentsTab({
  activeSubTab = 'ui',
  onTabsChange,
  onAddFolder,
  componentTabs = [],
  onComponentSubTabChange,
}: ComponentsTabProps) {
  const [dynamicTabs, setDynamicTabs] = useState<ComponentTabConfig[]>([]);
  const { addToast } = useToast();
  const activeTheme = useDevToolsStore((state) => state.activeTheme);

  // Load dynamic tabs on mount and auto-discover folders
  useEffect(() => {
    const loadTabs = async () => {
      // First, load saved tabs from localStorage
      const savedTabs = loadDynamicTabs();

      // Then, fetch available folders from API
      try {
        const response = await fetch('/api/devtools/components/folders');
        if (response.ok) {
          const data = await response.json();
          const discoveredFolders = data.folders || [];

          // Create tabs for discovered folders that don't already exist
          const existingFolderIds = new Set(savedTabs.map(tab => tab.id));
          const newTabs: ComponentTabConfig[] = discoveredFolders
            .filter((folder: string) => !existingFolderIds.has(`folder-${folder}`))
            .map((folder: string) => ({
              id: `folder-${folder}`,
              label: folder,
              description: `Components from /components/${folder}/`,
            }));

          // Merge saved tabs with newly discovered tabs
          const allDiscoveredTabs = [...savedTabs, ...newTabs];
          setDynamicTabs(allDiscoveredTabs);

          // Save the updated tabs list
          if (newTabs.length > 0) {
            saveDynamicTabs(allDiscoveredTabs);
          }
        } else {
          // If API fails, just use saved tabs
          setDynamicTabs(savedTabs);
        }
      } catch (error) {
        // If fetch fails, just use saved tabs
        console.warn('Failed to auto-discover folders:', error);
        setDynamicTabs(savedTabs);
      }
    };

    loadTabs();
  }, []);

  // Memoize allTabs to prevent unnecessary re-renders
  const allTabs = useMemo(() => [...COMPONENT_TABS, ...dynamicTabs], [dynamicTabs]);
  
  // Memoize the mapped tabs array to prevent unnecessary effect runs
  const tabsForParent = useMemo(
    () => allTabs.map((tab) => ({ id: tab.id, label: tab.label })),
    [allTabs]
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
    if (dynamicTabs.some((tab) => tab.id === `folder-${folderName}`)) {
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
        id: `folder-${folderName}`,
        label: folderName,
        description: `Components from /components/${folderName}/`,
      };

      const updatedTabs = [...dynamicTabs, newTab];
      setDynamicTabs(updatedTabs);
      saveDynamicTabs(updatedTabs);
    } catch (error) {
      console.error('Failed to create folder:', error);
      addToast({
        title: 'Failed to create folder',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'error',
      });
    }
  }, [dynamicTabs, addToast]);

  // Expose handleAddFolder for footer access
  useEffect(() => {
    const windowWithHandler = window as Window & { __componentsTabAddFolder?: (folderName: string) => Promise<void> };
    windowWithHandler.__componentsTabAddFolder = handleAddFolder;
    return () => {
      delete windowWithHandler.__componentsTabAddFolder;
    };
  }, [handleAddFolder]);

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
        {allTabs.map((tab: ComponentTabConfig) => {
          // UI tab (default RadFlow UI preview)
          if (tab.id === 'ui' && activeSubTab === 'ui') {
            // Check if active theme has a 'core' preview (Phase theme uses 'core' instead of 'ui')
            const themePreview = getThemePreviewForFolder(activeTheme, 'core');
            if (themePreview) {
              const ThemePreviewComponent = themePreview;
              return (
                <Suspense key={`ui-${activeTheme}`} fallback={<PreviewLoadingFallback />}>
                  <ThemePreviewComponent />
                </Suspense>
              );
            }
            // Fall back to default UITab
            return <DefaultUITab key={tab.id} />;
          }

          // Dynamic folder tabs
          if (tab.id.startsWith('folder-') && activeSubTab === tab.id) {
            const folderName = tab.id.replace('folder-', '');

            // Check if active theme has a preview for this folder
            const themePreview = getThemePreviewForFolder(activeTheme, folderName);
            if (themePreview) {
              const ThemePreviewComponent = themePreview;
              return (
                <Suspense key={`${tab.id}-${activeTheme}`} fallback={<PreviewLoadingFallback />}>
                  <ThemePreviewComponent />
                </Suspense>
              );
            }

            // Fall back to dynamic folder component list
            return <DynamicFolderTab key={tab.id} folderName={folderName} />;
          }

          return null;
        })}
      </div>
    </div>
  );
}
