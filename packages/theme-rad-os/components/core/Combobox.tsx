'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { useEscapeKey, useClickOutside } from './hooks/useModalBehavior';

// ============================================================================
// Types
// ============================================================================

type ComboboxSize = 'sm' | 'md' | 'lg';

interface ComboboxOption {
  /** Unique value for the option */
  value: string;
  /** Display label */
  label: string;
  /** Optional icon name */
  iconName?: string;
  /** Disabled state */
  disabled?: boolean;
}

interface ComboboxProps {
  /** Available options */
  options: ComboboxOption[];
  /** Selected value */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Size variant */
  size?: ComboboxSize;
  /** Allow custom values not in options list */
  allowCustomValue?: boolean;
  /** Callback when search query changes (for async loading) */
  onSearch?: (query: string) => void;
  /** Loading state for async options */
  loading?: boolean;
  /** Message when no options match */
  emptyMessage?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<ComboboxSize, { input: string; dropdown: string; option: string }> = {
  sm: {
    input: 'h-8 text-sm px-2',
    dropdown: 'text-sm',
    option: 'px-2 py-1.5',
  },
  md: {
    input: 'h-10 text-base px-3',
    dropdown: 'text-base',
    option: 'px-3 py-2',
  },
  lg: {
    input: 'h-12 text-lg px-4',
    dropdown: 'text-lg',
    option: 'px-4 py-2.5',
  },
};

// ============================================================================
// Component
// ============================================================================

export function Combobox({
  options,
  value = '',
  onChange,
  placeholder = 'Select or type...',
  disabled = false,
  error = false,
  size = 'md',
  allowCustomValue = false,
  onSearch,
  loading = false,
  emptyMessage = 'No options found',
  className = '',
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Use layout effect for hydration check
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Get display value
  const displayValue = useMemo(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    return selectedOption?.label || value;
  }, [options, value]);

  // Calculate dropdown position
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const gap = 4;

    setCoords({
      top: trigger.bottom + gap + window.scrollY,
      left: trigger.left + window.scrollX,
      width: trigger.width,
    });
  }, [isOpen]);

  // Handle search callback
  useEffect(() => {
    if (onSearch && isOpen) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch, isOpen]);

  // Handle click outside
  useClickOutside(isOpen, [dropdownRef, triggerRef], () => {
    setIsOpen(false);
    setSearchQuery('');
  });

  // Handle escape key
  useEscapeKey(isOpen, () => {
    setIsOpen(false);
    setSearchQuery('');
  });

  // Handle option selection
  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    },
    [onChange]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) => {
              const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
              optionRefs.current[nextIndex]?.scrollIntoView({ block: 'nearest' });
              return nextIndex;
            });
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) => {
              const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
              optionRefs.current[nextIndex]?.scrollIntoView({ block: 'nearest' });
              return nextIndex;
            });
          }
          break;

        case 'Enter':
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            const option = filteredOptions[highlightedIndex];
            if (!option.disabled) {
              handleSelect(option.value);
            }
          } else if (allowCustomValue && searchQuery) {
            handleSelect(searchQuery);
          }
          break;

        case 'Tab':
          if (isOpen) {
            setIsOpen(false);
            setSearchQuery('');
          }
          break;
      }
    },
    [disabled, isOpen, filteredOptions, highlightedIndex, handleSelect, allowCustomValue, searchQuery]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    setHighlightedIndex(-1);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchQuery('');
    }
  };

  const styles = sizeStyles[size];

  const inputClasses = `
    w-full
    ${styles.input}
    font-mondwest
    text-content-primary
    bg-surface-primary
    border ${error ? 'border-content-error' : 'border-edge-primary'}
    rounded-sm
    outline-none
    transition-colors
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-edge-secondary focus:border-edge-secondary'}
    ${className}
  `.trim();

  return (
    <div ref={triggerRef} className="relative">
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          {loading && <Icon name="spinner" size={16} className="animate-spin text-content-primary/60" />}
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            className="text-content-primary/60"
          />
        </div>
      </div>

      {/* Dropdown */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            className={`
              fixed z-50
              bg-surface-primary
              border border-edge-primary
              rounded-sm
              shadow-[2px_2px_0_0_var(--color-black)]
              max-h-[240px] overflow-y-auto
              ${styles.dropdown}
            `.trim()}
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
          >
            {loading ? (
              <div className={`${styles.option} text-content-primary/60 flex items-center gap-2`}>
                <Icon name="spinner" size={16} className="animate-spin" />
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className={`${styles.option} text-content-primary/60`}>
                {allowCustomValue && searchQuery ? (
                  <button
                    type="button"
                    onClick={() => handleSelect(searchQuery)}
                    className="w-full text-left hover:bg-surface-tertiary"
                  >
                    Create "{searchQuery}"
                  </button>
                ) : (
                  emptyMessage
                )}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={`
                    w-full ${styles.option}
                    flex items-center gap-2
                    font-mondwest text-left
                    ${option.value === value ? 'bg-surface-tertiary text-content-primary' : 'text-content-primary'}
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-tertiary cursor-pointer'}
                    ${highlightedIndex === index ? 'bg-surface-tertiary' : ''}
                  `.trim()}
                >
                  {option.iconName && (
                    <Icon name={option.iconName} size={16} className="flex-shrink-0" />
                  )}
                  <span className="flex-1">{option.label}</span>
                  {option.value === value && (
                    <Icon name="check" size={16} className="flex-shrink-0 text-content-success" />
                  )}
                </button>
              ))
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

export default Combobox;
export type { ComboboxOption, ComboboxProps, ComboboxSize };
