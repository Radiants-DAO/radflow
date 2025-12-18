'use client';

import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { useRef, ReactNode } from 'react';

interface DraggablePanelProps {
  children: ReactNode;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  className?: string;
}

export function DraggablePanel({
  children,
  position,
  onPositionChange,
  className = '',
}: DraggablePanelProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    onPositionChange({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      defaultPosition={position}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`fixed z-[9999] ${className}`}
        style={{ top: 0, left: 0 }}
      >
        {children}
      </div>
    </Draggable>
  );
}

