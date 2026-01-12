'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@radflow/ui/Input';
import { TYPOGRAPHY_SEARCH_INDEX, type TypographySearchableItem } from '../lib/searchIndexes';

interface TypographyFooterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TypographyFooter({
  searchQuery,
  onSearchChange,
}: TypographyFooterProps) {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on search query
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setShowAutocomplete(true);
    setSelectedSuggestionIndex(0);
  };

  const handleSelectSuggestion = (item: TypographySearchableItem) => {
    onSearchChange(item.text);
    setShowAutocomplete(false);
    // Scroll to the section
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
    <div className="flex items-center justify-end px-4 py-2 bg-surface-primary border-t border-edge-primary">
      <div className="relative w-80" ref={containerRef}>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search typography (H1, Heading 1, P, Paragraph...)"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowAutocomplete(true)}
        />
        {showAutocomplete && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-surface-primary border border-edge-primary rounded-sm shadow-[4px_4px_0_0_var(--color-black)] max-h-64 overflow-y-auto bottom-full mb-1">
            {suggestions.map((item, index) => (
              <button
                key={`${item.sectionId}-${item.text}-${index}`}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className={`w-full text-left px-3 py-2 font-mondwest text-sm transition-colors ${
                  index === selectedSuggestionIndex
                    ? 'bg-surface-tertiary text-content-primary'
                    : 'bg-surface-primary text-content-primary hover:bg-surface-tertiary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-joystix text-xs font-bold text-content-primary/60 uppercase">
                      {item.sectionId}
                    </span>
                    <span>{highlightText(item.text, searchQuery)}</span>
                  </div>
                  <span className="text-xs text-content-primary/40 uppercase font-mono">
                    {`<${item.element}>`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

