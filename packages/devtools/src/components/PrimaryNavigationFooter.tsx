'use client';

import { useState, useRef, useEffect } from 'react';
import type { Tab } from '../types';
import { Input } from '@radflow/ui/Input';
import { TYPOGRAPHY_SEARCH_INDEX, type TypographySearchableItem } from '../lib/searchIndexes';

interface PrimaryNavigationFooterProps {
  activeTab: Tab;
  // Search props (only typography now - component search moved to ComponentsSecondaryNav)
  typographySearchQuery?: string;
  onTypographySearchChange?: (query: string) => void;
}


export function PrimaryNavigationFooter({
  activeTab,
  typographySearchQuery = '',
  onTypographySearchChange,
}: PrimaryNavigationFooterProps) {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showSearch = activeTab === 'typography';
  const searchQuery = typographySearchQuery;
  const onSearchChange = onTypographySearchChange;

  // Get matching suggestions (only typography now)
  const suggestions = searchQuery
    ? TYPOGRAPHY_SEARCH_INDEX.filter((item) => {
        const queryLower = searchQuery.toLowerCase();
        return (
          item.text.toLowerCase().includes(queryLower) ||
          item.aliases.some((alias) => alias.toLowerCase().includes(queryLower)) ||
          item.element.toLowerCase().includes(queryLower)
        );
      }).slice(0, 10)
    : [];

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
    setShowAutocomplete(true);
    setSelectedSuggestionIndex(0);
  };

  const handleSelectSuggestion = (item: TypographySearchableItem) => {
    if (onSearchChange) {
      onSearchChange(item.text);
    }
    setShowAutocomplete(false);
    
    // Scroll to section for typography
    const sectionElement = document.getElementById(`typography-${item.sectionId}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestions.length > 0 && showAutocomplete) {
      e.preventDefault();
      if (suggestions[selectedSuggestionIndex]) {
        handleSelectSuggestion(suggestions[selectedSuggestionIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowAutocomplete(true);
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && suggestions.length > 0 && showAutocomplete) {
      e.preventDefault();
      if (suggestions[selectedSuggestionIndex]) {
        handleSelectSuggestion(suggestions[selectedSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
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

  return (
    <div className="flex items-center justify-end gap-4 px-2 py-2 bg-surface-primary border-t border-edge-primary">
      {/* Right: Search (only for Typography - component search moved to ComponentsSecondaryNav) */}
      {showSearch && (
        <div className="relative flex-shrink-0 w-fit" ref={containerRef}>
          <Input
            ref={inputRef}
            type="text"
            iconName="search"
            placeholder="Search typography (H1, Heading 1, P, Paragraph...)"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowAutocomplete(true)}
          />
          {/* Autocomplete */}
          {showAutocomplete && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-surface-primary border border-edge-primary rounded-sm shadow-[4px_4px_0_0_var(--color-black)] max-h-64 overflow-y-auto bottom-full mb-1">
              {suggestions.map((item, index) => {
                const typographyItem = item as TypographySearchableItem;
                return (
                  <button
                    key={`${typographyItem.sectionId}-${typographyItem.text}-${index}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(typographyItem)}
                    className={`w-full text-left px-3 py-2 font-mondwest text-sm transition-colors ${
                      index === selectedSuggestionIndex
                        ? 'bg-surface-tertiary text-content-primary'
                        : 'bg-surface-primary text-content-primary hover:bg-surface-secondary/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-joystix text-xs font-bold text-content-primary/60 uppercase">
                          {typographyItem.sectionId}
                        </span>
                        <span>{highlightText(typographyItem.text, searchQuery)}</span>
                      </div>
                      <span className="text-xs text-content-primary/40 uppercase font-mono">
                        {`<${typographyItem.element}>`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

