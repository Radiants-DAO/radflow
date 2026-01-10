'use client';

import { useDevToolsStore } from '../../store';
import { useToast } from '@radflow/ui/Toast';
import type { BaseColor } from '../../types';

export function ColorDisplay() {
  const { baseColors } = useDevToolsStore();
  const { addToast } = useToast();

  const brandColors = baseColors.filter((c) => c.category === 'brand');
  const neutralColors = baseColors.filter((c) => c.category === 'neutral');
  const systemColors = baseColors.filter((c) => c.category === 'system');

  const copyToClipboard = (text: string, description?: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast({ title: 'Copied', description: description || text, variant: 'success' });
    }).catch(() => {
      addToast({ title: 'Failed to copy', description: 'Unable to copy to clipboard', variant: 'error' });
    });
  };

  const Section = ({ title, colors }: { title: string; colors: BaseColor[] }) => (
    <div className="space-y-2">
      <h4>{title}</h4>
      <div className="space-y-1">
        {colors.map((color) => (
          <div
            key={color.id}
            className="flex items-center gap-3 p-2 rounded-sm hover:bg-content-primary/5 cursor-pointer"
            onClick={() => copyToClipboard(color.value)}
            title="Click to copy hex value"
          >
            <div
              className="w-6 h-6 rounded-xs border border-edge-primary flex-shrink-0"
              style={{ backgroundColor: color.value }}
            />
            <span className="flex-1 min-w-0 font-mondwest text-base text-content-primary truncate">
              {color.displayName}
            </span>
            <code 
              className="text-sm bg-surface-tertiary text-content-primary uppercase flex-shrink-0 px-2 py-0.5 rounded-sm"
              style={{ fontFamily: 'PixelCode' }}
            >
              {color.value}
            </code>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {brandColors.length > 0 && <Section title="Brand Colors" colors={brandColors} />}
      {neutralColors.length > 0 && <Section title="Neutrals" colors={neutralColors} />}
      {systemColors.length > 0 && <Section title="System Colors" colors={systemColors} />}
      
      <p className="text-sm text-content-primary/60">
        Edit colors directly in <code className="bg-surface-tertiary text-content-primary px-1 py-0.5 rounded-sm" style={{ fontFamily: 'PixelCode' }}>globals.css</code> → <code className="bg-surface-tertiary text-content-primary px-1 py-0.5 rounded-sm" style={{ fontFamily: 'PixelCode' }}>@theme</code> block.
      </p>
    </div>
  );
}
