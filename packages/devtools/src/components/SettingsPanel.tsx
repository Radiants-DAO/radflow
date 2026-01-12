'use client';

import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@radflow/ui';
import { useDevToolsStore } from '../store';
import type { DockPosition } from '../types';
import { ThemeCreationWizard } from './ThemeCreationWizard';

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
    fetchAvailableThemes,
    dockPosition,
    setDockPosition,
  } = useDevToolsStore();

  const [isWizardOpen, setIsWizardOpen] = useState(false);

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

  const handleWizardComplete = async (config: any) => {
    try {
      // Call API to create theme scaffolding
      const response = await fetch('/api/devtools/themes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create theme');
      }

      const result = await response.json();
      console.log('Theme created successfully:', result);

      // Refresh available themes to include newly created theme
      await fetchAvailableThemes();

      // Close wizard
      setIsWizardOpen(false);

      // Show success message
      alert(`Theme "${config.themeName}" created successfully! You can now switch to it in the theme switcher.`);

      // TODO: Refresh available themes list
      // This will be handled when we implement theme discovery
    } catch (error) {
      console.error('Error creating theme:', error);
      alert(`Failed to create theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
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
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsWizardOpen(true)}
                >
                  Create New Theme
                </Button>
              </div>
              <div className="space-y-2">
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center justify-between p-3 border border-edge-primary/20 rounded-sm bg-surface-secondary/5"
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
                      <p className="font-mondwest text-sm text-content-secondary mt-1">
                        {theme.description}
                      </p>
                    )}
                    <p className="font-mondwest text-xs text-content-tertiary mt-1">
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
              <div className="space-y-1 text-sm font-mondwest text-content-secondary">
                <div className="flex justify-between">
                  <span>Toggle Panel</span>
                  <kbd className="px-2 py-0.5 bg-surface-secondary border border-edge-primary rounded-xs font-mono text-xs">
                    ⌘⇧K
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Switch Tabs</span>
                  <kbd className="px-2 py-0.5 bg-surface-secondary border border-edge-primary rounded-xs font-mono text-xs">
                    1-5
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span>Exit Mode</span>
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

    {/* Theme Creation Wizard */}
    <ThemeCreationWizard
      open={isWizardOpen}
      onClose={() => setIsWizardOpen(false)}
      onComplete={handleWizardComplete}
    />
  </>
  );
}
