import { StateCreator } from 'zustand';
import type { Comment, Reply } from '../../types';

export interface CommentsSlice {
  // State
  comments: Comment[];
  commentMode: boolean;
  showPins: boolean;
  commentFilter: 'all' | 'open' | 'resolved';
  
  // Actions
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>) => void;
  updateComment: (id: string, updates: Partial<Comment>) => void;
  deleteComment: (id: string) => void;
  resolveComment: (id: string) => void;
  addReply: (commentId: string, reply: Omit<Reply, 'id' | 'createdAt'>) => void;
  
  setCommentMode: (mode: boolean) => void;
  setShowPins: (show: boolean) => void;
  setCommentFilter: (filter: 'all' | 'open' | 'resolved') => void;
}

// Session ID for tracking ownership
const getSessionId = () => {
  if (typeof window === 'undefined') return 'server';
  let id = sessionStorage.getItem('devtools-session-id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('devtools-session-id', id);
  }
  return id;
};

export const createCommentsSlice: StateCreator<CommentsSlice, [], [], CommentsSlice> = (set) => ({
  comments: [],
  commentMode: false,
  showPins: true,
  commentFilter: 'all',

  addComment: (comment) => set((state) => ({
    comments: [...state.comments, {
      ...comment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      replies: [],
    }]
  })),

  updateComment: (id, updates) => set((state) => ({
    comments: state.comments.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    )
  })),

  deleteComment: (id) => set((state) => ({
    comments: state.comments.filter((c) => c.id !== id)
  })),

  resolveComment: (id) => set((state) => ({
    comments: state.comments.map((c) =>
      c.id === id ? { ...c, resolved: true } : c
    )
  })),

  addReply: (commentId, reply) => set((state) => ({
    comments: state.comments.map((c) =>
      c.id === commentId
        ? {
            ...c,
            replies: [...c.replies, {
              ...reply,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            }]
          }
        : c
    )
  })),

  setCommentMode: (commentMode) => set({ commentMode }),
  setShowPins: (showPins) => set({ showPins }),
  setCommentFilter: (commentFilter) => set({ commentFilter }),
});

