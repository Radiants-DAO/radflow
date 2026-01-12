import React, { useState, useEffect, useRef, ElementType, ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import { Icon, ICON_SIZES } from './Icon';
import { Spinner } from './Progress';

// ============================================================================
// Types
// ============================================================================

type ButtonVariant = 'default' | 'blue' | 'purple' | 'green' | 'gold' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Expand to fill container width */
  fullWidth?: boolean;
  /** Square button with icon only (no text) */
  iconOnly?: boolean;
  /** Icon name (filename without .svg extension) */
  iconName?: string;
  /** Show loading spinner (only applies to buttons with icons) */
  loading?: boolean;
  /** Button content (optional when iconOnly is true) */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Enable copy button mode */
  copyButton?: boolean;
  /** Callback when copy button is clicked */
  onCopy?: () => Promise<void> | void;
}

type PolymorphicButtonProps<C extends ElementType = 'button'> = BaseButtonProps & {
  /** The element type to render as (button, a, or custom component) */
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof BaseButtonProps | 'as'>;

// ============================================================================
// Styles
// ============================================================================

const baseStyles = `
  inline-flex items-center
  font-outfit
  whitespace-nowrap
  cursor-pointer select-none
  border
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(153,163,255,0.5)]
`;

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-3',
  md: 'h-8 px-3 text-xs gap-3',
  lg: 'h-8 px-3 text-sm gap-3',
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: 'w-8 h-8 p-0',
  md: 'w-8 h-8 p-0',
  lg: 'w-8 h-8 p-0',
};

const variantStyles: Record<ButtonVariant, string> = {
  default: `
    bg-[rgba(243,238,217,0.05)] border-[rgba(243,238,217,0.2)] text-[#f3eed9]
    hover:bg-[rgba(243,238,217,0.1)] hover:border-[rgba(243,238,217,0.3)]
    active:bg-[rgba(243,238,217,0.15)]
  `,
  blue: `
    bg-[rgba(128,208,255,0.1)] border-[rgba(128,208,255,0.5)] text-[#f3eed9]
    hover:bg-[rgba(128,208,255,0.15)] hover:border-[rgba(128,208,255,0.6)]
    active:bg-[rgba(128,208,255,0.2)]
  `,
  purple: `
    bg-[rgba(153,163,255,0.1)] border-[rgba(153,163,255,0.5)] text-[#f3eed9]
    hover:bg-[rgba(153,163,255,0.15)] hover:border-[rgba(153,163,255,0.6)]
    active:bg-[rgba(153,163,255,0.2)]
  `,
  green: `
    bg-[rgba(142,242,217,0.1)] border-[rgba(142,242,217,0.5)] text-[#f3eed9]
    hover:bg-[rgba(142,242,217,0.15)] hover:border-[rgba(142,242,217,0.6)]
    active:bg-[rgba(142,242,217,0.2)]
  `,
  gold: `
    bg-[rgba(252,225,132,0.1)] border-[rgba(252,225,132,0.5)] text-[#f3eed9]
    hover:bg-[rgba(252,225,132,0.15)] hover:border-[rgba(252,225,132,0.6)]
    active:bg-[rgba(252,225,132,0.2)]
  `,
  ghost: `
    bg-transparent border-transparent text-[#f3eed9]
    hover:bg-[rgba(243,238,217,0.05)] hover:border-[rgba(243,238,217,0.1)]
    active:bg-[rgba(243,238,217,0.1)]
  `,
};

// ============================================================================
// Helper Functions
// ============================================================================

function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  iconOnly: boolean,
  fullWidth: boolean,
  className: string,
  hasIcon: boolean
): string {
  let justifyClass = 'justify-start';
  if (iconOnly) {
    justifyClass = 'justify-center';
  } else if (fullWidth && hasIcon) {
    justifyClass = 'justify-between';
  }

  return [baseStyles, iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size], justifyClass, variantStyles[variant], fullWidth ? 'w-full' : '', className]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// Component
// ============================================================================

/**
 * Button component with retro lift effect
 *
 * Supports polymorphic rendering:
 * - Default: renders as <button>
 * - With as="a": renders as <a> tag
 * - With as={CustomLink}: renders as custom component (e.g., Next.js Link)
 */
export function Button<C extends ElementType = 'button'>({
  as,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  iconOnly = false,
  iconName,
  loading = false,
  children,
  className = '',
  copyButton = false,
  onCopy,
  ...rest
}: PolymorphicButtonProps<C>) {
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const iconSize = size === 'sm' ? ICON_SIZES.sm : size === 'lg' ? ICON_SIZES.lg : ICON_SIZES.md;

  const effectiveIconName = copyButton ? (copied ? 'copied-to-clipboard' : 'copy-to-clipboard') : iconName;

  const hasIcon = Boolean(effectiveIconName || iconOnly);
  const showLoading = Boolean(loading && hasIcon);

  const classes = getButtonClasses(variant, size, iconOnly, fullWidth, className, hasIcon);

  const handleClick = async (e: React.MouseEvent) => {
    if (copyButton && onCopy) {
      try {
        await onCopy();
        setCopied(true);
        if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
      } catch {
        // Failed to copy - don't update state
      }
      return;
    }

    if ('onClick' in rest && typeof rest.onClick === 'function') {
      (rest.onClick as (e: React.MouseEvent) => void)(e);
    }
  };

  const content = showLoading ? (
    <>
      {!iconOnly && children}
      <Spinner size={iconSize} />
    </>
  ) : effectiveIconName ? (
    <>
      {!iconOnly && children}
      <Icon name={effectiveIconName} size={iconSize} />
    </>
  ) : (
    children
  );

  const Component = as || 'button';

  const buttonProps = {
    className: classes,
    onClick: copyButton ? handleClick : rest.onClick,
    ...(Component === 'button' && { type: 'button' as const }),
    ...(Component === 'button' && { disabled: showLoading || rest.disabled }),
    ...rest,
  };

  return <Component {...buttonProps}>{content}</Component>;
}

export default Button;
export type { ButtonVariant, ButtonSize, BaseButtonProps };
