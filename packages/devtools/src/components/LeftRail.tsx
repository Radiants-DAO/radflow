'use client';

import { Button, Divider, Tooltip } from '@radflow/ui';
import { useDevToolsStore } from '../store';
import type { Tab, Tool } from '../types';

interface LeftRailProps {
  activeTab: Tab;
  activeTool: Tool | null;
  onTabChange: (tab: Tab) => void;
  onToolToggle: (tool: Tool) => void;
  onSettingsClick: () => void;
}

const TOOLS: Array<{ id: Tool; icon: string; label: string; shortcut: string }> = [
  { id: 'search', icon: 'search', label: 'Search', shortcut: '⌘K' },
  { id: 'componentId', icon: 'crosshair1', label: 'Component ID', shortcut: '⌘⇧I' },
  { id: 'textEdit', icon: 'pencil', label: 'Text Edit', shortcut: '⌘⇧T' },
  { id: 'help', icon: 'question', label: 'Help', shortcut: '⌘⇧?' },
];

const TABS: Array<{ id: Tab; icon: string; label: string; shortcut: string }> = [
  { id: 'variables', icon: 'code-file', label: 'Variables', shortcut: '1' },
  { id: 'typography', icon: 'cursor-text', label: 'Typography', shortcut: '2' },
  { id: 'components', icon: 'code-window', label: 'Components', shortcut: '3' },
  { id: 'assets', icon: 'multiple-images', label: 'Assets', shortcut: '4' },
  { id: 'ai', icon: 'lightbulb', label: 'AI', shortcut: '5' },
  { id: 'mockStates', icon: 'settings-cog', label: 'Mock States', shortcut: '6' },
];

export function LeftRail({ activeTab, activeTool, onTabChange, onToolToggle, onSettingsClick }: LeftRailProps) {
  const { pendingChanges } = useDevToolsStore();
  const pendingChangeCount = pendingChanges.length;

  return (
    <div className="flex flex-col items-center py-2 px-0 h-full">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Tools Section */}
        <div className="flex flex-col gap-1 mb-2 bg-surface-elevated p-1 border border-edge-primary rounded-sm">
          {TOOLS.map((tool) => (
            <Tooltip
              key={tool.id}
              content={`${tool.label} (${tool.shortcut})`}
              position="right"
              size="sm"
              delay={300}
            >
              <div className="relative">
                <Button
                  variant={activeTool === tool.id ? 'secondary' : 'ghost'}
                  size="md"
                  iconOnly
                  iconName={tool.icon}
                  onClick={() => onToolToggle(tool.id)}
                  data-help-id={`tool-${tool.id}`}
                />
                {/* Badge for Text Edit mode showing pending change count */}
                {tool.id === 'textEdit' && pendingChangeCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-surface-tertiary text-content-primary text-[9px] font-joystix rounded-full border border-edge-primary">
                    {pendingChangeCount}
                  </div>
                )}
              </div>
            </Tooltip>
          ))}
        </div>

        {/* Divider */}
        <Divider orientation="horizontal" className="w-6 mb-2" />

        {/* Tabs Section */}
        <div className="flex flex-col gap-1 bg-surface-elevated p-1 border border-edge-primary rounded-sm">
          {TABS.map((tab) => (
            <Tooltip
              key={tab.id}
              content={`${tab.label} (${tab.shortcut})`}
              position="right"
              size="sm"
              delay={300}
            >
              <Button
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                size="md"
                iconOnly
                iconName={tab.icon}
                onClick={() => onTabChange(tab.id)}
                data-help-id={`tab-${tab.id}`}
              />
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings Button - Bottom */}
      <Tooltip
        content="Settings"
        position="right"
        size="sm"
        delay={300}
      >
        <Button
          variant="ghost"
          size="md"
          iconOnly
          iconName="settings-cog"
          onClick={onSettingsClick}
          data-help-id="settings-button"
        />
      </Tooltip>
    </div>
  );
}
