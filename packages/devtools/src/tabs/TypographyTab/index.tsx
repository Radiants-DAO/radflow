'use client';

import React, { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { FontManager } from './FontManager';
import { TypographyStylesDisplay } from './TypographyStylesDisplay';
import { Button } from '@radflow/ui/Button';
import { Divider } from '@radflow/ui/Divider';

interface TypographyTabProps {
  searchQuery?: string;
}

export function TypographyTab({ searchQuery = '' }: TypographyTabProps) {
  const { loadTypographyFromCSS, loadFontsFromFilesystem } = useDevToolsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load typography on mount
  useEffect(() => {
    loadTypographyFromCSS();
  }, [loadTypographyFromCSS]);

  // Handle reload
  const handleReload = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      // Load fonts from filesystem (more accurate)
      await loadFontsFromFilesystem();
      // Load typography styles from CSS
      await loadTypographyFromCSS();
      setMessage({ type: 'success', text: 'Typography reloaded!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reload typography.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-edge-primary rounded space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2>
          Typography
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            iconName="refresh"
            onClick={handleReload}
            disabled={isLoading}
          >
            {isLoading ? 'Reloading...' : 'Reload'}
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`px-4 py-2 text-sm font-mondwest ${
            message.type === 'success'
              ? 'bg-success-green/30 text-content-primary'
              : 'bg-error-red/30 text-content-primary'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Font Manager Section */}
        <FontManager />

        {/* Fluid Typography Info */}
        <div className="border border-edge-primary rounded-sm bg-surface-elevated p-4 space-y-3">
          <h3>Proportional Fluid Scaling</h3>
          <p className="font-mondwest text-sm text-content-primary/70">
            Everything scales proportionally using a single <code className="bg-surface-tertiary text-content-primary px-1 py-0.5 rounded" style={{ fontFamily: 'PixelCode' }}>clamp()</code> on the root HTML element. All rem-based measurements scale together, maintaining design ratios.
          </p>
          <div className="space-y-3 font-mondwest text-xs">
            <div>
              <div className="font-mono text-content-primary/60 mb-1">Root Scale (html):</div>
              <code className="bg-surface-tertiary text-content-primary p-2 rounded block" style={{ fontFamily: 'PixelCode' }}>font-size: clamp(16px, 0.95rem + 0.25vw, 18px)</code>
              <div className="text-content-primary/50 mt-1">Scales from 16px (mobile) to 18px (large screens)</div>
            </div>
            <div>
              <div className="font-mono text-content-primary/60 mb-1">Typography Scale (rem units):</div>
              <div className="grid grid-cols-[7rem_1fr] gap-1">
                <span className="font-mono text-content-primary/60">--font-size-xs:</span><span className="font-mono">0.75rem</span>
                <span className="font-mono text-content-primary/60">--font-size-sm:</span><span className="font-mono">0.875rem</span>
                <span className="font-mono text-content-primary/60">--font-size-base:</span><span className="font-mono">1rem</span>
                <span className="font-mono text-content-primary/60">--font-size-lg:</span><span className="font-mono">1.125rem</span>
                <span className="font-mono text-content-primary/60">--font-size-xl:</span><span className="font-mono">1.25rem</span>
                <span className="font-mono text-content-primary/60">--font-size-2xl:</span><span className="font-mono">1.5rem</span>
                <span className="font-mono text-content-primary/60">--font-size-3xl:</span><span className="font-mono">2rem</span>
                <span className="font-mono text-content-primary/60">--font-size-4xl:</span><span className="font-mono">2.5rem</span>
                <span className="font-mono text-content-primary/60">--font-size-5xl:</span><span className="font-mono">3.75rem</span>
                <span className="font-mono text-content-primary/60">--font-size-hero:</span><span className="font-mono">4rem</span>
              </div>
              <div className="text-content-primary/50 mt-2">
                Use rem units for spacing, padding, margins — they scale proportionally with the root.
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Typography Styles Section */}
        <TypographyStylesDisplay />
      </div>
    </div>
  );
}

export default TypographyTab;

