'use client';

import { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { ColorDisplay } from './ColorDisplay';
import { ColorModeSelector } from './ColorModeSelector';
import { BorderRadiusDisplay } from './BorderRadiusDisplay';
import { ShadowDisplay } from './ShadowDisplay';
import { Button } from '@radflow/ui/Button';
import { Divider } from '@radflow/ui/Divider';
import { TokenEditor } from '../../components/TokenEditor';

export function VariablesTab() {
  const { loadFromCSS } = useDevToolsStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    loadFromCSS();
  }, [loadFromCSS]);

  return (
    <>
      <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-surface-primary border border-edge-primary rounded space-y-4">
        <div className="flex items-center justify-between">
          <h2>Design Tokens</h2>
          <div className="flex gap-2">
            <Button variant="primary" size="md" iconName="edit" onClick={() => setIsEditorOpen(true)}>
              Edit Tokens
            </Button>
            <Button variant="outline" size="md" iconName="refresh" onClick={() => loadFromCSS()}>
              Reload
            </Button>
          </div>
        </div>

        <div className="space-y-4" data-edit-scope="theme-variables">
          <ColorModeSelector />
          <Divider />
          <ColorDisplay />
          <Divider />
          <BorderRadiusDisplay />
          <Divider />
          <ShadowDisplay />
        </div>
      </div>

      <TokenEditor open={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
    </>
  );
}
