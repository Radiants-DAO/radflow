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
  default: 'bg-[rgba(243,238,217,0.05)] text-[#f3eed9] border border-[rgba(243,238,217,0.2)]',
  success: 'bg-[rgba(142,242,217,0.1)] text-[#f3eed9] border border-[rgba(142,242,217,0.3)]',
  warning: 'bg-[rgba(252,225,132,0.1)] text-[#f3eed9] border border-[rgba(252,225,132,0.3)]',
  error: 'bg-[rgba(255,100,100,0.1)] text-[#f3eed9] border border-[rgba(255,100,100,0.3)]',
  info: 'bg-[rgba(128,208,255,0.1)] text-[#f3eed9] border border-[rgba(128,208,255,0.3)]',
};

const variantBorderColors: Record<AlertVariant, string> = {
  default: 'border-l-[rgba(243,238,217,0.5)]',
  success: 'border-l-[#8ef2d9]',
  warning: 'border-l-[#fce184]',
  error: 'border-l-[#ff6464]',
  info: 'border-l-[#80d0ff]',
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
          <Icon name={displayIconName} size={ICON_SIZES.md} className="text-[#f3eed9]" />
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <p className="font-kodemono text-xs uppercase text-[#f3eed9] font-bold mb-1">{title}</p>}
          <div className="font-outfit text-sm text-[rgba(243,238,217,0.8)]">{children}</div>
        </div>

        {/* Close Button */}
        {closable && (
          <button onClick={onClose} className="text-[rgba(243,238,217,0.5)] hover:text-[#f3eed9] flex-shrink-0 -mt-1 transition-colors" aria-label="Close">
            <Icon name="close" size={ICON_SIZES.md} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
export type { AlertVariant, AlertProps };
