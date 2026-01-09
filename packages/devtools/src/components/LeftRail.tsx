'use client';

import { Button, Tooltip } from '@radflow/ui';
import type { Tab, Tool } from '../types';

interface LeftRailProps {
  activeTab: Tab;
  activeTool: Tool | null;
  onTabChange: (tab: Tab) => void;
  onToolToggle: (tool: Tool) => void;
}

const TOOLS: Array<{ id: Tool; icon: string; label: string; shortcut: string }> = [
  { id: 'componentId', icon: 'cursor-text', label: 'Component ID', shortcut: '⌘⇧I' },
  { id: 'textEdit', icon: 'pencil', label: 'Text Edit', shortcut: '⌘⇧T' },
  { id: 'help', icon: 'question', label: 'Help', shortcut: '⌘⇧?' },
];

const TABS: Array<{ id: Tab; icon: string; label: string; shortcut: string }> = [
  { id: 'variables', icon: 'volume-faders', label: 'Variables', shortcut: '1' },
  { id: 'typography', icon: 'cursor-text', label: 'Typography', shortcut: '2' },
  { id: 'components', icon: 'code-window', label: 'Components', shortcut: '3' },
  { id: 'assets', icon: 'multiple-images', label: 'Assets', shortcut: '4' },
  { id: 'mockStates', icon: 'settings-cog', label: 'Mock States', shortcut: '5' },
];

export function LeftRail({ activeTab, activeTool, onTabChange, onToolToggle }: LeftRailProps) {
  return (
    <div className="flex flex-col items-center bg-surface-secondary/5 border-r border-edge-primary/10 py-2 px-1">
      {/* Tools Section */}
      <div className="flex flex-col gap-1 mb-2">
        {TOOLS.map((tool) => (
          <Tooltip
            key={tool.id}
            content={`${tool.label} (${tool.shortcut})`}
            position="right"
            size="sm"
            delay={300}
          >
            <Button
              variant={activeTool === tool.id ? 'secondary' : 'ghost'}
              size="sm"
              iconOnly
              iconName={tool.icon}
              onClick={() => onToolToggle(tool.id)}
              data-help-id={`tool-${tool.id}`}
            />
          </Tooltip>
        ))}
      </div>

      {/* Divider */}
      <div className="w-6 h-px bg-surface-secondary/20 mb-2" />

      {/* Tabs Section */}
      <div className="flex flex-col gap-1">
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
              size="sm"
              iconOnly
              iconName={tab.icon}
              onClick={() => onTabChange(tab.id)}
              data-help-id={`tab-${tab.id}`}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
