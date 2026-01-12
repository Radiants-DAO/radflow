'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ThemeIcon as Icon } from './ThemeIcon';
import type { BaseColor } from '../types';

interface SearchableColorDropdownProps {
  /** Available base colors to select from */
  colors: BaseColor[];
  /** Currently selected base color ID */
  value?: string;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Change handler - receives the selected BaseColor ID */
  onChange?: (colorId: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional classes */
  className?: string;
}

/**
 * Searchable dropdown for selecting base colors
 * - Search by display name or hex value
 * - Shows color swatch preview for each option
 */
export function SearchableColorDropdown({
  colors,
  value,
  placeholder = 'Select color...',
  onChange,
  disabled = false,
  className = '',
}: SearchableColorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Find selected color
  const selectedColor = colors.find(c => c.id === value);

  // Filter colors by search query (name or hex)
  const filteredColors = useMemo(() => {
    if (!searchQuery.trim()) return colors;
    
    const query = searchQuery.toLowerCase();
    return colors.filter(color => 
      color.displayName.toLowerCase().includes(query) ||
      color.name.toLowerCase().includes(query) ||
      color.value.toLowerCase().includes(query)
    );
  }, [colors, searchQuery]);

  // Group colors by category
  const groupedColors = useMemo(() => {
    const brand = filteredColors.filter(c => c.category === 'brand');
    const neutral = filteredColors.filter(c => c.category === 'neutral');
    return { brand, neutral };
  }, [filteredColors]);

  const handleSelect = (colorId: string) => {
    onChange?.(colorId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2
          w-full h-10 px-3
          font-mondwest text-base
          bg-surface-primary text-content-primary
          border rounded-sm
          border-edge-primary
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'shadow-[0_3px_0_0_var(--color-black)] -translate-y-0.5' : 'shadow-[0_1px_0_0_var(--color-black)]'}
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedColor && (
            <div
              className="w-4 h-4 rounded-xs border border-edge-primary flex-shrink-0"
              style={{ backgroundColor: selectedColor.value }}
            />
          )}
          <span className={`truncate ${selectedColor ? 'text-content-primary' : 'text-content-primary/40'}`}>
            {selectedColor?.displayName || placeholder}
          </span>
        </div>
        <Icon
          name="chevron-down"
          size={16}
          className={`text-content-primary flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 top-full left-0 right-0 mt-1
            bg-surface-primary
            border border-edge-primary
            rounded-sm
            shadow-[2px_2px_0_0_var(--color-black)]
            overflow-hidden
            max-h-[300px] flex flex-col
          `}
          onKeyDown={handleKeyDown}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-edge-primary/20">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or hex..."
              className="
                w-full h-8 px-2
                font-mondwest text-sm
                bg-surface-elevated text-content-primary
                border border-edge-primary rounded-sm
                outline-none
                placeholder:text-content-primary/40
              "
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {filteredColors.length === 0 ? (
              <div className="px-3 py-2 text-content-primary/50 font-mondwest text-base">
                No colors found
              </div>
            ) : (
              <>
                {/* Brand Colors */}
                {groupedColors.brand.length > 0 && (
                  <div>
                    <div 
                      className="px-3 py-1 text-content-primary/50 font-joystix text-xs uppercase tracking-wider bg-surface-tertiary/30"
                    >
                      Brand
                    </div>
                    {groupedColors.brand.map((color) => (
                      <ColorOption
                        key={color.id}
                        color={color}
                        isSelected={color.id === value}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}

                {/* Neutral Colors */}
                {groupedColors.neutral.length > 0 && (
                  <div>
                    <div 
                      className="px-3 py-1 text-content-primary/50 font-joystix text-xs uppercase tracking-wider bg-surface-tertiary/30"
                    >
                      Neutrals
                    </div>
                    {groupedColors.neutral.map((color) => (
                      <ColorOption
                        key={color.id}
                        color={color}
                        isSelected={color.id === value}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Individual color option
function ColorOption({
  color,
  isSelected,
  onSelect,
}: {
  color: BaseColor;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(color.id)}
      className={`
        w-full px-3 py-2
        flex items-center gap-2
        font-mondwest text-base text-left
        ${isSelected ? 'bg-surface-tertiary text-content-primary' : 'text-content-primary hover:bg-surface-tertiary'}
        cursor-pointer
      `}
    >
      {/* Color Swatch */}
      <div
        className="w-4 h-4 rounded-xs border border-edge-primary flex-shrink-0"
        style={{ backgroundColor: color.value }}
      />
      {/* Name */}
      <span className="flex-1 truncate">{color.displayName}</span>
      {/* Hex Value */}
      <span className="text-sm text-content-primary/50 font-mono uppercase">{color.value}</span>
    </button>
  );
}

export default SearchableColorDropdown;

