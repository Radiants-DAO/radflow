'use client';

import { useState } from 'react';
import { useDevToolsStore } from './store';
import type { Tab, Tool } from './types';

// Import UI components
import { PanelHeader } from './components/PanelHeader';
import { LeftRail } from './components/LeftRail';
import { ResizeHandle } from './components/ResizeHandle';
import { SettingsPanel } from './components/SettingsPanel';

// Import actual tab components
import { VariablesTab } from './tabs/VariablesTab';
import { TypographyTab } from './tabs/TypographyTab';
import { ComponentsTab } from './tabs/ComponentsTab';
import { AssetsTab } from './tabs/AssetsTab';
import { MockStatesTab } from './tabs/MockStatesTab';
import { ContextualFooter } from './components/ContextualFooter';

export function DevToolsPanel() {
  const {
    activeTab,
    setActiveTab,
    panelWidth,
    setPanelWidth,
    togglePanel,
    isFullscreen,
    toggleFullscreen,
    isTextEditActive,
    isComponentIdActive,
    isHelpActive,
    toggleTextEditMode,
    toggleComponentIdMode,
    toggleHelpMode,
    dockPosition,
    isSettingsOpen,
    openSettings,
    closeSettings,
  } = useDevToolsStore();

  // Footer state
  const [componentSubTab, setComponentSubTab] = useState<string>('design-system');
  const [typographySearchQuery, setTypographySearchQuery] = useState<string>('');
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

  // Determine panel position classes based on dock position
  const getPositionClasses = () => {
    if (isFullscreen) return 'inset-0';
    if (dockPosition === 'undocked') return 'top-4 left-1/2 -translate-x-1/2 h-[80vh] rounded-lg shadow-2xl';
    if (dockPosition === 'left') return 'top-0 left-0 h-screen';
    return 'top-0 right-0 h-screen'; // default: right
  };

  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      background: 'linear-gradient(0deg, var(--color-surface-tertiary) 0%, var(--color-surface-primary) 100%)',
    };
    
    if (isFullscreen) {
      return { ...base, width: '100%' };
    }
    
    if (dockPosition === 'undocked') {
      return {
        ...base,
        width: `${panelWidth}px`,
        border: '1px solid var(--color-edge-primary)',
      };
    }
    
    if (dockPosition === 'left') {
      return {
        ...base,
        width: `${panelWidth}px`,
        borderRight: '1px solid var(--color-edge-primary)',
      };
    }
    
    // right (default)
    return {
      ...base,
      width: `${panelWidth}px`,
      borderLeft: '1px solid var(--color-edge-primary)',
    };
  };

  // Resize handle position based on dock
  const resizeHandlePosition = dockPosition === 'left' ? 'right' : 'left';

  return (
    <div
      data-radtools-panel
      className={`fixed flex z-[40] ${getPositionClasses()}`}
      style={getPositionStyles()}
    >
      {/* Resize Handle - position based on dock side */}
      {!isFullscreen && resizeHandlePosition === 'left' && (
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <PanelHeader
          title="RADTOOLS"
          onClose={togglePanel}
          onFullscreen={toggleFullscreen}
          showCloseButton={true}
          showFullscreenButton={true}
          iconName="plug"
        />

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'variables' && (
            <div className="h-full pr-2 pl-2 pb-2 rounded">
              <VariablesTab />
            </div>
          )}
          {activeTab === 'typography' && (
            <div className="h-full pr-2 pl-2 pb-2 rounded">
              <TypographyTab searchQuery={typographySearchQuery} />
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
                if ((window as any).__componentsTabAddFolder) {
                  (window as any).__componentsTabAddFolder(folderName);
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
          {activeTab === 'mockStates' && (
            <div className="h-full pr-2 pl-2 pb-2 rounded">
              <MockStatesTab />
            </div>
          )}
        </div>

        {/* Contextual Footer */}
        <ContextualFooter
          activeTab={activeTab}
          onTabChange={handleTabChange}
          componentSubTab={componentSubTab}
          onComponentSubTabChange={setComponentSubTab}
          componentTabs={componentTabs}
          onAddComponentFolder={async (folderName) => {
            // Trigger folder creation via ComponentsTab's exposed handler
            if ((window as any).__componentsTabAddFolder) {
              (window as any).__componentsTabAddFolder(folderName);
              // Switch to the new tab
              setComponentSubTab(`folder-${folderName}`);
            }
          }}
          typographySearchQuery={typographySearchQuery}
          onTypographySearchChange={setTypographySearchQuery}
        />
      </div>

      {/* Resize Handle - for left dock, handle goes on the right edge */}
      {!isFullscreen && resizeHandlePosition === 'right' && (
        <ResizeHandle
          onResize={setPanelWidth}
          minWidth={300}
          maxWidth={typeof window !== 'undefined' ? window.innerWidth * 0.8 : 1200}
          position="right"
        />
      )}

      {/* Settings Panel */}
      <SettingsPanel open={isSettingsOpen} onClose={closeSettings} />
    </div>
  );
}
