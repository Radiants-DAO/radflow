'use client';

import { useState, useMemo } from 'react';
import { SrefCode } from '../../store/slices/aiSlice';
import { Button } from '@radflow/ui';
import { ThemeIcon as Icon } from '../../components/ThemeIcon';

interface StylesSubTabProps {
  codes: SrefCode[];
  searchQuery: string;
}

export function StylesSubTab({ codes, searchQuery }: StylesSubTabProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [expandedCodeId, setExpandedCodeId] = useState<string | null>(null);

  // Filter SREF codes
  const filteredCodes = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return codes.filter(
      (code) =>
        code.code.includes(query) ||
        code.description?.toLowerCase().includes(query) ||
        code.id.toLowerCase().includes(query)
    );
  }, [codes, searchQuery]);

  const handleCopyCode = async (code: SrefCode) => {
    try {
      await navigator.clipboard.writeText(`--sref ${code.code}`);
      setCopiedCodeId(code.id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (error) {
      console.error('Failed to copy SREF code:', error);
    }
  };

  const toggleExpand = (codeId: string) => {
    setExpandedCodeId(expandedCodeId === codeId ? null : codeId);
  };

  if (filteredCodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-content-primary">
        <div className="text-center">
          <Icon name="search" size={48} className="mx-auto mb-4 opacity-50" />
          <p>No SREF codes found matching &quot;{searchQuery}&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCodes.map((srefCode) => {
          const isCopied = copiedCodeId === srefCode.id;
          const isExpanded = expandedCodeId === srefCode.id;

          return (
            <div
              key={srefCode.id}
              className="bg-surface-elevated border border-edge-primary/20 rounded-md overflow-hidden hover:border-edge-focus transition-colors"
            >
              {/* Preview Grid - 2x2 thumbnails */}
              <div className="grid grid-cols-2 gap-1 bg-surface-primary">
                {srefCode.previewImages.slice(0, 4).map((imageSrc, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-surface-tertiary/30 flex items-center justify-center cursor-pointer hover:bg-surface-tertiary/50 transition-colors"
                    onClick={() => toggleExpand(srefCode.id)}
                  >
                    {/* Placeholder for image - replace with actual image once assets are available */}
                    <Icon name="image" size={32} className="text-content-primary opacity-30" />
                  </div>
                ))}
              </div>

              {/* Code Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <code className="text-sm font-mono text-content-primary bg-surface-tertiary/50 px-2 py-1 rounded-xs">
                      --sref {srefCode.code}
                    </code>
                    {srefCode.description && (
                      <p className="text-sm text-content-primary mt-2">{srefCode.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      iconName={isCopied ? 'checkmark-circle' : 'copy'}
                      onClick={() => handleCopyCode(srefCode)}
                      title={isCopied ? 'Copied!' : 'Copy SREF code'}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      iconName={isExpanded ? 'minimize' : 'maximize'}
                      onClick={() => toggleExpand(srefCode.id)}
                      title={isExpanded ? 'Collapse' : 'Expand preview'}
                    />
                  </div>
                </div>

                {/* Expanded Preview */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-edge-primary/20">
                    <div className="grid grid-cols-2 gap-2">
                      {srefCode.previewImages.map((imageSrc, idx) => (
                        <div
                          key={idx}
                          className="aspect-square bg-surface-tertiary/30 rounded-sm flex items-center justify-center"
                        >
                          {/* Placeholder for full-size preview */}
                          <Icon name="image" size={64} className="text-content-primary opacity-30" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-content-primary">
                      Click images to view full size (feature coming soon)
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-surface-tertiary/20 border border-edge-primary/20 rounded-md">
        <h3 className="text-sm font-semibold text-content-primary mb-2">
          How to use SREF codes with Midjourney
        </h3>
        <ol className="text-sm text-content-primary space-y-1 list-decimal list-inside">
          <li>Copy an SREF code by clicking the copy button</li>
          <li>
            In Midjourney, add the code to your prompt:{' '}
            <code className="font-mono bg-surface-tertiary/50 px-1 rounded-xs">
              /imagine your prompt here --sref [code]
            </code>
          </li>
          <li>Midjourney will generate images matching the style reference</li>
          <li>Experiment with different codes to find your perfect aesthetic</li>
        </ol>
      </div>
    </div>
  );
}
