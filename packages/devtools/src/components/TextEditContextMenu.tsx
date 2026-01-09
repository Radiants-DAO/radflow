'use client';

import { useEffect, useRef } from 'react';
import { useDevToolsStore } from '../store';

const TAG_OPTIONS = [
  { tag: 'h1', label: 'Heading 1' },
  { tag: 'h2', label: 'Heading 2' },
  { tag: 'h3', label: 'Heading 3' },
  { tag: 'h4', label: 'Heading 4' },
  { tag: 'h5', label: 'Heading 5' },
  { tag: 'h6', label: 'Heading 6' },
  { tag: 'p', label: 'Paragraph' },
  { tag: 'span', label: 'Span' },
];

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

interface TextEditContextMenuProps {
  element: HTMLElement;
  position: { x: number; y: number };
  onClose: () => void;
}

export function TextEditContextMenu({ element, position, onClose }: TextEditContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { addChange, setCurrentElement, originalState } = useDevToolsStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleTagChange = (newTag: string) => {
    if (!originalState) return;

    const originalTag = element.tagName.toLowerCase();
    const originalText = originalState.text;
    const newText = element.textContent || '';

    // Create new element with new tag
    const newElement = document.createElement(newTag);
    newElement.textContent = newText;
    
    // Copy attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name !== 'contenteditable') {
        newElement.setAttribute(attr.name, attr.value);
      }
    });

    // Replace in DOM
    element.parentNode?.replaceChild(newElement, element);

    // Update store
    const selector = generateSelector(newElement);
    
    // Try to find React component name
    let reactComponent: string | undefined;
    const fiberKey = Object.keys(newElement).find(key => 
      key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
    );
    if (fiberKey) {
      const fiber = (newElement as any)[fiberKey];
      if (fiber?.return?.type?.displayName || fiber?.return?.type?.name) {
        reactComponent = fiber.return.type.displayName || fiber.return.type.name;
      }
    }

    // Create change record
    const change = {
      id: `${Date.now()}-${Math.random()}`,
      selector,
      originalText,
      newText,
      originalTag,
      newTag,
      reactComponent,
      isRadToolsChange: false,
      radToolsType: null as const,
    };

    addChange(change);
    setCurrentElement(newElement, { text: newText, tag: newTag });
    
    // Make editable
    newElement.contentEditable = 'true';
    newElement.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(newElement);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    onClose();
  };

  const currentTag = element.tagName.toLowerCase();

  return (
    <div
      ref={menuRef}
      data-text-edit-context-menu
      className="fixed bg-surface-elevated border border-edge-primary/20 shadow-lg rounded py-1 z-[60] min-w-[160px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-2 py-1 text-xs font-semibold text-content-primary/60 border-b border-edge-primary/10">
        Change Tag
      </div>
      {TAG_OPTIONS.map((option) => (
        <button
          key={option.tag}
          onClick={() => handleTagChange(option.tag)}
          className={`w-full text-left px-3 py-1.5 text-sm hover:bg-surface-secondary/5 transition-colors ${
            currentTag === option.tag ? 'bg-surface-tertiary/20 font-semibold' : ''
          }`}
        >
          {option.label}
        </button>
      ))}
      <div className="border-t border-edge-primary/10 mt-1 pt-1">
        <button
          onClick={onClose}
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-surface-secondary/5 transition-colors text-content-primary/60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
