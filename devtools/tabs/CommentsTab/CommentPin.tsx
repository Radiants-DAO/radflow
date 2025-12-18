'use client';

import { useEffect, useState } from 'react';
import { findElementBySelector } from '../../lib/selectorGenerator';
import type { Comment } from '../../types';

interface CommentPinProps {
  comment: Comment;
  onClick: () => void;
}

export function CommentPin({ comment, onClick }: CommentPinProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const element = findElementBySelector(comment.elementSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.right + window.scrollX + 4,
        });
      } else {
        setPosition(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [comment.elementSelector]);

  if (!position) return null;

  return (
    <button
      onClick={onClick}
      className={`fixed z-[9997] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform hover:scale-110 ${
        comment.resolved
          ? 'bg-success text-heading'
          : 'bg-tertiary text-heading'
      }`}
      style={{
        top: position.top,
        left: position.left,
      }}
      title={comment.text}
    >
      💬
    </button>
  );
}

