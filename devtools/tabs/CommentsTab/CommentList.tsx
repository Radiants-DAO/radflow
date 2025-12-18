'use client';

import { useDevToolsStore } from '../../store';
import type { Comment } from '../../types';

interface CommentListProps {
  onScrollToComment: (selector: string) => void;
}

export function CommentList({ onScrollToComment }: CommentListProps) {
  const { 
    comments, 
    commentFilter, 
    setCommentFilter,
    resolveComment, 
    deleteComment,
    addReply 
  } = useDevToolsStore();

  // Filter comments
  const filteredComments = comments.filter((c) => {
    if (commentFilter === 'open') return !c.resolved;
    if (commentFilter === 'resolved') return c.resolved;
    return true;
  });

  const handleReply = (commentId: string) => {
    const text = prompt('Enter your reply:');
    if (text) {
      addReply(commentId, {
        text,
        sessionId: sessionStorage.getItem('devtools-session-id') || 'unknown',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-3">
      {/* Filter */}
      <div className="flex gap-1">
        {(['all', 'open', 'resolved'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setCommentFilter(filter)}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              commentFilter === filter
                ? 'bg-panel-active text-heading'
                : 'text-caption hover:text-body'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Comments */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {filteredComments.length === 0 ? (
          <p className="text-xs text-caption italic text-center py-4">
            {commentFilter === 'all' 
              ? 'No comments yet. Toggle comment mode to add one!'
              : `No ${commentFilter} comments`}
          </p>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border ${
                comment.resolved 
                  ? 'bg-panel-hover border-border opacity-60' 
                  : 'bg-panel border-border-accent'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <button
                  onClick={() => onScrollToComment(comment.elementSelector)}
                  className="text-xs text-link hover:underline text-left flex-1 font-mono truncate"
                >
                  {comment.elementPreview}
                </button>
                <span className="text-xs text-caption whitespace-nowrap">
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              {/* Comment Text */}
              <p className="text-sm text-body mb-2">{comment.text}</p>

              {/* Element Path */}
              <p className="text-xs text-caption font-mono mb-2 truncate">
                {comment.elementPath.join(' › ')}
              </p>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-3 pl-3 border-l border-border space-y-2 mb-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-xs">
                      <span className="text-caption">{formatDate(reply.createdAt)}</span>
                      <p className="text-body">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleReply(comment.id)}
                  className="text-xs text-link hover:underline"
                >
                  Reply
                </button>
                {!comment.resolved && (
                  <button
                    onClick={() => resolveComment(comment.id)}
                    className="text-xs text-success hover:underline"
                  >
                    Resolve
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Delete this comment?')) {
                      deleteComment(comment.id);
                    }
                  }}
                  className="text-xs text-error hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

