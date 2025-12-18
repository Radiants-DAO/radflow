'use client';

import { useState } from 'react';
import { useDevToolsStore } from '../../store';
import { ColorPicker } from '../../components/ColorPicker';

export function BrandColorEditor() {
  const { brandColors, addBrandColor, updateBrandColor, deleteBrandColor } = useDevToolsStore();
  const [newColorName, setNewColorName] = useState('');
  const [newColorValue, setNewColorValue] = useState('#000000');
  const [newColorCategory, setNewColorCategory] = useState<'brand' | 'neutral'>('brand');

  const handleAdd = () => {
    if (!newColorName.trim()) return;
    addBrandColor({
      name: newColorName.trim().toLowerCase().replace(/\s+/g, '-'),
      value: newColorValue,
      category: newColorCategory,
    });
    setNewColorName('');
    setNewColorValue('#000000');
  };

  const brandColorList = brandColors.filter((c) => c.category === 'brand');
  const neutralColorList = brandColors.filter((c) => c.category === 'neutral');

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-heading">Brand Colors</h3>
      
      {/* Brand Colors */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-caption uppercase tracking-wide">Brand</h4>
        {brandColorList.map((color) => (
          <div key={color.id} className="flex items-center gap-2 p-2 bg-panel-hover rounded-md">
            <div
              className="w-6 h-6 rounded-md border border-border"
              style={{ backgroundColor: color.value }}
            />
            <span className="text-xs font-mono text-body flex-1">{color.name}</span>
            <input
              type="text"
              value={color.value}
              onChange={(e) => updateBrandColor(color.id, { value: e.target.value })}
              className="w-20 px-2 py-1 text-xs font-mono bg-panel border border-border rounded text-body"
            />
            <button
              onClick={() => deleteBrandColor(color.id)}
              className="text-xs text-error hover:text-error/80 px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Neutral Colors */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-caption uppercase tracking-wide">Neutrals</h4>
        {neutralColorList.map((color) => (
          <div key={color.id} className="flex items-center gap-2 p-2 bg-panel-hover rounded-md">
            <div
              className="w-6 h-6 rounded-md border border-border"
              style={{ backgroundColor: color.value }}
            />
            <span className="text-xs font-mono text-body flex-1">{color.name}</span>
            <input
              type="text"
              value={color.value}
              onChange={(e) => updateBrandColor(color.id, { value: e.target.value })}
              className="w-20 px-2 py-1 text-xs font-mono bg-panel border border-border rounded text-body"
            />
            <button
              onClick={() => deleteBrandColor(color.id)}
              className="text-xs text-error hover:text-error/80 px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add New Color */}
      <div className="p-3 bg-panel-hover rounded-lg space-y-2">
        <h4 className="text-xs font-medium text-caption">Add New Color</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            placeholder="Color name"
            className="flex-1 px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
          />
          <select
            value={newColorCategory}
            onChange={(e) => setNewColorCategory(e.target.value as 'brand' | 'neutral')}
            className="px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
          >
            <option value="brand">Brand</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div className="flex gap-2">
          <ColorPicker value={newColorValue} onChange={setNewColorValue} />
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-alternate rounded-md hover:bg-secondary/90"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

