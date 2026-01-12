import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export interface LogoItem {
  /** Logo image URL */
  src: string;
  /** Alt text */
  alt: string;
  /** Optional link */
  href?: string;
}

export interface LogoGridProps {
  /** Logo items */
  logos: LogoItem[];
  /** Number of columns */
  columns?: number;
  /** Logo size */
  logoSize?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const logoSizeStyles = {
  sm: 'h-[24px] max-w-[80px]',
  md: 'h-[32px] max-w-[120px]',
  lg: 'h-[48px] max-w-[160px]',
};

// ============================================================================
// Component
// ============================================================================

/**
 * LogoGrid component for displaying partner/integration logos
 *
 * Responsive grid layout with optional links
 */
export function LogoGrid({
  logos,
  columns = 6,
  logoSize = 'md',
  className = '',
}: LogoGridProps) {
  const sizeClass = logoSizeStyles[logoSize];

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center justify-center gap-[32px]',
        className
      )}
      style={{
        maxWidth: columns * 160 + (columns - 1) * 32,
      }}
    >
      {logos.map((logo, index) => {
        const logoElement = (
          <img
            src={logo.src}
            alt={logo.alt}
            className={clsx(
              sizeClass,
              'object-contain opacity-60 hover:opacity-100 transition-opacity duration-200'
            )}
          />
        );

        if (logo.href) {
          return (
            <a
              key={index}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              {logoElement}
            </a>
          );
        }

        return (
          <div key={index} className="flex items-center justify-center">
            {logoElement}
          </div>
        );
      })}
    </div>
  );
}

export default LogoGrid;
