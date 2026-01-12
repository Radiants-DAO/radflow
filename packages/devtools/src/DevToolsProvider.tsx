'use client';

import { ReactNode, useEffect } from 'react';
import { DevToolsPanel } from './DevToolsPanel';
import { TextEditMode } from './components/TextEditMode';
import { HelpMode } from './components/HelpMode';
import { GlobalSearch } from './components/GlobalSearch';
import { ComponentIdMode } from './components/ComponentIdMode';
import { useDevToolsStore } from './store';
import { ToastProvider } from '@radflow/ui/Toast';
import type { Tab } from './types';

interface DevToolsProviderProps {
  children: ReactNode;
}

export function DevToolsProvider({ children }: DevToolsProviderProps) {
  const {
    isOpen,
    isMinimized,
    togglePanel,
    toggleMinimized,
    panelWidth,
    setActiveTab,
    setSearchOpen,
    fetchAvailableThemes,
  } = useDevToolsStore();

  // Initialize: fetch available themes on mount
  useEffect(() => {
    fetchAvailableThemes();
  }, [fetchAvailableThemes]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle minimized: Shift+Cmd+K or Shift+Ctrl+K (always works when panel is open)
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          toggleMinimized();
        } else {
          togglePanel();
        }
        return;
      }

      // Only handle panel-specific shortcuts when panel is open
      if (!isOpen) return;

      // Tab switching: 1-5 (only when panel is focused)
      if (e.key >= '1' && e.key <= '5' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const tabs: Tab[] = ['variables', 'typography', 'components', 'assets', 'mockStates'];
        const index = parseInt(e.key) - 1;
        if (tabs[index]) {
          setActiveTab(tabs[index]);
        }
        return;
      }

      // Escape: Exit modes / Close search
      if (e.key === 'Escape') {
        e.preventDefault();
        setSearchOpen(false);
        // Exit all modes (they'll handle their own toggle)
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    togglePanel,
    toggleMinimized,
    setActiveTab,
    setSearchOpen,
  ]);

  // Inject body padding when panel is open
  useEffect(() => {
    if (!isOpen) {
      document.body.style.paddingRight = '';
      return;
    }

    const style = document.createElement('style');
    style.id = 'devtools-body-padding';
    // Use 60px for minimized panel (LeftRail width), full panelWidth when expanded
    const padding = isMinimized ? 60 : panelWidth;
    style.textContent = `
      body {
        padding-right: ${padding}px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('devtools-body-padding');
      if (existingStyle) {
        existingStyle.remove();
      }
      document.body.style.paddingRight = '';
    };
  }, [isOpen, isMinimized, panelWidth]);

  // Production: render only children
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      {children}
      {isOpen && <DevToolsPanel />}
      <TextEditMode />
      <HelpMode />
      <GlobalSearch />
      <ComponentIdMode />
    </ToastProvider>
  );
}

