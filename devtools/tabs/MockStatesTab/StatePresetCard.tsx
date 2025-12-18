'use client';

import type { MockState } from '../../types';

interface StatePresetCardProps {
  state: MockState;
  onToggle: () => void;
  onDelete: () => void;
}

export function StatePresetCard({ state, onToggle, onDelete }: StatePresetCardProps) {
  return (
    <div
      className={`p-3 rounded-lg border transition-colors ${
        state.active
          ? 'bg-panel-active border-border-strong'
          : 'bg-panel-hover border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-heading">{state.name}</h4>
          <p className="text-xs text-caption">{state.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              state.active
                ? 'bg-success text-heading'
                : 'bg-secondary text-alternate hover:bg-secondary/90'
            }`}
          >
            {state.active ? 'Active' : 'Activate'}
          </button>
          {!state.id.startsWith('auth-') && 
           !state.id.startsWith('wallet-') && 
           !state.id.startsWith('subscription-') && (
            <button
              onClick={onDelete}
              className="px-2 py-1 text-xs text-error hover:bg-error/10 rounded-md"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Values Preview */}
      <div className="mt-2 p-2 bg-panel rounded text-xs font-mono overflow-x-auto">
        <pre className="text-caption whitespace-pre-wrap">
          {JSON.stringify(state.values, null, 2)}
        </pre>
      </div>

      {/* Category Badge */}
      <div className="mt-2">
        <span className="inline-block px-2 py-0.5 text-xs bg-secondary text-alternate rounded">
          {state.category}
        </span>
      </div>
    </div>
  );
}

