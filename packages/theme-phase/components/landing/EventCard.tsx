import React from 'react';
import clsx from 'clsx';
import { Icon } from '../core/Icon';

// ============================================================================
// Types
// ============================================================================

export interface EventCardProps {
  /** Event title */
  title: string;
  /** Event date */
  date?: string;
  /** CTA text */
  ctaText?: string;
  /** Icon name for event type */
  iconName?: string;
  /** Click handler */
  onClick?: () => void;
  /** Link href */
  href?: string;
  /** Video thumbnail URL */
  thumbnailUrl?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  flex flex-col justify-between
  w-[405px] h-[182px]
  px-[24px] py-[24px]
  bg-[var(--glass-bg)]
  border border-[var(--glass-border)]
  cursor-pointer
  transition-all duration-200
  hover:bg-[var(--glass-bg-hover)]
`;

// ============================================================================
// Component
// ============================================================================

/**
 * EventCard component for events, videos, and livestreams
 *
 * Shows icon/thumbnail with title and action CTA
 */
export function EventCard({
  title,
  date,
  ctaText = 'WATCH ON X',
  iconName = 'play-circle',
  onClick,
  href,
  thumbnailUrl,
  className = '',
}: EventCardProps) {
  const classes = clsx(baseStyles, className);

  const content = (
    <>
      {/* Header with icon and date */}
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full flex items-center justify-center">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt=""
              className="w-[16px] h-[16px] object-cover"
            />
          ) : (
            <Icon name={iconName} size={16} className="text-[var(--color-gold)]" />
          )}
        </div>
        {date && (
          <span className="font-kodemono font-normal text-[12px] text-content-secondary">
            {date}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-audiowide text-[18px] text-content-primary uppercase tracking-[-0.9px] leading-[22.5px]">
        {title}
      </h3>

      {/* CTA */}
      <div className="flex items-center justify-between">
        <span className="font-kodemono font-normal text-[12px] text-content-secondary uppercase">
          {ctaText}
        </span>
        <Icon name="external-link" size={10} className="text-content-secondary" />
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <div className={classes} onClick={onClick} role="button" tabIndex={0}>
      {content}
    </div>
  );
}

export default EventCard;
