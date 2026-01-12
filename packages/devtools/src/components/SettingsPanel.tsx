'use client';

import React from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@radflow/ui';
import { useDevToolsStore } from '../store';
import type { DockPosition } from '../types';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const {
    activeTheme,
    availableThemes,
    switchTheme,
    deleteTheme,
    dockPosition,
    setDockPosition,
  } = useDevToolsStore();

  const handleThemeSwitch = async (themeId: string) => {
    if (themeId === activeTheme) return;
    await switchTheme(themeId);
  };

  const handleThemeDelete = (themeId: string) => {
    if (confirm(`Are you sure you want to delete the "${themeId}" theme? This action cannot be undone.`)) {
      deleteTheme(themeId);
    }
  };

  const handleDockPositionChange = (position: DockPosition) => {
    setDockPosition(position);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {/* Theme Management Section */}
          <section>
            <h3 className="font-joystix text-sm uppercase text-content-primary mb-3">
              Theme Management
            </h3>
            <div className="space-y-2">
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center justify-between p-3 border border-edge-primary/20 rounded bg-surface-secondary/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-joystix text-sm text-content-primary">
                        {theme.name}
                      </span>
                      {theme.isActive && (
                        <span className="px-2 py-0.5 text-xs font-joystix uppercase bg-accent-primary/20 text-accent-primary border border-accent-primary/30 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    {theme.description && (
                      <p className="font-mondwest text-sm text-content-primary/70 mt-1">
                        {theme.description}
                      </p>
                    )}
                    <p className="font-mondwest text-xs text-content-primary/50 mt-1">
                      {theme.packageName} {theme.version && `v${theme.version}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!theme.isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleThemeSwitch(theme.id)}
                      >
                        Switch
                      </Button>
                    )}
                    {theme.id !== 'rad-os' && !theme.isActive && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleThemeDelete(theme.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DevTools Settings Section */}
          <section>
            <h3 className="font-joystix text-sm uppercase text-content-primary mb-3">
              DevTools Settings
            </h3>

            {/* Panel Position */}
            <div className="mb-4">
              <label className="block font-mondwest text-sm text-content-primary mb-2">
                Panel Position
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={dockPosition === 'right' ? 'secondary' : 'outline'}
                  onClick={() => handleDockPositionChange('right')}
                >
                  Right
                </Button>
                <Button
                  size="sm"
                  variant={dockPosition === 'left' ? 'secondary' : 'outline'}
                  onClick={() => handleDockPositionChange('left')}
                >
                  Left
                </Button>
                <Button
                  size="sm"
                  variant={dockPosition === 'undocked' ? 'secondary' : 'outline'}
                  onClick={() => handleDockPositionChange('undocked')}
                >
                  Undocked
                </Button>
              </div>
            </div>

            {/* Keyboard Shortcuts Reference */}
            <div>
              <label className="block font-mondwest text-sm text-content-primary mb-2">
                Keyboard Shortcuts
              </label>
              <div className="space-y-1 text-sm font-mondwest text-content-primary/70">
                <div className="flex justify-between">
                  <span>Toggle Panel</span>
                  <kbd className="px-2 py-0.5 bg-surface-secondary/20 border border-edge-primary/20 rounded font-mono text-xs">
                    ⌘⇧K
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Switch Tabs</span>
                  <kbd className="px-2 py-0.5 bg-surface-secondary/20 border border-edge-primary/20 rounded font-mono text-xs">
                    1-5
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Exit Mode</span>
                  <kbd className="px-2 py-0.5 bg-surface-secondary/20 border border-edge-primary/20 rounded font-mono text-xs">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>
          </section>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
