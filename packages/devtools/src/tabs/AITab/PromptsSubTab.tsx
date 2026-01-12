'use client';

import { useState, useMemo } from 'react';
import { useDevToolsStore } from '../../store';
import { PromptTemplate } from '../../store/slices/aiSlice';
import { Button } from '@radflow/ui/Button';
import { ThemeIcon as Icon } from '../../components/ThemeIcon';

interface PromptsSubTabProps {
  prompts: PromptTemplate[];
  searchQuery: string;
}

export function PromptsSubTab({ prompts, searchQuery }: PromptsSubTabProps) {
  const { markPromptAsUsed } = useDevToolsStore();
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Filter and group prompts
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

  const groupedPrompts = useMemo(() => {
    const groups: Record<string, PromptTemplate[]> = {};
    filteredPrompts.forEach((prompt) => {
      if (!groups[prompt.category]) {
        groups[prompt.category] = [];
      }
      groups[prompt.category].push(prompt);
    });
    return groups;
  }, [filteredPrompts]);

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

  if (filteredPrompts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-content-primary">
        <div className="text-center">
          <Icon name="search" size={48} className="mx-auto mb-4 opacity-50" />
          <p>No prompts found matching &quot;{searchQuery}&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-6">
        {Object.entries(groupedPrompts).map(([category, categoryPrompts]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-content-primary mb-3">{category}</h3>
            <div className="space-y-3">
              {categoryPrompts.map((prompt) => {
                const isExpanded = expandedPromptId === prompt.id;
                const isCopied = copiedPromptId === prompt.id;

                return (
                  <div
                    key={prompt.id}
                    className="bg-surface-elevated border border-edge-primary/20 rounded-md p-4 hover:border-edge-focus transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-content-primary mb-1">{prompt.title}</h4>
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
          </div>
        ))}
      </div>
    </div>
  );
}
