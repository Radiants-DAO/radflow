import React from 'react';
import clsx from 'clsx';

// ============================================================================
// Types
// ============================================================================

export type StatCardVariant = 'default' | 'compact' | 'highlight';

export interface StatCardProps {
  /** Stat label (e.g., "/native", "/liquid") */
  label: string;
  /** Stat value (e.g., "9% APR", "$700M+") */
  value: string;
  /** Visual variant */
  variant?: StatCardVariant;
  /** Optional sublabel */
  sublabel?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  flex flex-col items-end
  bg-[var(--glass-bg)]
  border border-[var(--glass-border)]
  overflow-clip
`;

const variantStyles: Record<StatCardVariant, string> = {
  default: `p-[12px] gap-px`,
  compact: `p-[8px] gap-0`,
  highlight: `
    p-[16px] gap-[4px]
    bg-[var(--glass-bg-gold-minimal)]
    border-[var(--glass-border-gold)]
  `,
};

// ============================================================================
// Component
// ============================================================================

/**
 * StatCard component for displaying metrics
 *
 * Shows a label with a highlighted value, used for APR rates,
 * validator counts, and other statistics
 */
export function StatCard({
  label,
  value,
  variant = 'default',
  sublabel,
  className = '',
}: StatCardProps) {
  const classes = clsx(baseStyles, variantStyles[variant], className);

  return (
    <div className={classes}>
      <p className="font-outfit font-bold text-[16px] text-content-primary uppercase">
        {label}
      </p>
      <p className="font-kodemono font-normal text-[20px] text-[var(--color-gold)]">
        {value}
      </p>
      {sublabel && (
        <p className="font-kodemono font-normal text-[12px] text-content-secondary">
          {sublabel}
        </p>
      )}
    </div>
  );
}

export default StatCard;
