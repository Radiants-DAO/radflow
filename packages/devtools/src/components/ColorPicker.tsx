'use client';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <label className="font-joystix text-xs uppercase text-content-primary/60 min-w-[60px]">{label}</label>
      )}
      <div className="flex items-center gap-2 flex-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-sm border border-edge-primary cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 font-mondwest text-base font-mono bg-surface-primary border border-edge-primary rounded-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-tertiary"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

