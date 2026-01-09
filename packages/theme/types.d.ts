/**
 * @radflow/theme - TypeScript definitions for semantic tokens
 *
 * These type definitions ensure type safety when working with
 * RadFlow design tokens in TypeScript/JavaScript code.
 */

export interface RadFlowSemanticTokens {
  // Surface tokens (backgrounds)
  '--color-surface-primary': string;
  '--color-surface-secondary': string;
  '--color-surface-tertiary': string;
  '--color-surface-elevated': string;
  '--color-surface-success': string;
  '--color-surface-warning': string;
  '--color-surface-error': string;

  // Content tokens (text/icons)
  '--color-content-primary': string;
  '--color-content-secondary': string;
  '--color-content-tertiary': string;
  '--color-content-inverted': string;
  '--color-content-success': string;
  '--color-content-warning': string;
  '--color-content-error': string;
  '--color-content-link': string;

  // Edge tokens (borders/dividers)
  '--color-edge-primary': string;
  '--color-edge-secondary': string;
  '--color-edge-elevated': string;
  '--color-edge-success': string;
  '--color-edge-warning': string;
  '--color-edge-error': string;
  '--color-edge-focus': string;

  // Border radius
  '--radius-none': string;
  '--radius-xs': string;
  '--radius-sm': string;
  '--radius-md': string;
  '--radius-lg': string;
  '--radius-full': string;

  // Box shadows
  '--shadow-btn': string;
  '--shadow-btn-hover': string;
  '--shadow-card': string;
  '--shadow-card-lg': string;
  '--shadow-card-hover': string;
  '--shadow-panel-left': string;
  '--shadow-inner': string;

  // Typography scale
  '--font-size-2xs': string;
  '--font-size-xs': string;
  '--font-size-sm': string;
  '--font-size-base': string;
  '--font-size-lg': string;
}

export interface RadFlowBrandTokens {
  // Brand colors (theme-specific, not part of semantic interface)
  [key: `--color-${string}`]: string;
}

export type RadFlowTokens = RadFlowSemanticTokens & RadFlowBrandTokens;
