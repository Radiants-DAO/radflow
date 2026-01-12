'use client';

import React from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@radflow/ui';
import { useDevToolsStore } from '../store';

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {/* Theme Management Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-joystix text-sm uppercase text-content-primary">
                Theme Management
              </h3>
            </div>
              <div className="space-y-2">
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center justify-between p-3 border border-edge-primary/20 rounded-sm bg-surface-tertiary/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-joystix text-sm text-content-primary">
                        {theme.name}
                      </span>
                      {theme.isActive && (
                        <span className="px-2 py-0.5 text-xs font-joystix uppercase bg-surface-tertiary/50 text-content-primary border border-edge-primary rounded-xs">
                          Active
                        </span>
                      )}
                    </div>
                    {theme.description && (
                      <p className="font-mondwest text-sm text-content-primary mt-1">
                        {theme.description}
                      </p>
                    )}
                    <p className="font-mondwest text-xs text-content-primary mt-1">
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

            {/* Keyboard Shortcuts Reference */}
            <div>
              <label className="block font-mondwest text-sm text-content-primary mb-2">
                Keyboard Shortcuts
              </label>
              <div className="text-sm font-mondwest text-content-primary">
                <div className="flex items-center justify-between py-1 gap-2">
                  <span>Toggle Panel</span>
                  <div className="flex-1 border-t border-edge-primary/20 mx-2" />
                  <kbd className="px-2 py-0.5 bg-surface-secondary border border-edge-primary rounded-xs font-mono text-xs">
                    ⌘⇧K
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-edge-primary/20 gap-2">
                  <span>Focus Search</span>
                  <div className="flex-1 border-t border-edge-primary/20 mx-2" />
                  <kbd className="px-2 py-0.5 bg-surface-secondary border border-edge-primary rounded-xs font-mono text-xs">
                    ⌘K
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-edge-primary/20 gap-2">
                  <span>Switch Tabs</span>
                  <div className="flex-1 border-t border-edge-primary/20 mx-2" />
                  <kbd className="px-2 py-0.5 bg-surface-secondary border border-edge-primary rounded-xs font-mono text-xs">
                    1-6
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-edge-primary/20 gap-2">
                  <span>Toggle Help</span>
                  <div className="flex-1 border-t border-edge-primary/20 mx-2" />
                  <kbd className="px-2 py-0.5 bg-surface-secondary border border-edge-primary rounded-xs font-mono text-xs">
                    ⌘⇧?
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-edge-primary/20 gap-2">
                  <span>Open Settings</span>
                  <div className="flex-1 border-t border-edge-primary/20 mx-2" />
                  <kbd className="px-2 py-0.5 bg-surface-secondary border border-edge-primary rounded-xs font-mono text-xs">
                    ⌘⇧.
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-edge-primary/20 gap-2">
                  <span>Exit Mode</span>
                  <div className="flex-1 border-t border-edge-primary/20 mx-2" />
                  <kbd className="px-2 py-0.5 bg-surface-secondary border border-edge-primary rounded-xs font-mono text-xs">
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
