'use client';

import { useState } from 'react';
import { useDevToolsStore } from '../../store';
import { Icon } from '@radflow/ui';
import type { BaseColor } from '../../types';

/**
 * BaseColorEditor - Edit brand and neutral base colors
 * Two separate sections: Brand Colors and Neutral Colors
 * Each row has: color swatch, editable name, editable hex, delete button
 * Each section has: "+ Add Variable" button
 */
export function BaseColorEditor() {
  const { baseColors, addBaseColor, updateBaseColor, deleteBaseColor } = useDevToolsStore();

  const brandColors = baseColors.filter((c) => c.category === 'brand');
  const neutralColors = baseColors.filter((c) => c.category === 'neutral');

  return (
    <div className="space-y-6">
      {/* Brand Colors Section */}
      <ColorSection
        title="Brand Colors"
        colors={brandColors}
        category="brand"
        onAdd={addBaseColor}
        onUpdate={updateBaseColor}
        onDelete={deleteBaseColor}
      />

      {/* Neutral Colors Section */}
      <ColorSection
        title="Neutrals"
        colors={neutralColors}
        category="neutral"
        onAdd={addBaseColor}
        onUpdate={updateBaseColor}
        onDelete={deleteBaseColor}
      />
    </div>
  );
}

interface ColorSectionProps {
  title: string;
  colors: BaseColor[];
  category: 'brand' | 'neutral';
  onAdd: (color: Omit<BaseColor, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<BaseColor>) => void;
  onDelete: (id: string) => void;
}

function ColorSection({ title, colors, category, onAdd, onUpdate, onDelete }: ColorSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHex, setNewHex] = useState('#000000');

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    const name = newName.trim().toLowerCase().replace(/\s+/g, '-');
    const displayName = newName.trim()
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    onAdd({
      name,
      displayName,
      value: newHex.toUpperCase(),
      category,
    });
    
    setNewName('');
    setNewHex('#000000');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewName('');
      setNewHex('#000000');
    }
  };

  return (
    <div className="space-y-2">
      {/* Section Header */}
      <h4>
        {title}
      </h4>

      {/* Color List */}
      <div className="space-y-1">
        {colors.map((color) => (
          <ColorRow
            key={color.id}
            color={color}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Add New Row */}
      {isAdding ? (
        <div className="flex items-center gap-2 p-2 bg-surface-tertiary/30 rounded-sm border border-dashed border-edge-primary">
          {/* Color Picker */}
          <input
            type="color"
            value={newHex}
            onChange={(e) => setNewHex(e.target.value)}
            className="w-6 h-6 rounded-xs border border-edge-primary cursor-pointer flex-shrink-0"
          />
          {/* Name Input */}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Color name"
            autoFocus
            className="flex-1 min-w-0 px-2 py-1 font-mondwest text-base bg-surface-primary border border-edge-primary rounded-sm text-content-primary focus:outline-none focus:ring-1 focus:ring-tertiary"
          />
          {/* Hex Input */}
          <input
            type="text"
            value={newHex}
            onChange={(e) => setNewHex(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="#000000"
            className="w-24 px-2 py-1 font-mondwest text-sm font-mono bg-surface-primary border border-edge-primary rounded-sm text-content-primary uppercase focus:outline-none focus:ring-1 focus:ring-tertiary"
          />
          {/* Actions */}
          <button
            onClick={handleAdd}
            className="font-mondwest text-base text-content-primary hover:text-tertiary px-1 flex items-center"
            title="Add"
          >
            <Icon name="checkmark-filled" size={16} />
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewName('');
              setNewHex('#000000');
            }}
            className="font-mondwest text-base text-content-primary/50 hover:text-content-primary px-1 flex items-center"
            title="Cancel"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="
            w-full py-2 px-3
            font-joystix text-xs uppercase
            text-content-primary/50 hover:text-content-primary
            border border-dashed border-edge-primary/30 hover:border-edge-primary
            rounded-sm
            transition-colors
          "
        >
          + Add Variable
        </button>
      )}
    </div>
  );
}

interface ColorRowProps {
  color: BaseColor;
  onUpdate: (id: string, updates: Partial<BaseColor>) => void;
  onDelete: (id: string) => void;
}

function ColorRow({ color, onUpdate, onDelete }: ColorRowProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(color.displayName);

  const handleNameSubmit = () => {
    if (editedName.trim() && editedName !== color.displayName) {
      const name = editedName.trim().toLowerCase().replace(/\s+/g, '-');
      onUpdate(color.id, {
        name,
        displayName: editedName.trim(),
      });
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditedName(color.displayName);
      setIsEditingName(false);
    }
  };

  const handleHexChange = (value: string) => {
    // Allow typing and validate on blur
    onUpdate(color.id, { value: value.toUpperCase() });
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-sm hover:bg-content-primary/5 group">
      {/* Color Picker */}
      <input
        type="color"
        value={color.value}
        onChange={(e) => handleHexChange(e.target.value)}
        className="w-6 h-6 rounded-xs border border-edge-primary cursor-pointer flex-shrink-0"
      />

      {/* Name (editable on click) */}
      {isEditingName ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={handleNameSubmit}
          onKeyDown={handleNameKeyDown}
          autoFocus
          className="flex-1 min-w-0 px-2 py-1 font-mondwest text-base bg-surface-primary border border-edge-primary rounded-sm text-content-primary focus:outline-none focus:ring-1 focus:ring-tertiary"
        />
      ) : (
        <span
          onClick={() => {
            setEditedName(color.displayName);
            setIsEditingName(true);
          }}
          className="flex-1 min-w-0 font-mondwest text-base text-content-primary truncate cursor-text hover:bg-content-primary/5 px-2 py-1 rounded-sm"
          title="Click to edit"
        >
          {color.displayName}
        </span>
      )}

      {/* Hex Input */}
      <input
        type="text"
        value={color.value}
        onChange={(e) => handleHexChange(e.target.value)}
        className="w-24 px-2 py-1 font-mondwest text-sm font-mono bg-surface-primary border border-edge-primary rounded-sm text-content-primary uppercase focus:outline-none focus:ring-1 focus:ring-tertiary"
      />

      {/* Delete Button */}
      <button
        onClick={() => onDelete(color.id)}
        className="font-mondwest text-base text-error opacity-0 group-hover:opacity-100 hover:text-error/80 px-1 transition-opacity flex items-center"
        title="Delete"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export default BaseColorEditor;

