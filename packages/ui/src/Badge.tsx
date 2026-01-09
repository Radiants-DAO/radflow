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
  font-joystix uppercase
  rounded-sm
  whitespace-nowrap
`;

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-2xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-primary text-content-primary/50 border border-edge-primary',
  outline: 'bg-transparent text-content-primary border border-edge-primary/50',
  success: 'bg-surface-success text-content-primary border border-edge-primary',
  warning: 'bg-surface-tertiary text-content-primary border border-edge-primary',
  error: 'bg-surface-error text-content-inverted border border-edge-primary',
  info: 'bg-surface-info text-content-primary border border-edge-primary',
};

const interactiveStyles = `
  cursor-pointer
  hover:bg-surface-tertiary hover:border-edge-primary
  active:bg-surface-tertiary/80
  focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
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
