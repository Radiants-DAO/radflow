import type { HelpItem } from '../types';

export const helpRegistry: Record<string, HelpItem> = {
  'tab-variables': {
    title: 'Variables',
    description: 'Edit design tokens, colors, and shadows. Changes preview live and can be saved to CSS.',
    tips: [
      'Click any color to copy its value',
      'Use color modes for dark/light theming',
      'Semantic tokens automatically update across components',
    ],
  },
  'tab-typography': {
    title: 'Typography',
    description: 'Manage fonts and typography styles for HTML elements.',
    tips: [
      'Upload custom fonts via drag-and-drop',
      'Typography styles apply to base HTML elements',
      'Changes persist to globals.css @layer base',
    ],
  },
  'tab-components': {
    title: 'Components',
    description: 'Browse and inspect your UI components with live previews.',
    tips: [
      'Components are auto-discovered from packages/ui and components/',
      'Click any component to see its props and variants',
      'Use the search bar to find components quickly',
    ],
  },
  'tab-assets': {
    title: 'Assets',
    description: 'Browse icons, brand logos, and media files.',
    tips: [
      'Icons can be copied with size information',
      'Brand assets include SVG and PNG formats',
      'Click any asset to copy its name or path',
    ],
  },
  'tool-component-id': {
    title: 'Component ID Mode',
    description: 'Click any element to identify its React component and source file.',
    shortcut: 'Cmd+Shift+I',
    tips: [
      'Hover over elements to see component info',
      'Click to copy component name and path',
      'Useful for debugging and navigation',
    ],
  },
  'tool-text-edit': {
    title: 'Text Edit Mode',
    description: 'Click any text to edit inline. Changes accumulate for AI editing.',
    shortcut: 'Cmd+Shift+T',
    tips: [
      'Press Enter after each edit',
      'Escape to copy all changes to clipboard',
      'RadTools changes require confirmation',
    ],
  },
  'tool-help': {
    title: 'Help Mode',
    description: 'Hover over DevTools elements to see contextual help.',
    shortcut: 'Cmd+Shift+?',
    tips: [
      'Hover over tabs, tools, and buttons',
      'Help tooltips show shortcuts and tips',
      'Press Escape to exit help mode',
    ],
  },
  'panel-resize': {
    title: 'Resize Panel',
    description: 'Drag the left edge to resize the DevTools panel.',
    tips: [
      'Minimum width: 300px',
      'Maximum width: 80% of viewport',
      'Panel width is saved automatically',
    ],
  },
  'panel-search': {
    title: 'Global Search',
    description: 'Search across components, icons, tokens, and typography.',
    shortcut: 'Cmd+E',
    tips: [
      'Search results jump to the relevant tab',
      'Use arrow keys to navigate results',
      'Press Enter to navigate to selected result',
    ],
  },
};
