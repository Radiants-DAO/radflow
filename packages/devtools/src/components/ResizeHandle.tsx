'use client';

import { useRef, useCallback } from 'react';

interface ResizeHandleProps {
  onResize: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  position?: 'left' | 'right'; // Which side of the panel the handle is on
}

export function ResizeHandle({
  onResize,
  minWidth = 300,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800,
  position = 'left'
}: ResizeHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!handleRef.current) return;
    
    const rect = handleRef.current.parentElement?.getBoundingClientRect();
    if (!rect) return;
    
    const startX = e.clientX;
    const startWidth = rect.width;
    
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const currentMaxWidth = window.innerWidth * 0.8;
      
      // When handle is on left (right-docked panel): drag left = wider
      // When handle is on right (left-docked panel): drag right = wider
      const widthChange = position === 'left' ? -deltaX : deltaX;
      const newWidth = Math.max(
        minWidth,
        Math.min(currentMaxWidth, startWidth + widthChange)
      );
      
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize, minWidth, position]);

  return (
    <div
      ref={handleRef}
      onMouseDown={handleMouseDown}
      className="w-2 cursor-ew-resize hover:bg-surface-secondary/20 transition-colors group flex items-center justify-center"
      title="Drag to resize panel"
      data-help-id="panel-resize"
    >
      {/* Visual grip indicator */}
      <div className="w-0.5 h-8 rounded-full bg-surface-secondary/20 group-hover:bg-surface-secondary/40 transition-colors" />
    </div>
  );
}
