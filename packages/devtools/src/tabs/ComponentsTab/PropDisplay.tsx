'use client';

import { ThemeIcon as Icon } from '../../components/ThemeIcon';
import type { DiscoveredComponent } from '../../types';

interface PropDisplayProps {
  component: DiscoveredComponent;
}

export function PropDisplay({ component }: PropDisplayProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-joystix text-sm uppercase text-content-primary">{component.name}</h3>
        <span className="font-mondwest text-base text-content-primary/60 font-mono">{component.path}</span>
      </div>

      {component.props.length > 0 ? (
        <div className="border border-edge-primary rounded-md overflow-hidden">
          <table className="w-full font-mondwest text-base">
            <thead className="bg-surface-tertiary/30">
              <tr>
                <th className="text-left px-3 py-2 text-content-primary/60 font-joystix text-xs uppercase">Prop</th>
                <th className="text-left px-3 py-2 text-content-primary/60 font-joystix text-xs uppercase">Type</th>
                <th className="text-left px-3 py-2 text-content-primary/60 font-joystix text-xs uppercase">Required</th>
                <th className="text-left px-3 py-2 text-content-primary/60 font-joystix text-xs uppercase">Default</th>
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop) => (
                <tr key={prop.name} className="border-t border-edge-primary" style={{ borderTopColor: 'var(--border-edge-primary-20)' }}>
                  <td className="px-3 py-2 font-mono text-content-primary">{prop.name}</td>
                  <td className="px-3 py-2 font-mono text-content-primary/60">{prop.type}</td>
                  <td className="px-3 py-2">
                    {prop.required ? (
                      <Icon name="checkmark-filled" size={14} className="text-content-error" />
                    ) : (
                      <span className="text-content-primary/60">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-content-primary/60">
                    {prop.defaultValue || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-mondwest text-base text-content-primary/60 italic">No props defined for this component</p>
      )}
    </div>
  );
}

