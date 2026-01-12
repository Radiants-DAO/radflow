'use client';

import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

interface SkeletonProps {
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Width (CSS value or number) */
  width?: string | number;
  /** Height (CSS value or number) */
  height?: string | number;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Skeleton loading placeholder with pulse animation
 */
export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = '',
}: SkeletonProps) {
  const widthStyle = width
    ? typeof width === 'number'
      ? `${width}px`
      : width
    : undefined;
  const heightStyle = height
    ? typeof height === 'number'
      ? `${height}px`
      : height
    : undefined;

  const baseClasses = clsx(
    'animate-pulse',
    variant === 'circular' && 'rounded-full',
    variant === 'text' && 'rounded-sm',
    variant === 'rectangular' && 'rounded-sm',
    className
  );

  return (
    <div
      className={baseClasses}
      style={{
        width: widthStyle,
        height: heightStyle,
        backgroundColor: 'transparent',
        backgroundImage: `
          radial-gradient(circle, var(--color-black) 0.5px, transparent 0.5px),
          radial-gradient(circle, var(--color-black) 0.5px, transparent 0.5px)
        `,
        backgroundSize: '2px 4px, 2px 4px',
        backgroundPosition: '0 0, 1px 2px',
        backgroundRepeat: 'repeat',
      }}
      aria-label="Loading"
      role="status"
    />
  );
}

export default Skeleton;
export type { SkeletonProps };
