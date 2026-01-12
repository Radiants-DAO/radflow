'use client';

import React from 'react';
import {
  Icon,
  Button,
  Badge,
  Input,
  Progress,
  Divider,
} from '@radflow/ui';
import { useDevToolsStore } from '../store';
import type { TypographyStyle } from '../types';

// ============================================================================
// Icon Preview
// ============================================================================

interface IconPreviewProps {
  name: string;
}

export function IconPreview({ name }: IconPreviewProps) {
  return (
    <Icon name={name} size={24} className="text-content-primary" />
  );
}

// ============================================================================
// Typography Preview
// ============================================================================

interface TypographyPreviewProps {
  element: string;
}

// Sample text for typography previews (abbreviated)
const SAMPLE_TEXT: Record<string, string> = {
  h1: 'Aa',
  h2: 'Aa',
  h3: 'Aa',
  h4: 'Aa',
  h5: 'Aa',
  h6: 'Aa',
  p: 'Aa',
  a: 'Link',
  ul: '• •',
  ol: '1. 2.',
  li: '•',
  small: 'Aa',
  strong: 'Aa',
  em: 'Aa',
  code: '</>',
  pre: '</>',
  kbd: '⌘',
  mark: 'Aa',
  blockquote: '"',
  cite: 'Aa',
};

export function TypographyPreview({ element }: TypographyPreviewProps) {
  const { typographyStyles, fonts } = useDevToolsStore();

  // Find the style for this element
  const style = typographyStyles.find((s: TypographyStyle) => s.element === element);
  if (!style) return <span className="text-xs text-content-secondary">Aa</span>;

  // Get font family
  const font = fonts.find(f => f.id === style.fontFamilyId);
  const fontFamily = font?.family || style.fontFamilyId;

  // Build inline styles for accurate preview
  const previewStyle: React.CSSProperties = {
    fontFamily,
    fontSize: '14px', // Fixed size for thumbnail
    lineHeight: 1.2,
  };

  const text = SAMPLE_TEXT[element] || 'Aa';

  return (
    <span style={previewStyle} className="text-content-primary truncate">
      {text}
    </span>
  );
}

// ============================================================================
// Component Preview
// ============================================================================

interface ComponentPreviewProps {
  name: string;
}

