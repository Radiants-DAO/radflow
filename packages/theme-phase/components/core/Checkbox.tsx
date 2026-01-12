import React, { forwardRef, createContext, useContext } from 'react';
import { Icon } from './Icon';

// ============================================================================
// Types
// ============================================================================

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string;
  /** Additional classes for container */
  className?: string;
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string;
  /** Additional classes for container */
  className?: string;
}

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface RadioGroupProps {
  /** Controlled value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Name attribute for radio inputs */
  name: string;
  /** Radio children */
  children: React.ReactNode;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Additional className */
  className?: string;
}

// ============================================================================
// Checkbox Component
// ============================================================================

/**
 * Retro-styled checkbox
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, className = '', disabled, ...props }, ref) {
  return (
    <label
      className={`
        inline-flex items-center gap-2 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className="relative">
        <input ref={ref} type="checkbox" disabled={disabled} className="peer sr-only" {...props} />
        {/* Custom checkbox visual */}
        <div
          className={`
            w-5 h-5
            bg-[rgba(243,238,217,0.05)]
            border border-[rgba(243,238,217,0.2)]
            peer-checked:bg-[rgba(153,163,255,0.2)] peer-checked:border-[rgba(153,163,255,0.5)]
            peer-focus:ring-1 peer-focus:ring-[rgba(153,163,255,0.5)]
            flex items-center justify-center
            transition-all duration-200
          `}
        />
        {/* Checkmark - visible when checkbox is checked */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
          <Icon name="checkmark" size={14} className="text-[#f3eed9]" />
        </div>
      </div>
      {label && <span className="font-outfit text-base text-[#f3eed9] select-none">{label}</span>}
    </label>
  );
});

// ============================================================================
// Radio Component
// ============================================================================

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/**
 * Retro-styled radio button
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, className = '', disabled, name, value, checked, onChange, ...props }, ref) {
  const groupContext = useContext(RadioGroupContext);
  
  // Use group context if available
  const effectiveName = groupContext?.name || name;
  const effectiveChecked = groupContext
    ? groupContext.value === value
    : checked;
  const effectiveOnChange = groupContext?.onChange
    ? (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && value !== undefined) {
          groupContext.onChange?.(String(value));
        }
      }
    : onChange;

  return (
    <label
      className={`
        inline-flex items-center gap-2 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <div className="relative">
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          className="peer sr-only"
          name={effectiveName}
          value={value}
          checked={effectiveChecked}
          onChange={effectiveOnChange}
          {...props}
        />
        {/* Custom radio visual */}
        <div
          className={`
            w-5 h-5
            bg-[rgba(243,238,217,0.05)]
            border border-[rgba(243,238,217,0.2)]
            rounded-full
            peer-checked:bg-[rgba(153,163,255,0.2)] peer-checked:border-[rgba(153,163,255,0.5)]
            peer-focus:ring-1 peer-focus:ring-[rgba(153,163,255,0.5)]
            flex items-center justify-center
            transition-all duration-200
          `}
        />
        {/* Inner dot when checked */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#f3eed9] rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none" />
      </div>
      {label && <span className="font-outfit text-base text-[#f3eed9] select-none">{label}</span>}
    </label>
  );
});

// ============================================================================
// RadioGroup Component
// ============================================================================

/**
 * RadioGroup wrapper for managing radio button state
 */
export function RadioGroup({
  value,
  onChange,
  name,
  children,
  orientation = 'vertical',
  className = '',
}: RadioGroupProps) {
  const contextValue: RadioGroupContextValue = {
    name,
    value,
    onChange,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        className={`
          ${orientation === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-2'}
          ${className}
        `}
        role="radiogroup"
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export default Checkbox;
export type { CheckboxProps, RadioProps, RadioGroupProps };
