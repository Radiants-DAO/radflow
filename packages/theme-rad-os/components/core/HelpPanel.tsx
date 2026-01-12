'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

// ============================================================================
// Types
// ============================================================================

interface HelpPanelProps {
  /** Whether the panel is open */
  isOpen: boolean;
  /** Callback when panel should close */
  onClose: () => void;
  /** Help content to display */
  children: React.ReactNode;
  /** Optional title for the help panel */
  title?: string;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Slide-in help panel that appears from the right side of the window.
 * Used to display contextual help content within app windows.
 * Redesigned to match SearchableColorDropdown style patterns.
 */
export function HelpPanel({
  isOpen,
  onClose,
  children,
  title = 'Help',
  className = '',
}: HelpPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use layout effect for hydration check to avoid SSR issues
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Handle animation states - delay hiding for exit animation
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (isOpen) {
      // Show immediately when opening
      setIsVisible(true);
    } else {
      // Delay hiding for exit animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    // Add slight delay to prevent immediate close on open click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-surface-secondary/50
          transition-opacity duration-200
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `.trim()}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`
          fixed inset-y-0 right-0
          h-full w-80 max-w-[90vw]
          bg-surface-primary
          border-l border-edge-primary
          shadow-[2px_2px_0_0_var(--color-black)]
          flex flex-col
          transform transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${className}
        `.trim()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-edge-primary/20">
          <span className="font-joystix text-xs text-content-primary uppercase tracking-wider">
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-surface-tertiary rounded-sm transition-colors"
          >
            <Icon name="close" size={16} className="text-content-primary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="font-mondwest text-base text-content-primary space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================================================
// Help Panel Sub-components
// ============================================================================

interface HelpSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function HelpSection({ title, children, className = '' }: HelpSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="font-joystix text-xs uppercase text-content-primary/60 tracking-wider">
        {title}
      </h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

interface HelpItemProps {
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function HelpItem({ icon, children, className = '' }: HelpItemProps) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {icon && (
        <Icon name={icon} size={16} className="flex-shrink-0 text-content-primary/60 mt-0.5" />
      )}
      <div className="flex-1 font-mondwest text-base text-content-primary">
        {children}
      </div>
    </div>
  );
}

interface HelpShortcutProps {
  keys: string[];
  description: string;
  className?: string;
}

export function HelpShortcut({ keys, description, className = '' }: HelpShortcutProps) {
  return (
    <div className={`flex items-center justify-between gap-4 py-1 ${className}`}>
      <span className="font-mondwest text-base text-content-primary">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <kbd
            key={index}
            className="px-1.5 py-0.5 font-mono text-xs bg-surface-secondary/20 border border-edge-primary/30 rounded-xs text-content-primary"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}

export default HelpPanel;
