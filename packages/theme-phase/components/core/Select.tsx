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
          bg-[rgba(243,238,217,0.05)] text-[#f3eed9]
          border
          ${error ? 'border-[rgba(255,100,100,0.5)]' : 'border-[rgba(243,238,217,0.2)]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-[rgba(153,163,255,0.5)] bg-[rgba(243,238,217,0.08)]' : ''}
          transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-[rgba(153,163,255,0.5)]
          ${iconName ? 'pl-10' : ''}
        `}
      >
        {iconName && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name={iconName} size={16} className="text-[rgba(243,238,217,0.4)]" />
          </div>
        )}
        <span className={`flex-1 min-w-0 text-left truncate ${selectedOption ? 'text-[#f3eed9]' : 'text-[rgba(243,238,217,0.4)]'}`}>
          {selectedOption?.label || placeholder}
        </span>
        <Icon
          name="chevron-down"
          size={16}
          className={`text-[#f3eed9] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 top-full left-0 right-0 mt-1
            bg-[rgba(20,20,30,0.95)]
            border border-[rgba(243,238,217,0.2)]
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
                    <div className="px-3 py-1.5 text-[rgba(243,238,217,0.5)] font-kodemono text-xs uppercase tracking-wider bg-[rgba(243,238,217,0.05)]">
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
        ${isSelected ? 'bg-[rgba(153,163,255,0.2)] text-[#f3eed9]' : 'text-[#f3eed9] hover:bg-[rgba(243,238,217,0.1)]'}
        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {option.iconName && (
        <Icon
          name={option.iconName}
          size={16}
          className={`flex-shrink-0 ${isSelected ? 'text-[#f3eed9]' : 'text-[rgba(243,238,217,0.6)]'}`}
        />
      )}
      <span className="flex-1 min-w-0 truncate">{option.label}</span>
    </button>
  );
}

export default Select;
export type { SelectOption, SelectOptionGroup, SelectProps };
