'use client';

import React, { useState, useRef, useCallback, forwardRef } from 'react';
import { Icon } from './Icon';

// ============================================================================
// Types
// ============================================================================

type NumberFieldSize = 'sm' | 'md' | 'lg';

interface NumberFieldProps {
  /** Current value */
  value?: number;
  /** Default value for uncontrolled usage */
  defaultValue?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment/decrement amount */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Size variant */
  size?: NumberFieldSize;
  /** Show increment/decrement controls */
  showControls?: boolean;
  /** Number formatting options */
  formatOptions?: Intl.NumberFormatOptions;
  /** Placeholder text */
  placeholder?: string;
  /** Label for accessibility */
  'aria-label'?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<NumberFieldSize, { input: string; button: string; icon: number }> = {
  sm: {
    input: 'h-8 text-sm px-2',
    button: 'w-6 h-8',
    icon: 12,
  },
  md: {
    input: 'h-10 text-base px-3',
    button: 'w-8 h-10',
    icon: 14,
  },
  lg: {
    input: 'h-12 text-lg px-4',
    button: 'w-10 h-12',
    icon: 16,
  },
};

// ============================================================================
// Component
// ============================================================================

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  function NumberField(
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      min,
      max,
      step = 1,
      disabled = false,
      error = false,
      size = 'md',
      showControls = true,
      formatOptions,
      placeholder,
      'aria-label': ariaLabel,
      className = '',
    },
    ref
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Merge refs
    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Determine if controlled
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Format value for display
    const formattedValue = useCallback(
      (val: number) => {
        if (formatOptions) {
          return new Intl.NumberFormat(undefined, formatOptions).format(val);
        }
        return String(val);
      },
      [formatOptions]
    );

    // Clamp value to min/max
    const clamp = useCallback(
      (val: number): number => {
        let clamped = val;
        if (min !== undefined && clamped < min) clamped = min;
        if (max !== undefined && clamped > max) clamped = max;
        return clamped;
      },
      [min, max]
    );

    // Update value
    const updateValue = useCallback(
      (newValue: number) => {
        const clampedValue = clamp(newValue);
        if (!isControlled) {
          setInternalValue(clampedValue);
        }
        onChange?.(clampedValue);
      },
      [clamp, isControlled, onChange]
    );

    // Handle increment
    const handleIncrement = useCallback(() => {
      if (disabled) return;
      updateValue(value + step);
    }, [disabled, value, step, updateValue]);

    // Handle decrement
    const handleDecrement = useCallback(() => {
      if (disabled) return;
      updateValue(value - step);
    }, [disabled, value, step, updateValue]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      // Allow empty string during editing
      if (rawValue === '' || rawValue === '-') {
        return;
      }
      const parsed = parseFloat(rawValue);
      if (!isNaN(parsed)) {
        updateValue(parsed);
      }
    };

    // Handle blur - clamp value
    const handleBlur = () => {
      setIsFocused(false);
      updateValue(value);
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleIncrement();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleDecrement();
          break;
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
      text-center
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-edge-secondary focus:border-edge-secondary'}
      ${showControls ? 'pl-8 pr-8' : ''}
      [appearance:textfield]
      [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none
    `.trim();

    const buttonClasses = `
      ${styles.button}
      flex items-center justify-center
      text-content-primary/60
      hover:text-content-primary
      hover:bg-surface-tertiary
      transition-colors
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `.trim();

    // Check if at limits
    const atMin = min !== undefined && value <= min;
    const atMax = max !== undefined && value >= max;

    return (
      <div className={`relative inline-flex items-center ${className}`.trim()}>
        {/* Decrement button */}
        {showControls && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || atMin}
            className={`${buttonClasses} absolute left-0 rounded-l-sm border-r border-edge-primary/20 ${atMin ? 'opacity-30' : ''}`}
            tabIndex={-1}
            aria-label="Decrease value"
          >
            <Icon name="minus" size={styles.icon} />
          </button>
        )}

        {/* Input */}
        <input
          ref={mergedRef}
          type="text"
          inputMode="decimal"
          value={isFocused ? value : formattedValue(value)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          role="spinbutton"
          className={inputClasses}
        />

        {/* Increment button */}
        {showControls && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || atMax}
            className={`${buttonClasses} absolute right-0 rounded-r-sm border-l border-edge-primary/20 ${atMax ? 'opacity-30' : ''}`}
            tabIndex={-1}
            aria-label="Increase value"
          >
            <Icon name="plus" size={styles.icon} />
          </button>
        )}
      </div>
    );
  }
);

export default NumberField;
export type { NumberFieldProps, NumberFieldSize };
