import React, { useState, useEffect, useRef, ElementType, ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import { Icon, ICON_SIZES } from './Icon';
import { Spinner } from './Progress';

// ============================================================================
// Types
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
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
  font-joystix uppercase
  whitespace-nowrap
  cursor-pointer select-none
  border border-edge-primary
  rounded-sm
  shadow-btn
  hover:-translate-y-0.5
  hover:shadow-btn-hover
  active:translate-y-0.5
  active:shadow-none
  disabled:opacity-50 disabled:cursor-not-allowed
  disabled:hover:translate-y-0 disabled:hover:shadow-btn
  focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
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
  primary: `
    bg-surface-tertiary text-content-primary
    hover:bg-surface-tertiary
    active:bg-surface-tertiary
  `,
  secondary: `
    bg-surface-secondary text-content-inverted
    hover:bg-surface-secondary/90 hover:text-content-inverted
    active:bg-surface-tertiary active:text-content-primary
  `,
  outline: `
    bg-transparent text-content-primary
    shadow-none
    hover:bg-surface-secondary/5 hover:!translate-y-0 hover:shadow-none
    active:bg-surface-tertiary active:!translate-y-0 active:shadow-none
  `,
  ghost: `
    bg-transparent text-content-primary
    border-transparent
    shadow-none
    hover:bg-transparent hover:border-edge-primary hover:text-content-primary hover:shadow-none hover:translate-y-0
    active:bg-surface-tertiary active:text-content-primary active:border-edge-primary active:translate-y-0
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
  variant = 'primary',
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
