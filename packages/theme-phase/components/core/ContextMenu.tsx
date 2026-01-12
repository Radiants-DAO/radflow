'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

// ============================================================================
// Types
// ============================================================================

interface Position {
  x: number;
  y: number;
}

interface ContextMenuContextValue {
  isOpen: boolean;
  position: Position;
  open: (position: Position) => void;
  close: () => void;
}

interface ContextMenuProps {
  /** Content that triggers context menu on right-click */
  children: React.ReactNode;
  /** Additional classes for trigger container */
  className?: string;
}

interface ContextMenuContentProps {
  /** Menu items */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

interface ContextMenuItemProps {
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Destructive action (red text) */
  destructive?: boolean;
  /** Icon name (filename without .svg extension) */
  iconName?: string;
  /** Menu item content */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

interface ContextMenuSeparatorProps {
  className?: string;
}

interface ContextMenuTriggerProps {
  /** Content that triggers context menu on right-click */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

interface ContextMenuLabelProps {
  /** Label content */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Context
// ============================================================================

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('ContextMenu components must be used within a ContextMenu provider');
  }
  return context;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Context menu container - wraps content that should have right-click menu
 */
export function ContextMenu({ children, className = '' }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const open = (pos: Position) => {
    setPosition(pos);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  // Handle right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    open({ x: e.clientX, y: e.clientY });
  };

  return (
    <ContextMenuContext.Provider value={{ isOpen, position, open, close }}>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
}

/**
 * Context menu dropdown content
 */
export function ContextMenuContent({ children, className = '' }: ContextMenuContentProps) {
  const { isOpen, position, close } = useContextMenu();
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Use layout effect for hydration check to avoid SSR issues
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Calculate position and keep within viewport
  // Use layout effect to measure DOM before paint
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const content = contentRef.current.getBoundingClientRect();
    let top = position.y;
    let left = position.x;

    // Keep within viewport
    if (top + content.height > window.innerHeight - 8) {
      top = window.innerHeight - content.height - 8;
    }
    if (left + content.width > window.innerWidth - 8) {
      left = window.innerWidth - content.width - 8;
    }
    top = Math.max(8, top);
    left = Math.max(8, left);

    setCoords({ top, left });
  }, [isOpen, position]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      className={`
        fixed z-[1000]
        min-w-[160px]
        bg-surface-primary
        border border-edge-primary
        rounded-sm
        shadow-[2px_2px_0_0_var(--color-black)]
        py-1
        overflow-hidden
        max-h-[300px] flex flex-col
        animate-fadeIn
        ${className}
      `}
      style={{ top: coords.top, left: coords.left }}
    >
      <div className="overflow-y-auto flex-1">
        {children}
      </div>
    </div>,
    document.body
  );
}

/**
 * Context menu item
 */
export function ContextMenuItem({
  onClick,
  disabled = false,
  destructive = false,
  iconName,
  children,
  className = '',
}: ContextMenuItemProps) {
  const { close } = useContextMenu();

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      close();
    }
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
      `}
    >
      {iconName && (
        <Icon name={iconName} size={16} className="flex-shrink-0 text-content-primary/60" />
      )}
      <span className="flex-1">{children}</span>
    </button>
  );
}

/**
 * Context menu separator line
 */
export function ContextMenuSeparator({ className = '' }: ContextMenuSeparatorProps) {
  return (
    <div
      role="separator"
      className={`my-1 border-t border-edge-primary/20 ${className}`}
    />
  );
}

/**
 * Context menu label
 */
export function ContextMenuLabel({ children, className = '' }: ContextMenuLabelProps) {
  return (
    <div
      className={`
        px-3 py-1.5
        font-joystix text-xs uppercase tracking-wider
        text-content-primary/50
        bg-surface-secondary/10
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Context menu trigger - wraps content that triggers context menu
 * Note: This is a pass-through component for API consistency with other menu components.
 * The actual right-click handling is done by the parent ContextMenu component.
 */
export function ContextMenuTrigger({ children, className = '' }: ContextMenuTriggerProps) {
  return <div className={className}>{children}</div>;
}

export default ContextMenu;
