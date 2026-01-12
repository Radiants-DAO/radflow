'use client';

import { useEffect } from 'react';
import { useDevToolsStore } from '../store';
import { helpRegistry } from '../lib/helpRegistry';

export function HelpMode() {
  const {
    isHelpActive,
    activeTab,
    isComponentIdActive,
    isTextEditActive,
    toggleHelpMode,
  } = useDevToolsStore();

  useEffect(() => {
    if (!isHelpActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isHelpActive) {
        toggleHelpMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHelpActive, toggleHelpMode]);

  if (!isHelpActive) return null;

  // Determine which help item to show based on active state
  let helpId = '';
  if (isComponentIdActive) {
    helpId = 'tool-component-id';
  } else if (isTextEditActive) {
    helpId = 'tool-text-edit';
  } else if (isHelpActive) {
    // Show help for the active tab
    helpId = `tab-${activeTab}`;
  }

  const helpItem = helpRegistry[helpId];
  if (!helpItem) return null;

  return (
    <div className="w-full bg-surface-secondary border-b border-edge-primary px-4 py-2 flex items-center justify-between">
      {/* Left: Help content */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-content-inverted font-joystix text-[10px] uppercase">?</span>
          <h3 className="font-joystix text-xs uppercase text-content-inverted font-bold">
            {helpItem.title}
          </h3>
        </div>
        <span className="text-content-inverted/60">—</span>
        <p className="text-content-inverted/90 text-sm font-mondwest">
          {helpItem.description}
        </p>
      </div>

      {/* Right: Exit hint */}
      <div className="text-content-inverted/60 text-xs font-mondwest">
        Press <span className="text-content-inverted font-mono">ESC</span> to exit
      </div>
    </div>
  );
}
