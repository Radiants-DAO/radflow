import React from 'react';
import { Icon, ICON_SIZES } from './Icon';

// ============================================================================
// Types
// ============================================================================

type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  /** Alert variant */
  variant?: AlertVariant;
  /** Alert title */
  title?: string;
  /** Alert content */
  children: React.ReactNode;
  /** Show close button */
  closable?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Icon name (filename without .svg extension) - overrides variant default */
  iconName?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const variantStyles: Record<AlertVariant, string> = {
  default: 'bg-[var(--glass-bg)] text-content-primary border border-[var(--glass-border)]',
  success: 'bg-[var(--glass-bg-green)] text-content-primary border border-[var(--glass-border-green)]',
  warning: 'bg-[var(--glass-bg-gold)] text-content-primary border border-[var(--glass-border-gold)]',
  error: 'bg-[var(--glass-bg-error)] text-content-primary border border-[var(--glass-border-error)]',
  info: 'bg-[var(--glass-bg-blue)] text-content-primary border border-[var(--glass-border-blue)]',
};

const variantBorderColors: Record<AlertVariant, string> = {
  default: 'border-l-[var(--color-content-tertiary)]',
  success: 'border-l-success',
  warning: 'border-l-[var(--color-gold)]',
  error: 'border-l-[var(--color-error-red)]',
  info: 'border-l-[var(--color-blue)]',
};

const variantIconMap: Record<AlertVariant, string> = {
  default: 'info',
  success: 'checkmark',
  warning: 'warning-filled',
  error: 'close',
  info: 'info',
};

// ============================================================================
// Component
// ============================================================================

/**
 * Alert component - Static alert banners
 */
export function Alert({ variant = 'default', title, children, closable = false, onClose, iconName, className = '' }: AlertProps) {
  const displayIconName = iconName || variantIconMap[variant];

  return (
    <div
      role="alert"
      className={`
        p-3
        font-outfit text-sm
        border-l-4
        ${variantStyles[variant]}
        ${variantBorderColors[variant]}
        ${className}
      `.trim()}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="flex-shrink-0">
          <Icon name={displayIconName} size={ICON_SIZES.md} className="text-content-primary" />
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <p className="font-kodemono text-xs uppercase text-content-primary font-bold mb-1">{title}</p>}
          <div className="font-outfit text-sm text-[var(--color-content-medium)]">{children}</div>
        </div>

        {/* Close Button */}
        {closable && (
          <button onClick={onClose} className="text-[var(--color-content-tertiary)] hover:text-content-primary flex-shrink-0 -mt-1 transition-colors" aria-label="Close">
            <Icon name="close" size={ICON_SIZES.md} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
export type { AlertVariant, AlertProps };
