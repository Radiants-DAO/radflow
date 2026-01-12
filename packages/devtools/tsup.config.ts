import { defineConfig } from 'tsup';

export default defineConfig([
  // Main entry (client-side components)
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    external: ['react', 'react-dom', 'next', 'zustand', '@radflow/ui'],
    banner: {
      js: '"use client";',
    },
  },
  // API entry (server-side handlers)
  {
    entry: {
      'api/index': 'src/api/index.ts',
      'api/handlers/read-css': 'src/api/handlers/read-css.ts',
      'api/handlers/write-css': 'src/api/handlers/write-css.ts',
      'api/handlers/themes-list': 'src/api/handlers/themes-list.ts',
      'api/handlers/themes-current': 'src/api/handlers/themes-current.ts',
      'api/handlers/themes-switch': 'src/api/handlers/themes-switch.ts',
      'api/handlers/components': 'src/api/handlers/components.ts',
      'api/handlers/fonts': 'src/api/handlers/fonts.ts',
      'api/handlers/icons': 'src/api/handlers/icons.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: false,
    treeshake: true,
    external: ['react', 'react-dom', 'next'],
  },
  // Lib utilities (server-side)
  {
    entry: {
      'lib/themeUtils': 'src/lib/themeUtils.ts',
      'types/index': 'src/types/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    treeshake: true,
    external: ['react', 'react-dom', 'next'],
  },
]);
