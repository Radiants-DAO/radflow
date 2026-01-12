'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@radflow/ui';
import { ThemeIcon as Icon } from './ThemeIcon';
import { useDevToolsStore } from '../store';
import { buildSearchIndex, searchIndex, type ExtendedSearchableItem } from '../lib/searchIndex';
import { SearchPreview } from './SearchPreviews';
import type { SearchResult, Tab, DiscoveredComponent } from '../types';

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

interface SearchInputProps {
  panelWidth?: number;
}

export function SearchInput({ panelWidth = 400 }: SearchInputProps) {
  const {
    searchQuery,
    searchResults,
    selectedResultIndex,
    setSearchQuery,
    setSearchResults,
    setSelectedResultIndex,
    setPendingSubTab,
    navigateToResult,
    setActiveTab,
  } = useDevToolsStore();

  const components = useDevToolsStore((state) => state.components);

  const [searchIndexData, setSearchIndexData] = useState<ExtendedSearchableItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SearchResult['type'] | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter options
  const filterOptions: Array<{ id: SearchResult['type'] | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All', icon: 'search' },
    { id: 'component', label: 'Components', icon: 'component' },
    { id: 'icon', label: 'Icons', icon: 'star' },
    { id: 'token', label: 'Tokens', icon: 'color-swatch' },
    { id: 'typography', label: 'Typography', icon: 'text' },
    { id: 'asset', label: 'Assets', icon: 'image' },
  ];

  // Build search index on mount and when components change
  useEffect(() => {
    const buildIndex = async () => {
      const folderContents: Record<string, DiscoveredComponent[]> = {};
      const index = await buildSearchIndex(components, folderContents);
      setSearchIndexData(index);
    };
    buildIndex();
  }, [components]);

  // Listen for focus-search event (triggered by Cmd+K)
  useEffect(() => {
    const handleFocusSearch = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        setIsSearchFocused(true);
        setSelectedResultIndex(0);
      }
    };

    window.addEventListener('devtools-focus-search', handleFocusSearch);
    return () => window.removeEventListener('devtools-focus-search', handleFocusSearch);
  }, [setSelectedResultIndex]);

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
        originalTabId: item.tabId,
      },
    }));

    setSearchResults(mappedResults);
  }, [searchQuery, searchIndexData, setSearchResults]);

  // Scroll selected result into view
  useEffect(() => {
    if (selectedResultIndex >= 0 && searchResults.length > 0) {
      const resultElement = searchContainerRef.current?.querySelector(
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
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchFocused]);

  // Get filtered results based on active filter
  const filteredResults = activeFilter === 'all' 
    ? searchResults 
    : searchResults.filter(r => r.type === activeFilter);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setSearchQuery('');
      setActiveFilter('all');
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const newIndex = selectedResultIndex < filteredResults.length - 1
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
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      const currentIndex = filterOptions.findIndex(f => f.id === activeFilter);
      const newIndex = currentIndex > 0 ? currentIndex - 1 : filterOptions.length - 1;
      setActiveFilter(filterOptions[newIndex].id);
      setSelectedResultIndex(0);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      const currentIndex = filterOptions.findIndex(f => f.id === activeFilter);
      const newIndex = currentIndex < filterOptions.length - 1 ? currentIndex + 1 : 0;
      setActiveFilter(filterOptions[newIndex].id);
      setSelectedResultIndex(0);
    } else if (e.key === 'Enter' && filteredResults.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      const selected = filteredResults[selectedResultIndex];
      if (selected) {
        handleSelectResult(selected);
      }
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    // Navigate to the correct tab
    setActiveTab(result.tabId);

    // Set pending sub-tab for components tab navigation
    const originalTabId = result.metadata?.originalTabId as string | undefined;
    if (result.tabId === 'components' && originalTabId) {
      setPendingSubTab(originalTabId);
    }

    // Close search
    setIsSearchFocused(false);
    setSearchQuery('');
    setActiveFilter('all');

    // Scroll to section based on tab type (after delay for tab to render)
    setTimeout(() => {
      if (!result.sectionId) return;

      let element: HTMLElement | null = null;

      if (result.tabId === 'typography') {
        const id = `typography-${result.sectionId}`;
        element = document.getElementById(id);
      } else if (result.tabId === 'components') {
        const subsectionTitle = result.metadata?.subsectionTitle as string | undefined;
        const subsectionIdFromMeta = result.metadata?.subsectionId as string | undefined;

        if (subsectionTitle || subsectionIdFromMeta) {
          const subsectionId = subsectionIdFromMeta ||
            subsectionTitle?.toLowerCase().replace(/\s+/g, '-');

          if (subsectionId) {
            element = document.querySelector(`[data-subsection-id="${subsectionId}"]`) as HTMLElement;
          }
        }

        if (!element && result.sectionId) {
          const tabContent = document.querySelector('[data-radtools-panel] [class*="overflow-auto"]');
          if (tabContent) {
            tabContent.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }
      } else if (result.tabId === 'variables') {
        const tabContent = document.querySelector('[data-radtools-panel] [class*="overflow-auto"]');
        if (tabContent) {
          tabContent.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          const rect = element!.getBoundingClientRect();
          const offset = 20;
          window.scrollBy({ top: rect.top - offset, behavior: 'smooth' });
        }, 100);
      }
    }, 200);

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

  const getTypeConfig = (type: SearchResult['type']) => {
    const config: Record<SearchResult['type'], { label: string; icon: string; bgClass: string; textClass: string }> = {
      component: { 
        label: 'Component', 
        icon: 'component', 
        bgClass: 'bg-sky-blue/20', 
        textClass: 'text-sky-blue' 
      },
      icon: { 
        label: 'Icon', 
        icon: 'star', 
        bgClass: 'bg-sun-yellow/30', 
        textClass: 'text-content-primary' 
      },
      token: { 
        label: 'Token', 
        icon: 'color-swatch', 
        bgClass: 'bg-green/20', 
        textClass: 'text-green' 
      },
      typography: { 
        label: 'Typography', 
        icon: 'text', 
        bgClass: 'bg-sunset-fuzz/20', 
        textClass: 'text-sunset-fuzz' 
      },
      asset: { 
        label: 'Asset', 
        icon: 'image', 
        bgClass: 'bg-content-primary/10', 
        textClass: 'text-content-primary' 
      },
    };
    return config[type] || { label: 'Item', icon: 'file', bgClass: 'bg-surface-tertiary', textClass: 'text-content-primary' };
  };

  const showResults = isSearchFocused && searchQuery.trim().length > 0;

  return (
    <div ref={searchContainerRef} style={{ display: 'contents' }}>
      <Input
        ref={inputRef}
        type="text"
        iconName="search"
        placeholder="Search... (⌘K)"
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsSearchFocused(true);
          setSelectedResultIndex(0);
        }}
        className="h-full !bg-surface-elevated border border-edge-primary rounded-sm"
        size="sm"
      />

      {/* Results Dropdown - full width overlay */}
      {showResults && (
        <div
          className="fixed top-[3rem] right-0.5rem bg-surface-primary border border-edge-primary rounded-sm shadow-[0.25rem_0.25rem_0_0_var(--color-black)] z-50 flex flex-col"
          style={{ 
            width: `${panelWidth - 16}px`, 
            borderWidth: '0.0625rem', 
            borderStyle: 'solid', 
            borderColor: 'var(--color-edge-primary)',
            maxHeight: 'calc(100vh - 3rem - 0.5rem)'
          }}
        >
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-2 py-2 border-b border-edge-primary/20 bg-surface-tertiary/30">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.id;
              const count = filter.id === 'all' 
                ? searchResults.length 
                : searchResults.filter(r => r.type === filter.id).length;
              
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setSelectedResultIndex(0);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-joystix uppercase transition-colors ${
                    isActive
                      ? 'bg-surface-elevated text-content-primary border border-edge-primary shadow-[1px_1px_0_0_var(--color-black)]'
                      : 'text-content-primary/60 hover:text-content-primary hover:bg-surface-tertiary/50'
                  }`}
                >
                  <Icon name={filter.icon} size={10} className="opacity-70" />
                  <span>{filter.label}</span>
                  {count > 0 && (
                    <span className={`ml-0.5 ${isActive ? 'text-content-primary/70' : 'text-content-primary/40'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {filteredResults.length > 0 ? (
            <>
              <div className="flex-1 overflow-y-auto divide-y divide-edge-primary/10 min-h-0">
                {filteredResults.map((result, index) => (
                  <button
                    key={`${result.tabId}-${result.text}-${index}`}
                    type="button"
                    data-result-index={index}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      index === selectedResultIndex
                        ? 'bg-surface-tertiary text-content-primary'
                        : 'bg-surface-elevated text-content-primary hover:bg-surface-tertiary/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Preview thumbnail */}
                      <div className="w-16 h-14 flex items-center justify-center bg-surface-tertiary/50 rounded-sm border border-edge-primary/30 flex-shrink-0 overflow-hidden">
                        <SearchPreview
                          type={result.type}
                          text={result.text}
                          sectionId={result.sectionId}
                        />
                      </div>
                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {/* Type badge with icon */}
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-joystix text-[10px] uppercase ${getTypeConfig(result.type).bgClass} ${getTypeConfig(result.type).textClass}`}>
                            <Icon name={getTypeConfig(result.type).icon} size={10} className="opacity-80" />
                            {getTypeConfig(result.type).label}
                          </span>
                          {result.sectionId && (
                            <span className="text-[10px] text-content-primary/50 font-mono bg-surface-tertiary/50 px-1 py-0.5 rounded-xs">
                              {result.sectionId}
                            </span>
                          )}
                        </div>
                        <div className="font-mondwest text-sm text-content-primary truncate">
                          {highlightText(result.text, searchQuery)}
                        </div>
                        {typeof result.metadata?.componentName === 'string' && (
                          <div className="text-xs text-content-primary/60 mt-0.5 font-mono truncate">
                            {result.metadata.componentName}
                          </div>
                        )}
                      </div>
                      <Icon name="go-forward" size="sm" className="text-content-primary/50 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-edge-primary/20 bg-surface-tertiary/20 text-xs text-content-primary/70 font-mondwest flex items-center justify-between">
                <span>
                  {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
                  {activeFilter !== 'all' && ` in ${filterOptions.find(f => f.id === activeFilter)?.label}`}
                </span>
                <span className="flex items-center gap-3">
                  <span>←→ Filter</span>
                  <span>↑↓ Navigate</span>
                  <span>Enter Select</span>
                </span>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-content-primary/70 font-mondwest text-sm">
              {searchResults.length > 0 && activeFilter !== 'all' ? (
                <>
                  No {filterOptions.find(f => f.id === activeFilter)?.label.toLowerCase()} found for &quot;{searchQuery}&quot;
                  <div className="mt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className="text-sky-blue hover:underline"
                    >
                      View all {searchResults.length} results
                    </button>
                  </div>
                </>
              ) : (
                <>No results found for &quot;{searchQuery}&quot;</>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
