'use client';

import Draggable from 'react-draggable';
import { useRef } from 'react';
import { useDevToolsStore } from './store';
import type { Tab } from './types';

// Import actual tab components
import { VariablesTab } from './tabs/VariablesTab';
import { ComponentsTab } from './tabs/ComponentsTab';
import { AssetsTab } from './tabs/AssetsTab';
import { CommentsTab } from './tabs/CommentsTab';
import { MockStatesTab } from './tabs/MockStatesTab';
import { ChangelogTab } from './tabs/ChangelogTab';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'variables', label: 'Variables', icon: '🎨' },
  { id: 'components', label: 'Components', icon: '📦' },
  { id: 'assets', label: 'Assets', icon: '🖼️' },
  { id: 'comments', label: 'Comments', icon: '💬' },
  { id: 'mockStates', label: 'Mock States', icon: '🔧' },
  { id: 'changelog', label: 'Changelog', icon: '📝' },
];

export function DevToolsPanel() {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { 
    activeTab, 
    setActiveTab, 
    panelPosition, 
    setPanelPosition, 
    togglePanel 
  } = useDevToolsStore();

  const handleDragStop = (_: unknown, data: { x: number; y: number }) => {
    setPanelPosition({ x: data.x, y: data.y });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'variables':
        return <VariablesTab />;
      case 'components':
        return <ComponentsTab />;
      case 'assets':
        return <AssetsTab />;
      case 'comments':
        return <CommentsTab />;
      case 'mockStates':
        return <MockStatesTab />;
      case 'changelog':
        return <ChangelogTab />;
      default:
        return null;
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      defaultPosition={panelPosition}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className="fixed z-[9999] w-[420px] max-h-[80vh] bg-panel border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{ top: 0, left: 0 }}
      >
        {/* Header */}
        <div className="drag-handle flex items-center justify-between px-4 py-3 bg-secondary cursor-move border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-sm font-semibold text-alternate tracking-wide">
              RadTools
            </h2>
          </div>
          <button
            onClick={togglePanel}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-panel-hover text-alternate transition-colors"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-panel overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors
                ${activeTab === tab.id 
                  ? 'bg-panel-active text-heading border-b-2 border-border-strong' 
                  : 'text-body hover:bg-panel-hover hover:text-heading'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-panel">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-panel border-t border-border">
          <p className="text-xs text-caption">
            Press <kbd className="px-1 py-0.5 bg-secondary text-alternate rounded text-xs">⇧⌘K</kbd> to toggle
          </p>
        </div>
      </div>
    </Draggable>
  );
}

