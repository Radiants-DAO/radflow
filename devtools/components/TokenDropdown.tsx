'use client';

import { useDevToolsStore } from '../store';

interface TokenDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function TokenDropdown({ value, onChange, label }: TokenDropdownProps) {
  const brandColors = useDevToolsStore((state) => state.brandColors);

  return (
    <div className="flex items-center gap-2">
      {label && (
        <label className="text-xs text-caption min-w-[60px]">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body focus:outline-none focus:border-focus cursor-pointer"
      >
        <option value="">Select a color...</option>
        <optgroup label="Brand Colors">
          {brandColors
            .filter((c) => c.category === 'brand')
            .map((color) => (
              <option key={color.id} value={`--brand-${color.name}`}>
                {color.name} ({color.value})
              </option>
            ))}
        </optgroup>
        <optgroup label="Neutral Colors">
          {brandColors
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

