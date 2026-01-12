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

// Generate a stable ID (only once per component instance)
let idCounter = 0;

/**
 * Switch component - On/off toggle
 */
export function Switch({ checked, onChange, size = 'md', disabled = false, label, labelPosition = 'right', className = '', id }: SwitchProps) {
  const styles = sizeStyles[size];
  const switchId = React.useMemo(() => id || `switch-${++idCounter}`, [id]);

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
        border border-[rgba(243,238,217,0.2)]
        transition-all duration-200
        ${checked ? 'bg-[rgba(153,163,255,0.3)] border-[rgba(153,163,255,0.5)]' : 'bg-[rgba(243,238,217,0.1)]'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-1 focus:ring-[rgba(153,163,255,0.5)]
      `.trim()}
    >
      {/* Thumb */}
      <span
        className={`
          ${styles.thumb}
          bg-[#f3eed9]
          transform transition-transform duration-200
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
            font-outfit text-base text-[#f3eed9]
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
            font-outfit text-base text-[#f3eed9]
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
