'use client';

import { useEffect, useState } from 'react';
import { useDevToolsStore } from '../store';
import { TextEditOverlay } from './TextEditOverlay';
import { TextEditContextMenu } from './TextEditContextMenu';
import { useToast } from '@radflow/ui';

export function TextEditMode() {
  const {
    isTextEditActive,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentElement,
    pendingChanges,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggleTextEditMode,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCurrentElement,
  } = useDevToolsStore();
  
  const [contextMenu, setContextMenu] = useState<{
    element: HTMLElement;
    position: { x: number; y: number };
  } | null>(null);
  
  const { addToast } = useToast();

  const handleContextMenu = (element: HTMLElement, position: { x: number; y: number }) => {
    setContextMenu({ element, position });
  };

  // Show toast on exit with change count
  useEffect(() => {
    if (!isTextEditActive && pendingChanges.length > 0) {
      const count = pendingChanges.length;
      addToast({
        title: 'Text Changes Copied',
        description: `${count} text change${count > 1 ? 's' : ''} copied to clipboard`,
        variant: 'success',
        duration: 3000,
      });
    }
  }, [isTextEditActive, pendingChanges.length, addToast]);

  if (!isTextEditActive) return null;

  return (
    <>
      <TextEditOverlay onContextMenu={handleContextMenu} />
      {contextMenu && (
        <TextEditContextMenu
          element={contextMenu.element}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
