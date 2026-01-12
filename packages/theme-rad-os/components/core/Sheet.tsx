'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { useEscapeKey, useLockBodyScroll } from './hooks/useModalBehavior';

// ============================================================================
// Types
// ============================================================================

type SheetSide = 'left' | 'right' | 'top' | 'bottom';

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: SheetSide;
}

// ============================================================================
// Context
// ============================================================================

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet');
  }
  return context;
}

// ============================================================================
// Sheet Root
// ============================================================================

interface SheetProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Side to slide in from */
  side?: SheetSide;
  /** Children */
  children: React.ReactNode;
}

export function Sheet({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  side = 'right',
  children,
}: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlled, onOpenChange]);

  return (
    <SheetContext.Provider value={{ open, setOpen, side }}>
      {children}
    </SheetContext.Provider>
  );
}

// ============================================================================
// Sheet Trigger
// ============================================================================

interface SheetTriggerProps {
  /** Trigger element */
  children: React.ReactElement;
  /** Pass through as child instead of wrapping */
  asChild?: boolean;
}

export function SheetTrigger({ children, asChild }: SheetTriggerProps) {
  const { setOpen } = useSheetContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => setOpen(true),
    });
  }

  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

// ============================================================================
// Sheet Content
// ============================================================================

const sideStyles: Record<SheetSide, { container: string; open: string; closed: string; border: string }> = {
  left: {
    container: 'inset-y-0 left-0 h-full w-80 max-w-[90vw]',
    open: 'translate-x-0',
    closed: '-translate-x-full',
    border: 'border-r',
  },
  right: {
    container: 'inset-y-0 right-0 h-full w-80 max-w-[90vw]',
    open: 'translate-x-0',
    closed: 'translate-x-full',
    border: 'border-l',
  },
  top: {
    container: 'inset-x-0 top-0 w-full h-80 max-h-[90vh]',
    open: 'translate-y-0',
    closed: '-translate-y-full',
    border: 'border-b',
  },
  bottom: {
    container: 'inset-x-0 bottom-0 w-full h-80 max-h-[90vh]',
    open: 'translate-y-0',
    closed: 'translate-y-full',
    border: 'border-t',
  },
};

interface SheetContentProps {
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
}

export function SheetContent({ className = '', children }: SheetContentProps) {
  const { open, setOpen, side } = useSheetContext();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const styles = sideStyles[side];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Handle animation states
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    } else {
      // Delay hiding until animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle escape key
  useEscapeKey(open, () => setOpen(false));

  // Prevent body scroll when open
  useLockBodyScroll(open);

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-surface-secondary/50
          transition-opacity duration-200
          ${open ? 'opacity-100' : 'opacity-0'}
        `.trim()}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        role="dialog"
        aria-modal="true"
        className={`
          fixed
          ${styles.container}
          bg-surface-primary
          ${styles.border} border-edge-primary
          shadow-[2px_2px_0_0_var(--color-black)]
          transform transition-transform duration-200 ease-out
          flex flex-col
          ${open ? styles.open : styles.closed}
          ${className}
        `.trim()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

// ============================================================================
// Sheet Header, Title, Description
// ============================================================================

interface SheetHeaderProps {
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
  /** Show close button */
  showClose?: boolean;
}

export function SheetHeader({ className = '', children, showClose = true }: SheetHeaderProps) {
  const { setOpen } = useSheetContext();

  return (
    <div className={`px-6 pt-6 pb-4 border-b border-edge-primary/20 flex items-start justify-between gap-4 ${className}`.trim()}>
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {showClose && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-shrink-0 p-1 hover:bg-surface-tertiary rounded-sm transition-colors"
        >
          <Icon name="close" size={16} className="text-content-primary" />
        </button>
      )}
    </div>
  );
}

interface SheetTitleProps {
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
}

export function SheetTitle({ className = '', children }: SheetTitleProps) {
  return (
    <h2 className={`font-joystix text-sm uppercase text-content-primary ${className}`.trim()}>
      {children}
    </h2>
  );
}

interface SheetDescriptionProps {
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
}

export function SheetDescription({ className = '', children }: SheetDescriptionProps) {
  return (
    <p className={`font-mondwest text-base text-content-primary/70 mt-2 ${className}`.trim()}>
      {children}
    </p>
  );
}

// ============================================================================
// Sheet Body & Footer
// ============================================================================

interface SheetBodyProps {
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
}

export function SheetBody({ className = '', children }: SheetBodyProps) {
  return (
    <div className={`px-6 py-4 flex-1 overflow-auto font-mondwest text-base text-content-primary ${className}`.trim()}>
      {children}
    </div>
  );
}

interface SheetFooterProps {
  /** Additional className */
  className?: string;
  /** Children */
  children: React.ReactNode;
}

export function SheetFooter({ className = '', children }: SheetFooterProps) {
  return (
    <div className={`px-6 pb-6 pt-4 border-t border-edge-primary/20 flex justify-end gap-2 ${className}`.trim()}>
      {children}
    </div>
  );
}

// ============================================================================
// Sheet Close
// ============================================================================

interface SheetCloseProps {
  /** Close button element */
  children: React.ReactElement;
  /** Pass through as child instead of wrapping */
  asChild?: boolean;
}

export function SheetClose({ children, asChild }: SheetCloseProps) {
  const { setOpen } = useSheetContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => setOpen(false),
    });
  }

  return (
    <button type="button" onClick={() => setOpen(false)}>
      {children}
    </button>
  );
}

export default Sheet;
