'use client';

import { useState, useRef, useEffect } from 'react';
import { useDevToolsStore } from '../../store';
import { useToast } from '@radflow/ui';

// Inline editable value component
function InlineEdit({
  value,
  pendingValue,
  onSave,
  className,
}: {
  value: string;
  pendingValue?: string;
  onSave: (newValue: string) => void;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(pendingValue ?? value);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = pendingValue ?? value;
  const hasChange = pendingValue !== undefined && pendingValue !== value;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(pendingValue ?? value);
  }, [pendingValue, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editValue !== value) {
        onSave(editValue);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditValue(pendingValue ?? value);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`px-1 py-0.5 bg-surface-primary border border-edge-focus rounded-xs text-xs font-mono outline-none ${className}`}
        style={{ width: '100%', maxWidth: '200px' }}
      />
    );
  }

  return (
    <code
      onClick={(e) => {
        e.stopPropagation();
        setEditValue(displayValue);
        setIsEditing(true);
      }}
      className={`
        cursor-text hover:bg-surface-tertiary/50 px-1 rounded-xs transition-colors truncate
        ${hasChange ? 'text-content-primary ring-1 ring-edge-focus' : ''}
        ${className}
      `}
      style={{ backgroundColor: 'unset', background: 'unset', backgroundImage: 'none', marginTop: '0px' }}
      title="Click to edit"
    >
      {displayValue}
    </code>
  );
}

interface ShadowDisplayProps {
  pendingValues: Map<string, string>;
  onValueChange: (name: string, value: string | null) => void;
}

export function ShadowDisplay({ pendingValues, onValueChange }: ShadowDisplayProps) {
  const { shadows } = useDevToolsStore();
  const { addToast } = useToast();

  const copyToClipboard = (text: string, description?: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast({ title: 'Copied', description: description || text, variant: 'success' });
      })
      .catch(() => {
        addToast({ title: 'Failed to copy', description: 'Unable to copy to clipboard', variant: 'error' });
      });
  };

  if (shadows.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="font-joystix">Shadows</h4>
        <p className="text-sm text-content-primary/60 font-mondwest">No shadows found in globals.css</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-joystix">Shadows</h4>
      <div className="space-y-1">
        {shadows.map((shadow) => {
          const displayValue = pendingValues.get(shadow.name) ?? shadow.value;
          const hasChange = pendingValues.has(shadow.name);

          return (
            <div
              key={shadow.id}
              className="flex items-center gap-3 p-2 rounded-sm hover:bg-warm-cloud cursor-pointer"
              onClick={() => copyToClipboard(`shadow-${shadow.name}`, `Copied: shadow-${shadow.name}`)}
              title="Click to copy class"
            >
              <div
                className={`w-6 h-6 rounded-xs border flex-shrink-0 bg-surface-primary ${hasChange ? 'border-edge-focus border-2' : 'border-edge-primary'}`}
                style={{ boxShadow: displayValue }}
              />
              <span className="flex-1 min-w-0 font-mondwest text-base text-content-primary truncate">
                {shadow.displayName}
              </span>
              <InlineEdit
                value={shadow.value}
                pendingValue={pendingValues.get(shadow.name)}
                onSave={(newValue) => {
                  if (newValue === shadow.value) {
                    onValueChange(shadow.name, null);
                  } else {
                    onValueChange(shadow.name, newValue);
                  }
                }}
                className="flex-shrink-0 max-w-[150px]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
