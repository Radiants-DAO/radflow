import type { CSSChange } from '../store';

const STYLE_ID = 'radflow-preview-styles';

/**
 * Inject preview styles into the document
 * This enables live preview of CSS changes without persisting to files
 */
export function injectPreviewStyles(changes: CSSChange[]): void {
  if (typeof document === 'undefined') return;

  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.setAttribute('data-radflow', 'preview');
    document.head.appendChild(styleEl);
  }

  // Group changes by selector for cleaner CSS output
  const bySelector = changes.reduce(
    (acc, change) => {
      if (!acc[change.selector]) {
        acc[change.selector] = [];
      }
      acc[change.selector].push(`${change.property}: ${change.value}`);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const cssText = Object.entries(bySelector)
    .map(([selector, props]) => `${selector} { ${props.join('; ')}; }`)
    .join('\n');

  styleEl.textContent = cssText;
}

/**
 * Remove preview styles from the document
 * Call this when exiting preview mode or resetting changes
 */
export function clearPreviewStyles(): void {
  if (typeof document === 'undefined') return;

  const styleEl = document.getElementById(STYLE_ID);
  if (styleEl) {
    styleEl.remove();
  }
}

/**
 * Check if preview styles are currently injected
 */
export function hasPreviewStyles(): boolean {
  if (typeof document === 'undefined') return false;
  return document.getElementById(STYLE_ID) !== null;
}

/**
 * Generate CSS text from changes array
 * Groups changes by selector for cleaner output
 */
export function generateCSS(changes: CSSChange[]): string {
  if (changes.length === 0) return '';

  // Group changes by selector
  const bySelector = changes.reduce(
    (acc, change) => {
      if (!acc[change.selector]) {
        acc[change.selector] = [];
      }
      acc[change.selector].push(`${change.property}: ${change.value}`);
      return acc;
    },
    {} as Record<string, string[]>
  );

  return Object.entries(bySelector)
    .map(([selector, props]) => `${selector} {\n  ${props.join(';\n  ')};\n}`)
    .join('\n\n');
}
