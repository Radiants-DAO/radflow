'use client';

import { useEffect } from 'react';
import { useDevToolsStore } from '../../store';
import { Button, useToast } from '@radflow/ui';

export function ColorModeSelector() {
  const { colorModes, activeColorMode, setActiveColorMode, baseColors } = useDevToolsStore();
  const { addToast } = useToast();

  // Apply color mode to document
  useEffect(() => {
    const html = document.documentElement;
    colorModes.forEach((mode) => html.classList.remove(mode.name));
    if (activeColorMode) {
      const activeMode = colorModes.find((m) => m.id === activeColorMode);
      if (activeMode) html.classList.add(activeMode.name);
    }
  }, [activeColorMode, colorModes]);

  const handleCopyPrompt = () => {
    const colorList = baseColors
      .map((c) => `  --color-${c.name}: ${c.value};`)
      .join('\n');

    const prompt = `Create a new color mode in globals.css.

Add a CSS class selector (e.g., .dark, .light) after the @theme block:

.[mode-name] {
${colorList}
}

Replace [mode-name] with your mode name and update values as needed.`;

    navigator.clipboard.writeText(prompt).then(() => {
      addToast({ title: 'Prompt copied', description: 'Paste to an AI agent to create a color mode', variant: 'success' });
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3>Color Mode</h3>
        <Button variant="outline" size="md" iconName="copy" onClick={handleCopyPrompt}>
          Copy Prompt
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeColorMode === null ? 'primary' : 'ghost'}
          size="md"
          onClick={() => setActiveColorMode(null)}
        >
          Default
        </Button>
        
        {colorModes.map((mode) => (
          <Button
            key={mode.id}
            variant={activeColorMode === mode.id ? 'primary' : 'ghost'}
            size="md"
            onClick={() => setActiveColorMode(mode.id)}
          >
            {mode.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
