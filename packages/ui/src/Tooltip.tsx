import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// Types
// ============================================================================

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipSize = 'sm' | 'md' | 'lg';

interface TooltipProps {
  /** Tooltip content */
  content: React.ReactNode;
  /** Position relative to trigger */
  position?: TooltipPosition;
  /** Delay before showing (ms) - set to 0 for instant */
  delay?: number;
  /** Size preset - matches Button sizes (sm=10px, md=12px, lg=14px) */
  size?: TooltipSize;
  /** Trigger element */
  children: React.ReactNode;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-secondary',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-secondary',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-secondary',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-secondary',
};

const sizeStyles: Record<TooltipSize, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

// ============================================================================
// Component
// ============================================================================

/**
 * Tooltip component for hover information
 * Uses a portal to render tooltips at document.body level
 */
export function Tooltip({ content, position = 'top', delay = 0, size = 'md', children, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - gap;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + gap;
        break;
    }

    setCoords({ top, left });
  };

  const showTooltip = () => {
    updatePosition();
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getTransformStyle = () => {
    switch (position) {
      case 'top':
        return 'translate(-50%, -100%)';
      case 'bottom':
        return 'translate(-50%, 0)';
      case 'left':
        return 'translate(-100%, -50%)';
      case 'right':
        return 'translate(0, -50%)';
    }
  };

  return (
    <div ref={triggerRef} className={`relative inline-flex ${className}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onFocus={showTooltip} onBlur={hideTooltip}>
      {children}

      {mounted &&
        isVisible &&
        createPortal(
          <div
            className={`
            fixed z-[10001]
            px-2 py-1
            bg-surface-secondary text-content-inverted
            font-joystix uppercase
            rounded-sm
            whitespace-nowrap
            pointer-events-none
            ${sizeStyles[size]}
          `}
            style={{
              top: coords.top,
              left: coords.left,
              transform: getTransformStyle(),
            }}
            role="tooltip"
          >
            {content}
            {/* Arrow */}
            <div
              className={`
              absolute
              border-4 border-solid
              ${arrowStyles[position]}
            `}
            />
          </div>,
          document.body
        )}
    </div>
  );
}

export default Tooltip;
export type { TooltipPosition, TooltipSize, TooltipProps };
