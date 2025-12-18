'use client';

import { useState } from 'react';
import { useDevToolsStore } from '../../store';
import { StatePresetCard } from './StatePresetCard';

export function MockStatesTab() {
  const { mockStates, toggleMockState, deleteMockState, addMockState } = useDevToolsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newState, setNewState] = useState({
    name: '',
    description: '',
    category: 'custom',
    values: '{}',
  });

  // Group states by category
  const categories = Array.from(new Set(mockStates.map((s) => s.category)));

  const handleAdd = () => {
    try {
      const values = JSON.parse(newState.values);
      addMockState({
        name: newState.name,
        description: newState.description,
        category: newState.category,
        values,
        active: false,
      });
      setNewState({ name: '', description: '', category: 'custom', values: '{}' });
      setShowAddForm(false);
    } catch {
      alert('Invalid JSON in values field');
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-heading">Mock States</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 text-xs font-medium bg-secondary text-alternate rounded-md hover:bg-secondary/90"
        >
          {showAddForm ? '✕ Cancel' : '+ Add Custom'}
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-caption">
        Mock states allow you to simulate different app states during development.
        Use <code className="px-1 bg-panel-hover rounded">useMockState('category')</code> in your components.
      </p>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-3 bg-panel-hover rounded-lg space-y-3">
          <h3 className="text-xs font-medium text-heading">Create Custom Mock State</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={newState.name}
              onChange={(e) => setNewState({ ...newState, name: e.target.value })}
              placeholder="State name"
              className="w-full px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
            />
            <input
              type="text"
              value={newState.description}
              onChange={(e) => setNewState({ ...newState, description: e.target.value })}
              placeholder="Description"
              className="w-full px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
            />
            <input
              type="text"
              value={newState.category}
              onChange={(e) => setNewState({ ...newState, category: e.target.value })}
              placeholder="Category"
              className="w-full px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body"
            />
            <textarea
              value={newState.values}
              onChange={(e) => setNewState({ ...newState, values: e.target.value })}
              placeholder='Values (JSON): {"key": "value"}'
              rows={3}
              className="w-full px-2 py-1.5 text-xs bg-panel border border-border rounded-md text-body font-mono"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 text-xs font-medium bg-secondary text-alternate rounded-md hover:bg-secondary/90"
            >
              Create State
            </button>
          </div>
        </div>
      )}

      {/* States by Category */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xs font-medium text-caption uppercase tracking-wide mb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {mockStates
                .filter((s) => s.category === category)
                .map((state) => (
                  <StatePresetCard
                    key={state.id}
                    state={state}
                    onToggle={() => toggleMockState(state.id)}
                    onDelete={() => deleteMockState(state.id)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

