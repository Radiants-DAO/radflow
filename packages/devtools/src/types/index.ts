// ============================================================================
// Design Token Types
// ============================================================================

/** Base Color (brand or neutral primitive) */
export interface BaseColor {
  id: string;
  name: string; // e.g., "sun-yellow", "lightest"
  displayName: string; // e.g., "Sun Yellow", "Lightest"
  value: string; // e.g., "#FCE184"
  category: 'brand' | 'neutral' | 'system';
}

/** Legacy alias for backwards compatibility */
export type BrandColor = BaseColor;

/** Semantic Token (references a brand color, themeable) */
export interface SemanticToken {
  id: string;
  name: string; // e.g., "primary", "card-foreground"
  displayName: string; // e.g., "Primary", "Card Foreground"
  referencedColorId: string; // e.g., "sun-yellow" - the brand color it points to
  resolvedValue: string; // e.g., "#FCE184" - the resolved hex value
  category: 'page' | 'surface' | 'action' | 'state' | 'form';
}

/** Color mode definition (e.g., dark mode) */
export interface ColorMode {
  id: string;
  name: string; // e.g., "dark"
  className: string; // e.g., ".dark"
  overrides: Record<string, string>; // token name -> brand color reference
}

/** Shadow definition */
export interface ShadowDefinition {
  id: string;
  name: string; // "btn", "card", "card-lg", etc.
  displayName: string; // "Button", "Card", "Card Large", etc.
  value: string; // "0 1px 0 0 var(--color-black)"
}

// ============================================================================
// Component Discovery Types
// ============================================================================

/** Discovered component definition */
export interface DiscoveredComponent {
  name: string;
  path: string;
  source: 'npm' | 'local';
  packageName?: string; // For npm components
  props: PropDefinition[];
}

/** Component prop definition */
export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  options?: string[]; // For union types
}

/** Component source for discovery */
export interface ComponentSource {
  type: 'npm' | 'local';
  path: string;
  packageName?: string;
}

// ============================================================================
// Asset Types
// ============================================================================

/** Asset file */
export interface AssetFile {
  name: string;
  path: string;
  type: 'image' | 'icon' | 'video' | 'other';
  size: number;
  dimensions?: { width: number; height: number };
}

/** Asset folder */
export interface AssetFolder {
  name: string;
  path: string;
  children: (AssetFolder | AssetFile)[];
}

// ============================================================================
// Typography Types
// ============================================================================

/** Font file within a font definition */
export interface FontFile {
  id: string;
  weight: number; // 400, 700, etc.
  style: string; // "normal", "italic"
  format: 'woff2' | 'woff' | 'ttf' | 'otf';
  path: string; // "/fonts/Mondwest-Regular.woff2"
}

/** Font Definition */
export interface FontDefinition {
  id: string;
  name: string; // "Mondwest", "Joystix Monospace"
  family: string; // CSS font-family value
  files: FontFile[];
  weights: number[];
  styles: string[];
}

/** Typography Style Definition (for @layer base HTML elements) */
export interface TypographyStyle {
  id: string;
  element: string; // "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li"
  fontFamilyId: string; // References FontDefinition.id
  fontSize: string; // Tailwind class: "text-4xl", "text-3xl", etc.
  lineHeight?: string; // Tailwind class: "leading-relaxed", "leading-tight", etc.
  letterSpacing?: string; // Tailwind class: "tracking-wide", "tracking-normal", etc.
  fontWeight: string; // Tailwind class: "font-bold", "font-semibold", "font-normal", etc.
  baseColorId: string; // References BaseColor.id for text color
  displayName: string; // "Heading 1", "Heading 2", "Paragraph", etc.
  utilities?: string[]; // Additional Tailwind utilities
}

// ============================================================================
// Tab & Panel Types
// ============================================================================

/** DevTools tab identifiers */
export type Tab = 'variables' | 'typography' | 'components' | 'assets';

/** CSS change for preview mode */
export interface CSSChange {
  id: string;
  selector: string;
  property: string;
  value: string;
  originalValue?: string;
}

// ============================================================================
// Contribution Types
// ============================================================================

/** Contribution type for the wizard */
export type ContributionType = 'theme' | 'component-set' | 'individual';

/** Contribution metadata */
export interface ContributionMetadata {
  type: ContributionType;
  name: string;
  description: string;
  author: string;
  themeAffiliation?: string; // For component sets
}

/** Export package structure */
export interface ExportPackage {
  metadata: ContributionMetadata;
  files: { path: string; content: string }[];
}
