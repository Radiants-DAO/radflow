'use client';

import { ReactNode, useEffect } from 'react';
import { DevToolsPanel } from './DevToolsPanel';
import { BreakpointIndicator } from './components/BreakpointIndicator';
import { CommentOverlay } from './tabs/CommentsTab/CommentOverlay';
import { useDevToolsStore } from './store';

interface DevToolsProviderProps {
  children: ReactNode;
}

export function DevToolsProvider({ children }: DevToolsProviderProps) {
  const { isOpen, togglePanel, commentMode } = useDevToolsStore();

  // Keyboard shortcut: Shift+Cmd+K (Mac) / Shift+Ctrl+K (Windows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle panel with Shift+Cmd+K or Shift+Ctrl+K
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePanel();
      }
      
      // Exit comment mode with Escape
      if (e.key === 'Escape' && commentMode) {
        useDevToolsStore.getState().setCommentMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePanel, commentMode]);

  // Production: render only children
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {isOpen && <DevToolsPanel />}
      <BreakpointIndicator />
      <CommentOverlay />
    </>
  );
}

