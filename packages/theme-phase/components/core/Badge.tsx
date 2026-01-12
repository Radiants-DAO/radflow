import React from 'react';

// ============================================================================
// Types
// ============================================================================

type BadgeVariant = 'default' | 'outline' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  /** Visual variant */
  variant?: BadgeVariant;
  /** Size preset */
  size?: BadgeSize;
  /** Badge content */
  children: React.ReactNode;
  /** Optional icon (emoji or component) */
  icon?: React.ReactNode;
  /** Click handler (makes badge interactive) */
  onClick?: () => void;
  /** Disabled state (only applies when onClick is provided) */
  disabled?: boolean;
  /** Additional classes */
  className?: string;
}

interface BadgeGroupProps {
  /** Badges to display */
  children: React.ReactNode;
  /** Gap between badges */
  gap?: 'sm' | 'md';
  /** Wrap badges */
  wrap?: boolean;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  inline-flex items-center justify-center
  font-kodemono uppercase
  whitespace-nowrap
  transition-all duration-200
`;

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-2xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--glass-bg)] text-[var(--color-content-subtle)] border border-[var(--glass-border)]',
  outline: 'bg-transparent text-content-primary border border-[var(--glass-border-tertiary)]',
  success: 'bg-[var(--glass-bg-green)] text-success border border-[var(--glass-border-green)]',
  warning: 'bg-[var(--glass-bg-gold)] text-[var(--color-gold)] border border-[var(--glass-border-gold)]',
  error: 'bg-[var(--glass-bg-error)] text-[var(--color-error-red)] border border-[var(--glass-border-error)]',
  info: 'bg-[var(--glass-bg-blue)] text-[var(--color-blue)] border border-[var(--glass-border-blue)]',
};

const interactiveStyles = `
  cursor-pointer
  hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)]
  active:bg-[var(--glass-bg-active)]
  focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-edge-focus-purple)]
`;

// ============================================================================
// Component
// ============================================================================

/**
 * Badge component for status indicators, labels, and interactive tags
 */
export function Badge({ variant = 'default', size = 'md', children, icon, onClick, disabled = false, className = '' }: BadgeProps) {
  const classes = [baseStyles, sizeStyles[size], variantStyles[variant], onClick && !disabled ? interactiveStyles : '', disabled ? 'opacity-50 cursor-not-allowed' : '', className]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const Element = onClick ? 'button' : 'span';

  return (
    <Element className={classes} onClick={onClick && !disabled ? onClick : undefined} disabled={onClick ? disabled : undefined} type={onClick ? 'button' : undefined}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </Element>
  );
}

// ============================================================================
// BadgeGroup
// ============================================================================

/**
 * BadgeGroup component for displaying rows of badges
 */
export function BadgeGroup({ children, gap = 'sm', wrap = true, className = '' }: BadgeGroupProps) {
  const gapStyles = {
    sm: 'gap-1',
    md: 'gap-2',
  };

  return (
    <div
      className={`
        flex items-center
        ${gapStyles[gap]}
        ${wrap ? 'flex-wrap' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Badge;
export type { BadgeVariant, BadgeSize, BadgeProps, BadgeGroupProps };
