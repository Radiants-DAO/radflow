'use client';

import { useDevToolsStore } from '../../store';
import { useToast } from '@radflow/ui/Toast';
import type { BaseColor } from '../../types';

interface SectionProps {
  title: string;
  colors: BaseColor[];
  onCopy: (text: string) => void;
}

function Section({ title, colors, onCopy }: SectionProps) {
  return (
    <div className="space-y-2">
      <h4>{title}</h4>
      <div className="space-y-1">
        {colors.map((color) => (
          <div
            key={color.id}
            className="flex items-center gap-3 p-2 rounded-sm hover:bg-content-primary/5 cursor-pointer"
            onClick={() => onCopy(color.value)}
            title="Click to copy hex value"
          >
            <div
              className="w-6 h-6 rounded-xs border border-edge-primary flex-shrink-0"
              style={{ backgroundColor: color.value }}
            />
            <span className="flex-1 min-w-0 font-mondwest text-base text-content-primary truncate">
              {color.displayName}
            </span>
            <code className="uppercase flex-shrink-0" style={{ backgroundColor: 'unset', background: 'unset', backgroundImage: 'none' }}>
              {color.value}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  return (
    <div className="space-y-6">
      {brandColors.length > 0 && <Section title="Brand Colors" colors={brandColors} onCopy={copyToClipboard} />}
      {neutralColors.length > 0 && <Section title="Neutrals" colors={neutralColors} onCopy={copyToClipboard} />}
      {systemColors.length > 0 && <Section title="System Colors" colors={systemColors} onCopy={copyToClipboard} />}

      <p className="text-sm text-content-primary/60">
        Edit colors directly in <code>globals.css</code> → <code>@theme</code> block.
      </p>
    </div>
  );
}
