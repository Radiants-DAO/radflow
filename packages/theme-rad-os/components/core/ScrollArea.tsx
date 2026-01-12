'use client';

import React, { forwardRef } from 'react';

// ============================================================================
// Types
// ============================================================================

type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

interface ScrollAreaProps {
  /** Content to scroll */
  children: React.ReactNode;
  /** Maximum height (CSS value or number for pixels) */
  maxHeight?: string | number;
  /** Maximum width (CSS value or number for pixels) */
  maxWidth?: string | number;
  /** Scroll orientation */
  orientation?: ScrollAreaOrientation;
  /** Hide scrollbar visually while keeping scroll functionality */
  hideScrollbar?: boolean;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * ScrollArea - Custom styled scrollable container
 * Provides consistent scrollbar styling matching RadOS aesthetic
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      children,
      maxHeight,
      maxWidth,
      orientation = 'vertical',
      hideScrollbar = false,
      className = '',
    },
    ref
  ) {
    // Convert number to pixels for height/width
    const heightStyle = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    const widthStyle = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

    // Determine overflow based on orientation
    const getOverflow = () => {
      if (hideScrollbar) {
        return 'overflow-hidden';
      }
      switch (orientation) {
        case 'vertical':
          return 'overflow-y-auto overflow-x-hidden';
        case 'horizontal':
          return 'overflow-x-auto overflow-y-hidden';
        case 'both':
          return 'overflow-auto';
        default:
          return 'overflow-y-auto overflow-x-hidden';
      }
    };

    // Custom scrollbar classes
    const scrollbarClasses = hideScrollbar
      ? '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
      : `
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-track]:bg-surface-primary
          [&::-webkit-scrollbar-track]:border
          [&::-webkit-scrollbar-track]:border-edge-primary/20
          [&::-webkit-scrollbar-thumb]:bg-surface-tertiary
          [&::-webkit-scrollbar-thumb]:border
          [&::-webkit-scrollbar-thumb]:border-edge-primary/40
          [&::-webkit-scrollbar-thumb]:rounded-sm
          [&::-webkit-scrollbar-thumb:hover]:bg-surface-tertiary/80
          [&::-webkit-scrollbar-corner]:bg-surface-primary
        `.trim();

    return (
      <div
        ref={ref}
        className={`
          ${getOverflow()}
          ${scrollbarClasses}
          ${className}
        `.trim()}
        style={{
          maxHeight: heightStyle,
          maxWidth: widthStyle,
        }}
      >
        {children}
      </div>
    );
  }
);

export default ScrollArea;
export type { ScrollAreaProps, ScrollAreaOrientation };
