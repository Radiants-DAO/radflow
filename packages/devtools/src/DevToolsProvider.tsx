'use client';

import { ReactNode, useEffect, useState } from 'react';
import { DevToolsPanel } from './DevToolsPanel';
import { TextEditMode } from './components/TextEditMode';
import { HelpMode } from './components/HelpMode';
import { ComponentIdMode } from './components/ComponentIdMode';
import { useDevToolsStore } from './store';
import { ToastProvider, IconProvider, IconLibrary, PhosphorWeight } from '@radflow/ui';
import type { Tab } from './types';

interface IconConfig {
  library: IconLibrary;
  weight: PhosphorWeight;
}

interface DevToolsProviderProps {
  children: ReactNode;
}

export function DevToolsProvider({ children }: DevToolsProviderProps) {
  const {
    isOpen,
    togglePanel,
    panelWidth,
    setActiveTab,
    setSearchOpen,
    fetchAvailableThemes,
    toggleHelpMode,
    openSettings,
    isTextEditActive,
  } = useDevToolsStore();

  // Icon configuration from active theme
  const [iconConfig, setIconConfig] = useState<IconConfig>({ library: 'svg', weight: 'regular' });

  // Initialize: fetch available themes and icon config on mount
  useEffect(() => {
    fetchAvailableThemes();

    // Fetch icon configuration from active theme
    fetch('/api/devtools/icons')
      .then((res) => res.json())
      .then((data) => {
        if (data.iconLibrary?.library) {
          setIconConfig({
            library: data.iconLibrary.library.toLowerCase() as IconLibrary,
            weight: (data.iconLibrary.style as PhosphorWeight) || 'regular',
          });
        }
      })
      .catch(() => {
        // Fallback to SVG icons
        setIconConfig({ library: 'svg', weight: 'regular' });
      });
  }, [fetchAvailableThemes]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea/contenteditable
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true'
      );

      // Toggle panel: Shift+Cmd+K or Shift+Ctrl+K
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        togglePanel();
        return;
      }

      // Cmd+K: Focus search (only when panel is open)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'k') {
        if (isOpen) {
          e.preventDefault();
          // Focus search input by dispatching a custom event or using a ref
          // We'll use a custom event that TopBar can listen to
          window.dispatchEvent(new CustomEvent('devtools-focus-search'));
        }
        return;
      }

      // Cmd+Shift+?: Toggle Help mode (only when panel is open)
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key === '?') {
        if (isOpen) {
          e.preventDefault();
          toggleHelpMode();
        }
        return;
      }

      // Cmd+Shift+.: Open Settings (only when panel is open)
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key === '.') {
        if (isOpen) {
          e.preventDefault();
          openSettings();
        }
        return;
      }

      // Only handle panel-specific shortcuts when panel is open
      if (!isOpen) return;

      // Tab switching: 1-6 (only when not typing in an input)
      if (e.key >= '1' && e.key <= '6' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping && !isTextEditActive) {
        e.preventDefault();
        const tabs: Tab[] = ['variables', 'typography', 'components', 'assets', 'ai', 'mockStates'];
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
    setActiveTab,
    setSearchOpen,
    toggleHelpMode,
    openSettings,
    isTextEditActive,
  ]);

  // Inject body padding when panel is open
  useEffect(() => {
    if (!isOpen) {
      document.body.style.paddingRight = '';
      return;
    }

    const style = document.createElement('style');
    style.id = 'devtools-body-padding';
    style.textContent = `
      body {
        padding-right: ${panelWidth}px !important;
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
  }, [isOpen, panelWidth]);

  // Production: render only children
  if (process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  return (
    <IconProvider library={iconConfig.library} weight={iconConfig.weight}>
      <ToastProvider>
        {children}
        {isOpen && <DevToolsPanel />}
        <TextEditMode />
        <HelpMode />
        <ComponentIdMode />
      </ToastProvider>
    </IconProvider>
  );
}

