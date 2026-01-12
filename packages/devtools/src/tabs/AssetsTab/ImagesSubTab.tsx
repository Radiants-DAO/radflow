'use client';

import { useState, useEffect } from 'react';
import { useDevToolsStore } from '../../store';
import { UploadDropzone } from './UploadDropzone';
import { Icon } from '@radflow/ui/Icon';
import { Button } from '@radflow/ui/Button';

interface ImageFile {
  name: string;
  path: string;
  size: number;
  dimensions?: { width: number; height: number };
  format: string;
}

interface ImagesSubTabProps {
  searchQuery: string;
}

export function ImagesSubTab({ searchQuery }: ImagesSubTabProps) {
  const { uploadAsset, deleteAsset, optimizeAssets } = useDevToolsStore();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load images on mount
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('/api/devtools/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        await uploadAsset(file, 'images');
      }
      await loadImages();
      setMessage({ type: 'success', text: `Uploaded ${files.length} image(s)` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (imagePath: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteAsset(imagePath);
      await loadImages();
      setSelectedImages((prev) => prev.filter((p) => p !== imagePath));
      setMessage({ type: 'success', text: 'Image deleted' });
    } catch {
      setMessage({ type: 'error', text: 'Delete failed' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleOptimize = async () => {
    if (selectedImages.length === 0) return;
    setIsOptimizing(true);
    try {
      await optimizeAssets(selectedImages);
      await loadImages();
      setSelectedImages([]);
      setMessage({ type: 'success', text: 'Optimization complete!' });
    } catch {
      setMessage({ type: 'error', text: 'Optimization failed' });
    } finally {
      setIsOptimizing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSelectImage = (imagePath: string, multi: boolean) => {
    setSelectedImages((prev) => {
      if (multi) {
        return prev.includes(imagePath)
          ? prev.filter((p) => p !== imagePath)
          : [...prev, imagePath];
      }
      return prev.includes(imagePath) && prev.length === 1 ? [] : [imagePath];
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filter images by search query
  const filteredImages = searchQuery
    ? images.filter((img) => img.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : images;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-content-secondary">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-joystix text-content-primary uppercase">
          Images ({filteredImages.length})
        </h3>
        {selectedImages.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              iconName="lightning"
              onClick={handleOptimize}
              disabled={isOptimizing}
            >
              {isOptimizing ? 'Optimizing...' : `Optimize (${selectedImages.length})`}
            </Button>
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-3 py-2 font-mondwest text-sm rounded-sm ${
            message.type === 'success'
              ? 'bg-success text-content-primary'
              : 'bg-error text-content-inverted'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Upload Dropzone */}
      <UploadDropzone onUpload={handleUpload} isUploading={isUploading} />

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <p className="text-content-tertiary text-center py-8">
          {searchQuery ? `No images found matching "${searchQuery}"` : 'No images uploaded yet'}
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.path}
              className={`relative group border rounded-md overflow-hidden hover:border-edge-focus transition-all cursor-pointer ${
                selectedImages.includes(image.path)
                  ? 'border-edge-focus ring-2 ring-edge-focus/30'
                  : 'border-edge-primary/20'
              }`}
              onClick={(e) => handleSelectImage(image.path, e.metaKey || e.ctrlKey)}
            >
              {/* Image preview */}
              <div className="aspect-square bg-surface-elevated flex items-center justify-center overflow-hidden">
                <img
                  src={image.path}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image info */}
              <div className="px-3 py-2 bg-surface-tertiary border-t border-edge-primary/20">
                <p className="text-xs text-content-primary font-mondwest truncate" title={image.name}>
                  {image.name}
                </p>
                <div className="flex items-center justify-between text-xs text-content-tertiary mt-1">
                  <span className="uppercase">{image.format}</span>
                  <span>{formatFileSize(image.size)}</span>
                </div>
                {image.dimensions && (
                  <p className="text-xs text-content-tertiary mt-1">
                    {image.dimensions.width} × {image.dimensions.height}
                  </p>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(image.path);
                }}
                className="absolute top-2 right-2 p-2 bg-surface-primary border border-edge-primary rounded-sm shadow-btn opacity-0 group-hover:opacity-100 hover:bg-error hover:text-content-inverted hover:-translate-y-0.5 hover:shadow-btn-hover active:translate-y-0.5 active:shadow-none transition-all duration-200"
                title="Delete"
              >
                <Icon name="trash" size={16} />
              </button>

              {/* Selection indicator */}
              {selectedImages.includes(image.path) && (
                <div className="absolute top-2 left-2 p-1 bg-surface-tertiary border border-edge-primary rounded-sm">
                  <Icon name="checkmark" size={16} className="text-content-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
