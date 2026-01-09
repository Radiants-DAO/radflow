'use client';

import { useEffect, useRef, useState } from 'react';
import { useDevToolsStore } from '../store';
import { useToast } from '@radflow/ui';

// Editable element types
const EDITABLE_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'button', 'a'];

function isEditableElement(element: HTMLElement): boolean {
  // Exclude RadTools panel elements
  if (element.closest('[data-radtools-panel]')) {
    return false;
  }
  
  // Exclude input/textarea (already editable)
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    return false;
  }
  
  // Check if element or its direct parent is an editable tag
  const tagName = element.tagName.toLowerCase();
  if (EDITABLE_TAGS.includes(tagName)) {
    return true;
  }
  
  // Check parent (for text nodes inside buttons/links)
  const parent = element.parentElement;
  if (parent && EDITABLE_TAGS.includes(parent.tagName.toLowerCase())) {
    return true;
  }
  
  return false;
}

function getEditableElement(element: HTMLElement): HTMLElement | null {
  if (isEditableElement(element)) {
    const tagName = element.tagName.toLowerCase();
    if (EDITABLE_TAGS.includes(tagName)) {
      return element;
    }
    // If it's a text node wrapper, return parent
    const parent = element.parentElement;
    if (parent && EDITABLE_TAGS.includes(parent.tagName.toLowerCase())) {
      return parent;
    }
  }
  return null;
}

function generateSelector(element: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  
  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase();
    const id = current.id ? `#${current.id}` : '';
    const classes = current.className 
      ? `.${current.className.split(' ').filter(Boolean).join('.')}` 
      : '';
    
    parts.unshift(`${tag}${id}${classes}`);
    current = current.parentElement;
  }
  
  return parts.join(' > ');
}

interface TextEditOverlayProps {
  onContextMenu?: (element: HTMLElement, position: { x: number; y: number }) => void;
}

export function TextEditOverlay({ onContextMenu }: TextEditOverlayProps) {
  const { 
    isTextEditActive, 
    currentElement,
    setCurrentElement,
    addChange,
    formatChangesForClipboard,
    pendingChanges,
  } = useDevToolsStore();
  
  const { addToast } = useToast();
  
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTextEditActive) {
      setHoveredElement(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const editable = getEditableElement(target);
      setHoveredElement(editable);
    };

    const handleClick = (e: MouseEvent) => {
      // Don't prevent default if clicking on context menu
      if ((e.target as HTMLElement)?.closest('[data-text-edit-context-menu]')) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const editable = getEditableElement(target);
      if (!editable) return;
      
      // Store original state
      const originalText = editable.textContent || '';
      const originalTag = editable.tagName.toLowerCase();
      
      setCurrentElement(editable, { text: originalText, tag: originalTag });
      
      // Make editable
      editable.contentEditable = 'true';
      editable.focus();
      
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(editable);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (!currentElement) return;
      
      const target = e.target as HTMLElement;
      if (target === currentElement || currentElement.contains(target)) {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.(currentElement, { x: e.clientX, y: e.clientY });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [isTextEditActive, setCurrentElement, currentElement, onContextMenu]);

  // Handle Enter key to commit changes
  useEffect(() => {
    if (!currentElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useDevToolsStore.getState();
      const originalState = store.originalState;
      
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        
        const newText = currentElement.textContent || '';
        const newTag = currentElement.tagName.toLowerCase();
        
        if (originalState && (newText !== originalState.text || newTag !== originalState.tag)) {
          // Generate selector
          const selector = generateSelector(currentElement);
          
          // Try to find React component name (basic detection)
          let reactComponent: string | undefined;
          const fiberKey = Object.keys(currentElement).find(key => 
            key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
          );
          if (fiberKey) {
            const fiber = (currentElement as any)[fiberKey];
            if (fiber?.return?.type?.displayName || fiber?.return?.type?.name) {
              reactComponent = fiber.return.type.displayName || fiber.return.type.name;
            }
          }
          
          // Create change record
          const change = {
            id: `${Date.now()}-${Math.random()}`,
            selector,
            originalText: originalState.text,
            newText,
            originalTag: originalState.tag,
            newTag: newTag !== originalState.tag ? newTag : undefined,
            reactComponent,
            isRadToolsChange: false,
            radToolsType: null as const,
          };
          
          addChange(change);
          
          // Build accumulated clipboard text (all changes including this one)
          const allChanges = [...useDevToolsStore.getState().pendingChanges];
          const clipboardLines = ['[TEXT_CHANGES]:'];
          allChanges.forEach((c) => {
            clipboardLines.push(`"${c.originalText}" → "${c.newText}"`);
          });
          const clipboardText = clipboardLines.join('\n');
          
          navigator.clipboard.writeText(clipboardText).then(() => {
            addToast({
              title: 'Text change copied',
              description: `${allChanges.length} change${allChanges.length > 1 ? 's' : ''} in clipboard`,
              variant: 'success',
            });
          }).catch(console.error);
        }
        
        // Make non-editable and blur
        currentElement.contentEditable = 'false';
        currentElement.blur();
        setCurrentElement(null, null);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        
        // Revert to original state
        if (originalState) {
          currentElement.textContent = originalState.text;
          if (originalState.tag !== currentElement.tagName.toLowerCase()) {
            // Tag change would need DOM manipulation - for now just revert text
            // Full tag change requires context menu
          }
        }
        
        currentElement.contentEditable = 'false';
        currentElement.blur();
        setCurrentElement(null, null);
        
        // Exit mode entirely
        store.toggleTextEditMode();
      }
    };

    currentElement.addEventListener('keydown', handleKeyDown);
    return () => {
      currentElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentElement, addChange, setCurrentElement]);

  // Apply hover styles
  useEffect(() => {
    if (!hoveredElement || hoveredElement === currentElement) return;

    const originalOutline = hoveredElement.style.outline;
    const originalCursor = hoveredElement.style.cursor;
    const originalBg = hoveredElement.style.backgroundColor;

    hoveredElement.style.outline = '1px dashed var(--color-edge-focus)';
    hoveredElement.style.cursor = 'text';
    hoveredElement.style.backgroundColor = 'color-mix(in srgb, var(--color-edge-focus) 5%, transparent)';

    return () => {
      hoveredElement.style.outline = originalOutline;
      hoveredElement.style.cursor = originalCursor;
      hoveredElement.style.backgroundColor = originalBg;
    };
  }, [hoveredElement, currentElement]);

  // Apply active edit styles
  useEffect(() => {
    if (!currentElement) return;

    const originalOutline = currentElement.style.outline;
    const originalBg = currentElement.style.backgroundColor;
    const originalBoxShadow = currentElement.style.boxShadow;

    currentElement.style.outline = '2px solid var(--color-surface-tertiary)';
    currentElement.style.backgroundColor = 'var(--color-surface-elevated)';
    currentElement.style.boxShadow = '0 2px 4px color-mix(in srgb, var(--color-surface-secondary) 10%, transparent)';

    return () => {
      currentElement.style.outline = originalOutline;
      currentElement.style.backgroundColor = originalBg;
      currentElement.style.boxShadow = originalBoxShadow;
    };
  }, [currentElement]);

  if (!isTextEditActive) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[50]"
      data-radtools-text-edit-overlay
    />
  );
}
