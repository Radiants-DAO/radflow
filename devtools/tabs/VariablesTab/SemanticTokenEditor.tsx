'use client';

import { useState } from 'react';
import { useDevToolsStore } from '../../store';
import { TokenDropdown } from '../../components/TokenDropdown';

const CATEGORIES = ['background', 'text', 'border', 'system'] as const;

export function SemanticTokenEditor() {
  const { semanticTokens, addSemanticToken, updateSemanticToken, deleteSemanticToken, brandColors } = useDevToolsStore();
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenRef, setNewTokenRef] = useState('');
  const [newTokenCategory, setNewTokenCategory] = useState<typeof CATEGORIES[number]>('background');

  const handleAdd = () => {
    if (!newTokenName.trim() || !newTokenRef) return;
    addSemanticToken({
      name: newTokenName.trim().toLowerCase().replace(/\s+/g, '-'),
      reference: newTokenRef,
      category: newTokenCategory,
    });
    setNewTokenName('');
    setNewTokenRef('');
  };

  // Group tokens by category
  const tokensByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = semanticTokens.filter((t) => t.category === cat);
    return acc;
  }, {} as Record<typeof CATEGORIES[number], typeof semanticTokens>);

  // Resolve a reference to its actual color value
  const resolveColor = (ref: string): string => {
    if (ref.startsWith('#')) return ref;
    const colorName = ref.replace('--brand-', '').replace('--neutral-', '');
    const color = brandColors.find((c) => c.name === colorName);
    return color?.value || '#888888';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-heading">Semantic Tokens</h3>
      
      {CATEGORIES.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-medium text-caption uppercase tracking-wide">{category}</h4>
          {tokensByCategory[category].map((token) => (
            <div key={token.id} className="flex items-center gap-2 p-2 bg-panel-hover rounded-md">
              <div
                className="w-6 h-6 rounded-md border border-border"
                style={{ backgroundColor: resolveColor(token.reference) }}
              />
              <span className="text-xs font-mono text-body flex-1">{token.name}</span>
              <select
                value={token.reference}
                onChange={(e) => updateSemanticToken(token.id, { reference: e.target.value })}
                className="w-32 px-2 py-1 text-xs bg-panel border border-border rounded-md text-body"
              >
                <optgroup label="Brand">
                  {brandColors.filter(c => c.category === 'brand').map((c) => (
                    <option key={c.id} value={`--brand-${c.name}`}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Neutral">
                  {brandColors.filter(c => c.category === 'neutral').map((c) => (
                    <option key={c.id} value={`--neutral-${c.name}`}>{c.name}</option>
                  ))}
                </optgroup>
              </select>
              <button
                onClick={() => deleteSemanticToken(token.id)}
                className="text-xs text-error hover:text-error/80 px-1"
              >
                ✕
              </button>
            </div>
          ))}
          {tokensByCategory[category].length === 0 && (
            <p className="text-xs text-caption italic">No tokens in this category</p>
          )}
        </div>
      ))}

      {/* Add New Token */}
      <div className="p-3 bg-panel-hover rounded-lg space-y-2">
        <h4 className="text-xs font-medium text-caption">Add New Token</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTokenName}
            onChange={(e) => setNewTokenName(e.target.value)}
            placeholder="Token name"
            className="flex-1 px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
          />
          <select
            value={newTokenCategory}
            onChange={(e) => setNewTokenCategory(e.target.value as typeof CATEGORIES[number])}
            className="px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <TokenDropdown value={newTokenRef} onChange={setNewTokenRef} />
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-alternate rounded-md hover:bg-secondary/90"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

