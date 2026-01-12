import React from 'react';

// ============================================================================
// Types
// ============================================================================

type ProgressVariant = 'default' | 'success' | 'warning' | 'error';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Visual variant */
  variant?: ProgressVariant;
  /** Size preset */
  size?: ProgressSize;
  /** Show percentage label */
  showLabel?: boolean;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

const variantStyles: Record<ProgressVariant, string> = {
  default: 'bg-surface-tertiary',
  success: 'bg-surface-success',
  warning: 'bg-surface-warning',
  error: 'bg-surface-error',
};

// ============================================================================
// Component
// ============================================================================

/**
 * Progress bar with retro styling
 */
export function Progress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {/* Track */}
      <div
        className={`
          w-full
          border border-edge-primary
          rounded-sm
          overflow-hidden
          ${sizeStyles[size]}
        `}
        style={{
          backgroundColor: 'var(--color-surface-sunken)',
          backgroundImage: 'var(--pattern-surface-sunken)',
          backgroundSize: 'var(--pattern-surface-sunken-size)',
          backgroundPosition: 'var(--pattern-surface-sunken-position)',
          backgroundRepeat: 'repeat',
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {/* Fill */}
        <div
          className={`
            h-full
            border-r border-edge-primary
            ${variantStyles[variant]}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <div className="mt-1 font-joystix text-2xs text-content-primary text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Loading Spinner
// ============================================================================

interface SpinnerProps {
  /** Size in pixels */
  size?: number;
  /** Additional classes */
  className?: string;
  /** Whether loading is completed - shows checkmark */
  completed?: boolean;
}

// PixelCode loader frames - Private Use Area characters from PixelCode font
const LOADER_FRAMES = ['\uEE06', '\uEE07', '\uEE08', '\uEE09', '\uEE0A', '\uEE0B'];

/**
 * PixelCode loader with animated frames that loop through 6 frames
 * When completed, displays a checkmark
 */
export function Spinner({ size = 24, className = '', completed = false }: SpinnerProps) {
  const [frameIndex, setFrameIndex] = React.useState(0);

  React.useEffect(() => {
    if (completed) {
      setFrameIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % LOADER_FRAMES.length);
    }, 150);

    return () => clearInterval(interval);
  }, [completed]);

  const fontSize = size;
  const displayChar = completed ? '✓' : LOADER_FRAMES[frameIndex];

  return (
    <div
      className={`inline-block flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: fontSize,
        fontFamily: 'PixelCode, monospace',
        lineHeight: 1,
      }}
      aria-label={completed ? 'Completed' : 'Loading'}
      role="status"
    >
      {displayChar}
    </div>
  );
}

export default Progress;
