import React from 'react';
import clsx from 'clsx';
import { Icon } from '../core/Icon';
import { Button } from '../core/Button';

// ============================================================================
// Types
// ============================================================================

export interface ServiceCardProps {
  /** Service icon name */
  iconName?: string;
  /** Service title */
  title: string;
  /** Service description */
  description: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** CTA href for link variant */
  ctaHref?: string;
  /** Visual variant */
  variant?: 'default' | 'featured';
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  flex flex-col gap-[16px]
  bg-[var(--glass-bg-subtle)]
  border border-[var(--glass-border-subtle)]
  p-[24px]
`;

const variantStyles = {
  default: ``,
  featured: `
    bg-[var(--glass-bg-gold-subtle)]
    border-[var(--glass-border-gold)]
  `,
};

// ============================================================================
// Component
// ============================================================================

/**
 * ServiceCard component for displaying service offerings
 *
 * Features icon, title, description, and call-to-action button
 */
export function ServiceCard({
  iconName,
  title,
  description,
  ctaText = 'Learn More',
  onCtaClick,
  ctaHref,
  variant = 'default',
  className = '',
}: ServiceCardProps) {
  const classes = clsx(baseStyles, variantStyles[variant], className);

  return (
    <div className={classes}>
      {/* Icon */}
      {iconName && (
        <div className="flex items-center gap-[8px]">
          <div className="w-[32px] h-[32px] flex items-center justify-center bg-[var(--glass-bg)] rounded-full">
            <Icon name={iconName} size={20} className="text-content-primary" />
          </div>
          <span className="font-outfit font-bold text-[14px] text-content-primary uppercase tracking-wide">
            {title}
          </span>
        </div>
      )}

      {/* Title (if no icon) */}
      {!iconName && (
        <h3 className="font-audiowide text-[18px] text-content-primary uppercase tracking-[-0.9px]">
          {title}
        </h3>
      )}

      {/* Description */}
      <p className="font-outfit font-light text-[14px] text-content-secondary leading-[1.5]">
        {description}
      </p>

      {/* CTA Button */}
      {ctaHref ? (
        <Button
          as="a"
          href={ctaHref}
          variant="default"
          size="sm"
          iconName="arrow-right"
          fullWidth
        >
          {ctaText}
        </Button>
      ) : onCtaClick ? (
        <Button
          variant="default"
          size="sm"
          iconName="arrow-right"
          fullWidth
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      ) : null}
    </div>
  );
}

export default ServiceCard;
