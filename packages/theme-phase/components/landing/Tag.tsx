import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export type TagVariant = 'default' | 'outline' | 'accent';

export interface TagProps {
  /** Tag content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: TagVariant;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  inline-flex items-center justify-center
  font-kodemono font-normal text-[12px] uppercase
  px-[9px] py-[5px]
  leading-[15px]
`;

const variantStyles: Record<TagVariant, string> = {
  default: `
    border border-[var(--color-edge-dark)]
    text-content-primary
    bg-transparent
  `,
  outline: `
    border border-[var(--glass-border)]
    text-content-primary
    bg-transparent
  `,
  accent: `
    border border-[var(--glass-border-gold)]
    text-[var(--color-gold)]
    bg-[var(--glass-bg-gold-minimal)]
  `,
};

// ============================================================================
// Component
// ============================================================================

/**
 * Tag component for categorization and labeling
 *
 * Used for technical tags, categories, and small labels
 */
export function Tag({
  children,
  variant = 'default',
  className = '',
}: TagProps) {
  const classes = clsx(baseStyles, variantStyles[variant], className);

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

export default Tag;
