'use client';

import { useState, useEffect } from 'react';
import { useDevToolsStore } from './store';
import type { Tab, Tool } from './types';

// Spotlight CSS for navigation highlighting
const spotlightStyles = `
  [data-radtools-panel].spotlight-active [data-subsection-id],
  [data-radtools-panel].spotlight-active [id^="typography-"] {
    opacity: 0.25;
    transition: opacity 0.3s ease;
  }
  [data-radtools-panel].spotlight-active [data-spotlight-target] {
    opacity: 1 !important;
    outline: 2px solid var(--color-brand-primary);
    outline-offset: 4px;
    border-radius: 4px;
  }
  [data-radtools-panel].spotlight-fading [data-subsection-id],
  [data-radtools-panel].spotlight-fading [id^="typography-"] {
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  [data-radtools-panel].spotlight-fading [data-spotlight-target] {
    outline-color: transparent;
    transition: outline-color 0.3s ease, opacity 0.5s ease;
  }
`;

// Import UI components
import { TopBar } from './components/TopBar';
import { SearchInput } from './components/SearchInput';
import { LeftRail } from './components/LeftRail';
import { ResizeHandle } from './components/ResizeHandle';
import { SettingsPanel } from './components/SettingsPanel';
import { HelpMode } from './components/HelpMode';
import { Button } from '@radflow/ui';

// Import actual tab components
import { VariablesTab } from './tabs/VariablesTab';
import { TypographyTab } from './tabs/TypographyTab';
import { ComponentsTab } from './tabs/ComponentsTab';
import { AssetsTab } from './tabs/AssetsTab';
import { AITab } from './tabs/AITab';
import { MockStatesTab } from './tabs/MockStatesTab';

export function DevToolsPanel() {
  const {
    activeTab,
    setActiveTab,
    panelWidth,
    setPanelWidth,
    togglePanel,
    isTextEditActive,
    isComponentIdActive,
    isHelpActive,
    isSearchOpen,
    toggleTextEditMode,
    toggleComponentIdMode,
    toggleHelpMode,
    setSearchOpen,
    isSettingsOpen,
    openSettings,
    closeSettings,
    searchQuery,
    pendingSubTab,
    setPendingSubTab,
  } = useDevToolsStore();

  // Footer state
  const [componentSubTab, setComponentSubTab] = useState<string>('core');
  const [componentTabs, setComponentTabs] = useState<Array<{ id: string; label: string }>>([]);

  // Handle pending sub-tab navigation from search
  useEffect(() => {
    if (pendingSubTab && activeTab === 'components') {
      setComponentSubTab(pendingSubTab);
      setPendingSubTab(null);
    }
  }, [pendingSubTab, activeTab, setPendingSubTab]);

  // Determine active tool
  function getActiveTool(): Tool | null {
    if (isSearchOpen) return 'search';
    if (isComponentIdActive) return 'componentId';
    if (isTextEditActive) return 'textEdit';
    if (isHelpActive) return 'help';
    return null;
  }
  const activeTool = getActiveTool();

  function handleToolToggle(tool: Tool): void {
    switch (tool) {
      case 'search':
        setSearchOpen(!isSearchOpen);
        break;
      case 'componentId':
        toggleComponentIdMode();
        break;
      case 'textEdit':
        toggleTextEditMode();
        break;
      case 'help':
        toggleHelpMode();
        break;
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as Tab);
  };

  // Panel always docked on right
  const getPositionClasses = () => {
    return 'top-0 right-0 h-screen';
  };

  const getPositionStyles = (): React.CSSProperties => {
    return {
      backgroundColor: 'var(--color-surface-primary)',
      width: `${panelWidth}px`,
      borderLeft: '1px solid var(--color-edge-primary)',
    };
  };

  return (
    <div
      data-radtools-panel
      className={`fixed flex flex-col z-[40] ${getPositionClasses()}`}
      style={getPositionStyles()}
    >
      {/* Spotlight styles for navigation */}
      <style dangerouslySetInnerHTML={{ __html: spotlightStyles }} />

      {/* TopBar and Search - spans full width above LeftRail */}
      <div className="p-2 pb-2 flex items-center gap-2">
        <div className="relative h-fit bg-surface-elevated border border-edge-primary rounded-sm p-0 flex items-center w-fit overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            iconName="close"
            onClick={togglePanel}
            title="Close (⌘⇧K)"
            className="!rounded-none"
          />
        </div>
        <SearchInput panelWidth={panelWidth} />
        <div className="flex-1">
          <TopBar
            onSettingsClick={openSettings}
          />
        </div>
      </div>

      {/* Bottom section: ResizeHandle, LeftRail, and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Resize Handle - left side of right-docked panel */}
        <ResizeHandle
          onResize={setPanelWidth}
          minWidth={300}
          maxWidth={typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1200}
        />

        {/* Left Rail */}
        <LeftRail
          activeTab={activeTab}
          activeTool={activeTool}
          onTabChange={handleTabChange}
          onToolToggle={handleToolToggle}
          onSettingsClick={openSettings}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* Help Mode Info Bar */}
            <HelpMode />

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'variables' && (
                <div className="h-full pr-2 pl-2 pb-2 rounded">
                  <VariablesTab />
                </div>
              )}
              {activeTab === 'typography' && (
                <div className="h-full pr-2 pl-2 pb-2 rounded">
                  <TypographyTab searchQuery={searchQuery} />
                </div>
              )}
              {activeTab === 'components' && (
                <div className="h-full pr-2 pl-2 pb-2 rounded">
                  <ComponentsTab
                    activeSubTab={componentSubTab}
                    onTabsChange={setComponentTabs}
                    componentTabs={componentTabs}
                    onComponentSubTabChange={setComponentSubTab}
                    onAddFolder={async (folderName) => {
                      // Trigger folder creation via ComponentsTab's exposed handler
                      const windowWithHandler = window as Window & { __componentsTabAddFolder?: (name: string) => void };
                      if (windowWithHandler.__componentsTabAddFolder) {
                        windowWithHandler.__componentsTabAddFolder(folderName);
                        // Switch to the new tab
                        setComponentSubTab(`folder-${folderName}`);
                      }
                    }}
                  />
                </div>
              )}
              {activeTab === 'assets' && (
                <div className="h-full pr-2 pl-2 pb-2 rounded">
                  <AssetsTab />
                </div>
              )}
              {activeTab === 'ai' && (
                <div className="h-full pr-2 pl-2 pb-2 rounded">
                  <AITab />
                </div>
              )}
              {activeTab === 'mockStates' && (
                <div className="h-full pr-2 pl-2 pb-2 rounded">
                  <MockStatesTab />
                </div>
              )}
            </div>
          </div>
      </div>


      {/* Settings Panel */}
      <SettingsPanel open={isSettingsOpen} onClose={closeSettings} />
    </div>
  );
}
