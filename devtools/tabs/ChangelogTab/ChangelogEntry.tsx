'use client';

import type { ChangelogEntry as ChangelogEntryType } from '../../types';

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
  onEdit: () => void;
  onDelete: () => void;
}

const TYPE_COLORS = {
  feature: 'bg-success text-heading',
  fix: 'bg-error text-alternate',
  refactor: 'bg-tertiary text-heading',
  style: 'bg-link text-alternate',
  chore: 'bg-muted text-heading',
};

export function ChangelogEntry({ entry, onEdit, onDelete }: ChangelogEntryProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-3 bg-panel-hover rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${TYPE_COLORS[entry.type]}`}>
            {entry.type}
          </span>
          <span className="text-xs text-caption">{formatDate(entry.timestamp)}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="text-xs text-link hover:underline"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-error hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-body mb-2">{entry.description}</p>

      {/* Details */}
      {entry.details && (
        <p className="text-xs text-caption mb-2">{entry.details}</p>
      )}

      {/* Files */}
      {entry.files.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {entry.files.map((file) => (
            <span
              key={file}
              className="px-2 py-0.5 text-xs font-mono bg-panel rounded border border-border text-caption"
            >
              {file}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      <p className="text-xs text-caption">
        by <span className="font-medium">{entry.author}</span>
      </p>
    </div>
  );
}

