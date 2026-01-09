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
  default: 'bg-surface-primary border-edge-primary text-content-primary',
  success: 'bg-surface-primary border-edge-success text-content-primary',
  warning: 'bg-surface-primary border-edge-warning text-content-primary',
  error: 'bg-surface-primary border-edge-error text-content-primary',
  info: 'bg-surface-primary border-edge-focus text-content-primary',
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
        p-4
        border-2
        rounded-sm
        ${variantStyles[variant]}
        ${className}
      `.trim()}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="flex-shrink-0">
          <Icon name={displayIconName} size={ICON_SIZES.md} />
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <p className="font-joystix text-xs uppercase mb-1">{title}</p>}
          <div className="font-mondwest text-base text-content-primary/80">{children}</div>
        </div>

        {/* Close Button */}
        {closable && (
          <button onClick={onClose} className="text-content-primary/50 hover:text-content-primary flex-shrink-0 -mt-1" aria-label="Close">
            <Icon name="close" size={ICON_SIZES.md} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
export type { AlertVariant, AlertProps };
