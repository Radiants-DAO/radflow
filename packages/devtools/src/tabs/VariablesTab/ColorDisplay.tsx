'use client';

import { useState, useRef, useEffect } from 'react';
import { useDevToolsStore } from '../../store';
import { useToast } from '@radflow/ui/Toast';
import { ThemeIcon as Icon } from '../../components/ThemeIcon';
import { Button } from '@radflow/ui/Button';
import type { BaseColor, SemanticToken } from '../../types';
import type { AddedColor } from './index';

// Preview component for demonstrating a class
function TokenPreview({ tokenClass, category }: { tokenClass: string; category: SemanticToken['category'] }) {
  if (category === 'surface') {
    return (
      <div className="p-3 space-y-2">
        <p className="text-xs text-content-secondary font-mondwest">Background preview:</p>
        <div className={`${tokenClass} p-3 rounded-sm border border-edge-primary`}>
          <p className="text-sm font-mondwest">Sample content</p>
        </div>
      </div>
    );
  }

  if (category === 'content') {
    return (
      <div className="p-3 space-y-2">
        <p className="text-xs text-content-secondary font-mondwest">Text color preview:</p>
        <div className="bg-surface-primary p-3 rounded-sm border border-edge-primary">
          <p className={`${tokenClass} text-base font-mondwest`}>Sample text</p>
          <p className={`${tokenClass} text-sm font-mondwest`}>Secondary line</p>
        </div>
        <div className="bg-surface-secondary p-3 rounded-sm border border-edge-primary">
          <p className={`${tokenClass} text-base font-mondwest`}>On dark surface</p>
        </div>
      </div>
    );
  }

  if (category === 'edge') {
    return (
      <div className="p-3 space-y-2">
        <p className="text-xs text-content-secondary font-mondwest">Border preview:</p>
        <div className={`${tokenClass} border-2 p-3 rounded-sm bg-surface-primary`}>
          <p className="text-sm font-mondwest">With border</p>
        </div>
        <div className={`${tokenClass} border p-3 rounded-sm bg-surface-elevated`}>
          <p className="text-sm font-mondwest">Subtle border</p>
        </div>
      </div>
    );
  }

  return null;
}

// Inline editable value component
function InlineEdit({
  value,
  pendingValue,
  onSave,
  className,
  isDisplayName = false,
}: {
  value: string;
  pendingValue?: string;
  onSave: (newValue: string) => void;
  className?: string;
  isDisplayName?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(pendingValue ?? value);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = pendingValue ?? value;
  const hasChange = pendingValue !== undefined && pendingValue !== value;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    // Update edit value when pending value changes externally
    setEditValue(pendingValue ?? value);
  }, [pendingValue, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editValue !== value) {
        onSave(editValue);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditValue(pendingValue ?? value);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`px-1 py-0.5 bg-surface-primary border border-edge-focus rounded-xs outline-none ${
          isDisplayName ? 'text-base font-mondwest' : 'text-xs font-mono uppercase'
        } ${className}`}
        style={{ width: `${Math.max(editValue.length, 6) + 2}ch` }}
      />
    );
  }

  if (isDisplayName) {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          setEditValue(displayValue);
          setIsEditing(true);
        }}
        className={`
          cursor-text hover:bg-surface-tertiary/50 px-1 rounded-xs transition-colors font-mondwest text-base text-content-primary truncate
          ${hasChange ? 'ring-1 ring-edge-focus' : ''}
          ${className}
        `}
        title="Click to edit"
      >
        {displayValue}
      </span>
    );
  }

  return (
    <code
      onClick={(e) => {
        e.stopPropagation();
        setEditValue(displayValue);
        setIsEditing(true);
      }}
      className={`
        cursor-text hover:bg-surface-tertiary/50 px-1 rounded-xs transition-colors uppercase
        ${hasChange ? 'text-content-primary ring-1 ring-edge-focus' : ''}
        ${className}
      `}
      style={{ backgroundColor: 'unset', background: 'unset', backgroundImage: 'none', marginTop: '0px' }}
      title="Click to edit"
    >
      {displayValue}
    </code>
  );
}

