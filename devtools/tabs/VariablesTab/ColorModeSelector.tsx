'use client';

import { useDevToolsStore } from '../../store';
import { useEffect } from 'react';

export function ColorModeSelector() {
  const { colorModes, activeColorMode, setActiveColorMode } = useDevToolsStore();

  // Apply color mode to document
  useEffect(() => {
    const html = document.documentElement;
    
    // Remove all color mode classes
    colorModes.forEach((mode) => {
      html.classList.remove(mode.name);
    });
    
    // Add active color mode class
    if (activeColorMode) {
      const activeMode = colorModes.find((m) => m.id === activeColorMode);
      if (activeMode) {
        html.classList.add(activeMode.name);
      }
    }
  }, [activeColorMode, colorModes]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-heading">Color Mode</h3>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveColorMode(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeColorMode === null
              ? 'bg-panel-active text-heading border-2 border-border-strong'
              : 'bg-panel-hover text-body border border-border hover:bg-panel-active'
          }`}
        >
          Default
        </button>
        
        {colorModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveColorMode(mode.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeColorMode === mode.id
                ? 'bg-panel-active text-heading border-2 border-border-strong'
                : 'bg-panel-hover text-body border border-border hover:bg-panel-active'
            }`}
          >
            {mode.name}
          </button>
        ))}
      </div>

      {activeColorMode && (
        <div className="p-3 bg-panel-hover rounded-lg">
          <h4 className="text-xs font-medium text-caption mb-2">Active Overrides</h4>
          <div className="space-y-1">
            {Object.entries(colorModes.find((m) => m.id === activeColorMode)?.overrides || {}).map(([token, ref]) => (
              <div key={token} className="flex items-center gap-2 text-xs">
                <span className="text-body font-mono">{token}</span>
                <span className="text-caption">→</span>
                <span className="text-caption font-mono">{ref}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

