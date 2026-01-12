import React, { useRef, useState, useCallback, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

type SliderSize = 'sm' | 'md' | 'lg';

interface SliderProps {
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Size preset */
  size?: SliderSize;
  /** Disabled state */
  disabled?: boolean;
  /** Show value label */
  showValue?: boolean;
  /** Label text */
  label?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<SliderSize, { track: string; thumb: string }> = {
  sm: {
    track: 'h-4',
    thumb: 'w-4 h-4',
  },
  md: {
    track: 'h-5',
    thumb: 'w-5 h-5',
  },
  lg: {
    track: 'h-5',
    thumb: 'w-5 h-5',
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * Slider component - Numeric range input
 */
export function Slider({ value, onChange, min = 0, max = 100, step = 1, size = 'md', disabled = false, showValue = false, label, className = '' }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const styles = sizeStyles[size];

  const percentage = ((value - min) / (max - min)) * 100;

  const snapToStep = useCallback(
    (val: number) => {
      const stepped = Math.round((val - min) / step) * step + min;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step]
  );

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;

      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newValue = min + percent * (max - min);
      return snapToStep(newValue);
    },
    [min, max, value, snapToStep]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;

      e.preventDefault();
      setIsDragging(true);

      const newValue = getValueFromPosition(e.clientX);
      onChange(newValue);
    },
    [disabled, getValueFromPosition, onChange]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      onChange(newValue);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, getValueFromPosition, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = value;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, value - step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }

    e.preventDefault();
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {/* Label & Value */}
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="font-outfit text-base text-[#f3eed9]">{label}</span>}
          {showValue && <span className="font-kodemono text-sm text-[rgba(243,238,217,0.6)]">{value}</span>}
        </div>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className={`
          relative w-full
          ${styles.track}
          border border-[rgba(243,238,217,0.2)]
          bg-[rgba(243,238,217,0.05)]
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-1 focus:ring-[rgba(153,163,255,0.5)]
          transition-all duration-200
        `.trim()}
      >
        {/* Filled Track */}
        <div
          className="absolute top-0 left-0 h-full bg-[rgba(153,163,255,0.1)]"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2
            ${styles.thumb}
            bg-[#f3eed9]
            transform -translate-y-1/2
            ${isDragging ? 'scale-110' : ''}
            transition-transform duration-200
          `.trim()}
          style={{ left: `calc(${percentage}% - ${parseInt(styles.thumb.split(' ')[0].replace('w-', '')) * 2}px)` }}
        />
      </div>
    </div>
  );
}

export default Slider;
export type { SliderSize, SliderProps };
