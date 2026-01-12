import React from 'react';

// ============================================================================
// Types
// ============================================================================

type DividerOrientation = 'horizontal' | 'vertical';
type DividerVariant = 'solid' | 'dashed' | 'decorated';

interface DividerProps {
  /** Orientation */
  orientation?: DividerOrientation;
  /** Visual variant */
  variant?: DividerVariant;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Divider component for separating content
 */
export function Divider({ orientation = 'horizontal', variant = 'solid', className = '' }: DividerProps) {
  // Decorated variant with diamond in center
  if (variant === 'decorated') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-[2px] bg-border/20" />
        <div className="w-2 h-2 bg-surface-tertiary border border-edge-primary rotate-45" />
        <div className="flex-1 h-[2px] bg-border/20" />
      </div>
    );
  }

  // Horizontal divider
  if (orientation === 'horizontal') {
    const borderStyle = variant === 'dashed' ? 'border-dashed' : 'border-solid';
    return <div className={`w-full border-t border-edge-primary/20 ${borderStyle} ${className}`} role="separator" aria-orientation="horizontal" />;
  }

  // Vertical divider
  const borderStyle = variant === 'dashed' ? 'border-dashed' : 'border-solid';
  return <div className={`h-full border-l border-edge-primary/20 ${borderStyle} ${className}`} role="separator" aria-orientation="vertical" />;
}

export default Divider;
export type { DividerOrientation, DividerVariant, DividerProps };
