// Design Token Types
export interface BrandColor {
  id: string;
  name: string;        // e.g., "sun-yellow"
  value: string;       // e.g., "#fce184"
  category: 'brand' | 'neutral';
}

export interface SemanticToken {
  id: string;
  name: string;        // e.g., "primary"
  reference: string;   // e.g., "--brand-warm-cloud"
  category: 'background' | 'text' | 'border' | 'system';
}

export interface ColorMode {
  id: string;
  name: string;        // e.g., "dark"
  className: string;   // e.g., ".dark"
  overrides: Record<string, string>;  // token name -> brand color reference
}

// Component Discovery Types
export interface DiscoveredComponent {
  name: string;
  path: string;
  props: PropDefinition[];
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
}

// Asset Types
export interface AssetFile {
  name: string;
  path: string;
  type: 'image' | 'video' | 'other';
  size: number;
  dimensions?: { width: number; height: number };
}

export interface AssetFolder {
  name: string;
  path: string;
  children: (AssetFolder | AssetFile)[];
}

// Comment Types
export interface Comment {
  id: string;
  elementSelector: string;
  elementPath: string[];      // DOM path for display
  elementPreview: string;     // Text content preview
  text: string;
  createdAt: string;          // ISO date
  sessionId: string;
  resolved: boolean;
  replies: Reply[];
}

export interface Reply {
  id: string;
  text: string;
  createdAt: string;
  sessionId: string;
}

// Mock State Types
export interface MockState {
  id: string;
  name: string;
  description: string;
  category: string;
  values: Record<string, unknown>;
  active: boolean;
}

// Changelog Types
export interface ChangelogEntry {
  id: string;
  timestamp: string;
  type: 'feature' | 'fix' | 'refactor' | 'style' | 'chore';
  description: string;
  files: string[];
  author: string;
  details?: string;
}

// Tab Types
export type Tab = 'variables' | 'components' | 'assets' | 'comments' | 'mockStates' | 'changelog';

