'use client';

import { useEffect, useState } from 'react';
import { useDevToolsStore } from '../store';
import type { ComponentInfo } from '../types';

/**
 * Find React component info from a DOM element
 * Traverses React Fiber tree to find component name and source file
 */
function findReactComponent(element: HTMLElement): ComponentInfo | null {
  // Extract data-theme attribute if present
  const theme = element.getAttribute('data-theme') || undefined;

  // Try to find React Fiber node
  const fiberKey = Object.keys(element).find(
    (key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')
  );

  if (!fiberKey) {
    // Fallback: return element tag name
    return {
      name: element.tagName.toLowerCase(),
      path: 'DOM Element',
      theme,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fiber = (element as any)[fiberKey];
  let depth = 0;
  const maxDepth = 20; // Prevent infinite loops

  while (fiber && depth < maxDepth) {
    // Check if this fiber has a component
    if (fiber.type) {
      const componentType = fiber.type;

      // Function component
      if (typeof componentType === 'function') {
        const name = componentType.displayName || componentType.name || 'Anonymous';
        if (name !== 'Anonymous' && name !== '') {
          // Try to get source file from stack trace or _debugSource
          const source = (fiber._debugSource || fiber._debugOwner?._debugSource);
          const file = source
            ? `${source.fileName}:${source.lineNumber}`
            : 'Unknown source';

          return {
            name,
            path: file,
            theme,
          };
        }
      }

      // Class component
      if (typeof componentType === 'object' && componentType !== null) {
        const name = componentType.displayName || componentType.name || 'Unknown';
        const source = (fiber._debugSource || fiber._debugOwner?._debugSource);
        const file = source
          ? `${source.fileName}:${source.lineNumber}`
          : 'Unknown source';

        return {
          name,
          path: file,
        };
      }

      // String component (e.g., 'div', 'span')
      if (typeof componentType === 'string') {
        return {
          name: componentType,
          path: 'HTML Element',
          theme,
        };
      }
    }

    // Traverse up the fiber tree
    fiber = fiber.return || fiber._owner;
    depth++;
  }

  // Fallback: return element tag
  return {
    name: element.tagName.toLowerCase(),
    path: 'DOM Element',
    theme,
  };
}

export function ComponentIdMode() {
  const {
    isComponentIdActive,
    hoveredComponent,
    tooltipPosition,
    setHoveredComponent,
    toggleComponentIdMode,
    navigateToComponent,
    expandAndNavigate,
  } = useDevToolsStore();

  const [clickedComponent, setClickedComponent] = useState<ComponentInfo | null>(null);

  // Reset state when mode is deactivated
  useEffect(() => {
    if (!isComponentIdActive) {
      // Use queueMicrotask to defer state updates
      queueMicrotask(() => {
        setHoveredComponent(null);
        setClickedComponent(null);
      });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Ignore RadTools panel elements
      if (target.closest('[data-radtools-panel]')) {
        setHoveredComponent(null);
        return;
      }

      const componentInfo = findReactComponent(target);
      setHoveredComponent(componentInfo, { x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (!target || target.closest('[data-radtools-panel]')) return;

      const componentInfo = findReactComponent(target);
      setClickedComponent(componentInfo);

      // Navigate to component in Components tab
      if (componentInfo) {
        // Set the component to navigate to
        navigateToComponent(componentInfo.name);

        // Expand panel and switch to Components tab
        expandAndNavigate('components');

        // Copy to clipboard as well
        const text = `${componentInfo.name} (${componentInfo.path})`;
        navigator.clipboard.writeText(text).then(() => {
          // Show feedback briefly
          setTimeout(() => setClickedComponent(null), 2000);
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isComponentIdActive) {
        toggleComponentIdMode();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true); // Use capture phase
    document.addEventListener('keydown', handleKeyDown);

    // Change cursor
    document.body.style.cursor = 'crosshair';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.cursor = '';
    };
  }, [isComponentIdActive, setHoveredComponent, toggleComponentIdMode, navigateToComponent, expandAndNavigate]);

  if (!isComponentIdActive) return null;

  return (
    <>
      {/* Hover Tooltip */}
      {hoveredComponent && tooltipPosition && (
        <div
          className="fixed z-[100] pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 12}px`,
            top: `${tooltipPosition.y + 12}px`,
            maxWidth: '400px',
          }}
        >
          <div className="bg-surface-secondary text-content-inverted border border-edge-primary rounded-sm shadow-[4px_4px_0_0_var(--color-black)] p-3 font-mondwest text-sm">
            <div className="font-joystix text-xs uppercase text-content-inverted font-bold mb-1">
              {hoveredComponent.name}
            </div>
            <div className="text-content-inverted/80 text-xs font-mono">
              {hoveredComponent.path}
            </div>
            {hoveredComponent.theme && (
              <div className="text-content-inverted/70 text-xs mt-1">
                theme: {hoveredComponent.theme}
              </div>
            )}
            <div className="text-content-inverted/60 text-[10px] mt-2">
              Click to copy
            </div>
          </div>
        </div>
      )}

      {/* Click Feedback */}
      {clickedComponent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-surface-secondary text-content-inverted border-2 border-edge-primary rounded-sm shadow-[8px_8px_0_0_var(--color-black)] p-4 font-mondwest">
            <div className="font-joystix text-sm uppercase text-content-inverted font-bold mb-2">
              Copied to Clipboard!
            </div>
            <div className="text-content-inverted/90 text-xs font-mono">
              {clickedComponent.name}
            </div>
            <div className="text-content-inverted/70 text-[10px] mt-1">
              {clickedComponent.path}
            </div>
            {clickedComponent.theme && (
              <div className="text-content-inverted/70 text-[10px] mt-1">
                theme: {clickedComponent.theme}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
