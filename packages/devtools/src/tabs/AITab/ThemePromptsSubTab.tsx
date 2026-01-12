'use client';

import { useState, useMemo } from 'react';
import { useDevToolsStore } from '../../store';
import { PromptTemplate } from '../../store/slices/aiSlice';
import { Button } from '@radflow/ui/Button';
import { ThemeIcon as Icon } from '../../components/ThemeIcon';

interface ThemePromptsSubTabProps {
  prompts: PromptTemplate[];
  searchQuery: string;
}

export function ThemePromptsSubTab({ prompts, searchQuery }: ThemePromptsSubTabProps) {
  const { markPromptAsUsed, addCustomPrompt, removeCustomPrompt, updateCustomPrompt } =
    useDevToolsStore();
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);

  // Form state for adding/editing prompts
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
  });

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [prompts, searchQuery]);

  const handleCopyPrompt = async (prompt: PromptTemplate) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopiedPromptId(prompt.id);
      markPromptAsUsed(prompt.id);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const toggleExpand = (promptId: string) => {
    setExpandedPromptId(expandedPromptId === promptId ? null : promptId);
  };

  const handleAddPrompt = () => {
    setIsAddingPrompt(true);
    setFormData({ title: '', category: '', content: '', tags: '' });
  };

  const handleEditPrompt = (prompt: PromptTemplate) => {
    setEditingPromptId(prompt.id);
    setFormData({
      title: prompt.title,
      category: prompt.category,
      content: prompt.content,
      tags: prompt.tags?.join(', ') || '',
    });
  };

  const handleSavePrompt = () => {
    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingPromptId) {
      // Update existing prompt
      updateCustomPrompt(editingPromptId, {
        title: formData.title,
        category: formData.category,
        content: formData.content,
        tags,
      });
      setEditingPromptId(null);
    } else {
      // Add new prompt
      const newPrompt: PromptTemplate = {
        id: `custom-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        content: formData.content,
        tags,
        isThemeSpecific: true,
      };
      addCustomPrompt(newPrompt);
      setIsAddingPrompt(false);
    }

    setFormData({ title: '', category: '', content: '', tags: '' });
  };

  const handleCancelEdit = () => {
    setIsAddingPrompt(false);
    setEditingPromptId(null);
    setFormData({ title: '', category: '', content: '', tags: '' });
  };

  const handleDeletePrompt = (promptId: string) => {
    if (confirm('Are you sure you want to delete this custom prompt?')) {
      removeCustomPrompt(promptId);
    }
  };

  return (
    <div className="p-4">
      {/* Add Custom Prompt Button */}
      {!isAddingPrompt && !editingPromptId && (
        <Button variant="secondary" size="sm" onClick={handleAddPrompt} className="mb-4">
          <Icon name="add-circle" size={16} className="mr-2" />
          Add Custom Prompt
        </Button>
      )}

      {/* Add/Edit Prompt Form */}
      {(isAddingPrompt || editingPromptId) && (
        <div className="bg-surface-elevated border border-edge-primary/20 rounded-md p-4 mb-4">
          <h3 className="text-lg font-semibold text-content-primary mb-3">
            {editingPromptId ? 'Edit Prompt' : 'Add Custom Prompt'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-surface-primary border border-edge-primary/20 rounded-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
                placeholder="e.g., Create Theme-Specific Component"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-surface-primary border border-edge-primary/20 rounded-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
                placeholder="e.g., Components, Styling, Layout"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">
                Prompt Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-surface-primary border border-edge-primary/20 rounded-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-edge-focus font-mono text-sm"
                placeholder="Enter your prompt instructions..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 bg-surface-primary border border-edge-primary/20 rounded-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-edge-focus"
                placeholder="e.g., component, custom, theme"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleSavePrompt}>
                {editingPromptId ? 'Update' : 'Save'} Prompt
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prompts List */}
      {filteredPrompts.length === 0 && !isAddingPrompt && !editingPromptId && (
        <div className="flex items-center justify-center h-64 text-content-primary">
          <div className="text-center">
            <Icon name="document" size={48} className="mx-auto mb-4 opacity-50" />
            <p className="mb-2">
              {searchQuery ? `No prompts found matching "${searchQuery}"` : 'No custom prompts yet'}
            </p>
            {!searchQuery && (
              <p className="text-sm">Add theme-specific prompts to help with your workflow</p>
            )}
          </div>
        </div>
      )}

      {filteredPrompts.length > 0 && (
        <div className="space-y-3">
          {filteredPrompts.map((prompt) => {
            const isExpanded = expandedPromptId === prompt.id;
            const isCopied = copiedPromptId === prompt.id;
            const isEditing = editingPromptId === prompt.id;

            if (isEditing) return null; // Hide when editing

            return (
              <div
                key={prompt.id}
                className="bg-surface-elevated border border-edge-primary/20 rounded-md p-4 hover:border-edge-focus transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-content-primary">{prompt.title}</h4>
                      <span className="px-2 py-0.5 text-xs bg-surface-tertiary text-content-primary rounded">
                        {prompt.category}
                      </span>
                    </div>
                    {prompt.tags && prompt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-surface-tertiary/50 text-content-primary rounded-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      iconName={isCopied ? 'checkmark-circle' : 'copy'}
                      onClick={() => handleCopyPrompt(prompt)}
                      title={isCopied ? 'Copied!' : 'Copy prompt'}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      iconName="pencil"
                      onClick={() => handleEditPrompt(prompt)}
                      title="Edit prompt"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      iconName="trash"
                      onClick={() => handleDeletePrompt(prompt.id)}
                      title="Delete prompt"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      iconName={isExpanded ? 'chevron-up' : 'chevron-down'}
                      onClick={() => toggleExpand(prompt.id)}
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-edge-primary/10">
                    <pre className="text-sm text-content-primary whitespace-pre-wrap font-mono bg-surface-primary p-3 rounded-sm border border-edge-primary/20">
                      {prompt.content}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
