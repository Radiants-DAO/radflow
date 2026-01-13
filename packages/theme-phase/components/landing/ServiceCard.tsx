import React from 'react';
import clsx from 'clsx';
import { Icon } from '../core/Icon';
import { Button } from '../core/Button';

// ============================================================================
// Types
// ============================================================================

export type ServiceCardVariant = 'default' | 'featured' | 'large';
export type ServiceCardAccent = 'default' | 'blue' | 'purple' | 'green' | 'gold';

export interface ServiceCardProps {
  /** Service icon name (for Icon component) */
  iconName?: string;
  /** Service icon image URL (alternative to iconName) */
  iconSrc?: string;
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
  variant?: ServiceCardVariant;
  /** Accent color for CTA button */
  accent?: ServiceCardAccent;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  flex flex-col
  bg-[var(--glass-bg)]
  border border-[var(--glass-border)]
  overflow-hidden
`;

const variantStyles: Record<ServiceCardVariant, string> = {
  default: `gap-[16px] p-[24px]`,
  featured: `
    gap-[16px] p-[24px]
    bg-[var(--glass-bg-gold-subtle)]
    border-[var(--glass-border-gold)]
  `,
  large: `gap-[24px] p-[24px] h-[281px] justify-between`,
};

const accentStyles: Record<ServiceCardAccent, { bg: string; border: string }> = {
  default: { bg: 'var(--glass-bg)', border: 'var(--glass-border)' },
  blue: { bg: 'rgba(128,208,255,0.1)', border: 'rgba(128,208,255,0.5)' },
  purple: { bg: 'rgba(153,163,255,0.1)', border: 'rgba(153,163,255,0.5)' },
  green: { bg: 'rgba(142,242,217,0.1)', border: 'rgba(142,242,217,0.5)' },
  gold: { bg: 'var(--glass-bg-gold)', border: 'var(--glass-border-gold-strong)' },
};

// ============================================================================
// Component
// ============================================================================

/**
 * ServiceCard component for displaying service offerings
 *
 * Features icon, title, description, and call-to-action button.
 * Use variant="large" for full-size service cards with accent-colored CTAs.
 */
export function ServiceCard({
  iconName,
  iconSrc,
  title,
  description,
  ctaText = 'Learn More',
  onCtaClick,
  ctaHref,
  variant = 'default',
  accent = 'default',
  className = '',
}: ServiceCardProps) {
  const classes = clsx(baseStyles, variantStyles[variant], className);
  const isLarge = variant === 'large';
  const accentStyle = accentStyles[accent];

  // Determine button variant based on accent
  const buttonVariant = accent === 'blue' ? 'blue'
    : accent === 'purple' ? 'purple'
    : accent === 'green' ? 'green'
    : accent === 'gold' ? 'gold'
    : 'default';

  return (
    <div className={classes}>
      {/* Top Content */}
      <div className={clsx('flex flex-col', isLarge ? 'gap-[32px]' : 'gap-[16px]')}>
        {/* Icon + Title Row */}
        {(iconName || iconSrc) && (
          <div className="flex items-center gap-[16px]">
            {iconSrc ? (
              <img src={iconSrc} alt="" className="w-[30px] h-[32px] object-contain" />
            ) : iconName ? (
              <div className="w-[32px] h-[32px] flex items-center justify-center bg-[var(--glass-bg)] rounded-full">
                <Icon name={iconName} size={20} className="text-content-primary" />
              </div>
            ) : null}
            <h3 className={clsx(
              'font-outfit font-bold text-content-primary uppercase',
              isLarge ? 'text-[32px]' : 'text-[14px] tracking-wide'
            )}>
              {title}
            </h3>
          </div>
        )}

        {/* Title (if no icon) */}
        {!iconName && !iconSrc && (
          <h3 className={clsx(
            'font-audiowide text-content-primary uppercase',
            isLarge ? 'text-[32px]' : 'text-[18px] tracking-[-0.9px]'
          )}>
            {title}
          </h3>
        )}

        {/* Description */}
        <p className={clsx(
          'font-outfit font-light text-content-secondary leading-[1.4]',
          isLarge ? 'text-[18px]' : 'text-[14px]'
        )}>
          {description}
        </p>
      </div>

      {/* CTA Button */}
      {(ctaHref || onCtaClick || ctaText) && (
        ctaHref ? (
          <Button
            as="a"
            href={ctaHref}
            variant={buttonVariant}
            size="sm"
            iconName="arrow-up-right"
            fullWidth
          >
            {ctaText}
          </Button>
        ) : (
          <Button
            variant={buttonVariant}
            size="sm"
            iconName="arrow-up-right"
            fullWidth
            onClick={onCtaClick}
          >
            {ctaText}
          </Button>
        )
      )}
    </div>
  );
}

export default ServiceCard;
