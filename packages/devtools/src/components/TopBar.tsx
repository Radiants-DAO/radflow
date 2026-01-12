'use client';

import { useState } from 'react';
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@radflow/ui';
import { useDevToolsStore } from '../store';
import { BreakpointIndicator } from './BreakpointIndicator';

interface TopBarProps {
  onSettingsClick?: () => void;
}

/**
 * Top bar component for DevTools panel.
 * Displays active theme name/logo, theme switcher dropdown, and window controls.
 */
export function TopBar({
  onSettingsClick,
}: TopBarProps) {
  const {
    activeTheme,
    availableThemes,
    switchTheme,
  } = useDevToolsStore();

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  // Get current theme data
  const currentTheme = availableThemes.find((t) => t.id === activeTheme);

  const handleThemeSelect = async (themeId: string) => {
    if (themeId !== activeTheme) {
      await switchTheme(themeId);
    }
  };


  return (
    <div
      className="flex items-center justify-between select-none w-full bg-surface-elevated border border-edge-primary rounded-sm h-fit overflow-hidden"
    >
      {/* Left: Theme Indicator + Dropdown */}
      <div className="flex items-center gap-2">
        <DropdownMenu 
          position="bottom-start"
          open={isThemeDropdownOpen}
          onOpenChange={setIsThemeDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant={isThemeDropdownOpen ? "secondary" : "ghost"}
              size="sm"
              iconName="plug"
              title="Switch theme"
              className={`!rounded-none gap-2 ${isThemeDropdownOpen ? 'text-content-inverted' : ''}`}
            >
              {/* Theme Name */}
              <span className={`font-joystix text-xs uppercase tracking-wider ${isThemeDropdownOpen ? 'text-content-inverted' : 'text-content-primary'}`}>
                {currentTheme?.name || 'RadOS'}
              </span>
              {/* Dropdown Arrow */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 5L6 8L9 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-h-[300px]">
            {availableThemes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`flex items-center justify-between px-0 py-0 ${
                  theme.id === activeTheme ? 'bg-surface-tertiary' : ''
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-joystix text-xs text-content-primary">
                    {theme.name}
                  </span>
                  {theme.description && (
                    <span className="text-sm text-black">
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
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onSettingsClick?.()}
              iconName="settings"
            >
              <span className="text-xs">Manage Themes</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right: Breakpoint Indicator */}
      <BreakpointIndicator />
    </div>
  );
}
