'use client';

import { useDevToolsStore } from '../../store';
import { Button } from '@radflow/ui';

export function MockStatesTab() {
  const { mockStates, toggleMockState } = useDevToolsStore();

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-surface-elevated border border-edge-primary rounded space-y-4">
      <h2 className="font-joystix text-sm uppercase text-content-primary">Mock States</h2>
      <p className="font-mondwest text-base text-content-primary/60">
        Use <code>useMockState(&apos;wallet&apos;)</code> in your components.
      </p>
      <div className="grid grid-cols-1 gap-2">
        {mockStates.map((state) => (
          <Button
            key={state.id}
            variant={state.active ? 'primary' : 'outline'}
            fullWidth
            onClick={() => toggleMockState(state.id)}
          >
            {state.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
