'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useDevToolsStore } from '../store';
import { buildSearchIndex, searchIndex, type ExtendedSearchableItem } from '../lib/searchIndex';
import type { SearchResult, Tab } from '../types';
import { Input } from '@radflow/ui';
import { ThemeIcon as Icon } from './ThemeIcon';
import { scrollToTarget, clearSpotlight, resolveTypographyNavigation } from '../lib/navigationUtils';

const TYPOGRAPHY_SECTIONS = ['headings', 'text', 'lists', 'code'];

function getTabIdFromSearchItem(itemTabId: string): Tab {
  // Main tabs that are NOT component folders
  const MAIN_TABS = ['variables', 'typography', 'components', 'assets', 'ai', 'mock-states'];
  // If it's a main tab, return it directly
  if (MAIN_TABS.includes(itemTabId)) {
    return itemTabId as Tab;
  }
  // Otherwise it's a component folder (core, forms, etc.) - map to 'components' tab
  return 'components';
}

function getTypeFromSectionId(sectionId: string | undefined): SearchResult['type'] {
  if (sectionId === 'tokens') return 'token';
  if (sectionId && TYPOGRAPHY_SECTIONS.includes(sectionId)) return 'typography';
  return 'component';
}

export function GlobalSearch(): React.ReactElement | null {
  const {
    isSearchOpen,
    searchQuery,
    searchResults,
    selectedResultIndex,
    setSearchQuery,
    setSearchResults,
    setSelectedResultIndex,
    setSearchOpen,
    setPendingSubTab,
    navigateToResult,
    setActiveTab,
  } = useDevToolsStore();

  const [searchIndexData, setSearchIndexData] = useState<ExtendedSearchableItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const components = useDevToolsStore((state) => state.components);

  // Build search index on mount and when components change
  useEffect(() => {
    const buildIndex = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const folderContents: Record<string, any[]> = {};
      const index = await buildSearchIndex(components, folderContents);
      setSearchIndexData(index);
    };

    buildIndex();
  }, [components]);

  // Update search results when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = searchIndex(searchIndexData, searchQuery);
    const mappedResults: SearchResult[] = results.map((item) => ({
      text: item.text,
      type: getTypeFromSectionId(item.sectionId),
      tabId: getTabIdFromSearchItem(item.tabId),
      sectionId: item.sectionId,
      metadata: {
        componentName: item.componentName,
        subsectionTitle: item.subsectionTitle,
        subsectionId: item.subsectionTitle?.toLowerCase().replace(/\s+/g, '-'),
        originalTabId: item.tabId, // Preserve for sub-tab navigation
      },
    }));

    setSearchResults(mappedResults);
  }, [searchQuery, searchIndexData, setSearchResults]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchQuery('');
      setSelectedResultIndex(0);
    }
  }, [isSearchOpen, setSearchQuery, setSelectedResultIndex]);

  // Scroll selected result into view
  useEffect(() => {
    if (selectedResultIndex >= 0 && searchResults.length > 0) {
      const resultElement = containerRef.current?.querySelector(
        `[data-result-index="${selectedResultIndex}"]`
      ) as HTMLElement;
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedResultIndex, searchResults.length]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearSpotlight();
        setSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen, setSearchOpen]);

  // Preview result: scroll to element without closing search
  const previewResult = useCallback((result: SearchResult) => {
    // Navigate to correct tab without closing search
    setActiveTab(result.tabId);

    const originalTabId = result.metadata?.originalTabId as string | undefined;
    if (result.tabId === 'components' && originalTabId) {
      setPendingSubTab(originalTabId);
    }

    // Scroll to element after short delay for tab to render
    setTimeout(() => {
      const subsectionId = result.metadata?.subsectionId as string | undefined;
      if (result.tabId === 'typography' && result.sectionId) {
        // Use navigation utils for typography
        const navTarget = resolveTypographyNavigation(result.sectionId);
        if (navTarget) {
          scrollToTarget(navTarget, { spotlight: true, spotlightDuration: 0, block: 'center' });
        }
      } else if (subsectionId) {
        scrollToTarget(
          { tabId: result.tabId, subsectionId },
          { spotlight: true, spotlightDuration: 0, block: 'center' }
        );
      }
    }, 150);
  }, [setActiveTab, setPendingSubTab]);

  // Live preview on arrow navigation
  useEffect(() => {
    if (!isSearchOpen || searchResults.length === 0) return;

    const result = searchResults[selectedResultIndex];
    if (result) {
      previewResult(result);
    }
  }, [selectedResultIndex, isSearchOpen, searchResults, previewResult]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      clearSpotlight();
      setSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const newIndex = selectedResultIndex < searchResults.length - 1 
        ? selectedResultIndex + 1 
        : selectedResultIndex;
      setSelectedResultIndex(newIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      const newIndex = selectedResultIndex > 0 
        ? selectedResultIndex - 1 
        : 0;
      setSelectedResultIndex(newIndex);
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      const selected = searchResults[selectedResultIndex];
      if (selected) {
        handleSelectResult(selected);
      }
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    // Clear any preview spotlight
    clearSpotlight();

    // Navigate to the correct tab
    setActiveTab(result.tabId);

    // Set pending sub-tab for components tab navigation
    const originalTabId = result.metadata?.originalTabId as string | undefined;
    if (result.tabId === 'components' && originalTabId) {
      setPendingSubTab(originalTabId);
    }

    // Close search
    setSearchOpen(false);

    // Scroll to element with confirmed spotlight (2 second duration)
    setTimeout(() => {
      const subsectionId = result.metadata?.subsectionId as string | undefined;
      if (result.tabId === 'typography' && result.sectionId) {
        // Use navigation utils for typography with spotlight
        const navTarget = resolveTypographyNavigation(result.sectionId);
        if (navTarget) {
          scrollToTarget(navTarget, { spotlight: true, spotlightDuration: 2000, block: 'center' });
        }
      } else if (subsectionId) {
        scrollToTarget(
          { tabId: result.tabId, subsectionId },
          { spotlight: true, spotlightDuration: 2000, block: 'center' }
        );
      }
    }, 150);

    // Call navigateToResult for any additional logic
    navigateToResult(result);
  };

  // Handle hover on result - trigger preview
  const handleResultHover = (result: SearchResult, index: number) => {
    setSelectedResultIndex(index);
    // Preview will be triggered by the useEffect watching selectedResultIndex
  };

  const highlightText = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span className="bg-surface-tertiary">{text.substring(index, index + query.length)}</span>
        {text.substring(index + query.length)}
      </>
    );
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    const labels: Record<SearchResult['type'], string> = {
      component: 'Component',
      icon: 'Icon',
      token: 'Token',
      typography: 'Typography',
      asset: 'Asset',
    };
    return labels[type] || 'Item';
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed bottom-4 right-[70px] z-[50] w-[350px] pointer-events-none">
      <div
        ref={containerRef}
        className="w-full bg-surface-primary border-2 border-edge-primary rounded-sm shadow-[4px_4px_0_0_var(--color-black)] pointer-events-auto"
      >
        {/* Search Input */}
        <div className="p-4 border-b border-edge-primary/20">
          <Input
            ref={inputRef}
            type="text"
            iconName="search"
            placeholder="Search components, icons, tokens, typography..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>

        {/* Results */}
        {searchQuery.trim() && (
          <div className="max-h-[300px] overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="divide-y divide-edge-primary/10">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.tabId}-${result.text}-${index}`}
                    type="button"
                    data-result-index={index}
                    onClick={() => handleSelectResult(result)}
                    onMouseEnter={() => handleResultHover(result, index)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      index === selectedResultIndex
                        ? 'bg-surface-tertiary text-content-primary'
                        : 'bg-surface-primary text-content-primary hover:bg-surface-tertiary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-joystix text-xs uppercase text-content-primary">
                            {getTypeLabel(result.type)}
                          </span>
                          {result.sectionId && (
                            <>
                              <span className="text-content-primary/50">·</span>
                              <span className="text-xs text-content-primary/70 font-mono">
                                {result.sectionId}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="font-mondwest text-sm text-content-primary">
                          {highlightText(result.text, searchQuery)}
                        </div>
                        {typeof result.metadata?.componentName === 'string' && (
                          <div className="text-xs text-content-primary/60 mt-1 font-mono">
                            {result.metadata.componentName}
                          </div>
                        )}
                      </div>
                      <Icon name="go-forward" size="sm" className="text-content-primary/50 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-content-primary/70 font-mondwest text-sm">
                No results found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {searchQuery.trim() && searchResults.length > 0 && (
          <div className="px-4 py-2 border-t border-edge-primary/20 bg-surface-tertiary/20 text-xs text-content-primary/70 font-mondwest flex items-center justify-between">
            <span>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>Enter Select</span>
              <span>Esc Close</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
