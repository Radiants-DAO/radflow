'use client';

import { createContext, useContext, ReactNode } from 'react';

export type IconLibrary = 'phosphor' | 'svg';
export type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export interface IconConfig {
  /** Icon library to use */
  library: IconLibrary;
  /** Phosphor icon weight (only applies when library is 'phosphor') */
  weight?: PhosphorWeight;
}

const IconContext = createContext<IconConfig | null>(null);

export interface IconProviderProps {
  children: ReactNode;
  /** Icon library to use: 'phosphor' for Phosphor icons, 'svg' for local SVG files */
  library: IconLibrary;
  /** Phosphor weight/style (thin, light, regular, bold, fill, duotone) */
  weight?: PhosphorWeight;
}

/**
 * Provider for configuring which icon library to use throughout the app.
 *
 * @example
 * ```tsx
 * import { IconProvider } from '@radflow/ui';
 *
 * // Use Phosphor icons with bold weight
 * <IconProvider library="phosphor" weight="bold">
 *   <App />
 * </IconProvider>
 *
 * // Use local SVG icons (default behavior)
 * <IconProvider library="svg">
 *   <App />
 * </IconProvider>
 * ```
 */
export function IconProvider({ children, library, weight = 'regular' }: IconProviderProps) {
  return (
    <IconContext.Provider value={{ library, weight }}>
      {children}
    </IconContext.Provider>
  );
}

/**
 * Hook to access the current icon configuration.
 * Returns null if no IconProvider is present (will use SVG fallback).
 */
export function useIconConfig(): IconConfig | null {
  return useContext(IconContext);
}
