'use client';

import { useState, useCallback } from 'react';
import { Icon } from '@radflow/ui/Icon';

interface UploadDropzoneProps {
  onUpload: (files: File[]) => void;
  isUploading: boolean;
}

export function UploadDropzone({ onUpload, isUploading }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
    e.target.value = '';
  }, [onUpload]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-md p-4 text-center transition-colors ${
        isDragging
          ? 'border-edge-focus bg-edge-focus/10'
          : 'border-edge-primary hover:border-edge-focus'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,video/*"
      />

      <label
        htmlFor="file-upload"
        className="cursor-pointer block"
      >
        <div className="mb-2 flex justify-center">
          <Icon name="upload" size={24} className="text-content-secondary" />
        </div>
        <p className="text-xs text-content-primary mb-1">
          {isUploading ? 'Uploading...' : 'Drop files here or click to upload'}
        </p>
        <p className="text-xs text-content-secondary">
          Images & videos only
        </p>
      </label>
    </div>
  );
}

