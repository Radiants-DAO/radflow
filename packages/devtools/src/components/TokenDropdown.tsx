'use client';

import { useDevToolsStore } from '../store';

interface TokenDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function TokenDropdown({ value, onChange, label }: TokenDropdownProps) {
  const baseColors = useDevToolsStore((state) => state.baseColors);

  return (
    <div className="flex items-center gap-2">
      {label && (
        <label className="font-joystix text-xs uppercase text-content-primary/60 min-w-[60px]">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1.5 font-mondwest text-base bg-surface-primary border border-edge-primary rounded-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-tertiary cursor-pointer"
      >
        <option value="">Select a color...</option>
        <optgroup label="Brand Colors">
          {baseColors
            .filter((c) => c.category === 'brand')
            .map((color) => (
              <option key={color.id} value={`--brand-${color.name}`}>
                {color.name} ({color.value})
              </option>
            ))}
        </optgroup>
        <optgroup label="Neutral Colors">
          {baseColors
            .filter((c) => c.category === 'neutral')
            .map((color) => (
              <option key={color.id} value={`--neutral-${color.name}`}>
                {color.name} ({color.value})
              </option>
            ))}
        </optgroup>
      </select>
    </div>
  );
}

