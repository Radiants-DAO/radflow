'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

// ============================================================================
// Types
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Icon name (filename without .svg extension) */
  iconName?: string;
}

interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  /** Available options (flat or grouped) */
  options: SelectOption[] | SelectOptionGroup[];
  /** Currently selected value */
  value?: string;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Icon name for the trigger button */
  iconName?: string;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function isOptionGroup(item: SelectOption | SelectOptionGroup): item is SelectOptionGroup {
  return 'options' in item;
}

function flattenOptions(options: SelectOption[] | SelectOptionGroup[]): SelectOption[] {
  return options.flatMap(item => isOptionGroup(item) ? item.options : [item]);
}

// ============================================================================
// Component
// ============================================================================

/**
 * Custom select/dropdown with retro styling
 * Inspired by SearchableColorDropdown design
 */
export function Select({
  options,
  value,
  placeholder = 'Select...',
  onChange,
  disabled = false,
  error = false,
  fullWidth = false,
  iconName,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const allOptions = flattenOptions(options);
  const selectedOption = allOptions.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}>
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
          ${error ? 'border-edge-error' : 'border-edge-primary'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'shadow-[0_3px_0_0_var(--color-black)] -translate-y-0.5' : 'shadow-[0_1px_0_0_var(--color-black)]'}
          transition-all duration-100
          focus:outline-none focus:ring-2 focus:ring-edge-focus focus:ring-offset-0
          ${iconName ? 'pl-10' : ''}
        `}
      >
        {iconName && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name={iconName} size={16} className="text-content-primary/40" />
          </div>
        )}
        <span className={`flex-1 min-w-0 text-left truncate ${selectedOption ? 'text-content-primary' : 'text-content-primary/40'}`}>
          {selectedOption?.label || placeholder}
        </span>
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
        >
          <div className="overflow-y-auto flex-1">
            {options.map((item, index) => {
              if (isOptionGroup(item)) {
                return (
                  <div key={item.label}>
                    <div className="px-3 py-1.5 text-content-primary/50 font-joystix text-xs uppercase tracking-wider bg-surface-secondary/10">
                      {item.label}
                    </div>
                    {item.options.map((option) => (
                      <SelectItem
                        key={option.value}
                        option={option}
                        isSelected={option.value === value}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                );
              }
              return (
                <SelectItem
                  key={item.value}
                  option={item}
                  isSelected={item.value === value}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SelectItem({
  option,
  isSelected,
  onSelect,
}: {
  option: SelectOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => !option.disabled && onSelect(option.value)}
      disabled={option.disabled}
      className={`
        w-full px-3 py-2
        flex items-center gap-2
        font-mondwest text-base text-left
        ${isSelected ? 'bg-surface-tertiary text-content-primary' : 'text-content-primary hover:bg-surface-tertiary'}
        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {option.iconName && (
        <Icon
          name={option.iconName}
          size={16}
          className={`flex-shrink-0 ${isSelected ? 'text-content-primary' : 'text-content-primary/60'}`}
        />
      )}
      <span className="flex-1 min-w-0 truncate">{option.label}</span>
    </button>
  );
}

export default Select;
export type { SelectOption, SelectOptionGroup, SelectProps };
