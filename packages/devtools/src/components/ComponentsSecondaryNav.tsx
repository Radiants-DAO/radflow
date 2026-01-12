'use client';

import { Tabs, TabList, TabTrigger } from '@radflow/ui';
import { AddTabButton } from '../tabs/ComponentsTab/AddTabButton';

interface ComponentsSecondaryNavProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
  onAddFolder: (folderName: string) => void;
}

export function ComponentsSecondaryNav({
  activeSubTab,
  onSubTabChange,
  tabs,
  onAddFolder,
}: ComponentsSecondaryNavProps) {
  return (
    <div className="flex items-center gap-1">
      <Tabs value={activeSubTab} onValueChange={onSubTabChange} variant="manila" className="flex-1">
        <TabList className="flex-1">
          {tabs.map((tab) => (
            <TabTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabTrigger>
          ))}
        </TabList>
      </Tabs>
      <AddTabButton
        onAdd={(folderName) => {
          onAddFolder(folderName);
          // Also trigger via ComponentsTab's handler if available
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((window as any).__componentsTabAddFolder) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__componentsTabAddFolder(folderName);
          }
        }}
      />
    </div>
  );
}

