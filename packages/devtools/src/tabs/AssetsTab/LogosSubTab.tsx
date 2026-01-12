'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@radflow/ui/Icon';
import { Button } from '@radflow/ui/Button';

interface LogoData {
  name: string;
  path: string;
  variant: 'wordmark' | 'mark' | 'radsun';
  color: 'cream' | 'black' | 'yellow';
}

interface LogosSubTabProps {
  searchQuery: string;
}

type BackgroundMode = 'light' | 'dark';

export function LogosSubTab({ searchQuery }: LogosSubTabProps) {
  const [logos, setLogos] = useState<LogoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('light');
  const [copiedLogo, setCopiedLogo] = useState<string | null>(null);

  // Load logos on mount
  useEffect(() => {
    const loadLogos = async () => {
      try {
        const response = await fetch('/api/devtools/logos');
        if (!response.ok) throw new Error('Failed to fetch logos');
        const data = await response.json();
        setLogos(data.logos || []);
      } catch (error) {
        console.error('Failed to load logos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogos();
  }, []);

  const handleCopySVG = async (logoPath: string, logoName: string) => {
    try {
      const response = await fetch(logoPath);
      const svgContent = await response.text();
      await navigator.clipboard.writeText(svgContent);
      setCopiedLogo(logoName);
      setTimeout(() => setCopiedLogo(null), 2000);
    } catch (error) {
      console.error('Failed to copy SVG:', error);
    }
  };

  const handleDownload = async (logoPath: string, logoName: string, format: 'svg' | 'png') => {
    if (format === 'svg') {
      // Download SVG directly
      const a = document.createElement('a');
      a.href = logoPath;
      a.download = `${logoName}.svg`;
      a.click();
    } else {
      // For PNG, we'd need server-side conversion (future feature)
      alert('PNG export coming soon!');
    }
  };

  // Filter logos by search query
  const filteredLogos = searchQuery
    ? logos.filter((logo) => logo.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : logos;

  // Group logos by variant
  const groupedLogos = filteredLogos.reduce((acc, logo) => {
    if (!acc[logo.variant]) acc[logo.variant] = [];
    acc[logo.variant].push(logo);
    return acc;
  }, {} as Record<string, LogoData[]>);

  const variantLabels = {
    wordmark: 'Wordmark',
    mark: 'Rad Mark',
    radsun: 'RadSun',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-content-secondary">Loading logos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Background toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-content-secondary font-mondwest">Background:</span>
        <div className="flex gap-2">
          <Button
            variant={backgroundMode === 'light' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setBackgroundMode('light')}
          >
            Light
          </Button>
          <Button
            variant={backgroundMode === 'dark' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setBackgroundMode('dark')}
          >
            Dark
          </Button>
        </div>
      </div>

      {/* Logo variants */}
      {Object.entries(groupedLogos).map(([variant, variantLogos]) => (
        <div key={variant} className="space-y-3">
          <h3 className="text-sm font-joystix text-content-primary uppercase">
            {variantLabels[variant as keyof typeof variantLabels]}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {variantLogos.map((logo) => (
              <div
                key={logo.name}
                className="relative group border border-edge-primary/20 rounded-md overflow-hidden hover:border-interactive-primary transition-all"
              >
                {/* Logo preview */}
                <div
                  className={`flex items-center justify-center p-8 ${
                    backgroundMode === 'light' ? 'bg-cream' : 'bg-rad-black'
                  }`}
                  style={{ minHeight: '150px' }}
                >
                  <img
                    src={logo.path}
                    alt={logo.name}
                    className="max-w-full max-h-24 object-contain"
                  />
                </div>

                {/* Logo info */}
                <div className="px-3 py-2 bg-surface-secondary border-t border-edge-primary/20">
                  <p className="text-xs text-content-primary font-mondwest truncate" title={logo.name}>
                    {logo.name}
                  </p>
                  <p className="text-xs text-content-tertiary capitalize">{logo.color}</p>
                </div>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopySVG(logo.path, logo.name)}
                    className="p-2 bg-surface-primary/90 border border-edge-primary rounded hover:bg-interactive-primary transition-all"
                    title="Copy SVG"
                  >
                    {copiedLogo === logo.name ? (
                      <Icon name="checkmark" size={16} className="text-success-green" />
                    ) : (
                      <Icon name="copy" size={16} className="text-content-primary" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(logo.path, logo.name, 'svg')}
                    className="p-2 bg-surface-primary/90 border border-edge-primary rounded hover:bg-interactive-primary transition-all"
                    title="Download SVG"
                  >
                    <Icon name="download" size={16} className="text-content-primary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredLogos.length === 0 && (
        <p className="text-content-tertiary text-center py-8">
          No logos found matching "{searchQuery}"
        </p>
      )}
    </div>
  );
}
