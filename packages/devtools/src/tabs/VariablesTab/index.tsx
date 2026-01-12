'use client';

import { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { ColorDisplay } from './ColorDisplay';
import { ColorModeSelector } from './ColorModeSelector';
import { BorderRadiusDisplay } from './BorderRadiusDisplay';
import { ShadowDisplay } from './ShadowDisplay';
import { LivePreview } from './LivePreview';
import { Button } from '@radflow/ui/Button';
import { Divider } from '@radflow/ui/Divider';
import { useToast } from '@radflow/ui/Toast';

// Color type for added colors
export interface AddedColor {
  name: string;
  displayName: string;
  value: string;
  category: 'brand' | 'neutral';
}

// Types for pending changes across all token types
export interface PendingChanges {
  semanticMappings: Map<string, string>; // tokenId -> baseColorName
  colorValues: Map<string, string>; // colorName -> hex value
  colorDisplayNames: Map<string, string>; // colorName -> display name
  radiusValues: Map<string, string>; // radiusKey -> value
  shadowValues: Map<string, string>; // shadowName -> value
  addedColors: AddedColor[]; // newly added colors
  removedColors: Set<string>; // color names marked for removal
}

export function VariablesTab() {
  const { loadFromCSS, activeTheme } = useDevToolsStore();
  const { addToast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Unified pending changes state
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({
    semanticMappings: new Map(),
    colorValues: new Map(),
    colorDisplayNames: new Map(),
    radiusValues: new Map(),
    shadowValues: new Map(),
    addedColors: [],
    removedColors: new Set(),
  });

  useEffect(() => {
    loadFromCSS();
  }, [loadFromCSS]);

  // Count total pending changes
  const totalChanges =
    pendingChanges.semanticMappings.size +
    pendingChanges.colorValues.size +
    pendingChanges.colorDisplayNames.size +
    pendingChanges.radiusValues.size +
    pendingChanges.shadowValues.size +
    pendingChanges.addedColors.length +
    pendingChanges.removedColors.size;

  // Update handlers for each change type
  const updateSemanticMapping = (tokenId: string, baseColorName: string | null) => {
    setPendingChanges((prev) => {
      const newMappings = new Map(prev.semanticMappings);
      if (baseColorName === null) {
        newMappings.delete(tokenId);
      } else {
        newMappings.set(tokenId, baseColorName);
      }
      return { ...prev, semanticMappings: newMappings };
    });
  };

  const updateColorValue = (colorName: string, value: string | null) => {
    setPendingChanges((prev) => {
      const newValues = new Map(prev.colorValues);
      if (value === null) {
        newValues.delete(colorName);
      } else {
        newValues.set(colorName, value);
      }
      return { ...prev, colorValues: newValues };
    });
  };

  const updateColorDisplayName = (colorName: string, displayName: string | null) => {
    setPendingChanges((prev) => {
      const newNames = new Map(prev.colorDisplayNames);
      if (displayName === null) {
        newNames.delete(colorName);
      } else {
        newNames.set(colorName, displayName);
      }
      return { ...prev, colorDisplayNames: newNames };
    });
  };

  const updateRadiusValue = (key: string, value: string | null) => {
    setPendingChanges((prev) => {
      const newValues = new Map(prev.radiusValues);
      if (value === null) {
        newValues.delete(key);
      } else {
        newValues.set(key, value);
      }
      return { ...prev, radiusValues: newValues };
    });
  };

  const updateShadowValue = (name: string, value: string | null) => {
    setPendingChanges((prev) => {
      const newValues = new Map(prev.shadowValues);
      if (value === null) {
        newValues.delete(name);
      } else {
        newValues.set(name, value);
      }
      return { ...prev, shadowValues: newValues };
    });
  };

  const addColor = (color: AddedColor) => {
    setPendingChanges((prev) => ({
      ...prev,
      addedColors: [...prev.addedColors, color],
    }));
  };

  const removeColor = (colorName: string) => {
    setPendingChanges((prev) => {
      // If it's a newly added color, just remove it from addedColors
      const addedIndex = prev.addedColors.findIndex((c) => c.name === colorName);
      if (addedIndex >= 0) {
        const newAddedColors = [...prev.addedColors];
        newAddedColors.splice(addedIndex, 1);
        return { ...prev, addedColors: newAddedColors };
      }
      // Otherwise, mark existing color for removal
      const newRemovedColors = new Set(prev.removedColors);
      newRemovedColors.add(colorName);
      return { ...prev, removedColors: newRemovedColors };
    });
  };

  const undoRemoveColor = (colorName: string) => {
    setPendingChanges((prev) => {
      const newRemovedColors = new Set(prev.removedColors);
      newRemovedColors.delete(colorName);
      return { ...prev, removedColors: newRemovedColors };
    });
  };

  const handleResetAll = () => {
    setPendingChanges({
      semanticMappings: new Map(),
      colorValues: new Map(),
      colorDisplayNames: new Map(),
      radiusValues: new Map(),
      shadowValues: new Map(),
      addedColors: [],
      removedColors: new Set(),
    });
    addToast({
      title: 'Changes reset',
      description: 'All pending changes have been discarded',
      variant: 'success',
    });
  };

  const handleSaveAll = async () => {
    if (totalChanges === 0) return;

    setIsSaving(true);
    try {
      // Save semantic mappings if any
      if (pendingChanges.semanticMappings.size > 0) {
        const response = await fetch(`/api/devtools/themes/${activeTheme}/write-semantic-mappings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mappings: Object.fromEntries(pendingChanges.semanticMappings),
          }),
        });
        if (!response.ok) throw new Error('Failed to save semantic mappings');
      }

      // Save color, radius, and shadow values if any
      if (
        pendingChanges.colorValues.size > 0 ||
        pendingChanges.colorDisplayNames.size > 0 ||
        pendingChanges.radiusValues.size > 0 ||
        pendingChanges.shadowValues.size > 0 ||
        pendingChanges.addedColors.length > 0 ||
        pendingChanges.removedColors.size > 0
      ) {
        const response = await fetch(`/api/devtools/themes/${activeTheme}/write-token-values`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            colors: Object.fromEntries(pendingChanges.colorValues),
            colorDisplayNames: Object.fromEntries(pendingChanges.colorDisplayNames),
            radius: Object.fromEntries(pendingChanges.radiusValues),
            shadows: Object.fromEntries(pendingChanges.shadowValues),
            addColors: pendingChanges.addedColors.map((c) => ({ name: c.name, value: c.value })),
            removeColors: Array.from(pendingChanges.removedColors),
          }),
        });
        if (!response.ok) throw new Error('Failed to save token values');
      }

      // Reset pending changes and reload
      setPendingChanges({
        semanticMappings: new Map(),
        colorValues: new Map(),
        colorDisplayNames: new Map(),
        radiusValues: new Map(),
        shadowValues: new Map(),
        addedColors: [],
        removedColors: new Set(),
      });

      await loadFromCSS();

      addToast({
        title: 'Changes saved',
        description: `${totalChanges} ${totalChanges === 1 ? 'change' : 'changes'} applied to globals.css`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to save changes:', error);
      addToast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-surface-elevated border border-edge-primary rounded space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2>Design Tokens</h2>
        <div className="flex gap-2">
          <Button
            variant={isPreviewOpen ? 'primary' : 'outline'}
            size="md"
            iconName="eye"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          >
            Preview
          </Button>
          <Button variant="outline" size="md" iconName="refresh" onClick={() => loadFromCSS()}>
            Reload
          </Button>
        </div>
      </div>

      {/* Pending changes bar */}
      {totalChanges > 0 && (
        <div className="flex items-center justify-between p-2 bg-surface-tertiary/30 border border-edge-focus/50 rounded-sm">
          <span className="text-sm text-content-primary font-mondwest">
            {totalChanges} {totalChanges === 1 ? 'change' : 'changes'} pending
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleResetAll} disabled={isSaving}>
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveAll} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Apply Changes'}
            </Button>
          </div>
        </div>
      )}

      {/* Live preview drawer */}
      <LivePreview
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pendingChanges={pendingChanges}
      />

      {/* Token sections */}
      <div className="space-y-4" data-edit-scope="theme-variables">
        <ColorModeSelector />
        <Divider />
        <ColorDisplay
          pendingSemanticMappings={pendingChanges.semanticMappings}
          pendingColorValues={pendingChanges.colorValues}
          pendingDisplayNames={pendingChanges.colorDisplayNames}
          addedColors={pendingChanges.addedColors}
          removedColors={pendingChanges.removedColors}
          onSemanticMappingChange={updateSemanticMapping}
          onColorValueChange={updateColorValue}
          onDisplayNameChange={updateColorDisplayName}
          onAddColor={addColor}
          onRemoveColor={removeColor}
          onUndoRemoveColor={undoRemoveColor}
        />
        <Divider />
        <BorderRadiusDisplay
          pendingValues={pendingChanges.radiusValues}
          onValueChange={updateRadiusValue}
        />
        <Divider />
        <ShadowDisplay
          pendingValues={pendingChanges.shadowValues}
          onValueChange={updateShadowValue}
        />
      </div>

      <p className="text-sm text-content-primary/60 font-mondwest">
        Click values to edit inline. Drag semantic tokens to remap.
      </p>
    </div>
  );
}
