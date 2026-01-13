import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export type TeamMemberSize = 'sm' | 'md' | 'lg';
export type TeamMemberLayout = 'vertical' | 'horizontal';

export interface TeamMemberProps {
  /** Member name */
  name: string;
  /** Member role/title */
  role: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Size variant */
  size?: TeamMemberSize;
  /** Layout direction */
  layout?: TeamMemberLayout;
  /** Link URL (e.g., Twitter profile) */
  href?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<TeamMemberSize, { avatar: string; name: string; role: string }> = {
  sm: {
    avatar: 'w-[48px] h-[48px]',
    name: 'text-[14px]',
    role: 'text-[12px]',
  },
  md: {
    avatar: 'w-[64px] h-[64px]',
    name: 'text-[20px]',
    role: 'text-[16px]',
  },
  lg: {
    avatar: 'w-[80px] h-[80px]',
    name: 'text-[24px]',
    role: 'text-[18px]',
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * TeamMember component for displaying team/staff members
 *
 * Shows avatar with name and role. Supports vertical (stacked) and
 * horizontal (side-by-side) layouts, and optional link wrapping.
 */
export function TeamMember({
  name,
  role,
  avatarUrl,
  size = 'md',
  layout = 'vertical',
  href,
  className = '',
}: TeamMemberProps) {
  const styles = sizeStyles[size];
  const isHorizontal = layout === 'horizontal';

  const content = (
    <>
      {/* Avatar */}
      <div
        className={clsx(
          styles.avatar,
          'overflow-hidden shrink-0',
          'flex items-center justify-center'
        )}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-outfit font-bold text-content-secondary">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col leading-none">
        <p className={clsx('font-outfit font-bold text-content-primary uppercase', styles.name)}>
          {name}
        </p>
        <p className={clsx('font-kodemono font-normal text-[var(--color-gold)]', styles.role)}>
          {role}
        </p>
      </div>
    </>
  );

  const containerClasses = clsx(
    'flex gap-[12px]',
    isHorizontal ? 'flex-row items-center' : 'flex-col items-start',
    isHorizontal && 'bg-[var(--glass-bg)] border border-[var(--glass-border)] h-[96px] p-[16px] hover:bg-[var(--glass-bg-hover)] transition-colors',
    className
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(containerClasses, 'cursor-pointer')}
      >
        {content}
      </a>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}

export default TeamMember;
