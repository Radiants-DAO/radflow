'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@radflow/ui';

interface AddTabButtonProps {
  onAdd: (folderName: string) => void;
}

export function AddTabButton({ onAdd }: AddTabButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [folderName, setFolderName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && folderName.trim()) {
      onAdd(folderName.trim());
      setFolderName('');
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setFolderName('');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Only close if empty, otherwise keep editing
          if (!folderName.trim()) {
            setIsEditing(false);
          }
        }}
        placeholder="Folder name..."
        className="flex items-center justify-center px-4 py-2 font-joystix text-xs uppercase cursor-text select-none text-content-primary transition-all duration-200 ease-out relative border border-edge-primary rounded-sm bg-surface-primary focus:outline-none focus:ring-2 focus:ring-sun-yellow"
        style={{ minWidth: '120px' }}
      />
    );
  }

  return (
    <Button
      variant="primary"
      size="md"
      iconOnly={true}
      iconName="plus"
      onClick={() => setIsEditing(true)}
    />
  );
}

