'use client';

import { useDevToolsStore } from '../../store';
import { useToast } from '@radflow/ui/Toast';

const RADIUS_KEYS = ['none', 'xs', 'sm', 'md', 'lg', 'full'] as const;

const RADIUS_DISPLAY_NAMES: Record<string, string> = {
  'none': 'None',
  'xs': 'Extra Small',
  'sm': 'Small',
  'md': 'Medium',
  'lg': 'Large',
  'full': 'Full',
};

export function BorderRadiusDisplay() {
  const { borderRadius } = useDevToolsStore();
  const { addToast } = useToast();

  const copyToClipboard = (text: string, description?: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast({ title: 'Copied', description: description || text, variant: 'success' });
    }).catch(() => {
      addToast({ title: 'Failed to copy', description: 'Unable to copy to clipboard', variant: 'error' });
    });
  };

  return (
    <div className="space-y-3">
      <h4>Border Radius</h4>
      
      <div className="space-y-1">
        {RADIUS_KEYS.map((key) => {
          const radiusValue = borderRadius[key] || '0';
          return (
            <div
              key={key}
              className="flex items-center gap-3 p-2 rounded-sm hover:bg-content-primary/5 cursor-pointer"
              onClick={() => copyToClipboard(`--radius-${key}`)}
              title="Click to copy CSS variable"
            >
              <div
                className="w-6 h-6 bg-surface-tertiary border border-edge-primary flex-shrink-0"
                style={{ borderRadius: radiusValue }}
              />
              <span className="flex-1 min-w-0 font-mondwest text-base text-content-primary truncate">
                {RADIUS_DISPLAY_NAMES[key] || key}
              </span>
              <code 
                className="text-sm bg-surface-tertiary text-content-primary flex-shrink-0 px-2 py-0.5 rounded-sm"
                style={{ fontFamily: 'PixelCode' }}
              >
                --radius-{key}
              </code>
            </div>
          );
        })}
      </div>
      
      <p className="text-sm text-content-primary/60">
        Edit radii directly in <code className="bg-surface-tertiary text-content-primary px-1 py-0.5 rounded-sm" style={{ fontFamily: 'PixelCode' }}>globals.css</code> → <code className="bg-surface-tertiary text-content-primary px-1 py-0.5 rounded-sm" style={{ fontFamily: 'PixelCode' }}>@theme</code> block.
      </p>
    </div>
  );
}
