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
  default: 'bg-[rgba(243,238,217,0.05)] text-[rgba(243,238,217,0.6)] border border-[rgba(243,238,217,0.2)]',
  outline: 'bg-transparent text-[#f3eed9] border border-[rgba(243,238,217,0.3)]',
  success: 'bg-[rgba(142,242,217,0.1)] text-[#8ef2d9] border border-[rgba(142,242,217,0.3)]',
  warning: 'bg-[rgba(252,225,132,0.1)] text-[#fce184] border border-[rgba(252,225,132,0.3)]',
  error: 'bg-[rgba(255,100,100,0.1)] text-[#ff6464] border border-[rgba(255,100,100,0.3)]',
  info: 'bg-[rgba(128,208,255,0.1)] text-[#80d0ff] border border-[rgba(128,208,255,0.3)]',
};

const interactiveStyles = `
  cursor-pointer
  hover:bg-[rgba(243,238,217,0.1)] hover:border-[rgba(243,238,217,0.4)]
  active:bg-[rgba(243,238,217,0.15)]
  focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(153,163,255,0.5)]
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
