'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useEscapeKey, useClickOutside } from './hooks/useModalBehavior';

// ============================================================================
// Types
// ============================================================================

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  position: PopoverPosition;
}

// ============================================================================
// Context
// ============================================================================

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within a Popover');
  }
  return context;
}

// ============================================================================
// Popover Root
// ============================================================================

interface PopoverProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Position relative to trigger */
  position?: PopoverPosition;
  /** Children */
  children: React.ReactNode;
}

export function Popover({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  position = 'bottom',
  children,
}: PopoverProps) {
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
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, position }}>
      {children}
    </PopoverContext.Provider>
  );
}

// ============================================================================
// Popover Trigger
// ============================================================================

interface PopoverTriggerProps {
  /** Trigger element */
  children: React.ReactElement;
  /** Pass through as child instead of wrapping */
  asChild?: boolean;
}

export function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
  const { open, setOpen, triggerRef } = usePopoverContext();

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
// Popover Content
// ============================================================================

interface PopoverContentProps {
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
  /** Alignment relative to trigger */
  align?: 'start' | 'center' | 'end';
}

export function PopoverContent({ className = '', children, align = 'center' }: PopoverContentProps) {
  const { open, setOpen, triggerRef, position } = usePopoverContext();
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
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = trigger.top - content.height - gap;
        left = trigger.left + (trigger.width - content.width) / 2;
        break;
      case 'bottom':
        top = trigger.bottom + gap;
        left = trigger.left + (trigger.width - content.width) / 2;
        break;
      case 'left':
        top = trigger.top + (trigger.height - content.height) / 2;
        left = trigger.left - content.width - gap;
        break;
      case 'right':
        top = trigger.top + (trigger.height - content.height) / 2;
        left = trigger.right + gap;
        break;
    }

    // Adjust for alignment
    if (position === 'top' || position === 'bottom') {
      if (align === 'start') {
        left = trigger.left;
      } else if (align === 'end') {
        left = trigger.right - content.width;
      }
    }

    // Keep within viewport
    top = Math.max(8, Math.min(top, window.innerHeight - content.height - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - content.width - 8));

    setCoords({ top, left });
  }, [open, position, align, triggerRef]);

  // Handle click outside
  useClickOutside(open, [contentRef, triggerRef], () => setOpen(false));

  // Handle escape
  useEscapeKey(open, () => setOpen(false));

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={`
        fixed z-50
        bg-surface-primary
        border-2 border-edge-primary
        rounded-sm
        shadow-[2px_2px_0_0_var(--color-black)]
        p-4
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

export default Popover;
