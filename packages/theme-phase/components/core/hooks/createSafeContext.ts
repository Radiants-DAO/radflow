import React, { createContext, useContext } from 'react';

/**
 * Creates a context with a hook that throws if used outside of provider.
 * Returns a tuple of [Provider-ready context, useContext hook].
 */
export function createSafeContext<T>(displayName: string): [
  React.Context<T | null>,
  () => T
] {
  const Context = createContext<T | null>(null);
  Context.displayName = displayName;

  function useContextHook(): T {
    const ctx = useContext(Context);
    if (ctx === null) {
      throw new Error(
        `use${displayName} must be used within a ${displayName}Provider`
      );
    }
    return ctx;
  }

  return [Context, useContextHook];
}
