'use client';

import { Button } from '@radflow/ui';
import { useDevToolsStore } from '../store';
import { BreakpointIndicator } from './BreakpointIndicator';
import { useState, useRef, useEffect } from 'react';

interface TopBarProps {
  title?: string;
  onClose?: () => void;
  onFullscreen?: () => void;
  showCloseButton?: boolean;
  showFullscreenButton?: boolean;
  onSettingsClick?: () => void;
}

/**
 * Top bar component for DevTools panel.
 * Displays active theme name/logo, theme switcher dropdown, and window controls.
 */
export function TopBar({
  title = 'RADTOOLS',
  onClose,
  onFullscreen,
  showCloseButton = true,
  showFullscreenButton = false,
  onSettingsClick,
}: TopBarProps) {
  const { activeTheme, availableThemes, switchTheme } = useDevToolsStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current theme data
  const currentTheme = availableThemes.find((t) => t.id === activeTheme);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const handleThemeSelect = async (themeId: string) => {
    setIsDropdownOpen(false);
    if (themeId !== activeTheme) {
      await switchTheme(themeId);
    }
  };

  return (
    <div
      className="flex items-center justify-between px-3 py-2 border-b border-edge-primary/20 select-none"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface-secondary) 5%, transparent)' }}
    >
      {/* Left: Theme Indicator + Dropdown */}
      <div className="flex items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-surface-secondary/50 transition-colors"
            title="Switch theme"
          >
            {/* Theme Icon/Logo */}
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              iconName="plug"
              className="pointer-events-none"
            />
            {/* Theme Name */}
            <span className="font-joystix text-xs uppercase tracking-wider text-content-primary">
              {currentTheme?.name || 'RadOS'}
            </span>
            {/* Dropdown Arrow */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path
                d="M3 5L6 8L9 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Theme Dropdown */}
          {isDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-64 bg-surface-primary border border-edge-primary rounded-md shadow-lg z-50 overflow-hidden"
              style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
              {availableThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-surface-secondary/50 transition-colors ${
                    theme.id === activeTheme ? 'bg-surface-secondary/30' : ''
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-joystix text-xs text-content-primary">
                      {theme.name}
                    </span>
                    {theme.description && (
                      <span className="text-[10px] text-content-secondary">
                        {theme.description}
                      </span>
                    )}
                  </div>
                  {theme.id === activeTheme && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-content-primary flex-shrink-0"
                    >
                      <path
                        d="M13 4L6 11L3 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}

              {/* Create/Manage Themes Footer */}
              <div className="border-t border-edge-primary mt-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onSettingsClick?.();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-surface-secondary/50 transition-colors flex items-center gap-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    iconName="settings"
                    className="pointer-events-none"
                  />
                  <span className="text-xs text-content-secondary">Manage Themes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Breakpoint Indicator */}
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
            title="Close (⌘⇧K)"
          />
        )}
      </div>
    </div>
  );
}
