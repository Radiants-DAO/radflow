import React, { useState, useEffect, useRef, ElementType, ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import { Icon, ICON_SIZES } from './Icon';
import { Spinner } from './Progress';

// ============================================================================
// Types
// ============================================================================

type ButtonVariant = 'default' | 'blue' | 'purple' | 'green' | 'gold' | 'ghost' | 'text';
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
  font-outfit font-bold uppercase
  whitespace-nowrap
  cursor-pointer select-none
  border overflow-clip
  transition-all duration-200
  disabled:opacity-25 disabled:cursor-not-allowed
  focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-edge-focus-purple)]
`;

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-[40px] pl-3 pr-0 text-sm gap-0',
  md: 'h-[40px] pl-3 pr-0 text-[0.875rem] gap-0',
  lg: 'h-[40px] pl-3 pr-0 text-[0.875rem] gap-0',
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: 'w-[40px] h-[40px] p-0',
  md: 'w-[40px] h-[40px] p-0',
  lg: 'w-[40px] h-[40px] p-0',
};

// Icon box styles for the bordered icon container on the right
const iconBoxStyles = `
  flex items-center justify-center
  w-[40px] h-[40px]
  bg-[var(--glass-bg)] border border-[var(--glass-border)]
  ml-3 -mr-px -my-px
`;

const variantStyles: Record<ButtonVariant, string> = {
  default: `
    bg-[var(--glass-bg)] border-[var(--glass-border)] text-content-primary
    hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)]
    active:bg-[var(--glass-bg-active)]
  `,
  blue: `
    bg-[var(--glass-bg-blue)] border-[var(--glass-border-blue)] text-content-primary
    hover:bg-[var(--glass-bg-blue-hover)] hover:border-[var(--glass-border-blue-hover)]
    active:bg-[var(--glass-bg-blue-active)]
  `,
  purple: `
    bg-[var(--glass-bg-purple)] border-[var(--glass-border-purple)] text-content-primary
    hover:bg-[var(--glass-bg-purple-hover)] hover:border-[var(--glass-border-purple)]
    active:bg-[var(--glass-bg-purple-active)]
  `,
  green: `
    bg-[var(--glass-bg-green)] border-[var(--glass-border-green-strong)] text-content-primary
    hover:bg-[var(--glass-bg-green-hover)] hover:border-[var(--glass-border-green-strong)]
    active:bg-[var(--glass-bg-green-active)]
  `,
  gold: `
    bg-[var(--glass-bg-gold)] border-[var(--glass-border-gold-strong)] text-content-primary
    hover:bg-[var(--glass-bg-gold-hover)] hover:border-[var(--glass-border-gold-strong)]
    active:bg-[var(--glass-bg-gold-active)]
  `,
  ghost: `
    bg-transparent border-transparent text-content-primary
    hover:bg-[var(--glass-bg)] hover:border-[var(--glass-border-subtle)]
    active:bg-[var(--glass-bg-hover)]
  `,
  text: `
    bg-transparent border-transparent text-content-primary
    hover:opacity-80
    active:opacity-70
    font-kodemono font-normal normal-case
  `,
};

// ============================================================================
// Helper Functions
// ============================================================================

// Text variant size styles (inline icon, regular padding)
const textVariantSizeStyles: Record<ButtonSize, string> = {
  sm: 'h-auto px-0 text-sm gap-4',
  md: 'h-auto px-0 text-sm gap-4',
  lg: 'h-auto px-0 text-sm gap-4',
};

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

  // Text variant uses inline icons and no icon box
  const sizeClass = variant === 'text'
    ? textVariantSizeStyles[size]
    : (iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size]);

  return [baseStyles, sizeClass, justifyClass, variantStyles[variant], fullWidth ? 'w-full' : '', className]
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

  // Icon box wrapper for the bordered icon container (not used in text variant)
  const IconBox = ({ children: iconChildren }: { children: React.ReactNode }) => (
    <div className={iconBoxStyles.replace(/\s+/g, ' ').trim()}>
      {iconChildren}
    </div>
  );

  // Text variant renders icons inline without the box
  const isTextVariant = variant === 'text';

  const content = showLoading ? (
    iconOnly ? (
      <Spinner size={iconSize} />
    ) : isTextVariant ? (
      <>
        {children}
        <Spinner size={iconSize} />
      </>
    ) : (
      <>
        <span className="flex-1 text-left pr-3">{children}</span>
        <IconBox><Spinner size={iconSize} /></IconBox>
      </>
    )
  ) : effectiveIconName ? (
    iconOnly ? (
      <Icon name={effectiveIconName} size={iconSize} />
    ) : isTextVariant ? (
      <>
        {children}
        <Icon name={effectiveIconName} size={iconSize} />
      </>
    ) : (
      <>
        <span className="flex-1 text-left pr-3">{children}</span>
        <IconBox><Icon name={effectiveIconName} size={iconSize} /></IconBox>
      </>
    )
  ) : isTextVariant ? (
    children
  ) : (
    <span className="pr-3">{children}</span>
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
