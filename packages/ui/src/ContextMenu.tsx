'use client';

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
  }, [isOpen]);

  return (
    <ContextMenuContext.Provider value={{ isOpen, position, open, close }}>
      <div
        ref={containerRef}
        onContextMenu={handleContextMenu}
        className={className}
      >
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

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed z-[1000]
        min-w-[160px]
        bg-surface-primary
        border border-edge-primary
        rounded-sm
        shadow-[2px_2px_0_0_var(--color-black)]
        py-1
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={close}
    >
      {children}
    </div>
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
    if (!disabled && onClick) {
      onClick();
      close();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-2
        px-3 py-1.5
        font-mondwest text-base text-left
        ${destructive ? 'text-content-error' : 'text-content-primary'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-tertiary cursor-pointer'}
        ${className}
      `}
    >
      {iconName && (
        <span className="w-4 h-4 flex items-center justify-center">
          <Icon name={iconName} size={16} />
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}

/**
 * Context menu separator line
 */
export function ContextMenuSeparator({ className = '' }: ContextMenuSeparatorProps) {
  return (
    <div 
      className={`my-1 border-t border-edge-primary/20 ${className}`}
    />
  );
}

export default ContextMenu;

