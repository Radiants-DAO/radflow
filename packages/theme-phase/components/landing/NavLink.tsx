import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export type NavLinkVariant = 'default' | 'large' | 'footer';

export interface NavLinkProps {
  /** Link text */
  children: React.ReactNode;
  /** Link href */
  href?: string;
  /** Active state */
  active?: boolean;
  /** Visual variant */
  variant?: NavLinkVariant;
  /** Click handler */
  onClick?: () => void;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  font-outfit font-semibold uppercase
  text-content-primary
  transition-colors duration-200
  cursor-pointer
`;

const variantStyles: Record<NavLinkVariant, string> = {
  default: `
    text-[18px]
    hover:text-[var(--color-gold)]
  `,
  large: `
    text-[32px]
    hover:text-[var(--color-gold)]
  `,
  footer: `
    text-[14px]
    font-kodemono font-normal
    text-content-secondary
    hover:text-content-primary
  `,
};

const activeStyles = 'text-[var(--color-gold)]';

// ============================================================================
// Component
// ============================================================================

/**
 * NavLink component for navigation links
 *
 * Supports multiple variants for different navigation contexts
 */
export function NavLink({
  children,
  href,
  active = false,
  variant = 'default',
  onClick,
  className = '',
}: NavLinkProps) {
  const classes = clsx(
    baseStyles,
    variantStyles[variant],
    active && activeStyles,
    className
  );

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export default NavLink;
