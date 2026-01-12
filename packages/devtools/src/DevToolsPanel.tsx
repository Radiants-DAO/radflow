'use client';

import { useState } from 'react';
import { useDevToolsStore } from './store';
import type { Tab, Tool } from './types';

// Import UI components
import { TopBar } from './components/TopBar';
import { LeftRail } from './components/LeftRail';
import { ResizeHandle } from './components/ResizeHandle';
import { SettingsPanel } from './components/SettingsPanel';
import { HelpMode } from './components/HelpMode';

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
    isFullscreen,
    toggleFullscreen,
    isMinimized,
    isTextEditActive,
    isComponentIdActive,
    isHelpActive,
    toggleTextEditMode,
    toggleComponentIdMode,
    toggleHelpMode,
    isSettingsOpen,
    openSettings,
    closeSettings,
    searchQuery,
  } = useDevToolsStore();

  // Footer state
  const [componentSubTab, setComponentSubTab] = useState<string>('design-system');
  const [componentTabs, setComponentTabs] = useState<Array<{ id: string; label: string }>>([]);

  // Determine active tool
  const activeTool: Tool | null = 
    isComponentIdActive ? 'componentId' :
    isTextEditActive ? 'textEdit' :
    isHelpActive ? 'help' :
    null;

  const handleToolToggle = (tool: Tool) => {
    if (tool === 'componentId') toggleComponentIdMode();
    else if (tool === 'textEdit') toggleTextEditMode();
    else if (tool === 'help') toggleHelpMode();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as Tab);
  };

  // Panel always docked on right
  const getPositionClasses = () => {
    if (isFullscreen) return 'inset-0';
    return 'top-0 right-0 h-screen';
  };

  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      background: 'linear-gradient(0deg, var(--color-surface-tertiary) 0%, var(--color-surface-primary) 100%)',
    };

    if (isFullscreen) {
      return { ...base, width: '100%' };
    }

    // Minimized panel: only LeftRail width (60px)
    if (isMinimized) {
      return {
        ...base,
        width: '60px',
        borderLeft: '1px solid var(--color-edge-primary)',
      };
    }

    // Expanded panel: user-defined width (right-docked)
    return {
      ...base,
      width: `${panelWidth}px`,
      borderLeft: '1px solid var(--color-edge-primary)',
    };
  };

  return (
    <div
      data-radtools-panel
      className={`fixed flex z-[40] ${getPositionClasses()}`}
      style={getPositionStyles()}
    >
      {/* Resize Handle - left side of right-docked panel (hidden when minimized) */}
      {!isFullscreen && !isMinimized && (
        <ResizeHandle
          onResize={setPanelWidth}
          minWidth={300}
          maxWidth={typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1200}
        />
      )}

      {/* Left Rail */}
      <LeftRail
        activeTab={activeTab}
        activeTool={activeTool}
        onTabChange={handleTabChange}
        onToolToggle={handleToolToggle}
        onSettingsClick={openSettings}
      />

      {/* Main Content - hidden when minimized */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <TopBar
          title="RADTOOLS"
          onClose={togglePanel}
          onFullscreen={toggleFullscreen}
          showCloseButton={true}
          showFullscreenButton={true}
          onSettingsClick={openSettings}
        />

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
      )}


      {/* Settings Panel */}
      <SettingsPanel open={isSettingsOpen} onClose={closeSettings} />
    </div>
  );
}
