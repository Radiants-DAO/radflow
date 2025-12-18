'use client';

import { useDevToolsStore } from '../../store';

const RADIUS_KEYS = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;

export function BorderRadiusEditor() {
  const { borderRadius, updateBorderRadius } = useDevToolsStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-heading">Border Radius</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {RADIUS_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-2 p-2 bg-panel-hover rounded-md">
            <div
              className="w-8 h-8 bg-tertiary border border-border-strong"
              style={{ borderRadius: borderRadius[key] || '0' }}
            />
            <div className="flex-1">
              <span className="text-xs font-mono text-body block">{key}</span>
              <input
                type="text"
                value={borderRadius[key] || ''}
                onChange={(e) => updateBorderRadius(key, e.target.value)}
                className="w-full px-1.5 py-0.5 text-xs font-mono bg-panel border border-border rounded text-body mt-0.5"
                placeholder="0.5rem"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

