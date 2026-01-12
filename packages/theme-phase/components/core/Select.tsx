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
          font-outfit text-base
          bg-[var(--glass-bg)] text-content-primary
          border
          ${error ? 'border-[var(--glass-border-error-strong)]' : 'border-[var(--glass-border)]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-[var(--color-edge-focus-purple)] bg-[var(--color-surface-input-focus)]' : ''}
          transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-[var(--color-edge-focus-purple)]
          ${iconName ? 'pl-10' : ''}
        `}
      >
        {iconName && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name={iconName} size={16} className="text-[var(--color-content-muted)]" />
          </div>
        )}
        <span className={`flex-1 min-w-0 text-left truncate ${selectedOption ? 'text-content-primary' : 'text-[var(--color-content-muted)]'}`}>
          {selectedOption?.label || placeholder}
        </span>
        <Icon
          name="chevron-down"
          size={16}
          className={`text-content-primary flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 top-full left-0 right-0 mt-1
            bg-[var(--color-surface-overlay)]
            border border-[var(--glass-border)]
            backdrop-blur-sm
            overflow-hidden
            max-h-[300px] flex flex-col
          `}
        >
          <div className="overflow-y-auto flex-1">
            {options.map((item, index) => {
              if (isOptionGroup(item)) {
                return (
                  <div key={item.label}>
                    <div className="px-3 py-1.5 text-[var(--color-content-tertiary)] font-kodemono text-xs uppercase tracking-wider bg-[var(--glass-bg)]">
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
        font-outfit text-base text-left
        transition-all duration-150
        ${isSelected ? 'bg-[var(--glass-bg-purple-checked)] text-content-primary' : 'text-content-primary hover:bg-[var(--glass-bg-hover)]'}
        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {option.iconName && (
        <Icon
          name={option.iconName}
          size={16}
          className={`flex-shrink-0 ${isSelected ? 'text-content-primary' : 'text-[var(--color-content-subtle)]'}`}
        />
      )}
      <span className="flex-1 min-w-0 truncate">{option.label}</span>
    </button>
  );
}

export default Select;
export type { SelectOption, SelectOptionGroup, SelectProps };
