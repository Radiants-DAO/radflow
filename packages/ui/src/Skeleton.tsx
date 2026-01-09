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
    'bg-surface-secondary/10',
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
      }}
      aria-label="Loading"
      role="status"
    />
  );
}

export default Skeleton;
export type { SkeletonProps };
