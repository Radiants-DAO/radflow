'use client';

import { useDevToolsStore } from '../../store';
import { CommentList } from './CommentList';
import { CommentPin } from './CommentPin';
import { findElementBySelector } from '../../lib/selectorGenerator';

export function CommentsTab() {
  const { 
    comments, 
    commentMode, 
    setCommentMode, 
    showPins, 
    setShowPins 
  } = useDevToolsStore();

  const handleScrollToComment = (selector: string) => {
    const element = findElementBySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight briefly
      const originalOutline = element.style.outline;
      element.style.outline = '3px solid var(--color-focus)';
      setTimeout(() => {
        element.style.outline = originalOutline;
      }, 2000);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-heading">Comments</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPins(!showPins)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              showPins
                ? 'bg-panel-active text-heading border-border-strong'
                : 'bg-panel-hover text-body border-border'
            }`}
          >
            {showPins ? '👁 Pins On' : '👁 Pins Off'}
          </button>
          <button
            onClick={() => setCommentMode(!commentMode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              commentMode
                ? 'bg-tertiary text-heading'
                : 'bg-secondary text-alternate hover:bg-secondary/90'
            }`}
          >
            {commentMode ? '✕ Exit Mode' : '📌 Add Comment'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-caption">
        <span>{comments.length} total</span>
        <span>{comments.filter((c) => !c.resolved).length} open</span>
        <span>{comments.filter((c) => c.resolved).length} resolved</span>
      </div>

      {/* Comment Mode Instructions */}
      {commentMode && (
        <div className="p-3 bg-tertiary/20 rounded-lg text-xs text-body">
          <strong>Comment Mode Active:</strong> Click on any element on the page to add a comment. 
          Press <kbd className="px-1 py-0.5 bg-secondary text-alternate rounded mx-1">Esc</kbd> to exit.
        </div>
      )}

      {/* Comment List */}
      <CommentList onScrollToComment={handleScrollToComment} />

      {/* Render pins (portal would be better, but this works for now) */}
      {showPins && comments.map((comment) => (
        <CommentPin
          key={comment.id}
          comment={comment}
          onClick={() => handleScrollToComment(comment.elementSelector)}
        />
      ))}
    </div>
  );
}

