import React from 'react';
import { useDevToolsStore } from './store';
import type { Tab } from './types';

/**
 * DevToolsPanel - The main DevTools UI panel
 *
 * This is a placeholder implementation. The full DevTools panel
 * includes tabs for Variables, Typography, Components, and Assets.
 */
export function DevToolsPanel() {
  const { panelWidth, activeTab, setActiveTab, setIsOpen, isPreviewMode, setPreviewMode, previewChanges, clearPreviewChanges } = useDevToolsStore();

  const tabs: Tab[] = ['variables', 'typography', 'components', 'assets'];

  return (
    <div
      className="fixed top-0 right-0 h-full bg-surface-primary border-l border-edge-primary shadow-panel-left z-50 flex flex-col"
      style={{ width: panelWidth }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge-primary">
        <h2 className="font-joystix text-xs uppercase">RadFlow</h2>
        <button onClick={() => setIsOpen(false)} className="text-content-primary/50 hover:text-content-primary" aria-label="Close">
          ×
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-edge-primary">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 px-3 py-2 font-joystix text-2xs uppercase
              ${activeTab === tab ? 'bg-surface-tertiary text-content-primary' : 'text-content-primary/50 hover:text-content-primary'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Preview Mode Toggle */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-edge-primary bg-surface-primary/50">
        <span className="font-joystix text-2xs uppercase text-content-primary/70">Preview Mode</span>
        <button
          onClick={() => setPreviewMode(!isPreviewMode)}
          className={`
            px-2 py-1 font-joystix text-2xs uppercase rounded-sm border
            ${isPreviewMode ? 'bg-surface-tertiary border-edge-primary' : 'bg-transparent border-edge-primary/50'}
          `}
        >
          {isPreviewMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Tab Content Placeholder */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="font-mondwest text-sm text-content-primary/50">
          {activeTab === 'variables' && 'Edit CSS variables and design tokens here.'}
          {activeTab === 'typography' && 'Manage typography styles and fonts here.'}
          {activeTab === 'components' && 'Browse and preview components here.'}
          {activeTab === 'assets' && 'Manage icons, images, and assets here.'}
        </p>

        {/* Preview Changes Summary */}
        {previewChanges.length > 0 && (
          <div className="mt-4 p-3 bg-surface-secondary/10 rounded-sm border border-edge-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-joystix text-2xs uppercase text-content-primary/70">{previewChanges.length} pending changes</span>
              <button onClick={clearPreviewChanges} className="font-joystix text-2xs uppercase text-content-error hover:underline">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-edge-primary bg-surface-primary/50">
        <p className="font-mondwest text-2xs text-content-primary/50">⌘+Shift+K to toggle panel</p>
      </div>
    </div>
  );
}

export default DevToolsPanel;
