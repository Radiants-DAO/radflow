/**
 * @radflow/devtools API Route Handlers
 *
 * Re-export these in your Next.js app/api directory:
 *
 * ```ts
 * // app/api/devtools/read-css/route.ts
 * export { GET } from '@radflow/devtools/api/handlers/read-css';
 *
 * // app/api/devtools/write-css/route.ts
 * export { POST } from '@radflow/devtools/api/handlers/write-css';
 *
 * // app/api/devtools/themes/list/route.ts
 * export { GET } from '@radflow/devtools/api/handlers/themes-list';
 * ```
 *
 * Each handler file exports the appropriate HTTP method (GET/POST).
 * Import from the specific handler file, not from this index.
 */

// Named re-exports for utilities only (handlers should be imported directly)
export { getCurrentThemeId, getThemeFilePaths, getCurrentThemeImport, switchThemeImport } from '../lib/themeUtils';

// Handler paths for reference (import these directly in your route files)
export const handlers = {
  readCss: '@radflow/devtools/api/handlers/read-css',
  writeCss: '@radflow/devtools/api/handlers/write-css',
  themesList: '@radflow/devtools/api/handlers/themes-list',
  themesCurrent: '@radflow/devtools/api/handlers/themes-current',
  themesSwitch: '@radflow/devtools/api/handlers/themes-switch',
  components: '@radflow/devtools/api/handlers/components',
  fonts: '@radflow/devtools/api/handlers/fonts',
  icons: '@radflow/devtools/api/handlers/icons',
} as const;
