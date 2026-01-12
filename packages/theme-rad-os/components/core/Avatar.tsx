'use client';

import React, { forwardRef } from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback text (initials) or icon name */
  fallback?: string;
  /** Size preset */
  size?: AvatarSize;
  /** Shape variant */
  variant?: 'circle' | 'square';
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

// ============================================================================
// Component
// ============================================================================

/**
 * Avatar component with image fallback to initials
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    fallback,
    size = 'md',
    variant = 'circle',
    className = '',
  },
  ref
) {
  const [imageError, setImageError] = React.useState(false);
  const showFallback = !src || imageError;

  const handleImageError = () => {
    setImageError(true);
  };

  const baseClasses = clsx(
    'inline-flex items-center justify-center',
    'bg-surface-tertiary',
    'border border-edge-primary',
    'font-joystix uppercase',
    'text-content-primary',
    'overflow-hidden',
    sizeStyles[size],
    variant === 'circle' ? 'rounded-full' : 'rounded-sm',
    className
  );

  return (
    <div ref={ref} className={baseClasses}>
      {showFallback ? (
        <span className="select-none">{fallback || '?'}</span>
      ) : (
        <img
          src={src}
          alt={alt || ''}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
});

export default Avatar;
export type { AvatarProps, AvatarSize };
