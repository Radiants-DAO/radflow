'use client';

import { useState, useRef, useEffect } from 'react';
import { Input, Button } from '@radflow/ui';
import type { DiscoveredComponent } from '../../types';

interface ComponentListProps {
  components: DiscoveredComponent[];
  folderName: string;
  activeThemeId?: string; // Optional: Filter components by active theme
}

// Section component matching DesignSystemTab style
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="font-joystix text-xs uppercase text-content-primary mb-3 border-b border-edge-primary/20 pb-2">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

// Props display component matching DesignSystemTab style
function PropsDisplay({ props }: { props: string }) {
  return (
    <code>{props}</code>
  );
}

// Component row display
function ComponentRow({ component, folderName }: { component: DiscoveredComponent; folderName: string }) {
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<NodeJS.Timeout>(undefined);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const handleCopyCursorCommand = () => {
    const propsList = component.props.length > 0
      ? component.props
          .map((prop) => {
            const required = prop.required ? 'required' : 'optional';
            const defaultValue = prop.defaultValue ? `, default: ${prop.defaultValue}` : '';
            return `- ${prop.name}: ${prop.type} (${required}${defaultValue})`;
          })
          .join('\n')
      : 'No props defined';

    const command = `Create a preview section for the ${component.name} component located at ${component.path}.

Props:
${propsList}

Add it to devtools/tabs/ComponentsTab/previews/${folderName}.tsx following the Section/Row/PropsDisplay pattern from DesignSystemTab.tsx.
Include example usage for each variant/prop combination.
If the preview file doesn't exist, create it with the necessary imports.`;

    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  const propsString = component.props.length > 0
    ? component.props
        .map((prop) => {
          const optional = prop.required ? '' : '?';
          const defaultValue = prop.defaultValue ? ` = ${prop.defaultValue}` : '';
          return `${prop.name}${optional}: ${prop.type}${defaultValue}`;
        })
        .join(', ')
    : 'No props';

  return (
    <div className="border border-edge-primary bg-surface-primary -mt-px first:mt-0">
      <div className="overflow-hidden transition-[height] duration-200 ease-out">
        <div className="px-4 pb-4">
          <div className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-joystix text-xs uppercase text-content-primary">{component.name}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={copied ? "checkmark-filled" : undefined}
                  onClick={handleCopyCursorCommand}
                >
                  {copied ? 'Copied' : 'Copy Cursor Command'}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="font-mondwest text-sm text-content-primary/60 font-mono">
                  {component.path}
                </div>
                {component.theme && (
                  <div className="font-mondwest text-xs text-content-primary/50 font-mono">
                    Theme: {component.theme}
                  </div>
                )}
                {component.props.length > 0 && (
                  <PropsDisplay props={propsString} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComponentList({ components, folderName, activeThemeId }: ComponentListProps) {
  const [search, setSearch] = useState('');

  const filtered = components.filter((c) => {
    // Filter by search query
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.path.toLowerCase().includes(search.toLowerCase());

    // Filter by active theme if specified
    // Components with no theme are always shown (local components)
    // Components from @radflow/ui are always shown (shared library)
    const matchesTheme =
      !activeThemeId ||
      !c.themeId ||
      c.themeId === 'ui' ||
      c.themeId === activeThemeId;

    return matchesSearch && matchesTheme;
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search components..."
        fullWidth={true}
        size="md"
        iconName="search"
      />

      {/* Component List */}
      <div className="space-y-0">
        {filtered.length > 0 ? (
          filtered.map((component) => (
            <ComponentRow key={component.path} component={component} folderName={folderName} />
          ))
        ) : (
          <div className="text-center py-8 text-content-primary/60 font-mondwest text-base">
            {search ? `No components match "${search}"` : 'No components found'}
          </div>
        )}
      </div>
    </div>
  );
}

