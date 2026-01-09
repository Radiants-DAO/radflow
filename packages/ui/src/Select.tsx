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

interface SelectProps {
  /** Available options */
  options: SelectOption[];
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
// Component
// ============================================================================

/**
 * Custom select/dropdown with retro styling
 */
export function Select({ options, value, placeholder = 'Select...', onChange, disabled = false, error = false, fullWidth = false, iconName, className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const paddingLeft = iconName ? 'pl-10' : '';

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}>
      {/* Trigger Button */}
      <div className="relative">
        {iconName && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Icon name={iconName} size={16} className="text-content-primary/40" />
          </div>
        )}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            flex items-center justify-between gap-2
            w-full h-10 px-3
            font-mondwest text-base
            ${isOpen ? 'bg-surface-elevated' : 'bg-surface-primary'}
            focus:bg-surface-elevated
            text-content-primary
            border rounded-sm
            ${error ? 'border-edge-error' : 'border-edge-primary'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'shadow-btn-hover -translate-y-0.5' : 'shadow-btn'}
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0
            ${paddingLeft}
          `}
        >
          <span className={`flex-1 min-w-0 text-left ${selectedOption ? 'text-content-primary' : 'text-content-primary/40'}`}>{selectedOption?.label || placeholder}</span>
          <Icon name="chevron-down" size={16} className={`text-content-primary flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 top-full left-0 right-0 mt-1
            bg-surface-primary
            border border-edge-primary
            rounded-sm
            shadow-card
            overflow-hidden
          `}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !option.disabled && handleSelect(option.value)}
              disabled={option.disabled}
              className={`
                w-full px-3 py-2
                font-mondwest text-base text-left
                flex items-center gap-2
                ${option.value === value ? 'bg-surface-tertiary text-content-primary' : 'text-content-primary'}
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-tertiary cursor-pointer'}
              `}
            >
              {option.iconName && <Icon name={option.iconName} size={16} className={`flex-shrink-0 ${option.value === value ? 'text-content-primary' : 'text-content-primary/60'}`} />}
              <span className="flex-1 min-w-0">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;
export type { SelectOption, SelectProps };
