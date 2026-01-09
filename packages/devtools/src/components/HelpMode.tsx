'use client';

import { useEffect } from 'react';
import { useDevToolsStore } from '../store';
import { helpRegistry } from '../lib/helpRegistry';

export function HelpMode() {
  const { 
    isHelpActive, 
    hoveredHelpId, 
    tooltipPosition,
    setHoveredHelp,
    toggleHelpMode,
  } = useDevToolsStore();

  useEffect(() => {
    if (!isHelpActive) {
      setHoveredHelp(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Traverse up the DOM tree to find data-help-id
      let element: HTMLElement | null = target;
      let helpId: string | null = null;

      while (element && element !== document.body) {
        if (element.hasAttribute('data-help-id')) {
          helpId = element.getAttribute('data-help-id');
          break;
        }
        element = element.parentElement;
      }

      // Ignore RadTools panel elements
      if (element?.closest('[data-radtools-panel]')) {
        setHoveredHelp(null);
        return;
      }

      if (helpId && helpRegistry[helpId]) {
        setHoveredHelp(helpId, { x: e.clientX, y: e.clientY });
      } else {
        setHoveredHelp(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isHelpActive) {
        toggleHelpMode();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHelpActive, setHoveredHelp, toggleHelpMode]);

  if (!isHelpActive || !hoveredHelpId || !tooltipPosition) return null;

  const helpItem = helpRegistry[hoveredHelpId];
  if (!helpItem) return null;

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: `${tooltipPosition.x + 12}px`,
        top: `${tooltipPosition.y + 12}px`,
        maxWidth: '320px',
      }}
    >
      <div className="bg-surface-secondary text-cream border border-edge-primary rounded-sm shadow-[4px_4px_0_0_var(--color-black)] p-3 font-mondwest text-sm">
        {/* Title */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-joystix text-xs uppercase text-cream font-bold">
            {helpItem.title}
          </h3>
          {helpItem.shortcut && (
            <span className="text-[10px] text-cream/60 font-mono">
              {helpItem.shortcut}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-cream/90 mb-2 leading-relaxed">
          {helpItem.description}
        </p>

        {/* Tips */}
        {helpItem.tips && helpItem.tips.length > 0 && (
          <ul className="list-disc list-inside space-y-1 text-cream/80 text-xs">
            {helpItem.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
