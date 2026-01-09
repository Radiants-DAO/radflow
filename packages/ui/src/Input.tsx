import React, { forwardRef } from 'react';
import { Icon } from './Icon';

// ============================================================================
// Types
// ============================================================================

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size preset */
  size?: InputSize;
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Icon name (filename without .svg extension) - displays on the left */
  iconName?: string;
  /** Additional classes */
  className?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Icon name (filename without .svg extension) - displays on the left */
  iconName?: string;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  font-mondwest
  bg-surface-primary text-content-primary
  border border-edge-primary
  rounded-sm
  placeholder:text-content-primary/40
  focus:outline-none
  focus:bg-surface-elevated
  focus:ring-2 focus:ring-ring focus:ring-offset-0
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-8 px-2 text-sm',
  md: 'h-10 px-3 text-base',
  lg: 'h-12 px-4 text-base',
};

const errorStyles = `
  border-edge-error
  focus:ring-destructive
`;

// ============================================================================
// Components
// ============================================================================

/**
 * Text input with retro styling
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ size = 'md', error = false, fullWidth = false, iconName, className = '', ...props }, ref) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;
  const paddingLeft = iconName ? (size === 'sm' ? 'pl-8' : size === 'lg' ? 'pl-12' : 'pl-10') : '';

  const classes = [baseStyles, sizeStyles[size], error ? errorStyles : '', fullWidth ? 'w-full' : '', paddingLeft, className]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const input = <input ref={ref} className={classes} {...props} />;

  if (iconName) {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name={iconName} size={iconSize} className="text-content-primary/40" />
        </div>
        {input}
      </div>
    );
  }

  return input;
});

/**
 * Textarea with retro styling
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ error = false, fullWidth = false, iconName, className = '', ...props }, ref) {
  const paddingLeft = iconName ? 'pl-10' : '';

  const classes = [baseStyles, 'px-3 py-2 text-base', 'resize-y min-h-24', error ? errorStyles : '', fullWidth ? 'w-full' : '', paddingLeft, className]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const textarea = <textarea ref={ref} className={classes} {...props} />;

  if (iconName) {
    return (
      <div className="relative">
        <div className="absolute left-3 top-3 pointer-events-none">
          <Icon name={iconName} size={16} className="text-content-primary/40" />
        </div>
        {textarea}
      </div>
    );
  }

  return textarea;
});

// ============================================================================
// Label Component
// ============================================================================

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

/**
 * Form label
 */
export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label className={className} {...props}>
      {children}
      {required && <span className="text-content-error ml-1">*</span>}
    </label>
  );
}

export default Input;
export type { InputSize, InputProps, TextAreaProps, LabelProps };
