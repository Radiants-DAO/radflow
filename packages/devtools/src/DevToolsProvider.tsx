import { ReactNode, useEffect } from 'react';
import { useDevToolsStore } from './store';
import { DevToolsPanel } from './DevToolsPanel';
import { injectPreviewStyles } from './lib/cssInjector';

interface DevToolsProviderProps {
  children: ReactNode;
}

/**
 * DevToolsProvider - Wraps your app to enable RadFlow DevTools
 *
 * In development: Shows the DevTools panel and enables visual editing
 * In production: Renders only children (no overhead)
 *
 * Keyboard shortcuts:
 * - Shift+Cmd+K (Mac) / Shift+Ctrl+K (Windows) - Toggle Panel
 * - Shift+Cmd+T (Mac) / Shift+Ctrl+T (Windows) - Toggle Text Edit Mode
 * - Shift+Cmd+? (Mac) / Shift+Ctrl+? (Windows) - Toggle Help Mode
 */
export function DevToolsProvider({ children }: DevToolsProviderProps) {
  const { isOpen, togglePanel, panelWidth, previewChanges, isPreviewMode } = useDevToolsStore();

  // Keyboard shortcut: Shift+Cmd+K (Mac) / Shift+Ctrl+K (Windows) - Toggle Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePanel]);

  // Apply body padding to push content away from panel
  useEffect(() => {
    if (!isOpen) {
      document.body.style.paddingRight = '';
      return;
    }

    document.body.style.paddingRight = `${panelWidth}px`;

    return () => {
      document.body.style.paddingRight = '';
    };
  }, [isOpen, panelWidth]);

  // Inject preview styles when in preview mode
  useEffect(() => {
    if (isPreviewMode && previewChanges.length > 0) {
      injectPreviewStyles(previewChanges);
    }
  }, [previewChanges, isPreviewMode]);

  // Production: render only children
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {isOpen && <DevToolsPanel />}
    </>
  );
}

export default DevToolsProvider;
