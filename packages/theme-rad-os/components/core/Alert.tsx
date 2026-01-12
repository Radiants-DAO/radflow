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
  default: 'bg-surface-secondary text-content-inverted border border-edge-primary',
  success: 'bg-surface-secondary text-content-inverted border border-edge-success',
  warning: 'bg-surface-secondary text-content-inverted border border-edge-warning',
  error: 'bg-surface-secondary text-content-inverted border border-edge-error',
  info: 'bg-surface-secondary text-content-inverted border border-edge-focus',
};

const variantShadowStyles: Record<AlertVariant, string> = {
  default: 'shadow-[4px_4px_0_0_var(--color-edge-primary)]',
  success: 'shadow-[4px_4px_0_0_var(--color-edge-success)]',
  warning: 'shadow-[4px_4px_0_0_var(--color-edge-warning)]',
  error: 'shadow-[4px_4px_0_0_var(--color-edge-error)]',
  info: 'shadow-[4px_4px_0_0_var(--color-edge-focus)]',
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
        rounded-sm
        font-mondwest text-sm
        border-l-[8px]
        ${variantStyles[variant]}
        ${variantShadowStyles[variant]}
        ${className}
      `.trim()}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="flex-shrink-0">
          <Icon name={displayIconName} size={ICON_SIZES.md} className="text-content-inverted" />
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <p className="font-joystix text-xs uppercase text-content-inverted font-bold mb-1">{title}</p>}
          <div className="font-mondwest text-sm text-content-inverted/80">{children}</div>
        </div>

        {/* Close Button */}
        {closable && (
          <button onClick={onClose} className="text-content-inverted/50 hover:text-content-inverted flex-shrink-0 -mt-1" aria-label="Close">
            <Icon name="close" size={ICON_SIZES.md} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
export type { AlertVariant, AlertProps };
