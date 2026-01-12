'use client';

import type { Tab } from '../types';
import { ComponentsSecondaryNav } from './ComponentsSecondaryNav';

interface SecondaryNavigationProps {
  activeTab: Tab;
  // Components tab props
  componentSubTab?: string;
  onComponentSubTabChange?: (tab: string) => void;
  componentTabs?: Array<{ id: string; label: string }>;
  onAddComponentFolder?: (folderName: string) => void;
}

export function SecondaryNavigation({
  activeTab,
  componentSubTab,
  onComponentSubTabChange,
  componentTabs,
  onAddComponentFolder,
}: SecondaryNavigationProps) {
  // Only show secondary nav for Components tab
  if (activeTab === 'components') {
    return (
      <ComponentsSecondaryNav
        activeSubTab={componentSubTab || 'core'}
        onSubTabChange={onComponentSubTabChange || (() => {})}
        tabs={componentTabs || []}
        onAddFolder={onAddComponentFolder || (() => {})}
      />
    );
  }

  return null;
}

