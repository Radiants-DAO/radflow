'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void; ref?: React.Ref<HTMLElement | null> }>, {
      onClick: handleClick,
      ref: triggerRef as React.Ref<HTMLElement | null>,
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate position
  useEffect(() => {
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
        min-w-[8rem]
        bg-surface-primary
        border-2 border-edge-primary
        rounded-sm
        shadow-[2px_2px_0_0_var(--color-black)]
        py-1
        animate-fadeIn
        ${className}
      `.trim()}
      style={{ top: coords.top, left: coords.left }}
    >
      {children}
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
  /** Additional className */
  className?: string;
}

export function DropdownMenuItem({
  children,
  onClick,
  disabled = false,
  destructive = false,
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
        w-full px-4 py-2
        text-left
        font-mondwest text-base
        ${destructive ? 'text-content-error' : 'text-content-primary'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-secondary/5 cursor-pointer'}
        transition-colors
        ${className}
      `.trim()}
    >
      {children}
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
      className={`h-px bg-surface-primary/20 my-1 ${className}`.trim()}
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
        px-4 py-1
        font-joystix text-2xs uppercase
        text-content-primary/50
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}

export default DropdownMenu;
