'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { useEscapeKey, useClickOutside } from './hooks/useModalBehavior';

// ============================================================================
// Types
// ============================================================================

type DropdownPosition = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  position: DropdownPosition;
}

// ============================================================================
// Context
// ============================================================================

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within a DropdownMenu');
  }
  return context;
}

// ============================================================================
// Dropdown Menu Root
// ============================================================================

interface DropdownMenuProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Position relative to trigger */
  position?: DropdownPosition;
  /** Children */
  children: React.ReactNode;
}

export function DropdownMenu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  position = 'bottom-start',
  children,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const triggerRef = useRef<HTMLElement>(null);

  const setOpen = useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlled, onOpenChange]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef, position }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// ============================================================================
// Dropdown Menu Trigger
// ============================================================================

interface DropdownMenuTriggerProps {
  /** Trigger element */
  children: React.ReactElement;
  /** Pass through as child instead of wrapping */
  asChild?: boolean;
}

export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
  const { open, setOpen, triggerRef } = useDropdownContext();

  const handleClick = () => {
    setOpen(!open);
  };

  // Create a callback ref that merges with the existing ref
  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
  }, [triggerRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void; ref?: (node: HTMLElement | null) => void }>, {
      onClick: handleClick,
      ref: setTriggerRef,
    });
  }

  return (
    <button
      type="button"
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

// ============================================================================
// Dropdown Menu Content
// ============================================================================

interface DropdownMenuContentProps {
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
}

export function DropdownMenuContent({ className = '', children }: DropdownMenuContentProps) {
  const { open, setOpen, triggerRef, position } = useDropdownContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Use layout effect for hydration check to avoid SSR issues
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Calculate position using layout effect to measure DOM before paint
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const content = contentRef.current.getBoundingClientRect();
    const gap = 4;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'bottom-start':
        top = trigger.bottom + gap;
        left = trigger.left;
        break;
      case 'bottom-end':
        top = trigger.bottom + gap;
        left = trigger.right - content.width;
        break;
      case 'top-start':
        top = trigger.top - content.height - gap;
        left = trigger.left;
        break;
      case 'top-end':
        top = trigger.top - content.height - gap;
        left = trigger.right - content.width;
        break;
    }

    // Keep within viewport
    top = Math.max(8, Math.min(top, window.innerHeight - content.height - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - content.width - 8));

    setCoords({ top, left });
  }, [open, position, triggerRef]);

  // Handle click outside
  useClickOutside(open, [contentRef, triggerRef], () => setOpen(false));

  // Handle escape
  useEscapeKey(open, () => setOpen(false));

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      className={`
        fixed z-50
        min-w-[160px]
        bg-surface-primary
        border border-edge-primary
        rounded-sm
        shadow-[2px_2px_0_0_var(--color-black)]
        py-0
        overflow-hidden
        max-h-[300px] flex flex-col
        animate-fadeIn
        ${className}
      `.trim()}
      style={{ top: coords.top, left: coords.left }}
    >
      <div className="overflow-y-auto flex-1">
        {children}
      </div>
    </div>,
    document.body
  );
}

// ============================================================================
// Dropdown Menu Item
// ============================================================================

interface DropdownMenuItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Destructive styling */
  destructive?: boolean;
  /** Icon name (filename without .svg extension) */
  iconName?: string;
  /** Additional className */
  className?: string;
}

export function DropdownMenuItem({
  children,
  onClick,
  disabled = false,
  destructive = false,
  iconName,
  className = '',
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownContext();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setOpen(false);
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full px-3 py-2
        flex items-center gap-2
        font-mondwest text-base text-left
        ${destructive ? 'text-content-error' : 'text-content-primary'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-tertiary cursor-pointer'}
        ${className}
      `.trim()}
    >
      {iconName && (
        <Icon name={iconName} size={16} className="flex-shrink-0 text-content-primary/60" />
      )}
      <span className="flex flex-1">{children}</span>
    </button>
  );
}

// ============================================================================
// Dropdown Menu Separator
// ============================================================================

interface DropdownMenuSeparatorProps {
  /** Additional className */
  className?: string;
}

export function DropdownMenuSeparator({ className = '' }: DropdownMenuSeparatorProps) {
  return (
    <div
      role="separator"
      className={`my-1 border-t border-edge-primary/20 ${className}`.trim()}
    />
  );
}

// ============================================================================
// Dropdown Menu Label
// ============================================================================

interface DropdownMenuLabelProps {
  /** Label content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

export function DropdownMenuLabel({ children, className = '' }: DropdownMenuLabelProps) {
  return (
    <div
      className={`
        px-3 py-1.5
        font-joystix text-xs uppercase tracking-wider
        text-content-primary
        ${className}
      `.trim()}
      style={{
        backgroundColor: 'var(--color-surface-sunken)',
        backgroundImage: `
          radial-gradient(circle, rgba(252, 225, 132, 0.7) 0.5px, transparent 0.5px),
          radial-gradient(circle, rgba(252, 225, 132, 0.7) 0.5px, transparent 0.5px)
        `,
        backgroundSize: 'var(--pattern-surface-sunken-size)',
        backgroundPosition: 'var(--pattern-surface-sunken-position)',
        backgroundRepeat: 'repeat',
      }}
    >
      {children}
    </div>
  );
}

export default DropdownMenu;
