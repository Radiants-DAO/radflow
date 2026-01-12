'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { Button } from '@radflow/ui/Button';
import { ThemeIcon as Icon } from '../../components/ThemeIcon';
import { useDevToolsStore } from '../../store';
import type { PendingChanges } from './index';

interface LivePreviewProps {
  open: boolean;
  onClose: () => void;
  pendingChanges: PendingChanges;
}

export function LivePreview({ open, onClose, pendingChanges }: LivePreviewProps) {
  const { baseColors } = useDevToolsStore();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle animation states
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Generate CSS variables for pending changes
  const generateCSSVariables = (): string => {
    const vars: string[] = [];

    // Color changes
    pendingChanges.colorValues.forEach((value, name) => {
      vars.push(`--color-${name}: ${value};`);
    });

    // Radius changes
    pendingChanges.radiusValues.forEach((value, key) => {
      vars.push(`--radius-${key}: ${value};`);
    });

    // Shadow changes
    pendingChanges.shadowValues.forEach((value, name) => {
      vars.push(`--shadow-${name}: ${value};`);
    });

    // Semantic mapping changes - resolve to actual colors
    pendingChanges.semanticMappings.forEach((baseColorName, tokenId) => {
      const baseColor = baseColors.find((c) => c.name === baseColorName);
      if (baseColor) {
        const colorValue = pendingChanges.colorValues.get(baseColorName) ?? baseColor.value;
        vars.push(`--color-${tokenId}: ${colorValue};`);
      }
    });

    return vars.join('\n');
  };

  const hasPendingChanges =
    pendingChanges.colorValues.size > 0 ||
    pendingChanges.radiusValues.size > 0 ||
    pendingChanges.shadowValues.size > 0 ||
    pendingChanges.semanticMappings.size > 0;

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Drawer container - positioned to the left of the DevTools panel */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Live Preview"
        className={`
          fixed top-0 left-0 h-full w-[400px] max-w-[50vw]
          bg-surface-primary border-r-2 border-edge-primary
          shadow-[4px_0_0_0_var(--color-black)]
          transform transition-transform duration-200 ease-out
          flex flex-col pointer-events-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Apply pending CSS variables */}
        {hasPendingChanges && (
          <style>
            {`.preview-container {
              ${generateCSSVariables()}
            }`}
          </style>
        )}

        {/* Header */}
        <div className="px-4 py-3 border-b border-edge-primary flex items-center justify-between bg-surface-secondary">
          <h3 className="font-joystix text-sm text-content-primary">Live Preview</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="close" size={16} />
          </Button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-4 preview-container">
          <div className="space-y-8">
            {/* Typography */}
            <section>
              <h4 className="text-xs font-joystix text-content-secondary mb-3 uppercase">Typography</h4>
              <div className="space-y-2 bg-surface-elevated p-4 rounded-sm border border-edge-primary">
                <h1 className="text-content-primary">Heading 1</h1>
                <h2 className="text-content-primary">Heading 2</h2>
                <h3 className="text-content-primary">Heading 3</h3>
                <p className="text-content-primary font-mondwest">
                  Body text paragraph with normal styling. This shows how content text appears.
                </p>
                <p className="text-content-secondary text-sm font-mondwest">
                  Secondary text in smaller size with reduced emphasis.
                </p>
              </div>
            </section>

            {/* Buttons */}
            <section>
              <h4 className="text-xs font-joystix text-content-secondary mb-3 uppercase">Buttons</h4>
              <div className="bg-surface-elevated p-4 rounded-sm border border-edge-primary space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="md">
                    Primary
                  </Button>
                  <Button variant="secondary" size="md">
                    Secondary
                  </Button>
                  <Button variant="outline" size="md">
                    Outline
                  </Button>
                  <Button variant="ghost" size="md">
                    Ghost
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="primary" size="lg">
                    Large
                  </Button>
                </div>
              </div>
            </section>

            {/* Surfaces */}
            <section>
              <h4 className="text-xs font-joystix text-content-secondary mb-3 uppercase">Surfaces</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-4 bg-surface-primary border border-edge-primary rounded-sm">
                  <p className="text-xs font-joystix text-content-primary">Primary</p>
                  <p className="text-xs font-mondwest text-content-secondary mt-1">bg-surface-primary</p>
                </div>
                <div className="p-4 bg-surface-secondary border border-edge-primary rounded-sm">
                  <p className="text-xs font-joystix text-content-primary">Secondary</p>
                  <p className="text-xs font-mondwest text-content-secondary mt-1">bg-surface-secondary</p>
                </div>
                <div className="p-4 bg-surface-tertiary border border-edge-primary rounded-sm">
                  <p className="text-xs font-joystix text-content-primary">Tertiary</p>
                  <p className="text-xs font-mondwest text-content-secondary mt-1">bg-surface-tertiary</p>
                </div>
                <div className="p-4 bg-surface-elevated border border-edge-primary rounded-sm">
                  <p className="text-xs font-joystix text-content-primary">Elevated</p>
                  <p className="text-xs font-mondwest text-content-secondary mt-1">bg-surface-elevated</p>
                </div>
              </div>
            </section>

            {/* Cards with Shadows */}
            <section>
              <h4 className="text-xs font-joystix text-content-secondary mb-3 uppercase">Cards & Shadows</h4>
              <div className="space-y-3">
                <div className="p-4 bg-surface-elevated border border-edge-primary rounded-sm shadow-btn">
                  <p className="text-sm font-joystix text-content-primary">Button Shadow</p>
                  <p className="text-xs font-mondwest text-content-secondary mt-1">shadow-btn</p>
                </div>
                <div className="p-4 bg-surface-elevated border border-edge-primary rounded-md shadow-card">
                  <p className="text-sm font-joystix text-content-primary">Card Shadow</p>
                  <p className="text-xs font-mondwest text-content-secondary mt-1">shadow-card</p>
                </div>
                <div className="p-4 bg-surface-elevated border border-edge-primary rounded-md shadow-card-lg">
                  <p className="text-sm font-joystix text-content-primary">Large Card Shadow</p>
                  <p className="text-xs font-mondwest text-content-secondary mt-1">shadow-card-lg</p>
                </div>
              </div>
            </section>

            {/* Border Radius */}
            <section>
              <h4 className="text-xs font-joystix text-content-secondary mb-3 uppercase">Border Radius</h4>
              <div className="bg-surface-elevated p-4 rounded-sm border border-edge-primary">
                <div className="flex gap-3 items-end">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-surface-tertiary border border-edge-primary rounded-none mx-auto" />
                    <p className="text-xs font-mondwest text-content-secondary mt-1">none</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-surface-tertiary border border-edge-primary rounded-xs mx-auto" />
                    <p className="text-xs font-mondwest text-content-secondary mt-1">xs</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-surface-tertiary border border-edge-primary rounded-sm mx-auto" />
                    <p className="text-xs font-mondwest text-content-secondary mt-1">sm</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-surface-tertiary border border-edge-primary rounded-md mx-auto" />
                    <p className="text-xs font-mondwest text-content-secondary mt-1">md</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-surface-tertiary border border-edge-primary rounded-lg mx-auto" />
                    <p className="text-xs font-mondwest text-content-secondary mt-1">lg</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-surface-tertiary border border-edge-primary rounded-full mx-auto" />
                    <p className="text-xs font-mondwest text-content-secondary mt-1">full</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Form Elements */}
            <section>
              <h4 className="text-xs font-joystix text-content-secondary mb-3 uppercase">Form Elements</h4>
              <div className="bg-surface-elevated p-4 rounded-sm border border-edge-primary space-y-3">
                <div>
                  <label className="text-xs font-joystix text-content-primary mb-1 block">Text Input</label>
                  <input
                    type="text"
                    placeholder="Enter text..."
                    className="w-full px-3 py-2 bg-surface-primary border border-edge-primary rounded-sm text-sm text-content-primary placeholder:text-content-tertiary font-mondwest focus:outline-none focus:ring-2 focus:ring-edge-focus"
                  />
                </div>
                <div>
                  <label className="text-xs font-joystix text-content-primary mb-1 block">Textarea</label>
                  <textarea
                    placeholder="Enter longer text..."
                    rows={3}
                    className="w-full px-3 py-2 bg-surface-primary border border-edge-primary rounded-sm text-sm text-content-primary placeholder:text-content-tertiary font-mondwest focus:outline-none focus:ring-2 focus:ring-edge-focus resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Status Colors */}
            <section>
              <h4 className="text-xs font-joystix text-content-secondary mb-3 uppercase">Status Colors</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-surface-success border border-edge-primary rounded-sm">
                  <p className="text-xs font-joystix text-content-success">Success</p>
                </div>
                <div className="p-3 bg-surface-warning border border-edge-primary rounded-sm">
                  <p className="text-xs font-joystix text-content-warning">Warning</p>
                </div>
                <div className="p-3 bg-surface-error border border-edge-primary rounded-sm">
                  <p className="text-xs font-joystix text-content-error">Error</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-edge-primary bg-surface-secondary">
          <p className="text-xs font-mondwest text-content-secondary">
            {hasPendingChanges
              ? 'Showing preview with pending changes'
              : 'Make changes to see live preview'}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
