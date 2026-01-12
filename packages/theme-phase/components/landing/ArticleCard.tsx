import React from 'react';
import clsx from 'clsx';
import { Tag } from './Tag';
import { Icon } from '../core/Icon';

// ============================================================================
// Types
// ============================================================================

export type ArticleCardVariant = 'default' | 'featured' | 'compact';

export interface ArticleCardProps {
  /** Article title */
  title: string;
  /** Article excerpt/description */
  description?: string;
  /** Publication date */
  date?: string;
  /** Category tags */
  tags?: string[];
  /** CTA text */
  ctaText?: string;
  /** Click handler */
  onClick?: () => void;
  /** Link href */
  href?: string;
  /** Visual variant */
  variant?: ArticleCardVariant;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  flex gap-[16px]
  border-b border-[var(--glass-border-subtle)]
  pb-[24px]
  cursor-pointer
  transition-all duration-200
  hover:border-[var(--glass-border)]
`;

const variantStyles: Record<ArticleCardVariant, string> = {
  default: `flex-row items-start`,
  featured: `flex-row items-start border-[var(--glass-border-gold)]`,
  compact: `flex-col items-start gap-[12px]`,
};

// ============================================================================
// Component
// ============================================================================

/**
 * ArticleCard component for blog posts and articles
 *
 * Displays date, tags, title, description, and read more CTA
 */
export function ArticleCard({
  title,
  description,
  date,
  tags = [],
  ctaText = 'READ TRANSMISSION',
  onClick,
  href,
  variant = 'default',
  className = '',
}: ArticleCardProps) {
  const classes = clsx(baseStyles, variantStyles[variant], className);

  const content = (
    <>
      {/* Left column - date and tags */}
      <div className="flex flex-col gap-[8px] items-start w-[288px] shrink-0">
        {date && (
          <p className="font-outfit font-normal text-[14px] text-content-secondary leading-[20px]">
            {date}
          </p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-[8px]">
            {tags.map((tag, i) => (
              <Tag key={i} variant="default">
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Right column - content */}
      <div className="flex flex-col gap-[16px] flex-1">
        <h3 className="font-audiowide text-[36px] text-content-primary uppercase tracking-[-1.8px] leading-[40px]">
          {title}
        </h3>
        {description && (
          <p className="font-outfit font-light text-[18px] text-content-secondary leading-[1.625] line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center gap-[8px]">
          <span className="font-kodemono font-normal text-[14px] text-content-primary">
            {ctaText}
          </span>
          <Icon name="arrow-right" size={16} className="text-content-primary" />
        </div>
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

export default ArticleCard;
