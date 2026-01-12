'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button, Icon } from '@radflow/ui';
import { useDevToolsStore } from '../store';

interface TokenEditorProps {
  /** Whether the editor is open */
  open: boolean;
  /** Callback to close the editor */
  onClose: () => void;
}

interface Token {
  name: string;
  value: string;
  category: 'color' | 'spacing' | 'radius' | 'shadow' | 'typography';
  description?: string;
}

export function TokenEditor({ open, onClose }: TokenEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);

  const { baseColors, semanticTokens, borderRadius, shadows } = useDevToolsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert store tokens to editable format
  useEffect(() => {
    const tokenList: Token[] = [];

    // Add base color tokens
    baseColors.forEach((color) => {
      tokenList.push({
        name: color.name,
        value: color.value,
        category: 'color',
        description: color.displayName,
      });
    });

    // Add semantic color tokens
    semanticTokens.forEach((token) => {
      tokenList.push({
        name: token.name,
        value: token.value,
        category: 'color',
        description: token.displayName,
      });
    });

    // Add radius tokens
    Object.entries(borderRadius).forEach(([name, value]) => {
      tokenList.push({
        name: `radius-${name}`,
        value,
        category: 'radius',
      });
    });

    // Add shadow tokens
    shadows.forEach((shadow) => {
      tokenList.push({
        name: shadow.name,
        value: shadow.value,
        category: 'shadow',
      });
    });

    setTokens(tokenList);
  }, [baseColors, semanticTokens, borderRadius, shadows]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!mounted || !open) return null;

  // Filter tokens based on search and category
  const filteredTokens = tokens.filter((token) => {
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'color', 'spacing', 'radius', 'shadow', 'typography'];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay/80 animate-fadeIn">
      {/* Full-screen modal container */}
      <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] m-4 bg-surface-primary border-2 border-edge-primary rounded-sm shadow-card-lg animate-scaleIn flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-edge-primary">
          <div>
            <h2 className="text-lg font-semibold text-content-primary">Token Editor</h2>
            <p className="text-xs text-content-secondary mt-1">Edit design tokens with live preview</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? 'Light' : 'Dark'} Mode
            </Button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-surface-secondary transition-colors"
              aria-label="Close"
            >
              <Icon name="close" size={16} className="text-content-primary" />
            </button>
          </div>
        </div>

        {/* Main content: Split panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel: Token editor */}
          <div className="w-1/2 flex flex-col border-r border-edge-primary">
            {/* Search and filters */}
            <div className="p-4 border-b border-edge-primary space-y-3">
              {/* Search */}
              <div className="relative">
                <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-secondary" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-edge-primary rounded-sm text-sm text-content-primary placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-edge-focus"
                />
              </div>

              {/* Category filter */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-xs rounded-sm border transition-colors ${
                      selectedCategory === category
                        ? 'bg-surface-tertiary border-edge-focus text-content-primary'
                        : 'bg-surface-secondary border-edge-primary text-content-secondary hover:bg-surface-tertiary'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Token list */}
            <div className="flex-1 overflow-auto p-4 space-y-2">
              {filteredTokens.length === 0 ? (
                <div className="text-center py-8 text-content-secondary text-sm">
                  No tokens found
                </div>
              ) : (
                filteredTokens.map((token) => (
                  <div
                    key={token.name}
                    className="p-3 bg-surface-secondary border border-edge-primary rounded-sm hover:border-edge-focus transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-content-primary truncate">
                          {token.name}
                        </p>
                        <p className="text-xs text-content-secondary mt-1">
                          {token.value}
                        </p>
                        {token.description && (
                          <p className="text-xs text-content-tertiary mt-1">
                            {token.description}
                          </p>
                        )}
                      </div>
                      {token.category === 'color' && (
                        <div
                          className="w-8 h-8 rounded-sm border border-edge-primary flex-shrink-0"
                          style={{ backgroundColor: token.value }}
                          title={token.value}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel: Live preview */}
          <div className={`w-1/2 flex flex-col ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex-1 overflow-auto p-6 bg-surface-primary">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-content-primary mb-3">Typography</h3>
                  <div className="space-y-2">
                    <h1 className="text-content-primary">Heading 1</h1>
                    <h2 className="text-content-primary">Heading 2</h2>
                    <h3 className="text-content-primary">Heading 3</h3>
                    <p className="text-content-primary">Body text paragraph with normal styling.</p>
                    <p className="text-content-secondary text-sm">Secondary text in smaller size.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-content-primary mb-3">Buttons</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="primary" size="md">Primary</Button>
                    <Button variant="secondary" size="md">Secondary</Button>
                    <Button variant="outline" size="md">Outline</Button>
                    <Button variant="ghost" size="md">Ghost</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-content-primary mb-3">Cards</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-surface-secondary border border-edge-primary rounded-sm">
                      <p className="text-sm font-medium text-content-primary">Card Title</p>
                      <p className="text-xs text-content-secondary mt-1">Card description text</p>
                    </div>
                    <div className="p-4 bg-surface-tertiary border border-edge-primary rounded-md shadow-card">
                      <p className="text-sm font-medium text-content-primary">Elevated Card</p>
                      <p className="text-xs text-content-secondary mt-1">With shadow</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-content-primary mb-3">Inputs</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Text input"
                      className="w-full px-3 py-2 bg-surface-secondary border border-edge-primary rounded-sm text-sm text-content-primary placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-edge-focus"
                    />
                    <textarea
                      placeholder="Textarea"
                      rows={3}
                      className="w-full px-3 py-2 bg-surface-secondary border border-edge-primary rounded-sm text-sm text-content-primary placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-edge-focus resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-edge-primary bg-surface-secondary">
          <p className="text-xs text-content-secondary">
            Changes are previewed in real-time. Click Save to apply.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={onClose}>
              Save to CSS
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
