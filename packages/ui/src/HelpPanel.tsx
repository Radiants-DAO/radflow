'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from './Button';

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
 */
export function HelpPanel({
  isOpen,
  onClose,
  children,
  title = 'Help',
  className = '',
}: HelpPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
    <div 
      className={`
        absolute inset-0 z-50 
        bg-surface-secondary/20 
        flex justify-end
      `}
    >
      <div
        ref={panelRef}
        className={`
          h-full w-72 max-w-[80%]
          bg-surface-primary
          border-l border-edge-primary
          shadow-[-4px_0_0_0_var(--color-black)]
          flex flex-col
          animate-slide-in-right
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-edge-primary">
          <span className="font-joystix text-xs text-content-primary uppercase">
            {title}
          </span>
          <Button
            variant="ghost"
            size="md"
            iconOnly={true}
            iconName="close"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="font-mondwest text-base text-content-primary space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPanel;