// Static map of simplified component renders - sized for 64x56 preview container
const COMPONENT_PREVIEWS: Record<string, React.ReactNode> = {
  // Form Controls
  'Button': <Button size="sm">Button</Button>,
  'Input': <Input size="sm" className="w-14 h-7" placeholder="..." />,
  'Checkbox': (
    <div className="w-5 h-5 bg-surface-primary border-2 border-edge-primary rounded-sm flex items-center justify-center">
      <Icon name="check" className="w-3 h-3 text-brand-primary" />
    </div>
  ),
  'Switch': (
    <div className="w-10 h-5 bg-surface-tertiary rounded-full relative">
      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-brand-primary rounded-full" />
    </div>
  ),
  'Slider': (
    <div className="w-12 h-1.5 bg-surface-tertiary rounded-full relative">
      <div className="absolute left-0 top-0 w-1/2 h-full bg-brand-primary rounded-full" />
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-surface-primary border border-edge-primary rounded-full" />
    </div>
  ),

  // Display
  'Badge': <Badge size="sm">Tag</Badge>,
  'Avatar': (
    <div className="w-8 h-8 bg-surface-tertiary rounded-full flex items-center justify-center">
      <Icon name="user" size="md" className="text-content-secondary" />
    </div>
  ),
  'Progress': <Progress value={60} className="w-12 h-2" />,
  'Skeleton': <div className="w-12 h-5 bg-surface-tertiary/50 rounded animate-pulse" />,
  'Icon': <Icon name="star" size="md" className="text-content-primary" />,

  // Layout
  'Card': (
    <div className="w-12 h-9 bg-surface-primary border border-edge-primary rounded-sm shadow-sm" />
  ),
  'Divider': <Divider className="w-12" />,

  // Overlays (simplified placeholders)
  'Dialog': (
    <div className="w-12 h-9 bg-surface-primary border border-edge-primary rounded-sm shadow-md flex items-center justify-center">
      <div className="w-6 h-0.5 bg-content-secondary rounded" />
    </div>
  ),
  'Sheet': (
    <div className="w-12 h-9 bg-surface-primary border-l-2 border-edge-primary rounded-r-sm shadow-md" />
  ),
  'Popover': (
    <div className="w-12 h-9 bg-surface-primary border border-edge-primary rounded-sm shadow-md relative">
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-surface-primary border-b border-r border-edge-primary rotate-45" />
    </div>
  ),
  'Tooltip': (
    <div className="w-10 h-5 bg-surface-inverse text-content-inverse rounded text-[8px] flex items-center justify-center">
      tip
    </div>
  ),
  'DropdownMenu': (
    <div className="w-12 h-9 bg-surface-primary border border-edge-primary rounded-sm shadow-sm flex flex-col gap-0.5 p-1">
      <div className="w-full h-1.5 bg-content-secondary/20 rounded-sm" />
      <div className="w-full h-1.5 bg-content-secondary/20 rounded-sm" />
      <div className="w-full h-1.5 bg-content-secondary/20 rounded-sm" />
    </div>
  ),
  'ContextMenu': (
    <div className="w-12 h-9 bg-surface-primary border border-edge-primary rounded-sm shadow-sm flex flex-col gap-0.5 p-1">
      <div className="w-full h-1.5 bg-content-secondary/20 rounded-sm" />
      <div className="w-full h-1.5 bg-content-secondary/20 rounded-sm" />
      <div className="w-full h-1.5 bg-content-secondary/20 rounded-sm" />
    </div>
  ),

  // Navigation
  'Tabs': (
    <div className="flex gap-0.5">
      <div className="w-6 h-4 bg-surface-secondary rounded-t-sm border-b-2 border-brand-primary" />
      <div className="w-6 h-4 bg-surface-tertiary rounded-t-sm" />
    </div>
  ),
  'Breadcrumbs': (
    <div className="flex items-center gap-1 text-[8px] text-content-secondary">
      <span>Home</span>
      <span>/</span>
      <span>Page</span>
    </div>
  ),
  'Accordion': (
    <div className="w-12 h-9 bg-surface-primary border border-edge-primary rounded-sm flex flex-col">
      <div className="flex-1 border-b border-edge-primary/50 flex items-center px-1">
        <Icon name="chevron-down" className="w-3 h-3" />
      </div>
      <div className="flex-1" />
    </div>
  ),

  // Feedback
  'Alert': (
    <div className="w-14 h-7 bg-status-warning/10 border border-status-warning/30 rounded-sm flex items-center gap-1 px-1">
      <div className="w-3 h-3 rounded-full bg-status-warning" />
      <div className="w-6 h-1.5 bg-content-secondary/30 rounded" />
    </div>
  ),
  'Toast': (
    <div className="w-14 h-7 bg-surface-primary border border-edge-primary rounded-sm shadow-md flex items-center gap-1 px-1">
      <div className="w-3 h-3 rounded-full bg-status-success" />
      <div className="w-6 h-1.5 bg-content-secondary/30 rounded" />
    </div>
  ),

  // Data Display
  'Table': (
    <div className="w-14 h-9 border border-edge-primary rounded-sm overflow-hidden">
      <div className="h-3 bg-surface-secondary border-b border-edge-primary" />
      <div className="grid grid-cols-2 gap-px bg-edge-primary/20">
        <div className="h-2 bg-surface-primary" />
        <div className="h-2 bg-surface-primary" />
        <div className="h-2 bg-surface-primary" />
        <div className="h-2 bg-surface-primary" />
      </div>
    </div>
  ),

  // Select (compound)
  'Select': (
    <div className="w-14 h-7 bg-surface-primary border border-edge-primary rounded-sm flex items-center justify-between px-1.5">
      <div className="w-6 h-1.5 bg-content-secondary/30 rounded" />
      <Icon name="chevron-down" className="w-3 h-3 text-content-secondary" />
    </div>
  ),

  // Help
  'HelpPanel': (
    <div className="w-12 h-9 bg-surface-primary border border-edge-primary rounded-sm flex items-center justify-center">
      <span className="text-sm text-content-secondary font-bold">?</span>
    </div>
  ),
};

export function ComponentPreview({ name }: ComponentPreviewProps) {
  const preview = COMPONENT_PREVIEWS[name];

  if (!preview) {
    // Fallback for unknown components
    return (
      <div className="w-12 h-10 bg-surface-tertiary/50 rounded-sm flex items-center justify-center">
        <Icon name="component" size="md" className="text-content-secondary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {preview}
    </div>
  );
}

// ============================================================================
// Unified Preview Component
// ============================================================================

interface SearchPreviewProps {
  type: 'component' | 'icon' | 'token' | 'typography' | 'asset';
  text: string;
  sectionId?: string;
}

export function SearchPreview({ type, text, sectionId }: SearchPreviewProps) {
  // Icons section
  if (sectionId === 'icons' || type === 'icon') {
    return <IconPreview name={text} />;
  }

  // Typography
  if (type === 'typography') {
    return <TypographyPreview element={text} />;
  }

  // Components
  if (type === 'component') {
    return <ComponentPreview name={text} />;
  }

  // Tokens - show a color swatch if it looks like a color
  if (type === 'token' && text.toLowerCase().includes('color')) {
    return (
      <div className="w-8 h-8 rounded-sm border border-edge-primary bg-gradient-to-br from-brand-primary to-brand-secondary" />
    );
  }

  // Default fallback - show a generic icon
  return (
    <Icon name="file" size={20} className="text-content-secondary" />
  );
}
