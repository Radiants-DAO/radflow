'use client';

import { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { BrandColorEditor } from './BrandColorEditor';
import { SemanticTokenEditor } from './SemanticTokenEditor';
import { ColorModeSelector } from './ColorModeSelector';
import { BorderRadiusEditor } from './BorderRadiusEditor';

export function VariablesTab() {
  const { loadFromCSS, syncToCSS, brandColors } = useDevToolsStore();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load CSS on mount if no colors loaded
  useEffect(() => {
    if (brandColors.length === 0) {
      loadFromCSS();
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await syncToCSS();
      setMessage({ type: 'success', text: 'Saved to globals.css!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save. Check console.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReload = async () => {
    await loadFromCSS();
    setMessage({ type: 'success', text: 'Reloaded from CSS!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-heading">Design Tokens</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            className="px-3 py-1.5 text-xs font-medium bg-panel-hover text-body rounded-md hover:bg-panel-active border border-border"
          >
            ↻ Reload
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-alternate rounded-md hover:bg-secondary/90 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : '💾 Save to CSS'}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`px-3 py-2 text-xs rounded-md ${
            message.type === 'success'
              ? 'bg-success text-heading'
              : 'bg-error text-alternate'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Editors */}
      <div className="space-y-6">
        <ColorModeSelector />
        <hr className="border-border" />
        <BrandColorEditor />
        <hr className="border-border" />
        <SemanticTokenEditor />
        <hr className="border-border" />
        <BorderRadiusEditor />
      </div>
    </div>
  );
}

