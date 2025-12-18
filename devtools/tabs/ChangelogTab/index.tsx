'use client';

import { useState } from 'react';
import { useDevToolsStore } from '../../store';
import { ChangelogEntry } from './ChangelogEntry';
import type { ChangelogEntry as ChangelogEntryType } from '../../types';

const ENTRY_TYPES: ChangelogEntryType['type'][] = ['feature', 'fix', 'refactor', 'style', 'chore'];

export function ChangelogTab() {
  const { changelogEntries, addChangelogEntry, updateChangelogEntry, deleteChangelogEntry, clearChangelog } = useDevToolsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'feature' as ChangelogEntryType['type'],
    description: '',
    details: '',
    files: '',
    author: 'Cursor',
  });

  const handleSubmit = () => {
    if (!formData.description.trim()) return;

    const files = formData.files
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingId) {
      updateChangelogEntry(editingId, {
        type: formData.type,
        description: formData.description,
        details: formData.details || undefined,
        files,
        author: formData.author,
      });
      setEditingId(null);
    } else {
      addChangelogEntry({
        type: formData.type,
        description: formData.description,
        details: formData.details || undefined,
        files,
        author: formData.author,
      });
    }

    setFormData({
      type: 'feature',
      description: '',
      details: '',
      files: '',
      author: 'Cursor',
    });
    setShowAddForm(false);
  };

  const handleEdit = (entry: ChangelogEntryType) => {
    setFormData({
      type: entry.type,
      description: entry.description,
      details: entry.details || '',
      files: entry.files.join(', '),
      author: entry.author,
    });
    setEditingId(entry.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this changelog entry?')) {
      deleteChangelogEntry(id);
    }
  };

  const handleClear = () => {
    if (confirm('Clear all changelog entries? This cannot be undone.')) {
      clearChangelog();
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-heading">Changelog</h2>
        <div className="flex gap-2">
          {changelogEntries.length > 0 && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-medium text-error hover:bg-error/10 rounded-md border border-border"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingId(null);
              setFormData({
                type: 'feature',
                description: '',
                details: '',
                files: '',
                author: 'Cursor',
              });
            }}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-alternate rounded-md hover:bg-secondary/90"
          >
            {showAddForm ? '✕ Cancel' : '+ Add Entry'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-caption">
        <span>{changelogEntries.length} entries</span>
        {changelogEntries.length > 0 && (
          <span>
            Latest: {new Date(changelogEntries[0].timestamp).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="p-3 bg-panel-hover rounded-lg space-y-3">
          <h3 className="text-xs font-medium text-heading">
            {editingId ? 'Edit Entry' : 'Add Changelog Entry'}
          </h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ChangelogEntryType['type'] })}
                className="px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
              >
                {ENTRY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author"
                className="flex-1 px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
              />
            </div>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description (required)"
              className="w-full px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
            />
            <textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Additional details (optional)"
              rows={2}
              className="w-full px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
            />
            <input
              type="text"
              value={formData.files}
              onChange={(e) => setFormData({ ...formData, files: e.target.value })}
              placeholder="Files (comma-separated): app/page.tsx, components/Button.tsx"
              className="w-full px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body font-mono"
            />
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 text-xs font-medium bg-secondary text-alternate rounded-md hover:bg-secondary/90"
            >
              {editingId ? 'Update Entry' : 'Add Entry'}
            </button>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {changelogEntries.length === 0 ? (
          <p className="text-xs text-caption italic text-center py-8">
            No changelog entries yet. Add one to track your changes!
          </p>
        ) : (
          changelogEntries.map((entry) => (
            <ChangelogEntry
              key={entry.id}
              entry={entry}
              onEdit={() => handleEdit(entry)}
              onDelete={() => handleDelete(entry.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