interface ColorDisplayProps {
  pendingSemanticMappings: Map<string, string>;
  pendingColorValues: Map<string, string>;
  pendingDisplayNames: Map<string, string>;
  addedColors: AddedColor[];
  removedColors: Set<string>;
  onSemanticMappingChange: (tokenId: string, baseColorName: string | null) => void;
  onColorValueChange: (colorName: string, value: string | null) => void;
  onDisplayNameChange: (colorName: string, displayName: string | null) => void;
  onAddColor: (color: AddedColor) => void;
  onRemoveColor: (colorName: string) => void;
  onUndoRemoveColor: (colorName: string) => void;
}

export function ColorDisplay({
  pendingSemanticMappings,
  pendingColorValues,
  pendingDisplayNames,
  addedColors,
  removedColors,
  onSemanticMappingChange,
  onColorValueChange,
  onDisplayNameChange,
  onAddColor,
  onRemoveColor,
  onUndoRemoveColor,
}: ColorDisplayProps) {
  const { baseColors, semanticTokens } = useDevToolsStore();
  const { addToast } = useToast();

  // Drag-drop state for remapping
  const [draggedToken, setDraggedToken] = useState<SemanticToken | null>(null);
  const [dragOverColor, setDragOverColor] = useState<string | null>(null);

  // Hover preview state
  const [hoveredToken, setHoveredToken] = useState<SemanticToken | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State for adding new color
  const [isAddingColor, setIsAddingColor] = useState<'brand' | 'neutral' | null>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorValue, setNewColorValue] = useState('#');

  // Convert added colors to BaseColor format for rendering
  const addedBrandColors: BaseColor[] = addedColors
    .filter((c) => c.category === 'brand')
    .map((c) => ({
      id: `added-${c.name}`,
      name: c.name,
      displayName: c.displayName,
      value: c.value,
      category: 'brand' as const,
    }));

  const addedNeutralColors: BaseColor[] = addedColors
    .filter((c) => c.category === 'neutral')
    .map((c) => ({
      id: `added-${c.name}`,
      name: c.name,
      displayName: c.displayName,
      value: c.value,
      category: 'neutral' as const,
    }));

  // Combine existing colors with added colors, excluding removed ones
  const brandColors = [
    ...baseColors.filter((c) => c.category === 'brand' && !removedColors.has(c.name)),
    ...addedBrandColors,
  ];
  const neutralColors = [
    ...baseColors.filter((c) => c.category === 'neutral' && !removedColors.has(c.name)),
    ...addedNeutralColors,
  ];

  // Get removed colors for display (with undo option)
  const removedBrandColors = baseColors.filter((c) => c.category === 'brand' && removedColors.has(c.name));
  const removedNeutralColors = baseColors.filter((c) => c.category === 'neutral' && removedColors.has(c.name));

  // Extract base color name from reference like "var(--color-warm-cloud)"
  const extractBaseColorName = (reference: string): string => {
    const match = reference.match(/var\(--color-([\w-]+)\)/);
    return match ? match[1] : reference;
  };

  // Get current mapping for a token (considering pending changes)
  const getCurrentMapping = (token: SemanticToken): string => {
    return pendingSemanticMappings.get(token.id) ?? extractBaseColorName(token.reference);
  };

  // Get semantic tokens mapped to a specific base color
  const getTokensForColor = (colorName: string): SemanticToken[] => {
    return semanticTokens.filter((token) => getCurrentMapping(token) === colorName);
  };

  // Get the Tailwind class for a semantic token
  const getTokenClass = (token: SemanticToken): string => {
    const prefix = token.category === 'surface' ? 'bg' : token.category === 'content' ? 'text' : 'border';
    return `${prefix}-${token.name}`;
  };

  // Get display value for a color (pending or original)
  const getColorDisplayValue = (color: BaseColor): string => {
    return pendingColorValues.get(color.name) ?? color.value;
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, token: SemanticToken) => {
    setDraggedToken(token);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', token.id);
  };

  const handleDragEnd = () => {
    setDraggedToken(null);
    setDragOverColor(null);
  };

  const handleDragOver = (e: React.DragEvent, colorName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColor(colorName);
  };

  const handleDragLeave = () => {
    setDragOverColor(null);
  };

  const handleDrop = (e: React.DragEvent, targetColor: BaseColor) => {
    e.preventDefault();
    setDragOverColor(null);

    if (!draggedToken) return;

    const currentMapping = getCurrentMapping(draggedToken);
    if (currentMapping === targetColor.name) {
      setDraggedToken(null);
      return;
    }

    // Check if this is the original mapping
    const originalMapping = extractBaseColorName(draggedToken.reference);
    if (targetColor.name === originalMapping) {
      // Removing the pending change (reverting to original)
      onSemanticMappingChange(draggedToken.id, null);
    } else {
      onSemanticMappingChange(draggedToken.id, targetColor.name);
    }

    addToast({
      title: 'Mapping changed',
      description: `${draggedToken.displayName} → ${targetColor.displayName}`,
      variant: 'success',
    });

    setDraggedToken(null);
  };

  const copyToClipboard = (text: string, description?: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast({ title: 'Copied', description: description || text, variant: 'success' });
      })
      .catch(() => {
        addToast({ title: 'Failed to copy', description: 'Unable to copy to clipboard', variant: 'error' });
      });
  };

  // Hover preview handlers
  const handleTokenMouseEnter = (e: React.MouseEvent, token: SemanticToken) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredToken(token);
      setPreviewPosition({
        x: rect.left,
        y: rect.bottom + 8,
      });
    }, 300);
  };

  const handleTokenMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredToken(null);
    setPreviewPosition(null);
  };

  // Render a single color row with semantic tokens
  const renderColorRow = (color: BaseColor) => {
    const mappedTokens = getTokensForColor(color.name);
    const isDropTarget = dragOverColor === color.name;
    const isDragSource = draggedToken && getCurrentMapping(draggedToken) === color.name;
    const displayValue = getColorDisplayValue(color);
    const hasColorChange = pendingColorValues.has(color.name);
    const hasDisplayNameChange = pendingDisplayNames.has(color.name);

    return (
      <div
        key={color.id}
        data-drop-target={color.name}
        onDragOver={(e) => handleDragOver(e, color.name)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, color)}
        className={`
          rounded-sm transition-all duration-200
          ${isDropTarget ? 'ring-2 ring-edge-focus/50 bg-surface-tertiary/20' : ''}
          ${isDragSource ? 'opacity-70' : ''}
        `}
      >
        {/* Color row */}
        <div className="flex items-center gap-3 p-2 rounded-sm hover:bg-warm-cloud group">
          <div
            className={`w-6 h-6 rounded-xs border flex-shrink-0 ${hasColorChange || hasDisplayNameChange ? 'border-edge-focus border-2' : 'border-edge-primary'}`}
            style={{ backgroundColor: displayValue }}
          />
          <InlineEdit
            value={color.displayName}
            pendingValue={pendingDisplayNames.get(color.name)}
            onSave={(newValue) => {
              if (newValue === color.displayName) {
                onDisplayNameChange(color.name, null);
              } else {
                onDisplayNameChange(color.name, newValue);
              }
            }}
            className="flex-1 min-w-0"
            isDisplayName
          />
          <InlineEdit
            value={color.value}
            pendingValue={pendingColorValues.get(color.name)}
            onSave={(newValue) => {
              if (newValue === color.value) {
                onColorValueChange(color.name, null);
              } else {
                onColorValueChange(color.name, newValue);
              }
            }}
            className="flex-shrink-0"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveColor(color.name);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-tertiary rounded-xs transition-opacity"
            title="Remove color"
          >
            <Icon name="close" size={14} className="text-content-primary/60" />
          </button>
        </div>

        {/* Semantic tokens mapped to this color */}
        {mappedTokens.length > 0 && (
          <div className="ml-9 pb-2 flex flex-wrap gap-1.5">
            {mappedTokens.map((token) => {
              const isBeingDragged = draggedToken?.id === token.id;
              const wasChanged = pendingSemanticMappings.has(token.id);
              const tokenClass = getTokenClass(token);

              return (
                <code
                  key={token.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, token)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(tokenClass, `Copied: ${tokenClass}`);
                  }}
                  onMouseEnter={(e) => handleTokenMouseEnter(e, token)}
                  onMouseLeave={handleTokenMouseLeave}
                  className={`
                    px-2 py-1 rounded-xs border cursor-grab active:cursor-grabbing
                    transition-all duration-200 text-xs font-mono
                    ${isBeingDragged ? 'opacity-50 scale-95' : 'hover:border-edge-focus hover:bg-surface-tertiary'}
                    ${wasChanged ? 'border-edge-focus bg-surface-tertiary/50' : 'border-edge-primary/50 bg-surface-elevated'}
                  `}
                  style={{ backgroundColor: wasChanged ? undefined : 'var(--color-surface-elevated)', marginTop: 0 }}
                  title="Click to copy • Drag to remap"
                >
                  {tokenClass}
                  {wasChanged && (
                    <span
                      className="inline-block w-1.5 h-1.5 ml-1.5 rounded-full bg-edge-focus align-middle"
                      title="Pending change"
                    />
                  )}
                </code>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Handle adding a new color
  const handleAddColor = (category: 'brand' | 'neutral') => {
    if (!newColorName.trim() || !newColorValue.trim()) return;

    // Convert display name to CSS variable name (kebab-case)
    const cssName = newColorName.toLowerCase().replace(/\s+/g, '-');

    onAddColor({
      name: cssName,
      displayName: newColorName,
      value: newColorValue,
      category,
    });

    // Reset form
    setNewColorName('');
    setNewColorValue('#');
    setIsAddingColor(null);

    addToast({
      title: 'Color added',
      description: `${newColorName} will be added when you apply changes`,
      variant: 'success',
    });
  };

  // Render removed color row with undo option
  const renderRemovedColorRow = (color: BaseColor) => (
    <div
      key={color.id}
      className="flex items-center gap-3 p-2 rounded-sm bg-surface-secondary/30 opacity-60"
    >
      <div
        className="w-6 h-6 rounded-xs border border-edge-primary/50 flex-shrink-0"
        style={{ backgroundColor: color.value }}
      />
      <span className="flex-1 min-w-0 font-mondwest text-base text-content-primary/60 truncate line-through">
        {color.displayName}
      </span>
      <button
        type="button"
        onClick={() => onUndoRemoveColor(color.name)}
        className="text-xs font-mondwest text-content-primary/60 hover:text-content-primary underline"
      >
        Undo
      </button>
    </div>
  );

  // Render a section of colors
  const renderSection = (title: string, colors: BaseColor[], category: 'brand' | 'neutral', removedColorsList: BaseColor[]) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-joystix">{title}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingColor(category)}
          >
            + Add Color
          </Button>
        </div>

        {/* Active colors */}
        {colors.length > 0 && (
          <div className="space-y-0.5">{colors.map(renderColorRow)}</div>
        )}

        {/* Removed colors (pending deletion) */}
        {removedColorsList.length > 0 && (
          <div className="space-y-0.5 mt-2">
            {removedColorsList.map(renderRemovedColorRow)}
          </div>
        )}

        {/* Add color form */}
        {isAddingColor === category && (
          <div className="p-3 border border-edge-focus/50 rounded-sm bg-surface-tertiary/20 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-xs border border-edge-primary flex-shrink-0"
                style={{ backgroundColor: newColorValue || '#cccccc' }}
              />
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Color name"
                className="flex-1 px-2 py-1 bg-surface-primary border border-edge-primary rounded-xs text-sm font-mondwest outline-none focus:border-edge-focus"
                autoFocus
              />
              <input
                type="text"
                value={newColorValue}
                onChange={(e) => setNewColorValue(e.target.value)}
                placeholder="#000000"
                className="w-24 px-2 py-1 bg-surface-primary border border-edge-primary rounded-xs text-xs font-mono uppercase outline-none focus:border-edge-focus"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingColor(null);
                  setNewColorName('');
                  setNewColorValue('#');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddColor(category)}
                disabled={!newColorName.trim() || !newColorValue.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {colors.length === 0 && removedColorsList.length === 0 && isAddingColor !== category && (
          <p className="text-sm text-content-primary/50 font-mondwest">No colors in this category</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSection('Brand Colors', brandColors, 'brand', removedBrandColors)}
      {renderSection('Neutrals', neutralColors, 'neutral', removedNeutralColors)}

      {/* Hover preview popover */}
      {hoveredToken && previewPosition && (
        <div
          className="fixed z-50 bg-surface-elevated border border-edge-primary rounded-sm shadow-card-lg min-w-[200px] max-w-[280px]"
          style={{
            left: Math.min(previewPosition.x, window.innerWidth - 300),
            top: Math.min(previewPosition.y, window.innerHeight - 200),
          }}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
          }}
          onMouseLeave={handleTokenMouseLeave}
        >
          <div className="px-3 py-2 border-b border-edge-primary/50">
            <code className="text-xs font-mono">{getTokenClass(hoveredToken)}</code>
          </div>
          <TokenPreview tokenClass={getTokenClass(hoveredToken)} category={hoveredToken.category} />
        </div>
      )}
    </div>
  );
}
