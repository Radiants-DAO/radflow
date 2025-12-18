'use client';

import { useDevToolsStore } from '../../store';
import { generateSelector, getElementPreview, getElementPath } from '../../lib/selectorGenerator';

export function CommentOverlay() {
  const { commentMode, setCommentMode, addComment } = useDevToolsStore();

  // Don't render if not in comment mode
  if (!commentMode) return null;

  // Don't render in production
  if (process.env.NODE_ENV === 'production') return null;

  const handleClick = (e: React.MouseEvent) => {
    // Prevent clicking on the overlay itself
    if (e.target === e.currentTarget) {
      setCommentMode(false);
      return;
    }

    // Get the clicked element
    const target = e.target as HTMLElement;
    
    // Ignore clicks on the devtools panel itself
    if (target.closest('[data-devtools]')) return;

    // Prompt for comment text
    const text = prompt('Enter your comment:');
    if (!text) {
      setCommentMode(false);
      return;
    }

    // Create the comment
    const selector = generateSelector(target);
    const preview = getElementPreview(target);
    const path = getElementPath(target);
    const sessionId = sessionStorage.getItem('devtools-session-id') || 'unknown';

    addComment({
      elementSelector: selector,
      elementPath: path,
      elementPreview: preview,
      text,
      sessionId,
      resolved: false,
    });

    setCommentMode(false);
  };

  return (
    <div
      data-devtools="overlay"
      className="fixed inset-0 z-[9998] cursor-crosshair"
      onClick={handleClick}
      style={{
        background: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(1px)',
      }}
    >
      {/* Instruction banner */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-secondary text-alternate px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
        Click on an element to add a comment · Press <kbd className="px-1 py-0.5 bg-panel text-heading rounded text-xs mx-1">Esc</kbd> to cancel
      </div>
    </div>
  );
}

