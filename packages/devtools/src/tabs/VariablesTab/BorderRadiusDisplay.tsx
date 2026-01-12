'use client';

import { useState, useRef, useEffect } from 'react';
import { useDevToolsStore } from '../../store';
import { useToast } from '@radflow/ui/Toast';

const RADIUS_KEYS = ['none', 'xs', 'sm', 'md', 'lg', 'full'] as const;

const RADIUS_DISPLAY_NAMES: Record<string, string> = {
  none: 'None',
  xs: 'Extra Small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  full: 'Full',
};

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
        style={{ width: `${Math.max(editValue.length, 4) + 2}ch` }}
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
        cursor-text hover:bg-surface-tertiary/50 px-1 rounded-xs transition-colors
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

interface BorderRadiusDisplayProps {
  pendingValues: Map<string, string>;
  onValueChange: (key: string, value: string | null) => void;
}

export function BorderRadiusDisplay({ pendingValues, onValueChange }: BorderRadiusDisplayProps) {
  const { borderRadius } = useDevToolsStore();
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

  const getDisplayValue = (key: string): string => {
    return pendingValues.get(key) ?? borderRadius[key] ?? '0';
  };

  return (
    <div className="space-y-3">
      <h4 className="font-joystix">Border Radius</h4>

      <div className="space-y-1">
        {RADIUS_KEYS.map((key) => {
          const originalValue = borderRadius[key] || '0';
          const displayValue = getDisplayValue(key);
          const hasChange = pendingValues.has(key);

          return (
            <div
              key={key}
              className="flex items-center gap-3 p-2 rounded-sm hover:bg-warm-cloud cursor-pointer"
              onClick={() => copyToClipboard(`rounded-${key}`, `Copied: rounded-${key}`)}
              title="Click to copy class"
            >
              <div
                className={`w-6 h-6 bg-surface-tertiary border flex-shrink-0 ${hasChange ? 'border-edge-focus border-2' : 'border-edge-primary'}`}
                style={{ borderRadius: displayValue }}
              />
              <span className="flex-1 min-w-0 font-mondwest text-base text-content-primary truncate">
                {RADIUS_DISPLAY_NAMES[key] || key}
              </span>
              <InlineEdit
                value={originalValue}
                pendingValue={pendingValues.get(key)}
                onSave={(newValue) => {
                  if (newValue === originalValue) {
                    onValueChange(key, null);
                  } else {
                    onValueChange(key, newValue);
                  }
                }}
                className="flex-shrink-0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
