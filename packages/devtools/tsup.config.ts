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
    external: ['react', 'react-dom', 'next', 'zustand'],
    banner: {
      js: '"use client";',
    },
  },
  // API entry (server-side handlers)
  {
    entry: {
      'api/index': 'src/api/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: false, // Don't clean since first build already did
    treeshake: true,
    external: ['react', 'react-dom', 'next'],
  },
]);
