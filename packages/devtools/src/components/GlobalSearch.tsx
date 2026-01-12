'use client';

import { useEffect, useRef, useState } from 'react';
import { useDevToolsStore } from '../store';
import { buildSearchIndex, searchIndex, type ExtendedSearchableItem } from '../lib/searchIndex';
import type { SearchResult, Tab } from '../types';
import { Input } from '@radflow/ui/Input';
import { Icon } from '@radflow/ui';

export function GlobalSearch() {
  const {
    isSearchOpen,
    searchQuery,
    searchResults,
    selectedResultIndex,
    setSearchQuery,
    setSearchResults,
    setSelectedResultIndex,
    setSearchOpen,
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
    // Convert ExtendedSearchableItem to SearchResult
    const searchResults: SearchResult[] = results.map((item) => {
      // Determine tab ID - design-system maps to components tab
      let tabId: Tab = 'components';
      if (item.tabId === 'design-system') {
        tabId = 'components';
      } else if (item.tabId.startsWith('folder-')) {
        tabId = 'components'; // Folder tabs are sub-tabs of components
      } else {
        tabId = item.tabId as Tab;
      }

      // Determine type based on sectionId
      let type: SearchResult['type'] = 'component';
      if (item.sectionId === 'tokens') type = 'token';
      else if (item.sectionId && ['headings', 'text', 'lists', 'code'].includes(item.sectionId)) type = 'typography';
      else type = 'component';

      return {
        text: item.text,
        type,
        tabId,
        sectionId: item.sectionId,
        metadata: {
          componentName: item.componentName,
          subsectionTitle: item.subsectionTitle,
          subsectionId: item.subsectionTitle?.toLowerCase().replace(/\s+/g, '-'),
        },
      };
    });

    setSearchResults(searchResults);
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
        setSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen, setSearchOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
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
    // Navigate to the correct tab
    setActiveTab(result.tabId);
    
    // Close search
    setSearchOpen(false);
    
    // Scroll to section based on tab type (after delay for tab to render)
    setTimeout(() => {
      if (!result.sectionId) return;

      let element: HTMLElement | null = null;

      if (result.tabId === 'typography') {
        // TypographyTab uses id="typography-{sectionId}" format
        const id = `typography-${result.sectionId}`;
        element = document.getElementById(id);
      } else if (result.tabId === 'components') {
        // ComponentsTab (DesignSystem) uses data-subsection-id attributes
        const subsectionTitle = result.metadata?.subsectionTitle as string | undefined;
        const subsectionIdFromMeta = result.metadata?.subsectionId as string | undefined;
        
        if (subsectionTitle || subsectionIdFromMeta) {
          // Convert subsection title to ID format (e.g., "Button Variants" -> "button-variants")
          const subsectionId = subsectionIdFromMeta || 
            subsectionTitle?.toLowerCase().replace(/\s+/g, '-');
          
          if (subsectionId) {
            element = document.querySelector(`[data-subsection-id="${subsectionId}"]`) as HTMLElement;
          }
        }
        
        // If no subsection found, try to find first subsection in the section
        if (!element && result.sectionId) {
          // All subsections have data-subsection-id, find ones that belong to this section
          // We can't directly match by sectionId, but we can scroll to the tab content area
          // and let the user see the section (it will be filtered/highlighted by search query)
          const tabContent = document.querySelector('[data-radtools-panel] [class*="overflow-auto"]');
          if (tabContent) {
            tabContent.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }
      } else if (result.tabId === 'variables') {
        // VariablesTab sections don't have IDs, but we can try to find by sectionId
        // For now, just scroll to top of tab content
        const tabContent = document.querySelector('[data-radtools-panel] [class*="overflow-auto"]');
        if (tabContent) {
          tabContent.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add a small offset to account for fixed headers
        setTimeout(() => {
          const rect = element!.getBoundingClientRect();
          const offset = 20;
          window.scrollBy({ top: rect.top - offset, behavior: 'smooth' });
        }, 100);
      }
    }, 200); // Increased delay to ensure tab content has rendered
    
    // Call navigateToResult for any additional logic
    navigateToResult(result);
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
    <div className="fixed inset-0 z-[50] flex items-start justify-center pt-[20vh] pointer-events-none">
      <div
        ref={containerRef}
        className="w-full max-w-2xl mx-4 bg-surface-primary border-2 border-edge-primary rounded-sm shadow-[8px_8px_0_0_var(--color-black)] pointer-events-auto"
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
          <div className="max-h-[60vh] overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="divide-y divide-edge-primary/10">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.tabId}-${result.text}-${index}`}
                    type="button"
                    data-result-index={index}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      index === selectedResultIndex
                        ? 'bg-surface-tertiary text-content-primary'
                        : 'bg-surface-primary text-content-primary hover:bg-surface-secondary/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-joystix text-xs uppercase text-content-secondary">
                            {getTypeLabel(result.type)}
                          </span>
                          {result.sectionId && (
                            <>
                              <span className="text-content-tertiary">·</span>
                              <span className="text-xs text-content-secondary font-mono">
                                {result.sectionId}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="font-mondwest text-sm">
                          {highlightText(result.text, searchQuery)}
                        </div>
                        {typeof result.metadata?.componentName === 'string' && (
                          <div className="text-xs text-content-tertiary mt-1 font-mono">
                            {result.metadata.componentName}
                          </div>
                        )}
                      </div>
                      <Icon name="go-forward" size="sm" className="text-content-tertiary flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-content-secondary font-mondwest text-sm">
                No results found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {searchQuery.trim() && searchResults.length > 0 && (
          <div className="px-4 py-2 border-t border-edge-primary/20 bg-surface-secondary/5 text-xs text-content-secondary font-mondwest flex items-center justify-between">
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
