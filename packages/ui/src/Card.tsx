import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

type CardVariant = 'default' | 'dark' | 'raised';

interface CardProps {
  /** Visual variant */
  variant?: CardVariant;
  /** Card content */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
  /** Optional padding override */
  noPadding?: boolean;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  border border-edge-primary
  rounded-md
  overflow-hidden
`;

const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-surface-primary text-content-primary
  `,
  dark: `
    bg-surface-secondary text-content-inverted
  `,
  raised: `
    bg-surface-primary text-content-primary
    shadow-card
  `,
};

// ============================================================================
// Component
// ============================================================================

/**
 * Card container component with consistent styling
 */
export function Card({ variant = 'default', children, className = '', noPadding = false }: CardProps) {
  const classes = [baseStyles, variantStyles[variant], noPadding ? '' : 'p-4', className]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return <div className={classes}>{children}</div>;
}

// ============================================================================
// Card Sub-components
// ============================================================================

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card header with bottom border
 */
export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`px-4 py-3 border-b border-edge-primary ${className}`}>{children}</div>;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card body with standard padding
 */
export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card footer with top border
 */
export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`px-4 py-3 border-t border-edge-primary ${className}`}>{children}</div>;
}

export default Card;
export type { CardVariant, CardProps };
