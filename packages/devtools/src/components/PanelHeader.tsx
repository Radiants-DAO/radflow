'use client';

import { Button } from '@radflow/ui';
import { BreakpointIndicator } from './BreakpointIndicator';

interface PanelHeaderProps {
  title: string;
  onClose?: () => void;
  onFullscreen?: () => void;
  showCloseButton?: boolean;
  showFullscreenButton?: boolean;
  iconName?: string;
}

/**
 * Simple header component for DevTools panel.
 * Includes breakpoint indicator and window controls.
 */
export function PanelHeader({
  title,
  onClose,
  onFullscreen,
  showCloseButton = true,
  showFullscreenButton = false,
  iconName,
}: PanelHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 border-b border-edge-primary/20 select-none"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface-secondary) 5%, transparent)' }}
    >
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          iconName={iconName || 'plug'}
          className="pointer-events-none"
        />
        <span className="font-joystix text-xs uppercase tracking-wider text-content-primary">
          {title}
        </span>
      </div>

      {/* Center: Breakpoint Indicator Dropdown */}
      <BreakpointIndicator />

      {/* Right: Buttons */}
      <div className="flex items-center gap-1">
        {showFullscreenButton && onFullscreen && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            iconName="full-screen"
            onClick={onFullscreen}
            title="Toggle Fullscreen"
          />
        )}
        {showCloseButton && onClose && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            iconName="close"
            onClick={onClose}
            title="Minimize (⌘⇧K)"
          />
        )}
      </div>
    </div>
  );
}
