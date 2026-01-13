import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export type SectionHeaderSize = 'sm' | 'md' | 'lg';
export type SectionHeaderAlign = 'left' | 'center';

export interface SectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Label/eyebrow text */
  label?: string;
  /** Size variant */
  size?: SectionHeaderSize;
  /** Text alignment */
  align?: SectionHeaderAlign;
  /** Show decorative line below */
  showLine?: boolean;
  /** Show left border decoration */
  showLeftBorder?: boolean;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles: Record<SectionHeaderSize, { title: string; subtitle: string; label: string }> = {
  sm: {
    title: 'text-[24px] tracking-[-1.2px]',
    subtitle: 'text-[14px]',
    label: 'text-[10px]',
  },
  md: {
    title: 'text-[36px] tracking-[-1.8px]',
    subtitle: 'text-[16px]',
    label: 'text-[12px]',
  },
  lg: {
    title: 'text-[48px] tracking-[-2.4px]',
    subtitle: 'text-[18px]',
    label: 'text-[14px]',
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * SectionHeader component for page sections
 *
 * Displays section title with optional label and subtitle.
 * Use showLeftBorder for the Phase section header style with left border accent.
 */
export function SectionHeader({
  title,
  subtitle,
  label,
  size = 'md',
  align = 'left',
  showLine = false,
  showLeftBorder = false,
  className = '',
}: SectionHeaderProps) {
  const styles = sizeStyles[size];
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={clsx(
      'flex flex-col gap-[8px]',
      alignClass,
      showLeftBorder && 'border-l border-[var(--glass-border)] pl-[32px]',
      className
    )}>
      {/* Label/Eyebrow */}
      {label && (
        <span className={clsx(
          'font-kodemono font-semibold uppercase text-content-secondary',
          styles.label
        )}>
          {label}
        </span>
      )}

      {/* Title */}
      <h2 className={clsx(
        'font-audiowide uppercase text-content-primary tracking-[0.3px]',
        styles.title
      )}>
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className={clsx(
          'font-outfit font-light text-content-secondary max-w-[600px]',
          styles.subtitle
        )}>
          {subtitle}
        </p>
      )}

      {/* Decorative Line */}
      {showLine && (
        <div className="w-full h-px bg-[var(--glass-border-subtle)] mt-[16px]" />
      )}
    </div>
  );
}

export default SectionHeader;
