'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDevToolsStore } from '../../store';
import { Icon } from '@radflow/ui';
import { useToast } from '@radflow/ui/Toast';
import { detectFontPropertiesFromFilename } from '../../lib/cssParser';
import type { FontDefinition, FontFile } from '../../types';

interface UploadingFont {
  file: File;
  name: string;
  family: string;
  weight: number;
  style: string;
  format: FontFile['format'];
}

export function FontManager() {
  const { fonts, addFont, updateFont, deleteFont, addFontFile, removeFontFile, loadTypographyFromCSS, loadFontsFromFilesystem } = useDevToolsStore();
  const [uploadingFont, setUploadingFont] = useState<UploadingFont | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedFont, setExpandedFont] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const { addToast } = useToast();

  // Reload fonts from filesystem on mount (more accurate than CSS)
  useEffect(() => {
    loadFontsFromFilesystem();
  }, [loadFontsFromFilesystem]);

  // Handle reload fonts - only use filesystem (more accurate than CSS)
  const handleReload = useCallback(async () => {
    setIsReloading(true);
    try {
      // Load from filesystem only - CSS may not have all fonts
      await loadFontsFromFilesystem();
    } catch (error) {
      // Failed to reload fonts
    } finally {
      setIsReloading(false);
    }
  }, [loadFontsFromFilesystem]);

  // Handle file drop/selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['woff2', 'woff', 'ttf', 'otf'].includes(ext || '')) {
      addToast({
        title: 'Unsupported format',
        description: 'Please use woff2, woff, ttf, or otf',
        variant: 'warning',
      });
      return;
    }

    // Auto-detect properties from filename
    const { weight, style } = detectFontPropertiesFromFilename(file.name);
    
    // Extract font name from filename (e.g., "Mondwest-Bold.woff2" -> "Mondwest")
    const nameParts = file.name.replace(/\.[^.]+$/, '').split('-');
    const name = nameParts[0] || file.name.replace(/\.[^.]+$/, '');

    setUploadingFont({
      file,
      name,
      family: name,
      weight,
      style,
      format: ext as FontFile['format'],
    });
  }, [addToast]);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['woff2', 'woff', 'ttf', 'otf'].includes(ext || '')) {
      addToast({
        title: 'Unsupported format',
        description: 'Please use woff2, woff, ttf, or otf',
        variant: 'warning',
      });
      return;
    }

    const { weight, style } = detectFontPropertiesFromFilename(file.name);
    const nameParts = file.name.replace(/\.[^.]+$/, '').split('-');
    const name = nameParts[0] || file.name.replace(/\.[^.]+$/, '');

    setUploadingFont({
      file,
      name,
      family: name,
      weight,
      style,
      format: ext as FontFile['format'],
    });
  }, [addToast]);

  // Upload font to server
  const handleUpload = async () => {
    if (!uploadingFont) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadingFont.file);
      formData.append('name', uploadingFont.name);
      formData.append('family', uploadingFont.family);
      formData.append('weight', uploadingFont.weight.toString());
      formData.append('style', uploadingFont.style);
      formData.append('format', uploadingFont.format);

      const response = await fetch('/api/devtools/fonts/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload font');
      }

      const result = await response.json();
      
      // Check if we're adding to existing font family or creating new one
      const existingFont = fonts.find(f => f.family === uploadingFont.family);
      
      if (existingFont) {
        // Add file to existing font
        addFontFile(existingFont.id, {
          weight: uploadingFont.weight,
          style: uploadingFont.style,
          format: uploadingFont.format,
          path: result.path,
        });
      } else {
        // Create new font
        addFont({
          name: uploadingFont.name,
          family: uploadingFont.family,
          files: [{
            id: crypto.randomUUID(),
            weight: uploadingFont.weight,
            style: uploadingFont.style,
            format: uploadingFont.format,
            path: result.path,
          }],
          weights: [uploadingFont.weight],
          styles: [uploadingFont.style],
        });
      }

      setUploadingFont(null);

      // Reload fonts from filesystem to reflect the new upload
      await loadFontsFromFilesystem();
    } catch (error) {
      addToast({
        title: 'Upload failed',
        description: 'Failed to upload font. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Delete font
  const handleDeleteFont = (fontId: string) => {
    if (confirm('Are you sure you want to delete this font?')) {
      deleteFont(fontId);
    }
  };

  // Delete font file
  const handleDeleteFontFile = (fontId: string, fileId: string) => {
    removeFontFile(fontId, fileId);
  };

  // Get weight label
  const getWeightLabel = (weight: number) => {
    const labels: Record<number, string> = {
      100: 'Thin',
      200: 'Extra Light',
      300: 'Light',
      400: 'Regular',
      500: 'Medium',
      600: 'Semibold',
      700: 'Bold',
      800: 'Extra Bold',
      900: 'Black',
    };
    return labels[weight] || weight.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-joystix text-sm text-content-primary uppercase">Fonts</h3>
        <button
          onClick={handleReload}
          disabled={isReloading}
          className="flex items-center gap-1 px-2 py-1 text-xs font-mondwest text-content-primary/60 hover:text-content-primary border border-edge-primary/20 rounded-sm hover:bg-surface-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reload fonts from CSS"
        >
          <Icon name="refresh" size={12} />
          {isReloading ? 'Reloading...' : 'Reload'}
        </button>
      </div>

      {/* Font List */}
      <div className="space-y-2">
        {fonts.map((font) => (
          <div
            key={font.id}
            className="border border-edge-primary rounded-sm bg-surface-primary overflow-hidden"
          >
            {/* Font Header */}
            <div
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-surface-secondary/5"
              onClick={() => setExpandedFont(expandedFont === font.id ? null : font.id)}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="text-lg"
                  style={{ fontFamily: font.family }}
                >
                  Aa
                </span>
                <div>
                  <div className="font-mondwest text-base text-content-primary">
                    {font.name}
                  </div>
                  <div className="font-mondwest text-sm text-content-primary/60">
                    {font.weights.length} weight{font.weights.length !== 1 ? 's' : ''} • {font.styles.join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFont(font.id);
                  }}
                  className="text-content-primary/50 hover:text-content-error flex items-center"
                  title="Delete font"
                >
                  <Icon name="close" size={16} />
                </button>
                <Icon
                  name="chevron-down"
                  size={16}
                  className={`text-content-primary/40 transition-transform ${expandedFont === font.id ? '' : '-rotate-90'}`}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Font Files (expanded) */}
            {expandedFont === font.id && (
              <div className="border-t border-edge-primary/20 px-3 py-2 space-y-1 bg-surface-secondary/5">
                {font.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between py-1">
                    <div className="font-mondwest text-sm text-content-primary/70">
                      {getWeightLabel(file.weight)} {file.style !== 'normal' ? `(${file.style})` : ''} • {file.format}
                    </div>
                    <button
                      onClick={() => handleDeleteFontFile(font.id, file.id)}
                      className="text-content-primary/40 hover:text-content-error flex items-center"
                      title="Remove file"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                ))}
                <div className="text-xs text-content-primary/40 font-mono pt-1 border-t border-edge-primary/10">
                  {font.files[0]?.path}
                </div>
              </div>
            )}
          </div>
        ))}

        {fonts.length === 0 && (
          <div className="text-center py-4 text-content-primary/50 font-mondwest text-base">
            No fonts installed
          </div>
        )}
      </div>

      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-edge-primary/30 rounded-md p-4 text-center hover:border-edge-primary/50 transition-colors"
      >
        <input
          type="file"
          id="font-upload"
          accept=".woff2,.woff,.ttf,.otf"
          onChange={handleFileSelect}
          className="hidden"
        />
        <label
          htmlFor="font-upload"
          className="cursor-pointer block"
        >
          <div className="font-mondwest text-base text-content-primary/60">
            Drop font file here or click to upload
          </div>
          <div className="font-mondwest text-xs text-content-primary/40 mt-1">
            Supports woff2, woff, ttf, otf
          </div>
        </label>
      </div>

      {/* Upload Modal */}
      {uploadingFont && (
        <div className="fixed inset-0 bg-surface-secondary/50 flex items-center justify-center z-50">
          <div className="bg-surface-primary border-2 border-edge-primary rounded-md p-4 max-w-md w-full mx-4 shadow-[4px_4px_0_0_var(--color-black)]">
            <h4 className="font-joystix text-sm text-content-primary uppercase mb-4">
              Configure Font
            </h4>

            <div className="space-y-3">
              {/* Font Name */}
              <div>
                <label className="font-mondwest text-sm text-content-primary/60 block mb-1">
                  Font Name
                </label>
                <input
                  type="text"
                  value={uploadingFont.name}
                  onChange={(e) => setUploadingFont({ ...uploadingFont, name: e.target.value })}
                  className="w-full px-3 py-2 border border-edge-primary rounded-sm font-mondwest text-base bg-surface-elevated"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="font-mondwest text-sm text-content-primary/60 block mb-1">
                  CSS Font Family
                </label>
                <input
                  type="text"
                  value={uploadingFont.family}
                  onChange={(e) => setUploadingFont({ ...uploadingFont, family: e.target.value })}
                  className="w-full px-3 py-2 border border-edge-primary rounded-sm font-mondwest text-base bg-surface-elevated"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="font-mondwest text-sm text-content-primary/60 block mb-1">
                  Weight
                </label>
                <select
                  value={uploadingFont.weight}
                  onChange={(e) => setUploadingFont({ ...uploadingFont, weight: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 border border-edge-primary rounded-sm font-mondwest text-base bg-surface-elevated"
                >
                  <option value={100}>100 - Thin</option>
                  <option value={200}>200 - Extra Light</option>
                  <option value={300}>300 - Light</option>
                  <option value={400}>400 - Regular</option>
                  <option value={500}>500 - Medium</option>
                  <option value={600}>600 - Semibold</option>
                  <option value={700}>700 - Bold</option>
                  <option value={800}>800 - Extra Bold</option>
                  <option value={900}>900 - Black</option>
                </select>
              </div>

              {/* Style */}
              <div>
                <label className="font-mondwest text-sm text-content-primary/60 block mb-1">
                  Style
                </label>
                <select
                  value={uploadingFont.style}
                  onChange={(e) => setUploadingFont({ ...uploadingFont, style: e.target.value })}
                  className="w-full px-3 py-2 border border-edge-primary rounded-sm font-mondwest text-base bg-surface-elevated"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              {/* File Info */}
              <div className="text-xs text-content-primary/40 font-mono">
                File: {uploadingFont.file.name}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setUploadingFont(null)}
                className="px-4 py-2 font-mondwest text-base text-content-primary border border-edge-primary rounded-sm hover:bg-surface-secondary/5"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-2 font-mondwest text-base text-content-primary bg-surface-tertiary border border-edge-primary rounded-sm hover:bg-surface-tertiary/80 disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FontManager;

