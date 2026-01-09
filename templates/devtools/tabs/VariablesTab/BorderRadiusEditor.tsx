'use client';

import { useDevToolsStore } from '../../store';

const RADIUS_KEYS = ['none', 'xs', 'sm', 'md', 'lg', 'full'] as const;

export function BorderRadiusEditor() {
  const { borderRadius, updateBorderRadius } = useDevToolsStore();

  return (
    <div className="space-y-3">
      <h3>Border Radius</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {RADIUS_KEYS.map((key) => (
          <div key={key} className="flex items-center gap-2 p-2 bg-black/10 rounded-sm">
            <div
              className="w-8 h-8 bg-sun-yellow border border-black"
              style={{ borderRadius: borderRadius[key] || '0' }}
            />
            <div className="flex-1">
              <span className="font-mondwest text-base font-mono text-black block">{key}</span>
              <input
                type="text"
                value={borderRadius[key] || ''}
                onChange={(e) => updateBorderRadius(key, e.target.value)}
                className="w-full px-1.5 py-0.5 font-mondwest text-base font-mono bg-warm-cloud border border-black rounded-sm text-black mt-0.5"
                placeholder="0.5rem"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

