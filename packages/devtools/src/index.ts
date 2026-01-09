"use client";
/**
 * @radflow/devtools - Visual Development Tools
 *
 * Provides a visual editor for CSS variables, typography, components, and assets.
 * Features preview mode (CSS injection) and optional persistence via API.
 *
 * Usage:
 *   import { DevToolsProvider } from '@radflow/devtools'
 *
 *   function App() {
 *     return (
 *       <DevToolsProvider>
 *         <YourApp />
 *       </DevToolsProvider>
 *     )
 *   }
 */

// Main provider and panel
export { DevToolsProvider } from './DevToolsProvider';
export { DevToolsPanel } from './DevToolsPanel';

// Store
export { useDevToolsStore } from './store';
export type { DevToolsState, CSSChange } from './store';

// CSS utilities
export { injectPreviewStyles, clearPreviewStyles, hasPreviewStyles, generateCSS } from './lib/cssInjector';

// Component discovery
export {
  discoverComponents,
  getComponentSources,
  filterBySource,
  filterByPackage,
  groupBySource,
  searchComponents,
  defaultDiscoveryConfig,
} from './lib/componentDiscovery';
export type { DiscoveryConfig } from './lib/componentDiscovery';

// Types
export type {
  Tab,
  BaseColor,
  BrandColor,
  SemanticToken,
  ColorMode,
  ShadowDefinition,
  DiscoveredComponent,
  PropDefinition,
  ComponentSource,
  AssetFile,
  AssetFolder,
  FontFile,
  FontDefinition,
  TypographyStyle,
  ContributionType,
  ContributionMetadata,
  ExportPackage,
} from './types';
