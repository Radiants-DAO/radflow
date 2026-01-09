import React from 'react';

// ============================================================================
// Types
// ============================================================================

type SwitchSize = 'sm' | 'md' | 'lg';

interface SwitchProps {
  /** Checked state */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Size preset */
  size?: SwitchSize;
  /** Disabled state */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Label position */
  labelPosition?: 'left' | 'right';
  /** Additional className */
  className?: string;
  /** ID for accessibility */
  id?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<SwitchSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-10 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-12 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-6',
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * Switch component - On/off toggle
 */
export function Switch({ checked, onChange, size = 'md', disabled = false, label, labelPosition = 'right', className = '', id }: SwitchProps) {
  const styles = sizeStyles[size];
  const switchId = id || `switch-${Math.random().toString(36).slice(2)}`;

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const switchElement = (
    <button
      type="button"
      role="switch"
      id={switchId}
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        relative inline-flex items-center
        ${styles.track}
        rounded-full
        border border-edge-primary
        transition-colors
        ${checked ? 'bg-surface-tertiary' : 'bg-surface-primary'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      `.trim()}
    >
      {/* Thumb */}
      <span
        className={`
          ${styles.thumb}
          rounded-full
          bg-surface-secondary
          border border-edge-primary
          transform transition-transform
          ${checked ? styles.translate : 'translate-x-0.5'}
        `.trim()}
        aria-hidden="true"
      />
    </button>
  );

  if (!label) {
    return <div className={className}>{switchElement}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
      {labelPosition === 'left' && (
        <label
          htmlFor={switchId}
          className={`
            font-mondwest text-base text-content-primary
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `.trim()}
        >
          {label}
        </label>
      )}

      {switchElement}

      {labelPosition === 'right' && (
        <label
          htmlFor={switchId}
          className={`
            font-mondwest text-base text-content-primary
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `.trim()}
        >
          {label}
        </label>
      )}
    </div>
  );
}

export default Switch;
export type { SwitchSize, SwitchProps };
