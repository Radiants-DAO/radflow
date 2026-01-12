import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export type TeamMemberSize = 'sm' | 'md' | 'lg';

export interface TeamMemberProps {
  /** Member name */
  name: string;
  /** Member role/title */
  role: string;
  /** Avatar image URL */
  avatarUrl?: string;
  /** Size variant */
  size?: TeamMemberSize;
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
 * Shows avatar with name and role below
 */
export function TeamMember({
  name,
  role,
  avatarUrl,
  size = 'md',
  className = '',
}: TeamMemberProps) {
  const styles = sizeStyles[size];

  return (
    <div className={clsx('flex flex-col gap-[8px] items-start', className)}>
      {/* Avatar */}
      <div
        className={clsx(
          styles.avatar,
          'bg-[var(--glass-bg-hover)] overflow-hidden',
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
    </div>
  );
}

export default TeamMember;
