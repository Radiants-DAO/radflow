'use client';

import type { DiscoveredComponent } from '../../types';

interface PropDisplayProps {
  component: DiscoveredComponent;
}

export function PropDisplay({ component }: PropDisplayProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-heading">{component.name}</h3>
        <span className="text-xs text-caption font-mono">{component.path}</span>
      </div>

      {component.props.length > 0 ? (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-panel-hover">
              <tr>
                <th className="text-left px-3 py-2 text-caption font-medium">Prop</th>
                <th className="text-left px-3 py-2 text-caption font-medium">Type</th>
                <th className="text-left px-3 py-2 text-caption font-medium">Required</th>
                <th className="text-left px-3 py-2 text-caption font-medium">Default</th>
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop) => (
                <tr key={prop.name} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-body">{prop.name}</td>
                  <td className="px-3 py-2 font-mono text-caption">{prop.type}</td>
                  <td className="px-3 py-2">
                    {prop.required ? (
                      <span className="text-error">✓</span>
                    ) : (
                      <span className="text-caption">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-caption">
                    {prop.defaultValue || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-xs text-caption italic">No props defined for this component</p>
      )}
    </div>
  );
}

